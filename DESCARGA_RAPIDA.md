# 📥 Cómo Descargar TRAZO para tu Ordenador

## 🚀 Método Rápido (Recomendado)

### Opción 1: Usar el script de empaquetado

1. **Abre una terminal en este proyecto**
2. **Ejecuta el script:**
   ```bash
   node empaquetar.js
   ```
3. **Se creará un archivo `trazo-lomloe.zip`**
4. **Descarga ese archivo** (debería aparecer en la interfaz web)
5. **Descomprímelo en tu ordenador**
6. **Sigue las instrucciones de instalación abajo**

### Opción 2: Descarga manual de archivos

Si no puedes ejecutar el script, necesitas copiar estos archivos:

#### Archivos de configuración (raíz):
- `package.json`
- `vite.config.js`
- `tsconfig.json`
- `tsconfig.node.json`
- `index.html`
- `.gitignore`

#### Carpeta `src/`:
```
src/
├── main.tsx
├── App.tsx
├── Root.tsx
├── store.tsx
├── index.css
├── version.ts
├── components/
│   ├── layout.tsx
│   └── ui.tsx
├── data/
│   ├── curriculum.ts
│   └── seed.ts
├── lib/
│   ├── supabase.ts
│   └── dataService.ts
└── views/
    ├── Login.tsx
    ├── Panel.tsx
    ├── Programaciones.tsx
    ├── Curriculo.tsx
    ├── Situaciones.tsx
    ├── Unidades.tsx
    ├── Temporalizacion.tsx
    ├── Evaluacion.tsx
    ├── Cuaderno.tsx
    ├── Alumnado.tsx
    ├── Informes.tsx
    ├── Diversidad.tsx
    └── Configuracion.tsx
```

#### Carpeta `public/`:
- `inicializar.html`

#### Documentación:
- `README.md`
- `INSTALACION_LOCAL.md`
- `CONFIGURACION_SUPABASE.md`
- `SUPABASE_SCHEMA.sql`

## 📋 Instrucciones de Instalación

### 1. Requisitos previos

Asegúrate de tener instalado:
- **Node.js** (versión 18 o superior): https://nodejs.org/
- **npm** (viene con Node.js)

Verifica la instalación:
```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 9.x.x o superior
```

### 2. Crear la carpeta del proyecto

```bash
# Crea una carpeta para el proyecto
mkdir trazo-lomloe
cd trazo-lomloe
```

### 3. Copiar los archivos

Copia todos los archivos que descargaste a esta carpeta, manteniendo la estructura de carpetas.

### 4. Instalar dependencias

```bash
npm install
```

Esto descargará todas las librerías necesarias (React, Vite, Tailwind, etc.)

### 5. Inicializar datos

Abre tu navegador en: `http://localhost:5173/inicializar.html`

O ejecuta en la consola del navegador (F12):
```javascript
const seed = {
  version: 19,
  role: "profesor",
  teacherId: "t3",
  cursoLabel: "2025-26",
  teachers: [
    { id: "t1", nombre: "Laura Gómez", email: "laura.gomez@educantabria.es", rol: "profesor", color: "#0e7c66" },
    { id: "t2", nombre: "Miguel Ruiz", email: "miguel.ruiz@educantabria.es", rol: "profesor", color: "#2c6e8f" },
    { id: "t3", nombre: "Carmen Prieto", email: "carmen.prieto@educantabria.es", rol: "admin", color: "#d9532c" }
  ],
  groups: [],
  students: [],
  subjects: [],
  programaciones: [],
  sas: [],
  units: [],
  instruments: [],
  grades: [],
  attendance: [],
  observations: [],
  measures: [],
  recoveries: []
};
localStorage.setItem('trazo-lomloe-v19', JSON.stringify(seed));
location.reload();
```

### 6. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:5173`

### 7. Iniciar sesión

Usa cualquiera de estos usuarios:

| Usuario | Email | Contraseña |
|---------|-------|------------|
| Carmen Prieto | carmen.prieto@educantabria.es | Trazo2025! |
| Laura Gómez | laura.gomez@educantabria.es | Trazo2025! |
| Miguel Ruiz | miguel.ruiz@educantabria.es | Trazo2025! |

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)

# Producción
npm run build        # Compila para producción (carpeta dist/)
npm run preview      # Previsualiza la versión compilada

# Otros
npm run lint         # Verifica errores de código
```

## 🐛 Solución de problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 already in use"
```bash
# En Linux/Mac:
lsof -ti:5173 | xargs kill -9

# En Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### La página no carga
1. Verifica que el servidor esté corriendo
2. Abre la consola del navegador (F12)
3. Revisa si hay errores en rojo
4. Intenta con otro navegador

### Los datos no se guardan
- Verifica que el navegador permita localStorage
- No uses modo incógnito
- Limpia la caché del navegador

## 💾 Backup de datos

Los datos se guardan en el `localStorage` del navegador.

**Para hacer backup:**
```javascript
// En la consola del navegador (F12):
copy(localStorage.getItem('trazo-lomloe-v19'));
```
Luego pega el contenido en un archivo `backup.json`

**Para restaurar:**
```javascript
const data = 'PEGA_AQUÍ_EL_CONTENIDO_DEL_BACKUP';
localStorage.setItem('trazo-lomloe-v19', data);
location.reload();
```

## 🌐 Despliegue en producción

Para subir la aplicación a internet:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`. Puedes subirlos a:
- **Vercel**: https://vercel.com/ (gratis)
- **Netlify**: https://netlify.com/ (gratis)
- **GitHub Pages**: https://pages.github.com/ (gratis)

## 📞 Ayuda

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que Node.js esté instalado correctamente
3. Asegúrate de ejecutar `npm install` antes de `npm run dev`
4. Consulta los archivos de documentación (.md)

---

**¡Listo! Ya tienes TRAZO funcionando en tu ordenador.** 🎉
