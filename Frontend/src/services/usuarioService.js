import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const actualizarAvatar = async (formData) => {
  try {
    const response = await api.post('/usuario/perfil/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    throw error.response?.data || { message: 'Error al actualizar el avatar' };
  }
};