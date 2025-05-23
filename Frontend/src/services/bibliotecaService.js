import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const mostrarBiblioteca = async () => {
  try {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      throw new Error('No hay autenticación');
    }
    const user = JSON.parse(userString);
    const userId = user.id;
    if (!userId) {
      throw new Error('ID de usuario no encontrado');
    }
    const respuesta = await api.get(`/biblioteca`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};
export const agregarJuegosBiblioteca = async (juegosIds) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/biblioteca/agregar', { juegos: juegosIds }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al añadir juegos a la biblioteca' };
  }
};