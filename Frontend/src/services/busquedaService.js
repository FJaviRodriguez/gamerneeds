import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const buscarJuegos = async (termino, filtros = {}) => {
  try {
    const respuesta = await api.get('/juegos/buscar', {
      params: { q: termino, ...filtros } });
    return respuesta.data;
  } catch (error) {
    console.error('Error en buscarJuegos:', error);
    throw error.response?.data || { message: 'Error en la búsqueda' };
  }
};
export const filtrarGenero = async (generos = []) => {
    try {
        if (!generos || !generos.length) {
            return [];
        }
        const params = new URLSearchParams();
        const generosIds = generos.join(',');
        params.append('generos', generosIds);
        const response = await api.get(`/juegos/filtrar?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error en filtrarGenero:', error);
        throw error;
    }
};
