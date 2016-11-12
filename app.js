'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Twitter = require('twitter');
const watson = require('watson-developer-cloud');

const Feedback = require('./models/feedback');
const Personality = require('./models/personality');

const routes = require('./routes/index');
const users = require('./routes/users');

const personalityInsightsApiVersion = 'v2';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

const mongodbUri = process.env.MONGODB_URI;
mongoose.connect(mongodbUri, err => {
  if (err) {
    console.log('Error connecting to ' + mongodbUri + '. ' + err);
  } else {
    console.log('Connected to ' + mongodbUri);
  }
});

const twitterClient = new Twitter({
  consumer_key: process.env.O3_BARISTA_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.O3_BARISTA_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.O3_BARISTA_TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.O3_BARISTA_TWITTER_ACCESS_TOKEN_SECRET
});

const personalityInsightsClient = watson.personality_insights({
  username: process.env.O3_BARISTA_INSIGHTS_USERNAME,
  password: process.env.O3_BARISTA_INSIGHTS_PASSWORD,
  version: personalityInsightsApiVersion
});

app.put('/api/watson/:twitteruser', function(req, res) {
  const username = req.params.twitteruser;

  const watsonFetch = function() {
    return new Promise(function(resolve) {
      const params = { screen_name: username, count: 5000 };
      twitterClient.get('statuses/user_timeline', params, function(error, tweets) {
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
  };

  watsonFetch()
    .then(function(result) {
      personalityInsightsClient.profile({
        text: result,
        language: 'en'
      }, function(err, response) {
        if (err) {
          console.log('error:', err);
        } else {
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
          console.log(array);
          res.json(array);
        }
      });
    })
    .catch(function(e) {
      console.log(e);
    });
});

app.post('/api/feedback', function(req, res) {
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

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
