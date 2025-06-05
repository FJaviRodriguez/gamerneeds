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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearJuego(formData);
      toast.success('Juego creado correctamente');
      navigate('/panel-admin');
    } catch (error) {
      toast.error(error.message || 'Error al crear el juego');
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Crear Juego</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos del formulario similar al registro */}
          <button type="submit" className="w-full bg-[#FF4C1A] text-white px-6 py-3 rounded-md">
            Crear Juego
          </button>
        </form>
      </div>
    </div>
  );
};

// filepath: c:\Users\fjrod\OneDrive\Escritorio\DAW\VSCode\gamerneeds\Frontend\src\components\admin\crearDesarrollador.jsx
const CrearDesarrollador = () => {
  // ... Formulario para desarrollador
};

// filepath: c:\Users\fjrod\OneDrive\Escritorio\DAW\VSCode\gamerneeds\Frontend\src\components\admin\crearEditor.jsx
const CrearEditor = () => {
  // ... Formulario para editor
};

export default CrearJuego;