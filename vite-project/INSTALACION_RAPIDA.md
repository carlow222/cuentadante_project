# 🚀 Instalación Rápida - Sistema de Gestión de Bienes con Números de Serie

## 📋 Requisitos Previos
- PostgreSQL instalado y ejecutándose
- pgAdmin (opcional, pero recomendado)
- Node.js (versión 16 o superior)

## 🗄️ Paso 1: Configurar Base de Datos

### Opción A: Usando pgAdmin (Recomendado)
1. Abre pgAdmin
2. Conecta a tu servidor PostgreSQL
3. Crea una nueva base de datos llamada `cuentadante_db`
4. Abre **Query Tool** en la base de datos creada
5. Copia y pega todo el contenido del archivo `database/database_completa.sql`
6. Ejecuta el script (botón ▶️ o F5)

### Opción B: Usando línea de comandos
```bash
# Crear la base de datos
createdb -U postgres cuentadante_db

# Ejecutar el script
psql -U postgres -d cuentadante_db -f database/database_completa.sql
```

## ⚙️ Paso 2: Configurar Conexión

Edita el archivo `server/.env` con tus credenciales:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cuentadante_db
DB_PASSWORD=tu_password_aqui
DB_PORT=5432
PORT=3000
```

## 🔧 Paso 3: Instalar Dependencias

```bash
# Instalar dependencias del servidor
cd server
npm install

# Volver al directorio raíz e instalar dependencias del frontend
cd ..
npm install
```

## 🧪 Paso 4: Probar Conexión

```bash
cd server
node test-connection.js
```

Deberías ver algo como:
```
✅ Conectado a PostgreSQL: cuentadante_db
📋 Tablas encontradas: [users, cereals, assets, assignments, requests]
✅ Todas las tablas requeridas están presentes
🌾 Cereales: 12
📋 Solicitudes: 6
✅ TODAS LAS PRUEBAS COMPLETADAS
🚀 El sistema está listo para usar
```

## 🚀 Paso 5: Ejecutar el Sistema

### Terminal 1 - Backend:
```bash
cd server
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## 🌐 Acceder al Sistema

- **Frontend**: http://localhost:5173
- **API Backend**: http://localhost:3000

## 🎯 Funcionalidades Disponibles

### 📦 Gestión de Bienes
- **URL**: Menú lateral → "Inventario"
- **Funciones**: Ver, crear, editar bienes con números de serie
- **Control**: Estado, ubicación, garantías, valores

### ➕ Solicitar Bienes
- **URL**: Menú lateral → "Nueva Solicitud"
- **Funciones**: Crear solicitudes de bienes para formación
- **Características**: Fechas de devolución, propósito educativo

### 📋 Aprobaciones
- **URL**: Menú lateral → "Solicitudes Pendientes"
- **Funciones**: Aprobar/rechazar solicitudes por roles
- **Automático**: Control de asignaciones y devoluciones

## 📊 Datos de Ejemplo Incluidos

### Bienes de Oficina y Formación (31 elementos con números de serie únicos):

**💻 COMPUTADORAS Y LAPTOPS:**
- HP Pavilion Desktop (S/N: 5CD2345ABC)
- Dell Inspiron (S/N: BXCVRT8)
- Lenovo ThinkPad E15 (S/N: PF3K8M2Y)
- HP Pavilion 15 (S/N: 5CD3456DEF)

**📺 TELEVISORES Y PANTALLAS:**
- Samsung 55" 4K (S/N: HU55AU7000FXZA)
- LG 43" Full HD (S/N: 43LM6300PUB)
- Monitor Samsung 24" (S/N: HCJN500123)
- Monitor Dell 22" (S/N: CN0H7TJK13)

**📽️ PROYECTORES:**
- Epson PowerLite S41+ (S/N: X9KL001234)
- BenQ MS535A (S/N: ETD185000123)

**🖨️ IMPRESORAS Y OFICINA:**
- HP LaserJet Pro M15w (S/N: VNC8J67890)
- Canon PIXMA G3110 (S/N: KCKM01234567)
- Xerox WorkCentre 3025 (S/N: BWR123456789)

**🪑 MOBILIARIO:**
- Mesas de reuniones (8 y 12 personas)
- Sillas ejecutivas y de capacitación
- Archivadores y estanterías metálicas

**📋 MATERIAL DIDÁCTICO:**
- Pizarras acrílicas (varios tamaños)
- Rotafolios con trípode
- Equipos de audio y video básicos

### Usuarios (5 roles):
- Juan Perez (Admin)
- Maria Gomez (Cuentadante)
- Carlos Lopez (Cuentadante)
- Ana Martinez (Gerente)
- Luis Rodriguez (Celador)

### Solicitudes de Ejemplo:
- 9 solicitudes de bienes específicos por número de serie
- Estados: Aprobadas, Pendientes, Rechazadas
- Contexto: Instructores solicitando equipos para clases y capacitaciones
- Flujo completo de aprobaciones por 4 roles diferentes

## 🔧 Solución de Problemas

### ❌ Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS
```

### ❌ Tablas no encontradas
- Ejecuta nuevamente el script `database_completa.sql` en pgAdmin
- Verifica que la base de datos `cuentadante_db` existe

### ❌ Puerto ocupado
```bash
# Cambiar puerto en server/.env
PORT=3001  # En lugar de 3000
```

### ❌ Dependencias faltantes
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# En el directorio server también
cd server
rm -rf node_modules package-lock.json
npm install
```

## 📱 Navegación del Sistema

1. **Selector de Rol**: Esquina superior derecha
2. **Menú Principal**: Barra lateral izquierda
3. **Cereales**: Sección específica con icono 🌾
4. **Bienes**: Sección tradicional (compatibilidad)

## 🎨 Características Visuales

- ✅ Estados de aprobación con iconos
- 🔴🟡🟢 Alertas de stock por colores
- 📊 Información detallada en tiempo real
- 🌾 Iconografía específica para cereales

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor en la terminal
2. Verifica la conexión con `node test-connection.js`
3. Confirma que pgAdmin muestre las tablas correctamente
4. Asegúrate de que ambos servidores (frontend y backend) estén ejecutándose

¡El sistema está listo para gestionar cereales de manera eficiente! 🌾✨