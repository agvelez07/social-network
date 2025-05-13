// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host           : 'localhost',
    user           : 'root',
    password       : 'root',
    database       : 'mini_social_facebook',
    connectionLimit: 10
});

module.exports = pool;

