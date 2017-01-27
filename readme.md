# O3 Barista

O3 Barista is a Node.js Express application that uses the [IBM Watson Personality Insights API](https://www.ibm.com/watson/developercloud/personality-insights.html) to scan a person's Twitter feed and map their personality to what kind of coffee drinker they are.

#
![screenshot of project main page](/public/images/demo-screenshot.jpg)

## Link to project on Heroku

https://o3-barista.herokuapp.com/

## O3 Worlds website

http://o3world.com/

## Local Setup

Clone the repo and navigate into it.

```
git clone https://github.com/o3world/o3-barista.git
cd o3-barista
```

Set up the `heroku` remote.

```
heroku git:remote -a o3-barista
```

Install and activate Node v6.6.0, preferably using [nvm](https://github.com/creationix/nvm). Once it is installed, you can run `nvm use` to activate it.

```
nvm install
```

Install the Node dependencies.

```
npm install
```

Set up your Watson Personality Insights and Twitter API credentials as environment variables in your `.env` file. You can use the included `.env.example` file as a base. See further below for more details on both the Watson Personality Insights and Twitter API.

````
O3_BARISTA_INSIGHTS_USERNAME=<Watson Personality Insights username>
O3_BARISTA_INSIGHTS_PASSWORD=<Watson Personality Insights password>
O3_BARISTA_TWITTER_CONSUMER_KEY=<Twitter consumer key>
O3_BARISTA_TWITTER_CONSUMER_SECRET=<Twitter consumer secret>
O3_BARISTA_TWITTER_ACCESS_TOKEN_KEY=<Twitter access token key>
O3_BARISTA_TWITTER_ACCESS_TOKEN_SECRET=<Twitter access token secret>
````

Start the Express server.

set your environment variables in your `.bashrc` / `.zshrc`. The app will be available at http://localhost:3000 by default.

```
npm start
```
##IMB Bluemix Platform

All Watson services are available via the IBM Bluemix platform. Credentials can be obtained within the service’s “Service Credentials” page in the dashboard.

**Console: https://console.ng.bluemix.net/**

##Twitter API

In order to read a user’s twitter feed, the Coffee Personality app will need to access the Twitter API via OAuth authorization. Credentials can be obtained within the authorized app’s “Keys and Access Tokens” page.

**Console: https://apps.twitter.com/**
