const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, customerName, contact, tableNumber, dateTime } = req.body;

    // Input validation
    if (!restaurantId || !customerName || !contact || !tableNumber || !dateTime) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['restaurantId', 'customerName', 'contact', 'tableNumber', 'dateTime']
      });
    }

    // Validate restaurantId format
    if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    // Validate dateTime
    const reservationDate = new Date(dateTime);
    const now = new Date();
    
    if (isNaN(reservationDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (reservationDate < now) {
      return res.status(400).json({ message: 'Reservation date must be in the future' });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find and validate table
    const table = restaurant.tables.find(t => t.tableNumber === tableNumber);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if table is already reserved
    if (table.isReserved && table.reservationDate && new Date(table.reservationDate) > now) {
      return res.status(400).json({ 
        message: 'Table is already reserved',
        nextAvailable: table.reservationDate
      });
    }

    // Create reservation with validated data
    const reservation = new Reservation({
      restaurantId,
      customerName: customerName.trim(),
      contact: contact.trim(),
      tableNumber,
      dateTime: reservationDate
    });

    // Save reservation
    await reservation.save();

    // Update table status
    table.isReserved = true;
    table.reservationDate = reservationDate;
    await restaurant.save();

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: {
        ...reservation.toObject(),
        restaurantName: restaurant.name,
        tableSeats: table.seats
      }
    });

  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ 
      message: 'Error creating reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get reservations by restaurantId (admin route)
exports.getReservationsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'upcoming', 'past', 'all'

    // Validate restaurantId
    if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    // Build query
    const query = { restaurantId };
    const now = new Date();

    if (status === 'upcoming') {
      query.dateTime = { $gt: now };
    } else if (status === 'past') {
      query.dateTime = { $lt: now };
    }

    // Execute query with pagination
    const [reservations, total] = await Promise.all([
      Reservation.find(query)
        .sort({ dateTime: status === 'past' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Reservation.countDocuments(query)
    ]);

    res.json({
      reservations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: page * limit < total
      }
    });

  } catch (error) {
    console.error('Fetch reservations error:', error);
    res.status(500).json({ 
      message: 'Error fetching reservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate reservation ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid reservation ID format' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if reservation is in the past
    if (new Date(reservation.dateTime) < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past reservations' });
    }

    // Update restaurant table status
    const restaurant = await Restaurant.findById(reservation.restaurantId);
    if (restaurant) {
      const table = restaurant.tables.find(t => t.tableNumber === reservation.tableNumber);
      if (table) {
        table.isReserved = false;
        table.reservationDate = null;
        await restaurant.save();
      }
    }

    // Remove the reservation
    await Reservation.findByIdAndDelete(id);

    res.json({ message: 'Reservation cancelled successfully' });

  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ 
      message: 'Error cancelling reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
