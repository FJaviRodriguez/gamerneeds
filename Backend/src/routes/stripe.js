import express from 'express';
import * as stripeController from '../controllers/stripeController.js';
import { verificarToken } from './middleware.js';
import path from 'path';
import fs from 'fs';

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

// Añade esta ruta para descargar el PDF
router.get('/descargar-comprobante/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const pdfPath = path.join(__dirname, '../../public/pdfs', `comprobante-${sessionId}.pdf`);
        
        if (fs.existsSync(pdfPath)) {
            res.download(pdfPath);
        } else {
            res.status(404).json({ error: 'Comprobante no encontrado' });
        }
    } catch (error) {
        console.error('Error al descargar comprobante:', error);
        res.status(500).json({ error: 'Error al descargar el comprobante' });
    }
});

export default router;