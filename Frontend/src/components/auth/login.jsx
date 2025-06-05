import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../../services/authService';
import { useAuth } from '../../context/authContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Añadimos login a las funciones que extraemos de useAuth
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await loginUsuario(formData);
      if (response.success) {
        await login(response.usuario, response.token);
        navigate('/', { replace: true });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#272727] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Inicio de sesión</h2>
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
          </div>
          <div>
            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
          </div>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} style={{ backgroundColor: '#FF4C1A' }} className="w-full text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg mt-6 disabled:opacity-50">{isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}</button>
          <div className="text-center mt-4">
            <Link to="/register" className="text-gray-400 hover:text-[#FF4C1A] transition-colors text-sm">¿No tienes cuenta? Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;