const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  icon: { type: String },
  content: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);

