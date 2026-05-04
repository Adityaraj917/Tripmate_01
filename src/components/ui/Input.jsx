export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  error,
  helper,
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-muted-text font-inter">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-text" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-card-bg border 
                     ${error ? 'border-danger/50' : 'border-white/10'} 
                     rounded-xl text-light-text text-sm font-inter
                     placeholder:text-muted-text/50 
                     focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                     transition-all duration-200`}
          {...props}
        />
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
      {helper && !error && <p className="text-muted-text text-xs">{helper}</p>}
    </div>
  )
}
