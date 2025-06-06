import express from 'express';
import { verificarToken, verificarAdmin } from './middleware.js';
import * as adminController from '../controllers/adminController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public/juegos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `game-${uniqueSuffix}${ext}`);
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
}).single('url_portada');

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Error al subir el archivo: ' + err.message });
  } else if (err) {
    return res.status(500).json({ message: 'Error al procesar la imagen: ' + err.message });
  }
  next();
};

// Rutas ordenadas por método
router.get('/desarrolladores', verificarToken, adminController.mostrarDesarrolladores);
router.get('/editores', verificarToken, adminController.mostrarEditores);
router.get('/generos', verificarToken, adminController.mostrarGeneros);

router.post('/register', [verificarToken, verificarAdmin], adminController.registroAdministrativo);
router.post('/juego', [verificarToken, verificarAdmin], upload, handleMulterError, adminController.crearJuego);
router.post('/desarrollador', [verificarToken, verificarAdmin], adminController.crearDesarrollador);
router.post('/editor', [verificarToken, verificarAdmin], adminController.crearEditor);

// Corregir orden y middleware para PUT
router.put('/juego/:idjuego', [verificarToken, verificarAdmin], upload, handleMulterError, adminController.editarJuego);

// Corregir orden y middleware para DELETE
router.delete('/juego/:idjuego', [verificarToken, verificarAdmin], adminController.eliminarJuego);

export default router;