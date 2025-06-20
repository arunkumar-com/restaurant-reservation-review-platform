import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating'
import Button from '../ui/Button'

function RestaurantCard({ restaurant }) {
  const {
    _id,
    name,
    location,
    description,
    avgRating,
    reviewCount,
    tables = []
  } = restaurant

  const availableTablesCount = tables.filter(table => !table.isReserved).length

  return (
    <div className="card card-hover group">
      {/* Restaurant Image */}
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        <img
          src={`https://source.unsplash.com/480x360/?restaurant,food&${_id}`}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900">
          {location}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-black transition-colors">
            {name}
          </h3>
          {avgRating > 0 && (
            <div className="flex items-center">
              <StarRating 
                rating={avgRating} 
                readonly 
                size="small"
              />
              <span className="ml-2 text-sm text-gray-500">
                ({reviewCount})
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {description}
        </p>

        {/* Table Availability */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm">
            <span className="font-medium text-gray-900">
              {availableTablesCount}
            </span>
            <span className="text-gray-500">
              {' tables available'}
            </span>
          </div>
          
          {/* Table Types */}
          <div className="flex gap-2">
            {tables.some(table => table.seats === 2) && (
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                2 Seats
              </span>
            )}
            {tables.some(table => table.seats === 4) && (
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                4 Seats
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            as={Link}
            to={`/restaurant/${_id}`}
            variant="primary"
            fullWidth
          >
            View Details
          </Button>
          <Button
            as={Link}
            to={`/reservation/new?restaurant=${_id}`}
            variant="secondary"
            fullWidth
          >
            Reserve
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
