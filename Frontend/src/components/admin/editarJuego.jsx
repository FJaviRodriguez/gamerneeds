import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  editarJuego,
  mostrarDesarrolladores, 
  mostrarEditores, 
  mostrarGeneros 
} from '../../services/adminService';
import { mostrarJuegoPorId } from '../../services/juegoService';
import { toast } from 'react-hot-toast';

const EditarJuego = () => {
  const { id } = useParams();
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
    const cargarDatos = async () => {
      try {
        const [juego, desarrolladoresRes, editoresRes, generosRes] = await Promise.all([
          mostrarJuegoPorId(id),
          mostrarDesarrolladores(),
          mostrarEditores(),
          mostrarGeneros()
        ]);

        setDesarrolladores(desarrolladoresRes);
        setEditores(editoresRes);
        setGeneros(generosRes);
        
        // Convertir los datos del juego al formato del formulario
        setFormData({
          titulo: juego.titulo,
          descripcion: juego.descripcion,
          precio: juego.precio,
          fecha_lanzamiento: juego.fecha_lanzamiento.split('T')[0],
          clasificacion_edad: juego.clasificacion_edad,
          url_trailer: juego.url_trailer,
          url_portada: '',
          // Mapear los IDs de desarrolladores
          desarrolladores: desarrolladoresRes
            .filter(dev => juego.nombre_desarrollador?.includes(dev.nombre))
            .map(dev => dev.iddesarrollador.toString()),
          // Mapear los IDs de editores
          editores: editoresRes
            .filter(ed => juego.nombre_editor?.includes(ed.nombre))
            .map(ed => ed.ideditor.toString()),
          // Mapear los IDs de géneros
          generos: generosRes
            .filter(gen => juego.nombre_genero?.includes(gen.nombre))
            .map(gen => gen.idgenero.toString())
        });
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          toast.error('Solo se permiten imágenes JPG, PNG o WebP');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('La imagen no puede ser mayor a 5MB');
          return;
        }
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
      }
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
      
      Object.keys(formData).forEach(key => {
        if (key === 'url_portada' && formData[key] instanceof File) {
          formDataToSend.append('url_portada', formData[key]);
        } else if (key !== 'desarrolladores' && key !== 'editores' && key !== 'generos') {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append('desarrolladores', JSON.stringify(formData.desarrolladores));
      formDataToSend.append('editores', JSON.stringify(formData.editores));
      formDataToSend.append('generos', JSON.stringify(formData.generos));

      await editarJuego(id, formDataToSend);
      toast.success('Juego actualizado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error(error.message || 'Error al actualizar el juego');
    }
  };

  // Resto del JSX similar al de CrearJuego pero con los valores del formData
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Juego</h2>
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Desarrolladores
          </label>
          <select
            multiple
            name="desarrolladores"
            value={formData.desarrolladores}
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
            value={formData.editores}
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
            value={formData.generos}
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
            Guardar Cambios
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

export default EditarJuego;