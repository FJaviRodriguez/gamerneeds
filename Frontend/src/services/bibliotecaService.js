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
    
    const respuesta = await api.get('/biblioteca', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return respuesta.data;
  } catch (error) {
    console.error('Error en mostrarBiblioteca:', error.response?.data || error.message);
    throw error;
  }
};

export const agregarJuegosBiblioteca = async (juegosIds) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await api.post('/biblioteca/agregar', 
      { juegos: juegosIds },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error en agregarJuegosBiblioteca:', error.response?.data || error.message);
    throw error;
  }
};