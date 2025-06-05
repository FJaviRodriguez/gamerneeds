import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearJuego } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const CrearJuego = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    fecha_lanzamiento: '',
    clasificacion_edad: '',
    url_trailer: '',
    url_portada: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'file' 
      ? e.target.files[0]
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await crearJuego(formDataToSend);
      toast.success('Juego creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      toast.error(error.message || 'Error al crear el juego');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nuevo Juego</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="titulo"
          placeholder="Título del Juego"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="date"
          name="fecha_lanzamiento"
          value={formData.fecha_lanzamiento}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="number"
          name="clasificacion_edad"
          placeholder="Clasificación por Edad"
          value={formData.clasificacion_edad}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="url"
          name="url_trailer"
          placeholder="URL del Trailer"
          value={formData.url_trailer}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        
        <input
          type="file"
          name="url_portada"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-3 text-white"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-[#FF4C1A] text-white py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium text-lg"
          >
            Crear Juego
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

export default CrearJuego;