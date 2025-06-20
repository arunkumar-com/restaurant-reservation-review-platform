import { useState } from 'react'

function StarRating({ 
  rating, 
  onRatingChange = null, 
  size = 'default',
  readonly = false 
}) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl'
  }

  const renderStar = (index) => {
    const filled = (hoverRating || rating) >= index

    return (
      <button
        key={index}
        type={readonly ? 'button' : 'button'}
        className={`
          ${sizeClasses[size]}
          ${filled ? 'text-yellow-400' : 'text-gray-300'}
          ${!readonly && 'hover:scale-110 transition-transform'}
          focus:outline-none
        `}
        onMouseEnter={() => !readonly && setHoverRating(index)}
        onMouseLeave={() => !readonly && setHoverRating(0)}
        onClick={() => !readonly && onRatingChange && onRatingChange(index)}
        disabled={readonly}
        aria-label={`Rate ${index} stars`}
      >
        <i className="fas fa-star"></i>
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(index => renderStar(index))}
      
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating
