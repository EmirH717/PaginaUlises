// GESTIÓN DEL PANEL DE ADMINISTRADOR

// Verificar autenticación
function verificarAutenticacion() {
    if (!esAdministrador()) {
        window.location.href = 'login.html';
    }
}

// Renderizar tabla de productos
async function renderizarTablaProductos() {
    const tbody = document.querySelector('.tabla-productos tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 1.5rem;">Cargando productos...</td></tr>';

    const response = await api.obtenerProductos();
    if (!response.success) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color: red;">Error cargando productos: ${response.mensaje || 'Servicio no disponible'}</td></tr>`;
        return;
    }

    const productos = response.productos || [];
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 1.5rem;">No hay productos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    productos.forEach((producto) => {
        const fila = tbody.insertRow();
        fila.innerHTML = `
            <td>${producto._id}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.categoria}</td>
            <td>${(producto.tallas || []).join(', ')}</td>
            <td>
                <div class="tabla-acciones">
                    <button class="btn-editar" onclick="editarProducto('${producto._id}')">Editar</button>
                    <button class="btn-eliminar-admin" onclick="eliminarProductoAdmin('${producto._id}')">Eliminar</button>
                    <button class="btn-exportar" onclick="exportarImagenProducto('${producto._id}')">📤 Exportar</button>
                </div>
            </td>
        `;
    });
}
function mostrarFormularioAgregarProducto() {
    limpiarFormulario();
    document.getElementById('form-titulo').textContent = 'Agregar Nuevo Producto';
    document.getElementById('producto-id').value = '';
}

// Mostrar formulario para editar producto
async function editarProducto(productoId) {
    const response = await api.obtenerProducto(productoId);
    if (!response.success) {
        mostrarNotificacion('Error cargando producto', 'error');
        return;
    }
    
    const producto = response.producto;
    
    document.getElementById('producto-id').value = producto._id;
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-descripcion').value = producto.descripcion;
    document.getElementById('producto-precio').value = producto.precio;
    document.getElementById('producto-categoria').value = producto.categoria;
    document.getElementById('producto-tallas').value = producto.tallas.join(', ');
    document.getElementById('producto-imagen').value = '';
    
    document.getElementById('form-titulo').textContent = 'Editar Producto';
    
    // Mostrar formulario
    document.querySelectorAll('.admin-seccion').forEach(seccion => seccion.classList.remove('activa'));
    document.getElementById('seccion-agregar').classList.add('activa');
    
    // Scroll al formulario
    document.querySelector('.admin-seccion.activa').scrollTop = 0;
}

// Guardar producto
async function guardarProductoAdmin(e) {
    e.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('producto-nombre').value;
    const descripcion = document.getElementById('producto-descripcion').value;
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const categoria = document.getElementById('producto-categoria').value;
    const tallas = document.getElementById('producto-tallas').value.split(',').map(t => t.trim());
    const imagenFile = document.getElementById('producto-imagen').files[0];
    
    if (!nombre || !descripcion || !precio || !categoria || tallas.length === 0) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    const productoData = new FormData();
    productoData.append('nombre', nombre);
    productoData.append('descripcion', descripcion);
    productoData.append('precio', precio);
    productoData.append('categoria', categoria);
    productoData.append('tallas', JSON.stringify(tallas));
    productoData.append('activo', true);
    if (imagenFile) {
        productoData.append('imagen', imagenFile);
    }
    
    let response;
    if (id) {
        // Editar producto existente
        response = await api.actualizarProducto(id, productoData);
        if (response.success) {
            mostrarNotificacion('Producto actualizado correctamente', 'exito');
        } else {
            mostrarNotificacion(response.mensaje || 'Error actualizando producto', 'error');
            return;
        }
    } else {
        // Agregar nuevo producto
        response = await api.crearProducto(productoData);
        if (response.success) {
            mostrarNotificacion('Producto agregado correctamente', 'exito');
        } else {
            mostrarNotificacion(response.mensaje || 'Error creando producto', 'error');
            return;
        }
    }
    
    limpiarFormulario();
    await renderizarTablaProductos();
}

// Eliminar producto
async function eliminarProductoAdmin(productoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const response = await api.eliminarProducto(productoId);
        if (response.success) {
            mostrarNotificacion('Producto eliminado correctamente', 'exito');
            await renderizarTablaProductos();
        } else {
            mostrarNotificacion(response.mensaje || 'Error eliminando producto', 'error');
        }
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
    // Si ya está activo, no hacer nada
    const botonActual = event.target;
    if (botonActual.classList.contains('activo')) {
        return;
    }
    
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
    } else if (seccion === 'mensajes') {
        cargarMensajes();
    }
}

// Renderizar estadísticas
async function renderizarEstadisticas() {
    const contenedor = document.getElementById('seccion-estadisticas');
    if (!contenedor) return;

    const response = await api.obtenerProductos();
    const productos = response.success ? response.productos : [];
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

// Función para exportar imagen del producto
async function exportarImagenProducto(productoId) {
    try {
        const response = await api.obtenerProducto(productoId);
        if (!response.success) {
            mostrarNotificacion('Error obteniendo producto', 'error');
            return;
        }

        const producto = response.producto;
        const imagenUrl = `../imagenes/${producto.imagen}`;

        // Crear un enlace temporal para descargar la imagen
        const link = document.createElement('a');
        link.href = imagenUrl;
        link.download = `${producto.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${productoId.substring(0, 8)}.jpg`;
        link.target = '_blank';

        // Agregar al DOM temporalmente y hacer clic
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        mostrarNotificacion('Imagen exportada correctamente', 'success');
    } catch (error) {
        console.error('Error exportando imagen:', error);
        mostrarNotificacion('Error al exportar la imagen', 'error');
    }
}

// Inicializar panel de admin
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    
    // Renderizar tabla de productos al cargar
    if (document.querySelector('.tabla-productos')) {
        renderizarTablaProductos();
        
        // Establecer el primer botón como activo
        const primerBoton = document.querySelector('.admin-menu button');
        if (primerBoton) {
            primerBoton.classList.add('activo');
        }
    }
});
