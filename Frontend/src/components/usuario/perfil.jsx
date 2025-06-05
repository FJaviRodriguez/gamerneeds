import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { mostrarBiblioteca } from '../../services/bibliotecaService';
import Header from '../common/header';
import Footer from '../common/footer';
import { Link } from 'react-router-dom';

const PerfilPage = () => {
  const { usuario } = useAuth();
  const [biblioteca, setBiblioteca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        setLoading(true);
        const juegos = await mostrarBiblioteca();
        setBiblioteca(juegos);
      } catch (err) {
        setError('Error al cargar la biblioteca');
      } finally {
        setLoading(false);
      }
    };
    if (usuario?.id) {
      cargarBiblioteca();
    }
  }, [usuario]);
  const getAvatarUrl = () => {
    if (!usuario?.avatar) {
      return '/icons/default-icon.png';
    }
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    if (usuario.avatar.startsWith('http')) {
      return usuario.avatar;
    }
    if (usuario.avatar.startsWith('/public')) {
      return `${baseUrl}${usuario.avatar}`;
    }
    return `${baseUrl}/public/avatars/${usuario.avatar}`;
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative w-32 h-32">
              <img src={getAvatarUrl()} alt="Avatar" className="w-full h-full rounded-full border-4 border-[#FF4C1A] object-cover" 
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/icons/default-icon.png';
                }}/>
            </div>
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-white">{usuario?.nombre}</h1>
              <p className="text-gray-400">{usuario?.email}</p>
              {usuario?.rol === 'admin' && (
                <Link 
                  to="/panel-admin"
                  className="inline-block bg-[#FF4C1A] text-white px-6 py-2 rounded-md hover:bg-[#FF6B3D] transition-colors font-medium no-underline"
                >
                  Panel de Control
                </Link>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Mi Biblioteca</h2>
            {loading ? (
              <div className="text-white text-center">Cargando...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : biblioteca.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {biblioteca.map((juego) => (
                  <div key={juego.idjuego} className="bg-black/20 rounded-lg overflow-hidden">
                    <img src={juego.url_portada} alt={juego.titulo} className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/icons/default-game.png';
                      }}/>
                    <div className="p-4">
                      <h3 className="text-white font-medium">{juego.titulo}</h3>
                      <p className="text-gray-400 text-sm mt-1">{juego.precio}€</p>
                      <p className="text-gray-400 text-sm">Adquirido: {new Date(juego.fecha_adquisicion).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No tienes juegos en tu biblioteca</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PerfilPage;