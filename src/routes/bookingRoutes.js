const express = require("express");
const {
  createBooking,
  getBookings,
  verifyQR,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.post("/create", createBooking);
router.get("/", getBookings);
router.get("/my-bookings", getBookings);
router.get("/verify-qr/:token", verifyQR);

module.exports = router;
