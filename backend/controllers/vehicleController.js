const Vehicle = require("../models/Vehicle");

exports.addVehicle = async (req, res) => {
  try {
    const { make, model, year, registrationNumber } = req.body;
    const vehicle = new Vehicle({ userId: req.user.id, make, model, year, registrationNumber });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
