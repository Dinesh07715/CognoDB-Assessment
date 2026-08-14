import { Link } from 'react-router-dom';

export default function RoleCard({ role }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-slate-900 hover:shadow-[0_20px_40px_rgba(15,23,42,0.54)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-sm font-semibold text-indigo-200">
            {role.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-white">{role.name}</h3>
            <span className="mt-1 inline-flex rounded-full border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-300">
              {role.category}
            </span>
          </div>
        </div>
      </div>

      <p className="mb-5 min-h-[48px] text-sm leading-6 text-slate-400">
        {role.description}
      </p>

      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Key skills
        </p>
        <div className="flex flex-wrap gap-2">
          {role.skillPreview?.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-xs text-slate-400">{role.requiredSkillCount} required skills</span>
        <Link
          to={`/roles/${encodeURIComponent(role.name)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition-colors group-hover:text-indigo-200"
        >
          Explore role
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
