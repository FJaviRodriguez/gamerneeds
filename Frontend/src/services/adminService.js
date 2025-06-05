import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const registroAdminUsuario = async (userData) => {
  try {
    // Limpiamos y normalizamos el rol
    userData.rol = userData.rol
      .replace(/[^a-zA-Z]/g, '') // Elimina todo excepto letras
      .toLowerCase(); // Convierte a minúsculas

    // Validamos que el rol sea válido
    if (!['admin', 'usuario'].includes(userData.rol)) {
      throw new Error('El rol debe ser "admin" o "usuario"');
    }

    const response = await api.post('/admin/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error en el registro de usuario' };
  }
};