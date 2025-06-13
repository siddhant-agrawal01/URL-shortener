// models/Url.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  timestamp: Date,
  ip: String,
  device: String,
  referrer: String,
  hash: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  customCode: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  visits: [visitSchema],
});

module.exports = mongoose.model('Url', urlSchema);
