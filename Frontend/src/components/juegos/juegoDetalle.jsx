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
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* Aspect ratio 16:9 */}
              <img 
                src={juego.url_portada} 
                alt={juego.titulo} 
                className="absolute top-0 left-0 w-full h-full object-contain bg-black"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.BACKEND_URL}/public/juegos/default-game.jpg`;
                }}
              />
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="lg:col-span-3">
                  <h1 className="text-white text-4xl font-bold mb-4">{juego.titulo}</h1>
                  <div className="flex flex-col sm:flex-row gap-4 text-gray-400 mb-4">
                    <p>Desarrollador: <span className="text-white">{juego.desarrollador}</span></p>
                    <p>Editor: <span className="text-white">{juego.editor}</span></p>
                  </div>
                  {juego.generos && juego.generos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {juego.generos.map(genero => (
                        <span key={genero} className="bg-zinc-700 text-white px-3 py-1 rounded-full text-sm">{genero}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-zinc-900/80 p-6 rounded-lg lg:col-span-1 sticky top-4">
                  <p className="text-3xl text-white font-bold mb-4">{juego.precio}€</p>
                  <button onClick={handleAddToCart} disabled={isAdding} style={{ backgroundColor: '#FF4C1A' }} className="w-full text-white py-3 rounded-md hover:bg-[#FF6B3D] transition-colors font-medium !bg-[#FF4C1A] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
                  </button>
                </div>
              </div>
              <div className="border-t border-zinc-700 pt-6">
                <h2 className="text-white text-2xl font-bold mb-4">Acerca de este juego</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {juego.descripcion || 'No hay descripción disponible'}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-white text-xl font-bold mb-3">Detalles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <p className="text-gray-400">
                    Fecha de lanzamiento:
                    <span className="text-white ml-2">
                      {new Date(juego.fecha_lanzamiento).toLocaleDateString('es-ES') || 'No especificada'}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Desarrollador:
                    <span className="text-white ml-2">
                      {Array.isArray(juego.desarrollador) 
                        ? juego.desarrollador.join(', ') 
                        : juego.desarrollador || 'No especificado'}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Editor:
                    <span className="text-white ml-2">
                      {Array.isArray(juego.editor)
                        ? juego.editor.join(', ')
                        : juego.editor || 'No especificado'}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Clasificación PEGI:
                    <span className="text-white ml-2">
                      {juego.clasificacion_edad ? `PEGI ${juego.clasificacion_edad}` : 'No especificada'}
                    </span>
                  </p>
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