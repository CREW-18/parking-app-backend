const Parking = require('../models/Parking');
const Slot = require('../models/Slot');

// 1. PARK A VEHICLE
exports.parkVehicle = async (req, res) => {
  try {
    const { vehicleNumber, slotId } = req.body;

    // Create the parking record
    const newParking = new Parking({
      vehicleNumber,
      slotId,
      status: "Active",
      entryTime: new Date()
    });

    await newParking.save();

    // Mark the slot as occupied so no one else takes it
    await Slot.findByIdAndUpdate(slotId, { isAvailable: false });

    res.status(201).json({
      message: `Vehicle ${vehicleNumber} has been parked.`,
      parking: newParking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET ALL ACTIVE PARKING RECORDS (Dashboard)
exports.getParkings = async (req, res) => {
  try {
    // We added { status: 'Active' } here to hide the "Completed" vehicles!
    const parkings = await Parking.find({ status: 'Active' }).populate('slotId');
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. EXIT PARKING (The new logic for your EXIT buttons)
exports.exitParking = async (req, res) => {
  try {
    const { parkingId } = req.params;

    // Find the active record
    const record = await Parking.findById(parkingId);
    if (!record) {
      return res.status(404).json({ message: "Parking record not found" });
    }

    // Update the record status
    record.status = "Completed";
    record.exitTime = new Date();
    await record.save();

    // Crucial: Make the Slot available again in the database
    await Slot.findByIdAndUpdate(record.slotId, { isAvailable: true });

    res.status(200).json({ 
      message: "Vehicle exited successfully!",
      record 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};