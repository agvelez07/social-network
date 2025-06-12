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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // mete aqui a tua password, se tiveres
    database: 'mini_social_facebook',
    port: 3306
});

module.exports = pool;

