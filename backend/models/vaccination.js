const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  livestockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livestock', required: true },
  vaccineName: { type: String, required: true },
  vaccinationDate: { type: Date, required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  notes: { type: String },
  status: { type: String, enum: ['scheduled', 'done'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);

