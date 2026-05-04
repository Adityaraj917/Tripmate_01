export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-28 h-28 text-3xl',
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary/30 ${className}`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-primary-light 
                     flex items-center justify-center font-poppins font-bold text-white ring-2 ring-primary/30 ${className}`}>
      {getInitials(name)}
    </div>
  )
}
