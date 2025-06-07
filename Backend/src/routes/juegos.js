import express from 'express';
import * as juegoController from '../controllers/juegoController.js';

const router = express.Router();

router.get('/', juegoController.mostrarJuegos);
router.get('/buscar', juegoController.buscarJuegos);
router.get('/filtrar', juegoController.filtrarGenero);
router.get('/filtrar-precio', juegoController.filtrarPrecio);
router.get('/:idjuego', juegoController.mostrarJuegoPorId);

export default router;