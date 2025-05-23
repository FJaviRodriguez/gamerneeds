import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './usuario.js';
import juegoRoutes from './juegos.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/juegos', juegoRoutes);
router.use('/user', userRoutes);

export default router;
