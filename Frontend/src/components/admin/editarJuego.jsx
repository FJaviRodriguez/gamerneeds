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
          desarrolladores: juego.desarrolladores?.split(',').map(d => d.trim()) || [],
          editores: juego.editores?.split(',').map(e => e.trim()) || [],
          generos: juego.generos?.split(',').map(g => g.trim()) || []
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
      {/* Mismo formulario que CrearJuego pero con los valores precargados */}
    </div>
  );
};

export default EditarJuego;