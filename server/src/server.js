require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { verifyConnection } = require("./config/database");

const {
  skillGraphRoutes,
  technologyRoutes,
  projectRoutes,
  graphRoutes,
} = require("./routes/skillGraphRoutes");

const app = express();

/**
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

const PORT = process.env.PORT || 5000;

/**
 * =========================================================
 * MIDDLEWARE
 * =========================================================
 */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/**
 * =========================================================
 * ROOT HEALTH CHECK
 * =========================================================
 *
 * GET /
 *
 * Useful for checking whether Render can reach
 * the Express application.
 */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SkillGraph API is live",
    status: "online",
    environment: process.env.NODE_ENV || "production",
  });
});

/**
 * =========================================================
 * API HEALTH CHECK
 * =========================================================
 *
 * GET /api/health
 */

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SkillGraph API is running",
    status: "online",
  });
});

/**
 * =========================================================
 * ROLE API ROUTES
 * =========================================================
 *
 * GET /api/roles
 * GET /api/roles/:roleName/skills
 * GET /api/roles/:roleName/technologies
 * GET /api/roles/:roleName/projects
 * GET /api/roles/:roleName/related
 * GET /api/roles/skills/:skillName/resources
 */

app.use("/api/roles", skillGraphRoutes);

/**
 * =========================================================
 * TECHNOLOGY API ROUTES
 * =========================================================
 *
 * GET /api/technologies
 */

app.use("/api/technologies", technologyRoutes);

/**
 * =========================================================
 * PROJECT API ROUTES
 * =========================================================
 *
 * GET /api/projects
 */

app.use("/api/projects", projectRoutes);

/**
 * =========================================================
 * GRAPH API ROUTES
 * =========================================================
 *
 * GET /api/graph
 */

app.use("/api", graphRoutes);

/**
 * =========================================================
 * 404 HANDLER
 * =========================================================
 */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

/**
 * =========================================================
 * GLOBAL ERROR HANDLER
 * =========================================================
 */

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/**
 * =========================================================
 * START SERVER
 * =========================================================
 */

async function startServer() {
  try {
    app.listen(PORT, async () => {
      console.log("==========================================");
      console.log(`SkillGraph API running on port ${PORT}`);
      console.log("==========================================");

      console.log("Testing CognoDB connection...");

      try {
        const connected = await verifyConnection();

        if (connected) {
          console.log(
            "✅ CognoDB connection verified successfully"
          );
        } else {
          console.warn(
            "⚠️ CognoDB connection unavailable."
          );
          console.warn(
            "⚠️ API server will continue running."
          );
        }
      } catch (error) {
        console.error(
          "⚠️ CognoDB connection check failed:",
          error.message
        );

        console.warn(
          "⚠️ API server will continue running."
        );
      }
    });
  } catch (error) {
    console.error(
      "❌ Failed to start SkillGraph API:",
      error.message
    );

    process.exit(1);
  }
}

startServer();