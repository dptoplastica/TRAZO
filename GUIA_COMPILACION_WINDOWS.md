# 🖥️ Guía de Compilación para Windows - TRAZO

Esta guía te ayudará a compilar TRAZO como aplicación de escritorio para Windows.

## 📋 Requisitos Previos

### 1. Node.js y npm
- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior
- Descargar desde: https://nodejs.org/

Verificar instalación:
```bash
node --version
npm --version
```

### 2. Git (opcional pero recomendado)
- Descargar desde: https://git-scm.com/

## 🚀 Pasos para Compilar

### Paso 1: Instalar Dependencias

Abre una terminal (CMD o PowerShell) en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo Electron.

### Paso 2: Probar en Modo Desarrollo (Opcional)

Antes de compilar, puedes probar la aplicación en modo desarrollo:

```bash
npm run electron:dev
```

Esto abrirá la aplicación en una ventana de Electron con hot-reload.

### Paso 3: Compilar para Windows

Para generar el instalador de Windows:

```bash
npm run electron:build:win
```

Este comando:
1. Compila la aplicación web (Vite build)
2. Empaqueta todo con Electron
3. Genera el instalador en la carpeta `release/`

### Paso 4: Encontrar el Instalador

Una vez completado, encontrarás los archivos en la carpeta `release/`:

- **TRAZO-1.0.0-Setup.exe** - Instalador tradicional
- **TRAZO-1.0.0-Portable.exe** - Versión portable (sin instalación)

## 🎨 Personalizar el Icono (Opcional)

Si quieres usar un icono personalizado:

### 1. Preparar el Icono
- Crea un icono PNG de 512x512 píxeles
- Guárdalo como `build/icon.png`

### 2. Convertir a ICO (para Windows)
Usa una herramienta online como:
- https://convertico.com/
- https://icoconvert.com/

O instala la herramienta:
```bash
npm install --save-dev png-to-ico
```

Y ejecuta:
```bash
npx png-to-ico build/icon.png > build/icon.ico
```

### 3. Recompilar
```bash
npm run electron:build:win
```

## 📦 Tipos de Instalador

### Instalador NSIS (Recomendado)
- **Archivo**: `TRAZO-1.0.0-Setup.exe`
- **Ventajas**: 
  - Instalación completa
  - Acceso directo en menú inicio
  - Desinstalador incluido
  - Permite elegir directorio de instalación

### Versión Portable
- **Archivo**: `TRAZO-1.0.0-Portable.exe`
- **Ventajas**:
  - No requiere instalación
  - Se puede ejecutar desde USB
  - Ideal para pruebas

## 🔧 Solución de Problemas

### Error: "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### Error: "Cannot find module 'electron'"
```bash
npm install electron --save-dev
```

### Error al compilar: "ENOENT: no such file or directory"
Asegúrate de que la carpeta `dist/` existe:
```bash
npm run build
```

### El instalador es muy grande
Es normal. Electron incluye Chromium, por lo que el tamaño base es ~150-200 MB.

### Error de firma digital
Windows puede mostrar una advertencia porque la aplicación no está firmada. Esto es normal para aplicaciones de desarrollo.

Para firmar la aplicación (producción):
1. Necesitas un certificado de código
2. Configura las variables de entorno:
   ```bash
   set CSC_LINK=path/to/cert.p12
   set CSC_KEY_PASSWORD=your_password
   ```

## 📊 Tamaño Estimado

- **Aplicación web**: ~2 MB
- **Electron runtime**: ~150 MB
- **Instalador final**: ~80-100 MB (comprimido)
- **Aplicación instalada**: ~250-300 MB

## 🎯 Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Solo la web
npm run electron:dev           # Electron en modo desarrollo

# Producción
npm run build                  # Solo compilar web
npm run electron:build         # Compilar para todas las plataformas
npm run electron:build:win     # Solo Windows
npm run electron:build:mac     # Solo macOS
npm run electron:build:linux   # Solo Linux
```

## 📝 Notas Importantes

1. **Primera compilación**: Puede tardar 5-10 minutos la primera vez
2. **Caché**: Electron descarga archivos en `~/.cache/electron`
3. **Antivirus**: Algunos antivirus pueden bloquear la compilación
4. **Espacio en disco**: Necesitas al menos 2 GB libres
5. **Internet**: Requiere conexión para descargar dependencias de Electron

## 🔄 Actualizar la Aplicación

Si haces cambios en el código:

1. Guarda los cambios
2. Ejecuta nuevamente:
   ```bash
   npm run electron:build:win
   ```
3. Los nuevos instaladores se generarán en `release/`

## 📦 Distribuir la Aplicación

### Opción 1: Distribuir el Instalador
- Comparte el archivo `TRAZO-1.0.0-Setup.exe`
- Los usuarios solo necesitan ejecutarlo

### Opción 2: Distribuir la Versión Portable
- Comparte `TRAZO-1.0.0-Portable.exe`
- Los usuarios pueden ejecutarlo directamente

### Opción 3: Crear un ZIP
```bash
# En PowerShell
Compress-Archive -Path release\* -DestinationPath TRAZO-Windows.zip
```

## 🎓 Recursos Adicionales

- **Documentación de Electron**: https://www.electronjs.org/docs
- **Documentación de electron-builder**: https://www.electron.build/
- **Guía de distribución**: https://www.electronjs.org/docs/tutorial/application-distribution

## ✅ Checklist Final

Antes de distribuir:

- [ ] Probado en modo desarrollo (`npm run electron:dev`)
- [ ] Compilado sin errores (`npm run electron:build:win`)
- [ ] Probado el instalador generado
- [ ] Verificado que la aplicación funciona correctamente
- [ ] Probado en al menos 2 ordenadores diferentes
- [ ] Documentado el proceso de instalación

## 🆘 Soporte

Si tienes problemas:

1. Revisa la consola de Electron (Ctrl+Shift+I en la app)
2. Revisa los logs en `release/`
3. Verifica que todas las dependencias estén instaladas
4. Consulta la documentación oficial de Electron

---

**¡Listo!** Ahora tienes TRAZO compilado como aplicación de escritorio para Windows. 🎉
