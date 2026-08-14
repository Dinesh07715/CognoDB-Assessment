import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

import ProjectCard from '../components/ProjectCard';
import TechnologyBadge from '../components/TechnologyBadge';
import api from '../services/api';

/*
|--------------------------------------------------------------------------
| PROJECT-SPECIFIC DETAILS
|--------------------------------------------------------------------------
| These details are shown when a user clicks a project.
| The main project information still comes from the API.
*/

const projectDetails = {
  'E-commerce Platform': {
    overview:
      'A full-stack online shopping platform that allows users to browse products, manage a shopping cart, place orders, and manage their account.',

    features: [
      'Product browsing and search',
      'Product details and categories',
      'Shopping cart management',
      'User authentication',
      'Order management',
      'Responsive shopping experience',
    ],

    skills: [
      'React',
      'JavaScript',
      'REST API',
      'Authentication',
      'Database Management',
      'Responsive UI',
    ],

    architecture: [
      'User',
      'React Frontend',
      'REST API',
      'Backend Services',
      'Database',
      'Response',
      'React UI',
    ],

    structure: `📁 E-commerce Platform
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 pages
│   ├── 📁 services
│   ├── 📁 hooks
│   └── 📁 assets
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 services
│   ├── 📁 routes
│   ├── 📁 middleware
│   └── 📁 config
│
├── 📁 database
│   └── 📄 schema
│
├── 📄 package.json
└── 📄 README.md`,
  },

  'Real-time Chat App': {
    overview:
      'A real-time messaging application designed for instant communication between users using persistent real-time connections.',

    features: [
      'Real-time messaging',
      'User authentication',
      'Conversation management',
      'Message history',
      'Online communication',
      'Responsive chat interface',
    ],

    skills: [
      'React',
      'JavaScript',
      'WebSockets',
      'REST API',
      'State Management',
      'Responsive UI',
    ],

    architecture: [
      'User',
      'React Chat Interface',
      'WebSocket Connection',
      'Backend Server',
      'Message Service',
      'Database',
    ],

    structure: `📁 Real-time Chat App
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 chat
│   ├── 📁 pages
│   └── 📁 services
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 websocket
│   ├── 📁 services
│   └── 📁 routes
│
├── 📁 database
│   └── 📄 messages
│
└── 📄 README.md`,
  },

  'Task Management Tool': {
    overview:
      'A collaborative task and project management application for organizing work, tracking progress, and managing team activities.',

    features: [
      'Task creation and management',
      'Task status tracking',
      'Project organization',
      'User assignment',
      'Priority management',
      'Progress tracking',
    ],

    skills: [
      'React',
      'JavaScript',
      'REST API',
      'CRUD Operations',
      'State Management',
      'Database Management',
    ],

    architecture: [
      'User',
      'React Dashboard',
      'REST API',
      'Task Services',
      'Database',
      'Updated Task State',
    ],

    structure: `📁 Task Management Tool
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 pages
│   ├── 📁 dashboard
│   └── 📁 services
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 services
│   ├── 📁 routes
│   └── 📁 middleware
│
├── 📁 database
│   └── 📄 tasks
│
└── 📄 README.md`,
  },

  'Social Media API': {
    overview:
      'A RESTful backend API designed to support social networking functionality including users, posts, interactions, and data management.',

    features: [
      'User management',
      'Post creation',
      'Post retrieval',
      'Social interactions',
      'RESTful API endpoints',
      'Data persistence',
    ],

    skills: [
      'REST API',
      'Node.js',
      'Express.js',
      'Database Management',
      'Authentication',
      'API Design',
    ],

    architecture: [
      'Client Application',
      'REST API',
      'Express Server',
      'Business Logic',
      'Database',
      'JSON Response',
    ],

    structure: `📁 Social Media API
│
├── 📁 src
│   ├── 📁 controllers
│   ├── 📁 services
│   ├── 📁 routes
│   ├── 📁 middleware
│   └── 📁 config
│
├── 📁 database
│   └── 📄 schema
│
├── 📄 package.json
└── 📄 README.md`,
  },

  'Weather Dashboard': {
    overview:
      'A React-based dashboard that consumes weather data and presents it through an intuitive and visual user interface.',

    features: [
      'Weather information display',
      'Location-based weather data',
      'Data visualization',
      'Responsive dashboard',
      'API integration',
      'Dynamic UI updates',
    ],

    skills: [
      'React',
      'JavaScript',
      'REST API',
      'API Integration',
      'Data Visualization',
      'Responsive Design',
    ],

    architecture: [
      'User',
      'React Dashboard',
      'Weather API',
      'Data Processing',
      'Visualization Components',
      'Weather Information',
    ],

    structure: `📁 Weather Dashboard
│
├── 📁 src
│   ├── 📁 components
│   ├── 📁 pages
│   ├── 📁 services
│   ├── 📁 hooks
│   └── 📁 assets
│
├── 📄 package.json
└── 📄 README.md`,
  },

  'Data Pipeline': {
    overview:
      'An ETL-oriented data processing project designed to extract data, transform it into a usable format, and prepare it for analysis or storage.',

    features: [
      'Data extraction',
      'Data transformation',
      'Data validation',
      'Data processing',
      'Data storage',
      'Pipeline monitoring',
    ],

    skills: [
      'Python',
      'Data Processing',
      'ETL',
      'Data Validation',
      'Database Management',
      'Automation',
    ],

    architecture: [
      'Data Sources',
      'Extraction',
      'Transformation',
      'Validation',
      'Data Storage',
      'Analytics',
    ],

    structure: `📁 Data Pipeline
│
├── 📁 src
│   ├── 📁 extract
│   ├── 📁 transform
│   ├── 📁 validate
│   └── 📁 load
│
├── 📁 data
│   ├── 📁 input
│   └── 📁 output
│
├── 📁 config
└── 📄 README.md`,
  },

  'Microservices Architecture': {
    overview:
      'A distributed application architecture that separates business capabilities into independently deployable services.',

    features: [
      'Independent services',
      'Service-to-service communication',
      'Containerized deployment',
      'API-based communication',
      'Scalable architecture',
      'Service isolation',
    ],

    skills: [
      'Microservices',
      'REST API',
      'Docker',
      'Backend Development',
      'API Design',
      'System Design',
    ],

    architecture: [
      'Client',
      'API Gateway',
      'Authentication Service',
      'Business Services',
      'Service Communication',
      'Databases',
    ],

    structure: `📁 Microservices Architecture
│
├── 📁 api-gateway
│
├── 📁 services
│   ├── 📁 user-service
│   ├── 📁 order-service
│   └── 📁 product-service
│
├── 📁 infrastructure
│   └── 📁 docker
│
└── 📄 README.md`,
  },

  'Analytics Platform': {
    overview:
      'A data analysis and reporting platform designed to process information and present useful insights through dashboards and visual reports.',

    features: [
      'Interactive analytics dashboard',
      'Data visualization',
      'Report generation',
      'Data filtering',
      'Analytics summaries',
      'Responsive reporting interface',
    ],

    skills: [
      'React',
      'MongoDB',
      'Data Visualization',
      'REST API',
      'Data Analysis',
      'Dashboard Development',
    ],

    architecture: [
      'Data Sources',
      'Data Processing',
      'Backend API',
      'Analytics Services',
      'React Dashboard',
      'Reports & Visualizations',
    ],

    structure: `📁 Analytics Platform
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 dashboard
│   ├── 📁 charts
│   └── 📁 services
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 services
│   └── 📁 routes
│
├── 📁 data
│   ├── 📁 datasets
│   └── 📁 processing
│
└── 📄 README.md`,
  },

  'Blog Platform': {
    overview:
      'A content management platform for creating, publishing, organizing, and managing blog content.',

    features: [
      'Blog post creation',
      'Content editing',
      'Category management',
      'Post publishing',
      'User authentication',
      'Content search',
    ],

    skills: [
      'React',
      'JavaScript',
      'REST API',
      'CRUD Operations',
      'Authentication',
      'Database Management',
    ],

    architecture: [
      'User',
      'Blog Frontend',
      'REST API',
      'Content Service',
      'Database',
      'Published Content',
    ],

    structure: `📁 Blog Platform
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 pages
│   ├── 📁 editor
│   └── 📁 services
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 services
│   └── 📁 routes
│
├── 📁 database
│   └── 📄 posts
│
└── 📄 README.md`,
  },
};

