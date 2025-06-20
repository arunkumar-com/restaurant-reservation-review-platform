const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  customerName: { type: String, required: true },
  contact: { type: String, required: true, match: /^[\d\s-+()]+$/ },
  tableNumber: { type: Number, required: true },
  dateTime: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Reservation date must be in the future'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
