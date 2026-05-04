import { useNavigate } from 'react-router-dom'
import { MapPin, Map, DollarSign, Bookmark, Globe, ChevronRight, Sparkles } from 'lucide-react'
import GradientHeader from '../components/layout/GradientHeader'
import SearchBar from '../components/ui/SearchBar'
import CategoryPills from '../components/ui/CategoryPills'
import Card from '../components/ui/Card'

const features = [
  {
    id: 'create-group',
    title: 'Create Trip Group',
    subtitle: 'Gather your travel buddies',
    icon: MapPin,
    iconBg: 'from-primary to-primary-light',
    route: '/groups',
    emoji: '👥',
  },
  {
    id: 'plan-trip',
    title: 'Plan / Join a Trip',
    subtitle: 'Design your perfect adventure',
    icon: Map,
    iconBg: 'from-secondary to-blue-400',
    route: '/trip-planner',
    emoji: '🗺️',
  },
  {
    id: 'calculate-expense',
    title: 'Calculate Expense',
    subtitle: 'Split costs with friends',
    icon: DollarSign,
    iconBg: 'from-warning to-yellow-400',
    route: '/expense-calculator',
    emoji: '💰',
  },
  {
    id: 'saved-destinations',
    title: 'Saved Destinations',
    subtitle: 'View your favourite spots',
    icon: Bookmark,
    iconBg: 'from-accent to-emerald-400',
    route: '/favourites',
    emoji: '❤️',
  },
  {
    id: 'explore-nearby',
    title: 'Explore Nearby',
    subtitle: 'Discover places around you',
    icon: Globe,
    iconBg: 'from-purple-500 to-purple-400',
    route: '/',
    emoji: '🌍',
  },
]

export default function ExplorerPage() {
  const navigate = useNavigate()

  return (
    <div className="page-fade">
      {/* Header */}
      <GradientHeader
        subtitle="Decide & Plan"
        title="Explore the World Today!"
      />

      {/* Search */}
      <div className="px-5 desktop:px-0 -mt-5 relative z-20 mb-6 animate-slide-up">
        <SearchBar placeholder="Search features & destinations..." showAutocomplete={false} />
      </div>

      {/* Category Pills */}
      <div className="px-5 desktop:px-0 mb-6 animate-slide-up stagger-2">
        <CategoryPills selected="all" onSelect={() => {}} />
      </div>

      {/* Feature Cards - responsive grid */}
      <div className="px-5 desktop:px-0 mb-8">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2 animate-reveal-up">
          <Sparkles size={18} className="text-warning animate-wiggle" />
          Quick Actions
        </h2>

        <div className="space-y-3 desktop:space-y-0 desktop:grid desktop:grid-cols-2 xl:grid-cols-3 desktop:gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.id}
                onClick={() => navigate(feature.route)}
                className="flex items-center gap-4 animate-stagger-fade group"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className={`w-12 h-12 desktop:w-14 desktop:h-14 rounded-xl bg-gradient-to-br ${feature.iconBg} 
                               flex items-center justify-center flex-shrink-0 shadow-lg
                               transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base flex items-center gap-2">
                    {feature.title}
                    <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">{feature.emoji}</span>
                  </h3>
                  <p className="text-muted-text text-xs desktop:text-sm mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
                <ChevronRight size={20} className="text-primary flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Card>
            )
          })}
        </div>
      </div>

      {/* Traveler tip card */}
      <div className="px-5 desktop:px-0 mb-8 animate-reveal-up stagger-8">
        <Card hover={false} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 text-6xl opacity-10 -translate-y-2 translate-x-2 animate-float-slow">
            ✈️
          </div>
          <div className="relative z-10">
            <h3 className="text-light-text font-poppins font-semibold text-sm mb-1 flex items-center gap-2">
              💡 Travel Tip of the Day
            </h3>
            <p className="text-muted-text text-xs leading-relaxed">
              Always keep a digital copy of your passport and important documents in a secure cloud storage. You never know when you might need them! 🧳
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
