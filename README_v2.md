# 🛍️ FashionStyle - Sistema Web de Tienda de Ropa (Con MongoDB Atlas)

## 📋 Descripción General

FashionStyle es un sistema web completo de tienda de ropa online con:
- ✅ Frontend interactivo (HTML, CSS, JavaScript)
- ✅ Backend con Node.js/Express
- ✅ Base de datos MongoDB Atlas
- ✅ Autenticación con JWT
- ✅ CRUD completo de productos
- ✅ Sistema de contactos
- ✅ Panel de administración

## 📁 Estructura del Proyecto

```
PaginaUlises2/
├── package.json                      # Dependencias de Node.js
├── .env                              # Variables de entorno (MongoDB, JWT, etc)
├── .env.example                      # Plantilla de variables
├── INICIO_RAPIDO.md                  # Guía de instalación
├── MONGODB_SETUP.md                  # Configuración detallada de Atlas
├── README.md                         # Este archivo
│
├── server/                           # Backend
│   ├── server.js                     # Servidor principal
│   ├── models/                       # Modelos Mongoose
│   │   ├── Producto.js
│   │   ├── Contacto.js
│   │   ├── Pedido.js
│   │   └── Usuario.js
│   ├── routes/                       # Rutas de API
│   │   ├── productos.js
│   │   ├── contactos.js
│   │   └── autenticacion.js
│   └── middleware/                   # Middleware
│       └── autenticacion.js
│
├── scripts/                          # Scripts de utilidad
│   └── inicializar-bd.js             # Inicializar BD con datos
│
├── Frontend/                         # Archivos públicos
│   ├── index.html                    # Página principal
│   ├── productos.html
│   ├── carrito.html
│   ├── contacto.html
│   ├── acerca-de-nosotros.html
│   │
│   ├── admin/
│   │   ├── login.html                # Login del admin
│   │   └── dashboard.html            # Panel administrativo
│   │
│   ├── css/
│   │   └── estilos.css               # Estilos responsivos
│   │
│   ├── js/
│   │   ├── app.js                    # Funcionalidad general
│   │   ├── carrito.js                # Lógica del carrito
│   │   ├── admin.js                  # Panel de admin
│   │   └── api-client.js             # Cliente para API (NUEVO)
│   │
│   └── imagenes/                     # Imágenes de productos
│
└── GUIA_RAPIDA.html                  # Guía interactiva
```

## 🚀 Instalación Rápida

### 1. Requisitos
- Node.js 14+ ([descargar](https://nodejs.org/))
- MongoDB Atlas (cuenta gratuita en [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas))

### 2. Clonar/Descargar el proyecto

```bash
cd "tu_ruta\PaginaUlises2"
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar MongoDB Atlas

Lee [MONGODB_SETUP.md](MONGODB_SETUP.md) para:
- Crear cluster
- Crear usuario de BD
- Obtener connection string
- Configurar `.env`

### 5. Inicializar base de datos

```bash
node scripts/inicializar-bd.js
```

### 6. Iniciar el servidor

```bash
npm start
```

Deberías ver:
```
✅ Conectado a MongoDB Atlas
🚀 Servidor ejecutándose en puerto 5000
```

### 7. Abrir la tienda

Abre en navegador: `http://localhost:3000/index.html`

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login              Iniciar sesión
POST   /api/auth/registro           Registrar admin
GET    /api/auth/verificar          Verificar token
```

### Productos
```
GET    /api/productos               Obtener todos
GET    /api/productos/:id           Obtener uno
POST   /api/productos               Crear (requiere auth)
PUT    /api/productos/:id           Actualizar (requiere auth)
DELETE /api/productos/:id           Eliminar (requiere auth)
```

### Contactos
```
POST   /api/contactos               Crear mensaje
GET    /api/contactos               Listar (requiere auth)
PUT    /api/contactos/:id           Actualizar (requiere auth)
DELETE /api/contactos/:id           Eliminar (requiere auth)
```

## 🔐 Credenciales por Defecto

Después de inicializar la BD:
- **Email**: admin@fashionstyle.com
- **Contraseña**: 1234

⚠️ Cambia estos valores en producción

## 💾 Modelos de Base de Datos

### Producto
```json
{
  "nombre": "string",
  "descripcion": "string",
  "precio": "number",
  "categoria": "string",
  "tallas": ["string"],
  "imagen": "string",
  "stock": "number",
  "activo": "boolean"
}
```

### Usuario
```json
{
  "nombre": "string",
  "email": "string",
  "contraseña": "string (hasheada)",
  "rol": "admin | editor",
  "activo": "boolean"
}
```

### Contacto
```json
{
  "nombre": "string",
  "email": "string",
  "telefono": "string",
  "asunto": "string",
  "mensaje": "string",
  "estado": "no-leido | leido | respondido"
}
```

## 🛠️ Características Principales

### Para Clientes
- ✅ Explorar productos por categoría
- ✅ Carrito de compras persistente
- ✅ Formulario de contacto
- ✅ Interfaz responsiva
- ✅ Sistema de tallas

### Para Administradores
- ✅ CRUD de productos
- ✅ Gestión de contactos
- ✅ Ver estadísticas
- ✅ Responder mensajes
- ✅ Autenticación segura

## 🌐 Deployment

### Opciones recomendadas:
1. **Heroku** - Ideal para pequeños proyectos
2. **Railway.app** - Simple y rápido
3. **Render.com** - Alternativa a Heroku
4. **AWS/Google Cloud** - Escalabilidad

## 📚 Documentación Adicional

- [MONGODB_SETUP.md](MONGODB_SETUP.md) - Configuración de MongoDB Atlas
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guía de instalación
- [GUIA_RAPIDA.html](GUIA_RAPIDA.html) - Guía interactiva

## 🐛 Troubleshooting

### Error: Cannot find module
```bash
npm install
```

### MongoDB no conecta
- Verifica connection string en `.env`
- Confirma whitelist en Atlas
- Prueba con usuario/contraseña correctos

### Puerto 5000 en uso
Cambia en `.env`: `PORT=5001`

### Frontend no se conecta a API
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador (F12)
- Verifica CORS en `server.js`

## 🚀 Próximos Pasos

1. **Integración de Pagos**: Stripe/PayPal
2. **Autenticación Cliente**: Permitir registro de usuarios
3. **Comentarios/Reviews**: Sistema de calificaciones
4. **Email**: Notificaciones automáticas
5. **Búsqueda Avanzada**: Filtros mejorados
6. **Carrito Persistente**: Guardar en BD

## 📞 Soporte

Para ayuda:
1. Revisa los logs del servidor
2. Consulta la documentación de MongoDB
3. Abre la consola del navegador (F12)
4. Verifica que todos los archivos estén presentes

## 📝 Licencia

Proyecto educativo - Libre para usar y modificar

## 🎉 ¡Listo!

Tu tienda online completa está lista. ¡A disfrutar! 🛍️

---

**Versión**: 2.0 (Con MongoDB Atlas)  
**Última actualización**: Mayo 2026  
**Status**: ✅ Producción lista
