import crearInstanciaApi from './apiConfig';

const api = crearInstanciaApi();

export const enviarEmailBienvenida = async (nombre, email) => {
    try {
        const response = await api.post('/auth/enviar-bienvenida', {
            nombre,
            email
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
        throw error.response?.data || { message: 'Error al enviar el email de bienvenida' };
    }
};