const path = require('path');
const express = require('express');
const { connectToDatabase } = require('./database/connect-to-database');
const loginRouter = require('./api/login');

const app = express();

(async function startServer() {
  await connectToDatabase().catch(err => console.log(`Database error occurred: ${err}`));

  /* Host static files */
  app.use(express.static(path.join(__dirname, '../webclient/dist')));

  app.use('/api/login', loginRouter);

  app.listen(8080, () => console.log('Twit server listening on port 8080.'));
}());
