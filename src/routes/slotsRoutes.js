const express = require("express");
const {
  createSlot,
  getSlots,
  updateSlotAvailability,
  updateHardwareSlotAvailability,
} = require("../controllers/slotController");

const router = express.Router();

router.post("/", createSlot);
router.get("/", getSlots);
router.post("/hardware/:hardwareId/availability", updateHardwareSlotAvailability);
router.patch("/hardware/:hardwareId/availability", updateHardwareSlotAvailability);
router.patch("/:slotId/availability", updateSlotAvailability);

module.exports = router;
