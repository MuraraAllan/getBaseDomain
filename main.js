const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const router = require('./routes');

router(server);

server.listen(8000, () => console.log('Listening on 8000'));

