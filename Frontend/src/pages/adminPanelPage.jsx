import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import PanelAdmin from '../components/admin/adminPanel';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const PanelAdminPage = () => {
  const { usuario } = useAuth();

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8">
          <PanelAdmin />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PanelAdminPage;