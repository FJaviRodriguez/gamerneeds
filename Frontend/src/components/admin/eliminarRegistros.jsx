import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  mostrarDesarrolladores, 
  mostrarEditores, 
  mostrarGeneros,
  eliminarDesarrollador,
  eliminarEditor,
  eliminarGenero
} from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/authContext';

const EliminarRegistros = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [editores, setEditores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (!usuario || usuario.rol !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [desarrolladoresRes, editoresRes, generosRes] = await Promise.all([
          mostrarDesarrolladores(),
          mostrarEditores(),
          mostrarGeneros()
        ]);

        setDesarrolladores(desarrolladoresRes);
        setEditores(editoresRes);
        setGeneros(generosRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usuario, navigate]);

  const handleEliminar = async (tipo, id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${tipo}: ${nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      switch (tipo) {
        case 'desarrollador':
          await eliminarDesarrollador(id);
          setDesarrolladores(prev => prev.filter(d => d.iddesarrollador !== id));
          break;
        case 'editor':
          await eliminarEditor(id);
          setEditores(prev => prev.filter(e => e.ideditor !== id));
          break;
        case 'genero':
          await eliminarGenero(id);
          setGeneros(prev => prev.filter(g => g.idgenero !== id));
          break;
        default:
          throw new Error('Tipo de registro no válido');
      }
      toast.success(`${tipo} eliminado correctamente`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || `Error al eliminar ${tipo}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Eliminar Registros</h2>
      
      <div className="space-y-8">
        {/* Sección Desarrolladores */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl text-white mb-4">Desarrolladores</h3>
          <div className="space-y-2">
            {desarrolladores.length === 0 ? (
              <p className="text-gray-400">No hay desarrolladores registrados</p>
            ) : (
              desarrolladores.map(dev => (
                <div key={dev.iddesarrollador} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
                  <span className="text-white">{dev.nombre}</span>
                  <button
                    onClick={() => handleEliminar('desarrollador', dev.iddesarrollador, dev.nombre)}
                    disabled={loading}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sección Editores */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl text-white mb-4">Editores</h3>
          <div className="space-y-2">
            {editores.length === 0 ? (
              <p className="text-gray-400">No hay editores registrados</p>
            ) : (
              editores.map(editor => (
                <div key={editor.ideditor} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
                  <span className="text-white">{editor.nombre}</span>
                  <button
                    onClick={() => handleEliminar('editor', editor.ideditor, editor.nombre)}
                    disabled={loading}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sección Géneros */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl text-white mb-4">Géneros</h3>
          <div className="space-y-2">
            {generos.length === 0 ? (
              <p className="text-gray-400">No hay géneros registrados</p>
            ) : (
              generos.map(genero => (
                <div key={genero.idgenero} className="flex justify-between items-center bg-zinc-800 p-3 rounded">
                  <span className="text-white">{genero.nombre}</span>
                  <button
                    onClick={() => handleEliminar('genero', genero.idgenero, genero.nombre)}
                    disabled={loading}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/panel-admin')}
            className="px-6 py-3 border border-gray-600 text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarRegistros;