const ServiceRecord = require("../models/ServiceRecord");

exports.addServiceRecord = async (req, res) => {
  try {
    const { vehicleId, date, serviceType, cost, notes } = req.body;
    const record = new ServiceRecord({ vehicleId, date, serviceType, cost, notes });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServiceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const records = await ServiceRecord.find({ vehicleId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
