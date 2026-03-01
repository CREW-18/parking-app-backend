const Slot = require("../models/Slot.js");

// 1. Logic to create a new parking slot
const createSlot = async (req, res) => {
  try {
    const { parkingId, slotNumber, type } = req.body;
    const newSlot = new Slot({ parkingId, slotNumber, type, isAvailable: true });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error: error.message });
  }
};

// 2. Logic to fetch all slots for a specific mall/parking area
const getSlotsByParking = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const slots = await Slot.find({ parkingId });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error: error.message });
  }
};

// THE CRITICAL FIX: Exporting so the Router can see the functions
module.exports = { createSlot, getSlotsByParking };