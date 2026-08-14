const { driver } = require("../src/config/database");

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Starting SkillGraph database seeding...\n");

    // Step 1: Create Roles
    console.log("Creating Roles...");
    await createRoles(session);

    // Step 2: Create Skills
    console.log("Creating Skills...");
    await createSkills(session);

    // Step 3: Create Technologies
    console.log("Creating Technologies...");
    await createTechnologies(session);

    // Step 4: Create Projects
    console.log("Creating Projects...");
    await createProjects(session);

    // Step 5: Create Learning Resources
    console.log("Creating Learning Resources...");
    await createLearningResources(session);

    // Step 6: Create Relationships
    console.log("Creating Relationships...");
    await createRelationships(session);

    console.log("\n✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

/* ============================================================
   ROLES
============================================================ */

async function createRoles(session) {
  const roles = [
    {
      name: "Frontend Developer",
      description: "Specializes in UI/UX and client-side development",
      category: "Development",
    },
    {
      name: "Backend Developer",
      description: "Develops server-side logic and APIs",
      category: "Development",
    },
    {
      name: "Full Stack Developer",
      description: "Works on both frontend and backend",
      category: "Development",
    },
    {
      name: "Data Analyst",
      description: "Analyzes and visualizes data for insights",
      category: "Data",
    },
    {
      name: "Data Engineer",
      description: "Builds data pipelines and infrastructure",
      category: "Data",
    },
    {
      name: "DevOps Engineer",
      description: "Manages deployment and infrastructure",
      category: "Operations",
    },
    {
      name: "UI/UX Developer",
      description: "Focuses on user interface and experience design",
      category: "Design",
    },
    {
      name: "Software Engineer",
      description: "General software development professional",
      category: "Development",
    },
  ];

  for (const role of roles) {
    await session.run(
      `MERGE (r:Role { name: $name })
       SET r.description = $description,
           r.category = $category`,
      {
        name: role.name,
        description: role.description,
        category: role.category,
      }
    );
  }

  console.log(`  ✓ Created ${roles.length} roles`);
}

/* ============================================================
   SKILLS
============================================================ */

async function createSkills(session) {
  const skills = [
    {
      name: "JavaScript",
      category: "Programming",
      difficulty: "Beginner",
    },
    {
      name: "React",
      category: "Frontend",
      difficulty: "Intermediate",
    },
    {
      name: "Vue.js",
      category: "Frontend",
      difficulty: "Intermediate",
    },
    {
      name: "HTML/CSS",
      category: "Frontend",
      difficulty: "Beginner",
    },
    {
      name: "Node.js",
      category: "Backend",
      difficulty: "Intermediate",
    },
    {
      name: "Python",
      category: "Programming",
      difficulty: "Beginner",
    },
    {
      name: "SQL",
      category: "Database",
      difficulty: "Intermediate",
    },
    {
      name: "MongoDB",
      category: "Database",
      difficulty: "Intermediate",
    },
    {
      name: "REST APIs",
      category: "Backend",
      difficulty: "Intermediate",
    },
    {
      name: "GraphQL",
      category: "Backend",
      difficulty: "Intermediate",
    },
    {
      name: "Docker",
      category: "DevOps",
      difficulty: "Intermediate",
    },
    {
      name: "Kubernetes",
      category: "DevOps",
      difficulty: "Advanced",
    },
    {
      name: "CI/CD",
      category: "DevOps",
      difficulty: "Intermediate",
    },
    {
      name: "Data Visualization",
      category: "Data",
      difficulty: "Intermediate",
    },
    {
      name: "Machine Learning",
      category: "Data",
      difficulty: "Advanced",
    },
    {
      name: "Data Cleaning",
      category: "Data",
      difficulty: "Beginner",
    },
    {
      name: "TypeScript",
      category: "Programming",
      difficulty: "Intermediate",
    },
    {
      name: "Testing",
      category: "QA",
      difficulty: "Intermediate",
    },
    {
      name: "Git",
      category: "Tools",
      difficulty: "Beginner",
    },
    {
      name: "AWS",
      category: "Cloud",
      difficulty: "Intermediate",
    },
    {
      name: "Azure",
      category: "Cloud",
      difficulty: "Intermediate",
    },
    {
      name: "System Design",
      category: "Architecture",
      difficulty: "Advanced",
    },
    {
      name: "Database Design",
      category: "Database",
      difficulty: "Advanced",
    },
    {
      name: "Performance Optimization",
      category: "Backend",
      difficulty: "Advanced",
    },
    {
      name: "Security",
      category: "Architecture",
      difficulty: "Advanced",
    },
  ];

  for (const skill of skills) {
    await session.run(
      `MERGE (s:Skill { name: $name })
       SET s.category = $category,
           s.difficulty = $difficulty`,
      {
        name: skill.name,
        category: skill.category,
        difficulty: skill.difficulty,
      }
    );
  }

  console.log(`  ✓ Created ${skills.length} skills`);
}

/* ============================================================
   TECHNOLOGIES
============================================================ */

async function createTechnologies(session) {
  const technologies = [
    {
      name: "React",
      category: "Frontend Framework",
      description: "JavaScript library for building UIs",
    },
    {
      name: "Vue.js",
      category: "Frontend Framework",
      description: "Progressive JavaScript framework",
    },
    {
      name: "Angular",
      category: "Frontend Framework",
      description: "Full-featured JavaScript framework",
    },
    {
      name: "Node.js",
      category: "Runtime",
      description: "JavaScript runtime for server-side development",
    },
    {
      name: "Express.js",
      category: "Backend Framework",
      description: "Minimal web application framework",
    },
    {
      name: "Django",
      category: "Backend Framework",
      description: "Python web framework",
    },
    {
      name: "Python",
      category: "Programming Language",
      description: "High-level programming language",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      description: "Advanced open-source relational database",
    },
    {
      name: "MongoDB",
      category: "Database",
      description: "NoSQL document database",
    },
    {
      name: "Redis",
      category: "Cache",
      description: "In-memory data store",
    },
    {
      name: "Docker",
      category: "Containerization",
      description: "Container platform",
    },
    {
      name: "Kubernetes",
      category: "Orchestration",
      description: "Container orchestration platform",
    },
    {
      name: "AWS",
      category: "Cloud Platform",
      description: "Amazon Web Services",
    },
    {
      name: "Azure",
      category: "Cloud Platform",
      description: "Microsoft Azure cloud",
    },
    {
      name: "Jenkins",
      category: "CI/CD",
      description: "Automation server for CI/CD",
    },
    {
      name: "GitHub Actions",
      category: "CI/CD",
      description: "GitHub's CI/CD platform",
    },
  ];

  for (const tech of technologies) {
    await session.run(
      `MERGE (t:Technology { name: $name })
       SET t.category = $category,
           t.description = $description`,
      {
        name: tech.name,
        category: tech.category,
        description: tech.description,
      }
    );
  }

  console.log(`  ✓ Created ${technologies.length} technologies`);
}

/* ============================================================
   PROJECTS
============================================================ */

async function createProjects(session) {
  const projects = [
    {
      name: "E-commerce Platform",
      description: "Full-stack online shopping application",
      difficulty: "Advanced",
    },
    {
      name: "Real-time Chat App",
      description: "WebSocket-based messaging application",
      difficulty: "Intermediate",
    },
    {
      name: "Task Management Tool",
      description: "Collaborative task and project tracker",
      difficulty: "Intermediate",
    },
    {
      name: "Social Media API",
      description: "RESTful API for social networking",
      difficulty: "Advanced",
    },
    {
      name: "Weather Dashboard",
      description: "React frontend with weather data visualization",
      difficulty: "Beginner",
    },
    {
      name: "Data Pipeline",
      description: "ETL pipeline for data processing",
      difficulty: "Advanced",
    },
    {
      name: "Microservices Architecture",
      description: "Docker and Kubernetes deployment",
      difficulty: "Advanced",
    },
    {
      name: "Analytics Platform",
      description: "Data analysis and reporting tool",
      difficulty: "Advanced",
    },
    {
      name: "Blog Platform",
      description: "Content management system",
      difficulty: "Intermediate",
    },
    {
      name: "Mobile App Backend",
      description: "REST API for mobile applications",
      difficulty: "Intermediate",
    },
    {
      name: "Monitoring Dashboard",
      description: "System performance monitoring tool",
      difficulty: "Intermediate",
    },
    {
      name: "Machine Learning Model",
      description: "Predictive analytics model",
      difficulty: "Advanced",
    },
  ];

  for (const project of projects) {
    await session.run(
      `MERGE (p:Project { name: $name })
       SET p.description = $description,
           p.difficulty = $difficulty`,
      {
        name: project.name,
        description: project.description,
        difficulty: project.difficulty,
      }
    );
  }

  console.log(`  ✓ Created ${projects.length} projects`);
}

/* ============================================================
   LEARNING RESOURCES
============================================================ */

async function createLearningResources(session) {
  const resources = [
    {
      title: "The Complete JavaScript Course 2024",
      url: "https://udemy.com",
      type: "Course",
    },
    {
      title: "React Documentation",
      url: "https://react.dev",
      type: "Documentation",
    },
    {
      title: "Node.js Best Practices",
      url: "https://github.com/goldbergyoni/nodebestpractices",
      type: "Guide",
    },
    {
      title: "Docker Deep Dive",
      url: "https://nickjanetakis.com/blog/docker",
      type: "Tutorial",
    },
    {
      title: "Kubernetes in Action",
      url: "https://manning.com",
      type: "Book",
    },
    {
      title: "SQL Performance Explained",
      url: "https://sqlperformanceexplained.com",
      type: "Book",
    },
    {
      title: "System Design Interview",
      url: "https://systemdesigninterview.com",
      type: "Course",
    },
    {
      title: "AWS Certified Solutions Architect",
      url: "https://aws.amazon.com/certification",
      type: "Certification",
    },
    {
      title: "Data Science with Python",
      url: "https://coursera.org",
      type: "Course",
    },
    {
      title: "DevOps Handbook",
      url: "https://itrevolution.com",
      type: "Book",
    },
    {
      title: "GraphQL Apollo Tutorial",
      url: "https://www.apollographql.com/docs",
      type: "Documentation",
    },
    {
      title: "Microservices Architecture",
      url: "https://microservices.io",
      type: "Guide",
    },
    {
      title: "Testing JavaScript",
      url: "https://testingjavascript.com",
      type: "Course",
    },
    {
      title: "AWS Security Best Practices",
      url: "https://aws.amazon.com/security",
      type: "Documentation",
    },
    {
      title: "MongoDB University",
      url: "https://university.mongodb.com",
      type: "Course",
    },
  ];

  for (const resource of resources) {
    await session.run(
      `MERGE (lr:LearningResource { title: $title })
       SET lr.url = $url,
           lr.type = $type`,
      {
        title: resource.title,
        url: resource.url,
        type: resource.type,
      }
    );
  }

  console.log(`  ✓ Created ${resources.length} learning resources`);
}

/* ============================================================
   RELATIONSHIPS
============================================================ */

async function createRelationships(session) {
  /* ----------------------------------------------------------
     Role REQUIRES Skill
  ---------------------------------------------------------- */

  console.log("  Creating Role REQUIRES Skill relationships...");

  const roleSkills = {
    "Frontend Developer": [
      "JavaScript",
      "React",
      "HTML/CSS",
      "TypeScript",
      "Testing",
    ],

    "Backend Developer": [
      "Node.js",
      "Python",
      "REST APIs",
      "SQL",
      "Database Design",
    ],

    "Full Stack Developer": [
      "JavaScript",
      "React",
      "Node.js",
      "SQL",
      "TypeScript",
    ],

    "Data Analyst": [
      "SQL",
      "Data Visualization",
      "Python",
      "Data Cleaning",
    ],

    "Data Engineer": [
      "Python",
      "SQL",
      "Docker",
      "Data Cleaning",
      "Database Design",
    ],

    "DevOps Engineer": [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS",
      "System Design",
    ],

    "UI/UX Developer": [
      "JavaScript",
      "React",
      "HTML/CSS",
      "TypeScript",
    ],

    "Software Engineer": [
      "JavaScript",
      "Python",
      "Git",
      "Testing",
      "System Design",
    ],
  };

  for (const [roleName, skillNames] of Object.entries(roleSkills)) {
    for (const skillName of skillNames) {
      await session.run(
        `MATCH (r:Role { name: $roleName })
         MATCH (s:Skill { name: $skillName })
         MERGE (r)-[:REQUIRES]->(s)`,
        {
          roleName,
          skillName,
        }
      );
    }
  }

  console.log("  ✓ Created Role REQUIRES Skill relationships");

  /* ----------------------------------------------------------
     Skill RELATED_TO Skill
  ---------------------------------------------------------- */

  console.log("  Creating Skill RELATED_TO Skill relationships...");

  const skillRelations = [
    ["React", "Vue.js"],
    ["React", "Angular"],
    ["JavaScript", "TypeScript"],
    ["Python", "SQL"],
    ["Docker", "Kubernetes"],
    ["REST APIs", "GraphQL"],
    ["MongoDB", "SQL"],
    ["AWS", "Azure"],
    ["Data Visualization", "Data Cleaning"],
    ["Machine Learning", "Python"],
  ];

  for (const [skill1, skill2] of skillRelations) {
    await session.run(
      `MATCH (s1:Skill { name: $skill1 })
       MATCH (s2:Skill { name: $skill2 })
       MERGE (s1)-[:RELATED_TO]->(s2)`,
      {
        skill1,
        skill2,
      }
    );
  }

  console.log("  ✓ Created Skill RELATED_TO Skill relationships");

  /* ----------------------------------------------------------
     Skill USES Technology
  ---------------------------------------------------------- */

  console.log("  Creating Skill USES Technology relationships...");

  const skillTechnology = {
    JavaScript: ["React", "Node.js", "Express.js"],

    React: ["React"],

    "Vue.js": ["Vue.js"],

    "Node.js": ["Node.js", "Express.js"],

    Python: ["Django", "Python"],

    SQL: ["PostgreSQL"],

    MongoDB: ["MongoDB"],

    Docker: ["Docker"],

    Kubernetes: ["Kubernetes"],

    AWS: ["AWS"],

    Azure: ["Azure"],

    "REST APIs": ["Express.js", "Node.js"],

    GraphQL: ["Express.js", "Node.js"],

    TypeScript: ["Angular", "React"],

    "CI/CD": ["Jenkins", "GitHub Actions"],

    "System Design": ["Docker", "Kubernetes", "AWS"],

    "Database Design": ["PostgreSQL", "MongoDB"],

    "Performance Optimization": ["Redis", "PostgreSQL"],

    Security: ["AWS", "Azure"],
  };

  for (const [skillName, techNames] of Object.entries(skillTechnology)) {
    for (const techName of techNames) {
      await session.run(
        `MATCH (s:Skill { name: $skillName })
         MATCH (t:Technology { name: $techName })
         MERGE (s)-[:USES]->(t)`,
        {
          skillName,
          techName,
        }
      );
    }
  }

  console.log("  ✓ Created Skill USES Technology relationships");

  /* ----------------------------------------------------------
     Project DEMONSTRATES Skill
  ---------------------------------------------------------- */

  console.log("  Creating Project DEMONSTRATES Skill relationships...");

  const projectSkills = {
    "E-commerce Platform": [
      "React",
      "Node.js",
      "SQL",
      "REST APIs",
      "System Design",
    ],

    "Real-time Chat App": [
      "JavaScript",
      "Node.js",
    ],

    "Task Management Tool": [
      "React",
      "Node.js",
      "MongoDB",
      "REST APIs",
    ],

    "Social Media API": [
      "Node.js",
      "REST APIs",
      "Database Design",
      "Performance Optimization",
    ],

    "Weather Dashboard": [
      "React",
      "JavaScript",
      "HTML/CSS",
    ],

    "Data Pipeline": [
      "Python",
      "SQL",
      "Data Cleaning",
    ],

    "Microservices Architecture": [
      "Docker",
      "Kubernetes",
      "System Design",
    ],

    "Analytics Platform": [
      "Python",
      "Data Visualization",
      "SQL",
      "Database Design",
    ],

    "Blog Platform": [
      "React",
      "Node.js",
      "MongoDB",
      "REST APIs",
    ],

    "Mobile App Backend": [
      "Node.js",
      "REST APIs",
      "Database Design",
    ],

    "Monitoring Dashboard": [
      "React",
      "Docker",
      "Kubernetes",
    ],

    "Machine Learning Model": [
      "Python",
      "Machine Learning",
      "Data Cleaning",
    ],
  };

  for (const [projectName, skillNames] of Object.entries(projectSkills)) {
    for (const skillName of skillNames) {
      await session.run(
        `MATCH (p:Project { name: $projectName })
         MATCH (s:Skill { name: $skillName })
         MERGE (p)-[:DEMONSTRATES]->(s)`,
        {
          projectName,
          skillName,
        }
      );
    }
  }

  console.log("  ✓ Created Project DEMONSTRATES Skill relationships");

  /* ----------------------------------------------------------
     Project BUILT_WITH Technology
  ---------------------------------------------------------- */

  console.log("  Creating Project BUILT_WITH Technology relationships...");

  const projectTechnology = {
    "E-commerce Platform": [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
    ],

    "Real-time Chat App": [
      "React",
      "Node.js",
      "MongoDB",
    ],

    "Task Management Tool": [
      "React",
      "Node.js",
      "MongoDB",
    ],

    "Social Media API": [
      "Node.js",
      "PostgreSQL",
      "Docker",
    ],

    "Weather Dashboard": [
      "React",
    ],

    "Data Pipeline": [
      "Python",
      "PostgreSQL",
    ],

    "Microservices Architecture": [
      "Docker",
      "Kubernetes",
      "Node.js",
    ],

    "Analytics Platform": [
      "Python",
      "MongoDB",
      "React",
    ],

    "Blog Platform": [
      "React",
      "Node.js",
      "MongoDB",
    ],

    "Mobile App Backend": [
      "Node.js",
      "PostgreSQL",
    ],

    "Monitoring Dashboard": [
      "React",
      "Docker",
      "Kubernetes",
    ],

    "Machine Learning Model": [
      "Python",
    ],
  };

  for (const [projectName, techNames] of Object.entries(projectTechnology)) {
    for (const techName of techNames) {
      await session.run(
        `MATCH (p:Project { name: $projectName })
         MATCH (t:Technology { name: $techName })
         MERGE (p)-[:BUILT_WITH]->(t)`,
        {
          projectName,
          techName,
        }
      );
    }
  }

  console.log("  ✓ Created Project BUILT_WITH Technology relationships");

  /* ----------------------------------------------------------
     Skill LEARNED_THROUGH LearningResource
  ---------------------------------------------------------- */

  console.log(
    "  Creating Skill LEARNED_THROUGH LearningResource relationships..."
  );

  const skillResources = {
    JavaScript: [
      "The Complete JavaScript Course 2024",
      "Testing JavaScript",
    ],

    React: [
      "React Documentation",
      "Testing JavaScript",
    ],

    "Node.js": [
      "Node.js Best Practices",
      "Testing JavaScript",
    ],

    Docker: [
      "Docker Deep Dive",
    ],

    Kubernetes: [
      "Docker Deep Dive",
      "Kubernetes in Action",
    ],

    SQL: [
      "SQL Performance Explained",
    ],

    "System Design": [
      "System Design Interview",
      "Microservices Architecture",
    ],

    AWS: [
      "AWS Certified Solutions Architect",
      "AWS Security Best Practices",
    ],

    Python: [
      "Data Science with Python",
    ],

    "REST APIs": [
      "GraphQL Apollo Tutorial",
    ],

    GraphQL: [
      "GraphQL Apollo Tutorial",
    ],

    Testing: [
      "Testing JavaScript",
    ],

    MongoDB: [
      "MongoDB University",
    ],

    Security: [
      "AWS Security Best Practices",
    ],

    "Machine Learning": [
      "Data Science with Python",
    ],
  };

  for (const [skillName, resourceTitles] of Object.entries(skillResources)) {
    for (const resourceTitle of resourceTitles) {
      await session.run(
        `MATCH (s:Skill { name: $skillName })
         MATCH (lr:LearningResource { title: $resourceTitle })
         MERGE (s)-[:LEARNED_THROUGH]->(lr)`,
        {
          skillName,
          resourceTitle,
        }
      );
    }
  }

  console.log(
    "  ✓ Created Skill LEARNED_THROUGH LearningResource relationships"
  );
}

/* ============================================================
   RUN SEED
============================================================ */

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
};