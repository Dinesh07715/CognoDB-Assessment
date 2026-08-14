import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="page-shell min-h-screen flex flex-col bg-transparent">
      <Navbar />

      <main className="flex-1 w-full py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">SkillGraph</h3>
              <p className="text-sm text-slate-400">
                Understand the skills behind your next career move.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/roles" className="transition-colors hover:text-indigo-300">Roles</a></li>
                <li><a href="/skills" className="transition-colors hover:text-indigo-300">Skills</a></li>
                <li><a href="/projects" className="transition-colors hover:text-indigo-300">Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/graph" className="transition-colors hover:text-indigo-300">Graph Explorer</a></li>
                <li><a href="/" className="transition-colors hover:text-indigo-300">Career Paths</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">About</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/roles" className="transition-colors hover:text-indigo-300">Documentation</a></li>
                <li><a href="/graph" className="transition-colors hover:text-indigo-300">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-sm text-slate-500">
              © 2026 SkillGraph. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
