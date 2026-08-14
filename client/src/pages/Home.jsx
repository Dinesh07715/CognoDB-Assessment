import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';
import SectionHeader from '../components/SectionHeader';
import RoleCard from '../components/RoleCard';

export default function Home() {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState('');

  /**
   * Load roles directly from CognoDB through the backend API.
   *
   * GET /api/roles
   */
  useEffect(() => {
    let mounted = true;

    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        setRolesError('');

        const response = await api.get('/roles');

        const result = response.data;

        if (!result?.success || !Array.isArray(result.data)) {
          throw new Error('Invalid roles response from server');
        }

        if (mounted) {
          setRoles(result.data);
        }
      } catch (error) {
        console.error('Failed to load homepage roles:', error);

        if (mounted) {
          setRolesError(
            error.response?.data?.message ||
              error.message ||
              'Failed to load career roles'
          );
        }
      } finally {
        if (mounted) {
          setLoadingRoles(false);
        }
      }
    };

    loadRoles();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Only show the first 6 roles on the homepage.
   * These are now real roles from CognoDB, not sample data.
   */
  const featuredRoles = roles.slice(0, 6);

  const workflow = [
    {
      number: '01',
      title: 'Role',
      description: 'Choose the career path you want to explore.',
      color: 'violet',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20c.7-3.6 2.9-5.5 6.5-5.5s5.8 1.9 6.5 5.5" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Skills',
      description: 'See the core skills required for that role.',
      color: 'sky',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m12 3 1.8 5.1L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.9L12 3Z" />
          <path d="m19 4 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Technologies',
      description: 'Discover the tools and technologies used.',
      color: 'cyan',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3.5" y="4" width="17" height="11.5" rx="1.5" />
          <path d="M8 20h8M12 15.5V20" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Projects',
      description: 'Find projects that help demonstrate those skills.',
      color: 'emerald',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="4" y="6.5" width="16" height="13" rx="1.5" />
          <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5M4 10h16" />
          <path d="M10 13h4" />
        </svg>
      ),
    },
    {
      number: '05',
      title: 'Learning Resources',
      description: 'Continue learning with curated resources.',
      color: 'amber',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" />
          <path d="M8 7h8M8 10h6" />
        </svg>
      ),
    },
  ];

  const colorMap = {
    violet: {
      border: 'border-violet-400/50',
      bg: 'bg-violet-500/10',
      text: 'text-violet-200',
      badge: 'bg-violet-600/80',
      line: 'bg-violet-500',
      dot: 'bg-violet-500',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.28)]',
    },

    sky: {
      border: 'border-sky-400/50',
      bg: 'bg-sky-500/10',
      text: 'text-sky-200',
      badge: 'bg-sky-600/80',
      line: 'bg-sky-500',
      dot: 'bg-sky-500',
      glow: 'shadow-[0_0_20px_rgba(14,165,233,0.25)]',
    },

    cyan: {
      border: 'border-cyan-400/50',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-200',
      badge: 'bg-cyan-600/80',
      line: 'bg-cyan-500',
      dot: 'bg-cyan-500',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    },

    emerald: {
      border: 'border-emerald-400/50',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-200',
      badge: 'bg-emerald-600/80',
      line: 'bg-emerald-500',
      dot: 'bg-emerald-500',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    },

    amber: {
      border: 'border-amber-400/50',
      bg: 'bg-amber-500/10',
      text: 'text-amber-200',
      badge: 'bg-amber-600/80',
      line: 'bg-amber-500',
      dot: 'bg-amber-500',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    },
  };

  return (
    <div className="space-y-16 md:space-y-20">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="py-8 md:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr]">

          <div className="max-w-xl">

            <div className="mb-5 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
              Career intelligence
            </div>

            <h1 className="text-4xl font-bold leading-[1.03] tracking-[-0.06em] text-white md:text-6xl">
              Understand the
              <br />
              skills behind your
              <br />
              <span className="text-indigo-400">career move.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              SkillGraph connects careers, skills, technologies, projects and
              learning resources so you can discover paths instead of viewing
              isolated lists.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/roles"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(124,106,246,0.35)] transition-colors hover:bg-indigo-500"
              >
                Explore Roles →
              </Link>

              <Link
                to="/graph"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-400/35 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-indigo-300 hover:bg-slate-900"
              >
                Open Graph Explorer
              </Link>

            </div>
          </div>

          {/* =====================================================
              HERO GRAPH
          ====================================================== */}
          <div className="relative">

            <div className="hero-graph">

              <div
                className="graph-line"
                style={{
                  left: '34%',
                  top: '50%',
                  width: '32%',
                }}
              />

              <div
                className="graph-line vertical"
                style={{
                  left: '49.5%',
                  top: '44%',
                  height: '112px',
                }}
              />

              <div
                className="graph-line"
                style={{
                  left: '50%',
                  top: '48%',
                  width: '30%',
                  transform: 'rotate(18deg)',
                }}
              />

              <div
                className="graph-line"
                style={{
                  left: '52%',
                  top: '50%',
                  width: '28%',
                  transform: 'rotate(-18deg)',
                }}
              />

              <div
                className="graph-line"
                style={{
                  left: '50%',
                  top: '60%',
                  width: '26%',
                  transform: 'rotate(-10deg)',
                }}
              />

              <div
                className="graph-node node-glow left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/20 text-indigo-200"
                style={{
                  border: '1px solid rgba(129, 140, 248, 0.5)',
                }}
              >
                Role
              </div>

              <div
                className="graph-node left-[10%] top-[18%] h-16 w-16 bg-sky-500/15 text-sky-200"
                style={{
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                }}
              >
                Skills
              </div>

              <div
                className="graph-node left-[72%] top-[14%] h-16 w-16 bg-violet-500/15 text-violet-200"
                style={{
                  border: '1px solid rgba(192, 132, 252, 0.35)',
                }}
              >
                Tech
              </div>

              <div
                className="graph-node left-[15%] top-[72%] h-16 w-16 bg-emerald-500/15 text-emerald-200"
                style={{
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                }}
              >
                Projects
              </div>

              <div
                className="graph-node left-[68%] top-[74%] h-16 w-16 bg-amber-500/15 text-amber-200"
                style={{
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                }}
              >
                Learn
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          EXPLORE CAREER PATHS
      ========================================================== */}
      <section>

        <SectionHeader
          title="Explore Career Paths"
          action={
            <Link
              to="/roles"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              View all roles
              <span aria-hidden="true">→</span>
            </Link>
          }
        />

        {/* Loading */}
        {loadingRoles && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[300px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
              />
            ))}

          </div>
        )}

        {/* Error */}
        {!loadingRoles && rolesError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">

            <p className="text-sm font-medium text-red-300">
              Unable to load career roles.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {rolesError}
            </p>

            <Link
              to="/roles"
              className="mt-5 inline-flex rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:border-indigo-400/50"
            >
              Open Roles
            </Link>

          </div>
        )}

        {/* No roles */}
        {!loadingRoles &&
          !rolesError &&
          featuredRoles.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-10 text-center">

              <p className="text-slate-300">
                No career roles are available in CognoDB.
              </p>

              <Link
                to="/roles"
                className="mt-4 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                View Roles
              </Link>

            </div>
          )}

        {/* Real CognoDB roles */}
        {!loadingRoles &&
          !rolesError &&
          featuredRoles.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {featuredRoles.map((role) => (
                <RoleCard
                  key={role.name}
                  role={{
                    ...role,
                    id: role.name,
                  }}
                />
              ))}

            </div>
          )}

      </section>

      {/* =========================================================
          HOW SKILLGRAPH WORKS
      ========================================================== */}
      <section className="relative overflow-hidden rounded-[24px] border border-slate-800 bg-[#080f20] px-5 py-8 md:px-8 md:py-9">

        <div className="text-center">

          <h2 className="text-3xl font-bold tracking-[-0.045em] text-white md:text-4xl">
            How{' '}
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
              SkillGraph
            </span>{' '}
            Works
          </h2>

          <div className="mx-auto mt-3 flex items-center justify-center gap-1">
            <span className="h-[2px] w-10 rounded-full bg-violet-500/80" />
            <span className="h-[2px] w-6 rounded-full bg-sky-400/80" />
            <span className="h-[2px] w-10 rounded-full bg-amber-400/80" />
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-[15px]">
            Follow the connections from a career role to the skills,
            technologies, projects, and resources behind it.
          </p>

        </div>

        <div className="relative mx-auto mt-8 max-w-[1180px]">

          <div className="pointer-events-none absolute left-[10%] right-[10%] top-[29px] hidden h-px bg-gradient-to-r from-violet-500 via-sky-400 via-cyan-400 via-emerald-400 to-amber-400 md:block" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-2">

            {workflow.map((item, index) => {

              const colors = colorMap[item.color];

              return (
                <div
                  key={item.number}
                  className="relative flex flex-col items-center text-center"
                >

                  <div className="relative z-10 flex h-[58px] items-center justify-center">

                    <div
                      className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border ${colors.border} ${colors.bg} ${colors.text} ${colors.glow}`}
                    >
                      <div className="h-6 w-6">
                        {item.icon}
                      </div>
                    </div>

                  </div>

                  {index < workflow.length - 1 && (
                    <div
                      className={`absolute left-[calc(50%+50px)] top-[26px] hidden h-[6px] w-[6px] -translate-y-1/2 rounded-full md:block ${colors.dot}`}
                    />
                  )}

                  <div
                    className={`mt-2 flex h-[22px] min-w-[40px] items-center justify-center rounded-md px-3 text-[11px] font-bold tracking-wide text-white ${colors.badge}`}
                  >
                    {item.number}
                  </div>

                  <h3 className="mt-3 min-h-[20px] text-sm font-bold text-white md:text-[15px]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 max-w-[185px] text-[11px] leading-[1.55] text-slate-400 md:text-xs">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[900px] items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950/45 px-4 py-3 text-center text-xs text-slate-300 md:text-sm">

          <span className="mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
            ✦
          </span>

          <span>
            <strong className="font-semibold text-white">
              One connected path.
            </strong>{' '}
            From career goal to the skills, tools, projects, and knowledge
            needed to get there.
          </span>

        </div>

      </section>

      {/* =========================================================
          WHY GRAPH DATABASE
      ========================================================== */}
      <section className="network-pattern relative overflow-hidden rounded-[28px] border border-indigo-500/20 bg-slate-900/75 p-6 md:p-10">

        <div className="relative z-10 max-w-3xl">

          <h2 className="text-2xl font-bold text-white md:text-4xl">
            Why a Graph Database?
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Traditional lists can show individual items, but they make
            relationships difficult to explore. SkillGraph connects roles,
            skills, technologies, projects and learning resources so users
            can discover how everything is connected.
          </p>

        </div>

      </section>

    </div>
  );
}