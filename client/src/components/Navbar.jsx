import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/roles', label: 'Roles' },
    { path: '/skills', label: 'Skills' },
    { path: '/technologies', label: 'Technologies' },
    { path: '/projects', label: 'Projects' },
    { path: '/graph', label: 'Graph Explorer' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/10 text-indigo-200 shadow-[0_0_18px_rgba(124,106,246,0.3)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <circle cx="6" cy="8" r="2.2" />
                <circle cx="16" cy="6" r="2.2" />
                <circle cx="18" cy="16" r="2.2" />
                <circle cx="8" cy="18" r="2.2" />

                <path
                  d="M8.2 9.5L14.5 7.2M8.7 16.5L15.8 14.3M9.2 9l7.2 7.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-lg font-semibold tracking-tight text-white">
              SkillGraph
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'border-indigo-400/40 bg-indigo-500/15 text-white shadow-[0_0_0_1px_rgba(129,140,248,0.12)]'
                    : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}