import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const actualizarAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  try {
    const respuesta = await api.post('/usuario/perfil/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return respuesta.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el avatar' };
  }
};