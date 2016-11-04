'use strict';

const mongoose = require('mongoose');

const personalitySchema = mongoose.Schema({
  twitter_handle: String,
  raw_response: Object
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;
