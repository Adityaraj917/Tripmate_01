import { useState, useMemo } from 'react'
import { Heart, MapPin, Calendar, IndianRupee, Sparkles } from 'lucide-react'
import { useFavourites } from '../hooks/useFavourites'
import { popularDestinations } from '../data/destinations'
import { getDestinationImage } from '../lib/unsplash'
import GradientHeader from '../components/layout/GradientHeader'
import SearchBar from '../components/ui/SearchBar'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

// Demo completed trips
const demoCompletedTrips = [
  {
    id: 'trip-1',
    name: 'Goa Beach Getaway',
    location: 'Goa, India',
    date: '15 Jan 2026',
    totalExpense: 8500,
    perPerson: 4250,
    image: 'goa',
  },
  {
    id: 'trip-2',
    name: 'Manali Adventure',
    location: 'Himachal Pradesh',
    date: '20 Dec 2025',
    totalExpense: 12000,
    perPerson: 3000,
    image: 'manali',
  },
]

export default function FavouritesPage() {
  const { favourites, loading } = useFavourites()
  const [searchQuery, setSearchQuery] = useState('')

  // Map favourite IDs to full destination data
  const favouritedDestinations = useMemo(() => {
    const favIds = favourites.map(f => f.destination_id)
    const fromPopular = popularDestinations.filter(d => favIds.includes(d.id))

    // Also include favourites that have stored data (demo mode)
    const fromStored = favourites
      .filter(f => f.destination_name && !fromPopular.find(d => d.id === f.destination_id))
      .map(f => ({
        id: f.destination_id,
        name: f.destination_name,
        location: f.destination_location || '',
        category: f.destination_category || 'default',
        unsplashQuery: f.destination_unsplash || f.destination_name,
      }))

    return [...fromPopular, ...fromStored]
  }, [favourites])

  // Filter by search
  const filtered = searchQuery
    ? favouritedDestinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favouritedDestinations

  return (
    <div className="page-fade">
      {/* Header */}
      <GradientHeader
        subtitle="Favourite"
        title="All your Love at a Place!"
      />

      {/* Search */}
      <div className="px-5 desktop:px-0 -mt-5 relative z-20 mb-6 animate-slide-up">
        <SearchBar
          placeholder="Search the favourite trip here....."
          showAutocomplete={false}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Favourite Marked Places */}
      <div className="px-5 desktop:px-0 mb-8">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2 animate-reveal-up">
          <Heart size={18} className="text-danger fill-danger" />
          Favorite Marked Places!
        </h2>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            description="Heart destinations on the Home page to save them here"
          />
        ) : (
          <div className="grid grid-cols-4 desktop:grid-cols-6 xl:grid-cols-8 gap-2 desktop:gap-3">
            {filtered.map((dest, idx) => (
              <div
                key={dest.id}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer animate-stagger-fade gradient-border"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <img
                  src={getDestinationImage(dest.unsplashQuery || dest.name, dest.category)}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.15]"
                />
                <div className="absolute inset-0 gradient-dark-overlay transition-opacity duration-300 group-hover:opacity-90" />
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 transform transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <p className="text-white text-[10px] desktop:text-xs font-semibold leading-tight truncate">
                    {dest.name}
                  </p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <MapPin size={8} className="text-primary flex-shrink-0" />
                    <span className="text-white/60 text-[8px] desktop:text-[10px] truncate">{dest.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 desktop:mx-0 h-px bg-white/10 mb-6" />

      {/* Successful Trips */}
      <div className="px-5 desktop:px-0 mb-8">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2 animate-reveal-up">
          <Sparkles size={18} className="text-warning" />
          Successful Trips
        </h2>

        <div className="space-y-3 desktop:grid desktop:grid-cols-2 desktop:space-y-0 desktop:gap-4">
          {demoCompletedTrips.map((trip, idx) => (
            <Card key={trip.id} className="flex items-center gap-3 animate-stagger-fade group" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="w-[75px] h-[76px] desktop:w-[90px] desktop:h-[90px] rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={getDestinationImage(trip.image)}
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base truncate">
                  {trip.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-primary flex-shrink-0" />
                  <span className="text-muted-text text-xs truncate">{trip.location}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-muted-text flex items-center gap-1">
                    <Calendar size={10} /> {trip.date}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-warning text-sm font-semibold flex items-center gap-0.5">
                  <IndianRupee size={12} />{trip.totalExpense.toLocaleString()}
                </p>
                <p className="text-muted-text text-[10px] mt-0.5">
                  ₹{trip.perPerson}/person
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
