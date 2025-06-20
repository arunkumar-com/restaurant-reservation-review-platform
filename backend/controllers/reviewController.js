const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// Submit a new review
exports.createReview = async (req, res) => {
  try {
    const { restaurantId, customerName, rating, comment } = req.body;

    // Input validation
    if (!restaurantId || !customerName || !rating) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['restaurantId', 'customerName', 'rating']
      });
    }

    // Validate restaurantId format
    if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create review with sanitized data
    const review = new Review({
      restaurantId,
      customerName: customerName.trim(),
      rating: ratingNum,
      comment: comment ? comment.trim() : '',
      date: new Date()
    });

    await review.save();

    // Calculate new average rating
    const allReviews = await Review.find({ restaurantId });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

    res.status(201).json({
      message: 'Review submitted successfully',
      review: review.toObject(),
      restaurantName: restaurant.name,
      restaurantAvgRating: avgRating
    });

  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({
      message: 'Error submitting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all reviews for a restaurant
exports.getReviewsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'date'; // 'date' or 'rating'
    const order = req.query.order || 'desc'; // 'asc' or 'desc'

    // Validate restaurantId
    if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid restaurant ID format' });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [reviews, total] = await Promise.all([
      Review.find({ restaurantId })
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments({ restaurantId })
    ]);

    // Calculate statistics
    const stats = await Review.aggregate([
      { $match: { restaurantId: restaurant._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingDistribution = stats.length > 0 ? {
      1: stats[0].ratings.filter(r => r === 1).length,
      2: stats[0].ratings.filter(r => r === 2).length,
      3: stats[0].ratings.filter(r => r === 3).length,
      4: stats[0].ratings.filter(r => r === 4).length,
      5: stats[0].ratings.filter(r => r === 5).length
    } : null;

    res.json({
      restaurantName: restaurant.name,
      reviews,
      stats: stats.length > 0 ? {
        averageRating: stats[0].avgRating.toFixed(1),
        totalReviews: stats[0].totalReviews,
        ratingDistribution
      } : null,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: page * limit < total
      }
    });

  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({
      message: 'Error fetching reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
