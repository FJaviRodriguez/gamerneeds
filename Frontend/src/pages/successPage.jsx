import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/carritoContext';
import toast from 'react-hot-toast';
import Footer from '../components/common/footer';

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
      toast.error('Error al procesar la compra', {
        id: 'error-purchase'
      });
      navigate('/home');
    }
  }, [limpiarCarrito, navigate]);

  return (
    <div className="h-screen w-screen bg-[#272727] flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="mb-8">
            <svg className="mx-auto h-20 w-20 text-[#FF4C1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">¡Pago completado con éxito!</h2>
          <p className="text-gray-300 mb-8 text-lg">Gracias por tu compra. Serás redirigido a la página principal en unos segundos...</p>
          <button onClick={() => navigate('/home')} className="bg-[#FF4C1A] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#FF6B3D] transition-colors">Volver a la tienda</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;