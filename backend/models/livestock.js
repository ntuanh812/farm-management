const mongoose = require('mongoose');

const livestockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagCode: { type: String },
  category: { type: String, required: true, enum: ['livestock', 'poultry'] },
  type: { type: String, required: true, enum: ['cow', 'pig', 'chicken', 'duck'] },
  quantity: { type: Number },
  weight: { type: Number },
  productionType: [{ type: String, enum: ['milk', 'meat', 'eggs'], required: true }],
  healthStatus: { type: String, enum: ['healthy', 'sick', 'quarantine'] },
  barnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Barn', required: true },
  status: { type: String, enum: ['active', 'sold', 'dead'], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livestock', livestockSchema);

