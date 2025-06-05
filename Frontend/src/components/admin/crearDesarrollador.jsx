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
    <div className="min-h-screen bg-[#272727] flex flex-col p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Crear Desarrollador</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos del formulario */}
          <button type="submit" className="w-full bg-[#FF4C1A] text-white px-6 py-3 rounded-md">
            Crear Desarrollador
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearDesarrollador;