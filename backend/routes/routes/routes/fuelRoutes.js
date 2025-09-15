const express = require("express");
const { addFuelRecord, getFuelRecords } = require("../controllers/fuelController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, addFuelRecord);
router.get("/:vehicleId", auth, getFuelRecords);

module.exports = router;
