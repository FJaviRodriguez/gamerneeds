import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const RutasProtegidas = ({ children, adminOnly = false }) => {
  const { usuario, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && usuario?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutasProtegidas;