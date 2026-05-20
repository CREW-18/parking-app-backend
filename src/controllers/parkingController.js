const Parking = require("../models/Parking");
const Slot = require("../models/Slot");

const parkVehicle = async (req, res) => {
  try {
    const { vehicleNumber, slotId } = req.body;

    if (!vehicleNumber || !slotId) {
      return res.status(400).json({ message: "vehicleNumber and slotId are required" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (!slot.isAvailable) {
      return res.status(409).json({ message: "Slot is already occupied" });
    }

    const parking = await Parking.create({
      vehicleNumber,
      slotId,
      status: "Active",
      entryTime: new Date(),
    });

    slot.isAvailable = false;
    await slot.save();

    const populatedParking = await Parking.findById(parking._id).populate("slotId");

    res.status(201).json({
      message: "Vehicle parked successfully",
      parking: populatedParking,
    });
  } catch (error) {
    res.status(500).json({ message: "Parking failed", error: error.message });
  }
};

const getParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ status: "Active" }).populate("slotId");
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parkings", error: error.message });
  }
};

const exitParking = async (req, res) => {
  try {
    const { parkingId } = req.params;

    const record = await Parking.findById(parkingId);
    if (!record) {
      return res.status(404).json({ message: "Parking record not found" });
    }

    if (record.status === "Completed") {
      return res.status(409).json({ message: "Parking record is already completed" });
    }

    record.status = "Completed";
    record.exitTime = new Date();
    await record.save();

    await Slot.findByIdAndUpdate(record.slotId, { isAvailable: true });

    res.status(200).json({
      message: "Vehicle exited successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: "Exit failed", error: error.message });
  }
};

module.exports = { parkVehicle, getParkings, exitParking };
