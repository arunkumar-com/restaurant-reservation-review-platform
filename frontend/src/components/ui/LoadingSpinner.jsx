function LoadingSpinner({ size = 'default', light = false }) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-4',
    large: 'h-12 w-12 border-4'
  }

  const colorClasses = light
    ? 'border-white/20 border-t-white'
    : 'border-primary-200 border-t-primary-600'

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`
          animate-spin rounded-full
          ${sizeClasses[size]}
          ${colorClasses}
        `}
      />
    </div>
  )
}

export default LoadingSpinner
