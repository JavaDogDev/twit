const path = require('path');
const express = require('express');

const app = express();

/* Host static files */
app.use(express.static(path.join(__dirname, '../webclient/dist')));

app.listen(8080, () => console.log('Twit server listening on port 8080.'));
