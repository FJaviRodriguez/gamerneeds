import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Navigate } from 'react-router-dom';

const PanelAdmin = () => {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const adminOptions = [
    {
      title: 'Registrar Usuario',
      path: '/admin',
      description: 'Registra nuevos usuarios o administradores'
    },
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
    },
    {
    title: 'Crear Género',
    path: '/admin/genero/crear',
    description: 'Modifica los juegos existentes'
    },
    {
    title: 'Editar Juego',
    path: '/admin/juego/editar',
    description: 'Modifica los juegos existentes'
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
              className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors shadow-lg"
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