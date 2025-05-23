import express from 'express';
import { verificarToken } from './middleware.js';
import * as bibliotecaController from '../controllers/bibliotecaController.js';

const router = express.Router();

router.get('/', verificarToken, bibliotecaController.mostrarBiblioteca);
router.post('/agregar', verificarToken, bibliotecaController.aniadirJuegos);

export default router;