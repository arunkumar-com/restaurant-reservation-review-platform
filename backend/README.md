# Restaurant Reservation API

Backend API for the Restaurant Reservation and Review Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/restaurant-reservation
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Restaurants

#### GET /api/restaurants
Get all restaurants with pagination and filtering
- Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - search (optional): Search by restaurant name or location

#### GET /api/restaurants/:id
Get restaurant details including available tables and reviews
- URL Parameters:
  - id: Restaurant ID
- Query Parameters:
  - date (optional): Check table availability for specific date
- Returns:
  - Restaurant details
  - Available tables
  - Recent reviews
  - Average rating

### Reservations

#### POST /api/reservations
Create a new reservation
- Body:
  - restaurantId: string (required)
  - customerName: string (required)
  - contact: string (required)
  - tableNumber: number (required)
  - dateTime: string (ISO date, required)
- Returns:
  - Reservation details
  - Restaurant name
  - Table seats

#### GET /api/reservations/:restaurantId
Get all reservations for a restaurant (admin only)
- URL Parameters:
  - restaurantId: Restaurant ID
- Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - status: 'upcoming' | 'past' | 'all'
- Returns:
  - List of reservations
  - Pagination info

#### DELETE /api/reservations/:id
Cancel a reservation
- URL Parameters:
  - id: Reservation ID
- Validation:
  - Cannot cancel past reservations
- Returns:
  - Success message

### Reviews

#### POST /api/reviews
Submit a new review
- Body:
  - restaurantId: string (required)
  - customerName: string (required)
  - rating: number (1-5, required)
  - comment: string (optional)
- Returns:
  - Review details
  - Restaurant name
  - Updated average rating

#### GET /api/reviews/:restaurantId
Get all reviews for a restaurant
- URL Parameters:
  - restaurantId: Restaurant ID
- Query Parameters:
  - page (default: 1)
  - limit (default: 10)
  - sort: 'date' | 'rating' (default: 'date')
  - order: 'asc' | 'desc' (default: 'desc')
- Returns:
  - Restaurant name
  - List of reviews
  - Statistics (avg rating, total reviews)
  - Rating distribution
  - Pagination info

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (invalid input)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include:
```json
{
  "message": "Error description",
  "error": "Detailed error in development mode"
}
```

## Data Validation

- Restaurant IDs must be valid MongoDB ObjectIDs
- Dates must be in the future for reservations
- Ratings must be between 1 and 5
- Contact numbers must be in valid format
- Required fields are enforced
- Input strings are trimmed
- Pagination parameters are validated

## Security

- CORS enabled for frontend origin
- Request body size limited
- JWT authentication for admin routes
- Error messages sanitized in production
- MongoDB injection prevention
