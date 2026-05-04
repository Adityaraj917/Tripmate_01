export default function Card({ children, className = '', onClick, hover = true, style }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        glass rounded-2xl p-4 desktop:p-5 glow-hover gradient-border
        ${hover ? 'card-interactive transition-all duration-300 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
