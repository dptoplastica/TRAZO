# 🚀 Guía Paso a Paso: Compilar TRAZO para Windows

## 📋 Antes de Empezar

### Requisitos necesarios:
- ✅ **Node.js 18 o superior** instalado en tu ordenador
- ✅ **Windows 10 u 11** (64 bits)
- ✅ **Conexión a internet** (para descargar dependencias)
- ✅ **Espacio en disco**: Al menos 2 GB libres

### Verificar Node.js:
Abre una terminal (CMD o PowerShell) y ejecuta:
```bash
node --version
```
Debe mostrar algo como `v18.x.x` o superior. Si no lo tienes instalado, descárgalo desde: https://nodejs.org/

---

## 📝 Paso 1: Abrir Terminal en la Carpeta del Proyecto

### Opción A: Desde el Explorador de Archivos
1. Abre la carpeta donde descargaste TRAZO
2. En la barra de direcciones, escribe `cmd` y presiona **Enter**

### Opción B: Desde PowerShell
1. Abre PowerShell
2. Navega a la carpeta del proyecto:
```bash
cd C:\ruta\donde\esta\TRAZO
```

---

## 📦 Paso 2: Instalar Dependencias

Ejecuta este comando:
```bash
npm install
```

**¿Qué hace?**
- Descarga todas las librerías necesarias (React, Electron, etc.)
- Crea la carpeta `node_modules` (puede tardar 2-5 minutos)
- **No te preocupes si ves advertencias**, son normales

**Tiempo estimado:** 3-5 minutos

---

## 🧪 Paso 3: Probar la Aplicación (Opcional pero Recomendado)

Antes de compilar, prueba que todo funciona:

```bash
npm run dev
```

**¿Qué hace?**
- Abre la aplicación en tu navegador en `http://localhost:5173`
- Puedes probar todas las funcionalidades

**Para cerrar:** Presiona `Ctrl + C` en la terminal

---

## 🏗️ Paso 4: Compilar para Windows

Ejecuta este comando:
```bash
npm run electron:build:win
```

**¿Qué hace?**
1. Compila la aplicación web (crea la carpeta `dist/`)
2. Empaqueta todo con Electron
3. Genera los instaladores en la carpeta `release/`

**Tiempo estimado:** 5-10 minutos (la primera vez puede tardar más)

**Progreso:**
```
✓ 94 modules transformed.
dist/index.html                   0.69 kB
dist/assets/index-xxx.css        44.01 kB
dist/assets/index-xxx.js        640.66 kB
✓ built in 4.81s

  • electron-builder  version=26.15.3
  • writing effective config  file=release\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64
  • building        target=NSIS  file=release\TRAZO-1.0.0-Setup.exe
  • building        target=portable  file=release\TRAZO-1.0.0-Portable.exe
```

---

## 📂 Paso 5: Encontrar los Instaladores

Una vez completado, ve a la carpeta `release/` en tu proyecto. Encontrarás:

### Archivos generados:
- 📦 **`TRAZO-1.0.0-Setup.exe`** (~80-100 MB)
  - Instalador tradicional
  - Crea acceso directo en el escritorio
  - Se instala en el menú inicio

- 🎒 **`TRAZO-1.0.0-Portable.exe`** (~150-200 MB)
  - Versión portable
  - No requiere instalación
  - Se puede ejecutar desde USB

---

## ✅ Paso 6: Instalar la Aplicación

### Opción A: Instalador Tradicional (Recomendado)
1. Haz doble clic en `TRAZO-1.0.0-Setup.exe`
2. Sigue el asistente de instalación:
   - Acepta los términos
   - Elige la carpeta de instalación (por defecto: `C:\Program Files\TRAZO`)
   - Marca "Crear acceso directo en el escritorio"
   - Haz clic en "Instalar"
3. Espera a que termine la instalación
4. Haz clic en "Finalizar"

### Opción B: Versión Portable
1. Copia `TRAZO-1.0.0-Portable.exe` donde quieras
2. Haz doble clic para ejecutar
3. ¡Listo! No necesita instalación

---

## 🎯 Paso 7: Usar la Aplicación

### Primera vez que abres TRAZO:
1. Haz doble clic en el icono de TRAZO (escritorio o menú inicio)
2. La aplicación se abrirá en una ventana
3. Inicia sesión con:
   - **Email**: `carmen.prieto@educantabria.es`
   - **Contraseña**: `Trazo2025!`

