export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const API_ENDPOINTS = {
  // Restaurant endpoints
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAILS: (id) => `/restaurants/${id}`,

  // Reservation endpoints
  RESERVATIONS: '/reservations',
  RESTAURANT_RESERVATIONS: (restaurantId) => `/reservations/${restaurantId}`,
  CANCEL_RESERVATION: (id) => `/reservations/${id}`,

  // Review endpoints
  REVIEWS: '/reviews',
  RESTAURANT_REVIEWS: (restaurantId) => `/reviews/${restaurantId}`
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

export const ITEMS_PER_PAGE = 10
