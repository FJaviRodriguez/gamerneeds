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
    <div className="max-w-2xl mx-auto w-full bg-[#1a1a1a] p-8 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-white">
            Nombre del Desarrollador
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="sitio_web" className="block text-sm font-medium text-white">
            Sitio Web
          </label>
          <input
            type="url"
            name="sitio_web"
            id="sitio_web"
            required
            value={formData.sitio_web}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="fecha_fundacion" className="block text-sm font-medium text-white">
            Fecha de Fundación
          </label>
          <input
            type="date"
            name="fecha_fundacion"
            id="fecha_fundacion"
            required
            value={formData.fecha_fundacion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-zinc-800 border-zinc-700 text-white shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FF4C1A] text-white px-6 py-3 rounded-md hover:bg-[#FF6B3D] transition-colors"
        >
          Crear Desarrollador
        </button>
      </form>
    </div>
  );
};

export default CrearDesarrollador;