import { useState, useEffect } from 'react'
import { restaurantService } from '../services/api.service'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalRestaurants, setTotalRestaurants] = useState(0)

  useEffect(() => {
    fetchRestaurants()
  }, [page, searchTerm])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await restaurantService.getRestaurants(page, 10, searchTerm)
      
      if (page === 1) {
        setRestaurants(data.restaurants)
      } else {
        setRestaurants(prev => [...prev, ...data.restaurants])
      }
      
      setHasMore(data.pagination.hasMore)
      setTotalRestaurants(data.pagination.totalItems)
    } catch (err) {
      setError('Failed to fetch restaurants')
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRestaurants()
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70 mix-blend-multiply"></div>
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-8 leading-tight">
              Discover & Reserve at the Finest Restaurants
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Experience exceptional dining with seamless reservations at the best restaurants in your area.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search restaurants by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white"
                />
                <Button type="submit" variant="primary" size="large">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-20">
        <div className="container">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900">
              {searchTerm 
                ? `Search Results for "${searchTerm}"`
                : 'Featured Restaurants'
              }
              {totalRestaurants > 0 && (
                <span className="text-gray-500 text-xl ml-3">
                  ({totalRestaurants} {totalRestaurants === 1 ? 'restaurant' : 'restaurants'})
                </span>
              )}
            </h2>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchRestaurants()} variant="primary">
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State (Initial) */}
          {loading && page === 1 && (
            <div className="py-12 text-center">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Restaurant Grid */}
          {!error && restaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant._id} 
                  restaurant={restaurant} 
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && restaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No restaurants found{searchTerm ? ` for "${searchTerm}"` : ''}.
              </p>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm('')} 
                  variant="secondary"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Load More */}
          {!loading && !error && hasMore && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadMore} 
                variant="secondary"
                loading={loading && page > 1}
              >
                Load More Restaurants
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">01</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through our curated selection of top-rated restaurants in your area.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">02</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Reserve</h3>
              <p className="text-gray-600 leading-relaxed">
                Select your preferred date and time, and book your table instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">03</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Dine</h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy your dining experience and share your feedback with the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
