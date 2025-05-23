import createApiInstance from './apiConfig';

const api = createApiInstance();

export const crearSesionPago = async (items, usuarioId) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Items inválidos');
    }
    if (!usuarioId) {
        throw new Error('Usuario no identificado');
    }
    try {
        const response = await api.post('/stripe/crear-sesion-pago', {
            items: items.map(item => ({
                ...item,
                precio: Number(item.precio) * 100
            })),
            usuarioId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};