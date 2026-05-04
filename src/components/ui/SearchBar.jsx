import { useState, useRef, useEffect } from 'react'
import { Search, X, MapPin } from 'lucide-react'
import { searchLocations } from '../../lib/nominatim'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchBar({ 
  placeholder = 'Search destination...', 
  onSelect,
  onSearch,
  showAutocomplete = true,
  className = '' 
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!showAutocomplete || debouncedQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      const locations = await searchLocations(debouncedQuery)
      setResults(locations)
      setIsOpen(locations.length > 0)
      setLoading(false)
    }

    fetchResults()
  }, [debouncedQuery, showAutocomplete])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (location) => {
    setQuery(location.name)
    setIsOpen(false)
    setResults([])
    onSelect?.(location)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    onSearch?.('')
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onSearch?.(e.target.value)
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-card-bg/80 backdrop-blur-sm border border-white/10 
                     rounded-2xl text-light-text text-sm font-inter placeholder:text-muted-text/60
                     focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                     transition-all duration-200"
          id="search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 touch-target text-muted-text hover:text-light-text"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-strong rounded-xl overflow-hidden shadow-xl shadow-black/30 animate-fade-in">
          {results.map((location, idx) => (
            <button
              key={location.id || idx}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
            >
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-light-text text-sm font-medium truncate">{location.name}</p>
                <p className="text-muted-text text-xs truncate">{location.displayName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
