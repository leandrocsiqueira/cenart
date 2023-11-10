require('dotenv').config();

const JWT = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const AUTH_HEADER = req.headers['authorization'];
  const TOKEN = AUTH_HEADER && AUTH_HEADER.split(' ')[1];

  if (TOKEN == null) return res.sendStatus(401);

  JWT.verify(TOKEN, process.env.ACCESS_TOKEN, (err, response) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.locals = response;

    next();
  });
}

module.exports = { authenticateToken: authenticateToken };
