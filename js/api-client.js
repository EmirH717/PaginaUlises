// ============================================
// API CLIENT PARA FASHIONSTYLE
// ============================================

const API_URL = 'http://localhost:5000/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Establecer token JWT
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Obtener headers con autenticación
    getHeaders(incluirAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (incluirAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // ============ AUTENTICACIÓN ============

    async login(email, contraseña) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, contraseña })
            });

            const data = await response.json();

            if (data.success) {
                this.setToken(data.token);
            }

            return data;
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async registro(nombre, email, contraseña) {
        try {
            const response = await fetch(`${API_URL}/auth/registro`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ nombre, email, contraseña })
            });

            const data = await response.json();

            if (data.success) {
                this.setToken(data.token);
            }

            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async verificarToken() {
        if (!this.token) {
            return { success: false, mensaje: 'No hay token' };
        }

        try {
            const response = await fetch(`${API_URL}/auth/verificar`, {
                method: 'GET',
                headers: this.getHeaders(true)
            });

            return await response.json();
        } catch (error) {
            console.error('Error verificando token:', error);
            return { success: false, mensaje: error.message };
        }
    }

    // ============ PRODUCTOS ============

    async obtenerProductos(categoria = null) {
        try {
            let url = `${API_URL}/productos`;
            if (categoria) {
                url += `?categoria=${categoria}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(false)
            });

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async obtenerProducto(id) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'GET',
                headers: this.getHeaders(false)
            });

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo producto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async crearProducto(producto) {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(producto)
            });

            return await response.json();
        } catch (error) {
            console.error('Error creando producto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async actualizarProducto(id, producto) {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(producto)
            });

            return await response.json();
        } catch (error) {
            console.error('Error actualizando producto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async eliminarProducto(id) {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(true)
            });

            return await response.json();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    // ============ CONTACTOS ============

    async crearContacto(contacto) {
        try {
            const response = await fetch(`${API_URL}/contactos`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify(contacto)
            });

            return await response.json();
        } catch (error) {
            console.error('Error creando contacto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async obtenerContactos() {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/contactos`, {
                method: 'GET',
                headers: this.getHeaders(true)
            });

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo contactos:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async actualizarContacto(id, contacto) {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/contactos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(contacto)
            });

            return await response.json();
        } catch (error) {
            console.error('Error actualizando contacto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    async eliminarContacto(id) {
        if (!this.token) {
            return { success: false, mensaje: 'Autenticación requerida' };
        }

        try {
            const response = await fetch(`${API_URL}/contactos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(true)
            });

            return await response.json();
        } catch (error) {
            console.error('Error eliminando contacto:', error);
            return { success: false, mensaje: error.message };
        }
    }

    // ============ UTILIDADES ============

    cerrarSesion() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogueado');
    }
}

// Crear instancia global del cliente
const api = new APIClient();
