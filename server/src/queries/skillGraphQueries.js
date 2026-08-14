/**
 * SkillGraph Cypher Query Layer
 *
 * Contains all parameterized Neo4j Cypher queries for graph traversals.
 * Queries use Cypher parameters ($paramName) for safe parameter passing.
 *
 * These queries are designed to be executed by the service layer via:
 * session.run(query, parameters)
 */

/**
 * ============================================================
 * QUERY 1: GET ALL ROLES
 * ============================================================
 *
 * Returns all roles with basic information.
 */
const getAllRolesQuery = `
  MATCH (r:Role)

  RETURN
    r.name AS name,
    r.description AS description,
    r.category AS category

  ORDER BY r.name
`;

/**
 * ============================================================
 * QUERY 2: ROLE → SKILLS
 * ============================================================
 *
 * Finds all skills required by a specific role.
 *
 * Parameter:
 * $roleName
 */
const getRoleSkillsQuery = `
  MATCH (r:Role)-[:REQUIRES]->(s:Skill)

  WHERE r.name = $roleName

  RETURN
    s.name AS skillName,
    s.category AS category,
    s.difficulty AS difficulty

  ORDER BY s.category, s.name
`;

/**
 * ============================================================
 * QUERY 3: ROLE → SKILL → TECHNOLOGY
 * ============================================================
 *
 * Traverses:
 *
 * Role
 *   ↓ REQUIRES
 * Skill
 *   ↓ USES
 * Technology
 */
const getRoleTechnologiesQuery = `
  MATCH (r:Role)-[:REQUIRES]->(s:Skill)-[:USES]->(t:Technology)

  WHERE r.name = $roleName

  RETURN DISTINCT
    s.name AS skillName,
    t.name AS technologyName,
    t.category AS technologyCategory

  ORDER BY s.name, t.name
`;

/**
 * ============================================================
 * QUERY 4: ROLE → SKILL → PROJECT
 * ============================================================
 *
 * Finds projects that demonstrate skills required by a role.
 *
 * Graph:
 *
 * Role
 *   ↓ REQUIRES
 * Skill
 *   ↑ DEMONSTRATES
 * Project
 */
const getRoleProjectsQuery = `
  MATCH (r:Role)-[:REQUIRES]->(s:Skill)<-[:DEMONSTRATES]-(p:Project)

  WHERE r.name = $roleName

  RETURN DISTINCT
    p.name AS projectName,
    p.description AS description,
    p.difficulty AS difficulty,
    s.name AS matchingSkill

  ORDER BY p.difficulty, p.name
`;

/**
 * ============================================================
 * QUERY 5: RELATED ROLES THROUGH SHARED SKILLS
 * ============================================================
 *
 * Finds other roles that share required skills with the
 * selected role.
 *
 * Graph:
 *
 * Role
 *   ↓ REQUIRES
 * Skill
 *   ↑ REQUIRES
 * Role
 */
const getRelatedRolesQuery = `
  MATCH (targetRole:Role)-[:REQUIRES]->(skill:Skill)<-[:REQUIRES]-(relatedRole:Role)

  WHERE
    targetRole.name = $roleName
    AND relatedRole.name <> targetRole.name

  WITH
    relatedRole,
    COUNT(DISTINCT skill) AS sharedSkillCount,
    COLLECT(DISTINCT skill.name) AS sharedSkillNames

  RETURN
    relatedRole.name AS relatedRoleName,
    relatedRole.description AS relatedRoleDescription,
    relatedRole.category AS relatedRoleCategory,
    sharedSkillCount,

    REDUCE(
      acc = "",
      skill IN sharedSkillNames |

      CASE
        WHEN acc = ""
        THEN skill
        ELSE acc + ", " + skill
      END
    ) AS sharedSkills

  ORDER BY
    sharedSkillCount DESC,
    relatedRoleName ASC
`;

/**
 * ============================================================
 * QUERY 6: SKILL → LEARNING RESOURCES
 * ============================================================
 *
 * Finds all learning resources for a specific skill.
 */
const getSkillResourcesQuery = `
  MATCH (s:Skill)-[:LEARNED_THROUGH]->(lr:LearningResource)

  WHERE s.name = $skillName

  RETURN
    lr.title AS title,
    lr.url AS url,
    lr.type AS type

  ORDER BY lr.type, lr.title
`;

/**
 * ============================================================
 * QUERY 7: GET ALL TECHNOLOGIES
 * ============================================================
 *
 * Retrieves every Technology node from CognoDB.
 *
 * Returns:
 * - name
 * - category
 */
const getAllTechnologiesQuery = `
  MATCH (t:Technology)

  RETURN
    t.name AS name,
    t.category AS category

  ORDER BY
    t.category,
    t.name
`;

/**
 * ============================================================
 * QUERY 8: GET ALL PROJECTS
 * ============================================================
 *
 * Retrieves all Project nodes together with the technologies
 * connected through BUILT_WITH relationships.
 *
 * Graph:
 *
 * Project
 *    |
 *    └── [:BUILT_WITH] ──> Technology
 *
 * Example result:
 *
 * {
 *   name: "E-commerce Platform",
 *   description: "Full-stack online shopping application",
 *   difficulty: "Advanced",
 *   technologies: [
 *     "Docker",
 *     "Node.js",
 *     "PostgreSQL",
 *     "React"
 *   ]
 * }
 *
 * Duration is intentionally NOT returned here because the
 * current Project nodes do not contain a duration property.
 */
const getAllProjectsQuery = `
  MATCH (p:Project)

  OPTIONAL MATCH (p)-[:BUILT_WITH]->(t:Technology)

  WITH
    p,
    COLLECT(
      DISTINCT t.name
    ) AS technologies

  RETURN
    p.name AS name,
    p.description AS description,
    p.difficulty AS difficulty,
    technologies

  ORDER BY p.name
`;

/**
 * ============================================================
 * QUERY 9: GET GRAPH DATA
 * ============================================================
 *
 * Returns the complete graph for Graph Explorer.
 *
 * Node information:
 *
 * Skill:
 * - id
 * - label
 * - type
 * - category
 * - difficulty
 *
 * Project:
 * - id
 * - label
 * - type
 * - description
 * - difficulty
 * - duration
 *
 * Role:
 * - id
 * - label
 * - type
 * - description
 * - category
 *
 * Technology:
 * - id
 * - label
 * - type
 * - category
 * - description
 */
const getGraphDataQuery = `
  MATCH (n)

  OPTIONAL MATCH (n)-[r]->(m)

  WITH
    [
      node IN COLLECT(
        DISTINCT {

          id: elementId(n),

          label: COALESCE(
            n.name,
            n.title
          ),

          type: HEAD(
            labels(n)
          ),

          category:
            CASE

              WHEN 'Skill' IN labels(n)
              THEN n.category

              WHEN 'Role' IN labels(n)
              THEN n.category

              WHEN 'Technology' IN labels(n)
              THEN n.category

              ELSE null

            END,

          difficulty:
            CASE

              WHEN 'Skill' IN labels(n)
              THEN n.difficulty

              WHEN 'Project' IN labels(n)
              THEN n.difficulty

              ELSE null

            END,

          description:
            CASE

              WHEN 'Project' IN labels(n)
              THEN n.description

              WHEN 'Role' IN labels(n)
              THEN n.description

              WHEN 'Technology' IN labels(n)
              THEN n.description

              ELSE null

            END,

          duration:
            CASE

              WHEN 'Project' IN labels(n)
              THEN n.duration

              ELSE null

            END
        }
      )

      WHERE node.id IS NOT NULL

    ] AS nodes,

    [
      rel IN COLLECT(
        DISTINCT {

          source:
            CASE

              WHEN r IS NOT NULL
              THEN elementId(
                startNode(r)
              )

              ELSE null

            END,

          target:
            CASE

              WHEN r IS NOT NULL
              THEN elementId(
                endNode(r)
              )

              ELSE null

            END,

          type:
            CASE

              WHEN r IS NOT NULL
              THEN type(r)

              ELSE null

            END
        }
      )

      WHERE
        rel.source IS NOT NULL
        AND rel.target IS NOT NULL
        AND rel.type IS NOT NULL

    ] AS relationships

  RETURN
    nodes,
    relationships
`;

/**
 * ============================================================
 * EXPORT ALL QUERIES
 * ============================================================
 */

module.exports = {
  getAllRolesQuery,
  getRoleSkillsQuery,
  getRoleTechnologiesQuery,
  getRoleProjectsQuery,
  getRelatedRolesQuery,
  getSkillResourcesQuery,
  getAllTechnologiesQuery,
  getAllProjectsQuery,
  getGraphDataQuery,
};