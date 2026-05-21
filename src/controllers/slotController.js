const Slot = require("../models/Slot");
const slotEvents = require("../realtime/slotEvents");

const normalizeVehicleType = (vehicleType) => {
  if (!vehicleType) {
    return "Car";
  }

  const value = vehicleType.toString().toLowerCase();
  return value === "bike" ? "Bike" : "Car";
};

const normalizeText = (value) => value?.toString().trim().toUpperCase();

const buildSlotFilter = (query = {}) => {
  const filter = {};

  if (query.locationName || query.venueName) {
    filter.locationName = normalizeText(query.locationName || query.venueName);
  }

  if (query.hardwareLinked === "true") {
    filter.isHardwareLinked = true;
  }

  return filter;
};

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
    res.set("Cache-Control", "no-store, max-age=0");

    const filter = buildSlotFilter(req.query);
    const slots = await Slot.find(filter).sort({ locationName: 1, slotNumber: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error: error.message });
  }
};

const streamSlots = async (req, res) => {
  const filter = buildSlotFilter(req.query);

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const sendSnapshot = async () => {
    try {
      const slots = await Slot.find(filter).sort({ locationName: 1, slotNumber: 1 });
      sendEvent("slots", slots);
    } catch (error) {
      sendEvent("error", { message: "Error streaming slots", error: error.message });
    }
  };

  const shouldIncludeSlot = (slot) => {
    if (filter.locationName && slot.locationName !== filter.locationName) {
      return false;
    }

    if (filter.isHardwareLinked === true && slot.isHardwareLinked !== true) {
      return false;
    }

    return true;
  };

  const handleAvailability = (slot) => {
    if (shouldIncludeSlot(slot)) {
      sendEvent("slot", slot);
    }
  };

  slotEvents.on("availability", handleAvailability);
  await sendSnapshot();

  const heartbeat = setInterval(() => {
    sendEvent("heartbeat", { now: Date.now() });
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    slotEvents.off("availability", handleAvailability);
    res.end();
  });
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

    slotEvents.emit("availability", slot.toObject());
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

    slotEvents.emit("availability", slot.toObject());
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error updating hardware slot", error: error.message });
  }
};

module.exports = {
  createSlot,
  getSlots,
  streamSlots,
  updateSlotAvailability,
  updateHardwareSlotAvailability,
};
