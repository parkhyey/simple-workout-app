var mysql = require('mysql');  // requiring mysql module; npm install mysql --save
var pool = mysql.createPool({  // create connection pool
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu', // server address
  user: 'xxxxxx',
  password: 'xxxxxx',
  database: 'xxxxxx'
});

module.exports.pool = pool;
