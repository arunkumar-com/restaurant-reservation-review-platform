const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

/**
 * @route GET /api/restaurants
 * @desc Get all restaurants with pagination and filtering
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} search - Search term for restaurant name or location
 * @access Public
 */
router.get('/', restaurantController.getRestaurants);

/**
 * @route GET /api/restaurants/:id
 * @desc Get restaurant details including available tables and reviews
 * @param {string} id - Restaurant ID
 * @query {string} date - Optional date to check table availability
 * @access Public
 */
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router;
