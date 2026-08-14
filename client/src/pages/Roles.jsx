import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  BriefcaseBusiness,
  RefreshCw,
} from 'lucide-react';

import RoleCard from '../components/RoleCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

import api from '../services/api';

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

const categories = [
  'All',
  'Engineering',
  'Product',
  'Infrastructure',
  'Data',
  'Architecture',
];

/*
|--------------------------------------------------------------------------
| Category fallback
|--------------------------------------------------------------------------
|
| The API already returns category.
| This map is only used if an older role does not have category.
|
*/

const CATEGORY_MAP = {
  'Frontend Developer': 'Engineering',
  'Backend Developer': 'Engineering',
  'Full Stack Developer': 'Engineering',
  'Data Analyst': 'Data',
  'Data Engineer': 'Data',
  'DevOps Engineer': 'Infrastructure',
  'UI/UX Developer': 'Product',
  'Software Engineer': 'Engineering',
  'Senior Full-Stack Engineer': 'Engineering',
  'Product Manager': 'Product',
  'Frontend Engineer': 'Engineering',
  'Data Scientist': 'Data',
  'Solutions Architect': 'Architecture',
};

/*
|--------------------------------------------------------------------------
| Get category
|--------------------------------------------------------------------------
*/

function getCategory(role) {
  return (
    role?.category ||
    CATEGORY_MAP[role?.name] ||
    'Engineering'
  );
}

/*
|--------------------------------------------------------------------------
| Normalize role
|--------------------------------------------------------------------------
*/

function normalizeRole(role, skills = []) {
  const roleName =
    role?.name ||
    role?.label ||
    'Unknown Role';

  return {
    id:
      role?.id ||
      roleName,

    name: roleName,

    description:
      role?.description ||
      'Explore the skills, technologies, projects, and learning resources connected to this role.',

    category: getCategory(role),

    seniority:
      role?.seniority ||
      'Professional',

    requiredSkills: Array.isArray(skills)
      ? skills.map((skill, index) => ({
          id:
            skill?.id ||
            skill?.name ||
            skill?.skillName ||
            `skill-${index}`,

          name:
            skill?.name ||
            skill?.skillName ||
            'Unknown Skill',

          description:
            skill?.description ||
            '',
        }))
      : [],

    technologies: [],

    recommendedProjects: [],

    relatedRoles: [],

    learningResources: [],
  };
}

/*
|--------------------------------------------------------------------------
| Fetch skills for a role
|--------------------------------------------------------------------------
*/

async function fetchRoleSkills(roleName) {
  try {
    const response = await api.get(
      `/roles/${encodeURIComponent(roleName)}/skills`
    );

    const data =
      response?.data?.data ||
      response?.data ||
      [];

    return Array.isArray(data)
      ? data
      : [];
  } catch (error) {
    console.warn(
      `Could not load skills for "${roleName}"`,
      error
    );

    return [];
  }
}

/*
|--------------------------------------------------------------------------
| Roles Page
|--------------------------------------------------------------------------
*/

