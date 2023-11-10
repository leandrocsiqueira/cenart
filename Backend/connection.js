require('dotenv').config();

const MYSQL = require('mysql');

const CONNECTION = MYSQL.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

CONNECTION.connect((err) => {
  if (!err) {
    console.log('Database connected successfully!');
  } else {
    console.log(err);
  }
});

module.exports = CONNECTION;
