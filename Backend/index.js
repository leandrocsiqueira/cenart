const EXPRESS = require('express');
const CORS = require('cors');
const APP = EXPRESS();
const APP_USER_ROUTE = require('./routes/appuser');
const CATEGORY_ROUTE = require('./routes/category');
const ARTICLE_ROUTE = require('./routes/article');

APP.use(CORS());
APP.use(EXPRESS.json());

APP.use('/appuser', APP_USER_ROUTE);
APP.use('/category', CATEGORY_ROUTE);
APP.use('/article', ARTICLE_ROUTE);

module.exports = APP;
