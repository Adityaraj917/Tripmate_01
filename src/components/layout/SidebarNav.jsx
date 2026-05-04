import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, Compass, Users, User, Map, DollarSign, Plane } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/favourites', icon: Heart, label: 'Favourites' },
  { path: '/explorer', icon: Compass, label: 'Explorer' },
  { path: '/trip-planner', icon: Map, label: 'Trip Planner' },
  { path: '/expense-calculator', icon: DollarSign, label: 'Expenses' },
  { path: '/groups', icon: Users, label: 'Groups' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function SidebarNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="hidden desktop:flex flex-col w-64 h-screen sticky top-0 glass-sidebar z-50">
      {/* Logo / Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-header rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 animate-float-slow">
            <Plane size={20} className="text-white -rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-poppins font-bold text-light-text leading-tight">
              Trip<span className="text-primary">Mate</span>
            </h1>
            <p className="text-[10px] text-muted-text font-inter tracking-wider uppercase">
              Your Journey Awaits
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                ${active
                  ? 'active text-primary'
                  : 'text-muted-text hover:text-light-text'
                }`}
              id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`relative flex items-center justify-center ${active ? 'drop-shadow-[0_0_8px_rgba(255,107,53,0.4)]' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active && item.label === 'Favourites' ? '#FF6B35' : 'none'}
                />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-ping-slow" />
                )}
              </div>
              <span className={`font-inter ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-breathe" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Travel decoration at bottom */}
      <div className="px-6 pb-6 pt-2 border-t border-white/5">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl mb-2 animate-float">🌍</div>
          <p className="text-xs text-muted-text font-inter">
            Explore the world with<br/>
            <span className="text-primary font-semibold">TripMate</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
