/**
 * SkillGraph Route Layer
 *
 * Maps HTTP GET endpoints to controller functions.
 *
 * Role routes:
 * - GET /api/roles
 * - GET /api/roles/:roleName/skills
 * - GET /api/roles/:roleName/technologies
 * - GET /api/roles/:roleName/projects
 * - GET /api/roles/:roleName/related
 *
 * Technology routes:
 * - GET /api/technologies
 *
 * Project routes:
 * - GET /api/projects
 *
 * Resource routes:
 * - GET /api/roles/skills/:skillName/resources
 *
 * Graph routes:
 * - GET /api/graph
 */

const express = require("express");

const router = express.Router();
const graphRouter = express.Router();
const technologyRouter = express.Router();
const projectRouter = express.Router();

const {
  getAllRoles,
  getRoleSkills,
  getRoleTechnologies,
  getAllTechnologies,
  getRoleProjects,
  getAllProjects,
  getRelatedRoles,
  getSkillResources,
  getGraphData,
} = require("../controllers/skillGraphController");

/**
 * =========================================================
 * ROLE ROUTES
 * =========================================================
 *
 * Mounted in server.js as:
 *
 * app.use("/api/roles", skillGraphRoutes);
 *
 * Therefore:
 *
 * GET /api/roles
 */

/**
 * GET /api/roles
 *
 * Retrieve all roles from the knowledge graph.
 */
router.get(
  "/",
  getAllRoles
);

/**
 * =========================================================
 * SKILL RESOURCE ROUTE
 * =========================================================
 *
 * IMPORTANT:
 *
 * This route must come before generic :roleName routes.
 *
 * GET /api/roles/skills/:skillName/resources
 */
router.get(
  "/skills/:skillName/resources",
  getSkillResources
);

/**
 * =========================================================
 * ROLE → SKILLS
 * =========================================================
 *
 * GET /api/roles/:roleName/skills
 */
router.get(
  "/:roleName/skills",
  getRoleSkills
);

/**
 * =========================================================
 * ROLE → TECHNOLOGIES
 * =========================================================
 *
 * GET /api/roles/:roleName/technologies
 *
 * Returns technologies connected to the skills
 * required by a specific role.
 */
router.get(
  "/:roleName/technologies",
  getRoleTechnologies
);

/**
 * =========================================================
 * ROLE → PROJECTS
 * =========================================================
 *
 * GET /api/roles/:roleName/projects
 *
 * Returns projects demonstrating skills required
 * by a specific role.
 */
router.get(
  "/:roleName/projects",
  getRoleProjects
);

/**
 * =========================================================
 * RELATED ROLES
 * =========================================================
 *
 * GET /api/roles/:roleName/related
 *
 * Returns roles that share skills with the
 * selected role.
 */
router.get(
  "/:roleName/related",
  getRelatedRoles
);

/**
 * =========================================================
 * TECHNOLOGY ROUTES
 * =========================================================
 *
 * This router is mounted in server.js as:
 *
 * app.use("/api/technologies", technologyRoutes);
 *
 * Therefore:
 *
 * GET /api/technologies
 */

/**
 * GET /api/technologies
 *
 * Retrieve ALL Technology nodes directly
 * from CognoDB.
 */
technologyRouter.get(
  "/",
  getAllTechnologies
);

/**
 * =========================================================
 * PROJECT ROUTES
 * =========================================================
 *
 * This router should be mounted in server.js as:
 *
 * app.use("/api/projects", projectRoutes);
 *
 * Therefore:
 *
 * GET /api/projects
 */

/**
 * GET /api/projects
 *
 * Retrieve ALL Project nodes from CognoDB.
 *
 * Each project contains:
 *
 * {
 *   name,
 *   description,
 *   difficulty,
 *   technologies
 * }
 */
projectRouter.get(
  "/",
  getAllProjects
);

/**
 * =========================================================
 * GRAPH ROUTES
 * =========================================================
 *
 * Mounted in server.js as:
 *
 * app.use("/api", graphRoutes);
 *
 * Therefore:
 *
 * GET /api/graph
 */

/**
 * GET /api/graph
 *
 * Retrieve complete Neo4j graph data.
 */
graphRouter.get(
  "/graph",
  getGraphData
);

/**
 * =========================================================
 * EXPORT ALL ROUTERS
 * =========================================================
 */

module.exports = {
  skillGraphRoutes: router,
  technologyRoutes: technologyRouter,
  projectRoutes: projectRouter,
  graphRoutes: graphRouter,
};