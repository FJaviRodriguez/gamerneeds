import { createContext, useContext, useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/loading';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    usuario: null,
    isAuthenticated: false,
    showWelcome: false,
    cargando: true
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userStored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        setState(prev => ({
          ...prev,
          usuario: userStored ? JSON.parse(userStored) : null,
          isAuthenticated: !!token,
          cargando: false
        }));
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState(prev => ({ ...prev, cargando: false }));
      }
    };

    initializeAuth();
  }, []);

  const value = {
    ...state,
    setUsuario: (usuario) => {
      setState(prev => ({ ...prev, usuario, isAuthenticated: true }));
      localStorage.setItem('user', JSON.stringify(usuario));
    },
    mostrarMensajeBienvenida: () => {
      setState(prev => ({ ...prev, showWelcome: true }));
      setTimeout(() => setState(prev => ({ ...prev, showWelcome: false })), 3000);
    },
    cerrarSesion: () => {
      setState({
        usuario: null,
        isAuthenticated: false,
        showWelcome: false,
        cargando: false
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  if (state.cargando) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
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