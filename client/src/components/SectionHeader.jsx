export default function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 text-base text-slate-400 md:text-lg">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
