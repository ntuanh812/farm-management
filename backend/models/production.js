const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  livestockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livestock', required: true },
  productionType: { type: String, required: true, enum: ['milk', 'meat', 'eggs'] },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, enum: ['liter', 'eggs', 'kg'] },
  date: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Production', productionSchema);

