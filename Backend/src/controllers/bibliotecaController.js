import * as bibliotecaModel from '../models/bibliotecaModel.js';

export const mostrarBiblioteca = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Usuario no autenticado'
            });
        }

        const usuarioId = req.user.id;
        const juegos = await bibliotecaModel.mostrarBiblioteca(usuarioId);
        
        if (!juegos || !Array.isArray(juegos)) {
            return res.status(404).json({
                message: 'No se encontraron juegos en la biblioteca'
            });
        }

        res.json(juegos);
    } catch (error) {
        console.error('Error en mostrarBiblioteca:', error);
        res.status(500).json({ 
            message: 'Error al obtener la biblioteca',
            error: error.message 
        });
    }
};
export const aniadirJuegos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { juegos } = req.body;
    if (!Array.isArray(juegos)) {
      return res.status(400).json({ 
        message: 'El formato de juegos es inválido' 
      });
    }
    await bibliotecaModel.agregarJuegosABiblioteca(usuarioId, juegos);
    res.json({ 
      success: true, 
      message: 'Juegos añadidos a la biblioteca correctamente' 
    });
  } catch (error) {
    console.error('Error en agregarJuegos:', error);
    res.status(500).json({ 
      message: 'Error al agregar juegos a la biblioteca' 
    });
  }
};
export const mostrarHistorial = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const historial = await bibliotecaModel.mostrarHistorialJuegos(usuarioId);
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial de juegos' });
  }
};