const EXPRESS = require('express');
const CONNECTION = require('../connection');
const ROUTER = EXPRESS.Router();

ROUTER.post('/add', (req, res) => {
  const USER = req.body;
  let query = 'SELECT email, password, status FROM appuser WHERE email=?';
  CONNECTION.query(query, [USER.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "INSERT INTO appuser(name, email, password, status, isDeletable) VALUES(?, ?, ?, 'false', 'true')";
        CONNECTION.query(
          query,
          [USER.name, USER.email, USER.password],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: 'Successfully Registered' });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: 'O endereço de e-mail já existe' });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = ROUTER;
