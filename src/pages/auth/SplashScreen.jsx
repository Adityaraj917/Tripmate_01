import { useEffect, useState, useMemo } from 'react'
import { Compass } from 'lucide-react'

function generateParticles(count = 15) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 3,
    opacity: 0.2 + Math.random() * 0.4,
  }))
}

export default function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true)
  const particles = useMemo(() => generateParticles(15), [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      onComplete?.()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center gradient-header-tall"
         onClick={() => { setShow(false); onComplete?.() }}>

      {/* Animated particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-5%',
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(255, 255, 255, ${p.opacity})`,
          }}
        />
      ))}

      {/* Floating travel icons */}
      <div className="absolute top-[12%] left-[8%] text-4xl animate-float-slow opacity-20">✈️</div>
      <div className="absolute top-[20%] right-[12%] text-3xl animate-float-reverse opacity-15">🎈</div>
      <div className="absolute bottom-[25%] left-[12%] text-3xl animate-float opacity-15">🌍</div>
      <div className="absolute bottom-[35%] right-[8%] text-4xl animate-float-slow opacity-20">🧭</div>
      <div className="absolute top-[45%] left-[3%] text-2xl animate-float-reverse opacity-10">⛰️</div>
      <div className="absolute top-[55%] right-[3%] text-2xl animate-float opacity-10">🏝️</div>
      <div className="absolute top-[70%] left-[25%] text-2xl animate-float-slow opacity-10">⛵</div>
      <div className="absolute top-[30%] right-[30%] text-2xl animate-float-reverse opacity-10">🚀</div>

      {/* Decorative blurs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-32 right-8 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-float-reverse" />

      {/* Route line decoration */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="text-center animate-bounce-in relative z-10">
        {/* Logo with compass spin */}
        <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center
                       shadow-2xl shadow-black/20 border border-white/20 animate-float">
          <div className="compass-spin">
            <Compass size={48} className="text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-poppins font-extrabold text-white mb-3 tracking-tight">
          Trip<span className="text-yellow-200">Mate</span>
        </h1>

        {/* Tagline with stagger */}
        <p className="text-white/70 text-base font-inter tracking-wide animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Your Journey Starts Here
        </p>

        {/* Feature highlights */}
        <div className="flex gap-6 justify-center mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {['Explore', 'Plan', 'Travel'].map((text, i) => (
            <div key={text} className="text-center animate-stagger-fade" style={{ animationDelay: `${1 + i * 0.2}s` }}>
              <div className="w-2 h-2 bg-white/40 rounded-full mx-auto mb-1.5" />
              <span className="text-white/50 text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 justify-center mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Mountain silhouette at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-16" fill="rgba(13,27,42,0.3)">
          <polygon points="0,80 0,60 100,35 200,50 350,15 500,40 600,20 700,35 850,5 950,25 1050,15 1200,45 1200,80" />
        </svg>
      </div>

      <p className="absolute bottom-10 text-white/40 text-xs font-inter animate-fade-in" style={{ animationDelay: '1.5s' }}>
        Tap to skip
      </p>
    </div>
  )
}
