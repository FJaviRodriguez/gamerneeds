import express from 'express';
import { verificarToken } from './middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';
import * as usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

// Configuración de multer para avatares
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public/avatars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
});

router.post('/perfil/avatar', verificarToken, upload.single('avatar'), async (req, res) => {
  try {
    // Añadir logs para depuración
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User info:', req.user);

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Extraer userId del token JWT decodificado
    const userId = req.user.userId; // Cambiado de req.user.id a req.user.userId

    // Obtener el avatar anterior
    const [result] = await pool.query('SELECT avatar FROM usuario WHERE idusuario = ?', [userId]);
    const oldAvatar = result[0]?.avatar;

    // Si existe un avatar anterior y no es el default, eliminarlo
    if (oldAvatar && !oldAvatar.includes('default-icon')) {
      const fullPath = path.join(process.cwd(), 'public', 'avatars', path.basename(oldAvatar));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    const avatarPath = `/public/avatars/${req.file.filename}`;
    
    // Actualizar en la base de datos
    await pool.query(
      'UPDATE usuario SET avatar = ? WHERE idusuario = ?',
      [avatarPath, userId]
    );

    res.json({ 
      message: 'Avatar actualizado correctamente',
      avatarPath 
    });
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el avatar',
      error: error.message 
    });
  }
});

export default router;