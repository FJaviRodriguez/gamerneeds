import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearJuego } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const CrearJuego = () => {
  const navigate = useNavigate();
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [editores, setEditores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    fecha_lanzamiento: '',
    clasificacion_edad: '',
    url_trailer: '',
    url_portada: '',
    desarrolladores: [],
    editores: [],
    generos: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [desarrolladoresRes, editoresRes, generosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/admin/desarrolladores`).then(res => res.json()),
          fetch(`${import.meta.env.VITE_API_URL}/admin/editores`).then(res => res.json()),
          fetch(`${import.meta.env.VITE_API_URL}/admin/generos`).then(res => res.json())
        ]);

        setDesarrolladores(desarrolladoresRes);
        setEditores(editoresRes);
        setGeneros(generosRes);
      } catch (error) {
        toast.error('Error al cargar los datos');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Añadir campos básicos
      Object.keys(formData).forEach(key => {
        if (key !== 'desarrolladores' && key !== 'editores' && key !== 'generos') {
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Añadir relaciones
      formDataToSend.append('desarrolladores', JSON.stringify(formData.desarrolladores));
      formDataToSend.append('editores', JSON.stringify(formData.editores));
      formDataToSend.append('generos', JSON.stringify(formData.generos));

      await crearJuego(formDataToSend);
      toast.success('Juego creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      console.error('Error creating game:', error);
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
        
        <div className="space-y-2">
          <label htmlFor="fecha_lanzamiento" className="block text-sm font-medium text-gray-400">
            Fecha de Lanzamiento del Juego
          </label>
          <input
            type="date"
            id="fecha_lanzamiento"
            name="fecha_lanzamiento"
            value={formData.fecha_lanzamiento}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        
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

        {/* Nuevos campos de relaciones */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Desarrolladores
          </label>
          <select
            multiple
            name="desarrolladores"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-gray-600 text-white rounded-md"
          >
            {desarrolladores.map(dev => (
              <option key={dev.iddesarrollador} value={dev.iddesarrollador}>
                {dev.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Editores
          </label>
          <select
            multiple
            name="editores"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-gray-600 text-white rounded-md"
          >
            {editores.map(editor => (
              <option key={editor.ideditor} value={editor.ideditor}>
                {editor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Géneros
          </label>
          <select
            multiple
            name="generos"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-gray-600 text-white rounded-md"
          >
            {generos.map(genero => (
              <option key={genero.idgenero} value={genero.idgenero}>
                {genero.nombre}
              </option>
            ))}
          </select>
        </div>

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