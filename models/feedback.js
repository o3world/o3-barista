'use strict';

const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  twitter_handle: String,
  expected_preference: String,
  actual_preference: String
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
