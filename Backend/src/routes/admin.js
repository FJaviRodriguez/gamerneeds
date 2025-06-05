import express from 'express';
import { verificarToken, verificarAdmin } from '../routes/middleware.js';
import multer from 'multer';
import path from 'path';
import { 
  registroAdministrativo, 
  crearJuego,
  crearDesarrollador,
  crearEditor 
} from '../controllers/adminController.js';

const router = express.Router();

// Configuración de multer para juegos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/juegos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'game-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
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

// Rutas administrativas
router.post('/register', [verificarToken, verificarAdmin], registroAdministrativo);
router.post('/juego', [verificarToken, verificarAdmin, upload.single('url_portada')], crearJuego);
router.post('/desarrollador', [verificarToken, verificarAdmin], crearDesarrollador);
router.post('/editor', [verificarToken, verificarAdmin], crearEditor);

export default router;