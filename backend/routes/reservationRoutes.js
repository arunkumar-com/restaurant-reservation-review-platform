const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

/**
 * @route POST /api/reservations
 * @desc Create a new reservation
 * @access Public
 */
router.post('/', reservationController.createReservation);

/**
 * @route GET /api/reservations/:restaurantId
 * @desc Get all reservations for a restaurant (admin)
 * @access Private
 */
router.get('/:restaurantId', reservationController.getReservationsByRestaurant);

/**
 * @route DELETE /api/reservations/:id
 * @desc Cancel a reservation
 * @access Public
 */
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;
