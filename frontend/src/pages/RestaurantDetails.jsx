import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { restaurantService, reservationService, reviewService } from '../services/api.service'
import StarRating from '../components/ui/StarRating'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

function RestaurantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTable, setSelectedTable] = useState(null)
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    contact: '',
    time: '18:00'
  })
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchRestaurantDetails()
    fetchReviews()
  }, [id])

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await restaurantService.getRestaurantById(id, selectedDate)
      setRestaurant(data)
    } catch (err) {
      setError('Failed to fetch restaurant details')
      toast.error('Failed to load restaurant details')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviewsByRestaurant(id)
      setReviews(data.reviews)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    }
  }

  const handleReservation = async (e) => {
    e.preventDefault()
    if (!selectedTable) {
      toast.error('Please select a table')
      return
    }

    try {
      setSubmitting(true)
      const reservationData = {
        restaurantId: id,
        tableNumber: selectedTable.tableNumber,
        dateTime: `${selectedDate}T${reservationForm.time}`,
        customerName: reservationForm.customerName,
        contact: reservationForm.contact
      }

      await reservationService.createReservation(reservationData)
      toast.success('Reservation created successfully!')
      navigate('/thank-you')
    } catch (err) {
      toast.error(err.message || 'Failed to create reservation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (reviewForm.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      await reviewService.createReview({
        restaurantId: id,
        ...reviewForm
      })
      toast.success('Review submitted successfully!')
      setShowReviewForm(false)
      fetchReviews() // Refresh reviews
      fetchRestaurantDetails() // Refresh rating
    } catch (err) {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Restaurant not found'}</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={`https://source.unsplash.com/1600x900/?restaurant,food&${id}`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-heading font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center space-x-4 text-white">
              <p>
                <i className="fas fa-map-marker-alt mr-2"></i>
                {restaurant.location}
              </p>
              {restaurant.avgRating && (
                <div className="flex items-center">
                  <StarRating rating={restaurant.avgRating} readonly size="small" />
                  <span className="ml-2">
                    ({restaurant.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Info & Reviews */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="card mb-8 p-6">
              <h2 className="text-2xl font-heading font-semibold mb-4">
                About
              </h2>
              <p className="text-gray-600">
                {restaurant.description}
              </p>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-semibold">
                  Reviews
                </h2>
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant="secondary"
                >
                  Write a Review
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <StarRating
                      rating={reviewForm.rating}
                      onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                      size="large"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="input h-24"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    fullWidth
                  >
                    Submit Review
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.customerName}</p>
                        <StarRating rating={review.rating} readonly size="small" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-2xl font-heading font-semibold mb-6">
                Make a Reservation
              </h2>
              
              <form onSubmit={handleReservation}>
                {/* Date Selection */}
                <div className="mb-4">
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                  <label className="label">Time</label>
                  <select
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, time: e.target.value }))}
                    className="input"
                    required
                  >
                    {Array.from({ length: 14 }, (_, i) => i + 11).map((hour) => (
                      <option key={hour} value={`${hour}:00`}>
                        {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Table Selection */}
                <div className="mb-4">
                  <label className="label">Select Table</label>
                  <div className="grid grid-cols-2 gap-2">
                    {restaurant.tables.map((table) => (
                      <button
                        key={table.tableNumber}
                        type="button"
                        onClick={() => setSelectedTable(table)}
                        className={`
                          p-3 rounded-lg border text-center transition-colors
                          ${table.isReserved 
                            ? 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed'
                            : selectedTable?.tableNumber === table.tableNumber
                              ? 'bg-primary-50 border-primary-500 text-primary-700'
                              : 'bg-white border-gray-200 hover:border-primary-500'
                          }
                        `}
                        disabled={table.isReserved}
                      >
                        <div className="font-medium">Table {table.tableNumber}</div>
                        <div className="text-sm">{table.seats} Seats</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    value={reservationForm.customerName}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, customerName: e.target.value }))}
                    className="input"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="label">Contact Number</label>
                  <input
                    type="tel"
                    value={reservationForm.contact}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, contact: e.target.value }))}
                    className="input"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  fullWidth
                >
                  Reserve Table
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails
