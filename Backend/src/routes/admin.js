import express from 'express';
import { verificarAdmin } from './middleware.js';
import { 
  registroAdministrativo, 
  crearJuego,
  crearDesarrollador,
  crearEditor 
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', verificarAdmin, registroAdministrativo);
router.post('/juego', verificarAdmin, crearJuego);
router.post('/desarrollador', verificarAdmin, crearDesarrollador);
router.post('/editor', verificarAdmin, crearEditor);

export default router;