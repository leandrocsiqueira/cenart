require('dotenv').config();

const http = require('http');
const app = require('./index');
const servidor = http.createServer(app);

servidor.listen(process.env.PORTA_SERVIDOR);
