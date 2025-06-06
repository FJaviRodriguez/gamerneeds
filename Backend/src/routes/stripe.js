import express from 'express';
import * as stripeController from '../controllers/stripeController.js';
import { verificarToken } from './middleware.js';

const router = express.Router();

// Webhook debe estar primero y usar raw body
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    stripeController.webhookHandler
);

// Después del webhook, usar JSON middleware
router.use(express.json());

// Rutas existentes
router.post('/crear-sesion-pago', verificarToken, stripeController.crearSesionPago);
router.post('/create-line-item', stripeController.createLineItem);
router.get('/verificar/:sessionId', stripeController.verificarPago);

export default router;