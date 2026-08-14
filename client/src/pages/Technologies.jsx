import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

import {
  FaAws,
  FaDocker,
  FaReact,
  FaNodeJs,
  FaAngular,
  FaDatabase,
  FaCloud,
  FaCode,
  FaServer,
  FaGithub,
  FaCogs,
  FaProjectDiagram,
  FaBolt,
  FaMicrosoft,
} from 'react-icons/fa';

import { FiSearch, FiCpu } from 'react-icons/fi';

/*
|--------------------------------------------------------------------------
| Technology Icons
|--------------------------------------------------------------------------
|
| We are intentionally using react-icons/fa here instead of
| react-icons/si because the installed react-icons version may
| not contain all Simple Icons exports.
|
*/

const technologyIcons = {
  Django: FaCode,
  'Express.js': FaServer,
  'GitHub Actions': FaGithub,
  Jenkins: FaCogs,
  Redis: FaBolt,
  AWS: FaAws,
  Azure: FaMicrosoft,
  Docker: FaDocker,
  MongoDB: FaDatabase,
  PostgreSQL: FaDatabase,
  Angular: FaAngular,
  React: FaReact,
  'Vue.js': FaCode,
  Kubernetes: FaProjectDiagram,
  'Node.js': FaNodeJs,
};

/*
|--------------------------------------------------------------------------
| Category Styles
|--------------------------------------------------------------------------
*/

const categoryStyles = {
  'Backend Framework': {
    icon: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/30',
    badge:
      'border-violet-400/40 bg-violet-500/10 text-violet-300',
  },

  'CI/CD': {
    icon: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400/30',
    badge:
      'border-cyan-400/40 bg-cyan-500/10 text-cyan-300',
  },

  Cache: {
    icon: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    badge:
      'border-amber-400/40 bg-amber-500/10 text-amber-300',
  },

  'Cloud Platform': {
    icon: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-400/30',
    badge:
      'border-sky-400/40 bg-sky-500/10 text-sky-300',
  },

  Containerization: {
    icon: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    badge:
      'border-blue-400/40 bg-blue-500/10 text-blue-300',
  },

  Database: {
    icon: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    badge:
      'border-emerald-400/40 bg-emerald-500/10 text-emerald-300',
  },

  'Frontend Framework': {
    icon: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400/30',
    badge:
      'border-cyan-400/40 bg-cyan-500/10 text-cyan-300',
  },

  Orchestration: {
    icon: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    badge:
      'border-blue-400/40 bg-blue-500/10 text-blue-300',
  },

  Runtime: {
    icon: 'text-green-300',
    bg: 'bg-green-500/10',
    border: 'border-green-400/30',
    badge:
      'border-green-400/40 bg-green-500/10 text-green-300',
  },
};

const defaultCategoryStyle = {
  icon: 'text-indigo-300',
  bg: 'bg-indigo-500/10',
  border: 'border-indigo-400/30',
  badge:
    'border-indigo-400/40 bg-indigo-500/10 text-indigo-300',
};

/*
|--------------------------------------------------------------------------
| Technology Card
|--------------------------------------------------------------------------
*/

