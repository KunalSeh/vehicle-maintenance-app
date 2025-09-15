const express = require("express");
const { addServiceRecord, getServiceRecords } = require("../controllers/serviceController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, addServiceRecord);
router.get("/:vehicleId", auth, getServiceRecords);

module.exports = router;
