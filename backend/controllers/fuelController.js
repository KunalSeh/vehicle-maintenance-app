const FuelRecord = require("../models/FuelRecord");

exports.addFuelRecord = async (req, res) => {
  try {
    const { vehicleId, date, liters, pricePerLiter, totalCost, odometer } = req.body;
    const record = new FuelRecord({ vehicleId, date, liters, pricePerLiter, totalCost, odometer });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFuelRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const records = await FuelRecord.find({ vehicleId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
