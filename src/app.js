const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const slotRoutes = require("./routes/slotsRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

if (process.env.CORS_ORIGIN) {
  const origins = process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
  app.use(cors({ origin: origins }));
} else {
  app.use(cors());
}

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    name: "Park Pulse API",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/slots", slotRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
