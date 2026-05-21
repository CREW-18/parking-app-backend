const crypto = require("crypto");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Slot = require("../models/Slot");
const slotEvents = require("../realtime/slotEvents");

const createBooking = async (req, res) => {
  try {
    const { mallName, slot, hours, totalPrice, userId } = req.body;

    if (!mallName || !slot || !hours || !totalPrice || !userId) {
      return res.status(400).json({
        message: "mallName, slot, hours, totalPrice, and userId are required",
      });
    }

    const qrToken = crypto.randomUUID();
    const booking = await Booking.create({
      mallName,
      slot,
      hours,
      totalPrice,
      userId,
      qrToken,
    });

    // Update slot status to booked
    const updatedSlot = await Slot.findOneAndUpdate(
      { slotNumber: slot.toUpperCase() },
      {
        status: "booked",
        bookingToken: qrToken,
        isAvailable: false,
      },
      { new: true }
    );

    if (updatedSlot) {
      slotEvents.emit("availability", updatedSlot.toObject());
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

const verifyQR = async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ qrToken: token });

    if (!booking) return res.status(404).json({ message: "Invalid QR token" });
    if (booking.qrScanned)
      return res.status(400).json({ message: "QR already scanned" });

    const user = await User.findById(booking.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    booking.qrScanned = true;
    booking.status = "occupied";
    booking.occupiedBy = {
      name: user.name,
      email: user.email,
      userId: user._id,
    };
    await booking.save();

    // Update slot status to occupied and populate occupiedBy
    const updatedSlot = await Slot.findOneAndUpdate(
      { slotNumber: booking.slot.toUpperCase() },
      {
        status: "occupied",
        occupiedBy: booking.occupiedBy,
      },
      { new: true }
    );

    if (updatedSlot) {
      slotEvents.emit("availability", updatedSlot.toObject());
    }

    res.json({ message: "QR verified", occupiedBy: booking.occupiedBy });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
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

module.exports = { createBooking, getBookings, verifyQR };
