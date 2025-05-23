import express from 'express';
import * as stripeController from '../controllers/stripeController.js';
import stripe from '../config/stripe.js';

const router = express.Router();

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
        console.log('🎮 Webhook route hit');
        next();
    },
    stripeController.webhookHandler
);
router.use(express.json());

router.post('/crear-sesion-pago', stripeController.crearSesionPago);
router.get('/verificar/:sessionId', stripeController.verificarPago);
router.post('/add-to-cart', stripeController.addToCart);
router.post('/remove-from-cart', stripeController.removeFromCart);
router.post('/create-line-item', stripeController.createLineItem);
router.post('/remove-line-item', stripeController.removeLineItem);

router.get('/test', async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({ limit: 1 });
        res.json({ success: true, message: 'Stripe connection successful' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Stripe connection failed',
            error: error.message 
        });
    }
});

router.post('/checkout', async (req, res) => {
    try {
        const { items } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.nombre,
                        images: [item.imagen],
                    },
                    unit_amount: Math.round(item.precio * 100),
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`,
            custom_text: {
                submit: {
                    message: 'Gamerneeds procesará tu pago de forma segura'
                }
            },
            appearance: {
                theme: 'night',
                variables: {
                    colorPrimary: '#FF4C1A',
                    colorBackground: '#272727',
                    colorText: '#FFFFFF',
                    colorTextSecondary: '#9CA3AF',
                    colorTextPlaceholder: '#6B7280',
                    colorIconTab: '#FF4C1A',
                    borderRadius: '4px',
                    spacingGridRow: '16px',
                },
                rules: {
                    '.Button': {
                        backgroundColor: '#FF4C1A',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#FF6B3D'
                        }
                    },
                    '.Input': {
                        backgroundColor: '#181818',
                        color: 'white',
                        borderColor: '#3F3F3F'
                    },
                    '.Label': {
                        color: '#FFFFFF'
                    },
                    '.Tab': {
                        backgroundColor: '#181818',
                        '&:hover': {
                            backgroundColor: '#272727'
                        }
                    }
                }
            }
        });
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
});

export default router;