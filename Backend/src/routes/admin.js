import express from 'express';
import { verificarToken, verificarAdmin } from './middleware.js';
import { registroAdministrativo } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', verificarToken, verificarAdmin, registroAdministrativo);

export default router;