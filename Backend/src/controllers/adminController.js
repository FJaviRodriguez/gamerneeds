import * as usuarioModel from '../models/usuarioModel.js';
import * as juegoModel from '../models/juegoModel.js';
import * as desarrolladorModel from '../models/desarrolladorModel.js';
import * as editorModel from '../models/editorModel.js';
import * as generoModel from '../models/generoModel.js';
import fs from 'fs';
import path from 'path';

export const registroAdministrativo = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioModel.registerUsuarioAdmin(req.body);
    
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro administrativo:', error);
    res.status(500).json({ 
      message: error.message || 'Error al registrar el usuario' 
    });
  }
};

export const crearJuego = async (req, res) => {
  try {
    // Log the request body and file for debugging
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Basic validation
    if (!req.body.titulo) {
      return res.status(400).json({
        message: 'El título del juego es obligatorio'
      });
    }

    const juegoData = {
      titulo: req.body.titulo.trim(),
      precio: parseFloat(req.body.precio) || 0,
      descripcion: req.body.descripcion?.trim() || '',
      fecha_lanzamiento: req.body.fecha_lanzamiento || null,
      clasificacion_edad: parseInt(req.body.clasificacion_edad) || 0,
      url_trailer: req.body.url_trailer?.trim() || '',
      url_portada: req.file ? req.file.filename : 'default-game.jpg'
    };

    const desarrolladores = JSON.parse(req.body.desarrolladores || '[]');
    const editores = JSON.parse(req.body.editores || '[]');
    const generos = JSON.parse(req.body.generos || '[]');

    const idjuego = await juegoModel.crearJuego(juegoData, desarrolladores, editores, generos);
    
    res.status(201).json({ 
      message: 'Juego creado correctamente', 
      idjuego,
      url_portada: juegoData.url_portada ? 
        `${process.env.BACKEND_URL}/public/juegos/${juegoData.url_portada}` : 
        `${process.env.BACKEND_URL}/public/juegos/default-game.jpg`
    });

  } catch (error) {
    console.error('Error al crear juego:', error);
    res.status(500).json({ 
      message: 'Error al crear el juego',
      error: error.message
    });
  }
};

export const crearDesarrollador = async (req, res) => {
  try {
    const desarrollador = await desarrolladorModel.crearDesarrollador(req.body);
    res.status(201).json({
      message: 'Desarrollador creado correctamente',
      desarrollador
    });
  } catch (error) {
    console.error('Error al crear desarrollador:', error);
    res.status(500).json({ message: error.message });
  }
};

export const crearEditor = async (req, res) => {
  try {
    const editor = await editorModel.crearEditor(req.body);
    res.status(201).json({
      message: 'Editor creado correctamente',
      editor
    });
  } catch (error) {
    console.error('Error al crear editor:', error);
    res.status(500).json({ message: error.message });
  }
};

export const mostrarDesarrolladores = async (req, res) => {
  try {
    console.log('Token recibido:', req.headers.authorization);
    console.log('Intentando obtener desarrolladores...');
    const desarrolladores = await desarrolladorModel.mostrarDesarrolladores();
    console.log('Desarrolladores obtenidos:', desarrolladores);
    res.json(desarrolladores);
  } catch (error) {
    console.error('Error al mostrar desarrolladores:', error);
    res.status(500).json({ message: error.message });
  }
};

export const mostrarEditores = async (req, res) => {
  try {
    const editores = await editorModel.mostrarEditores();
    res.json(editores);
  } catch (error) {
    console.error('Error al mostrar editores:', error);
    res.status(500).json({ message: error.message });
  }
};

export const mostrarGeneros = async (req, res) => {
  try {
    const generos = await generoModel.mostrarGeneros();
    res.json(generos);
  } catch (error) {
    console.error('Error al mostrar géneros:', error);
    res.status(500).json({ message: error.message });
  }
};

export const eliminarJuego = async (req, res) => {
  try {
    const { idjuego } = req.params;
    
    console.log('Solicitud de eliminación recibida para juego:', idjuego);
    console.log('Parámetros:', req.params);
    
    if (!idjuego) {
      return res.status(400).json({ message: 'ID de juego no proporcionado' });
    }

    const url_portada = await juegoModel.eliminarJuego(idjuego);
    
    if (url_portada && url_portada !== 'default-game.jpg') {
      const filePath = path.join(process.cwd(), 'public', 'juegos', url_portada);
      console.log('Intentando eliminar archivo:', filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Archivo eliminado correctamente');
      }
    }

    res.json({ message: 'Juego eliminado correctamente' });
  } catch (error) {
    console.error('Error en eliminarJuego:', error);
    res.status(500).json({ message: 'Error al eliminar el juego' });
  }
};

export const editarJuego = async (req, res) => {
  try {
    console.log('Datos recibidos en controlador:', {
      body: req.body,
      file: req.file,
      params: req.params
    });

    const { idjuego } = req.params;
    if (!idjuego) {
      return res.status(400).json({ message: 'ID de juego no proporcionado' });
    }

    // Preparar los datos del juego
    const juegoData = {
      ...req.body,
      url_portada: req.file ? req.file.filename : undefined
    };

    // Asegurarse de que los arrays están en el formato correcto
    try {
      ['desarrolladores', 'editores', 'generos'].forEach(field => {
        if (typeof req.body[field] === 'string') {
          try {
            juegoData[field] = JSON.parse(req.body[field]);
          } catch (e) {
            console.error(`Error parseando ${field}:`, e);
            juegoData[field] = [];
          }
        }
      });
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return res.status(400).json({ message: 'Formato inválido en los datos relacionados' });
    }

    // Si hay una nueva imagen, eliminar la anterior
    if (req.file) {
      const imagenAnterior = await juegoModel.obtenerImagenJuego(idjuego);
      if (imagenAnterior && imagenAnterior !== 'default-game.jpg') {
        const rutaImagen = path.join(process.cwd(), 'public', 'juegos', imagenAnterior);
        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      }
    }

    await juegoModel.editarJuego(idjuego, juegoData);
    res.json({ message: 'Juego actualizado correctamente' });
  } catch (error) {
    console.error('Error en editarJuego:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el juego',
      error: error.message 
    });
  }
};