export default function Roles() {
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState('');

  const [activeCategory, setActiveCategory] =
    useState('All');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Fetch roles
  |--------------------------------------------------------------------------
  */

  const fetchRoles = async () => {
    setLoading(true);
    setError('');

    try {
      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      | Use /roles instead of /graph.
      |
      | This guarantees that Roles.jsx and RoleDetails.jsx
      | use the same Role names from CognoDB.
      |--------------------------------------------------------------------------
      */

      const response =
        await api.get('/roles');

      const rolesData =
        response?.data?.data ||
        response?.data ||
        [];

      const roleList =
        Array.isArray(rolesData)
          ? rolesData
          : [];

      /*
      |--------------------------------------------------------------------------
      | Load skills for every role
      |--------------------------------------------------------------------------
      */

      const normalizedRoles =
        await Promise.all(
          roleList.map(async (role) => {
            const skills =
              await fetchRoleSkills(
                role.name
              );

            return normalizeRole(
              role,
              skills
            );
          })
        );

      setRoles(normalizedRoles);
    } catch (err) {
      console.error(
        'Failed to load roles:',
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load roles from the CognoDB database.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchRoles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search + category filtering
  |--------------------------------------------------------------------------
  */

  const filteredRoles = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return roles.filter((role) => {
      /*
      |--------------------------------------------------------------------------
      | Search
      |--------------------------------------------------------------------------
      */

      const matchesSearch =
        !query ||
        role.name
          .toLowerCase()
          .includes(query) ||

        role.description
          .toLowerCase()
          .includes(query) ||

        role.requiredSkills.some(
          (skill) =>
            skill.name
              .toLowerCase()
              .includes(query)
        );

      /*
      |--------------------------------------------------------------------------
      | Category
      |--------------------------------------------------------------------------
      */

      const matchesCategory =
        activeCategory === 'All' ||
        role.category === activeCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    roles,
    search,
    activeCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <section>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-300">

          <BriefcaseBusiness className="h-3.5 w-3.5" />

          Career Explorer

        </div>

        <h1 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">
          Explore Roles
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-400">
          Discover career roles and explore the skills
          connected to each opportunity through the
          SkillGraph knowledge graph.
        </p>

      </section>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}

      <section className="rounded-[24px] border border-slate-800 bg-slate-900/75 p-6">

        <div className="space-y-6">

          {/* Search */}

          <div>

            <label
              htmlFor="role-search"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Search roles
            </label>

            <div className="relative">

              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                id="role-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by role or skill..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-12 pr-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/10"
              />

            </div>

          </div>

          {/* Categories */}

          <div>

            <label className="mb-3 block text-sm font-medium text-slate-300">
              Filter by category
            </label>

            <div className="flex flex-wrap gap-2">

              {categories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category
                        )
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? 'border-indigo-500/50 bg-indigo-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-400/40 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          RESULTS HEADER
      ================================================== */}

      <section>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm text-slate-500">

              {loading
                ? 'Loading roles...'
                : `Showing ${filteredRoles.length} of ${roles.length} roles`}

            </p>

            {!loading &&
              !error &&
              search && (
                <p className="mt-1 text-xs text-slate-600">
                  Search results for "{search}"
                </p>
              )}

          </div>

          {!loading &&
            !error &&
            roles.length > 0 && (

              <button
                type="button"
                onClick={fetchRoles}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/40 hover:text-white sm:self-auto"
              >

                <RefreshCw className="h-4 w-4" />

                Refresh graph data

              </button>

            )}

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">

            <LoadingState
              count={6}
              variant="card"
            />

          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="rounded-[24px] border border-red-500/20 bg-slate-900/60 p-8">

            <ErrorState
              title="Unable to load roles"
              message={error}
              action={

                <button
                  type="button"
                  onClick={fetchRoles}
                  className="rounded-lg border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  Try again
                </button>

              }
            />

          </div>

        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          roles.length === 0 && (

            <div className="rounded-[24px] border border-slate-800 bg-slate-900/60 p-10">

              <EmptyState
                title="No roles available"
                description="The CognoDB database does not currently contain any Role nodes."
              />

            </div>

          )}

        {/* ==================================================
            NO SEARCH RESULTS
        ================================================== */}

        {!loading &&
          !error &&
          roles.length > 0 &&
          filteredRoles.length === 0 && (

            <div className="rounded-[24px] border border-slate-800 bg-slate-900/60 p-10">

              <EmptyState
                title="No matching roles"
                description="Try a different role name, skill, or category."
              />

            </div>

          )}

        {/* ==================================================
            ROLE CARDS
        ================================================== */}

        {!loading &&
          !error &&
          filteredRoles.length > 0 && (

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredRoles.map(
                (role) => (

                  <RoleCard
                    key={role.id}
                    role={role}
                  />

                )
              )}

            </div>

          )}

      </section>

    </div>
  );
}