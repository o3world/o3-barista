'use strict';

const express = require('express');
const router = express.Router();

const Twitter = require('twitter');
const watson = require('watson-developer-cloud');

const Personality = require('../models/personality');

const personalityInsightsApiVersion = 'v2';

const personalityInsightsClient = watson.personality_insights({
  username: process.env.O3_BARISTA_INSIGHTS_USERNAME,
  password: process.env.O3_BARISTA_INSIGHTS_PASSWORD,
  version: personalityInsightsApiVersion
});

const twitterClient = new Twitter({
  consumer_key: process.env.O3_BARISTA_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.O3_BARISTA_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.O3_BARISTA_TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.O3_BARISTA_TWITTER_ACCESS_TOKEN_SECRET
});

router.put('/:twitteruser', function(req, res) {
  const username = req.params.twitteruser;

  fetchTwitterFeed(username)
    .then(function(result) {
      personalityInsightsClient.profile({
        text: result,
        language: 'en'
      }, function(err, response) {
        if (err) {
          console.log('error:', err);
        } else {
          savePersonalityResponse(username, response);

          const personalityArray = parsePersonalityResponse(response);
          console.log(personalityArray);
          res.json(personalityArray);
        }
      });
    })
    .catch(function(e) {
      console.log(e);
    });
});

function fetchTwitterFeed(username) {
  return new Promise(function(resolve) {
    const params = { screen_name: username, count: 5000 };
    twitterClient.get('statuses/user_timeline', params, function(error, tweets) {
      if (error) {
        console.error(error);
      }

      if (!error) {
        let test;
        for (let i = 0; i < tweets.length; i++) {
          console.log(tweets[i].text);
          test += tweets[i].text;
        }
        resolve(test);
      }
    });
  });
}

function savePersonalityResponse(username, response) {
  const personality = new Personality({
    twitter_handle: username,
    raw_response: response,
    api_version: personalityInsightsApiVersion
  });

  personality.save(err => {
    if (err) {
      console.log(err);
    }
  });
}

function parsePersonalityResponse(response) {
  const array = [];
  const i = response.tree.children;

  i.forEach(function(thing) {
    thing.children.forEach(function(thing2) {
      const obj = { id: thing2.id, percentage: thing2.percentage };
      array.push(obj);
      thing2.children.forEach(function(thing4) {
        const obj = { id: thing4.id, percentage: thing4.percentage };
        array.push(obj);
      });
    });
  });

  return array;
}

module.exports = router;
