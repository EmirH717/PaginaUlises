// GESTIÓN DEL CARRITO DE COMPRAS

// Obtener carrito desde localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Hacer la función disponible globalmente
window.obtenerCarrito = obtenerCarrito;

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(productoId, talla) {
    const productos = window.productosDisponibles || obtenerProductos();
    const idString = String(productoId);
    const producto = productos.find(p => String(p._id || p.id) === idString);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    if (!talla) {
        mostrarNotificacion('Por favor selecciona una talla', 'error');
        return;
    }
    
    let carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => String(item.id) === idString && item.talla === talla);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: idString,
            nombre: producto.nombre,
            precio: producto.precio,
            talla: talla,
            cantidad: 1,
            imagen: producto.imagen
        });
    }
    
    guardarCarrito(carrito);
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'exito');
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId, talla) {
    const idString = String(productoId);
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => !(String(item.id) === idString && item.talla === talla));
    guardarCarrito(carrito);
}

// Actualizar cantidad del producto en el carrito
function actualizarCantidad(productoId, talla, nuevaCantidad) {
    const idString = String(productoId);
    let carrito = obtenerCarrito();
    const item = carrito.find(item => String(item.id) === idString && item.talla === talla);
    
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId, talla);
        } else {
            item.cantidad = Number(nuevaCantidad);
            guardarCarrito(carrito);
        }
    }
}

// Calcular total del carrito
function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
}

// Renderizar grid de productos
function renderizarProductos() {
    const container = document.getElementById('productos-container');
    if (!container) return;
    
    const productos = obtenerProductos();
    container.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        let tallasHTML = '<select id="talla-' + producto.id + '">';
        tallasHTML += '<option value="">Selecciona una talla</option>';
        producto.tallas.forEach(talla => {
            tallasHTML += `<option value="${talla}">${talla}</option>`;
        });
        tallasHTML += '</select>';
        
        card.innerHTML = `
            <div class="producto-imagen">
                <img src="imagenes/${producto.imagen}" alt="${producto.nombre}" 
                     onerror="this.parentElement.textContent = '📷 ' + this.alt" />
            </div>
            <div class="producto-info">
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-descripcion">${producto.descripcion}</div>
                <div class="producto-precio">$${producto.precio.toFixed(2)}</div>
                <div class="producto-talla">
                    <label>Talla:</label>
                    ${tallasHTML}
                </div>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id}, document.getElementById('talla-${producto.id}').value)">
                    Agregar al carrito
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Renderizar carrito
function renderizarCarrito() {
    const container = document.getElementById('carrito-container');
    if (!container) return;
    
    const carrito = obtenerCarrito();
    const carritoItems = document.getElementById('carrito-items');
    const resumenCarrito = document.getElementById('resumen-carrito');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>¿Qué esperas? ¡Agrega algunos productos!</p>
                <a href="productos.html" class="btn-primario">Ir a Productos</a>
            </div>
        `;
        return;
    }
    
    let carritoHTML = '';
    carrito.forEach((item, index) => {
        carritoHTML += `
            <div class="carrito-item">
                <div class="carrito-item-imagen">
                    <img src="imagenes/${item.imagen}" alt="${item.nombre}" 
                         onerror="this.parentElement.textContent = '📷'" />
                </div>
                <div class="carrito-item-detalles">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-talla">Talla: ${item.talla}</div>
                    <div class="carrito-item-cantidad">
                        <label>Cantidad:</label>
                        <input type="number" value="${item.cantidad}" min="1" 
                               onchange="actualizarCantidad(${item.id}, '${item.talla}', this.value)">
                    </div>
                </div>
                <div class="carrito-item-precio">$${(item.precio * item.cantidad).toFixed(2)}</div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id}, '${item.talla}'); renderizarCarrito();">
                    Eliminar
                </button>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito();
    const subtotal = (total * 0.9).toFixed(2);
    const impuestos = (total * 0.1).toFixed(2);
    
    carritoItems.innerHTML = carritoHTML;
    resumenCarrito.innerHTML = `
        <div class="resumen-fila">
            <span>Subtotal:</span>
            <span>$${subtotal}</span>
        </div>
        <div class="resumen-fila">
            <span>Impuestos (10%):</span>
            <span>$${impuestos}</span>
        </div>
        <div class="resumen-fila resumen-total">
            <span>Total:</span>
            <span>$${total}</span>
        </div>
        <button class="btn-primario" style="width: 100%; margin-top: 1rem;" onclick="procederAlPago()">
            Proceder al Pago
        </button>
        <a href="productos.html" class="btn-secundario" style="width: 100%; margin-top: 0.5rem; text-align: center;">
            Seguir Comprando
        </a>
    `;
}

// Proceder al pago
function procederAlPago() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    
    const total = calcularTotalCarrito();
    
    // Simular pago
    if (confirm(`¿Confirmar compra por $${total}?`)) {
        // Simular procesamiento de pago
        mostrarNotificacion('Procesando pago...', 'exito');
        
        // Limpiar carrito después de 2 segundos
        setTimeout(() => {
            localStorage.removeItem('carrito');
            mostrarNotificacion('¡Compra realizada exitosamente!', 'exito');
            setTimeout(() => {
                renderizarCarrito();
            }, 1000);
        }, 2000);
    }
}
