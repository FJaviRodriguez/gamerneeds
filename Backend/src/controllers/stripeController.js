import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as compraModel from '../models/compraModel.js';
import * as bibliotecaModel from '../models/bibliotecaModel.js';
import pool from '../config/db.js';
import { generarPDFComprobante } from '../services/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../..', '.env') });

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Environment variables not loaded properly');
    console.error('Current environment variables:', process.env);
    throw new Error('Missing Stripe secret key');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
                        metadata: {
                            idjuego: item.idjuego.toString()
                        }
                    },
                    unit_amount: Math.round(parseFloat(item.precio) * 100),
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`,
            metadata: {
                usuarioId: usuarioId.toString(),
                juegosIds: JSON.stringify(items.map(item => item.idjuego))
            },
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['ES']
            },
            locale: 'es'
        });

        console.log('Sesión creada:', {
            sessionId: session.id,
            metadata: session.metadata
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

        console.log('Webhook Event Type:', event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Session details:', {
                id: session.id,
                metadata: session.metadata,
                amount_total: session.amount_total,
                customer_details: session.customer_details
            });

            if (!session.metadata?.usuarioId || !session.metadata?.juegosIds) {
                console.error('Metadata incompleta:', {
                    usuarioId: session.metadata?.usuarioId,
                    juegosIds: session.metadata?.juegosIds
                });
                return res.status(400).json({ error: 'Metadata incompleta' });
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                // 1. Crear la compra
                const idcompra = await compraModel.crearCompra(
                    session.metadata.usuarioId, 
                    session.amount_total / 100
                );
                console.log('Compra creada:', idcompra);

                // 2. Parsear juegosIds
                const juegosIds = JSON.parse(session.metadata.juegosIds);
                console.log('Juegos a añadir:', juegosIds);

                // 3. Añadir juegos a la biblioteca
                await bibliotecaModel.aniadirJuegosABiblioteca(
                    session.metadata.usuarioId,
                    juegosIds
                );
                console.log('Juegos añadidos a biblioteca');

                // 4. Actualizar estado de la compra
                await compraModel.actualizarEstadoCompraPorId(idcompra, 'completed');
                console.log('Estado de compra actualizado');

                // 5. Obtener detalles completos de la sesión
                const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
                    session.id,
                    { expand: ['line_items'] }
                );

                // 6. Preparar datos para el PDF
                const datosCompra = {
                    sessionId: session.id,
                    items: sessionWithLineItems.line_items.data.map(item => ({
                        nombre: item.description || 'Producto',
                        precio: item.amount_total / 100
                    })),
                    total: session.amount_total / 100,
                    usuario: {
                        id: session.metadata.usuarioId,
                        nombre: session.customer_details?.name || 'Cliente',
                        email: session.customer_details?.email || 'No disponible'
                    },
                    fecha: new Date()
                };

                // 7. Generar PDF
                const pdfPath = await generarPDFComprobante(datosCompra);
                console.log('PDF generado en:', pdfPath);

                await connection.commit();
                return res.json({ received: true });

            } catch (error) {
                await connection.rollback();
                console.error('Error procesando webhook:', {
                    error: error.message,
                    stack: error.stack,
                    sessionId: session.id,
                    metadata: session.metadata
                });
                return res.status(500).json({
                    error: 'Error procesando la compra',
                    details: error.message
                });
            } finally {
                connection.release();
            }
        }

        return res.json({ received: true });
    } catch (error) {
        console.error('Error en webhook:', {
            error: error.message,
            stack: error.stack,
            headers: req.headers,
            body: typeof req.body === 'string' ? 'raw body' : 'parsed body'
        });
        return res.status(400).json({ error: `Webhook Error: ${error.message}` });
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
            success_url: `${process.env.FRONTEND_URL}/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};