/*
|--------------------------------------------------------------------------
| FALLBACK DETAILS
|--------------------------------------------------------------------------
| If a project exists in CognoDB but is not yet listed above,
| it will still get a useful details view.
*/

const defaultProjectDetails = {
  overview:
    'A real-world software project demonstrating practical skills, technologies, application architecture, and development practices.',

  features: [
    'User-friendly application interface',
    'Technology-based implementation',
    'Data processing and management',
    'API or service integration',
    'Responsive application design',
  ],

  skills: [
    'Application Development',
    'Problem Solving',
    'API Integration',
    'Database Management',
    'Responsive Design',
  ],

  architecture: [
    'User',
    'Frontend Application',
    'API Layer',
    'Backend Services',
    'Database',
    'Response',
  ],

  structure: `📁 Project
│
├── 📁 frontend
│   ├── 📁 components
│   ├── 📁 pages
│   └── 📁 services
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 services
│   └── 📁 routes
│
├── 📁 database
│
└── 📄 README.md`,
};

export default function Projects() {
  const difficulties = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState('');

  const [activeDifficulty, setActiveDifficulty] =
    useState('All');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [selectedProject, setSelectedProject] =
    useState(null);

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/projects');

      const projectData =
        response?.data?.data || [];

      if (!Array.isArray(projectData)) {
        throw new Error(
          'Invalid projects response from server.'
        );
      }

      const formattedProjects =
        projectData.map((project, index) => ({
          id:
            project?.id ||
            project?.name ||
            `project-${index}`,

          name:
            project?.name ||
            'Unknown Project',

          description:
            project?.description ||
            'No description available.',

          difficulty:
            project?.difficulty ||
            'Not specified',

          technologies:
            Array.isArray(project?.technologies)
              ? project.technologies.filter(Boolean)
              : [],

          duration:
            project?.duration ||
            'Not specified',

          skills:
            Array.isArray(project?.skills)
              ? project.skills.filter(Boolean)
              : [],
        }));

      setProjects(formattedProjects);
    } catch (err) {
      console.error(
        'Failed to load projects:',
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load projects from CognoDB.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProjects();
  }, []);

  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener(
        'keydown',
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [selectedProject]);

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return projects.filter((project) => {
      const projectName =
        project?.name?.toLowerCase() || '';

      const description =
        project?.description?.toLowerCase() || '';

      const technologyText =
        Array.isArray(project?.technologies)
          ? project.technologies
              .join(' ')
              .toLowerCase()
          : '';

      const matchesSearch =
        !query ||
        projectName.includes(query) ||
        description.includes(query) ||
        technologyText.includes(query);

      const matchesDifficulty =
        activeDifficulty === 'All' ||
        project?.difficulty ===
          activeDifficulty;

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [
    projects,
    search,
    activeDifficulty,
  ]);

  // =========================================================
  // PROJECT DETAILS
  // =========================================================

  const getProjectDetails = (project) => {
    return (
      projectDetails?.[project?.name] ||
      defaultProjectDetails
    );
  };

  // =========================================================
  // OPEN MODAL
  // =========================================================

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  const selectedDetails =
    selectedProject
      ? getProjectDetails(selectedProject)
      : null;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <h1 className="mb-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
          Project Portfolio
        </h1>

        <p className="text-lg text-slate-400">
          Real-world projects that demonstrate key
          skills and technologies.
        </p>
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="space-y-6 rounded-[24px] border border-slate-800 bg-slate-900/75 p-6">

        {/* SEARCH */}

        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search projects
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="e.g., E-Commerce, Dashboard, API..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/55 focus:outline-none"
            />
          </div>
        </div>

        {/* DIFFICULTY */}

        <div>
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Filter by difficulty
          </label>

          <div className="flex flex-wrap gap-2">
            {difficulties.map(
              (difficulty) => {
                const isActive =
                  activeDifficulty ===
                  difficulty;

                return (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() =>
                      setActiveDifficulty(
                        difficulty
                      )
                    }
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-indigo-500/40 bg-indigo-500/15 text-white'
                        : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-400/40 hover:text-white'
                    }`}
                  >
                    {difficulty}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          RESULTS
      ================================================== */}

      <div>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <p className="text-sm text-slate-400">
            {loading
              ? 'Loading projects...'
              : `Showing ${filteredProjects.length} of ${projects.length} projects`}
          </p>

          {!loading && (
            <button
              type="button"
              onClick={loadProjects}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/40 hover:text-white sm:self-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh projects
            </button>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-[300px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              )
            )}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <p className="text-sm font-medium text-red-300">
              Unable to load projects.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProjects}
              className="mt-5 rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
              <p className="text-slate-300">
                No projects found in CognoDB.
              </p>
            </div>
          )}

        {/* NO SEARCH RESULTS */}

        {!loading &&
          !error &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
              <p className="text-slate-300">
                No projects match your search or
                difficulty filter.
              </p>
            </div>
          )}

        {/* PROJECT CARDS */}

        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredProjects.map(
                (project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={
                      handleProjectClick
                    }
                  />
                )
              )}

            </div>
          )}
      </div>

      {/* ====================================================
          PROJECT DETAILS MODAL
      ==================================================== */}

      {selectedProject && selectedDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={closeProjectModal}
        >

          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/95 p-6 backdrop-blur md:p-8">

              <div className="flex items-start justify-between gap-5">

                <div>
                  <span className="mb-3 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wider text-indigo-300">
                    PROJECT DETAILS
                  </span>

                  <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {selectedProject.name}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
                    {selectedProject.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeProjectModal}
                  aria-label="Close project details"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-400 transition hover:border-indigo-400/50 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>
            </div>

            {/* ==================================================
                MODAL BODY
            ================================================== */}

            <div className="space-y-10 p-6 md:p-8">

              {/* BASIC INFORMATION */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Difficulty
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {selectedProject.difficulty ||
                      'Not specified'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Duration
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {selectedProject.duration ||
                      'Not specified'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Technologies
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {selectedProject.technologies
                      ?.length || 0}
                  </p>
                </div>

              </div>

              {/* ==================================================
                  OVERVIEW
              ================================================== */}

              <section>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-white">
                    Project Overview
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    What this project is about.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-sm leading-7 text-slate-300">
                    {selectedDetails.overview}
                  </p>
                </div>
              </section>

              {/* ==================================================
                  KEY FEATURES
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    Key Features
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Main functionality demonstrated by the project.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  {selectedDetails.features.map(
                    (feature, index) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </span>

                        <span className="pt-1 text-sm text-slate-300">
                          {feature}
                        </span>
                      </div>
                    )
                  )}

                </div>
              </section>

              {/* ==================================================
                  TECHNOLOGIES
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    Technologies Used
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Technologies associated with this project.
                  </p>
                </div>

                {selectedProject.technologies
                  ?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {selectedProject.technologies.map(
                      (tech) => (
                        <TechnologyBadge
                          key={tech}
                          tech={tech}
                          variant="small"
                        />
                      )
                    )}

                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No technologies available.
                  </p>
                )}
              </section>

              {/* ==================================================
                  SKILLS
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    Skills Demonstrated
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Skills that can be practiced or demonstrated
                    through this project.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">

                  {selectedDetails.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              </section>

              {/* ==================================================
                  ARCHITECTURE
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    How It Works
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    High-level flow of the project.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <div className="flex min-w-max items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                    {selectedDetails.architecture.map(
                      (step, index) => (
                        <div
                          key={`${step}-${index}`}
                          className="flex items-center gap-3"
                        >

                          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-200">
                            {step}
                          </div>

                          {index <
                            selectedDetails
                              .architecture
                              .length -
                              1 && (
                            <span className="text-lg text-slate-600">
                              →
                            </span>
                          )}

                        </div>
                      )
                    )}

                  </div>
                </div>
              </section>

              {/* ==================================================
                  PROJECT STRUCTURE
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    Project Structure
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Example project organization and architecture.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">

                  {/* TERMINAL HEADER */}

                  <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">

                    <span className="h-3 w-3 rounded-full bg-rose-400/70" />

                    <span className="h-3 w-3 rounded-full bg-amber-400/70" />

                    <span className="h-3 w-3 rounded-full bg-emerald-400/70" />

                    <span className="ml-3 text-xs text-slate-500">
                      project-structure
                    </span>

                  </div>

                  {/* TREE */}

                  <div className="overflow-x-auto p-5">

                    <pre className="font-mono text-sm leading-7 text-slate-300">
                      {selectedDetails.structure}
                    </pre>

                  </div>

                </div>
              </section>

              {/* ==================================================
                  LEARNING OUTCOMES
              ================================================== */}

              <section>
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-white">
                    Learning Outcomes
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    What this project helps demonstrate.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  {[
                    'Build and organize a real-world application',
                    'Work with multiple technologies together',
                    'Design reusable application components',
                    'Understand frontend and backend communication',
                    'Work with APIs and application data',
                    'Apply practical software development concepts',
                  ].map((outcome) => (
                    <div
                      key={outcome}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <span className="mt-0.5 text-emerald-400">
                        ✓
                      </span>

                      <span className="text-sm leading-6 text-slate-300">
                        {outcome}
                      </span>
                    </div>
                  ))}

                </div>
              </section>

            </div>

            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900/95 p-5 backdrop-blur">

              <div className="flex items-center justify-between gap-4">

                <p className="hidden text-xs text-slate-600 sm:block">
                  Press ESC or click outside to close
                </p>

                <button
                  type="button"
                  onClick={closeProjectModal}
                  className="ml-auto rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}