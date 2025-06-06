import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const crearSesionPago = async (items, usuarioId) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Items inválidos');
    }
    if (!usuarioId) {
        throw new Error('Usuario no identificado');
    }

    try {
        // Asegurarse de que los precios estén en centavos
        const formattedItems = items.map(item => ({
            nombre: item.nombre,
            precio: Math.round(parseFloat(item.precio)), // Convertir a centavos
            url_portada: item.url_portada,
            idjuego: item.idjuego
        }));

        const response = await api.post('/stripe/crear-sesion-pago', {
            items: formattedItems,
            usuarioId
        });
        return response.data;
    } catch (error) {
        console.error('Error en crearSesionPago:', error);
        throw error.response?.data || error;
    }
};