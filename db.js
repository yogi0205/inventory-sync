const mysql = require('mysql2/promise');

// Create a pool instead of a single connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql1731',
    database: 'InventoryDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('DB Pool created successfully');

module.exports = pool;
