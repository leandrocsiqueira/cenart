const EXPRESS = require('express');
const CONNECTION = require('../connection');
const ROUTER = EXPRESS.Router();
const JWT = require('jsonwebtoken');

require('dotenv').config();
var auth = require('../services/authentication');

ROUTER.post('/add', auth.authenticateToken, (req, res) => {
  const USER = req.body;
  let query = `
    SELECT 
      email, password, status 
    FROM appuser 
    WHERE email=?
  `;

  CONNECTION.query(query, [USER.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query = `
          INSERT INTO appuser
            (name, email, password, status, isDeletable) 
          VALUES(?, ?, ?, 'false', 'true')
        `;

        CONNECTION.query(
          query,
          [USER.name, USER.email, USER.password],
          (err, _results) => {
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

ROUTER.post('/login', (req, res) => {
  const USER = req.body;
  query = `
    SELECT 
      email, password, status, isDeletable 
    FROM appuser 
    WHERE email = ?
  `;

  CONNECTION.query(query, [USER.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != USER.password) {
        return res.status(401).json({
          message: 'Incorrect Email or Password',
        });
      } else if (results[0].status == 'false') {
        return res.status(401).json({ message: 'Wait for Admin Approval' });
      } else if (results[0].password == USER.password) {
        const RESPONSE = {
          email: results[0].email,
          isDeletable: results[0].isDeletable,
        };
        const ACCESS_TOKEN = JWT.sign(RESPONSE, process.env.ACCESS_TOKEN, {
          expiresIn: '8h',
        });
        res.status(200).json({ token: ACCESS_TOKEN });
      } else {
        return res
          .status(400)
          .json({ message: 'Something went wrong. Please try again later' });
      }
    } else return res.status(500).json(err);
  });
});

ROUTER.get('/users', auth.authenticateToken, (_req, res) => {
  const TOKEN_PAYLOAD = res.locals;
  let query = '';

  if (TOKEN_PAYLOAD.isDeletable === 'false') {
    query = `
      SELECT 
        id, name, email, status 
      FROM appuser 
      WHERE isDeletable = 'true'
    `;
  } else {
    query = `
      SELECT 
        id, name, email, status 
      FROM appuser 
      WHERE isDeletable = 'true' AND email !=?
    `;
  }

  CONNECTION.query(query, [TOKEN_PAYLOAD.email], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.post('/updateStatus', auth.authenticateToken, (req, res) => {
  const USER = req.body;
  const QUERY = `
    UPDATE appuser 
    SET status = ? 
    WHERE id = ? AND isDeletable = 'true'
  `;

  CONNECTION.query(QUERY, [USER.status, USER.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: 'User ID does not exist' });
      }
      return res.status(200).json({ message: 'User Updated Successfully' });
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.post('/updateUser', auth.authenticateToken, (req, res) => {
  const USER = req.body;
  const QUERY = `
    UPDATE 
      appuser 
    SET name = ?, email = ? 
    WHERE id = ?
  `;

  CONNECTION.query(QUERY, [USER.name, USER.email, USER.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: 'User ID does not exist' });
      }
      return res.status(200).json({ message: 'User Updated Successfully' });
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.get('/checkToken', auth.authenticateToken, (_req, res) => {
  return res.status(200).json({ message: 'true' });
});

module.exports = ROUTER;
