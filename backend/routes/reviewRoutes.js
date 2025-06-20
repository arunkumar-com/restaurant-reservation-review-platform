const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

/**
 * @route POST /api/reviews
 * @desc Submit a new review for a restaurant
 * @body {string} restaurantId - Restaurant ID
 * @body {string} customerName - Name of the reviewer
 * @body {number} rating - Rating between 1-5
 * @body {string} comment - Optional review comment
 * @access Public
 */
router.post('/', reviewController.createReview);

/**
 * @route GET /api/reviews/:restaurantId
 * @desc Get all reviews for a restaurant with pagination and statistics
 * @param {string} restaurantId - Restaurant ID
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} sort - Sort field: 'date' or 'rating' (default: 'date')
 * @query {string} order - Sort order: 'asc' or 'desc' (default: 'desc')
 * @access Public
 */
router.get('/:restaurantId', reviewController.getReviewsByRestaurant);

module.exports = router;
