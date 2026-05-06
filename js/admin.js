// GESTIÓN DEL PANEL DE ADMINISTRADOR

// Verificar autenticación
function verificarAutenticacion() {
    if (!esAdministrador()) {
        window.location.href = 'login.html';
    }
}

// Renderizar tabla de productos
function renderizarTablaProductos() {
    const tbody = document.querySelector('#tabla-productos tbody');
    if (!tbody) return;
    
    const productos = obtenerProductos();
    tbody.innerHTML = '';
    
    productos.forEach((producto, index) => {
        const fila = tbody.insertRow();
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.categoria}</td>
            <td>${producto.tallas.join(', ')}</td>
            <td>
                <div class="tabla-acciones">
                    <button class="btn-editar" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn-eliminar-admin" onclick="eliminarProductoAdmin(${producto.id})">Eliminar</button>
                </div>
            </td>
        `;
    });
}

// Mostrar formulario para agregar producto
function mostrarFormularioAgregarProducto() {
    limpiarFormulario();
    document.getElementById('form-titulo').textContent = 'Agregar Nuevo Producto';
    document.getElementById('producto-id').value = '';
}

// Mostrar formulario para editar producto
function editarProducto(productoId) {
    const productos = obtenerProductos();
    const producto = productos.find(p => p.id === productoId);
    
    if (producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-descripcion').value = producto.descripcion;
        document.getElementById('producto-precio').value = producto.precio;
        document.getElementById('producto-categoria').value = producto.categoria;
        document.getElementById('producto-tallas').value = producto.tallas.join(', ');
        document.getElementById('producto-imagen').value = producto.imagen;
        
        document.getElementById('form-titulo').textContent = 'Editar Producto';
        
        // Scroll al formulario
        document.querySelector('.admin-seccion.activa').scrollTop = 0;
    }
}

// Guardar producto
function guardarProductoAdmin(e) {
    e.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('producto-nombre').value;
    const descripcion = document.getElementById('producto-descripcion').value;
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const categoria = document.getElementById('producto-categoria').value;
    const tallas = document.getElementById('producto-tallas').value.split(',').map(t => t.trim());
    const imagen = document.getElementById('producto-imagen').value;
    
    if (!nombre || !descripcion || !precio || !categoria || tallas.length === 0) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    let productos = obtenerProductos();
    
    if (id) {
        // Editar producto existente
        const indice = productos.findIndex(p => p.id == id);
        if (indice !== -1) {
            productos[indice] = {
                id: parseInt(id),
                nombre,
                descripcion,
                precio,
                categoria,
                tallas,
                imagen: imagen || `imagen${indice + 1}.jpg`
            };
            mostrarNotificacion('Producto actualizado correctamente', 'exito');
        }
    } else {
        // Agregar nuevo producto
        const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
        productos.push({
            id: nuevoId,
            nombre,
            descripcion,
            precio,
            categoria,
            tallas,
            imagen: imagen || `imagen${productos.length + 1}.jpg`
        });
        mostrarNotificacion('Producto agregado correctamente', 'exito');
    }
    
    guardarProductos(productos);
    limpiarFormulario();
    renderizarTablaProductos();
}

// Eliminar producto
function eliminarProductoAdmin(productoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        let productos = obtenerProductos();
        productos = productos.filter(p => p.id !== productoId);
        guardarProductos(productos);
        mostrarNotificacion('Producto eliminado correctamente', 'exito');
        renderizarTablaProductos();
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formulario-producto').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('form-titulo').textContent = 'Agregar Nuevo Producto';
}

// Cambiar sección del admin
function cambiarSeccionAdmin(seccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.admin-seccion');
    secciones.forEach(s => s.classList.remove('activa'));
    
    // Desactivar todos los botones
    const botones = document.querySelectorAll('.admin-menu button');
    botones.forEach(b => b.classList.remove('activo'));
    
    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(`seccion-${seccion}`);
    if (seccionActiva) {
        seccionActiva.classList.add('activa');
    }
    
    // Activar el botón correspondiente
    event.target.classList.add('activo');
    
    // Renderizar contenido si es necesario
    if (seccion === 'productos') {
        renderizarTablaProductos();
    } else if (seccion === 'estadisticas') {
        renderizarEstadisticas();
    }
}

// Renderizar estadísticas
function renderizarEstadisticas() {
    const contenedor = document.getElementById('seccion-estadisticas');
    if (!contenedor) return;
    
    const productos = obtenerProductos();
    const carrito = obtenerCarrito();
    
    const totalProductos = productos.length;
    const totalCarritos = carrito.length;
    const valorCarritos = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    contenedor.innerHTML = `
        <h2>Estadísticas de la Tienda</h2>
        <div class="productos-grid" style="margin-top: 2rem;">
            <div class="container">
                <h3>Total de Productos</h3>
                <p style="font-size: 2rem; color: var(--color-primario); font-weight: bold;">${totalProductos}</p>
            </div>
            <div class="container">
                <h3>Artículos en Carrito</h3>
                <p style="font-size: 2rem; color: var(--color-primario); font-weight: bold;">${totalCarritos}</p>
            </div>
            <div class="container">
                <h3>Valor de Carritos Activos</h3>
                <p style="font-size: 2rem; color: var(--color-acento); font-weight: bold;">$${valorCarritos.toFixed(2)}</p>
            </div>
        </div>
    `;
}

// Inicializar panel de admin
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    
    // Renderizar tabla de productos al cargar
    if (document.getElementById('tabla-productos')) {
        renderizarTablaProductos();
        
        // Establecer el primer botón como activo
        const primerBoton = document.querySelector('.admin-menu button');
        if (primerBoton) {
            primerBoton.classList.add('activo');
        }
    }
});
