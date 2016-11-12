'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const watsonRoutes = require('./routes/watson');
const feedbackRoutes = require('./routes/feedback');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/watson', watsonRoutes);
app.use('/api/feedback', feedbackRoutes);

const mongodbUri = process.env.MONGODB_URI;
mongoose.connect(mongodbUri, err => {
  if (err) {
    console.log('Error connecting to ' + mongodbUri + '. ' + err);
  } else {
    console.log('Connected to ' + mongodbUri);
  }
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
