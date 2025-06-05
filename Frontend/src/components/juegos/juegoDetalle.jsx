import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';
import { mostrarJuegoPorId } from '../../services/juegoService';
import { useCarrito } from '../../context/carritoContext';
import { toast } from 'react-hot-toast';

const JuegoDetalle = () => {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const cargarJuego = async () => {
      try {
        const data = await mostrarJuegoPorId(id);
        setJuego(data);
      } catch (err) {
        setError('Error al cargar el juego');
      } finally {
        setLoading(false);
      }
    };
    cargarJuego();
  }, [id]);
  const handleAddToCart = () => {
    if (!juego) return;
    setIsAdding(true);
    try {
        const itemCarrito = {
            idjuego: juego.idjuego,
            nombre: juego.titulo,
            precio: Number(juego.precio),
            url_portada: juego.url_portada,
        };
        agregarAlCarrito(itemCarrito);
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        toast.error('Error al añadir al carrito');
    } finally {
        setIsAdding(false);
    }
};
  const LoadingOrError = ({ message, isError }) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-[#272727] flex items-center justify-center">
        <p className={`text-xl ${isError ? 'text-red-500' : 'text-white'}`}>{message}</p>
      </div>
      <Footer />
    </div>
  );
  if (loading) {
    return <LoadingOrError message="Cargando..." isError={false} />;
  }
  if (error || !juego) {
    return <LoadingOrError message={error || 'No se encontró el juego'} isError={true} />;
  }
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-zinc-800/50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div className="relative h-96 w-full">
                <img 
                  src={juego.url_portada} 
                  alt={juego.titulo} 
                  className="w-full h-full object-contain bg-black/20 rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/icons/default-game.png';
                  }}
                  loading="lazy"
                />
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-white text-3xl font-bold mb-4">{juego.titulo}</h1>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-400">
                      Desarrollador: <span className="text-white">{juego.nombre_desarrollador}</span>
                    </p>
                    <p className="text-gray-400">
                      Editor: <span className="text-white">{juego.nombre_editor}</span>
                    </p>
                    <p className="text-gray-400">
                      Fecha de lanzamiento: 
                      <span className="text-white ml-2">
                        {new Date(juego.fecha_lanzamiento).toLocaleDateString('es-ES') || 'No especificada'}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Clasificación PEGI:
                      <span className="text-white ml-2">
                        {juego.clasificacion_edad ? `PEGI ${juego.clasificacion_edad}` : 'No especificada'}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Géneros: 
                      {juego.nombre_genero && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {juego.nombre_genero.split(',').map(genero => (
                            <span key={genero} className="bg-zinc-700 text-white px-3 py-1 rounded-full text-sm">
                              {genero.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-l from-zinc-900/30 to-zinc-890/30 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-3xl text-white font-bold">{juego.precio}€</p>
                    <button 
                      onClick={handleAddToCart} 
                      disabled={isAdding}
                      className="bg-[#FF4C1A] text-white px-6 py-3 rounded-md hover:bg-[#FF6B3D] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed !bg-[#FF4C1A]"
                    >
                      {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JuegoDetalle;