import { createContext, useContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/loading';

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

  const login = async (userData) => {
    setUsuario(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
    setIsAuthenticated(false);
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
      logout
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