const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Location = require("../src/models/Location");

dotenv.config();

const locations = [
  {
    name: "Phoenix Mall of Asia",
    location: "Hebbal, Bengaluru",
    distance: "2.4 km",
    rating: 4.8,
    status: "High Demand",
    image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Nexus Mall",
    location: "Koramangala, Bengaluru",
    distance: "4.1 km",
    rating: 4.6,
    status: "Available",
    image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "UB City Mall",
    location: "Vittal Mallya Road, Bengaluru",
    distance: "5.3 km",
    rating: 4.9,
    status: "Available",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900",
  },
  {
    name: "Orion Mall",
    location: "Rajajinagar, Bengaluru",
    distance: "6.8 km",
    rating: 4.5,
    status: "Congested",
    image: "https://images.unsplash.com/photo-1567449303078-57ad995bd17d?auto=format&fit=crop&q=80&w=900",
  },
];

const seedLocations = async () => {
  try {
    await connectDB();

    await Promise.all(
      locations.map((location) =>
        Location.updateOne(
          { name: location.name },
          { $set: location },
          { upsert: true, runValidators: true }
        )
      )
    );

    console.log(`Seeded ${locations.length} parking locations`);
  } catch (error) {
    console.error(`Location seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedLocations();
