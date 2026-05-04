import { Compass } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ 
  icon: Icon = Compass,
  title = 'Nothing here yet',
  description = 'Start exploring to see content here',
  actionLabel,
  onAction,
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="w-20 h-20 rounded-full bg-card-bg flex items-center justify-center mb-4 animate-float">
        <Icon size={32} className="text-primary" />
      </div>
      <h3 className="text-light-text font-poppins font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-text text-sm max-w-[250px] mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
