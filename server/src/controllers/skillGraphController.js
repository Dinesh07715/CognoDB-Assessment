/**
 * SkillGraph Controller Layer
 *
 * Handles HTTP requests and responses for the SkillGraph API.
 *
 * Controller responsibilities:
 * - Read and validate request parameters
 * - Call service-layer functions
 * - Return consistent JSON responses
 * - Handle errors safely
 */

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
} = require("../services/skillGraphService");

/**
 * ============================================================
 * GET ALL ROLES
 * ============================================================
 *
 * GET /api/roles
 */
async function getAllRolesController(req, res) {
  try {
    const roles = await getAllRoles();

    return res.status(200).json({
      success: true,
      data: roles,
      count: roles.length,
    });
  } catch (error) {
    console.error(
      "Controller error - getAllRoles:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch roles",
    });
  }
}

/**
 * ============================================================
 * GET ROLE SKILLS
 * ============================================================
 *
 * GET /api/roles/:roleName/skills
 */
async function getRoleSkillsController(req, res) {
  try {
    const roleName = decodeURIComponent(
      req.params.roleName || ""
    ).trim();

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const skills = await getRoleSkills(roleName);

    return res.status(200).json({
      success: true,
      data: skills,
      count: skills.length,
      roleName,
    });
  } catch (error) {
    console.error(
      "Controller error - getRoleSkills:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch role skills",
    });
  }
}

/**
 * ============================================================
 * GET ROLE TECHNOLOGIES
 * ============================================================
 *
 * GET /api/roles/:roleName/technologies
 */
async function getRoleTechnologiesController(req, res) {
  try {
    const roleName = decodeURIComponent(
      req.params.roleName || ""
    ).trim();

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const technologies =
      await getRoleTechnologies(roleName);

    return res.status(200).json({
      success: true,
      data: technologies,
      count: technologies.length,
      roleName,
    });
  } catch (error) {
    console.error(
      "Controller error - getRoleTechnologies:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch role technologies",
    });
  }
}

/**
 * ============================================================
 * GET ALL TECHNOLOGIES
 * ============================================================
 *
 * GET /api/technologies
 *
 * Retrieves every Technology node directly from CognoDB.
 */
async function getAllTechnologiesController(req, res) {
  try {
    const technologies =
      await getAllTechnologies();

    return res.status(200).json({
      success: true,
      data: technologies,
      count: technologies.length,
    });
  } catch (error) {
    console.error(
      "Controller error - getAllTechnologies:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch technologies",
    });
  }
}

/**
 * ============================================================
 * GET ROLE PROJECTS
 * ============================================================
 *
 * GET /api/roles/:roleName/projects
 *
 * Retrieves projects related to the skills required
 * by a specific role.
 */
async function getRoleProjectsController(req, res) {
  try {
    const roleName = decodeURIComponent(
      req.params.roleName || ""
    ).trim();

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const projects =
      await getRoleProjects(roleName);

    return res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
      roleName,
    });
  } catch (error) {
    console.error(
      "Controller error - getRoleProjects:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch role projects",
    });
  }
}

/**
 * ============================================================
 * GET ALL PROJECTS
 * ============================================================
 *
 * GET /api/projects
 *
 * Retrieves every Project node from CognoDB.
 *
 * Example response:
 *
 * {
 *   success: true,
 *   data: [
 *     {
 *       name: "E-commerce Platform",
 *       description: "Full-stack online shopping application",
 *       difficulty: "Advanced",
 *       technologies: [
 *         "React",
 *         "Node.js",
 *         "PostgreSQL"
 *       ]
 *     }
 *   ],
 *   count: 12
 * }
 */
async function getAllProjectsController(req, res) {
  try {
    const projects = await getAllProjects();

    return res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error(
      "Controller error - getAllProjects:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch projects",
    });
  }
}

/**
 * ============================================================
 * GET RELATED ROLES
 * ============================================================
 *
 * GET /api/roles/:roleName/related
 */
async function getRelatedRolesController(req, res) {
  try {
    const roleName = decodeURIComponent(
      req.params.roleName || ""
    ).trim();

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const relatedRoles =
      await getRelatedRoles(roleName);

    return res.status(200).json({
      success: true,
      data: relatedRoles,
      count: relatedRoles.length,
      roleName,
    });
  } catch (error) {
    console.error(
      "Controller error - getRelatedRoles:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch related roles",
    });
  }
}

/**
 * ============================================================
 * GET SKILL LEARNING RESOURCES
 * ============================================================
 *
 * GET /api/roles/skills/:skillName/resources
 */
async function getSkillResourcesController(req, res) {
  try {
    const skillName = decodeURIComponent(
      req.params.skillName || ""
    ).trim();

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const resources =
      await getSkillResources(skillName);

    return res.status(200).json({
      success: true,
      data: resources,
      count: resources.length,
      skillName,
    });
  } catch (error) {
    console.error(
      "Controller error - getSkillResources:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch learning resources",
    });
  }
}

/**
 * ============================================================
 * GET GRAPH DATA
 * ============================================================
 *
 * GET /api/graph
 */
async function getGraphDataController(req, res) {
  try {
    const graphData = await getGraphData();

    return res.status(200).json({
      success: true,
      data: graphData,
    });
  } catch (error) {
    console.error(
      "Controller error - getGraphData:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch graph data",
    });
  }
}

/**
 * ============================================================
 * EXPORT CONTROLLERS
 * ============================================================
 */

module.exports = {
  getAllRoles: getAllRolesController,

  getRoleSkills:
    getRoleSkillsController,

  getRoleTechnologies:
    getRoleTechnologiesController,

  getAllTechnologies:
    getAllTechnologiesController,

  getRoleProjects:
    getRoleProjectsController,

  getAllProjects:
    getAllProjectsController,

  getRelatedRoles:
    getRelatedRolesController,

  getSkillResources:
    getSkillResourcesController,

  getGraphData:
    getGraphDataController,
};