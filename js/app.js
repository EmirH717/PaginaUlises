// Base de datos de productos (simulada con localStorage)
const productosBase = [
    {
        id: 1,
        nombre: "Camiseta Básica Negro",
        descripcion: "Camiseta de algodón 100% premium",
        precio: 29.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen1.jpg",
        categoria: "Camisetas"
    },
    {
        id: 2,
        nombre: "Jeans Clásico Azul",
        descripcion: "Jeans denim de alta calidad",
        precio: 79.99,
        tallas: ["28", "30", "32", "34", "36", "38"],
        imagen: "imagen2.jpg",
        categoria: "Pantalones"
    },
    {
        id: 3,
        nombre: "Sudadera Gris",
        descripcion: "Sudadera cómoda para el invierno",
        precio: 49.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen3.jpg",
        categoria: "Sudaderas"
    },
    {
        id: 4,
        nombre: "Vestido Negro Elegante",
        descripcion: "Vestido de noche con acabados finos",
        precio: 119.99,
        tallas: ["XS", "S", "M", "L", "XL"],
        imagen: "imagen4.jpg",
        categoria: "Vestidos"
    },
    {
        id: 5,
        nombre: "Chaqueta Denim",
        descripcion: "Chaqueta de denim vintage",
        precio: 89.99,
        tallas: ["XS", "S", "M", "L", "XL", "XXL"],
        imagen: "imagen5.jpg",
        categoria: "Chaquetas"
    },
    {
        id: 6,
        nombre: "Shorts Khaki",
        descripcion: "Shorts perfectos para verano",
        precio: 39.99,
        tallas: ["XS", "S", "M", "L", "XL"],
        imagen: "imagen6.jpg",
        categoria: "Shorts"
    }
];

// Inicializar productos en localStorage si no existen
function inicializarProductos() {
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify(productosBase));
    }
}

// Obtener productos desde localStorage
function obtenerProductos() {
    const productos = localStorage.getItem('productos');
    return productos ? JSON.parse(productos) : productosBase;
}

// Guardar productos en localStorage
function guardarProductos(productos) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Obtener usuario logueado
function obtenerUsuarioLogueado() {
    return localStorage.getItem('usuarioLogueado');
}

// Verificar si el usuario es administrador
function esAdministrador() {
    return obtenerUsuarioLogueado() === 'admin';
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    window.location.href = 'index.html';
}

// Actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const count = carrito.reduce((total, item) => total + item.cantidad, 0);
    const carritoCount = document.querySelector('.carrito-count');
    
    if (carritoCount) {
        if (count > 0) {
            carritoCount.textContent = count;
            carritoCount.style.display = 'flex';
        } else {
            carritoCount.style.display = 'none';
        }
    }
}

// Renderizar componentes del header según si hay usuario logueado
function renderizarHeader() {
    const usuarioLogueado = obtenerUsuarioLogueado();
    const userMenu = document.querySelector('.user-menu');
    
    if (!userMenu) return;
    
    userMenu.innerHTML = '';
    
    if (usuarioLogueado) {
        if (esAdministrador()) {
            userMenu.innerHTML = `
                <a href="admin/dashboard.html">Panel Admin</a>
                <button onclick="cerrarSesion()" style="background-color: var(--color-acento);">Cerrar Sesión</button>
            `;
        } else {
            userMenu.innerHTML = `
                <span>${usuarioLogueado}</span>
                <button onclick="cerrarSesion()" style="background-color: var(--color-acento);">Cerrar Sesión</button>
            `;
        }
    } else {
        userMenu.innerHTML = `
            <div class="carrito-icon">
                <a href="carrito.html">🛒 Carrito</a>
                <div class="carrito-count" style="display: none;">0</div>
            </div>
            <a href="admin/login.html">Administrador</a>
        `;
    }
    
    actualizarContadorCarrito();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarProductos();
    renderizarHeader();
    
    // Actualizar contador del carrito cada segundo
    setInterval(actualizarContadorCarrito, 1000);
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.createElement('div');
    notificacion.className = `mensaje-${tipo}`;
    notificacion.textContent = mensaje;
    
    const main = document.querySelector('main') || document.body;
    main.insertBefore(notificacion, main.firstChild);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}
