import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Env vars:', {
    DB_USER: process.env.DB_USER || '(empty)',
    DB_PASSWORD: process.env.DB_PASSWORD ? '(hidden)' : '(empty)',
    DB_HOST: process.env.DB_HOST || '(empty)',
    DB_NAME: process.env.DB_NAME || '(empty)',
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT, 10) || 10,
    queueLimit: 0,
});

export default pool;
