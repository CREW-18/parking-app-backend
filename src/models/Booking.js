const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  mallName: { type: String, required: true },
  slot: { type: String, required: true },
  hours: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  qrToken: { type: String, unique: true, sparse: true },
  qrScanned: { type: Boolean, default: false },
  occupiedBy: {
    name: { type: String, default: null },
    email: { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  status: {
    type: String,
    enum: ["booked", "occupied", "completed"],
    default: "booked",
  },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);