import React, { useState, useEffect } from 'react';
import JuegoInfo from './juegoInfo';
import { mostrarJuegos } from '../../services/juegoService';

const JuegoGrid = ({ filteredGames }) => {
  const [juegos, setJuegos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarJuegos = async () => {
      if (filteredGames) {
        console.log('Juegos filtrados:', filteredGames);
        setJuegos(filteredGames);
        setLoading(false);
        return;
      }
      try {
        const data = await mostrarJuegos();
        setJuegos(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('Error al cargar los juegos');
      } finally {
        setLoading(false);
      }
    };
    cargarJuegos();
  }, [filteredGames]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white">Cargando juegos...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }
  const juegosAMostrar = filteredGames || juegos;
  if (!juegosAMostrar?.length) {
    return (
      <div className="text-white text-center p-4">No hay juegos disponibles</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {juegosAMostrar.map((juego) => (
        <JuegoInfo key={juego.idjuego} juego={juego} />
      ))}
    </div>
  );
};

export default JuegoGrid;