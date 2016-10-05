'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var watson = require('watson-developer-cloud');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//twitter api implementation
var client = new Twitter({
    consumer_key: process.env.COFFEE_PERSONALITY_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.COFFEE_PERSONALITY_TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.COFFEE_PERSONALITY_TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.COFFEE_PERSONALITY_TWITTER_ACCESS_TOKEN_SECRET
});

//change the username from nodejs to any other users.
//setup a variable to change the username here from the textbox from the html
app.get('/api/getname/:name', function(req, res) {
    var params = { screen_name: req.params.name, count: 1000 }; //username goes here
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
            //console.log(tweets);
            res.json(tweets);
        }
    });
});

//watson personality api implementation
var personality_insights = watson.personality_insights({
    username: process.env.COFFEE_PERSONALITY_INSIGHTS_USERNAME,
    password: process.env.COFFEE_PERSONALITY_INSIGHTS_PASSWORD,
    version: 'v2'
});

app.put('/api/watson/:twitteruser', function(req, res) {
    var username = req.params.twitteruser;

    var watsonFetch = function() {
        return new Promise(function(resolve) {

            var params = { screen_name: username, count: 5000 }; //username goes here
            client.get('statuses/user_timeline', params, function(error, tweets) {
                if (!error) {
                    var test;
                    //console.log(tweets);
                    for (var i = 0; i < tweets.length; i++) {
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
            personality_insights.profile({
                    text: result,
                    language: 'en'
                },
                function(err, response) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        //console.log(JSON.stringify(response, null, 2));

                        var array = [];
                        var i = response.tree.children;
                        i.forEach(function(thing) {
                            thing.children.forEach(function(thing2) {
                                var obj = { id: thing2.id, percentage: thing2.percentage };
                                array.push(obj);
                                thing2.children.forEach(function(thing4) {
                                    var obj = { id: thing4.id, percentage: thing4.percentage };
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




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
