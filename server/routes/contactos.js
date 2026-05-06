const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const Contacto = require('../models/Contacto');
const { verificarToken, verificarAdmin } = require('../middleware/autenticacion');

// Crear un nuevo mensaje de contacto
router.post(
    '/',
    [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email no válido'),
        body('asunto').isIn(['consulta', 'pedido', 'devolucion', 'quejas', 'colaboracion']).withMessage('Asunto no válido'),
        body('mensaje').trim().notEmpty().isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
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
            
            const { nombre, email, telefono, asunto, mensaje } = req.body;
            
            const nuevoContacto = new Contacto({
                nombre,
                email,
                telefono,
                asunto,
                mensaje
            });
            
            await nuevoContacto.save();
            
            res.status(201).json({
                success: true,
                mensaje: 'Mensaje enviado exitosamente',
                contacto: nuevoContacto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al enviar el mensaje',
                error: error.message
            });
        }
    }
);

// Obtener todos los mensajes (solo admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.query;
        let filtro = {};
        
        if (estado) {
            filtro.estado = estado;
        }
        
        const contactos = await Contacto.find(filtro).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            cantidad: contactos.length,
            contactos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener mensajes',
            error: error.message
        });
    }
});

// Obtener un mensaje por ID (solo admin)
router.get('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const contacto = await Contacto.findById(req.params.id);
        
        if (!contacto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Mensaje no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            contacto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el mensaje',
            error: error.message
        });
    }
});

// Actualizar mensaje (solo admin)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { estado, respuesta } = req.body;
        
        let contacto = await Contacto.findById(req.params.id);
        
        if (!contacto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Mensaje no encontrado'
            });
        }
        
        if (estado) {
            contacto.estado = estado;
        }
        
        if (respuesta) {
            contacto.respuesta = respuesta;
            contacto.respondidoEn = Date.now();
            contacto.estado = 'respondido';
        }
        
        await contacto.save();
        
        res.status(200).json({
            success: true,
            mensaje: 'Mensaje actualizado exitosamente',
            contacto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar el mensaje',
            error: error.message
        });
    }
});

// Eliminar un mensaje (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const contacto = await Contacto.findByIdAndDelete(req.params.id);
        
        if (!contacto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Mensaje no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            mensaje: 'Mensaje eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el mensaje',
            error: error.message
        });
    }
});

module.exports = router;
