# 📦 Sistema de Gestión de Bienes - SENA Cuentadante

Sistema web moderno para la gestión y control de bienes institucionales del SENA, desarrollado con **Next.js 14** y diseñado específicamente para el rol de Cuentadante.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)](https://www.postgresql.org/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/carlow222/cuentadante_project)

## 🎯 Características Principales

- ✅ **Gestión de Solicitudes**: Crear, aprobar y rechazar solicitudes de bienes
- 📦 **Inventario de Bienes**: Control completo de bienes disponibles y asignados
- 📊 **Dashboard Estadístico**: Visualización en tiempo real del estado del inventario
- 🔄 **Historial de Movimientos**: Registro detallado de asignaciones y devoluciones
- 🔐 **Autenticación Segura**: Sistema de login para cuentadantes
- 📱 **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos
- 🚀 **API REST Integrada**: Backend y frontend en un solo proyecto
- ⚡ **Optimización Automática**: Mejor rendimiento con Next.js

## 🛠️ Tecnologías Utilizadas

### Framework Principal
- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de interfaz de usuario
- **PostgreSQL** - Base de datos relacional

### Librerías y Herramientas
- **Lucide React** - Iconos modernos
- **pg** 8.11.5 - Cliente PostgreSQL para Node.js
- **CSS3** - Estilos personalizados con colores SENA

### Ventajas de Next.js
- ✅ Servidor integrado (no necesita Express separado)
- ✅ API Routes nativas
- ✅ Optimización automática de imágenes y código
- ✅ Server-side rendering disponible
- ✅ Deploy simplificado en Vercel
- ✅ Mejor rendimiento en producción

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn
- Git

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/carlow222/cuentadante_project.git
cd cuentadante_project
```

### 2. Navegar al proyecto Next.js
```bash
cd nextjs-cuentadante
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar la base de datos

#### Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE cuentadante;
```

#### Ejecutar el script de inicialización:
```bash
psql -U postgres -d cuentadante -f ../database/database_cuentadante.sql
```

### 5. Configurar variables de entorno

Crear archivo `.env.local`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cuentadante
DB_PASSWORD=tu_contraseña
DB_PORT=5432
```

### 6. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 7. Construir para producción
```bash
npm run build
npm start
```

## 🔑 Credenciales de Acceso

**Usuario de prueba:**
- Email: `cuentadante@sistema.edu.co`
- Password: `cuentadante_1`

## 📁 Estructura del Proyecto

```
cuentadante_project/
├── nextjs-cuentadante/          # Proyecto Next.js principal
│   ├── app/
│   │   ├── api/                 # API Routes (backend integrado)
│   │   │   ├── auth/           # Autenticación
│   │   │   ├── requests/       # Solicitudes
│   │   │   ├── assets/         # Bienes
│   │   │   ├── movements/      # Movimientos
│   │   │   ├── dashboard/      # Estadísticas
│   │   │   └── users/          # Usuarios
│   │   ├── layout.jsx          # Layout principal
│   │   ├── page.jsx            # Página principal
│   │   └── globals.css         # Estilos globales
│   ├── components/             # Componentes React
│   │   ├── Dashboard.jsx       # Panel principal
│   │   ├── NuevaSolicitud.jsx  # Formulario de solicitudes
│   │   ├── SolicitudesPendientes.jsx
│   │   ├── Inventario.jsx
│   │   ├── BienesAsignados.jsx
│   │   ├── Historial.jsx
│   │   ├── Login.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── contexts/               # Context API
│   │   ├── AuthContext.jsx
│   │   └── BieneContext.jsx
│   ├── lib/                    # Utilidades
│   │   └── db.js              # Conexión PostgreSQL
│   ├── public/                 # Assets estáticos
│   │   ├── logo.png
│   │   └── logo-blanco.png
│   ├── .env.local             # Variables de entorno
│   ├── package.json
│   └── next.config.js
├── database/                   # Scripts SQL
│   └── database_cuentadante.sql
├── vercel.json                # Configuración de Vercel
└── README.md                  # Este archivo
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Solicitudes
- `GET /api/requests` - Obtener todas las solicitudes
- `POST /api/requests` - Crear nueva solicitud
- `PUT /api/requests/[id]/approve` - Aprobar solicitud
- `PUT /api/requests/[id]/reject` - Rechazar solicitud

### Bienes
- `GET /api/assets` - Obtener todos los bienes
- `POST /api/assets` - Crear nuevo bien
- `PUT /api/assets/[id]/return` - Procesar devolución

### Dashboard
- `GET /api/dashboard/stats` - Obtener estadísticas del sistema

### Movimientos
- `GET /api/movements` - Obtener historial de movimientos
- `GET /api/movements/asset/[assetId]` - Movimientos por bien

### Usuarios
- `GET /api/users` - Obtener usuarios

### Cereales
- `GET /api/cereals` - Obtener cereales
- `POST /api/cereals` - Crear cereal
- `PUT /api/cereals/[id]` - Actualizar cereal
- `DELETE /api/cereals/[id]` - Eliminar cereal

## 🧪 Probar la Conexión a la Base de Datos

```bash
cd nextjs-cuentadante
node test-db-connection.js
```

Este script verificará:
- ✅ Conexión a PostgreSQL
- ✅ Base de datos correcta
- ✅ Tablas existentes
- ✅ Datos de prueba
- ✅ Usuario cuentadante

## 📊 Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema (cuentadantes)
- **assets** - Inventario de bienes
- **requests** - Solicitudes de bienes
- **asset_movements** - Historial de movimientos
- **cereals** - Gestión de cereales (opcional)

### Datos de Ejemplo

El script de inicialización incluye:
- 4 usuarios (1 cuentadante)
- 12 bienes de ejemplo
- 8 solicitudes de prueba
- Movimientos de ejemplo

## 🎨 Funcionalidades por Vista

### 📊 Dashboard
- Estadísticas en tiempo real (12 bienes, 8 solicitudes)
- Tarjetas con métricas clave
- Acciones rápidas
- Resumen del sistema

### ➕ Nueva Solicitud
- Formulario completo
- Selección de bienes disponibles
- Validación de campos
- Prioridades configurables

### 📋 Solicitudes Pendientes
- Lista de solicitudes por aprobar (3 pendientes)
- Filtros de búsqueda
- Aprobar/Rechazar con observaciones
- Modal de inspección

### 📦 Inventario
- Lista completa de bienes (12 bienes)
- Búsqueda y filtros
- Información detallada
- Estados: Disponible/Asignado

### 📤 Bienes Asignados
- Control de bienes prestados (1 asignado)
- Fechas de devolución
- Proceso de devolución
- Alertas de vencimiento

### 📚 Historial
- Consulta de solicitudes procesadas
- Filtros por estado
- Detalles completos
- Exportación de datos

### 🔄 Movimientos
- Registro de asignaciones (2 movimientos)
- Registro de devoluciones
- Trazabilidad completa
- Historial detallado

## 🌐 Deploy en Vercel

### Opción 1: Deploy con un Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/carlow222/cuentadante_project)

### Opción 2: Deploy Manual

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy desde la carpeta del proyecto:
```bash
cd nextjs-cuentadante
vercel
```

3. Configura las variables de entorno en Vercel:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega las variables de `.env.local`

### Base de Datos para Producción

Para producción en Vercel, necesitas una base de datos PostgreSQL accesible desde internet:

**Opciones recomendadas:**
- **Vercel Postgres** - Integración nativa con Vercel
- **Supabase** - Gratis, fácil de usar, incluye dashboard
- **Railway** - Gratis con límites generosos
- **Neon** - Serverless PostgreSQL, gratis

#### Configurar Vercel Postgres:
1. Ve a tu proyecto en Vercel
2. Storage → Create Database → Postgres
3. Copia las variables de entorno automáticamente
4. Ejecuta el script SQL en la consola de Vercel Postgres

## 🔒 Seguridad

- ✅ Autenticación basada en tokens
- ✅ Validación de datos en backend
- ✅ Protección contra SQL injection
- ✅ Variables de entorno para credenciales
- ✅ HTTPS en producción (Vercel)
- ✅ Sanitización de inputs

## 📱 Diseño Responsive

- ✅ Colores corporativos SENA (#39A900)
- ✅ Diseño adaptable a móviles, tablets y desktop
- ✅ Menú hamburguesa en dispositivos móviles
- ✅ Iconos Lucide React modernos
- ✅ Interfaz intuitiva y profesional

## 🚀 Comandos Disponibles

```bash
npm run dev      # Desarrollo (puerto 3000)
npm run build    # Construir para producción
npm start        # Ejecutar en producción
npm run lint     # Verificar código
```

## 📚 Documentación Adicional

- [INICIO_RAPIDO.md](nextjs-cuentadante/INICIO_RAPIDO.md) - Guía de inicio rápido
- [COMPARACION_VITE_VS_NEXTJS.md](nextjs-cuentadante/COMPARACION_VITE_VS_NEXTJS.md) - Comparación con versión anterior
- [ESTADO_DEL_SERVIDOR.md](nextjs-cuentadante/ESTADO_DEL_SERVIDOR.md) - Estado y configuración
- [ACCESO_AL_SISTEMA.txt](nextjs-cuentadante/ACCESO_AL_SISTEMA.txt) - Información de acceso

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es propiedad del SENA (Servicio Nacional de Aprendizaje).

## 👥 Autor

**Carlos Low**
- GitHub: [@carlow222](https://github.com/carlow222)
- Proyecto: [cuentadante_project](https://github.com/carlow222/cuentadante_project)

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, por favor abre un [issue en GitHub](https://github.com/carlow222/cuentadante_project/issues).

## ✨ Changelog

### v2.0.0 (2024-11-26) - Migración a Next.js
- ✅ Migración completa de React/Vite a Next.js 14
- ✅ API Routes integradas (sin servidor Express separado)
- ✅ Mejor rendimiento y optimización automática
- ✅ Deploy simplificado en Vercel
- ✅ Documentación actualizada
- ✅ Corrección de URLs para producción
- ✅ Configuración de Vercel incluida

### v1.0.0 - Versión Inicial
- ✅ Sistema completo con React/Vite + Express
- ✅ Gestión de bienes y solicitudes
- ✅ Dashboard con estadísticas
- ✅ Autenticación de usuarios

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!

🚀 **Deploy en Vercel:** [Ver Demo](https://cuentadante-project.vercel.app) *(configura tu propia instancia)*
