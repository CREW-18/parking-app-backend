import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// 1. Start the server FIRST so you see it working
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`👉 Test it here: http://localhost:${PORT}`);
});

// 2. Try connecting to Database (but don't crash if it fails)
connectDB().catch((err) => {
  console.log("⚠️  Database Connection Failed (Expected if using dummy link)");
  console.log("   Server is still running in offline mode!");
});