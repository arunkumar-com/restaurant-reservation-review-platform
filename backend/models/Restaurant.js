const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  seats: { type: Number, enum: [2, 4], required: true },
  isReserved: { type: Boolean, default: false },
  reservationDate: { type: Date }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  tables: [tableSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
