import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registroAdminUsuario } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    fecha_nacimiento: '',
    direccion: '',
    rol: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registroAdminUsuario(formData);
      toast.success('Usuario registrado correctamente');
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col overflow-hidden">
      <div className="flex-1 flex justify-center items-center -mt-20">
        <div className="w-full max-w-2xl px-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro</h2>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Nombre" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                  required 
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
                <input 
                  type="text" 
                  placeholder="Apellidos" 
                  value={formData.apellidos} 
                  onChange={(e) => setFormData({...formData, apellidos: e.target.value})} 
                  required 
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="date" 
                value={formData.fecha_nacimiento} 
                onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} 
                required 
                className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Dirección" 
                value={formData.direccion} 
                onChange={(e) => setFormData({...formData, direccion: e.target.value})} 
                required 
                className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Rol (admin/usuario)" 
                value={formData.rol} 
                onChange={(e) => setFormData({...formData, rol: e.target.value})} 
                required 
                className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button 
                type="submit" 
                style={{ backgroundColor: '#FF4C1A' }} 
                className="w-full text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg mt-6"
              >
                Registrar Usuario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;