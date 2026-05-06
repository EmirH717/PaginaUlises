require('dotenv').config();

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Conexión a MongoDB Atlas
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

conectarDB();

// Rutas
app.use('/api/productos', require('./routes/productos'));
app.use('/api/contactos', require('./routes/contactos'));
app.use('/api/auth', require('./routes/autenticacion'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        mensaje: 'Servidor funcionando correctamente',
        timestamp: new Date()
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        mensaje: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const path = require('path');
const imagenesDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(imagenesDir)) {
    fs.mkdirSync(imagenesDir, { recursive: true });
}

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: 'Ruta no encontrada'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor FashionStyle ejecutándose en puerto ${PORT}`);
    console.log(`📝 URL local: http://localhost:${PORT}`);
    console.log(`\n📊 Endpoints disponibles:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/productos`);
    console.log(`   - POST /api/productos`);
    console.log(`   - PUT  /api/productos/:id`);
    console.log(`   - DELETE /api/productos/:id`);
    console.log(`   - GET  /api/contactos`);
    console.log(`   - POST /api/contactos`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - POST /api/auth/registro`);
    console.log(`\n`);
});

module.exports = app;