import React from 'react';
import EliminarRegistros from '../components/admin/eliminarRegistros';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const EliminarRegistrosPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#272727]">
      <Header />
      <div className="flex-grow">
        <EliminarRegistros />
      </div>
      <Footer />
    </div>
  );
};

export default EliminarRegistrosPage;