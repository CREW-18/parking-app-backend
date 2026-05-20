const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["Car", "Bike"],
      default: "Car",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
