import { useMemo } from 'react'

// Travel-themed floating elements for the animated background
const TRAVEL_ICONS = ['✈️', '🎈', '🧭', '⛰️', '🌤️', '🗺️', '🏝️', '⛵', '🌍', '🚀']

function generateElements(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    icon: TRAVEL_ICONS[i % TRAVEL_ICONS.length],
    left: `${(i * 17 + 5) % 95}%`,
    top: `${(i * 23 + 10) % 90}%`,
    size: 1.2 + (i % 4) * 0.4,
    animDuration: 15 + (i % 6) * 5,
    animDelay: i * -2,
    direction: i % 2 === 0 ? 'float-slow' : 'float-reverse',
  }))
}

function generateParticles(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: '0%',
    duration: 10 + Math.random() * 12,
    delay: Math.random() * 8,
    size: 3 + Math.random() * 4,
  }))
}

export default function AnimatedBackground() {
  const elements = useMemo(() => generateElements(14), [])
  const particles = useMemo(() => generateParticles(12), [])

  return (
    <>
      {/* World map dot pattern (desktop only) */}
      <div className="world-dots" />

      {/* Gradient mesh (desktop) */}
      <div className="gradient-mesh" />

      {/* Floating travel icons */}
      <div className="travel-bg">
        {/* Parallax cloud layers */}
        <div className="cloud-layer cloud-layer-1">
          <svg viewBox="0 0 1200 200" fill="none" className="w-full h-48 opacity-80">
            <ellipse cx="200" cy="100" rx="150" ry="60" fill="rgba(142,173,193,0.25)" />
            <ellipse cx="500" cy="80" rx="120" ry="50" fill="rgba(142,173,193,0.18)" />
            <ellipse cx="800" cy="120" rx="180" ry="70" fill="rgba(142,173,193,0.22)" />
            <ellipse cx="1050" cy="90" rx="100" ry="45" fill="rgba(142,173,193,0.15)" />
          </svg>
        </div>
        <div className="cloud-layer cloud-layer-2">
          <svg viewBox="0 0 1200 200" fill="none" className="w-full h-32 opacity-60">
            <ellipse cx="150" cy="100" rx="130" ry="55" fill="rgba(142,173,193,0.18)" />
            <ellipse cx="450" cy="80" rx="100" ry="40" fill="rgba(142,173,193,0.14)" />
            <ellipse cx="750" cy="110" rx="160" ry="65" fill="rgba(142,173,193,0.20)" />
            <ellipse cx="1000" cy="85" rx="90" ry="38" fill="rgba(142,173,193,0.12)" />
          </svg>
        </div>

        {/* Floating travel icons */}
        {elements.map((el) => (
          <div
            key={el.id}
            className={`travel-bg-element animate-${el.direction}`}
            style={{
              left: el.left,
              top: el.top,
              fontSize: `${el.size}rem`,
              animationDuration: `${el.animDuration}s`,
              animationDelay: `${el.animDelay}s`,
            }}
          >
            {el.icon}
          </div>
        ))}

        {/* Glowing particles */}
        {particles.map((p) => (
          <div
            key={`p-${p.id}`}
            className="particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
    </>
  )
}
