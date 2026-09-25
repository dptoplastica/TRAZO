# 🔍 Diagnóstico de Problemas de Login

## 📋 Pasos para Diagnosticar el Problema

### 1. Abrir la Consola del Navegador

1. Abre la aplicación en tu navegador
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console** (Consola)

### 2. Intentar Iniciar Sesión

1. Introduce uno de los siguientes emails:
   - `carmen.prieto@educantabria.es`
   - `laura.gomez@educantabria.es`
   - `miguel.ruiz@educantabria.es`

2. Contraseña: `Trazo2025!`

3. Haz clic en "Iniciar sesión"

### 3. Revisar los Logs

Deberías ver mensajes como estos en la consola:

```
🔐 Intentando login con: {email: "...", password: "..."}
📦 Cargando datos locales...
📦 Datos en localStorage: Encontrados/No encontrados
📦 Versión encontrada: 19
✅ Usando datos de localStorage
📊 Datos cargados: {...}
👥 Profesores disponibles: [...]
🔍 Profesor encontrado: {...}
✅ Login exitoso: {...}
```

### 4. Identificar el Error

Según los mensajes que veas, el problema puede ser:

#### ❌ "Email no encontrado"
- El email que introdujiste no coincide exactamente
- Verifica que no haya espacios en blanco
- Usa exactamente: `carmen.prieto@educantabria.es`

#### ❌ "Contraseña incorrecta"
- La contraseña debe ser exactamente: `Trazo2025!`
- Verifica mayúsculas/minúsculas
- Asegúrate de incluir el signo de exclamación

#### ❌ "Error cargando localStorage"
- El navegador puede tener datos corruptos
- Solución: Limpia el localStorage (ver abajo)

#### ❌ No ves ningún log
- La aplicación no se está ejecutando correctamente
- Recarga la página con Ctrl+F5

## 🧹 Limpiar localStorage

Si los datos están corruptos, sigue estos pasos:

### Opción 1: Desde la Consola
1. Abre la consola (F12)
2. Ve a la pestaña **Application** (Aplicación)
3. En el menú lateral, expande **Local Storage**
4. Haz clic en la URL de tu aplicación
5. Haz clic derecho → **Clear** (Limpiar)
6. Recarga la página (Ctrl+F5)

### Opción 2: Desde la Consola (JavaScript)
```javascript
localStorage.clear();
location.reload();
```

### Opción 3: Desde el Navegador
1. Abre la configuración del navegador
2. Ve a **Privacidad y seguridad**
3. Busca **Datos de sitios** o **Cookies**
4. Busca la URL de tu aplicación
5. Elimina los datos
6. Recarga la página

## 🔧 Soluciones Comunes

### Problema: "Email o contraseña incorrectos"

**Solución 1: Verificar credenciales exactas**
```
Email: carmen.prieto@educantabria.es
Contraseña: Trazo2025!
```

**Solución 2: Limpiar localStorage**
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();
```

**Solución 3: Verificar que los datos se cargan**
```javascript
// En la consola del navegador:
const data = JSON.parse(localStorage.getItem('trazo-lomloe-v19'));
console.log('Profesores:', data?.teachers);
```

Deberías ver algo como:
```javascript
[
  {id: "t1", nombre: "Laura Gómez", email: "laura.gomez@educantabria.es", ...},
  {id: "t2", nombre: "Miguel Ruiz", email: "miguel.ruiz@educantabria.es", ...},
  {id: "t3", nombre: "Carmen Prieto", email: "carmen.prieto@educantabria.es", ...}
]
```

### Problema: La página no carga

**Solución:**
1. Asegúrate de que el servidor está corriendo: `npm run dev`
2. Verifica que no hay errores en la terminal
3. Recarga con Ctrl+F5 (recarga forzada)

### Problema: Los logs no aparecen

**Solución:**
1. Asegúrate de estar en la pestaña **Console** (no en otra pestaña)
2. Verifica que no hay filtros activos en la consola
3. Recarga la página con la consola abierta

## 📞 Si el Problema Persiste

Por favor, copia y pega los mensajes completos de la consola aquí:

```
[Pega aquí los logs de la consola]
```

Y también incluye:
- Navegador que estás usando
- Versión del navegador
- Si estás en modo incógnito o no
- Captura de pantalla del error

## ✅ Credenciales Correctas

### Usuario 1: Carmen Prieto (Admin)
- **Email**: `carmen.prieto@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Administrador (acceso completo)

### Usuario 2: Laura Gómez (Profesora)
- **Email**: `laura.gomez@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Profesor

### Usuario 3: Miguel Ruiz (Profesor)
- **Email**: `miguel.ruiz@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Profesor

## 🎯 Comando Rápido de Diagnóstico

Copia y pega esto en la consola del navegador para ver el estado actual:

```javascript
console.log('=== DIAGNÓSTICO TRAZO ===');
console.log('1. LocalStorage:', localStorage.getItem('trazo-lomloe-v19') ? 'OK' : 'VACÍO');
console.log('2. Sesión activa:', localStorage.getItem('trazo-session') ? 'SÍ' : 'NO');
const data = JSON.parse(localStorage.getItem('trazo-lomloe-v19') || '{}');
console.log('3. Profesores:', data.teachers?.length || 0);
console.log('4. Emails disponibles:', data.teachers?.map(t => t.email));
console.log('========================');
```

Esto te dará un resumen rápido del estado de la aplicación.
