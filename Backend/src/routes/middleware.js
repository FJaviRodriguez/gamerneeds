import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const verificarToken = async (req, res, next) => {
  try {
    console.log('Verificando token...');
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No se encontró header de autorización');
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Token no encontrado en el header');
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    console.log('Token encontrado:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const verificarAdmin = async (req, res, next) => {
  try {
    console.log('Verificando rol de administrador...');
    console.log('Usuario:', req.user);
    
    if (!req.user || req.user.rol !== 'admin') {
      console.log('Usuario no es administrador');
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    console.log('Usuario verificado como administrador');
    next();
  } catch (error) {
    console.error('Error en verificación de admin:', error);
    return res.status(403).json({ message: 'Error en verificación de permisos' });
  }
};