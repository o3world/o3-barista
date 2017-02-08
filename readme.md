# O3 Barista

O3 Barista is a Node.js Express web application that uses the [IBM Watson Personality Insights API](https://www.ibm.com/watson/developercloud/personality-insights.html) to analyze tweets in order to gain personality insights that are used to recommend a coffee roast.

#
![screenshot of project main page](/public/images/demo-screenshot.jpg)

## About Barista

We've unified our love of coffee and our fascination with artificial intelligence to create Barista. Barista is O3 World's experiment on how personality can drive preferences for differently roasted coffee beans. Barista uses the [Needs personality model](https://www.ibm.com/watson/developercloud/doc/personality-insights/science.shtml) of Watson Personality Insights. The Needs model correlates human needs with consumer behavior and is based on research by marketing experts Kevin Ford, Gary Armstrong, and Philip Kotler.

We're taking a data-driven approach with Barista. To help us develop our algorithm, Barista will ask you for your feedback after suggesting a coffee roast. We'll use this information to improve Barista's predictions and learn more about the associations between personality and coffee roast preferences.

For the full experience, we recommend using Barista during a coffee tasting (known as a "cupping"), like [we did at the 9th BarCamp Philly](http://o3world.com/news/o3-world-represented-at-barcamp-philly/). Start off by asking Barista for its suggestion, and then try different coffee roasts to find your true preference. When you're done, you can tell Barista whether its prediction was accurate or not. We hope it'll help you explore new roasts, and it'll help us train our algorithm.

## Live Demo

http://barista.o3labs.com/

## O3 Barista is a O3 Labs project. More information about O3 Labs is available here:

http://o3world.com/work/labs/

## O3 Labs is an O3 World Venture

http://o3world.com/

## Local Setup

Install the Heroku CLI.

```
brew install heroku
```

Clone the repo and navigate into it.

```
git clone https://github.com/o3world/o3-barista.git
cd o3-barista
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

Start the Express server.

```
heroku local web
```

The app will now be available at http://localhost:5000

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
