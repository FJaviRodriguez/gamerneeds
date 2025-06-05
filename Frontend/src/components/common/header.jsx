import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buscarJuegos, filtrarGenero } from '../../services/busquedaService';
import { useAuth } from '../../context/authContext';
import { toast } from 'react-hot-toast'; // Añadir esta importación
import logo from '../../assets/logo.png';
import FilterMenu from '../juegos/busquedaGenero';

const Header = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/icons/default-icon.png'); // Valor por defecto
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Añadir este estado
  const searchTimeout = useRef(null);
  const { usuario, isAuthenticated, logout } = useAuth(); // Añadimos isAuthenticated y logout
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.avatar) {
      setAvatarUrl('/icons/default-icon.png');
      return;
    }
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    const fullAvatarUrl = `${baseUrl}${usuario.avatar}`;
    if (fullAvatarUrl.trim()) {
      setAvatarUrl(fullAvatarUrl);
    } else {
      setAvatarUrl('/icons/default-icon.png');
    }
  }, [usuario]);
  const handleSearch = async (value) => {
    setSearchTerm(value);   
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    if (!value.trim()) {
      onSearchResults(null);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await buscarJuegos(value);
        onSearchResults(data);
      } catch (error) {
        console.error('Hubo un error en la busqueda:', error);
        onSearchResults([]);
      }
    }, 300);
  };
  const handleFilterSelect = async (selectedGenres) => {
    try {
        if (!selectedGenres || selectedGenres.length === 0) {
            onSearchResults(null);
            return;
        }
        const data = await filtrarGenero(selectedGenres);
        onSearchResults(data); 
    } catch (error) {
        console.error('Hubo un error al intentar filtrar:', error);
        onSearchResults([]);
    }
  };
  const getAvatarUrl = () => {
    return avatarUrl || '/icons/default-icon.png';
  };
  const handleProfileClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: '/perfil' } });
    }
  };
  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: '/carrito' } });
    }
  };
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast.success('Has cerrado sesión correctamente', {
      duration: 3000,
      position: 'bottom-center',
      style: {
        background: '#1F2937',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px 24px',
        fontSize: '1.1rem',
        maxWidth: '400px',
        width: 'auto'
      },
    });
  };
  return (
    <header className="bg-black p-3">
      <div className="w-full flex items-center">
        <div className="flex items-center space-x-3 w-1/3">
          <Link to="/">
            <img src={logo} alt="Gamers Needs Logo" className="w-24 h-24 rounded-full"/>
          </Link>
          <Link to="/">
          <div className="flex flex-col">
            <h1 className="text-white text-[8px] font-bold tracking-wider leading-none">GAMERS</h1>
            <h1 className="text-white text-[8px] font-bold tracking-wider">NEEDS</h1>
          </div>
          </Link>
        </div>
        <div className="flex-1 max-w-xl">
          <div className="bg-gradient-to-r from-[#FF4C1A] to-[#FF7A1A] flex items-center rounded-full p-1.5">
            <div>
              <img src="/icons/search-icon.png" alt="" className="w-16 h-12 opacity-70"/>
            </div>
            <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-transparent text-white text-sm placeholder-white/70 outline-none px-3"/>
            <div className="relative pr-2"> 
              <div onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}className="cursor-pointer pt-1">
                <img src="/icons/filter-icon.png" alt="Filtrar" className="w-16 h-12 opacity-70 hover:opacity-100 transition-opacity"/>
              </div>
              <FilterMenu isOpen={isFilterMenuOpen} onClose={() => setIsFilterMenuOpen(false)} onFilterSelect={handleFilterSelect}/>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-24 ml-26">
          <Link to="/carrito" className="text-white" onClick={handleCartClick}>
            <img 
              src="/icons/cart-icon.png" 
              alt="Carrito" 
              className="w-16 h-16 opacity-70 hover:opacity-100 transition-opacity"
            />
          </Link>
          <div className="relative">
            <div 
              className="cursor-pointer relative group"
              onClick={() => {
                if (isAuthenticated) {
                  setIsUserMenuOpen(!isUserMenuOpen);
                } else {
                  navigate('/login', { state: { from: '/perfil' } });
                }
              }}
            >
              <img 
                src={avatarUrl} 
                alt="Perfil" 
                className="w-16 h-16 rounded-full opacity-70 group-hover:opacity-100 transition-opacity object-cover border border-gray-600"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/icons/default-icon.png';
                }}
              />
              {!isAuthenticated && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block whitespace-nowrap">
                  <span className="text-sm text-gray-400">Iniciar sesión</span>
                </div>
              )}
            </div>
            
            {/* Menú desplegable */}
            {isUserMenuOpen && isAuthenticated && (
              <div 
                className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1" role="menu">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white cursor-pointer transition-colors duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;