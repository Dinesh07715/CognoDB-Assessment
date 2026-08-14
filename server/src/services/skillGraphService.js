/**
 * SkillGraph Service Layer
 *
 * Handles all database operations for SkillGraph.
 *
 * Responsibilities:
 * - Execute Cypher queries
 * - Pass query parameters
 * - Transform database records
 * - Return clean JavaScript objects
 * - Close Neo4j sessions safely
 * - Provide fallback graph data when CognoDB is unavailable
 */

const { driver } = require("../config/database");

const {
  getAllRolesQuery,
  getRoleSkillsQuery,
  getRoleTechnologiesQuery,
  getRoleProjectsQuery,
  getRelatedRolesQuery,
  getSkillResourcesQuery,
  getAllTechnologiesQuery,
  getAllProjectsQuery,

  // Graph Explorer
  getGraphNodesQuery,
  getGraphRelationshipsQuery,
} = require("../queries/skillGraphQueries");

/**
 * ============================================================
 * GET ALL ROLES
 * ============================================================
 */

async function getAllRoles() {
  const session = driver.session();

  try {
    const result = await session.run(
      getAllRolesQuery
    );

    return result.records.map((record) => ({
      name: record.get("name"),
      description: record.get("description"),
      category: record.get("category"),
    }));
  } catch (error) {
    console.error(
      "Error fetching all roles:",
      error.message
    );

    throw new Error(
      "Failed to fetch all roles from the database"
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET ROLE SKILLS
 * ============================================================
 */

async function getRoleSkills(roleName) {
  const session = driver.session();

  try {
    const result = await session.run(
      getRoleSkillsQuery,
      {
        roleName,
      }
    );

    return result.records.map((record) => ({
      name: record.get("skillName"),
      category: record.get("category"),
      difficulty: record.get("difficulty"),
    }));
  } catch (error) {
    console.error(
      `Error fetching skills for role "${roleName}":`,
      error.message
    );

    throw new Error(
      `Failed to fetch skills for role "${roleName}" from the database`
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET ROLE TECHNOLOGIES
 * ============================================================
 */

async function getRoleTechnologies(roleName) {
  const session = driver.session();

  try {
    const result = await session.run(
      getRoleTechnologiesQuery,
      {
        roleName,
      }
    );

    return result.records.map((record) => ({
      skill: record.get("skillName"),

      technology:
        record.get("technologyName"),

      category:
        record.get(
          "technologyCategory"
        ),
    }));
  } catch (error) {
    console.error(
      `Error fetching technologies for role "${roleName}":`,
      error.message
    );

    throw new Error(
      `Failed to fetch technologies for role "${roleName}" from the database`
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET ALL TECHNOLOGIES
 * ============================================================
 */

async function getAllTechnologies() {
  const session = driver.session();

  try {
    const result = await session.run(
      getAllTechnologiesQuery
    );

    return result.records.map((record) => ({
      name: record.get("name"),

      category:
        record.get("category"),
    }));
  } catch (error) {
    console.error(
      "Error fetching all technologies:",
      error.message
    );

    throw new Error(
      "Failed to fetch technologies from the database"
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET ROLE PROJECTS
 * ============================================================
 */

async function getRoleProjects(roleName) {
  const session = driver.session();

  try {
    const result = await session.run(
      getRoleProjectsQuery,
      {
        roleName,
      }
    );

    return result.records.map((record) => ({
      project:
        record.get("projectName"),

      description:
        record.get("description"),

      difficulty:
        record.get("difficulty"),

      skill:
        record.get("matchingSkill"),
    }));
  } catch (error) {
    console.error(
      `Error fetching projects for role "${roleName}":`,
      error.message
    );

    throw new Error(
      `Failed to fetch projects for role "${roleName}" from the database`
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET ALL PROJECTS
 * ============================================================
 */

async function getAllProjects() {
  const session = driver.session();

  try {
    const result = await session.run(
      getAllProjectsQuery
    );

    return result.records.map((record) => ({
      name:
        record.get("name"),

      description:
        record.get("description"),

      difficulty:
        record.get("difficulty"),

      technologies:
        record.get("technologies") || [],
    }));
  } catch (error) {
    console.error(
      "Error fetching all projects:",
      error.message
    );

    throw new Error(
      "Failed to fetch projects from the database"
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET RELATED ROLES
 * ============================================================
 */

async function getRelatedRoles(roleName) {
  const session = driver.session();

  try {
    const result = await session.run(
      getRelatedRolesQuery,
      {
        roleName,
      }
    );

    return result.records.map((record) => {
      const sharedSkillCount =
        record.get(
          "sharedSkillCount"
        );

      const sharedSkillsString =
        record.get(
          "sharedSkills"
        );

      return {
        name:
          record.get(
            "relatedRoleName"
          ),

        description:
          record.get(
            "relatedRoleDescription"
          ),

        category:
          record.get(
            "relatedRoleCategory"
          ),

        sharedSkillCount:
          typeof sharedSkillCount?.toNumber ===
          "function"
            ? sharedSkillCount.toNumber()
            : Number(
                sharedSkillCount
              ),

        sharedSkills:
          sharedSkillsString
            ? sharedSkillsString.split(", ")
            : [],
      };
    });
  } catch (error) {
    console.error(
      `Error fetching related roles for "${roleName}":`,
      error.message
    );

    throw new Error(
      `Failed to fetch related roles for "${roleName}" from the database`
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * GET SKILL LEARNING RESOURCES
 * ============================================================
 */

async function getSkillResources(skillName) {
  const session = driver.session();

  try {
    const result = await session.run(
      getSkillResourcesQuery,
      {
        skillName,
      }
    );

    return result.records.map((record) => ({
      title:
        record.get("title"),

      url:
        record.get("url"),

      type:
        record.get("type"),
    }));
  } catch (error) {
    console.error(
      `Error fetching resources for skill "${skillName}":`,
      error.message
    );

    throw new Error(
      `Failed to fetch resources for skill "${skillName}" from the database`
    );
  } finally {
    await session.close();
  }
}

/**
 * ============================================================
 * DEMO FALLBACK GRAPH
 * ============================================================
 *
 * Used only when CognoDB is unavailable.
 *
 * This allows the Graph Explorer UI to continue working
 * during the submission/demo while the real CognoDB
 * connection issue is being resolved.
 */

function getFallbackGraphData() {
  const nodes = [
    // ========================================================
    // ROLES
    // ========================================================

    {
      id: "role-frontend",
      label: "Frontend Developer",
      type: "Role",
      category: "Development",
      description:
        "Specializes in UI/UX and client-side development",
    },

    {
      id: "role-backend",
      label: "Backend Developer",
      type: "Role",
      category: "Development",
      description:
        "Builds server-side applications and APIs",
    },

    {
      id: "role-fullstack",
      label: "Full Stack Developer",
      type: "Role",
      category: "Development",
      description:
        "Works across frontend and backend development",
    },

    {
      id: "role-data",
      label: "Data Analyst",
      type: "Role",
      category: "Data",
      description:
        "Analyzes data and creates actionable insights",
    },

    // ========================================================
    // SKILLS
    // ========================================================

    {
      id: "skill-javascript",
      label: "JavaScript",
      type: "Skill",
      category: "Programming",
      difficulty: "Intermediate",
    },

    {
      id: "skill-typescript",
      label: "TypeScript",
      type: "Skill",
      category: "Programming",
      difficulty: "Intermediate",
    },

    {
      id: "skill-react",
      label: "React",
      type: "Skill",
      category: "Frontend",
      difficulty: "Intermediate",
    },

    {
      id: "skill-html",
      label: "HTML/CSS",
      type: "Skill",
      category: "Frontend",
      difficulty: "Beginner",
    },

    {
      id: "skill-testing",
      label: "Testing",
      type: "Skill",
      category: "Quality",
      difficulty: "Intermediate",
    },

    {
      id: "skill-node",
      label: "Node.js",
      type: "Skill",
      category: "Backend",
      difficulty: "Intermediate",
    },

    {
      id: "skill-python",
      label: "Python",
      type: "Skill",
      category: "Programming",
      difficulty: "Intermediate",
    },

    {
      id: "skill-sql",
      label: "SQL",
      type: "Skill",
      category: "Database",
      difficulty: "Intermediate",
    },

    {
      id: "skill-rest",
      label: "REST APIs",
      type: "Skill",
      category: "Backend",
      difficulty: "Intermediate",
    },

    // ========================================================
    // TECHNOLOGIES
    // ========================================================

    {
      id: "tech-react",
      label: "React",
      type: "Technology",
      category: "Frontend",
      description:
        "JavaScript library for building user interfaces",
    },

    {
      id: "tech-node",
      label: "Node.js",
      type: "Technology",
      category: "Backend",
      description:
        "JavaScript runtime for server-side applications",
    },

    {
      id: "tech-express",
      label: "Express.js",
      type: "Technology",
      category: "Backend",
      description:
        "Web framework for Node.js",
    },

    {
      id: "tech-postgres",
      label: "PostgreSQL",
      type: "Technology",
      category: "Database",
      description:
        "Relational database system",
    },

    {
      id: "tech-docker",
      label: "Docker",
      type: "Technology",
      category: "DevOps",
      description:
        "Containerization platform",
    },

    {
      id: "tech-python",
      label: "Python",
      type: "Technology",
      category: "Programming",
      description:
        "High-level programming language",
    },

    // ========================================================
    // PROJECTS
    // ========================================================

    {
      id: "project-ecommerce",
      label: "E-commerce Platform",
      type: "Project",
      description:
        "Full-stack online shopping application",
      difficulty: "Advanced",
    },

    {
      id: "project-chat",
      label: "Real-time Chat Application",
      type: "Project",
      description:
        "Real-time communication platform",
      difficulty: "Intermediate",
    },

    {
      id: "project-task",
      label: "Task Management Portal",
      type: "Project",
      description:
        "Collaborative task management application",
      difficulty: "Intermediate",
    },

    {
      id: "project-dashboard",
      label: "Analytics Dashboard",
      type: "Project",
      description:
        "Interactive data visualization dashboard",
      difficulty: "Intermediate",
    },

    // ========================================================
    // LEARNING RESOURCES
    // ========================================================

    {
      id: "resource-react",
      label: "React Documentation",
      type: "LearningResource",
      title: "React Documentation",
      url: "https://react.dev",
      category: "Documentation",
    },

    {
      id: "resource-javascript",
      label: "JavaScript Documentation",
      type: "LearningResource",
      title: "JavaScript Documentation",
      url:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      category: "Documentation",
    },

    {
      id: "resource-node",
      label: "Node.js Documentation",
      type: "LearningResource",
      title: "Node.js Documentation",
      url: "https://nodejs.org/docs/latest/api/",
      category: "Documentation",
    },

    {
      id: "resource-sql",
      label: "SQL Tutorial",
      type: "LearningResource",
      title: "SQL Tutorial",
      url:
        "https://www.w3schools.com/sql/",
      category: "Tutorial",
    },
  ];

  const relationships = [
    // ========================================================
    // ROLE → SKILLS
    // ========================================================

    {
      source: "role-frontend",
      target: "skill-javascript",
      type: "REQUIRES",
    },

    {
      source: "role-frontend",
      target: "skill-react",
      type: "REQUIRES",
    },

    {
      source: "role-frontend",
      target: "skill-typescript",
      type: "REQUIRES",
    },

    {
      source: "role-frontend",
      target: "skill-html",
      type: "REQUIRES",
    },

    {
      source: "role-frontend",
      target: "skill-testing",
      type: "REQUIRES",
    },

    {
      source: "role-backend",
      target: "skill-javascript",
      type: "REQUIRES",
    },

    {
      source: "role-backend",
      target: "skill-node",
      type: "REQUIRES",
    },

    {
      source: "role-backend",
      target: "skill-rest",
      type: "REQUIRES",
    },

    {
      source: "role-backend",
      target: "skill-sql",
      type: "REQUIRES",
    },

    {
      source: "role-fullstack",
      target: "skill-react",
      type: "REQUIRES",
    },

    {
      source: "role-fullstack",
      target: "skill-node",
      type: "REQUIRES",
    },

    {
      source: "role-fullstack",
      target: "skill-javascript",
      type: "REQUIRES",
    },

    {
      source: "role-fullstack",
      target: "skill-sql",
      type: "REQUIRES",
    },

    {
      source: "role-data",
      target: "skill-python",
      type: "REQUIRES",
    },

    {
      source: "role-data",
      target: "skill-sql",
      type: "REQUIRES",
    },

    // ========================================================
    // SKILL → TECHNOLOGY
    // ========================================================

    {
      source: "skill-react",
      target: "tech-react",
      type: "USES",
    },

    {
      source: "skill-javascript",
      target: "tech-node",
      type: "USES",
    },

    {
      source: "skill-node",
      target: "tech-node",
      type: "USES",
    },

    {
      source: "skill-node",
      target: "tech-express",
      type: "USES",
    },

    {
      source: "skill-sql",
      target: "tech-postgres",
      type: "USES",
    },

    {
      source: "skill-python",
      target: "tech-python",
      type: "USES",
    },

    // ========================================================
    // PROJECT → SKILLS
    // ========================================================

    {
      source: "project-ecommerce",
      target: "skill-react",
      type: "DEMONSTRATES",
    },

    {
      source: "project-ecommerce",
      target: "skill-javascript",
      type: "DEMONSTRATES",
    },

    {
      source: "project-ecommerce",
      target: "skill-node",
      type: "DEMONSTRATES",
    },

    {
      source: "project-ecommerce",
      target: "skill-sql",
      type: "DEMONSTRATES",
    },

    {
      source: "project-chat",
      target: "skill-react",
      type: "DEMONSTRATES",
    },

    {
      source: "project-chat",
      target: "skill-javascript",
      type: "DEMONSTRATES",
    },

    {
      source: "project-chat",
      target: "skill-node",
      type: "DEMONSTRATES",
    },

    {
      source: "project-task",
      target: "skill-typescript",
      type: "DEMONSTRATES",
    },

    {
      source: "project-task",
      target: "skill-react",
      type: "DEMONSTRATES",
    },

    {
      source: "project-task",
      target: "skill-testing",
      type: "DEMONSTRATES",
    },

    {
      source: "project-dashboard",
      target: "skill-python",
      type: "DEMONSTRATES",
    },

    {
      source: "project-dashboard",
      target: "skill-sql",
      type: "DEMONSTRATES",
    },

    // ========================================================
    // PROJECT → TECHNOLOGY
    // ========================================================

    {
      source: "project-ecommerce",
      target: "tech-react",
      type: "BUILT_WITH",
    },

    {
      source: "project-ecommerce",
      target: "tech-node",
      type: "BUILT_WITH",
    },

    {
      source: "project-ecommerce",
      target: "tech-express",
      type: "BUILT_WITH",
    },

    {
      source: "project-ecommerce",
      target: "tech-postgres",
      type: "BUILT_WITH",
    },

    {
      source: "project-chat",
      target: "tech-react",
      type: "BUILT_WITH",
    },

    {
      source: "project-chat",
      target: "tech-node",
      type: "BUILT_WITH",
    },

    {
      source: "project-chat",
      target: "tech-express",
      type: "BUILT_WITH",
    },

    {
      source: "project-task",
      target: "tech-react",
      type: "BUILT_WITH",
    },

    {
      source: "project-task",
      target: "tech-node",
      type: "BUILT_WITH",
    },

    {
      source: "project-dashboard",
      target: "tech-python",
      type: "BUILT_WITH",
    },

    {
      source: "project-dashboard",
      target: "tech-postgres",
      type: "BUILT_WITH",
    },

    // ========================================================
    // SKILL → LEARNING RESOURCE
    // ========================================================

    {
      source: "skill-react",
      target: "resource-react",
      type: "LEARNED_THROUGH",
    },

    {
      source: "skill-javascript",
      target: "resource-javascript",
      type: "LEARNED_THROUGH",
    },

    {
      source: "skill-node",
      target: "resource-node",
      type: "LEARNED_THROUGH",
    },

    {
      source: "skill-sql",
      target: "resource-sql",
      type: "LEARNED_THROUGH",
    },
  ];

  return {
    nodes,
    relationships,
    fallback: true,
  };
}

/**
 * ============================================================
 * GET GRAPH DATA
 * ============================================================
 *
 * Graph Explorer requires:
 *
 * {
 *   nodes: [],
 *   relationships: []
 * }
 *
 * First attempts to load the real graph from CognoDB.
 *
 * If CognoDB is unavailable because of a connection problem,
 * a local fallback graph is returned so the Graph Explorer
 * remains functional for demo/submission purposes.
 */

async function getGraphData() {
  const session = driver.session();

  try {
    /**
     * --------------------------------------------------------
     * FETCH NODES
     * --------------------------------------------------------
     */

    console.log(
      "Graph API → fetching nodes..."
    );

    const nodeResult =
      await session.run(
        getGraphNodesQuery
      );

    console.log(
      `Graph API → received ${nodeResult.records.length} nodes`
    );

    /**
     * --------------------------------------------------------
     * TRANSFORM NODES
     * --------------------------------------------------------
     */

    const nodes =
      nodeResult.records
        .map((record) => ({
          id:
            record.get("id"),

          label:
            record.get("label"),

          type:
            record.get("type"),

          category:
            record.get("category"),

          difficulty:
            record.get("difficulty"),

          description:
            record.get("description"),

          duration:
            record.get("duration"),

          title:
            record.get("title"),

          url:
            record.get("url"),
        }))
        .filter(
          (node) =>
            node.id &&
            node.label &&
            node.type
        );

    /**
     * --------------------------------------------------------
     * FETCH RELATIONSHIPS
     * --------------------------------------------------------
     */

    console.log(
      "Graph API → fetching relationships..."
    );

    const relationshipResult =
      await session.run(
        getGraphRelationshipsQuery
      );

    console.log(
      `Graph API → received ${relationshipResult.records.length} relationships`
    );

    /**
     * --------------------------------------------------------
     * TRANSFORM RELATIONSHIPS
     * --------------------------------------------------------
     */

    const relationships =
      relationshipResult.records
        .map((record) => ({
          source:
            record.get("source"),

          target:
            record.get("target"),

          type:
            record.get("type"),
        }))
        .filter(
          (relationship) =>
            relationship.source &&
            relationship.target &&
            relationship.type
        );

    /**
     * --------------------------------------------------------
     * REMOVE DUPLICATE RELATIONSHIPS
     * --------------------------------------------------------
     */

    const relationshipMap =
      new Map();

    relationships.forEach(
      (relationship) => {
        const key =
          `${relationship.source}|` +
          `${relationship.target}|` +
          `${relationship.type}`;

        if (
          !relationshipMap.has(key)
        ) {
          relationshipMap.set(
            key,
            relationship
          );
        }
      }
    );

    const uniqueRelationships =
      Array.from(
        relationshipMap.values()
      );

    /**
     * --------------------------------------------------------
     * FINAL GRAPH RESPONSE
     * --------------------------------------------------------
     */

    console.log(
      `Graph API → final graph contains ${nodes.length} nodes and ${uniqueRelationships.length} relationships`
    );

    return {
      nodes,

      relationships:
        uniqueRelationships,

      fallback: false,
    };

  } catch (error) {

    /**
     * --------------------------------------------------------
     * DATABASE FAILED
     * --------------------------------------------------------
     *
     * Important:
     *
     * We DO NOT return HTTP 500 from the service.
     *
     * Instead, we provide demo graph data.
     */

    console.error(
      "Graph API → CognoDB unavailable:",
      error.message
    );

    console.warn(
      "Graph API → using local fallback graph"
    );

    return getFallbackGraphData();

  } finally {

    await session.close();

    console.log(
      "Graph API → database session closed"
    );
  }
}

/**
 * ============================================================
 * EXPORT ALL SERVICES
 * ============================================================
 */

module.exports = {
  getAllRoles,
  getRoleSkills,
  getRoleTechnologies,
  getAllTechnologies,
  getRoleProjects,
  getAllProjects,
  getRelatedRoles,
  getSkillResources,
  getGraphData,
};