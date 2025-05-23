import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { estaAutenticado } from '../../services/authService';

const RutasProtegidas = ({ children }) => {
  const { usuario } = useAuth();
  const location = useLocation();
  const tokenValido = estaAutenticado();
  if (!usuario || !tokenValido) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default RutasProtegidas;