export default function ErrorState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <svg
        className="w-16 h-16 text-red-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4v2m0-6l.22-.22a.5.5 0 01.707 0l.22.22m-2.828-2.828l.22-.22a.5.5 0 01.707 0l.22.22M9 9a3 3 0 106 0 3 3 0 00-6 0zm12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-sm mb-6">{message}</p>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
