'use strict';

const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  twitter_handle: String,
  expected_preference: String,
  actual_preference: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
