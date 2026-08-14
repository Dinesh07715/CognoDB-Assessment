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
 * MIDDLEWARE
 * =========================================================
 */

app.use(cors());

app.use(express.json());

/**
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillGraph API is running",
  });
});

/**
 * =========================================================
 * ROLE API ROUTES
 * =========================================================
 */

app.use(
  "/api/roles",
  skillGraphRoutes
);

/**
 * =========================================================
 * TECHNOLOGY API ROUTES
 * =========================================================
 */

app.use(
  "/api/technologies",
  technologyRoutes
);

/**
 * =========================================================
 * PROJECT API ROUTES
 * =========================================================
 */

app.use(
  "/api/projects",
  projectRoutes
);

/**
 * =========================================================
 * GRAPH API ROUTES
 * =========================================================
 */

app.use(
  "/api",
  graphRoutes
);

/**
 * =========================================================
 * 404 HANDLER
 * =========================================================
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * =========================================================
 * GLOBAL ERROR HANDLER
 * =========================================================
 */

app.use((err, req, res, next) => {
  console.error(
    "Unhandled error:",
    err.message
  );

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});

/**
 * =========================================================
 * START SERVER
 * =========================================================
 */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(
    `SkillGraph API running on port ${PORT}`
  );

  const connected =
    await verifyConnection();

  if (!connected) {
    console.warn(
      "⚠️ CognoDB is currently unavailable."
    );

    console.warn(
      "⚠️ API server will continue running."
    );
  }
});