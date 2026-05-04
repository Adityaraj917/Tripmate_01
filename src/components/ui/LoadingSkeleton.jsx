export default function LoadingSkeleton({ type = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (type === 'card') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {items.map(i => (
          <div key={i} className="skeleton rounded-2xl h-[180px]" />
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map(i => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 rounded w-3/4" />
              <div className="skeleton h-3 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'header') {
    return (
      <div className={`space-y-3 p-5 ${className}`}>
        <div className="skeleton h-4 rounded w-1/3" />
        <div className="skeleton h-7 rounded w-2/3" />
        <div className="skeleton h-12 rounded-2xl w-full mt-4" />
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map(i => (
          <div key={i} className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    )
  }

  if (type === 'avatar') {
    return <div className={`skeleton rounded-full w-12 h-12 ${className}`} />
  }

  return <div className={`skeleton rounded-xl h-32 ${className}`} />
}
