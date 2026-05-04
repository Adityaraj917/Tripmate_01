import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, MapPin, Calendar, IndianRupee, Check, Map, Search, Loader } from 'lucide-react'
import { tripTemplates } from '../data/destinations'
import { getDestinationImage } from '../lib/unsplash'
import { searchLocations } from '../lib/nominatim'
import { useDebounce } from '../hooks/useDebounce'
import GradientHeader from '../components/layout/GradientHeader'
import SearchBar from '../components/ui/SearchBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'

const DEMO_TRIPS_KEY = 'tripmate_trips'

const activitiesOptions = ['Sightseeing', 'Adventure', 'Food Tour', 'Shopping', 'Culture', 'Trekking', 'Water Sports', 'Photography']

export default function TripPlannerPage() {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Form state
  const [tripDestination, setTripDestination] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [budget, setBudget] = useState('')
  const [selectedActivities, setSelectedActivities] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Location search state
  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const locationRef = useRef(null)
  const debouncedLocationQuery = useDebounce(locationQuery, 400)

  // Search locations when query changes
  useEffect(() => {
    if (debouncedLocationQuery.length < 2) {
      setLocationResults([])
      setShowLocationDropdown(false)
      return
    }

    const fetchLocations = async () => {
      setLocationLoading(true)
      const results = await searchLocations(debouncedLocationQuery, 6)
      setLocationResults(results)
      setShowLocationDropdown(results.length > 0)
      setLocationLoading(false)
    }

    fetchLocations()
  }, [debouncedLocationQuery])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelectLocation = (location) => {
    setTripDestination(location.name)
    setLocationQuery(location.name)
    setSelectedLocation(location)
    setShowLocationDropdown(false)
    setLocationResults([])
  }

  const displayTemplates = showAll ? tripTemplates : tripTemplates.slice(0, 4)

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setTripDestination(template.destination)
    setLocationQuery(template.destination)
    setBudget(template.estimatedBudget.toString())
    setSelectedActivities(template.activities || [])
    setSelectedLocation(null)
    setShowPlanForm(true)
  }

  const toggleActivity = (activity) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const handleSaveTrip = () => {
    setSaving(true)

    const trip = {
      id: `trip-${Date.now()}`,
      name: selectedTemplate?.name || tripDestination,
      destination: tripDestination,
      location: selectedLocation ? {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        displayName: selectedLocation.displayName,
        country: selectedLocation.country,
        state: selectedLocation.state,
      } : null,
      startDate: fromDate,
      endDate: toDate,
      numPeople,
      budget: Number(budget) || 0,
      activities: selectedActivities,
      notes,
      status: 'planned',
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem(DEMO_TRIPS_KEY) || '[]')
    localStorage.setItem(DEMO_TRIPS_KEY, JSON.stringify([trip, ...existing]))

    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => {
        setShowPlanForm(false)
        setSaved(false)
        // Reset form
        setTripDestination('')
        setLocationQuery('')
        setFromDate('')
        setToDate('')
        setNumPeople(1)
        setBudget('')
        setSelectedActivities([])
        setNotes('')
        setSelectedTemplate(null)
        setSelectedLocation(null)
      }, 1500)
    }, 800)
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <GradientHeader
        subtitle="Open Trip"
        title="Either Today or Never!"
        showBack
      />

      {/* Search */}
      <div className="px-5 desktop:px-0 -mt-5 relative z-20 mb-6 animate-slide-up">
        <SearchBar
          placeholder="Search for the type of trip..."
          showAutocomplete={false}
        />
      </div>

      {/* Trip Templates */}
      <div className="px-5 desktop:px-0 mb-6">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2 animate-reveal-up">
          <Map size={18} className="text-secondary" />
          Popular Trip Plans
        </h2>

        <div className="space-y-3 desktop:grid desktop:grid-cols-2 desktop:space-y-0 desktop:gap-4">
          {displayTemplates.map((template, idx) => (
            <Card
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="flex items-center gap-3 group animate-stagger-fade"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="w-16 h-16 desktop:w-20 desktop:h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={getDestinationImage(template.image)}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base truncate">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-primary flex-shrink-0" />
                  <span className="text-muted-text text-xs truncate">{template.destination}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <span className="text-muted-text flex items-center gap-1">
                    <Calendar size={10} /> {template.duration}
                  </span>
                  <span className="text-warning flex items-center gap-0.5 font-medium">
                    <IndianRupee size={10} />{template.estimatedBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {tripTemplates.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-primary text-sm font-medium flex items-center justify-center gap-1 hover:underline transition-all duration-300 hover:scale-105"
          >
            {showAll ? (
              <>Show less <ChevronUp size={16} /></>
            ) : (
              <>Show more <ChevronDown size={16} /></>
            )}
          </button>
        )}

        {/* Custom trip button */}
        <Button
          onClick={() => {
            setSelectedTemplate(null)
            setTripDestination('')
            setLocationQuery('')
            setSelectedLocation(null)
            setShowPlanForm(true)
          }}
          variant="outline"
          fullWidth
          className="mt-4"
        >
          + Plan Custom Trip
        </Button>
      </div>

      {/* Trip Planning Modal */}
      <Modal
        isOpen={showPlanForm}
        onClose={() => setShowPlanForm(false)}
        title={selectedTemplate ? `Plan: ${selectedTemplate.name}` : 'Plan Your Trip'}
      >
        {saved ? (
          <div className="text-center py-10 animate-bounce-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center animate-glow">
              <Check size={32} className="text-accent" />
            </div>
            <h3 className="text-light-text font-poppins font-semibold text-lg">Trip Saved!</h3>
            <p className="text-muted-text text-sm mt-1">Your adventure is planned 🎉</p>
            {selectedLocation && (
              <p className="text-muted-text text-xs mt-2">
                📍 {selectedLocation.displayName}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Location Search with real autocomplete */}
            <div ref={locationRef} className="relative">
              <label className="text-sm font-medium text-muted-text font-inter block mb-1.5">
                Destination <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text z-10" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value)
                    setTripDestination(e.target.value)
                    setSelectedLocation(null)
                  }}
                  placeholder="Search real locations (e.g., Goa, Manali, Bali...)"
                  className="w-full pl-10 pr-10 py-3 bg-card-bg border border-white/10 rounded-xl text-light-text text-sm
                            placeholder:text-muted-text/50 focus:outline-none focus:border-primary/50
                            focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {locationLoading && (
                  <Loader size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" />
                )}
                {selectedLocation && !locationLoading && (
                  <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
                )}
              </div>

              {/* Selected location details */}
              {selectedLocation && (
                <div className="mt-1.5 p-2 bg-accent/5 border border-accent/10 rounded-lg animate-scale-in">
                  <p className="text-accent text-xs font-medium flex items-center gap-1">
                    <Check size={10} />
                    Real location selected
                  </p>
                  <p className="text-muted-text text-[10px] mt-0.5 truncate">
                    {selectedLocation.displayName}
                  </p>
                  {selectedLocation.country && (
                    <p className="text-muted-text text-[10px]">
                      🌍 {selectedLocation.country}{selectedLocation.state ? ` • ${selectedLocation.state}` : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Location results dropdown */}
              {showLocationDropdown && locationResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 glass-strong rounded-xl overflow-hidden shadow-xl shadow-black/30 animate-fade-in max-h-[240px] overflow-y-auto">
                  {locationResults.map((loc, idx) => (
                    <button
                      key={loc.id || idx}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full px-3 py-2.5 flex items-start gap-2.5 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-light-text text-sm font-medium truncate">{loc.name}</p>
                        <p className="text-muted-text text-[10px] truncate">{loc.displayName}</p>
                        {loc.country && (
                          <p className="text-muted-text text-[10px]">
                            🌍 {loc.country}{loc.state ? ` • ${loc.state}` : ''}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="People"
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
                min="1"
              />
              <Input
                label="Budget (₹)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="15000"
              />
            </div>

            {/* Activities */}
            <div>
              <label className="text-sm font-medium text-muted-text font-inter block mb-2">
                Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {activitiesOptions.map(act => (
                  <button
                    key={act}
                    onClick={() => toggleActivity(act)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                      ${selectedActivities.includes(act)
                        ? 'bg-primary text-white scale-105'
                        : 'bg-card-bg border border-white/10 text-muted-text hover:text-light-text hover:border-primary/30'
                      }`}
                  >
                    {selectedActivities.includes(act) ? '✓ ' : ''}{act}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-text font-inter block mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special plans or notes..."
                rows={3}
                className="w-full px-4 py-3 bg-card-bg border border-white/10 rounded-xl text-light-text text-sm
                          placeholder:text-muted-text/50 focus:outline-none focus:border-primary/50 
                          focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <Button
              onClick={handleSaveTrip}
              variant="primary"
              fullWidth
              size="lg"
              loading={saving}
              disabled={!tripDestination.trim()}
            >
              Save Trip Plan
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
