const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  mallName: { type: String, required: true },
  slot: { type: String, required: true },
  hours: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);