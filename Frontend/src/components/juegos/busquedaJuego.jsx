import React from 'react';
import { Link } from 'react-router-dom';

const ResultadoBusqueda = ({ results, visible, onClose }) => {
  if (!visible || results.length === 0) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="max-h-96 overflow-y-auto">
        {results.map(juego => (
          <Link key={juego.idjuego} to={`/juego/${juego.idjuego}`} onClick={onClose} className="flex items-center p-4 hover:bg-zinc-700 transition-colors">
            <img src={juego.url_portada} alt={juego.titulo} className="w-16 h-16 object-cover rounded"/>
            <div className="ml-4">
              <h3 className="text-white font-medium">{juego.titulo}</h3>
              <p className="text-gray-400 text-sm">{juego.precio}€</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResultadoBusqueda;