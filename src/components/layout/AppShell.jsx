import BottomNav from './BottomNav'
import SidebarNav from './SidebarNav'
import AnimatedBackground from './AnimatedBackground'

export default function AppShell({ children }) {
  return (
    <div className="w-full flex min-h-screen min-h-[100dvh] relative bg-dark-bg">
      {/* Animated travel background */}
      <AnimatedBackground />

      {/* Desktop sidebar */}
      <SidebarNav />

      {/* Main content area */}
      <div className="flex-1 flex justify-center relative z-10">
        <div className="w-full max-w-mobile desktop:max-w-none desktop:w-full">
          <main className="pb-[90px] desktop:pb-8 min-h-screen desktop:px-8 desktop:max-w-desktop desktop:mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
