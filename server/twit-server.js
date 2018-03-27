const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const loginRouter = require('./api/login');

const app = express();

(async function startServer() {
  await mongoose.connect('mongodb://localhost:27017/twit');
  console.log('Connected to database.');

  /* Track sessions in MongoDB */
  app.use(session({
    name: 'twit-session',
    secret: 'development-placeholder', // TODO load from config file for prod
    sameSite: 'strict',
    resave: false,
    saveUninitialized: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));

  /* API endpoints */
  app.use('/api/login', loginRouter);

  /* Host static files from /dist */
  app.use('/dist', express.static(path.join(__dirname, '../webclient/dist')));

  /* Kick to login if not authenticated */
  app.use((req, res, next) => {
    // Check whether userId exists in session
    if (
      typeof req.session.userId !== 'string'
      && req.originalUrl !== '/login'
      && !req.originalUrl.startsWith('/dist/')
    ) {
      return res.redirect('/login');
    }
    return next();
  });

  // If no other route matches, send GET requests to index.html
  app.get('/*', (req, res) => res.sendFile(
    path.join(__dirname, '../webclient/dist/index.html')));

  app.listen(8080, () => console.log('Twit server listening on port 8080.'));
}());
