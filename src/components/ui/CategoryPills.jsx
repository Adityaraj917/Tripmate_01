import { useRef, useEffect } from 'react'
import { categoryFilters } from '../../data/destinations'

export default function CategoryPills({ selected = 'all', onSelect, className = '' }) {
  const scrollRef = useRef(null)

  // Scroll active pill into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selected])

  return (
    <div 
      ref={scrollRef}
      className={`flex gap-3 overflow-x-auto scrollbar-hide py-1 ${className}`}
    >
      {categoryFilters.map((cat) => {
        const active = selected === cat.id
        return (
          <button
            key={cat.id}
            data-active={active}
            onClick={() => onSelect?.(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium 
                        whitespace-nowrap transition-all duration-200 flex-shrink-0
                        ${active 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                          : 'bg-card-bg border border-white/10 text-muted-text hover:border-primary/30 hover:text-light-text'
                        }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
