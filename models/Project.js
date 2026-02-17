const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide title'],
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'pending'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
