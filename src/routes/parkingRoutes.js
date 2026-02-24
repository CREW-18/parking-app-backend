const express = require('express');
const router = express.Router();
const { parkVehicle, getParkings, exitParking } = require('../controllers/parkingController');

// Route: POST /api/parking
router.post('/', parkVehicle);

// Route: GET /api/parking
router.get('/', getParkings);

// Add this line below your other routes
router.put('/exit/:parkingId', exitParking);

module.exports = router;