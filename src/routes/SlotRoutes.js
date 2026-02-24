const express = require("express");
const { createSlot, getSlotsByParking } = require("../controllers/slotController.js");
const router = express.Router();

router.post("/", createSlot);
router.get("/:parkingId", getSlotsByParking);

module.exports = router;
