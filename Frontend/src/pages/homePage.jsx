import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import JuegoGrid from '../components/juegos/juegoGrid';
import { useAuth } from '../context/authContext';

const HomePage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const { usuario, showWelcome } = useAuth();

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-x-hidden">
      <Header onSearchResults={handleSearchResults} />
      <main className="flex-1 w-full">
        <div className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-[#1a1a1a]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Todo lo que necesitas Gamer, en una unica web
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto animate-fade-in-delayed">
            Los mejores juegos, a los mejores precios. Construye una comunidad o unete a ella.
          </p>
          <div className="w-24 h-1 bg-[#FF4C1A] mx-auto mt-8"></div>
          {usuario?.rol === 'admin' && (
            <Link 
              to="/panel-admin"
              className="inline-block mt-8 bg-[#FF4C1A] !text-white px-6 py-3 rounded-md hover:bg-[#FF6B3D] transition-colors font-medium no-underline"
              style={{ color: 'white' }}
            >
              Panel de Control
            </Link>
          )}
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <JuegoGrid filteredGames={searchResults} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;