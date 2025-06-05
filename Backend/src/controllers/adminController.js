import * as usuarioModel from '../models/usuarioModel.js';
import * as juegoModel from '../models/juegoModel.js';
import * as desarrolladorModel from '../models/desarrolladorModel.js';
import * as editorModel from '../models/editorModel.js';

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
    // Basic validation
    if (!req.body.titulo?.trim()) {
      return res.status(400).json({
        message: 'El título del juego es obligatorio'
      });
    }

    if (!req.body.precio || parseFloat(req.body.precio) <= 0) {
      return res.status(400).json({
        message: 'El precio debe ser mayor que 0'
      });
    }

    const juegoData = {
      titulo: req.body.titulo.trim(),
      precio: parseFloat(req.body.precio),
      descripcion: req.body.descripcion?.trim() || '',
      fecha_lanzamiento: req.body.fecha_lanzamiento || null,
      clasificacion_edad: parseInt(req.body.clasificacion_edad) || 0,
      url_trailer: req.body.url_trailer?.trim() || '',
      url_portada: req.file ? req.file.filename : 'default-game.jpg'
    };

    const idjuego = await juegoModel.crearJuego(juegoData);
    
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