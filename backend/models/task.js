const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['feeding', 'cleaning', 'medical'] },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  barnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Barn' },
  livestockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livestock' },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'in_progress', 'done'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

