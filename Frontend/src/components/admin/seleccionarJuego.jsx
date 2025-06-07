import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mostrarJuegos } from '../../services/juegoService';
import { toast } from 'react-hot-toast';

const SeleccionarJuego = () => {
  const [juegos, setJuegos] = useState([]);
  const [selectedJuego, setSelectedJuego] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const data = await mostrarJuegos();
        setJuegos(data);
      } catch (error) {
        toast.error('Error al cargar los juegos');
      }
    };
    fetchJuegos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedJuego) {
      toast.error('Selecciona un juego para editar');
      return;
    }
    navigate(`/admin/juego/editar/${selectedJuego}`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Seleccionar Juego para Editar</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Selecciona un Juego
          </label>
          <select
            value={selectedJuego}
            onChange={(e) => setSelectedJuego(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-gray-600 text-white rounded-md"
            required
          >
            <option value="">Selecciona un juego...</option>
            {juegos.map(juego => (
              <option key={juego.idjuego} value={juego.idjuego}>
                {juego.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="admin-button-primary flex-1 py-3"
          >
            Editar Juego
          </button>

          <button
            type="button"
            onClick={() => navigate('/panel-admin')}
            className="admin-button-primary px-6 py-3"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeleccionarJuego;