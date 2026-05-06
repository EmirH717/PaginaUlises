const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor proporciona un email válido'
        ]
    },
    telefono: {
        type: String,
        trim: true
    },
    asunto: {
        type: String,
        required: [true, 'El asunto es requerido'],
        enum: ['consulta', 'pedido', 'devolucion', 'quejas', 'colaboracion']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es requerido'],
        maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres']
    },
    estado: {
        type: String,
        default: 'no-leido',
        enum: ['no-leido', 'leido', 'respondido']
    },
    respuesta: {
        type: String,
        default: null
    },
    respondidoEn: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Contacto', contactSchema);
