import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useFavourites } from '../hooks/useFavourites'
import { useGeolocation } from '../hooks/useGeolocation'
import { reverseGeocode } from '../lib/nominatim'
import { getDestinationImage } from '../lib/unsplash'
import { popularDestinations } from '../data/destinations'
import SearchBar from '../components/ui/SearchBar'
import CategoryPills from '../components/ui/CategoryPills'
import DestinationCard from '../components/ui/DestinationCard'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

// Typewriter effect hook
function useTypewriter(text, speed = 80) {
  const [displayText, setDisplayText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return { displayText, done }
}

export default function HomePage() {
  const { profile } = useAuth()
  const { isFavourited, toggleFavourite } = useFavourites()
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [nearbyPlace, setNearbyPlace] = useState(null)
  const [nearbyLoading, setNearbyLoading] = useState(true)

  const greeting = `Travelling Today?`
  const { displayText, done } = useTypewriter(greeting, 70)

  // Filter destinations by category
  const filteredDestinations = selectedCategory === 'all'
    ? popularDestinations
    : popularDestinations.filter(d => d.category === selectedCategory)

  // Fetch nearby place when geolocation is available
  useEffect(() => {
    if (latitude && longitude) {
      setNearbyLoading(true)
      reverseGeocode(latitude, longitude).then(place => {
        setNearbyPlace(place)
        setNearbyLoading(false)
      }).catch(() => setNearbyLoading(false))
    } else if (geoError) {
      setNearbyLoading(false)
    }
  }, [latitude, longitude, geoError])

  const handleSearchSelect = (location) => {
    console.log('Selected location:', location)
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="px-5 desktop:px-0 pt-12 desktop:pt-8 pb-4">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <p className="text-muted-text text-sm desktop:text-base font-inter flex items-center gap-1.5">
              <Sparkles size={14} className="text-warning animate-wiggle" />
              Hi {profile?.name || 'Traveller'},
            </p>
            <h1 className="text-[28px] desktop:text-4xl font-poppins font-bold text-light-text leading-tight mt-1">
              <span>{displayText}</span>
              {!done && <span className="typewriter-cursor" />}
            </h1>
          </div>
          <Avatar
            src={profile?.avatar_url}
            name={profile?.name || 'T'}
            size="md"
            className="ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
          />
        </div>

        {/* Search Bar */}
        <div className="animate-slide-up stagger-2">
          <SearchBar
            placeholder="Search destination....."
            onSelect={handleSearchSelect}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-5 desktop:px-0 mb-6 animate-slide-up stagger-3">
        <CategoryPills
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Popular Destinations */}
      <div className="px-5 desktop:px-0 mb-8">
        <div className="flex items-center justify-between mb-4 animate-reveal-up stagger-4">
          <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Popular Destinations!
          </h2>
          <span className="text-xs text-muted-text">{filteredDestinations.length} places</span>
        </div>

        {/* Responsive Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 desktop:grid-cols-3 xl:grid-cols-4 gap-3 desktop:gap-4">
          {filteredDestinations.map((dest, idx) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              size={idx % 3 === 0 ? 'large' : 'small'}
              isFavourited={isFavourited(dest.id)}
              onFavourite={() => toggleFavourite(dest.id, {
                destination_name: dest.name,
                destination_location: dest.location,
                destination_category: dest.category,
                destination_unsplash: dest.unsplashQuery,
              })}
              className="animate-stagger-fade"
              style={{ animationDelay: `${idx * 0.07}s` }}
            />
          ))}
        </div>
      </div>

      {/* Nearby Me Section */}
      <div className="px-5 desktop:px-0 mb-8 animate-reveal-up stagger-6">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2">
          <Navigation size={18} className="text-secondary" />
          Nearby Me
        </h2>

        {nearbyLoading ? (
          <LoadingSkeleton type="list" count={1} />
        ) : geoError ? (
          <Card className="text-center py-6">
            <Navigation size={32} className="text-muted-text mx-auto mb-3 animate-float" />
            <p className="text-muted-text text-sm">Enable location for nearby places</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary text-sm mt-2 font-medium hover:underline transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </Card>
        ) : nearbyPlace ? (
          <Card className="flex items-center gap-4 overflow-hidden group">
            <div className="w-20 h-20 desktop:w-24 desktop:h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={getDestinationImage(nearbyPlace.city || nearbyPlace.name)}
                alt={nearbyPlace.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base truncate">
                {nearbyPlace.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-primary flex-shrink-0" />
                <span className="text-muted-text text-xs truncate">
                  {nearbyPlace.city}{nearbyPlace.state ? `, ${nearbyPlace.state}` : ''}
                </span>
              </div>
              <p className="text-accent text-xs mt-1 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-accent rounded-full animate-breathe" />
                You are here
              </p>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-6">
            <p className="text-muted-text text-sm">No nearby places found</p>
          </Card>
        )}
      </div>
    </div>
  )
}
