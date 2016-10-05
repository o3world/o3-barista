'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Twitter = require('twitter');
const watson = require('watson-developer-cloud');

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

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
const client = new Twitter({
    consumer_key: process.env.COFFEE_PERSONALITY_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.COFFEE_PERSONALITY_TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.COFFEE_PERSONALITY_TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.COFFEE_PERSONALITY_TWITTER_ACCESS_TOKEN_SECRET
});

//change the username from nodejs to any other users.
//setup a variable to change the username here from the textbox from the html
app.get('/api/getname/:name', function(req, res) {
    const params = { screen_name: req.params.name, count: 1000 }; //username goes here
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
            //console.log(tweets);
            res.json(tweets);
        }
    });
});

//watson personality api implementation
const personality_insights = watson.personality_insights({
    username: process.env.COFFEE_PERSONALITY_INSIGHTS_USERNAME,
    password: process.env.COFFEE_PERSONALITY_INSIGHTS_PASSWORD,
    version: 'v2'
});

app.put('/api/watson/:twitteruser', function(req, res) {
    const username = req.params.twitteruser;

    const watsonFetch = function() {
        return new Promise(function(resolve) {

            const params = { screen_name: username, count: 5000 }; //username goes here
            client.get('statuses/user_timeline', params, function(error, tweets) {
                if (!error) {
                    let test;
                    //console.log(tweets);
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
            personality_insights.profile({
                    text: result,
                    language: 'en'
                },
                function(err, response) {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        //console.log(JSON.stringify(response, null, 2));

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




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
