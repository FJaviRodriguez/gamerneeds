import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const PanelAdmin = () => {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const adminOptions = [
    {
      title: 'Crear Juego',
      path: '/admin/juego/crear',
      description: 'Añade nuevos juegos al catálogo'
    },
    {
      title: 'Crear Desarrollador',
      path: '/admin/desarrollador/crear',
      description: 'Registra nuevos estudios de desarrollo'
    },
    {
      title: 'Crear Editor',
      path: '/admin/editor/crear',
      description: 'Añade nuevas empresas editoras'
    }
  ];

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminOptions.map((option) => (
            <Link 
              key={option.path} 
              to={option.path}
              className="bg-zinc-800/50 p-6 rounded-lg hover:bg-zinc-700/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">{option.title}</h2>
              <p className="text-gray-400">{option.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;