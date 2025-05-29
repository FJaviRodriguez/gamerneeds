import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/carritoContext';
import { useAuth } from '../../context/authContext';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import logo from '../../assets/logo.png';
import Footer from '../common/footer';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Carrito = () => {
    const { carrito, eliminarDelCarrito, procesarPago, total } = useCarrito();
    const { usuario } = useAuth();
    const [stripe, setStripe] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initStripe = async () => {
            const stripeInstance = await stripePromise;
            setStripe(stripeInstance);
        };
        initStripe();
    }, []);
    const handleProcesarPago = async () => {
        if (!usuario) {
            toast.error('Debes iniciar sesión para continuar');
            return;
        }
        if (carrito.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        try {
            setLoading(true);
            await procesarPago();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al procesar el pago';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handleEliminar = async (idjuego) => {
        try {
            await eliminarDelCarrito(Number(idjuego));
        } catch (error) {
            toast.error('Error al eliminar el producto');
        }
    };
    const getImageUrl = (url) => {
        if (!url) return '/icons/default-game.png';
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_BACKEND_URL}/public/juegos/${url}`;
    };
    return (
        <div className="min-h-screen bg-[#202020] flex flex-col w-screen overflow-hidden">
            <div className="bg-black py-4 w-full border-b border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/home" className="flex items-center">
                                <img src={logo} alt="Logo" className="h-12 w-12" />
                                <span className="text-white text-xl font-medium ml-2">GAMERS NEEDS</span>
                            </Link>
                            <div className="flex items-center ml-16 space-x-8">
                                <div className="flex items-center">
                                    <span className="bg-[#FF4C1A] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                                    <span className="ml-2 text-white text-sm">Cesta</span>
                                </div>
                                <div className="flex items-center opacity-50">
                                    <span className="bg-zinc-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                                    <span className="ml-2 text-white text-sm">Pago</span>
                                </div>
                                <div className="flex items-center opacity-50">
                                    <span className="bg-zinc-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                                    <span className="ml-2 text-white text-sm">Activación del juego</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-white text-sm">Pago seguro</span>
                            <span className="ml-2 text-zinc-400 text-sm">256-bit SSL Secured</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto py-8">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <h2 className="text-white text-xl mb-6">Cesta</h2>
                            {carrito && carrito.length > 0 ? (
                                <div className="space-y-4">
                                    {carrito.map((item) => (
                                        <div key={item.idjuego} className="bg-[#181818] rounded p-4 flex items-center">
                                            <img  src={item.url_portada || '/icons/default-game.png'} alt={item.nombre} className="w-24 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/icons/default-game.png';
                                                }}/>
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-white text-sm">{item.nombre}</h3>
                                                <p className="text-zinc-400 text-sm">Steam</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">{item.precio}€</p>
                                                <button onClick={() => handleEliminar(item.idjuego)}style={{ backgroundColor: '#FF4C1A' }} className="px-4 py-1 rounded text-white text-sm hover:bg-[#FF6B3D] transition-colors !bg-[#FF4C1A]" disabled={loading}>Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#181818] rounded p-4 text-center">
                                    <p className="text-zinc-400">No hay productos en el carrito</p>
                                    <Link to="/home" className="text-[#FF4C1A] hover:underline mt-4 inline-block">Volver a la tienda</Link>
                                </div>
                            )}
                        </div>
                        <div className="w-80">
                            <div className="bg-[#181818] rounded p-6">
                                <h2 className="text-white text-xl mb-4">Resumen</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Total</span>
                                        <span className="text-white text-xl font-medium">{total.toFixed(2)}€</span>
                                    </div>
                                </div>
                                <button onClick={handleProcesarPago} disabled={loading || !carrito || carrito.length === 0} style={{ backgroundColor: '#FF4C1A' }} className="w-full text-white py-3 rounded mt-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF6B3D] transition-colors">{loading ? 'Procesando...' : !carrito || carrito.length === 0 ? 'Carrito vacío' : 'Proceder al pago'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Carrito;