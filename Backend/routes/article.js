const EXPRESS = require('express');
const CONNECTION = require('../connection');
const ROUTER = EXPRESS.Router();
const AUTH = require('../services/authentication');

ROUTER.post('/add', AUTH.authenticateToken, (req, res) => {
  const ARTICLE = req.body;

  const QUERY = `
    INSERT INTO article 
        (title, content, publication_date, categoryId, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  CONNECTION.query(
    QUERY,
    [
      ARTICLE.title,
      ARTICLE.content,
      new Date(),
      ARTICLE.categoryId,
      ARTICLE.status,
    ],
    (err) => {
      if (!err) {
        return res.status(200).json({ message: 'Article Added Successfully' });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

ROUTER.get('/all', AUTH.authenticateToken, (_req, res, _next) => {
  const QUERY = `
    SELECT 
        a.id, a.title, a.content, a.status, a.publication_date,
        c.id as categoryId, c.name as categoryName 
    FROM article AS a
    INNER JOIN category AS c
    WHERE a.categoryId = c.id
  `;

  CONNECTION.query(QUERY, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.get('/published', AUTH.authenticateToken, (_req, res, _next) => {
  const QUERY = `
    SELECT 
        a.id, a.title, a.content, a.status, a.publication_date,
        c.id as categoryId, c.name as categoryName 
    FROM article AS a
    INNER JOIN category AS c
    WHERE a.categoryId = c.id
    AND a.status = 'published'
  `;

  CONNECTION.query(QUERY, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

ROUTER.post('/update', AUTH.authenticateToken, (req, res, _next) => {
  const ARTICLE = req.body;
  const QUERY = `
    UPDATE article 
    SET title = ?, content = ?, categoryId = ?, publication_date = ?, status = ?
    WHERE id = ?
  `;

  CONNECTION.query(
    QUERY,
    [
      ARTICLE.title,
      ARTICLE.content,
      ARTICLE.categoryId,
      new Date(),
      ARTICLE.status,
      ARTICLE.id,
    ],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: 'Article ID does not found' });
        }
        return res
          .status(200)
          .json({ message: 'Article Updated Successfully' });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

ROUTER.get('/delete/:id', AUTH.authenticateToken, (req, res, _next) => {
  const ID = req.params.id;
  const QUERY = `
    DELETE FROM article
    WHERE id = ?
  `;

  CONNECTION.query(QUERY, [ID], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: 'Article ID does not found' });
      }
      return res.status(200).json({ message: 'Article Deleted Successfully' });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = ROUTER;
