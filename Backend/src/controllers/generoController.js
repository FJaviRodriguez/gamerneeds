import * as generoModel from '../models/generoModel.js';

export const mostrarGeneros = async (req, res) => {
    try {
        const generos = await generoModel.mostrarGeneros();
        if (!generos || !Array.isArray(generos)) {
            throw new Error('Formato de géneros inválido');
        }
        console.log('Géneros recuperados:', generos);
        res.json(generos);
    } catch (error) {
        console.error('Error en mostrarGeneros:', error);
        res.status(500).json({
            mensaje: 'Error al mostrar los géneros',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};