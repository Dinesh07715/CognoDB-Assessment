import TechnologyBadge from './TechnologyBadge';

export default function ProjectCard({ project, onClick }) {
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies.filter(Boolean)
    : [];

  const difficulty = project?.difficulty || 'Not specified';

  const difficultyClasses =
    difficulty === 'Advanced'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
      : difficulty === 'Intermediate'
      ? 'border-sky-500/30 bg-sky-500/10 text-sky-200'
      : difficulty === 'Beginner'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : 'border-slate-600 bg-slate-800/60 text-slate-300';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(project);
    }
  };

  return (
    <article
      onClick={() => onClick?.(project)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="
        group
        flex
        h-full
        cursor-pointer
        flex-col
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        p-6
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-indigo-400/50
        hover:bg-slate-900
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.45)]
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-400/50
      "
    >
      {/* ==================================================
          PROJECT HEADER
      ================================================== */}

      <div className="mb-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-7 text-white transition-colors group-hover:text-indigo-200">
            {project?.name || 'Untitled Project'}
          </h3>

          <span className="shrink-0 text-slate-600 transition-colors group-hover:text-indigo-300">
            →
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-400">
          {project?.description ||
            'No description available for this project.'}
        </p>
      </div>

      {/* ==================================================
          DIFFICULTY
      ================================================== */}

      <div className="mb-5">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${difficultyClasses}`}
        >
          {difficulty}
        </span>
      </div>

      {/* ==================================================
          TECHNOLOGIES
      ================================================== */}

      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Technologies
        </p>

        {technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <TechnologyBadge
                key={tech}
                tech={tech}
                variant="small"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No technologies listed
          </p>
        )}
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-auto border-t border-slate-800/80 pt-4">
        {project?.duration &&
        project.duration !== 'Not specified' ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Duration
            </span>

            <span className="font-medium text-slate-200">
              {project.duration}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Duration not specified
            </span>

            <span className="text-xs font-medium text-indigo-300 opacity-0 transition-opacity group-hover:opacity-100">
              View details →
            </span>
          </div>
        )}
      </div>
    </article>
  );
}