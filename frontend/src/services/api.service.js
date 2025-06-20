import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api.config'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
})

// Restaurant Services
export const restaurantService = {
  // Get all restaurants with pagination and search
  getRestaurants: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await api.get(API_ENDPOINTS.RESTAURANTS, {
        params: { page, limit, search }
      })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  // Get restaurant details by ID
  getRestaurantById: async (id, date) => {
    try {
      const response = await api.get(API_ENDPOINTS.RESTAURANT_DETAILS(id), {
        params: { date }
      })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }
}

// Reservation Services
export const reservationService = {
  // Create new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post(API_ENDPOINTS.RESERVATIONS, reservationData)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  // Get reservations for a restaurant
  getReservationsByRestaurant: async (restaurantId, page = 1, limit = 10, status = 'all') => {
    try {
      const response = await api.get(API_ENDPOINTS.RESTAURANT_RESERVATIONS(restaurantId), {
        params: { page, limit, status }
      })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.CANCEL_RESERVATION(id))
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }
}

// Review Services
export const reviewService = {
  // Submit new review
  createReview: async (reviewData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REVIEWS, reviewData)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  },

  // Get reviews for a restaurant
  getReviewsByRestaurant: async (restaurantId, page = 1, limit = 10, sort = 'date', order = 'desc') => {
    try {
      const response = await api.get(API_ENDPOINTS.RESTAURANT_REVIEWS(restaurantId), {
        params: { page, limit, sort, order }
      })
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }
}

// Error Handler
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.message || 'An error occurred'
    const status = error.response.status
    return new Error(JSON.stringify({ message, status }))
  } else if (error.request) {
    // Request made but no response
    return new Error('Unable to connect to the server')
  } else {
    // Error setting up request
    return new Error('An error occurred while processing your request')
  }
}

// Request/Response Interceptors
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses here
    return Promise.reject(error)
  }
)

export default api
