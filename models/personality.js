'use strict';

const mongoose = require('mongoose');

const personalitySchema = mongoose.Schema({
  input_source: {
    type: String,
    enum: [
      'twitter'
    ]
  },
  username: String,
  raw_response: Object,
  api_version: String
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;
