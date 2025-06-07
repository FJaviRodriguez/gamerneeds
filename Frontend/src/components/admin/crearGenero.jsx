import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearGenero } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const CrearGenero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
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
      await crearGenero(formData);
      toast.success('Género creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      toast.error(error.message || 'Error al crear el género');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nuevo Género</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Género"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <textarea
          name="descripcion"
          placeholder="Descripción del Género"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="admin-button-primary flex-1 py-3"
          >
            Crear {tipo}
          </button>

          <button
            type="button"
            onClick={() => navigate('/panel-admin')}
            className="admin-button-primary px-6 py-3"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearGenero;