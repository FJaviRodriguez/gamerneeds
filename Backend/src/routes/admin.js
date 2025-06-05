import express from 'express';
import { verificarToken, verificarAdmin } from '../routes/middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  registroAdministrativo, 
  crearJuego,
  crearDesarrollador,
  crearEditor 
} from '../controllers/adminController.js';

const router = express.Router();

// Asegurar que el directorio existe
const uploadDir = path.join(process.cwd(), 'public/juegos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para juegos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `game-${uniqueSuffix}${ext}`);
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
}).single('url_portada'); // Especificamos el nombre del campo

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Error al subir el archivo: ' + err.message });
  } else if (err) {
    return res.status(500).json({ message: 'Error al procesar la imagen: ' + err.message });
  }
  next();
};

// Rutas administrativas
router.post('/register', [verificarToken, verificarAdmin], registroAdministrativo);
router.post('/juego', [
  verificarToken, 
  verificarAdmin,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  }
], crearJuego);
router.post('/desarrollador', [verificarToken, verificarAdmin], crearDesarrollador);
router.post('/editor', [verificarToken, verificarAdmin], crearEditor);

export default router;