import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'gamerneeds',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const conexionbdd = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

export default pool;