function TechnologyCard({ technology }) {
  const Icon =
    technologyIcons[technology.name] || FiCpu;

  const styles =
    categoryStyles[technology.category] ||
    defaultCategoryStyle;

  return (
    <article
      className="
        group
        rounded-[22px]
        border
        border-slate-800
        bg-slate-900/75
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-500/40
        hover:bg-slate-900
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]
      "
    >
      {/* Technology Header */}
      <div className="flex items-center gap-5">

        {/* Icon */}
        <div
          className={`
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            ${styles.border}
            ${styles.bg}
            transition-transform
            duration-300
            group-hover:scale-105
          `}
        >
          <Icon
            className={`
              h-9
              w-9
              ${styles.icon}
            `}
          />
        </div>

        {/* Technology Information */}
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-white">
            {technology.name}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {technology.category}
          </p>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mt-6">
        <span
          className={`
            inline-flex
            rounded-full
            border
            px-3
            py-1.5
            text-xs
            font-semibold
            ${styles.badge}
          `}
        >
          {technology.category}
        </span>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Technologies Page
|--------------------------------------------------------------------------
*/

export default function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Fetch Technologies
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadTechnologies() {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.get('/technologies');

        if (!mounted) {
          return;
        }

        const data = response?.data?.data;

        if (Array.isArray(data)) {
          setTechnologies(data);
        } else {
          setTechnologies([]);
          setError(
            'Invalid technologies data received from API.'
          );
        }
      } catch (err) {
        console.error(
          'Failed to load technologies:',
          err
        );

        if (mounted) {
          setTechnologies([]);

          setError(
            err?.response?.data?.message ||
              'Failed to load technologies from the database.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTechnologies();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Generate Categories Dynamically
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        technologies
          .map(
            (technology) =>
              technology.category
          )
          .filter(Boolean)
      ),
    ];

    return ['All', ...uniqueCategories];
  }, [technologies]);

  /*
  |--------------------------------------------------------------------------
  | Search + Category Filtering
  |--------------------------------------------------------------------------
  */

  const filteredTechnologies = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return technologies.filter(
      (technology) => {
        const name =
          technology.name?.toLowerCase() ||
          '';

        const category =
          technology.category?.toLowerCase() ||
          '';

        const matchesSearch =
          !query ||
          name.includes(query) ||
          category.includes(query);

        const matchesCategory =
          selectedCategory === 'All' ||
          technology.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    technologies,
    search,
    selectedCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-[-0.05em]
              text-white
              md:text-5xl
            "
          >
            Explore Technologies
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            Discover the technologies connected
            to roles, skills and career paths.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="
                  h-44
                  animate-pulse
                  rounded-[22px]
                  border
                  border-slate-800
                  bg-slate-900/70
                "
              />
            )
          )}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="space-y-8">

        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-[-0.05em]
              text-white
              md:text-5xl
            "
          >
            Explore Technologies
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            Discover the technologies connected
            to roles, skills and career paths.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-red-500/25
            bg-red-500/10
            p-8
            text-center
          "
        >
          <h2 className="text-xl font-bold text-white">
            Unable to load technologies
          </h2>

          <p className="mt-2 text-slate-400">
            {error}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Make sure the backend and CognoDB
            connection are running.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>

        <div
          className="
            mb-4
            inline-flex
            rounded-full
            border
            border-indigo-500/30
            bg-indigo-500/10
            px-3
            py-1.5
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-indigo-200
          "
        >
          Technology Graph
        </div>

        <h1
          className="
            text-4xl
            font-bold
            tracking-[-0.05em]
            text-white
            md:text-5xl
          "
        >
          Explore Technologies
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-lg
            text-slate-400
          "
        >
          Discover the technologies connected
          to roles, skills and career paths in
          the SkillGraph knowledge graph.
        </p>

      </section>

      {/* Search + Filters */}
      <section
        className="
          space-y-7
          rounded-[24px]
          border
          border-slate-800
          bg-slate-900/75
          p-6
        "
      >

        {/* Search */}
        <div>

          <label
            htmlFor="technology-search"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-300
            "
          >
            Search technologies
          </label>

          <div className="relative">

            <input
              id="technology-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="e.g., React, AWS, Docker..."
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950/80
                px-4
                py-3
                pr-12
                text-slate-100
                outline-none
                placeholder:text-slate-500
                focus:border-indigo-400/60
              "
            />

            <FiSearch
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-slate-500
              "
            />

          </div>
        </div>

        {/* Categories */}
        <div>

          <label
            className="
              mb-3
              block
              text-sm
              font-medium
              text-slate-300
            "
          >
            Filter by category
          </label>

          <div className="flex flex-wrap gap-2">

            {categories.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-sm
                      font-medium
                      transition-all
                      ${
                        active
                          ? 'border-indigo-500/50 bg-indigo-500/15 text-white'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-400/40 hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              }
            )}

          </div>
        </div>

      </section>

      {/* Results */}
      <section>

        <div
          className="
            mb-6
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <p className="text-sm text-slate-400">
            Showing{' '}
            <span className="font-semibold text-white">
              {filteredTechnologies.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-white">
              {technologies.length}
            </span>{' '}
            technologies
          </p>

          {(search ||
            selectedCategory !==
              'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                text-sm
                font-medium
                text-indigo-300
                transition-colors
                hover:text-indigo-200
              "
            >
              Clear filters
            </button>
          )}

        </div>

        {/* Empty State */}
        {filteredTechnologies.length ===
          0 && (
          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/70
              px-6
              py-16
              text-center
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-indigo-500/10
                text-indigo-300
              "
            >
              <FiSearch className="h-7 w-7" />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-white
              "
            >
              No technologies found
            </h2>

            <p className="mt-2 text-slate-400">
              Try changing your search or
              category filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-6
                rounded-xl
                bg-indigo-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-indigo-500
              "
            >
              Reset Filters
            </button>

          </div>
        )}

        {/* Technology Cards */}
        {filteredTechnologies.length >
          0 && (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredTechnologies.map(
              (technology) => (
                <TechnologyCard
                  key={`${technology.name}-${technology.category}`}
                  technology={technology}
                />
              )
            )}
          </div>
        )}

      </section>
    </div>
  );
}