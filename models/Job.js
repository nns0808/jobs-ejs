// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['interview', 'declined', 'pending'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Job', JobSchema);