# 🚀 Guía Rápida de Compilación - TRAZO

## ✅ PASO 1: Compilar la aplicación

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm run build
```

**Resultado:** Se crea la carpeta `dist/` con la aplicación web compilada.

---

## ✅ PASO 2: Crear el ejecutable de Windows

Ejecuta este comando:

```powershell
npx electron-builder --win
```

**Resultado:** Se crea la carpeta `release/` con el instalador.

---

## ✅ PASO 3: Encontrar el ejecutable

Busca en la carpeta `release/` el archivo:
- **`TRAZO-1.0.0-Setup.exe`** - Instalador para Windows

---

## 🎯 Método Automático (alternativa)

Si prefieres un solo comando, ejecuta:

```powershell
.\compilar.bat
```

O desde PowerShell:

```powershell
npm run electron:build:win
```

---

## 📦 ¿Dónde está el ejecutable?

Después de compilar, busca en:
```
release\TRAZO-1.0.0-Setup.exe
```

---

## ❌ Solución de Problemas

### Problema: "npx electron-builder no se reconoce"

**Solución:**
```powershell
npm install --save-dev electron electron-builder
```

### Problema: "La carpeta release no se crea"

**Solución:**
1. Verifica que `npm run build` se completó correctamente
2. Verifica que existe la carpeta `dist/`
3. Ejecuta `npx electron-builder --win` nuevamente

### Problema: "Error al crear el ejecutable"

**Solución:**
1. Cierra todos los programas de TRAZO si están abiertos
2. Elimina la carpeta `release/` si existe
3. Ejecuta `npx electron-builder --win` nuevamente

---

## 🎓 Para el IES Lope de Vega

Una vez compilado:
1. Copia `release\TRAZO-1.0.0-Setup.exe` a un USB
2. Instálalo en los ordenadores del centro
3. La aplicación se instala como un programa normal de Windows
4. Se crea un acceso directo en el escritorio

---

## 💡 Consejos

- **Primera compilación:** Puede tardar 5-10 minutos
- **Tamaño del ejecutable:** Aproximadamente 150-200 MB
- **Requisitos:** Windows 10 o superior (64 bits)
- **Sin internet:** La aplicación funciona completamente offline

---

**¿Problemas?** Revisa la consola de PowerShell para ver los mensajes de error específicos.
