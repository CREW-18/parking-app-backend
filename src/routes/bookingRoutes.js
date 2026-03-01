const express = require("express");
// Look at what functions you were importing before, and put them in the { }
const { createBooking, getUserBookings } = require("../controllers/bookingController.js"); 

const router = express.Router();
// 1. POST: Create a new booking when the user pays
router.post('/create', async (req, res) => {
  try {
    const { mallName, slot, hours, totalPrice } = req.body;
    const newBooking = new Booking({ mallName, slot, hours, totalPrice });
    
    await newBooking.save(); // Saves it to MongoDB!
    res.status(201).json({ message: "Booking successfully saved to MongoDB!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// 2. GET: We will use this later for Option B (The "My Bookings" screen)
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;