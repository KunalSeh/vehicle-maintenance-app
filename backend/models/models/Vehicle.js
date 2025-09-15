const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  registrationNumber: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
