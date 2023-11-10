const EXPRESS = require('express');
const CORS = require('cors');
const CONNECTION = require('./connection');
const APP = EXPRESS();
const APP_USER_ROUTE = require('./routes/appuser');

APP.use(CORS());
APP.use(EXPRESS.json());
APP.use('/appuser', APP_USER_ROUTE);

module.exports = APP;
