import express from 'express';
import * as generoController from '../controllers/generoController.js';

const router = express.Router();
router.get('/', generoController.mostrarGeneros);

export default router;