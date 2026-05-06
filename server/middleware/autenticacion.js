const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                mensaje: 'No hay token, autorización denegada'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            mensaje: 'Token no válido'
        });
    }
};

const verificarAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            mensaje: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
};

module.exports = {
    verificarToken,
    verificarAdmin
};
