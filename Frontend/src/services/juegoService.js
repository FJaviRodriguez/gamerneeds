import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const mostrarJuegos = async () => {
  try {
    const respuesta = await api.get('/juegos');
    return respuesta.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener los juegos' };
  }
};
export const mostrarJuegoPorId = async (id) => {
  try {
    const respuesta = await api.get(`/juegos/${id}`);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener el juego' };
  }
};