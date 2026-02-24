const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String, // Changed to String so it accepts "A1"
      required: true,
      unique: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Car', 'Bike'], 
      default: 'Car',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// We don't require a parkingId upon creation anymore!
module.exports = mongoose.model("Slot", slotSchema);