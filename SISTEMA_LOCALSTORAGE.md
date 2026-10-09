# 🎉 TRAZO - Sistema Completo con localStorage

## ✅ Configuración Finalizada

TRAZO ahora funciona completamente con **localStorage**. Todos los cambios son permanentes en tu navegador.

---

## 🚀 Cómo Usar

### **1. Abrir la Aplicación**

```bash
npm run dev
```

Abre tu navegador en: `http://localhost:5173`

### **2. Iniciar Sesión**

Usa cualquiera de estos usuarios:

| Usuario | Email | Contraseña |
|---------|-------|------------|
| **Jefatura** | carmen.prieto@educantabria.es | Trazo2025! |
| **Profesor** | laura.gomez@educantabria.es | Trazo2025! |
| **Profesor** | miguel.ruiz@educantabria.es | Trazo2025! |

### **3. Hacer Cambios**

Todos los cambios se guardan automáticamente en localStorage:
- ✅ Editar programaciones
- ✅ Crear situaciones de aprendizaje
- ✅ Calificar alumnos
- ✅ Gestionar grupos
- ✅ Añadir observaciones
- ✅ Etc.

### **4. Recargar la Página**

Los cambios **persisten** al recargar la página.

---

## 💾 Hacer Backup de tus Datos

### **Opción 1: Desde la Aplicación**

1. Ve a **Configuración**
2. Busca **"Datos de la aplicación"**
3. Haz clic en **"Exportar JSON"**
4. Guarda el archivo en un lugar seguro

### **Opción 2: Desde la Consola del Navegador**

Abre la consola (F12) y ejecuta:

```javascript
// Copiar al portapapeles
copy(localStorage.getItem('trazo-lomloe-v24'));

// O descargar como archivo
const data = localStorage.getItem('trazo-lomloe-v24');
const blob = new Blob([data], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'trazo-backup-' + new Date().toISOString().slice(0,10) + '.json';
a.click();
```

---

## 🔄 Restaurar desde Backup

### **Desde la Consola del Navegador:**

```javascript
// Pegar el contenido del backup
const backup = 'PEGA_AQUÍ_EL_CONTENIDO_DEL_JSON';
localStorage.setItem('trazo-lomloe-v24', backup);
location.reload();
```

---

## 📊 Características del Sistema

### **✅ Ventajas de localStorage:**

- **Rápido**: No requiere conexión a internet
- **Simple**: No necesita configuración de base de datos
- **Privado**: Los datos están solo en tu navegador
- **Confiable**: Funciona siempre

### **⚠️ Limitaciones:**

- **Local**: Los datos solo existen en el navegador donde se crearon
- **No sincroniza**: No se comparten entre dispositivos
- **Se puede perder**: Si limpias el caché del navegador

---

## 🛠️ Comandos Útiles

### **Verificar Datos en localStorage:**

```javascript
// En la consola del navegador (F12)
const data = JSON.parse(localStorage.getItem('trazo-lomloe-v24'));
console.log('Profesores:', data.teachers.length);
console.log('Alumnos:', data.students.length);
console.log('Asignaturas:', data.subjects.length);
console.log('Programaciones:', data.programaciones.length);
```

### **Limpiar Datos (CUIDADO):**

```javascript
// Esto borra TODOS los datos
localStorage.removeItem('trazo-lomloe-v24');
location.reload();
```

### **Ver Tamaño de los Datos:**

```javascript
const data = localStorage.getItem('trazo-lomloe-v24');
const size = new Blob([data]).size;
console.log(`Tamaño: ${(size / 1024).toFixed(2)} KB`);
```

---

## 📁 Archivos Modificados

### **Principales:**
- ✅ `src/store.tsx` - Solo localStorage, sin Supabase
- ✅ `src/Root.tsx` - Autenticación local
- ✅ `src/views/Login.tsx` - Login síncrono
- ✅ `src/App.tsx` - Sin inicialTeacherId

### **Eliminados (no se usan):**
- ❌ `src/lib/supabase.ts` - No necesario
- ❌ `src/lib/auth.ts` - No necesario
- ❌ `src/lib/dataService.ts` - No necesario

---

## 🎯 Flujo de Datos

```
Usuario hace un cambio
        ↓
Se guarda en localStorage (inmediato)
        ↓
Los datos persisten al recargar
        ↓
Backup manual recomendado
```

---

## 🔐 Credenciales de Acceso

### **Usuarios Disponibles:**

1. **Carmen Prieto** (Jefatura)
   - Email: `carmen.prieto@educantabria.es`
   - Contraseña: `Trazo2025!`
   - Permisos: Acceso completo

2. **Laura Gómez** (Profesora)
   - Email: `laura.gomez@educantabria.es`
   - Contraseña: `Trazo2025!`
   - Permisos: Profesor

3. **Miguel Ruiz** (Profesor)
   - Email: `miguel.ruiz@educantabria.es`
   - Contraseña: `Trazo2025!`
   - Permisos: Profesor

---

## 📝 Recomendaciones

### **Para Uso Personal:**
✅ localStorage es perfecto
- No requiere configuración
- Funciona offline
- Rápido y confiable

### **Para Uso Profesional:**
⚠️ Haz backup regularmente
- Exporta JSON semanalmente
- Guarda en múltiples ubicaciones
- Considera usar Git para versionado

### **Para Colaboración:**
❌ localStorage no es adecuado
- Los datos no se comparten
- Cada usuario tiene sus propios datos
- Considera usar Supabase o Firebase

---

## 🐛 Solución de Problemas

### **Problema: Los datos no se guardan**

**Solución:**
1. Verifica que el navegador permite localStorage
2. No uses modo incógnito
3. Limpia la caché y recarga

### **Problema: Los datos se perdieron**

**Solución:**
1. Restaura desde backup (ver sección "Restaurar desde Backup")
2. Si no tienes backup, los datos no se pueden recuperar

### **Problema: La aplicación no carga**

**Solución:**
1. Abre la consola (F12)
2. Busca errores en rojo
3. Ejecuta: `localStorage.clear()` y recarga

---

## 📊 Resumen

| Característica | Estado |
|----------------|--------|
| **Almacenamiento** | ✅ localStorage |
| **Autenticación** | ✅ Local |
| **Persistencia** | ✅ Sí (en el navegador) |
| **Multi-dispositivo** | ❌ No |
| **Sincronización** | ❌ No |
| **Backup** | ⚠️ Manual |
| **Offline** | ✅ Sí |

---

## 🎉 ¡Listo para Usar!

TRAZO está completamente funcional con localStorage. Todos los cambios son permanentes en tu navegador.

**Próximos pasos:**
1. ✅ Inicia sesión con uno de los usuarios
2. ✅ Explora las funcionalidades
3. ✅ Haz cambios y verifica que persisten
4. ✅ Haz backup regularmente

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver los mensajes de diagnóstico.

¡Disfruta de TRAZO! 🚀
