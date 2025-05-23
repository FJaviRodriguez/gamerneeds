import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const TerminosPage = () => {
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Términos y Condiciones</h1>
          <div className="space-y-6 text-gray-300">
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">1. Introducción</h2>
              <p className="mb-4">Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso.</p>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">2. Uso del Sitio</h2>
              <p className="mb-4">El contenido de este sitio es únicamente para su información general y uso personal. Está sujeto a cambios sin previo aviso.</p>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">3. Cuenta de Usuario</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Debe tener al menos 18 años para crear una cuenta.</li>
                <li>Es responsable de mantener la confidencialidad de su cuenta.</li>
                <li>Debe proporcionar información precisa y completa.</li>
              </ul>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">4. Compras</h2>
              <p className="mb-4">Todos los precios están sujetos a cambios sin previo aviso.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TerminosPage;