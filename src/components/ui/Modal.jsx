import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className={`relative z-10 w-full max-w-mobile max-h-[90vh] bg-dark-bg border border-white/10 
                    rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up
                    flex flex-col ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-lg font-poppins font-semibold text-light-text">{title}</h2>
            <button
              onClick={onClose}
              className="touch-target text-muted-text hover:text-light-text transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Drag handle (mobile) */}
        {!title && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
