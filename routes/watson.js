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

router.put('/:twitteruser', (req, res) => {
  const username = req.params.twitteruser;

  fetchTwitterFeed(username)
    .then(result => {
      personalityInsightsClient.profile({
        text: result,
        language: 'en'
      }, (err, response) => {
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
    .catch(e => {
      console.log(e);
    });
});

function fetchTwitterFeed(username) {
  return new Promise(resolve => {
    const params = { screen_name: username, count: 5000 };
    twitterClient.get('statuses/user_timeline', params, (error, tweets) => {
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
  const resultArray = [];

  // There are only 3 child objects as the value of the tree property for now.
  // These serve as the aspects which will lead to an insight.
  // Personality, Needs, Values are the 3 aspects
  // This may change in the future.
  const aspects = response.tree.children;

  aspects.forEach(aspect => {
    // loop for traits of aspects
    aspect.children.forEach(trait => {
      const traitObject = { id: trait.id, percentage: trait.percentage };
      resultArray.push(traitObject);

      // loop for traits of traits of aspects
      trait.children.forEach(subTrait => {
        const subTraitObject = { id: subTrait.id, percentage: subTrait.percentage };
        resultArray.push(subTraitObject);
      });
    });
  });
  
  return resultArray;
}

module.exports = router;
