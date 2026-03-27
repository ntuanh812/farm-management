const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['manager', 'worker', 'vet'] },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  avatar: { type: String },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);

