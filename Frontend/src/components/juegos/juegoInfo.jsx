import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JuegoInfo = ({ juego }) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return '/icons/default-game.png';
    
    // Si ya es una URL completa, la devolvemos
    if (url.startsWith('http')) return url;
    
    // Si es una ruta relativa, añadimos la URL base
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/public/juegos/${url.split('/').pop()}`;
  };

  const handleImageError = () => {
    // Si la imagen falla, intentamos cargar la URL original antes de usar la imagen por defecto
    if (!imageError) {
      setImageError(true);
      const img = new Image();
      img.src = juego.url_portada;
      img.onload = () => {
        setImageError(false);
      };
    }
  };

  return (
    <Link to={`/juego/${juego.idjuego}`} className="block">
      <div className="bg-zinc-800/50 rounded-lg overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48">
          <img 
            src={imageError ? '/icons/default-game.png' : getImageUrl(juego.url_portada)}
            alt={juego.titulo} 
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h2 className="text-white font-semibold text-lg mb-2 truncate">{juego.titulo}</h2>
          <div className="flex justify-end items-center">
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