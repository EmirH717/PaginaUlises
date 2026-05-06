const mongoose = require('mongoose');
require('dotenv').config();

const Producto = require('../server/models/Producto');
const Usuario = require('../server/models/Usuario');

const productosEjemplo = [
    {
        nombre: "Camiseta Básica Negro",
        descripcion: "Camiseta de algodón 100% premium",
        precio: 29.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen1.jpg",
        categoria: "Camisetas",
        stock: 100
    },
    {
        nombre: "Jeans Clásico Azul",
        descripcion: "Jeans denim de alta calidad",
        precio: 79.99,
        tallas: ["28", "30", "32", "34", "36", "38"],
        imagen: "imagen2.jpg",
        categoria: "Pantalones",
        stock: 80
    },
    {
        nombre: "Sudadera Gris",
        descripcion: "Sudadera cómoda para el invierno",
        precio: 49.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen3.jpg",
        categoria: "Sudaderas",
        stock: 75
    },
    {
        nombre: "Vestido Negro Elegante",
        descripcion: "Vestido de noche con acabados finos",
        precio: 119.99,
        tallas: ["XS", "S", "M", "L", "XL"],
        imagen: "imagen4.jpg",
        categoria: "Vestidos",
        stock: 40
    },
    {
        nombre: "Chaqueta Denim",
        descripcion: "Chaqueta de denim vintage",
        precio: 89.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen5.jpg",
        categoria: "Chaquetas",
        stock: 60
    },
    {
        nombre: "Shorts Khaki",
        descripcion: "Shorts perfectos para verano",
        precio: 39.99,
        tallas: ["XS", "S", "M", "L", "XL"],
        imagen: "imagen6.jpg",
        categoria: "Shorts",
        stock: 90
    }
];

const inicializarBD = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Conectado a MongoDB Atlas');

        // Limpiar colecciones existentes
        await Producto.deleteMany({});
        await Usuario.deleteMany({});
        console.log('🧹 Colecciones limpiadas');

        // Insertar productos
        const productosInsertados = await Producto.insertMany(productosEjemplo);
        console.log(`✅ ${productosInsertados.length} productos insertados`);

        // Crear usuario admin
        const admin = new Usuario({
            nombre: "Administrador",
            email: "admin@fashionstyle.com",
            contraseña: "emir1234",
            rol: "admin"
        });
        await admin.save();
        console.log('✅ Usuario administrador creado');
        console.log('   Email: admin@fashionstyle.com');
        console.log('   Contraseña: 1234');

        console.log('\n✨ Base de datos inicializada exitosamente');
        console.log('Puedes iniciar el servidor con: npm start');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

inicializarBD();
