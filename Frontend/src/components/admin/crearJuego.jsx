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
    <div className="max-w-2xl mx-auto w-full bg-[#1a1a1a] p-8 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-white">
            Título del Juego
          </label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            required
            value={formData.titulo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-white">
            Descripción
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            required
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-white">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            name="precio"
            id="precio"
            required
            value={formData.precio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="fecha_lanzamiento" className="block text-sm font-medium text-white">
            Fecha de Lanzamiento
          </label>
          <input
            type="date"
            name="fecha_lanzamiento"
            id="fecha_lanzamiento"
            required
            value={formData.fecha_lanzamiento}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="clasificacion_edad" className="block text-sm font-medium text-white">
            Clasificación por Edad
          </label>
          <input
            type="number"
            name="clasificacion_edad"
            id="clasificacion_edad"
            required
            value={formData.clasificacion_edad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="url_trailer" className="block text-sm font-medium text-white">
            URL del Trailer
          </label>
          <input
            type="url"
            name="url_trailer"
            id="url_trailer"
            required
            value={formData.url_trailer}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="url_portada" className="block text-sm font-medium text-white">
            Imagen de Portada
          </label>
          <input
            type="file"
            name="url_portada"
            id="url_portada"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FF4C1A] text-white px-6 py-3 rounded-md hover:bg-[#FF6B3D] transition-colors"
        >
          Crear Juego
        </button>
      </form>
    </div>
  );
};

export default CrearJuego;