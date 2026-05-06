# 🗄️ Integración MongoDB Atlas - FashionStyle

## Descripción

Se ha integrado una base de datos MongoDB Atlas con tu sistema FashionStyle. El backend con Node.js/Express está completamente configurado.

## 📋 Requisitos Previos

1. **Node.js** instalado (versión 14 o superior)
   - Descarga desde: https://nodejs.org/

2. **Cuenta MongoDB Atlas**
   - Registrate en: https://www.mongodb.com/cloud/atlas

3. **Git** (opcional pero recomendado)

## 🔧 Configuración de MongoDB Atlas

### Paso 1: Crear Cluster

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create Deployment"
4. Selecciona el plan gratuito (M0)
5. Elige la región más cercana a ti
6. Haz clic en "Create Cluster"

### Paso 2: Crear Usuario de Base de Datos

1. En Atlas, ve a "Database Access"
2. Haz clic en "Add New Database User"
3. Crea un usuario con:
   - Username: `fashionstyle`
   - Password: `FashionStyle2024` (o tu contraseña)
   - Choose a password: Selecciona esta opción
4. Haz clic en "Add User"

### Paso 3: Configurar IP Whitelist

1. Ve a "Network Access"
2. Haz clic en "Add IP Address"
3. Selecciona "Allow access from anywhere" (para desarrollo)
   - En producción, usa IPs específicas
4. Haz clic en "Confirm"

### Paso 4: Obtener Connection String

1. Ve a "Databases"
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Drivers"
4. Copia la connection string
5. Reemplaza:
   - `<username>` con el usuario (ej: fashionstyle)
   - `<password>` con la contraseña
   - `<cluster-name>` en la URL

## 🚀 Instalación Local

### Paso 1: Navegar al directorio del proyecto

```bash
cd path/to/PaginaUlises2
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Actualiza la `MONGODB_URI` con tu connection string de Atlas

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/fashionstyle
PORT=5000
JWT_SECRET=tu_clave_secreta
```

### Paso 4: Iniciar el servidor

**Opción A: Modo producción**
```bash
npm start
```

**Opción B: Modo desarrollo (con auto-reload)**
```bash
npm run dev
```

Si ves esto, ¡el servidor está funcionando! ✅

```
✅ Conectado a MongoDB Atlas
🚀 Servidor FashionStyle ejecutándose en puerto 5000
```

## 📡 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar nuevo admin
- `GET /api/auth/verificar` - Verificar token

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener un producto
- `POST /api/productos` - Crear producto (requiere auth)
- `PUT /api/productos/:id` - Actualizar producto (requiere auth)
- `DELETE /api/productos/:id` - Eliminar producto (requiere auth)

### Contactos
- `POST /api/contactos` - Crear mensaje de contacto
- `GET /api/contactos` - Obtener mensajes (requiere auth)
- `GET /api/contactos/:id` - Obtener un mensaje (requiere auth)
- `PUT /api/contactos/:id` - Actualizar mensaje (requiere auth)
- `DELETE /api/contactos/:id` - Eliminar mensaje (requiere auth)

## 🧪 Probar con Postman o cURL

### Test de conexión:
```bash
curl http://localhost:5000/api/health
```

### Crear un producto:
```bash
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "nombre": "Producto Test",
    "descripcion": "Descripción",
    "precio": 29.99,
    "categoria": "Camisetas",
    "tallas": ["S", "M", "L"]
  }'
```

### Enviar contacto:
```bash
curl -X POST http://localhost:5000/api/contactos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "email": "juan@example.com",
    "asunto": "consulta",
    "mensaje": "Tengo una pregunta sobre el producto..."
  }'
```

## 📊 Estructura de la Base de Datos

### Colecciones Creadas:

**Productos**
```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: String,
  tallas: [String],
  imagen: String,
  stock: Number,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Contactos**
```javascript
{
  nombre: String,
  email: String,
  telefono: String,
  asunto: String,
  mensaje: String,
  estado: String,
  respuesta: String,
  respondidoEn: Date,
  createdAt: Date
}
```

**Usuarios**
```javascript
{
  nombre: String,
  email: String,
  contraseña: String (hasheada),
  rol: String,
  activo: Boolean,
  ultimoLogin: Date,
  createdAt: Date
}
```

**Pedidos**
```javascript
{
  numeroPedido: String,
  cliente: {
    nombre: String,
    email: String,
    direccion: String
  },
  items: [{
    productoId: ObjectId,
    nombre: String,
    precio: Number,
    cantidad: Number
  }],
  total: {
    subtotal: Number,
    impuestos: Number,
    total: Number
  },
  estado: String,
  createdAt: Date
}
```

## 🔐 Seguridad

1. **JWT Token**: Todos los endpoints protegidos usan JWT
2. **Contraseñas**: Se hashean con bcryptjs
3. **Validación**: Todos los inputs se validan con express-validator
4. **CORS**: Configurado para tu dominio

## 🐛 Solución de Problemas

### Error: "Cannot find module 'mongoose'"
```bash
npm install
```

### Error: "MONGODB_URI is not defined"
- Verifica que el archivo `.env` exista en la raíz
- Revisa que la variable `MONGODB_URI` esté presente

### Error: "Connection refused"
- Verifica que Atlas esté disponible
- Confirma que el IP whitelist incluya tu IP
- Prueba la connection string directamente

### Error: "Authentication failed"
- Verifica el usuario y contraseña en Atlas
- Asegúrate de usar caracteres especiales escapados en la URL
- Ejemplo: si la contraseña es `Pass@word`, en la URL debe ser `Pass%40word`

## 📚 Documentación Útil

- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Express.js](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)

## 🚀 Próximos Pasos

1. **Frontend API Integration**: Actualiza los archivos JavaScript para usar los endpoints
2. **Autenticación en Frontend**: Implementa login y manejo de tokens
3. **Deployment**: Despliega el backend a Heroku, Railway o similar
4. **Base de Datos**: Migra datos existentes de localStorage a MongoDB

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del servidor para errores
2. Verifica la conexión a MongoDB Atlas
3. Consulta la documentación de MongoDB
4. Revisa los logs del navegador (F12)

---

**Versión:** 1.0  
**Última actualización:** Mayo 2026  
**Estado:** Integración completa de MongoDB Atlas
