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
    locationName: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    hardwareId: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    isHardwareLinked: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["free", "booked", "occupied"],
      default: "free",
    },
    bookingToken: {
      type: String,
      default: null,
    },
    occupiedBy: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
