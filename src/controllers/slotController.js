const Slot = require("../models/Slot");

const normalizeVehicleType = (vehicleType) => {
  if (!vehicleType) {
    return "Car";
  }

  const value = vehicleType.toString().toLowerCase();
  return value === "bike" ? "Bike" : "Car";
};

const createSlot = async (req, res) => {
  try {
    const { slotNumber, vehicleType, type } = req.body;

    if (!slotNumber) {
      return res.status(400).json({ message: "slotNumber is required" });
    }

    const slot = await Slot.create({
      slotNumber,
      vehicleType: normalizeVehicleType(vehicleType || type),
      isAvailable: true,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error: error.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotNumber: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error: error.message });
  }
};

const updateSlotAvailability = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ message: "isAvailable must be true or false" });
    }

    const slot = await Slot.findByIdAndUpdate(
      slotId,
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error updating slot", error: error.message });
  }
};

module.exports = { createSlot, getSlots, updateSlotAvailability };
