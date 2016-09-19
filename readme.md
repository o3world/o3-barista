# Coffee Personality

The Coffee Personality app is a Node.js Express application that uses the [IBM Watson Personality Insights API](https://www.ibm.com/watson/developercloud/personality-insights.html) to scan a person's Twitter feed and map their personality to what kind of coffee drinker they are.

## Local Setup

Install the Heroku CLI.

```
brew install heroku
```

Clone the repo and navigate into it.

```
git clone git@bitbucket.org:o3world/coffee-personality.git
cd coffee-personality
```

Set up the `heroku` remote.

```
heroku git:remote -a coffee-personality
```

Install and activate Node v6.6.0, preferably using NVM.

```
nvm install 6.6.0
```

Install the Node dependencies.

```
npm install
```

Set up your Watson Personality Insights and Twitter API credentials as environment variables in your `.env` file. You can use the included `.env.example` file as a base.

See the [internal documentation](https://paper.dropbox.com/doc/Coffee-Personality-hZmAqe12GPBCMqVxgk94M#:uid=473478730772322&h2=Credentials) for more details on obtaining credentials.

Start the Express server.

```
heroku local web
```

The app will now be available at http://localhost:5000

Alternatively, you can run the start script directly, and set your environment variables in your `.bashrc` / `.zshrc`. The app will be available at http://localhost:3000 by default.

```
npm start
```

## Deployment

The app is deployed to the `coffee-personality` Heroku app via Git.

```
git push heroku master
```

## Internal Documentation
[Paper Doc](https://paper.dropbox.com/doc/Coffee-Personality-hZmAqe12GPBCMqVxgk94M)
