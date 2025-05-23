import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No autorizado',
                redirectTo: '/login'
            });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
        };
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(401).json({ 
            message: 'Token inválido o expirado',
            redirectTo: '/login'
        });
    }
};