import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import EditarJuego from '../components/admin/editarJuego';

const EditarJuegoFormPage = () => {
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8">
          <EditarJuego />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditarJuegoFormPage;