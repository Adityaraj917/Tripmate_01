import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function GradientHeader({
  subtitle,
  title,
  showBack = false,
  rightElement = null,
  className = ''
}) {
  const navigate = useNavigate()

  return (
    <div className={`gradient-header-tall px-5 desktop:px-8 pt-12 desktop:pt-10 pb-8 desktop:pb-10 rounded-b-3xl desktop:rounded-b-[2rem] relative overflow-hidden ${className}`}>
      {/* Decorative circles with animation */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 animate-float-reverse" />

      {/* Extra decoration on desktop */}
      <div className="hidden desktop:block absolute top-4 right-[15%] w-6 h-6 border-2 border-white/15 rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      <div className="hidden desktop:block absolute bottom-6 right-[25%] w-4 h-4 bg-white/10 rounded-full animate-float-slow" style={{ animationDelay: '-4s' }} />
      <div className="hidden desktop:block absolute top-[40%] right-[8%] w-3 h-3 bg-white/8 rounded-full animate-float" style={{ animationDelay: '-1s' }} />

      {/* Mountain silhouette at bottom */}
      <div className="mountain-silhouette opacity-20">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" fill="rgba(13,27,42,0.5)">
          <polygon points="0,60 0,40 100,25 200,35 350,10 500,30 600,15 700,25 850,5 950,20 1050,12 1200,35 1200,60" />
        </svg>
      </div>

      {/* Travel-themed decorative icons (desktop) */}
      <div className="hidden desktop:flex absolute right-10 top-1/2 -translate-y-1/2 gap-4 opacity-20">
        <span className="text-3xl animate-float" style={{ animationDelay: '0s' }}>✈️</span>
        <span className="text-2xl animate-float-slow" style={{ animationDelay: '-1s' }}>🧭</span>
        <span className="text-3xl animate-float-reverse" style={{ animationDelay: '-2s' }}>🌍</span>
      </div>

      <div className="relative z-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="touch-target mb-2 -ml-2 text-white/90 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        <div className="flex items-start justify-between">
          <div className="animate-fade-in">
            {subtitle && (
              <p className="text-white/70 text-sm desktop:text-base font-inter mb-1">{subtitle}</p>
            )}
            <h1 className="text-2xl desktop:text-3xl font-poppins font-bold text-white leading-tight">
              {title}
            </h1>
          </div>
          {rightElement}
        </div>
      </div>
    </div>
  )
}
