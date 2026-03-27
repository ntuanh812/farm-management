const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['grain', 'supplement'] },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, enum: ['kg', 'bag'] },
  minQuantity: { type: Number },
  expiryDate: { type: Date },
  room: { type: String },
  status: { type: String, enum: ['available', 'low'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feed', feedSchema);

