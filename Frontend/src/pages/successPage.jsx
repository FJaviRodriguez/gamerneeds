import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/carritoContext';
import toast from 'react-hot-toast';
import Footer from '../components/common/footer';
import logo from '../assets/logo.png';

const SuccessPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { limpiarCarrito } = useCarrito();
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stripe/verificar/${sessionId}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Error verificando sesión');
        }
        
        const data = await response.json();
        
        if (data.status === 'complete' || data.status === 'paid') {
            setVerificado(true);
            limpiarCarrito();
            // Descarga automática
            handleDescargarComprobante();
            toast.success('¡Compra realizada con éxito! 🎮', {
                duration: 4000,
                id: 'success-purchase'
            });
        } else {
            navigate('/carrito');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/carrito');
      }
    };

    if (sessionId) {
      verificarSesion();
    } else {
      navigate('/carrito');
    }
}, [sessionId, navigate, limpiarCarrito]);

const handleDescargarComprobante = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No se encontró el token de autenticación');
            return;
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/descargar-comprobante/${sessionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al descargar el comprobante');
        }

        // Verificar que el tipo de contenido es PDF
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error('El archivo descargado no es un PDF válido');
        }

        // Obtener el blob del PDF
        const blob = await response.blob();
        if (blob.size === 0) {
            throw new Error('El archivo PDF está vacío');
        }
        
        // Crear URL del blob y forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante-${sessionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Limpieza
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

        toast.success('Comprobante descargado correctamente');
    } catch (error) {
        console.error('Error:', error);
        toast.error(error.message || 'Error al descargar el comprobante');
    }
};

  if (!verificado) {
    return null;
  }

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
          <p className="text-gray-300 mb-8 text-lg">¡Gracias por tu compra!</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/home')} 
              className="bg-[#FF4C1A] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#FF6B3D] transition-colors"
            >
              Volver a la tienda
            </button>
            <button 
              onClick={handleDescargarComprobante}
              className="bg-zinc-700 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-zinc-600 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Descargar Comprobante
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;