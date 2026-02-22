import express from "express";
import cors from "cors";
import morgan from "morgan";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Base test route
app.get("/", (req, res) => {
  res.json({ message: "Parking App Backend is running" });
});

// Note: If your route files are currently empty, commenting these 4 lines out temporarily will prevent crashes until your team fills them in!
app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;