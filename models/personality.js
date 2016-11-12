'use strict';

const mongoose = require('mongoose');

const personalitySchema = mongoose.Schema({
  twitter_handle: String,
  raw_response: Object,
  api_version: String
}, {
  timestamps: true
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;
