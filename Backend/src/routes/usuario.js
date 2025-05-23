import express from 'express';
import { verificarToken } from './middleware.js';
import { mostrarPerfil } from '../controllers/usuarioController.js';
import upload from '../config/multer.js';
import { actualizarAvatar } from '../models/usuarioModel.js';

const router = express.Router();

router.get('/perfil', verificarToken, mostrarPerfil);
router.post('/perfil/avatar', verificarToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }
    const avatarPath = `/public/avatars/${req.file.filename}`;
    await actualizarAvatar(req.user.userId, avatarPath);
    res.json({ 
      message: 'Avatar actualizado correctamente',
      avatarPath 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el avatar' });
  }
});

export default router;