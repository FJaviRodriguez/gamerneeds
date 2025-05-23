import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userStored = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userStored && token) {
        setUsuario(JSON.parse(userStored));
      }
    } catch (error) {
    } finally {
      setCargando(false);
    }
  }, []);
  const mostrarMensajeBienvenida = () => {
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 3000);
  };
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };
  return (
    <AuthContext.Provider value={{ 
      usuario, 
      setUsuario,
      showWelcome,
      mostrarMensajeBienvenida, 
      cerrarSesion,
      cargando 
    }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};