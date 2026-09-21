# 🚀 Guía de Compilación de TRAZO

## 📋 Opciones de compilación

### Opción 1: Versión Web (más simple)
**Ideal para:** Servir desde un servidor web del centro o abrir localmente

```bash
npm run build
```

**Resultado:** Carpeta `dist/` con archivos estáticos
- Abrir `dist/index.html` directamente en el navegador
- Subir a cualquier servidor web (Apache, Nginx, IIS)
- Copiar a USB y ejecutar en cualquier ordenador

---

### Opción 2: Aplicación de Escritorio (Electron) ⭐ RECOMENDADO
**Ideal para:** Instalar como programa en Windows/Mac/Linux

#### Requisitos previos:
```bash
npm install --save-dev electron electron-builder
```

#### Compilación automática:
```bash
# Windows PowerShell
.\compilar.ps1

# Windows CMD
compilar.bat

# Linux/Mac
npm run build && npx electron-builder
```

#### Compilación manual paso a paso:
```bash
# 1. Compilar la app web
npm run build

# 2. Crear ejecutable para Windows
npx electron-builder --win

# 3. Crear ejecutable para Mac
npx electron-builder --mac

# 4. Crear ejecutable para Linux
npx electron-builder --linux
```

**Resultado:** Carpeta `release/` con:
- `TRAZO Setup X.X.X.exe` - Instalador para Windows
- `TRAZO X.X.X.exe` - Versión portable para Windows
- `TRAZO-X.X.X.dmg` - Instalador para Mac
- `TRAZO-X.X.AppImage` - Versión portable para Linux

---

### Opción 3: PWA (Progressive Web App)
**Ideal para:** Instalar desde el navegador como app

#### Configuración:
1. Añadir `manifest.json` en la carpeta `public/`:

```json
{
  "name": "TRAZO - Programación Didáctica LOMLOE",
  "short_name": "TRAZO",
  "description": "Suite de programación y evaluación LOMLOE",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f2f4ef",
  "theme_color": "#0e7c66",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. Añadir en `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0e7c66">
```

3. Compilar y servir:
```bash
npm run build
npx serve dist
```

4. Abrir en Chrome/Edge y hacer clic en "Instalar aplicación"

---

## 🔧 Configuración avanzada

### Cambiar el icono de la aplicación

1. Crear un icono PNG de 512x512 píxeles
2. Guardarlo como `public/icon.png`
3. Recomplar:
```bash
npm run build
npx electron-builder
```

### Personalizar el nombre de la aplicación

Editar `electron-builder.json`:
```json
{
  "productName": "Mi Nombre Personalizado",
  "appId": "com.miempresa.miapp"
}
```

### Configurar actualizaciones automáticas

Añadir en `electron-builder.json`:
```json
{
  "publish": {
    "provider": "github",
    "owner": "tu-usuario",
    "repo": "tu-repo"
  }
}
```

---

## 📦 Distribución

### Para un centro educativo:

1. **Servidor web interno:**
   - Compilar: `npm run build`
   - Copiar carpeta `dist/` al servidor
   - Configurar Apache/Nginx/IIS para servir los archivos

2. **Instalación en ordenadores:**
   - Compilar ejecutable: `npx electron-builder --win`
   - Copiar `release/TRAZO Setup X.X.X.exe` a USB
   - Instalar en cada ordenador del centro

3. **Versión portable:**
   - Compilar: `npx electron-builder --win portable`
   - Copiar `release/TRAZO X.X.X.exe` a USB
   - Ejecutar directamente sin instalación

### Para uso personal:

1. **Local:**
   ```bash
   npm run dev
   ```

2. **Portable:**
   ```bash
   npm run build
   npx electron-builder --win portable
   ```
   Llevar el archivo `.exe` en un USB

---

## 🐛 Solución de problemas

### Error: "electron-builder no encontrado"
```bash
npm install --save-dev electron-builder
```

### Error: "Cannot find module 'electron'"
```bash
npm install --save-dev electron
```

### El ejecutable no abre
1. Verificar que `dist/` existe y tiene archivos
2. Verificar que `electron/main.js` existe
3. Recompiar: `npm run build && npx electron-builder`

### El icono no aparece
1. Verificar que `public/icon.png` existe
2. Debe ser PNG de 512x512 píxeles
3. Recompiar: `npx electron-builder`

---

## 📊 Comparativa de opciones

| Opción | Tamaño | Instalación | Offline | Multiplataforma |
|--------|--------|-------------|---------|-----------------|
| Web estática | ~1 MB | No | Sí | Sí |
| Electron | ~150 MB | Sí | Sí | Sí |
| PWA | ~1 MB | Desde navegador | Parcial | Sí |

---

## 🎯 Recomendaciones

### Para el IES Lope de Vega:

**Opción recomendada:** Aplicación de escritorio (Electron)

**Ventajas:**
- ✅ Instalación sencilla en todos los ordenadores del centro
- ✅ Funciona sin conexión a internet
- ✅ Los datos se guardan localmente en cada ordenador
- ✅ No requiere servidor web
- ✅ Icono en el escritorio para acceso rápido

**Pasos:**
```bash
# 1. Instalar dependencias
npm install --save-dev electron electron-builder

# 2. Compilar
npm run build
npx electron-builder --win

# 3. Distribuir
# Copiar release/TRAZO Setup X.X.X.exe a cada ordenador
```

### Para uso en casa:

**Opción recomendada:** Versión web estática

**Ventajas:**
- ✅ No requiere instalación
- ✅ Se puede abrir directamente desde el navegador
- ✅ Tamaño mínimo
- ✅ Fácil de compartir

**Pasos:**
```bash
npm run build
# Abrir dist/index.html en el navegador
```

---

## 📞 Soporte

Si tienes problemas con la compilación:

1. Verificar que Node.js está instalado: `node --version`
2. Verificar que npm está instalado: `npm --version`
3. Eliminar `node_modules` y reinstalar:
   ```bash
   rmdir /s /q node_modules
   npm install
   ```
4. Limpiar caché de npm:
   ```bash
   npm cache clean --force
   ```

---

**Desarrollado para el IES Lope de Vega - Santa María de Cayón**
