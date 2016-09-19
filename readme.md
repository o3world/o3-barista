# Coffee Personality

The Coffee Personality app is a Node.js Express application that uses the [IBM Watson Personality Insights API](https://www.ibm.com/watson/developercloud/personality-insights.html) to map a person’s personality to what kind of coffee drinker they are.

## Local Setup

Install and activate Node v6.6.0, preferably using NVM.

```
nvm install 6.6.0
```

Install the Node dependencies.

```
npm install
```

Start the Express server. This command executes `./bin/www` with the port set to `3000` by default. The `PORT` environment variable can be set to change which port the server listens on.

```
npm start
```

The app will now be available at http://localhost:3000

## Internal Documentation
[Paper Doc](https://paper.dropbox.com/doc/Coffee-Personality-hZmAqe12GPBCMqVxgk94M)
