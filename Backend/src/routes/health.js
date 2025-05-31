import express from 'express';
import { conexionbdd } from '../config/db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
    try {
        const dbConnected = await conexionbdd();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        res.status(200).json({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            message: 'Backend service is running'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ 
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

export default router;