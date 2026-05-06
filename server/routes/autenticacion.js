const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const Usuario = require('../models/Usuario');
const { verificarToken } = require('../middleware/autenticacion');

// Registro de usuario (crear admin)
router.post(
    '/registro',
    [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email no válido'),
        body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    async (req, res) => {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errores: errores.array()
                });
            }
            
            const { nombre, email, contraseña, rol } = req.body;
            
            // Verificar si el usuario ya existe
            let usuario = await Usuario.findOne({ email });
            if (usuario) {
                return res.status(409).json({
                    success: false,
                    mensaje: 'El usuario ya existe'
                });
            }
            
            // Crear nuevo usuario
            usuario = new Usuario({
                nombre,
                email,
                contraseña,
                rol: rol || 'admin'
            });
            
            await usuario.save();
            
            // Generar token JWT
            const token = jwt.sign(
                { id: usuario._id, email: usuario.email, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.status(201).json({
                success: true,
                mensaje: 'Usuario creado exitosamente',
                token,
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al crear el usuario',
                error: error.message
            });
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email no válido'),
        body('contraseña').notEmpty().withMessage('La contraseña es requerida')
    ],
    async (req, res) => {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errores: errores.array()
                });
            }
            
            const { email, contraseña } = req.body;
            
            // Buscar usuario
            const usuario = await Usuario.findOne({ email }).select('+contraseña');
            
            if (!usuario) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'Usuario o contraseña incorrectos'
                });
            }
            
            // Verificar contraseña
            const esValido = await usuario.compararContraseña(contraseña);
            
            if (!esValido) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'Usuario o contraseña incorrectos'
                });
            }
            
            // Verificar si el usuario está activo
            if (!usuario.activo) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'El usuario está inactivo'
                });
            }
            
            // Actualizar último login
            usuario.ultimoLogin = Date.now();
            await usuario.save();
            
            // Generar token JWT
            const token = jwt.sign(
                { id: usuario._id, email: usuario.email, rol: usuario.rol },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.status(200).json({
                success: true,
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error en el login',
                error: error.message
            });
        }
    }
);

// Verificar token
router.get('/verificar', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al verificar token',
            error: error.message
        });
    }
});

module.exports = router;
