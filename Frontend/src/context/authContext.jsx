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
      mostrarMensajeBienvenida(userData.nombre);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const mostrarMensajeBienvenida = (nombre) => {
    toast.success(`¡Bienvenido/a ${nombre}👋🏻!`, {
      duration: 3000,
    });
  };

  const handleAvatarUpdate = (newAvatarPath) => {
    setUsuario(prev => ({
      ...prev,
      avatar: newAvatarPath
    }));
    // Actualizar también en localStorage para persistencia
    const userData = JSON.parse(localStorage.getItem('usuario'));
    if (userData) {
      userData.avatar = newAvatarPath;
      localStorage.setItem('usuario', JSON.stringify(userData));
    }
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
      mostrarMensajeBienvenida,
      handleAvatarUpdate
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