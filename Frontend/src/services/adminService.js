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

export const crearJuego = async (juegoData) => {
  try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(juegoData)) {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    const response = await api.post('/admin/juego', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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