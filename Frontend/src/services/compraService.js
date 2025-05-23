import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const realizarCompra = async (datosCompra) => {
  try {
    const respuesta = await api.post('/compras', datosCompra);
    return respuesta.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al procesar la compra' };
  }
};
export const obtenerHistorialCompras = async () => {
  try {
    const respuesta = await api.get('/compras/historial');
    return respuesta.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener el historial' };
  }
};