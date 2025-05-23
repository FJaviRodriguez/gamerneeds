import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const PoliticaPage = () => {
  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>
          <div className="space-y-6 text-gray-300">
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">1. Recopilación de Información</h2>
              <p className="mb-4">Recopilamos información cuando usted:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Se registra en nuestro sitio</li>
                <li>Realiza una compra</li>
                <li>Se suscribe a nuestro boletín</li>
                <li>Responde a una encuesta</li>
              </ul>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">2. Uso de la Información</h2>
              <p className="mb-4">La información que recopilamos se utiliza para:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Personalizar su experiencia</li>
                <li>Mejorar nuestro sitio web</li>
                <li>Procesar transacciones</li>
                <li>Enviar correos electrónicos periódicos</li>
              </ul>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">3. Protección de la Información</h2>
              <p className="mb-4">Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal.</p>
            </section>
            <section className="bg-zinc-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">4. Cookies</h2>
              <p className="mb-4">Utilizamos cookies para mejorar su experiencia de navegación y analizar el tráfico del sitio web.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliticaPage;