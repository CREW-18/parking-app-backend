const express = require("express");
const { createSlot, getSlots, updateSlotAvailability } = require("../controllers/slotController");

const router = express.Router();

router.post("/", createSlot);
router.get("/", getSlots);
router.patch("/:slotId/availability", updateSlotAvailability);

module.exports = router;
