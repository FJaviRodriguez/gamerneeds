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

export const crearGenero = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const generoId = await generoModel.crearGenero({ nombre, descripcion });
    res.status(201).json({ 
      message: 'Género creado correctamente',
      id: generoId
    });
  } catch (error) {
    console.error('Error en crearGenero:', error);
    res.status(500).json({ 
      message: 'Error al crear el género',
      error: error.message 
    });
  }
};