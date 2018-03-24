const path = require('path');
const express = require('express');
const { connectToDatabase } = require('./database/connect-to-database');
const loginRouter = require('./api/login');

const app = express();

(async function startServer() {
  await connectToDatabase().catch(err => console.log(`Database error occurred: ${err}`));

  app.use('/api/login', loginRouter);

  /* Host static files */
  app.use(express.static(path.join(__dirname, '../webclient/dist')));

  // If all else fails, send GET requests to index.html
  app.get('/*', (req, res) => res.sendFile(
    path.join(__dirname, '../webclient/dist/index.html')));

  app.listen(8080, () => console.log('Twit server listening on port 8080.'));
}());
