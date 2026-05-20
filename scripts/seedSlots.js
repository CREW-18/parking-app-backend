const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Slot = require("../src/models/Slot");

dotenv.config();

const slots = [
  { slotNumber: "A1", vehicleType: "Car" },
  { slotNumber: "A2", vehicleType: "Car" },
  { slotNumber: "A3", vehicleType: "Car" },
  { slotNumber: "B1", vehicleType: "Bike" },
  { slotNumber: "B2", vehicleType: "Bike" },
  { slotNumber: "B3", vehicleType: "Bike" },
  {
    slotNumber: "KCT-A1",
    vehicleType: "Car",
    locationName: "KCT",
    hardwareId: "KCT-SENSOR-01",
    isHardwareLinked: true,
  },
];

const seedSlots = async () => {
  try {
    await connectDB();

    await Promise.all(
      slots.map((slot) =>
        Slot.updateOne(
          { slotNumber: slot.slotNumber },
          { $set: slot, $setOnInsert: { isAvailable: true } },
          { upsert: true, runValidators: true }
        )
      )
    );

    console.log(`Seeded ${slots.length} parking slots`);
  } catch (error) {
    console.error(`Slot seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedSlots();
