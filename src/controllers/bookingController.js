const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { mallName, slot, hours, totalPrice } = req.body;

    if (!mallName || !slot || !hours || !totalPrice) {
      return res.status(400).json({
        message: "mallName, slot, hours, and totalPrice are required",
      });
    }

    const booking = await Booking.create({ mallName, slot, hours, totalPrice });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

module.exports = { createBooking, getBookings };
