# 🏢 Sistema de Gestión de Bienes para Formación Profesional

## 📋 Descripción del Sistema

Sistema completo para la gestión de bienes e inventario en centros de formación profesional. Permite el control de equipos electrónicos, mobiliario y material didáctico mediante números de serie únicos y un flujo de aprobaciones por roles.

## 🎯 Características Principales

### **📦 Gestión de Bienes Únicos**
- Cada bien tiene un **número de serie único** y realista
- Control por categorías: Computadoras, Televisores, Proyectores, Mobiliario, etc.
- Estados: Disponible, Asignado, Mantenimiento
- Información completa: marca, modelo, ubicación, garantía, valores

### **📋 Sistema de Solicitudes**
- Solicitudes por bien específico (no por cantidad)
- Flujo de aprobación por 4 roles: Cuentadante → Gerente → Administrador → Celador
- Estados: Pendiente, Aprobado, Rechazado
- Fechas de devolución esperada y real

### **👥 Gestión por Roles**
- **Instructor**: Puede crear solicitudes
- **Cuentadante**: Gestiona inventario y aprueba solicitudes
- **Gerente**: Aprueba solicitudes de nivel medio
- **Administrador**: Aprueba solicitudes importantes
- **Celador**: Aprobación final para entrega física

## 🗄️ Instalación de la Base de Datos

### **Requisitos:**
- PostgreSQL 12 o superior
- pgAdmin (recomendado) o línea de comandos

### **Pasos de Instalación:**

1. **Crear Base de Datos**
   ```sql
   CREATE DATABASE cuentadante_db;
   ```

2. **Ejecutar Script Completo**
   - Abre pgAdmin
   - Conecta a tu servidor PostgreSQL
   - Selecciona la base de datos `cuentadante_db`
   - Abre Query Tool
   - Ejecuta el archivo completo: `database/database_completa.sql`

3. **Verificar Instalación**
   ```sql
   SELECT COUNT(*) FROM assets;  -- Debe mostrar 31 bienes
   SELECT COUNT(*) FROM users;   -- Debe mostrar 5 usuarios
   SELECT COUNT(*) FROM requests; -- Debe mostrar 9 solicitudes
   ```

## 📊 Datos de Ejemplo Incluidos

### **👥 Usuarios (5):**
- Juan Perez (Admin)
- Maria Gomez (Cuentadante)
- Carlos Lopez (Cuentadante)
- Ana Martinez (Gerente)
- Luis Rodriguez (Celador)

### **📦 Bienes por Categoría (31 total):**

**💻 Computadoras (4):**
- HP Pavilion Desktop (`S/N: 5CD2345ABC`)
- Dell Inspiron (`S/N: BXCVRT8`)
- Lenovo ThinkPad E15 (`S/N: PF3K8M2Y`)
- HP Pavilion 15 (`S/N: 5CD3456DEF`)

**📺 Televisores y Monitores (4):**
- Samsung 55" 4K (`S/N: HU55AU7000FXZA`)
- LG 43" Full HD (`S/N: 43LM6300PUB`)
- Monitor Samsung 24" (`S/N: HCJN500123`)
- Monitor Dell 22" (`S/N: CN0H7TJK13`)

**📽️ Proyectores (2):**
- Epson PowerLite S41+ (`S/N: X9KL001234`)
- BenQ MS535A (`S/N: ETD185000123`)

**🖨️ Impresoras (3):**
- HP LaserJet Pro M15w (`S/N: VNC8J67890`)
- Canon PIXMA G3110 (`S/N: KCKM01234567`)
- Xerox WorkCentre 3025 (`S/N: BWR123456789`)

**🪑 Mobiliario (10):**
- Mesas de reuniones, trabajo individual
- Sillas ejecutivas, de oficina, capacitación
- Archivadores, estanterías, lockers

**📋 Material Didáctico (3):**
- Pizarras acrílicas grandes y medianas
- Rotafolio con trípode

**🔊 Audio/Video (3):**
- Parlantes Logitech (`S/N: 097855123456`)
- Micrófono Shure (`S/N: SM58W789012`)
- Cámara Web Logitech (`S/N: 1946LOGI567`)

**🌐 Networking (2):**
- Router TP-Link AC1200 (`S/N: AC1200230130`)
- Switch Netgear GS308 (`S/N: GS308221110`)

## 🚀 Configuración del Proyecto

### **Backend (Node.js + Express):**
```bash
cd server
npm install
npm start  # Puerto 3000
```

### **Frontend (React + Vite):**
```bash
npm install
npm run dev  # Puerto 5173
```

### **Variables de Entorno:**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cuentadante_db
DB_PASSWORD=tu_password
DB_PORT=5432
PORT=3000
```

## 🎯 Funcionalidades del Sistema

### **📋 Solicitudes Pendientes**
- Ver todas las solicitudes por estado
- Aprobar/rechazar según rol del usuario
- Información completa del bien solicitado

### **📚 Historial**
- Registro completo de todas las solicitudes
- Filtros por estado, fecha, solicitante
- Trazabilidad completa

### **📦 Inventario**
- Lista completa de bienes con números de serie
- Estados y ubicaciones actuales
- Información de garantías y valores

### **➕ Nueva Solicitud**
- Crear solicitudes de bienes específicos
- Validación de disponibilidad
- Fechas de devolución esperada

### **📤 Aprobación de Salida**
- Control final para entrega física
- Cambio automático de estados
- Registro de asignaciones

## 🔧 API Endpoints

### **Bienes:**
- `GET /api/assets` - Listar todos los bienes
- `GET /api/assets/:id` - Obtener bien específico
- `POST /api/assets` - Crear nuevo bien
- `PUT /api/assets/:id` - Actualizar bien

### **Solicitudes:**
- `GET /api/requests` - Listar solicitudes
- `POST /api/requests` - Crear solicitud
- `PUT /api/requests/:id/approve` - Aprobar solicitud
- `PUT /api/requests/:id/reject` - Rechazar solicitud

### **Usuarios:**
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario

## 💡 Características Técnicas

### **Números de Serie Realistas:**
- Formato similar a equipos reales
- Únicos e irrepetibles
- Fácil identificación física

### **Flujo de Aprobaciones:**
- 4 niveles de aprobación
- Estados JSON para seguimiento
- Motivos de rechazo registrados

### **Gestión de Estados:**
- Available → Assigned automáticamente
- Control de devoluciones
- Historial de asignaciones

### **Validaciones:**
- Verificación de disponibilidad
- Control de duplicados
- Validación de roles y permisos

## 🎨 Interfaz de Usuario

### **Navegación por Roles:**
- Menú adaptativo según permisos
- Acceso controlado a funciones
- Indicadores visuales de estado

### **Información Rica:**
- Números de serie visibles
- Estados con iconos
- Información contextual

### **Responsive Design:**
- Adaptable a diferentes pantallas
- Interfaz moderna y limpia
- Experiencia de usuario optimizada

## 📞 Soporte y Mantenimiento

### **Logs del Sistema:**
- Registro de todas las operaciones
- Trazabilidad completa
- Debugging facilitado

### **Backup y Restauración:**
- Script SQL completo incluido
- Datos de ejemplo para pruebas
- Fácil migración entre entornos

¡Sistema completo y listo para gestionar bienes de formación profesional! 🏢✨