const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/autenticacion');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { categoria, activo } = req.query;
        let filtro = {};
        
        if (categoria) {
            filtro.categoria = categoria;
        }
        
        if (activo !== undefined) {
            filtro.activo = activo === 'true';
        } else {
            filtro.activo = true;
        }
        
        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            cantidad: productos.length,
            productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener productos',
            error: error.message
        });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Producto no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener el producto',
            error: error.message
        });
    }
});

// Crear un nuevo producto (solo admin)
router.post(
    '/',
    verificarToken,
    verificarAdmin,
    [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
        body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
        body('categoria').isIn(['Camisetas', 'Pantalones', 'Sudaderas', 'Vestidos', 'Chaquetas', 'Shorts']).withMessage('Categoría no válida'),
        body('tallas').isArray({ min: 1 }).withMessage('Debe proporcionar al menos una talla')
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
            
            const { nombre, descripcion, precio, categoria, tallas, imagen, stock } = req.body;
            
            const productoExistente = await Producto.findOne({ nombre });
            if (productoExistente) {
                return res.status(409).json({
                    success: false,
                    mensaje: 'Ya existe un producto con este nombre'
                });
            }
            
            const nuevoProducto = new Producto({
                nombre,
                descripcion,
                precio,
                categoria,
                tallas,
                imagen,
                stock
            });
            
            await nuevoProducto.save();
            
            res.status(201).json({
                success: true,
                mensaje: 'Producto creado exitosamente',
                producto: nuevoProducto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al crear el producto',
                error: error.message
            });
        }
    }
);

// Actualizar un producto (solo admin)
router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    async (req, res) => {
        try {
            const { nombre, descripcion, precio, categoria, tallas, imagen, stock, activo } = req.body;
            
            let producto = await Producto.findById(req.params.id);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Producto no encontrado'
                });
            }
            
            // Verificar si el nuevo nombre ya existe
            if (nombre && nombre !== producto.nombre) {
                const productoExistente = await Producto.findOne({ nombre });
                if (productoExistente) {
                    return res.status(409).json({
                        success: false,
                        mensaje: 'Ya existe un producto con este nombre'
                    });
                }
            }
            
            // Actualizar campos
            if (nombre) producto.nombre = nombre;
            if (descripcion) producto.descripcion = descripcion;
            if (precio !== undefined) producto.precio = precio;
            if (categoria) producto.categoria = categoria;
            if (tallas && tallas.length > 0) producto.tallas = tallas;
            if (imagen) producto.imagen = imagen;
            if (stock !== undefined) producto.stock = stock;
            if (activo !== undefined) producto.activo = activo;
            
            producto.updatedAt = Date.now();
            
            await producto.save();
            
            res.status(200).json({
                success: true,
                mensaje: 'Producto actualizado exitosamente',
                producto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al actualizar el producto',
                error: error.message
            });
        }
    }
);

// Eliminar un producto (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                mensaje: 'Producto no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            mensaje: 'Producto eliminado exitosamente',
            producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
});

module.exports = router;
