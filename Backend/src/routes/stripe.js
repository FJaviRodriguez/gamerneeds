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

// Actualizar la ruta de descarga
router.get('/descargar-comprobante/:sessionId', verificarToken, async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
        });

        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }

        const datosCompra = {
            sessionId: session.id,
            items: session.line_items.data.map(item => ({
                nombre: item.description || 
                        item.price?.product?.name || 
                        'Producto',
                precio: (item.amount_total / 100).toFixed(2)
            })),
            total: (session.amount_total / 100).toFixed(2),
            usuario: {
                nombre: session.customer_details?.name || 'Cliente',
                email: session.customer_details?.email || 'No disponible'
            },
            fecha: new Date()
        };

        const pdfBuffer = await generarPDFComprobante(datosCompra);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=comprobante-${sessionId}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error al generar comprobante:', error);
        res.status(500).json({ 
            error: 'Error al generar el comprobante',
            details: error.message 
        });
    }
});

export default router;