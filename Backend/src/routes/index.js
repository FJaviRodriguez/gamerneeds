import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './usuario.js';
import juegoRoutes from './juegos.js';
import adminRoutes from './admin.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/juegos', juegoRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
