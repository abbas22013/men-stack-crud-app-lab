// models/car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number },
  description: { type: String },
  image: { type: String }
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
