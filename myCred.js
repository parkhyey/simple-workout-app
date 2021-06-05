var mysql = require('mysql');  // requiring mysql module; npm install mysql --save
var pool = mysql.createPool({  // create connection pool
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu', // server address
  user: 'cs290_parkhyey',
  password: 'java4844',
  database: 'cs290_parkhyey'
});

module.exports.pool = pool;