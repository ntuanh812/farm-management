const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['warning', 'info'] },
  title: { type: String, required: true },
  content: { type: String, required: true },
  icon: { type: String },
  entityType: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  link: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

