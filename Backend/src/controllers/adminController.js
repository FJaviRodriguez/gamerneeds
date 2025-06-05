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
    const nuevoJuego = await juegoModel.crearJuego(req.body);
    res.status(201).json({
      message: 'Juego creado correctamente',
      juego: nuevoJuego
    });
  } catch (error) {
    console.error('Error al crear juego:', error);
    res.status(500).json({ message: error.message });
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