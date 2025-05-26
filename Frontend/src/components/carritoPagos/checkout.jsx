import { useCarrito } from '../../context/carritoContext';
import { useStripe, useElements, Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { crearSesionPago } from '../../services/pagoService';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { carrito, total, limpiarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Error al cargar Stripe');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { sessionId } = await crearSesionPago(carrito);
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message || 'Error al procesar el pago');
      toast.error(error.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-black py-4 w-full border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/home" className="flex items-center">
                <img src={logo} alt="Logo" className="h-12 w-12" />
                <span className="text-white text-xl font-medium ml-2">GAMERS NEEDS</span>
              </Link>
              <div className="flex items-center ml-16 space-x-8">
                <div className="flex items-center opacity-50">
                  <span className="bg-zinc-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  <span className="ml-2 text-white text-sm">Cesta</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FF4C1A] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
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
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Pasarela de pago</h1>
            <div className="flex gap-8">
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-[#1E1E1E] p-6 rounded-lg">
                    <h2 className="text-white text-lg font-medium mb-4">Dirección de Facturación</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Nombre y apellidos" value={formData.nombre} onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))} className="w-full p-3 bg-[#2A2A2A] border border-zinc-700 rounded text-white" required/>
                      <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))} className="w-full p-3 bg-[#2A2A2A] border border-zinc-700 rounded text-white" required/>
                    </div>
                  </div>
                  <div className="bg-[#1E1E1E] p-6 rounded-lg">
                    <h2 className="text-white text-lg font-medium mb-4">Datos de la tarjeta</h2>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#ffffff',
                            '::placeholder': {
                              color: '#aab7c4'
                            }
                          },
                          invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a'
                          }
                        }
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="w-80">
                <div className="bg-[#1E1E1E] p-6 rounded-lg sticky top-8">
                  <h2 className="text-white text-lg font-medium mb-4">Resumen</h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Total</span>
                    <span className="text-white text-xl font-medium">{total.toFixed(2)}€</span>
                  </div>
                  <button type="submit" disabled={loading} style={{ backgroundColor: '#FF4C1A' }} className="w-full text-white py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Procesando...' : 'Pagar'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}