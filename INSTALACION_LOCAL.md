# 📥 Guía de Instalación Local - TRAZO

## 🎯 Opción 1: Descargar como ZIP (Recomendado)

### Paso 1: Descargar el proyecto

Como el proyecto está en esta plataforma web, puedes descargarlo de estas formas:

#### Opción A: Desde la plataforma web
1. Busca el botón **"Download"** o **"Descargar"** en la interfaz
2. Se descargará un archivo ZIP con todo el proyecto
3. Descomprime el ZIP en la carpeta que prefieras

#### Opción B: Copiar archivos manualmente
Si no hay opción de descarga, necesitas copiar estos archivos clave:

**Archivos esenciales:**
```
trazo-lomloe/
├── package.json
├── vite.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── Root.tsx
│   ├── store.tsx
│   ├── index.css
│   ├── version.ts
│   ├── components/
│   │   ├── layout.tsx
│   │   └── ui.tsx
│   ├── data/
│   │   ├── curriculum.ts
│   │   └── seed.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── dataService.ts
│   └── views/
│       ├── Login.tsx
│       ├── Panel.tsx
│       ├── Programaciones.tsx
│       ├── Curriculo.tsx
│       ├── Situaciones.tsx
│       ├── Unidades.tsx
│       ├── Temporalizacion.tsx
│       ├── Evaluacion.tsx
│       ├── Cuaderno.tsx
│       ├── Alumnado.tsx
│       ├── Informes.tsx
│       ├── Diversidad.tsx
│       └── Configuracion.tsx
└── public/
    └── inicializar.html
```

## 🚀 Paso 2: Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias (React, Vite, Tailwind, etc.)

## 🎨 Paso 3: Ejecutar la aplicación

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:5173`

## 🔐 Paso 4: Inicializar datos

1. Abre en tu navegador: `http://localhost:5173/inicializar.html`
2. Haz clic en **"Inicializar Datos"**
3. Haz clic en **"Ir a la Aplicación"**
4. Inicia sesión con:
   - Email: `carmen.prieto@educantabria.es`
   - Contraseña: `Trazo2025!`

## 📋 Requisitos del sistema

- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior
- **Navegador**: Chrome, Firefox, Edge o Safari actualizado

### Verificar versiones:

```bash
node --version
npm --version
```

Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

## 🛠️ Comandos útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Previsualiza la versión de producción

# Otros
npm run lint         # Verifica errores de código
```

## 📁 Estructura del proyecto

```
trazo-lomloe/
├── src/                    # Código fuente
│   ├── components/        # Componentes reutilizables
│   ├── data/              # Datos y configuración
│   ├── lib/               # Utilidades y servicios
│   └── views/             # Vistas principales
├── public/                # Archivos estáticos
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
└── index.html             # HTML principal
```

## 🔧 Solución de problemas

### Error: "npm: command not found"
- Instala Node.js desde https://nodejs.org/
- Reinicia la terminal después de instalar

### Error: "Cannot find module"
- Ejecuta `npm install` nuevamente
- Elimina la carpeta `node_modules` y vuelve a instalar

### Error: "Port 5173 already in use"
- Cierra otras aplicaciones que usen el puerto 5173
- O cambia el puerto en `vite.config.js`

### La página no carga
- Verifica que el servidor esté corriendo (`npm run dev`)
- Abre la consola del navegador (F12) y revisa errores
- Intenta con otro navegador

## 💾 Backup de datos

Los datos se guardan en el `localStorage` del navegador. Para hacer backup:

1. Abre la consola del navegador (F12)
2. Ejecuta: `copy(localStorage.getItem('trazo-lomloe-v19'))`
3. Pega el contenido en un archivo `.json`

Para restaurar:
```javascript
localStorage.setItem('trazo-lomloe-v19', 'PEGA_AQUÍ_EL_JSON');
location.reload();
```

## 🌐 Despliegue en producción

Para subir la aplicación a un servidor:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`. Sube esa carpeta a tu servidor web.

### Opciones de hosting gratuito:
- **Vercel**: https://vercel.com/
- **Netlify**: https://netlify.com/
- **GitHub Pages**: https://pages.github.com/

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que Node.js esté instalado correctamente
3. Asegúrate de ejecutar `npm install` antes de `npm run dev`
4. Consulta la documentación en los archivos `.md` del proyecto

---

**¡Listo! Ya tienes TRAZO funcionando en tu ordenador local.** 🎉
