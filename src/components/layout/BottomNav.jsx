import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Heart, Compass, Users, User } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/favourites', icon: Heart, label: 'Favourites' },
  { path: '/explorer', icon: Compass, label: 'Explorer' },
  { path: '/groups', icon: Users, label: 'Groups' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] glass-nav safe-bottom desktop:hidden">
      <div className="max-w-mobile mx-auto flex items-center justify-around h-[70px] px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`touch-target flex flex-col items-center gap-1 transition-all duration-300 ripple rounded-xl
                ${active
                  ? 'text-primary scale-110'
                  : 'text-muted-text hover:text-light-text active:scale-90'
                }`}
              id={`nav-${tab.label.toLowerCase()}`}
            >
              <div className={`relative transition-all duration-300 ${active ? 'drop-shadow-[0_0_10px_rgba(255,107,53,0.6)]' : ''}`}>
                <Icon
                  size={24}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active && tab.label === 'Favourites' ? '#FF6B35' : 'none'}
                  className="transition-all duration-300"
                />
                {active && (
                  <>
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-ping-slow" />
                  </>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
