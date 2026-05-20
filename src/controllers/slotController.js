const Slot = require("../models/Slot");

const normalizeVehicleType = (vehicleType) => {
  if (!vehicleType) {
    return "Car";
  }

  const value = vehicleType.toString().toLowerCase();
  return value === "bike" ? "Bike" : "Car";
};

const normalizeText = (value) => value?.toString().trim().toUpperCase();

const parseAvailability = (body) => {
  if (typeof body.isAvailable === "boolean") {
    return body.isAvailable;
  }

  if (typeof body.sensorBlocked === "boolean") {
    return !body.sensorBlocked;
  }

  return undefined;
};

const createSlot = async (req, res) => {
  try {
    const { slotNumber, vehicleType, type, locationName, venueName, hardwareId, isHardwareLinked } = req.body;

    if (!slotNumber) {
      return res.status(400).json({ message: "slotNumber is required" });
    }

    const slot = await Slot.create({
      slotNumber,
      vehicleType: normalizeVehicleType(vehicleType || type),
      locationName: normalizeText(locationName || venueName) || "",
      hardwareId: normalizeText(hardwareId),
      isHardwareLinked: Boolean(isHardwareLinked || hardwareId),
      isAvailable: true,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error: error.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const filter = {};

    if (req.query.locationName || req.query.venueName) {
      filter.locationName = normalizeText(req.query.locationName || req.query.venueName);
    }

    if (req.query.hardwareLinked === "true") {
      filter.isHardwareLinked = true;
    }

    const slots = await Slot.find(filter).sort({ locationName: 1, slotNumber: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error: error.message });
  }
};

const updateSlotAvailability = async (req, res) => {
  try {
    const { slotId } = req.params;
    const isAvailable = parseAvailability(req.body);

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "Send either isAvailable or sensorBlocked as true or false",
      });
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

const updateHardwareSlotAvailability = async (req, res) => {
  try {
    const { hardwareId } = req.params;
    const isAvailable = parseAvailability(req.body);

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "Send either isAvailable or sensorBlocked as true or false",
      });
    }

    const slot = await Slot.findOneAndUpdate(
      { hardwareId: normalizeText(hardwareId) },
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Hardware-linked slot not found" });
    }

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error updating hardware slot", error: error.message });
  }
};

module.exports = { createSlot, getSlots, updateSlotAvailability, updateHardwareSlotAvailability };
