import express from 'express';
import { verificarAdmin } from './middleware.js';
import { registroAdministrativo } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', verificarAdmin, registroAdministrativo);

export default router;