import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const registroAdminUsuario = async (userData) => {
  try {
    userData.rol = userData.rol
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();

    if (!['admin', 'usuario'].includes(userData.rol)) {
      throw new Error('El rol debe ser "admin" o "usuario"');
    }

    const response = await api.post('/admin/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el registro de usuario' };
  }
};

export const crearJuego = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await api.post('/admin/juego', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error.response?.data || { message: 'Error al crear el juego' };
  }
};

export const crearDesarrollador = async (desarrolladorData) => {
  try {
    const response = await api.post('/admin/desarrollador', desarrolladorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear el desarrollador' };
  }
};

export const crearEditor = async (editorData) => {
  try {
    const response = await api.post('/admin/editor', editorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear el editor' };
  }
};

export const mostrarDesarrolladores = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Enviando petición GET /admin/desarrolladores');
    const response = await api.get('/admin/desarrolladores');
    console.log('Respuesta recibida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en mostrarDesarrolladores:', error);
    throw error.response?.data || { message: 'Error al mostrar desarrolladores' };
  }
};

export const mostrarEditores = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await api.get('/admin/editores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al mostrar editores' };
  }
};

export const mostrarGeneros = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await api.get('/admin/generos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al mostrar géneros' };
  }
};

export const eliminarJuego = async (idjuego) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Intentando eliminar juego:', idjuego);
    console.log('URL completa:', `${import.meta.env.VITE_API_URL}/admin/juego/${idjuego}`);

    const response = await api.delete(`/admin/juego/${idjuego}`);
    console.log('Respuesta del servidor:', response);
    return response.data;
  } catch (error) {
    console.error('Error detallado:', error.response || error);
    throw error.response?.data || { message: 'Error al eliminar el juego' };
  }
};

export const editarJuego = async (idjuego, formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await api.put(`/admin/juego/${idjuego}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error.response?.data || { message: 'Error al actualizar el juego' };
  }
};