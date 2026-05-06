const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    numeroPedido: {
        type: String,
        unique: true,
        required: true
    },
    cliente: {
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        telefono: String,
        direccion: {
            type: String,
            required: true
        }
    },
    items: [
        {
            productoId: mongoose.Schema.Types.ObjectId,
            nombre: String,
            precio: Number,
            cantidad: Number,
            talla: String,
            subtotal: Number
        }
    ],
    total: {
        subtotal: Number,
        impuestos: Number,
        total: Number
    },
    estado: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
    },
    metodoPago: {
        type: String,
        required: true
    },
    numeroSeguimiento: String,
    notas: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
