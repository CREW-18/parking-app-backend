const Booking = require("../models/Booking.js");

// Logic to create a new parking reservation
const createBooking = async (req, res) => {
  try {
    const { userId, mallId, slotId, hours, totalPrice } = req.body;
    const booking = new Booking({ user: userId, mall: mallId, slot: slotId, hours, totalPrice });
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

// Fetch bookings for a specific user profile
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate("mall");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// THE CRITICAL FIX
module.exports = { createBooking, getUserBookings };