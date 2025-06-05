import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearDesarrollador } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const CrearDesarrollador = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    sitio_web: '',
    fecha_fundacion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearDesarrollador(formData);
      toast.success('Desarrollador creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      toast.error(error.message || 'Error al crear el desarrollador');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nuevo Desarrollador</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Desarrollador"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="url"
          name="sitio_web"
          placeholder="Sitio Web"
          value={formData.sitio_web}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="date"
          name="fecha_fundacion"
          value={formData.fecha_fundacion}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-[#FF4C1A] text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg"
          >
            Crear Desarrollador
          </button>
          <button
            type="button"
            onClick={() => navigate('/panel-admin')}
            className="px-6 py-3 border border-gray-600 text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearDesarrollador;