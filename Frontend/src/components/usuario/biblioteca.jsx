import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mostrarBiblioteca } from '../../services/bibliotecaService';
import toast from 'react-hot-toast';

const Biblioteca = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarBiblioteca = async () => {
      try {
        const data = await mostrarBiblioteca();
        setJuegos(data);
      } catch (error) {
        if (error.redirectTo) {
          navigate(error.redirectTo);
        }
        toast.error('Error al cargar tu biblioteca');
      } finally {
        setLoading(false);
      }
    };
    cargarBiblioteca();
  }, [navigate]);
  if (loading) {
    return <div className="text-white text-center">Cargando biblioteca...</div>;
  }
  return (
    <div className="bg-black/30 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Mi Biblioteca</h2>
      {juegos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {juegos.map((juego) => (
            <Link to={`/juego/${juego.idjuego}`}  key={juego.idjuego} className="bg-[#181818] rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <img src={juego.url_portada} alt={juego.titulo} className="w-full h-32 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/icons/default-game.png';
                }}/>
              <div className="p-4">
                <h3 className="text-white font-medium truncate">{juego.titulo}</h3>
                <p className="text-gray-400 text-sm mt-1">{juego.precio}€</p>
                <p className="text-gray-400 text-sm">Adquirido el: {new Date(juego.fecha_adquisicion).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No tienes juegos en tu biblioteca</p>
      )}
    </div>
  );
};

export default Biblioteca;