import jwt from 'jsonwebtoken';

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No se proporcionó token de autenticación' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { 
            id: decoded.userId,
            email: decoded.email
        };
        next();
    } catch (error) {
        console.error('Error en verificarToken:', error);
        return res.status(401).json({ 
            message: 'Token inválido o expirado' 
        });
    }
};