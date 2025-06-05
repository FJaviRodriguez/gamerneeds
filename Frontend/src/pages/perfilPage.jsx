import React from 'react';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import AvatarUpload from '../components/usuario/avatar';
import Biblioteca from '../components/usuario/biblioteca';

const PerfilPage = () => {
  const { usuario, setUsuario } = useAuth();

  const getAvatarUrl = () => {
    if (!usuario?.avatar) {
      return '/icons/default-icon.png';
    }
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    if (usuario.avatar.startsWith('http')) {
      return usuario.avatar;
    }
    if (usuario.avatar.startsWith('/public')) {
      return `${baseUrl}${usuario.avatar}`;
    }
    return `${baseUrl}/public/avatars/${usuario.avatar}`;
  };

  const handleAvatarUpdate = (newAvatarPath) => {
    setUsuario({
      ...usuario,
      avatar: newAvatarPath
    });
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <img 
                src={getAvatarUrl()} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-[#FF4C1A] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/icons/default-icon.png';
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{usuario?.nombre}</h1>
                <p className="text-gray-400">{usuario?.email}</p>
              </div>
            </div>
            {usuario?.rol === 'admin' && (
              <Link 
                to="/admin"
                className="bg-[#FF4C1A] text-white px-6 py-3 rounded-md transition-colors font-medium"
              >
                Registrar usuario
              </Link>
            )}
          </div>
          <AvatarUpload onAvatarUpdate={handleAvatarUpdate} />
          <div className="mt-8">
            <Biblioteca />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PerfilPage;