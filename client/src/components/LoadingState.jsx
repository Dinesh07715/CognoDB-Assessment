export default function LoadingState({ count = 4, variant = 'card' }) {
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-200 rounded-lg h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="bg-gray-200 h-6 rounded w-3/4 mb-4" />
          <div className="bg-gray-200 h-4 rounded w-full mb-3" />
          <div className="bg-gray-200 h-4 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}
