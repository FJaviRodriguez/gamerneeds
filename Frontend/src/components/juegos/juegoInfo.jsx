import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JuegoInfo = ({ juego }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/juego/${juego.idjuego}`} className="block">
      <div className="bg-zinc-800/50 rounded-lg overflow-hidden transition-transform hover:scale-105">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={imageError ? '/icons/default-game.png' : juego.url_portada} 
            alt={juego.titulo} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
            onError={() => setImageError(true)} 
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h2 className="text-white font-semibold text-lg mb-2 truncate">{juego.titulo}</h2>
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">{juego.desarrollador}</div>
            <div className="text-white font-bold">
              {juego.precio ? `${juego.precio}€` : 'Gratis'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JuegoInfo;