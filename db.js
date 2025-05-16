// db.js
/*const mysql = require('mysql2');

const pool = mysql.createPool({
    host           : 'localhost',
    user           : 'root',
    password       : 'root',
    database       : 'mini_social_facebook',
    connectionLimit: 10
});

module.exports = pool;
*/
// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // mete aqui a tua password, se tiveres
    database: 'social_network',
    port: 3306
});

module.exports = pool;

