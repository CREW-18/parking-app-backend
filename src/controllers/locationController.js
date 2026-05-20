const Location = require("../models/Location");

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ rating: -1, name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error: error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const { name, location, distance, rating, status, image } = req.body;

    if (!name || !distance || !image) {
      return res.status(400).json({ message: "name, distance, and image are required" });
    }

    const parkingLocation = await Location.create({
      name,
      location,
      distance,
      rating,
      status,
      image,
    });

    res.status(201).json(parkingLocation);
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error: error.message });
  }
};

module.exports = { getLocations, createLocation };
