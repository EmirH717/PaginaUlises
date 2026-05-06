const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/autenticacion');

const imagenesPath = path.join(__dirname, '..', '..', 'imagenes');
if (!fs.existsSync(imagenesPath)) {
    fs.mkdirSync(imagenesPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagenesPath),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExt = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (!allowedExt.test(file.originalname)) {
            return cb(new Error('Solo se permiten archivos de imagen'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadImagen = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return upload.single('imagen')(req, res, next);
    }
    next();
};

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
    uploadImagen,
    [
        body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').trim().notEmpty().withMessage('La descripción es requerida'),
        body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
        body('categoria').isIn(['Camisetas', 'Pantalones', 'Sudaderas', 'Vestidos', 'Chaquetas', 'Shorts']).withMessage('Categoría no válida'),
        body('tallas').custom((value) => {
            if (!value) return false;
            if (Array.isArray(value) && value.length > 0) return true;
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed) && parsed.length > 0;
                } catch {
                    return false;
                }
            }
            return false;
        }).withMessage('Debe proporcionar al menos una talla')
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
            
            let { nombre, descripcion, precio, categoria, tallas, imagen, stock } = req.body;
            if (typeof tallas === 'string') {
                try {
                    tallas = JSON.parse(tallas);
                } catch {
                    tallas = tallas.split(',').map(t => t.trim()).filter(Boolean);
                }
            }

            const imagenNombre = req.file ? req.file.filename : imagen;
            
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
                imagen: imagenNombre,
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
    uploadImagen,
    async (req, res) => {
        try {
            let { nombre, descripcion, precio, categoria, tallas, imagen, stock, activo } = req.body;
            
            if (typeof tallas === 'string') {
                try {
                    tallas = JSON.parse(tallas);
                } catch {
                    tallas = tallas.split(',').map(t => t.trim()).filter(Boolean);
                }
            }

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
            if (req.file) producto.imagen = req.file.filename;
            else if (imagen) producto.imagen = imagen;
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
