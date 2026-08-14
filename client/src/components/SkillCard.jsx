import { getDifficultyColor } from '../data/sampleData';

export default function SkillCard({ skill, showDescription }) {
  const difficultyColors = getDifficultyColor(skill.difficulty);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 transition-all duration-200 hover:border-indigo-400/45 hover:bg-slate-900 hover:shadow-[0_18px_40px_rgba(15,23,42,0.42)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">{skill.name}</h4>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{skill.category}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${difficultyColors}`}>
          {skill.difficulty}
        </span>
      </div>

      {showDescription && (
        <p className="mt-3 text-sm text-slate-400">
          Explore paths and projects that build this skill.
        </p>
      )}
    </div>
  );
}
