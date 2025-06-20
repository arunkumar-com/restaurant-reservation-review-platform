const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

// Get all restaurants with pagination and filtering
exports.getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const [restaurants, total] = await Promise.all([
      Restaurant.find(query)
        .select('name location description')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Restaurant.countDocuments(query)
    ]);

    // Get average ratings for each restaurant
    const restaurantsWithRatings = await Promise.all(
      restaurants.map(async (restaurant) => {
        const reviews = await Review.find({ restaurantId: restaurant._id });
        const avgRating = reviews.length > 0
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
          : null;
        return {
          ...restaurant,
          avgRating,
          reviewCount: reviews.length
        };
      })
    );

    res.json({
      restaurants: restaurantsWithRatings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching restaurants',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get restaurant details by ID including available tables and reviews
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const date = req.query.date ? new Date(req.query.date) : new Date();

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get available tables
    const availableTables = restaurant.tables.filter(table => {
      return !table.isReserved || (table.reservationDate && table.reservationDate < date);
    });

    // Get reviews and calculate average rating
    const reviews = await Review.find({ restaurantId: id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({
      ...restaurant.toObject(),
      availableTables,
      reviews,
      avgRating,
      reviewCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching restaurant details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
