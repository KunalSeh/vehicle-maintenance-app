const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  date: { type: Date, required: true },
  serviceType: { type: String, required: true },
  cost: { type: Number, required: true },
  notes: { type: String }
});

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);
