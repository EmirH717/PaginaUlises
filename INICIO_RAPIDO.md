# ⚡ INSTALACIÓN Y EJECUCIÓN - Backend MongoDB

## 🚀 Inicio Rápido

### Paso 1: Abrir Terminal/PowerShell

En Windows, abre PowerShell y navega a tu carpeta del proyecto:

```powershell
cd "d:\Ulises\PaginaUlises2"
```

### Paso 2: Instalar Node.js (si no lo tienes)

Si no tienes Node.js instalado:
1. Descarga desde https://nodejs.org/
2. Instala la versión LTS
3. Reinicia la terminal

Verifica que está instalado:
```powershell
node --version
npm --version
```

### Paso 3: Instalar Dependencias

```powershell
npm install
```

Esto descargará todas las librerías necesarias (~200MB).

### Paso 4: Configurar MongoDB Atlas

#### Opción A: Usar la configuración incluida (Recomendado para pruebas)
Ya viene preconfigurado con:
- Usuario: `fashionstyle`
- Contraseña: `FashionStyle2024`
- Base de datos: `fashionstyle`

⚠️ **IMPORTANTE**: Para producción, crea tu propia cuenta en Atlas.

#### Opción B: Usar tu propia cuenta (Recomendado para producción)

1. Crea cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster (plan gratuito está bien)
3. Crea un usuario en "Database Access"
4. Whitelist tu IP en "Network Access"
5. Copia la connection string
6. Abre `.env` y reemplaza `MONGODB_URI` con tu URL

### Paso 5: Iniciar el Servidor

```powershell
npm start
```

O con auto-reload (mejor para desarrollo):
```powershell
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB Atlas
🚀 Servidor FashionStyle ejecutándose en puerto 5000
```

## ✅ Verificar que Funciona

Abre en tu navegador:
```
http://localhost:5000/api/health
```

Deberías ver:
```json
{
  "success": true,
  "mensaje": "Servidor funcionando correctamente"
}
```

## 📚 Próximos Pasos

1. **Ver documentación completa**:
   - Lee [MONGODB_SETUP.md](MONGODB_SETUP.md)

2. **Actualizar Frontend**:
   - Incluye `js/api-client.js` en tus archivos HTML
   - Actualiza `js/app.js` para usar la API

3. **Probar Endpoints**:
   - Instala Postman: https://www.postman.com/downloads/
   - O usa cURL desde la terminal

## 🔧 Troubleshooting

### Error: "npm: The term 'npm' is not recognized"
- Node.js no está instalado o no está en el PATH
- Descarga desde https://nodejs.org/
- Reinicia la terminal después de instalar

### Error: "Cannot find module 'mongoose'"
```powershell
npm install
```

### Error: "MONGODB_URI is not defined"
- Verifica que exista el archivo `.env` en la raíz
- Reinicia el servidor después de crear/editar `.env`

### Puerto 5000 en uso
Si el puerto 5000 está ocupado:
```powershell
# En PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

Luego edita `.env` y cambia `PORT=5001`

### Conexión a MongoDB rechazada
- Verifica que tu IP esté en whitelist
- En Atlas: Network Access > Add IP Address
- Selecciona "Allow from Anywhere" (solo para desarrollo)

## 📱 Usar desde el Frontend

1. Abre `index.html` en navegador
2. El servidor está corriendo en `http://localhost:5000`
3. Los datos se guardarán en MongoDB Atlas

## 🌐 Endpoints Disponibles

```
GET    /api/health                 - Verificar servidor
POST   /api/auth/login             - Iniciar sesión
POST   /api/auth/registro          - Crear admin
GET    /api/productos              - Listar productos
POST   /api/productos              - Crear producto
PUT    /api/productos/:id          - Actualizar producto
DELETE /api/productos/:id          - Eliminar producto
POST   /api/contactos              - Enviar contacto
GET    /api/contactos              - Listar contactos (admin)
```

## 💾 Base de Datos

Tu base de datos está en:
https://www.mongodb.com/cloud/atlas

Puedes ver los datos en tiempo real desde el dashboard de Atlas.

## 🛑 Detener el Servidor

En PowerShell, presiona `Ctrl + C`

## 📖 Recursos

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

---

**¿Necesitas ayuda?**
- Revisa [MONGODB_SETUP.md](MONGODB_SETUP.md) para configuración avanzada
- Consulta los logs de la terminal para mensajes de error
- Abre la consola del navegador (F12) para ver errores de cliente

