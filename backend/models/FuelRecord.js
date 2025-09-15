const mongoose = require("mongoose");

const fuelRecordSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  date: { type: Date, required: true },
  liters: { type: Number, required: true },
  pricePerLiter: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  odometer: { type: Number }
});

module.exports = mongoose.model("FuelRecord", fuelRecordSchema);
