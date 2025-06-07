import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearEditor } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const CrearEditor = () => {
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
      await crearEditor(formData);
      toast.success('Editor creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      toast.error(error.message || 'Error al crear el editor');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nuevo Editor</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Editor"
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
        
        <div className="space-y-2">
          <label htmlFor="fecha_fundacion" className="block text-sm font-medium text-gray-400">
            Fecha de Fundación de la Editorial
          </label>
          <input
            type="date"
            id="fecha_fundacion"
            name="fecha_fundacion"
            value={formData.fecha_fundacion}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="admin-button-primary flex-1 py-3"
          >
            Crear Editor
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

export default CrearEditor;