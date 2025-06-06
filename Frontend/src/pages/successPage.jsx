import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/carritoContext';
import toast from 'react-hot-toast';
import Footer from '../components/common/footer';
import logo from '../assets/logo.png';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { limpiarCarrito } = useCarrito();

  useEffect(() => {
    try {
      limpiarCarrito();
      toast.success('¡Compra realizada con éxito! 🎮', {
        duration: 4000,
        id: 'success-purchase'
      });
      const timer = setTimeout(() => {
        navigate('/home');
      }, 5000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error in SuccessPage:', error);
      toast.error('Error al procesar la compra');
      navigate('/home');
    }
  }, [limpiarCarrito, navigate]);

  return (
    <div className="min-h-screen bg-[#202020] flex flex-col w-screen overflow-hidden">
      {/* Header */}
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
                <div className="flex items-center opacity-50">
                  <span className="bg-zinc-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  <span className="ml-2 text-white text-sm">Pago</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FF4C1A] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="mb-8">
            <svg className="mx-auto h-20 w-20 text-[#FF4C1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">¡Pago completado con éxito!</h2>
          <p className="text-gray-300 mb-8 text-lg">Gracias por tu compra. Serás redirigido a la página principal en unos segundos...</p>
          <button 
            onClick={() => navigate('/home')} 
            className="bg-[#FF4C1A] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#FF6B3D] transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;