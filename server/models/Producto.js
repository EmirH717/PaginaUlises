const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida'],
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Camisetas', 'Pantalones', 'Sudaderas', 'Vestidos', 'Chaquetas', 'Shorts']
    },
    tallas: {
        type: [String],
        required: [true, 'Las tallas son requeridas'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Debe haber al menos una talla disponible'
        }
    },
    imagen: {
        type: String,
        default: 'imagen-default.jpg'
    },
    stock: {
        type: Number,
        default: 100,
        min: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productSchema);
