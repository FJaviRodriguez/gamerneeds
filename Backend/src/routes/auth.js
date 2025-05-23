import express from 'express';
import { login, registro } from '../controllers/usuarioController.js';

const router = express.Router();
router.post('/login', login);         
router.post('/register', registro);  

export default router;