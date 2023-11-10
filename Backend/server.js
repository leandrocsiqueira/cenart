require('dotenv').config();

const HTTP = require('http');
const APP = require('./index');
const SERVER = HTTP.createServer(APP);

SERVER.listen(process.env.PORT);
