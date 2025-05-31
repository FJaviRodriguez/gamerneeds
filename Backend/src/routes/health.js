import express from 'express';
import { conexionbdd } from '../config/db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
    try {
        const dbConnected = await conexionbdd();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        res.json({ status: 'healthy', database: 'connected' });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            error: error.message 
        });
    }
});

export default router;