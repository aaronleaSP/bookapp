const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

const isDocker = fs.existsSync('/.dockerenv');

const connection = mysql.createConnection({
  host: isDocker ? '172.17.0.1' : 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'bookdb'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
