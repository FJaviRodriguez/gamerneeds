import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as compraModel from '../models/compraModel.js';
import * as bibliotecaModel from '../models/bibliotecaModel.js';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../..', '.env') });

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Environment variables not loaded properly');
    console.error('Current environment variables:', process.env);
    throw new Error('Missing Stripe secret key');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});
export const crearSesionPago = async (req, res) => {
    try {
        const { items, usuarioId } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items inválidos' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.nombre,
                        images: [item.url_portada.startsWith('http') 
                            ? item.url_portada 
                            : `${process.env.BACKEND_URL}/public/juegos/${item.url_portada}`],
                    },
                    unit_amount: (item.precio * 100),
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`,
            metadata: {
                usuarioId: usuarioId.toString(),
                juegosIds: JSON.stringify(items.map(item => item.idjuego))
            },
            billing_address_collection: 'required',
            locale: 'es',
            payment_intent_data: {
                description: 'Compra en GAMERS NEEDS'
            }
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({ error: error.message });
    }
};
export const verificarPago = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({ status: session.payment_status });
    } catch (error) {
        console.error('Error al verificar pago:', error);
        res.status(500).json({ error: 'Error al verificar el pago' });
    }
};
export const webhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log('Webhook event received:', event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { metadata } = session;

            if (metadata && metadata.usuarioId && metadata.juegosIds) {
                const usuarioId = metadata.usuarioId;
                const juegosIds = JSON.parse(metadata.juegosIds);

                console.log('Procesando compra:', {
                    usuarioId,
                    juegosIds,
                    sessionId: session.id
                });

                try {
                    // Usar el modelo para añadir juegos a la biblioteca
                    await bibliotecaModel.aniadirJuegosABiblioteca(usuarioId, juegosIds);
                    
                    // Crear registro de compra usando el modelo
                    await compraModel.crearCompra(usuarioId, session.amount_total / 100);

                    console.log('Compra procesada exitosamente');
                } catch (error) {
                    console.error('Error procesando la compra:', error);
                    throw error;
                }
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({
            error: `Webhook Error: ${error.message}`
        });
    }
};
export const addToCart = async (req, res) => {
    try {
        const { item, sessionId } = req.body;
        let session;
        if (sessionId) {
            session = await stripe.checkout.sessions.retrieve(sessionId);
            session = await stripe.checkout.sessions.update(sessionId, {
                line_items: [...session.line_items, item]
            });
        } else {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [item],
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/carrito`,
            });
        }
        res.json({ session });
    } catch (error) {
        console.error('Error en addToCart:', error);
        res.status(500).json({ error: error.message });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const { sessionId, idjuego } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: 'No session ID provided' });
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const updatedItems = session.line_items.filter(
            item => item.price_data.product_data.metadata.idjuego !== idjuego
        );
        await stripe.checkout.sessions.update(sessionId, {
            line_items: updatedItems
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error en removeFromCart:', error);
        res.status(500).json({ error: error.message });
    }
};
export const createLineItem = async (req, res) => {
    try {
        const { title, price, image, idjuego } = req.body;

        // Validar inputs
        if (!title || !price || !image) {
            return res.status(400).json({ 
                error: 'Faltan campos requeridos' 
            });
        }

        // Crear el producto en Stripe
        const product = await stripe.products.create({
            name: title,
            images: [image],
            metadata: {
                idjuego: idjuego.toString()
            }
        });

        // Crear el precio para el producto
        const priceObj = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(price), // Convertir a centavos
            currency: 'eur'
        });

        // Devolver los IDs necesarios
        res.json({
            id: priceObj.id,
            product_id: product.id
        });
    } catch (error) {
        console.error('Error al crear line item:', error);
        res.status(500).json({ 
            error: 'Error al crear el producto en Stripe',
            details: error.message 
        });
    }
};
export const removeLineItem = async (req, res) => {
    try {
        const { price_id } = req.body;
        const price = await stripe.prices.retrieve(price_id);
        await stripe.prices.update(price_id, { active: false });
        await stripe.products.update(price.product, { active: false });
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing line item:', error);
        res.status(500).json({ error: error.message });
    }
};
export const createCheckoutSession = async (req, res) => {
    try {
        const { items } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price: item.stripe_line_item_id,
                quantity: 1
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};