const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const compression = require('compression');
const MongoStore = require('connect-mongo')(session);
const verifyAuthentication = require('./verify-authentication');
const loginRouter = require('./api/login');
const twatsRouter = require('./api/twats');
const usersRouter = require('./api/users');

const app = express();

(async function startServer() {
  await mongoose.connect('mongodb://localhost:27017/twit', { useNewUrlParser: true });
  console.log('Connected to database.');

  /* Track sessions in MongoDB */
  app.use(session({
    name: 'twit-session',
    secret: 'development-placeholder', // TODO load from config file for prod
    sameSite: 'strict',
    resave: false,
    unset: 'destroy',
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }));

  /* Compress responses with gzip */
  app.use(compression());

  /* Unauthenticated API endpoints */
  app.use('/api/login', loginRouter);

  /* Host static files from /dist */
  app.use('/dist', express.static(path.join(__dirname, '../webclient/dist')));

  /* Kick to login if not authenticated */
  app.use(verifyAuthentication);

  /* Authenticated API endpoints */
  app.use('/api/twats', twatsRouter);
  app.use('/api/users', usersRouter);

  // If no other route matches, send GET requests to index.html
  app.get('/*', (req, res) => res.sendFile(
    path.join(__dirname, '../webclient/dist/index.html')));

  app.listen(8080, () => console.log('Twit server listening on port 8080.'));
}());
