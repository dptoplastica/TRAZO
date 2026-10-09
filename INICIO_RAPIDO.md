# 🚀 Guía Rápida - Compilar TRAZO para Windows

## ⚡ Método Rápido (Recomendado)

### 1. Doble clic en el script
```
compilar-windows.bat
```

¡Eso es todo! El script hará todo automáticamente.

---

## 🔧 Método Manual (Paso a Paso)

Si prefieres hacerlo manualmente:

### 1. Abrir terminal
- Navega a la carpeta del proyecto
- Abre CMD o PowerShell

### 2. Instalar dependencias
```bash
npm install
```

### 3. Compilar
```bash
npm run electron:build:win
```

### 4. Encontrar el instalador
Los archivos estarán en la carpeta `release/`:
- `TRAZO-1.0.0-Setup.exe` (Instalador)
- `TRAZO-1.0.0-Portable.exe` (Portable)

---

## 🧪 Probar en Modo Desarrollo

Para probar antes de compilar:

### Opción 1: Script automático
```
desarrollo.bat
```

### Opción 2: Manual
```bash
npm run electron:dev
```

---

## 📋 Requisitos

- ✅ **Node.js 18+** - https://nodejs.org/
- ✅ **Windows 10/11** (64 bits)
- ✅ **2 GB de espacio libre**
- ✅ **Conexión a internet** (primera vez)

---

## ❓ Problemas Comunes

### "npm no se reconoce"
→ Instala Node.js desde https://nodejs.org/

### Error al compilar
→ Ejecuta primero: `npm install`

### El instalador es muy grande
→ Es normal (~100 MB), Electron incluye Chromium

### Windows SmartScreen muestra advertencia
→ Haz clic en "Más información" → "Ejecutar de todas formas"

---

## 📦 Distribuir

Una vez compilado, puedes:

1. **Compartir el instalador**: `TRAZO-1.0.0-Setup.exe`
2. **Compartir la versión portable**: `TRAZO-1.0.0-Portable.exe`
3. **Crear un ZIP con ambos**: 
   ```bash
   Compress-Archive -Path release\* -DestinationPath TRAZO-Windows.zip
   ```

---

## 🎯 Siguientes Pasos

Después de compilar:

1. ✅ Prueba el instalador en tu ordenador
2. ✅ Prueba en otro ordenador (si es posible)
3. ✅ Verifica que todo funciona correctamente
4. ✅ Comparte con los usuarios

---

## 📚 Más Información

Para detalles completos, consulta:
- `GUIA_COMPILACION_WINDOWS.md` - Guía detallada
- `RESUMEN_FUNCIONALIDADES.md` - Funcionalidades de la app

---

**¿Todo listo?** ¡Ejecuta `compilar-windows.bat` y listo! 🎉
