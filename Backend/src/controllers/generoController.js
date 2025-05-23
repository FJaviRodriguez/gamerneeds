import * as generoModel from '../models/generoModel.js';

export const mostrarGeneros = async (req, res) => {
    try {
        const generos = await generoModel.mostrarGeneros();
        res.json(generos);
    } catch (error) {
        console.error('Hubo un error al mostrar los generos:', error);
        res.status(500).json({ 
            mensaje: 'Hubo un error al mostrar los generos',
            error: error.message 
        });
    }
};