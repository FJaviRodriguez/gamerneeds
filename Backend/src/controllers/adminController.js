import bcrypt from 'bcrypt';
import * as usuarioModel from '../models/usuarioModel.js';

export const registroAdministrativo = async (req, res) => {
  try {
    const userData = req.body;
    
    // Normalizar el rol
    userData.rol = userData.rol
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();

    if (!['admin', 'usuario'].includes(userData.rol)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const nuevoUsuario = await usuarioModel.registerUsuario(userData);
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario
      }
    });
  } catch (error) {
    console.error('Error en registro administrativo:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};