import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registroUsuario } from '../../services/authService';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    fecha_nacimiento: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registroUsuario(formData);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro</h2>
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"/>
          <input type="text" placeholder="Apellidos" value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"/>
        </div>
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
        <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
        <input type="date" value={formData.fecha_nacimiento} onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
        <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} required className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"/>
        <button type="submit" style={{ backgroundColor: '#FF4C1A' }} className="w-full text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg mt-6">Registrarse</button>
        <div className="text-center mt-4">
          <Link to="/login" className="text-gray-400 hover:text-[#FF4C1A] transition-colors text-sm">¿Ya tienes cuenta? Iniciar sesión</Link>
        </div>
      </form>
    </div>
  );
};

export default Registro;