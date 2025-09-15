const express = require("express");
const { addVehicle, getVehicles } = require("../controllers/vehicleController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, addVehicle);
router.get("/", auth, getVehicles);

module.exports = router;