### Credenciales disponibles:
| Usuario | Email | Contraseña |
|---------|-------|------------|
| Jefatura | carmen.prieto@educantabria.es | Trazo2025! |
| Profesor | laura.gomez@educantabria.es | Trazo2025! |
| Profesor | miguel.ruiz@educantabria.es | Trazo2025! |

---

## 🔄 Actualizar la Aplicación

Si haces cambios en el código y quieres recompilar:

```bash
npm run electron:build:win
```

Los nuevos instaladores se generarán en la carpeta `release/` (sobrescribiendo los anteriores).

---

## 🐛 Solución de Problemas

### Error: "npm no se reconoce"
**Solución:** Instala Node.js desde https://nodejs.org/ y reinicia la terminal

### Error: "Cannot find module 'electron'"
**Solución:** Ejecuta `npm install` nuevamente

### Error: "ENOENT: no such file or directory, open 'dist/index.html'"
**Solución:** Ejecuta primero `npm run build` y luego `npm run electron:build:win`

### El instalador es muy grande (80-100 MB)
**Es normal.** Electron incluye Chromium, por lo que el tamaño base es grande.

### Windows SmartScreen muestra una advertencia
**Es normal.** La aplicación no está firmada digitalmente.
- Haz clic en "Más información"
- Luego en "Ejecutar de todas formas"

### Error al compilar: "EACCES: permission denied"
**Solución:** Ejecuta la terminal como administrador:
- Clic derecho en CMD/PowerShell
- "Ejecutar como administrador"

### La aplicación no se abre después de instalar
**Solución:**
1. Verifica que el archivo `dist/index.html` existe
2. Reinstala la aplicación
3. Revisa el log de errores en `%APPDATA%\TRAZO\logs`

---

## 📊 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Abrir en navegador (http://localhost:5173)
npm run electron:dev     # Abrir en ventana Electron (modo desarrollo)

# Producción
npm run build            # Solo compilar la aplicación web
npm run electron:build   # Compilar para todas las plataformas
npm run electron:build:win  # Solo Windows (instalador + portable)
npm run electron:build:mac  # Solo macOS
npm run electron:build:linux  # Solo Linux
```

---

## 📦 Distribuir la Aplicación

### Opción 1: Compartir el Instalador
- Envía el archivo `TRAZO-1.0.0-Setup.exe` por email, USB, etc.
- Los usuarios solo necesitan ejecutarlo

### Opción 2: Compartir la Versión Portable
- Envía `TRAZO-1.0.0-Portable.exe`
- Los usuarios pueden ejecutarlo directamente sin instalar

### Opción 3: Subir a la Nube
Sube los instaladores a:
- Google Drive
- Dropbox
- OneDrive
- Tu servidor web

---

## 🎓 Recursos Adicionales

### Documentación:
- **GUIA_COMPILACION_WINDOWS.md** - Guía detallada completa
- **README.md** - Documentación del proyecto
- **INSTALACION_LOCAL.md** - Instrucciones de instalación

### Soporte:
Si tienes problemas:
1. Revisa la consola de la terminal para ver errores
2. Consulta la sección "Solución de Problemas" arriba
3. Revisa los logs en `%APPDATA%\TRAZO\logs`

---

## ✅ Checklist Final

Antes de distribuir, verifica:

- [ ] Node.js instalado (versión 18+)
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` funciona correctamente
- [ ] `npm run electron:build:win` completado sin errores
- [ ] Los instaladores se generaron en la carpeta `release/`
- [ ] Probaste el instalador en tu ordenador
- [ ] La aplicación se abre correctamente
- [ ] Puedes iniciar sesión con las credenciales
- [ ] Todas las funcionalidades trabajan

---

## 🎉 ¡Listo!

Has compilado exitosamente TRAZO como aplicación de escritorio para Windows. Ahora puedes:

1. **Instalar la aplicación** en cualquier ordenador con Windows
2. **Distribuir el instalador** a otros usuarios
3. **Usar la aplicación** sin necesidad de navegador
4. **Trabajar offline** (los datos se guardan localmente)

---

**¿Necesitas ayuda?** Consulta la sección "Solución de Problemas" o revisa la documentación completa en `GUIA_COMPILACION_WINDOWS.md`.

¡Disfruta de TRAZO! 🚀
