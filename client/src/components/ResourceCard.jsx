export default function ResourceCard({ resource }) {
  return (
    <a
      href={resource.url}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/45 hover:bg-slate-900 hover:shadow-[0_18px_40px_rgba(15,23,42,0.45)]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-white transition-colors group-hover:text-indigo-200">
            {resource.title}
          </h4>
          <p className="mt-1 text-sm text-slate-400">{resource.description}</p>
        </div>

        <svg
          className="ml-2 h-5 w-5 flex-shrink-0 text-slate-500 transition-colors group-hover:text-indigo-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      <span className="inline-flex rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200">
        {resource.type}
      </span>
    </a>
  );
}
