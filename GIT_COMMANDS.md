# 📝 Comandos Git para el Proyecto

## 🎉 Proyecto Subido Exitosamente

Tu proyecto está ahora en: **https://github.com/carlow222/cuentadante_project**

---

## 📋 Comandos Básicos de Git

### Ver el estado de los archivos
```bash
git status
```

### Agregar cambios al staging
```bash
# Agregar todos los archivos modificados
git add .

# Agregar un archivo específico
git add nombre_archivo.js
```

### Hacer commit de los cambios
```bash
git commit -m "Descripción de los cambios"
```

### Subir cambios a GitHub
```bash
git push origin main
```

---

## 🔄 Flujo de Trabajo Completo

### 1. Después de hacer cambios en el código:
```bash
git status                                    # Ver qué archivos cambiaron
git add .                                     # Agregar todos los cambios
git commit -m "Descripción del cambio"        # Guardar cambios localmente
git push origin main                          # Subir a GitHub
```

### 2. Ejemplo de commits descriptivos:
```bash
git commit -m "feat: Agregar validación de formularios"
git commit -m "fix: Corregir error en login"
git commit -m "style: Mejorar diseño del dashboard"
git commit -m "docs: Actualizar README con nuevas instrucciones"
```

---

## 🌿 Trabajar con Ramas

### Crear una nueva rama
```bash
git checkout -b feature/nueva-funcionalidad
```

### Cambiar entre ramas
```bash
git checkout main                    # Volver a la rama principal
git checkout feature/mi-rama         # Cambiar a otra rama
```

### Subir una rama nueva a GitHub
```bash
git push -u origin feature/nueva-funcionalidad
```

### Fusionar una rama con main
```bash
git checkout main                    # Ir a main
git merge feature/nueva-funcionalidad # Fusionar la rama
git push origin main                 # Subir los cambios
```

---

## 📥 Descargar Cambios de GitHub

### Actualizar tu repositorio local
```bash
git pull origin main
```

---

## 🔍 Ver Historial

### Ver commits anteriores
```bash
git log                              # Ver historial completo
git log --oneline                    # Ver historial resumido
```

---

## ⚠️ Comandos Útiles en Caso de Problemas

### Descartar cambios no guardados
```bash
git checkout -- nombre_archivo.js    # Descartar cambios de un archivo
git checkout -- .                    # Descartar todos los cambios
```

### Ver diferencias
```bash
git diff                             # Ver cambios no guardados
git diff nombre_archivo.js           # Ver cambios de un archivo específico
```

### Deshacer el último commit (mantener cambios)
```bash
git reset --soft HEAD~1
```

### Ver ramas
```bash
git branch                           # Ver ramas locales
git branch -a                        # Ver todas las ramas (locales y remotas)
```

---

## 🎯 Convenciones de Commits

Usa prefijos para organizar mejor tus commits:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de errores
- `style:` - Cambios de estilo (CSS, formato)
- `refactor:` - Refactorización de código
- `docs:` - Cambios en documentación
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat: Agregar filtro de búsqueda en inventario"
git commit -m "fix: Corregir error al aprobar solicitudes"
git commit -m "style: Mejorar responsive del dashboard"
git commit -m "docs: Actualizar guía de instalación"
```

---

## 🔐 Configuración Inicial (Solo una vez)

Si aún no has configurado tu identidad en Git:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

---

## 📦 Ignorar Archivos

El archivo `.gitignore` ya está configurado para ignorar:
- `node_modules/`
- `.env`
- Archivos de build
- Archivos temporales

Si necesitas ignorar más archivos, agrégalos a `.gitignore`

---

## 🚀 Resumen Rápido

```bash
# Flujo básico diario
git status                           # 1. Ver cambios
git add .                            # 2. Agregar cambios
git commit -m "Descripción"          # 3. Guardar cambios
git push origin main                 # 4. Subir a GitHub

# Actualizar desde GitHub
git pull origin main
```

---

## 📞 Ayuda

Si tienes problemas con Git:
```bash
git --help                           # Ayuda general
git commit --help                    # Ayuda de un comando específico
```

O visita: https://git-scm.com/docs

---

## ✅ Estado Actual del Repositorio

- ✅ Repositorio inicializado
- ✅ Archivos agregados
- ✅ Primer commit realizado
- ✅ Rama main creada
- ✅ Remoto configurado
- ✅ Código subido a GitHub

**URL del repositorio:** https://github.com/carlow222/cuentadante_project

¡Tu proyecto está listo para colaborar! 🎉
