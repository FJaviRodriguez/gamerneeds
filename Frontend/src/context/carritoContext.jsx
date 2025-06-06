import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { crearSesionPago } from '../services/pagoService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        try {
            const savedCart = sessionStorage.getItem('carrito');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { usuario } = useAuth();
    useEffect(() => {
        if (carrito.length > 0) {
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
        } else {
            sessionStorage.removeItem('carrito');
        }
    }, [carrito]);

    const agregarAlCarrito = useCallback(async (item) => {
        try {
            setLoading(true);
            if (carrito.some(i => i.idjuego === item.idjuego)) {
                toast.error('Este juego ya está en el carrito');
                return;
            }
            const tempItem = {
                ...item,
                url_portada: item.url_portada || item.imagen
            };
            setCarrito(prev => [...prev, tempItem]);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/create-line-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: item.nombre,
                    price: item.precio,
                    image: item.url_portada,
                    idjuego: item.idjuego
                })
            });
            if (!response.ok) {
                setCarrito(prev => prev.filter(i => i.idjuego !== item.idjuego));
                throw new Error('Error al añadir al carrito');
            }
            const data = await response.json();
            setCarrito(prev => 
                prev.map(i => i.idjuego === item.idjuego 
                    ? { ...i, stripe_price_id: data.id, stripe_product_id: data.product_id }
                    : i
                )
            );
            toast.success('Juego añadido al carrito');
        } catch (error) {
            toast.error('Error al añadir al carrito');
            setCarrito(prev => prev.filter(i => i.idjuego !== item.idjuego)); // Corregido: faltaban paréntesis
        } finally {
            setLoading(false);
        }
    }, [carrito]);
    const eliminarDelCarrito = useCallback(async (idjuego) => {
        try {
            setLoading(true);
            setCarrito(prevCarrito => {
                const updatedCarrito = prevCarrito.filter(i => i.idjuego !== idjuego);
                return updatedCarrito;
            });
            toast.success('Producto eliminado del carrito');
        } catch (error) {
            toast.error('Error al eliminar del carrito');
        } finally {
            setLoading(false);
        }
    }, []);

    const procesarPago = useCallback(async () => {
        try {
            setLoading(true);
            if (!usuario || !usuario.id) {
                toast.error('Debes iniciar sesión para realizar la compra');
                navigate('/login');
                return;
            }

            const items = carrito.map(item => ({
                nombre: item.nombre,
                precio: item.precio,
                url_portada: item.url_portada,
                idjuego: item.idjuego
            }));

            const { sessionId } = await crearSesionPago(items, usuario.id);
            const stripe = await stripePromise;
            
            if (!stripe) {
                throw new Error('Error al cargar Stripe');
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId
            });

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error al procesar pago:', error);
            toast.error(error.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    }, [carrito, usuario, navigate]);
    const limpiarCarrito = useCallback(() => {
        try {
            setCarrito([]);
            sessionStorage.removeItem('carrito');
        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
        }
    }, []);
    return (
        <CarritoContext.Provider value={{
            carrito,
            loading,
            agregarAlCarrito,
            eliminarDelCarrito,
            procesarPago,
            limpiarCarrito,
            total: carrito.reduce((sum, item) => sum + Number(item.precio), 0),
            itemCount: carrito.length
        }}>
            {children}
        </CarritoContext.Provider>
    );
};
export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
    }
    return context;
};