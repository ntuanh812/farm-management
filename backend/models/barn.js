const mongoose = require('mongoose');

const barnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['cow', 'pig', 'chicken'] },
  capacity: { type: Number, required: true },
  currentCount: { type: Number },
  cleanliness: { type: String, enum: ['clean', 'normal', 'dirty'] },
  status: { type: String, enum: ['active', 'maintenance'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Barn', barnSchema);

