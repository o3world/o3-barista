'use strict';

const express = require('express');
const router = express.Router();

const Feedback = require('../models/feedback');

router.post('/', (req, res) => {
  console.log(req.body);

  const feedback = new Feedback({
    twitter_handle: req.body.twitter_handle,
    expected_preference: req.body.expected_preference,
    actual_preference: req.body.actual_preference
  });

  feedback.save(err => {
    if (err) {
      console.error(err);
    }

    res.sendStatus(201);
  });
});

module.exports = router;
