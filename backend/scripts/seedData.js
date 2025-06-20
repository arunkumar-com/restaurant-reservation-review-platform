const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');

const restaurants = [
  {
    name: "The Italian Corner",
    location: "123 Main St, Downtown",
    description: "Authentic Italian cuisine in a cozy atmosphere. Our handmade pasta and wood-fired pizzas will transport you straight to Italy.",
    tables: [
      { tableNumber: 1, seats: 2 },
      { tableNumber: 2, seats: 2 },
      { tableNumber: 3, seats: 4 },
      { tableNumber: 4, seats: 4 },
      { tableNumber: 5, seats: 4 }
    ]
  },
  {
    name: "Sushi Master",
    location: "456 Oak Ave, Westside",
    description: "Premium sushi and Japanese dishes made with fresh ingredients. Experience the art of Japanese cuisine.",
    tables: [
      { tableNumber: 1, seats: 2 },
      { tableNumber: 2, seats: 2 },
      { tableNumber: 3, seats: 4 },
      { tableNumber: 4, seats: 4 }
    ]
  },
  {
    name: "The Steakhouse",
    location: "789 Pine Rd, Eastside",
    description: "Premium cuts of meat cooked to perfection. Our dry-aged steaks and extensive wine list create the perfect dining experience.",
    tables: [
      { tableNumber: 1, seats: 2 },
      { tableNumber: 2, seats: 2 },
      { tableNumber: 3, seats: 4 },
      { tableNumber: 4, seats: 4 },
      { tableNumber: 5, seats: 4 },
      { tableNumber: 6, seats: 4 }
    ]
  }
];

const reviews = [
  {
    customerName: "John Smith",
    rating: 5,
    comment: "Amazing Italian food! The pasta was perfectly cooked and the service was excellent."
  },
  {
    customerName: "Sarah Johnson",
    rating: 4,
    comment: "Great atmosphere and delicious food. Slightly pricey but worth it."
  },
  {
    customerName: "Mike Brown",
    rating: 5,
    comment: "Best sushi in town! Fresh fish and creative rolls."
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/restaurant-reservation');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Review.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Cleared existing data');

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('Restaurants seeded');

    // Add reviews for restaurants
    const reviewPromises = reviews.map((review, index) => {
      const restaurant = createdRestaurants[index % createdRestaurants.length];
      return Review.create({
        ...review,
        restaurantId: restaurant._id,
        date: new Date()
      });
    });

    await Promise.all(reviewPromises);
    console.log('Reviews seeded');

    // Update restaurant ratings
    for (const restaurant of createdRestaurants) {
      const restaurantReviews = await Review.find({ restaurantId: restaurant._id });
      if (restaurantReviews.length > 0) {
        const avgRating = restaurantReviews.reduce((sum, review) => sum + review.rating, 0) / restaurantReviews.length;
        await Restaurant.findByIdAndUpdate(restaurant._id, {
          avgRating,
          reviewCount: restaurantReviews.length
        });
      }
    }
    console.log('Restaurant ratings updated');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
