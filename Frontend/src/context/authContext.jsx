import { createContext, useContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/loading';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      setUsuario(user);
      setIsAuthenticated(true);
    }
    setCargando(false);
  }, []);

  const login = async (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUsuario(userData);
      setIsAuthenticated(true);
      mostrarMensajeBienvenida();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const mostrarMensajeBienvenida = () => {
    toast.success(`¡Bienvenido ${usuario?.nombre || ''}!👋🏻 `, {
      duration: 3000,
    });
  };

  if (cargando) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      setUsuario, 
      isAuthenticated,
      login,
      logout,
      mostrarMensajeBienvenida
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};