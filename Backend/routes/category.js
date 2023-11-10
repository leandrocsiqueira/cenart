const EXPRESS = require('express');
const CONNECTION = require('../connection');
const ROUTER = EXPRESS.Router();
const AUTH = require('../services/authentication');

ROUTER.post('/add', AUTH.authenticateToken, (req, res, next) => {
  const CATEGORY = req.body;
  const QUERY = 'INSERT INTO category (name) VALUES(?)';
  CONNECTION.query(QUERY, [CATEGORY.name], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: 'Category Added Successfully' });
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.get('/categories', AUTH.authenticateToken, (req, res, next) => {
  const QUERY = 'SELECT * FROM category ORDER BY name';
  CONNECTION.query(QUERY, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.post('/update', AUTH.authenticateToken, (req, res, next) => {
  const CATEGORY = req.body;
  const QUERY = 'UPDATE category SET name = ? WHERE id = ?';
  CONNECTION.query(QUERY, [CATEGORY.name, CATEGORY.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: 'Category ID does not found' });
      }
      return res.status(200).json({ message: 'Category Updated Successfully' });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = ROUTER;
