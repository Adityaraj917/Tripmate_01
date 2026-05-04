import { useState } from 'react'
import { Heart, MapPin, Star } from 'lucide-react'
import { getDestinationImage } from '../../lib/unsplash'

export default function DestinationCard({
  destination,
  size = 'large',
  isFavourited = false,
  onFavourite,
  onClick,
  className = '',
  style,
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [heartAnim, setHeartAnim] = useState(false)

  const imageUrl = getDestinationImage(destination.unsplashQuery || destination.name, destination.category)

  const handleFavourite = (e) => {
    e.stopPropagation()
    setHeartAnim(true)
    setTimeout(() => setHeartAnim(false), 300)
    onFavourite?.(destination.id, destination)
  }

  return (
    <div
      onClick={() => onClick?.(destination)}
      style={style}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group gradient-border
                  transition-all duration-500 hover:scale-[1.03] desktop:hover:scale-[1.04]
                  hover:shadow-xl hover:shadow-primary/10
                  ${size === 'large' ? 'h-[224px] desktop:h-[280px]' : 'h-[180px] desktop:h-[220px]'}
                  ${className}`}
    >
      {/* Skeleton */}
      {!imgLoaded && (
        <div className="absolute inset-0 skeleton rounded-2xl" />
      )}

      {/* Image with parallax hover effect */}
      <img
        src={imageUrl}
        alt={destination.name}
        onLoad={() => setImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                    group-hover:scale-[1.15] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-card-overlay transition-opacity duration-300 group-hover:opacity-90" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

      {/* Heart Button */}
      <button
        onClick={handleFavourite}
        className={`absolute top-3 right-3 touch-target z-10 
                    transition-transform duration-300
                    ${heartAnim ? 'animate-pulse-heart' : ''}
                    hover:scale-125`}
      >
        <Heart
          size={22}
          className={`drop-shadow-lg transition-all duration-300 ${
            isFavourited
              ? 'text-danger fill-danger drop-shadow-[0_0_8px_rgba(239,71,111,0.5)]'
              : 'text-white/80 hover:text-danger'
          }`}
          fill={isFavourited ? '#EF476F' : 'none'}
        />
      </button>

      {/* Rating badge (decorative) */}
      {destination.rating && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 z-10">
          <Star size={10} className="text-warning fill-warning" />
          <span className="text-white text-[10px] font-semibold">{destination.rating}</span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 desktop:p-4 z-10 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
        <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base leading-tight mb-1">
          {destination.name}
        </h3>
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-primary flex-shrink-0" />
          <span className="text-muted-text text-xs desktop:text-sm truncate">
            {destination.location}
          </span>
        </div>
      </div>
    </div>
  )
}
