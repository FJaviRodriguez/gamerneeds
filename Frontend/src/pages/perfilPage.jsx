import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import AvatarUpload from '../components/usuario/avatar';
import Biblioteca from '../components/usuario/biblioteca';

const PerfilPage = () => {
  const { usuario, setUsuario } = useAuth();

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
          <div className="flex items-center space-x-6 mb-8">
            <img src={usuario?.avatar || '/icons/default-icon.png'} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#FF4C1A] object-cover"/>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{usuario?.nombre}</h1>
              <p className="text-gray-400">{usuario?.email}</p>
            </div>
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