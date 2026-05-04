export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '' 
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/25',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25',
    accent: 'bg-accent hover:bg-accent/90 text-dark-bg shadow-lg shadow-accent/25',
    ghost: 'bg-transparent hover:bg-white/5 text-light-text border border-white/10',
    danger: 'bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/25',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-poppins font-semibold inline-flex items-center justify-center gap-2
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : 18} />
      ) : null}
      {children}
    </button>
  )
}
