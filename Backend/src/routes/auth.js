import express from 'express';
import { login, registro } from '../controllers/usuarioController.js';
import { enviarEmailBienvenida } from '../services/mailjetService.js';

const router = express.Router();

router.post('/login', login);         
router.post('/register', registro);
router.post('/enviar-bienvenida', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        await enviarEmailBienvenida(nombre, email);
        res.json({ message: 'Email de bienvenida enviado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el email de bienvenida' });
    }
});

export default router;