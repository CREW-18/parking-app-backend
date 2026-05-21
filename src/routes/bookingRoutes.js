const express = require("express");
const { createBooking, getBookings } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.post("/create", createBooking);
router.get("/", getBookings);
router.get("/my-bookings", getBookings);

module.exports = router;
