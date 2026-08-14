import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================================
  // FILTER OPTIONS
  // These match the actual categories in CognoDB.
  // ============================================================

  const difficulties = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const categories = [
    'All',
    'Programming',
    'Frontend',
    'Backend',
    'Data',
    'Database',
    'DevOps',
    'Cloud',
    'QA',
    'Tools',
    'Architecture',
  ];

  // ============================================================
  // NORMALIZE VALUE
  // ============================================================

  const normalize = (value) => {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');
  };

  // ============================================================
  // GET PROPERTIES
  // ============================================================

  const getProperties = (node) => {
    if (!node) {
      return {};
    }

    if (
      node.properties &&
      typeof node.properties === 'object'
    ) {
      return node.properties;
    }

    return node;
  };

  // ============================================================
  // SKILL ICONS
  // ============================================================

  const iconMap = {
    // Programming
    javascript: {
      icon: 'https://cdn.simpleicons.org/javascript/F7DF1E',
      fallback: 'JS',
    },

    python: {
      icon: 'https://cdn.simpleicons.org/python/3776AB',
      fallback: 'PY',
    },

    typescript: {
      icon: 'https://cdn.simpleicons.org/typescript/3178C6',
      fallback: 'TS',
    },

    // Frontend
    react: {
      icon: 'https://cdn.simpleicons.org/react/61DAFB',
      fallback: 'R',
    },

    'html/css': {
      icon: 'https://cdn.simpleicons.org/html5/E34F26',
      fallback: 'HTML',
    },

    html: {
      icon: 'https://cdn.simpleicons.org/html5/E34F26',
      fallback: 'HTML',
    },

    css: {
      icon: 'https://cdn.simpleicons.org/css3/1572B6',
      fallback: 'CSS',
    },

    vue: {
      icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
      fallback: 'V',
    },

    'vue.js': {
      icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
      fallback: 'V',
    },

    // Backend
    'node.js': {
      icon: 'https://cdn.simpleicons.org/nodedotjs/339933',
      fallback: 'N',
    },

    nodejs: {
      icon: 'https://cdn.simpleicons.org/nodedotjs/339933',
      fallback: 'N',
    },

    graphql: {
      icon: 'https://cdn.simpleicons.org/graphql/E10098',
      fallback: 'GQL',
    },

    'rest apis': {
      icon: 'https://cdn.simpleicons.org/postman/FF6C37',
      fallback: 'API',
    },

    'performance optimization': {
      icon: 'https://cdn.simpleicons.org/speedtest/141526',
      fallback: 'PO',
    },

    // Cloud
    aws: {
      icon: 'https://cdn.simpleicons.org/amazonwebservices/FF9900',
      fallback: 'AWS',
    },

    azure: {
      icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4',
      fallback: 'AZ',
    },

    // Data
    'data cleaning': {
      icon: 'https://cdn.simpleicons.org/databricks/FF3621',
      fallback: 'DC',
    },

    'data visualization': {
      icon: 'https://cdn.simpleicons.org/tableau/E97627',
      fallback: 'DV',
    },

    'machine learning': {
      icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00',
      fallback: 'ML',
    },

    // Database
    'database design': {
      icon: 'https://cdn.simpleicons.org/databricks/FF3621',
      fallback: 'DB',
    },

    mongodb: {
      icon: 'https://cdn.simpleicons.org/mongodb/47A248',
      fallback: 'MDB',
    },

    sql: {
      icon: 'https://cdn.simpleicons.org/mysql/4479A1',
      fallback: 'SQL',
    },

    // DevOps
    'ci/cd': {
      icon: 'https://cdn.simpleicons.org/githubactions/2088FF',
      fallback: 'CI',
    },

    docker: {
      icon: 'https://cdn.simpleicons.org/docker/2496ED',
      fallback: 'D',
    },

    kubernetes: {
      icon: 'https://cdn.simpleicons.org/kubernetes/326CE5',
      fallback: 'K8S',
    },

    // QA
    testing: {
      icon: 'https://cdn.simpleicons.org/jest/C21325',
      fallback: 'QA',
    },

    // Tools
    git: {
      icon: 'https://cdn.simpleicons.org/git/F05032',
      fallback: 'GIT',
    },

    // Architecture
    security: {
      icon: 'https://cdn.simpleicons.org/owasp/000000',
      fallback: 'S',
    },

    'system design': {
      icon: 'https://cdn.simpleicons.org/diagramsdotnet/FFFFFF',
      fallback: 'SD',
    },
  };

  // ============================================================
  // GET ICON
  // ============================================================

  const getSkillIcon = (name) => {
    const key = normalize(name);

    if (iconMap[key]) {
      return iconMap[key];
    }

    const fallback = String(name || 'SK')
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return {
      icon: null,
      fallback,
    };
  };

  // ============================================================
  // NORMALIZE CATEGORY
  // ============================================================

  const normalizeCategory = (value) => {
    const normalized = normalize(value);

    const map = {
      programming: 'Programming',

      frontend: 'Frontend',
      'front end': 'Frontend',

      backend: 'Backend',
      'back end': 'Backend',

      data: 'Data',

      database: 'Database',
      databases: 'Database',

      devops: 'DevOps',
      'dev ops': 'DevOps',

      cloud: 'Cloud',

      qa: 'QA',

      tools: 'Tools',

      architecture: 'Architecture',
    };

    return map[normalized] || null;
  };

  // ============================================================
  // GET CATEGORY
  // ============================================================

  const getCategory = (node) => {
    const properties = getProperties(node);

    // First use actual CognoDB category
    const databaseCategory =
      properties.category ||
      properties.categoryName ||
      properties.group ||
      properties.skillCategory ||
      properties.domain ||
      node.category ||
      node.categoryName;

    const normalizedDatabaseCategory =
      normalizeCategory(databaseCategory);

    if (normalizedDatabaseCategory) {
      return normalizedDatabaseCategory;
    }

    // ==========================================================
    // FALLBACK
    // Only used when category is missing.
    // ==========================================================

    const name = normalize(
      properties.name ||
        properties.label ||
        properties.title ||
        properties.skillName ||
        node.name ||
        node.label ||
        node.title
    );

    if (
      [
        'react',
        'html/css',
        'html',
        'css',
        'vue',
        'vue.js',
      ].includes(name)
    ) {
      return 'Frontend';
    }

    if (
      [
        'node.js',
        'nodejs',
        'graphql',
        'rest apis',
        'performance optimization',
      ].includes(name)
    ) {
      return 'Backend';
    }

    if (
      [
        'data cleaning',
        'data visualization',
        'machine learning',
      ].includes(name)
    ) {
      return 'Data';
    }

    if (
      [
        'database design',
        'mongodb',
        'sql',
      ].includes(name)
    ) {
      return 'Database';
    }

    if (
      [
        'ci/cd',
        'docker',
        'kubernetes',
      ].includes(name)
    ) {
      return 'DevOps';
    }

    if (
      [
        'aws',
        'azure',
      ].includes(name)
    ) {
      return 'Cloud';
    }

    if (name === 'testing') {
      return 'QA';
    }

    if (name === 'git') {
      return 'Tools';
    }

    if (
      [
        'security',
        'system design',
      ].includes(name)
    ) {
      return 'Architecture';
    }

    if (
      [
        'javascript',
        'python',
        'typescript',
      ].includes(name)
    ) {
      return 'Programming';
    }

    return null;
  };

  // ============================================================
  // NORMALIZE DIFFICULTY
  // ============================================================

  const normalizeDifficulty = (value) => {
    const normalized = normalize(value);

    const map = {
      beginner: 'Beginner',
      basic: 'Beginner',
      easy: 'Beginner',

      intermediate: 'Intermediate',
      medium: 'Intermediate',

      advanced: 'Advanced',
      expert: 'Advanced',
      hard: 'Advanced',
    };

    return map[normalized] || null;
  };

  // ============================================================
  // GET DIFFICULTY
  // ============================================================

  const getDifficulty = (node) => {
    const properties = getProperties(node);

    const databaseDifficulty =
      properties.difficulty ||
      properties.level ||
      properties.experienceLevel ||
      properties.proficiency ||
      properties.skillLevel ||
      node.difficulty ||
      node.level;

    /*
      IMPORTANT:
      We use the real CognoDB difficulty.
      
      Database:
      Beginner      = 4
      Intermediate  = 13
      Advanced      = 8
    */

    return (
      normalizeDifficulty(databaseDifficulty) ||
      'Intermediate'
    );
  };

  // ============================================================
  // GET SKILL NAME
  // ============================================================

  const getSkillName = (node) => {
    const properties = getProperties(node);

    return (
      properties.name ||
      properties.label ||
      properties.title ||
      properties.skillName ||
      node.name ||
      node.label ||
      node.title ||
      'Unknown Skill'
    );
  };

  // ============================================================
  // LOAD SKILLS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/graph');

        console.log(
          'FULL /graph RESPONSE:',
          response.data
        );

        const responseData = response.data;

        let nodes = [];

        // ======================================================
        // FIND NODES
        // ======================================================

        if (Array.isArray(responseData)) {
          nodes = responseData;
        } else if (
          Array.isArray(responseData?.nodes)
        ) {
          nodes = responseData.nodes;
        } else if (
          Array.isArray(responseData?.data?.nodes)
        ) {
          nodes = responseData.data.nodes;
        } else if (
          Array.isArray(responseData?.result?.nodes)
        ) {
          nodes = responseData.result.nodes;
        }

        console.log(
          'TOTAL GRAPH NODES:',
          nodes.length
        );

        // ======================================================
        // ONLY SKILL NODES
        // ======================================================

        const skillNodes = nodes.filter((node) => {
          const properties =
            getProperties(node);

          const nodeType = normalize(
            node.type ||
              properties.type ||
              properties.nodeType
          );

          const labels = Array.isArray(
            node.labels
          )
            ? node.labels
            : [];

          const hasSkillLabel =
            labels.some(
              (label) =>
                normalize(label) === 'skill'
            );

          return (
            nodeType === 'skill' ||
            hasSkillLabel
          );
        });

        console.log(
          'SKILL NODES:',
          skillNodes
        );

        // ======================================================
        // CONVERT TO FRONTEND OBJECT
        // ======================================================

        const convertedSkills =
          skillNodes
            .map((node, index) => {
              const properties =
                getProperties(node);

              const name =
                getSkillName(node);

              const skill = {
                id:
                  node.id ??
                  node.elementId ??
                  properties.id ??
                  `skill-${index}`,

                name,

                description:
                  properties.description ||
                  node.description ||
                  '',

                category:
                  getCategory(node),

                difficulty:
                  getDifficulty(node),
              };

              console.log(
                'NORMALIZED SKILL:',
                skill
              );

              return skill;
            })
            .filter(
              (skill) =>
                skill.name &&
                skill.name !==
                  'Unknown Skill'
            );

        console.log(
          'FINAL SKILLS:',
          convertedSkills
        );

        if (mounted) {
          setSkills(
            convertedSkills
          );
        }
      } catch (err) {
        console.error(
          'Failed to load skills:',
          err
        );

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              'Unable to load skills from CognoDB.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // FILTER SKILLS
  // ============================================================

  const filteredSkills = useMemo(() => {
    const searchValue =
      normalize(search);

    return skills.filter((skill) => {
      // Search
      const matchesSearch =
        searchValue === '' ||
        normalize(
          skill.name
        ).includes(searchValue) ||
        normalize(
          skill.category
        ).includes(searchValue);

      // Difficulty
      const matchesDifficulty =
        difficulty === 'All' ||
        normalize(
          skill.difficulty
        ) === normalize(difficulty);

      // Category
      const matchesCategory =
        category === 'All' ||
        normalize(
          skill.category
        ) === normalize(category);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesCategory
      );
    });
  }, [
    skills,
    search,
    difficulty,
    category,
  ]);

  // ============================================================
  // RESET
  // ============================================================

  const clearFilters = () => {
    setSearch('');
    setDifficulty('All');
    setCategory('All');
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="mb-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
            Explore Skills
          </h1>

          <p className="text-lg text-slate-400">
            Discover the skills needed for
            different career paths and roles.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-900/75 p-12 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading skills...
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (error) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="mb-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
            Explore Skills
          </h1>

          <p className="text-lg text-slate-400">
            Discover the skills needed for
            different career paths and roles.
          </p>
        </div>

        <div className="rounded-[24px] border border-red-500/20 bg-slate-900/75 p-10 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            !
          </div>

          <h2 className="mt-4 text-xl font-semibold text-white">
            Unable to load skills
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="space-y-8">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <h1 className="mb-3 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
          Explore Skills
        </h1>

        <p className="text-lg text-slate-400">
          Discover the skills needed for
          different career paths and roles.
        </p>
      </div>

      {/* ======================================================
          FILTER PANEL
      ====================================================== */}

      <div className="space-y-6 rounded-[24px] border border-slate-800 bg-slate-900/75 p-6">

        {/* SEARCH */}

        <div>
          <label
            htmlFor="skill-search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Search skills
          </label>

          <div className="relative">

            <input
              id="skill-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="e.g., React, Python, System Design..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/55 focus:outline-none"
            />

            <svg
              className="absolute right-3 top-3.5 h-5 w-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

          </div>
        </div>

        {/* ====================================================
            DIFFICULTY FILTER
        ==================================================== */}

        <div>

          <label className="mb-3 block text-sm font-medium text-slate-300">
            Filter by difficulty
          </label>

          <div className="flex flex-wrap gap-2">

            {difficulties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  /*
                    Difficulty filter works independently.

                    When selecting a difficulty,
                    reset category to All.
                  */

                  setDifficulty(item);
                  setCategory('All');
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  difficulty === item
                    ? 'border-indigo-500/50 bg-indigo-500/20 text-white'
                    : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-400/40 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}

          </div>
        </div>

        {/* ====================================================
            CATEGORY FILTER
        ==================================================== */}

        <div>

          <label className="mb-3 block text-sm font-medium text-slate-300">
            Filter by category
          </label>

          <div className="flex flex-wrap gap-2">

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  /*
                    Category filter works independently.

                    When selecting a category,
                    reset difficulty to All.
                  */

                  setCategory(item);
                  setDifficulty('All');
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  category === item
                    ? 'border-indigo-500/50 bg-indigo-500/20 text-white'
                    : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-400/40 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}

          </div>
        </div>

      </div>

      {/* ======================================================
          RESULT HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">

          Showing{' '}

          <span className="font-semibold text-white">
            {filteredSkills.length}
          </span>

          {' '}of{' '}

          <span className="font-semibold text-white">
            {skills.length}
          </span>

          {' '}skills

        </p>

        {(search ||
          difficulty !== 'All' ||
          category !== 'All') && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* ======================================================
          NO RESULTS
      ====================================================== */}

      {filteredSkills.length === 0 ? (

        <div className="rounded-[24px] border border-slate-800 bg-slate-900/75 p-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">

            <svg
              className="h-7 w-7 text-indigo-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-xl font-semibold text-white">
            No skills found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Reset Filters
          </button>

        </div>

      ) : (

        /* ====================================================
           SKILLS GRID
        ==================================================== */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredSkills.map((skill) => {
            const skillIcon =
              getSkillIcon(skill.name);

            return (

              <article
                key={skill.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/75 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-slate-900"
              >

                {/* ==================================================
                    ICON + NAME
                ================================================== */}

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/90">

                    {skillIcon.icon ? (

                      <img
                        src={skillIcon.icon}
                        alt={`${skill.name} icon`}
                        className="h-8 w-8 object-contain"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            'none';

                          const fallback =
                            event.currentTarget
                              .nextElementSibling;

                          if (fallback) {
                            fallback.style.display =
                              'flex';
                          }
                        }}
                      />

                    ) : null}

                    <span
                      className={`items-center justify-center text-xs font-bold text-indigo-300 ${
                        skillIcon.icon
                          ? 'hidden'
                          : 'flex'
                      }`}
                    >
                      {skillIcon.fallback}
                    </span>

                  </div>

                  <div className="min-w-0">

                    <h3 className="text-lg font-semibold text-white">
                      {skill.name}
                    </h3>

                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      {skill.category}
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    DIFFICULTY BADGE
                ================================================== */}

                <div className="mt-6">

                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      skill.difficulty ===
                      'Advanced'
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                        : skill.difficulty ===
                          'Beginner'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                    }`}
                  >
                    {skill.difficulty}
                  </span>

                </div>

                {/* ==================================================
                    HOVER LINE
                ================================================== */}

                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 via-sky-400 to-transparent transition-all duration-300 group-hover:w-full" />

              </article>

            );
          })}

        </div>

      )}

    </div>
  );
}