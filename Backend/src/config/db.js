import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: process.env.NODE_ENV === 'development',
    connectTimeout: 20000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

export const conexionbdd = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        
        // Test query to verify connection and tables
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ?
        `, [process.env.DB_DATABASE]);
        
        console.log('Available tables:', tables.map(t => t.TABLE_NAME));
        
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', {
            message: error.message,
            code: error.code,
            errno: error.errno
        });
        return false;
    }
};

export default pool;
