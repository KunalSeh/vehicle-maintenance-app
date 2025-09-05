const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json()); // <-- important

let vehicles = [];

// Add vehicle
app.post('/api/vehicles', (req, res) => {
  console.log("➡️ POST request received at /api/vehicles");
  console.log("Received body:", req.body);

  vehicles.push(req.body);
  res.json({ message: 'Vehicle added successfully!', vehicle: req.body });
});

// Get vehicles
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
