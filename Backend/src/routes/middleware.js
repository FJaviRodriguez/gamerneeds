import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No se proporcionó token de autenticación' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Añadir logs para depuración
        console.log('Token decodificado:', decoded);
        
        req.user = decoded; // Asignar todo el objeto decodificado
        next();
    } catch (error) {
        console.error('Error en verificarToken:', error);
        return res.status(401).json({ 
            message: 'Token inválido o expirado',
            error: error.message
        });
    }
};

export const verificarAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const [rows] = await pool.query(
      'SELECT rol FROM usuario WHERE idusuario = ?', 
      [req.user.id]
    );

    if (!rows[0] || rows[0].rol !== 'admin') {
      return res.status(403).json({ 
        message: 'Acceso denegado - Se requieren permisos de administrador' 
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificarAdmin:', error);
    res.status(500).json({ message: 'Error al verificar permisos de administrador' });
  }
};