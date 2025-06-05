import { useState } from 'react';
import { registroAdminUsuario } from '../../services/adminService';

const AdminRegister = () => {
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
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registroAdminUsuario(formData);
      setSuccess('Usuario registrado correctamente');
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        fecha_nacimiento: '',
        direccion: '',
        rol: ''
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro de Usuario</h2>
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 text-green-400 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nombre" 
            value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            required
          />
          <input 
            type="text" 
            placeholder="Apellidos" 
            value={formData.apellidos} 
            onChange={(e) => setFormData({...formData, apellidos: e.target.value})} 
            className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            required
          />
        </div>
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          required
        />
        <input 
          type="date" 
          value={formData.fecha_nacimiento} 
          onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} 
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          required
        />
        <input 
          type="text" 
          placeholder="Dirección" 
          value={formData.direccion} 
          onChange={(e) => setFormData({...formData, direccion: e.target.value})} 
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          required
        />
        <input 
          type="text" 
          placeholder="Rol (admin/usuario)" 
          value={formData.rol} 
          onChange={(e) => setFormData({...formData, rol: e.target.value})} 
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-[#FF4C1A] text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;