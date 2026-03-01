const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express Motherboard
const app = express();

// 3. Security & Data Parsers (Middleware)
app.use(cors());
app.use(express.json());

// 4. Import Routes (The proper CommonJS way)
const authRoutes = require("./authRoutes.js");
const bookingRoutes = require("./bookingRoutes.js");
const parkingRoutes = require("./parkingRoutes.js");
const slotRoutes = require("./SlotRoutes.js");

// 5. Direct Database Connection Engine
// We do this directly here to prevent config folder crashes!
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parkpulse";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 6. Mount the Routes (The fix for Line 48)
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/slots", slotRoutes);

// 7. Base Health Check Route
app.get("/", (req, res) => {
  res.send("Park Pulse API is Live and Beating!");
});

// 8. Fire Up the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Pulse Server running on port ${PORT}`);
});