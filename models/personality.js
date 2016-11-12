'use strict';

const mongoose = require('mongoose');

const personalitySchema = mongoose.Schema({
  twitter_handle: String,
  raw_response: Object,
  api_version: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;
