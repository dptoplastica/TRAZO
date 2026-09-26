# Configuración de Supabase para TRAZO

## ✅ Conexión Establecida

La aplicación TRAZO ya está conectada a tu instancia de Supabase:
- **URL**: https://mbyjsvmyjgacoapfadyx.supabase.co
- **Estado**: Conectado y funcional

## 📋 Pasos para Completar la Configuración

### 1. Ejecutar el Esquema SQL en Supabase

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard/project/mbyjsvmyjgacoapfadyx)
2. Navega a **SQL Editor** en el menú lateral
3. Haz clic en **New Query**
4. Copia todo el contenido del archivo `SUPABASE_SCHEMA.sql`
5. Pégalo en el editor SQL
6. Haz clic en **Run** (o presiona Ctrl+Enter)

Esto creará:
- ✅ 13 tablas para almacenar todos los datos
- ✅ Índices para mejorar el rendimiento
- ✅ Políticas de seguridad RLS (Row Level Security)
- ✅ Datos iniciales de los 3 profesores

### 2. Crear Usuarios en Supabase Auth

La aplicación usa autenticación de Supabase. Necesitas crear los usuarios:

1. Ve a **Authentication** > **Users** en el dashboard
2. Haz clic en **Add user** > **Create new user**
3. Crea los siguientes usuarios:

#### Usuario 1: Carmen Prieto (Jefatura)
- **Email**: carmen.prieto@educantabria.es
- **Password**: Trazo2025!
- **Auto Confirm User**: ✅ Marcado

#### Usuario 2: Laura Gómez (Profesora)
- **Email**: laura.gomez@educantabria.es
- **Password**: Trazo2025!
- **Auto Confirm User**: ✅ Marcado

#### Usuario 3: Miguel Ruiz (Profesor)
- **Email**: miguel.ruiz@educantabria.es
- **Password**: Trazo2025!
- **Auto Confirm User**: ✅ Marcado

### 3. Verificar la Conexión

1. Abre la aplicación TRAZO
2. Intenta iniciar sesión con cualquiera de los usuarios
3. Si la autenticación funciona, verás el dashboard
4. Los datos se sincronizarán automáticamente con Supabase

## 🔄 Cómo Funciona la Sincronización

### Sistema Híbrido (Supabase + localStorage)

La aplicación usa un sistema híbrido para garantizar la disponibilidad:

1. **Autenticación**: Usa Supabase Auth
   - Si Supabase está disponible: autenticación en la nube
   - Si Supabase falla: fallback a autenticación local

2. **Datos**: Sincronización automática
   - Cada cambio se guarda en localStorage inmediatamente
   - Simultáneamente se intenta sincronizar con Supabase
   - Si Supabase falla, los datos siguen disponibles en localStorage

3. **Carga de datos**: Prioridad Supabase
   - Al iniciar, intenta cargar desde Supabase
   - Si falla, carga desde localStorage
   - Si no hay datos, genera datos de demostración

### Ventajas de este Sistema

- ✅ **Offline-first**: Funciona sin conexión a internet
- ✅ **Sincronización**: Los datos se sincronizan cuando hay conexión
- ✅ **Respaldo**: localStorage actúa como backup
- ✅ **Multi-dispositivo**: Los datos se sincronizan entre dispositivos (con Supabase)

## 📊 Estructura de Tablas

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `teachers` | Profesores y jefatura de departamento |
| `groups` | Grupos de alumnos |
| `students` | Alumnos matriculados |
| `subjects` | Asignaturas |
| `programaciones` | Programaciones didácticas |
| `situaciones_aprendizaje` | Situaciones de aprendizaje |
| `units` | Unidades didácticas |
| `instruments` | Instrumentos de evaluación |
| `grades` | Calificaciones |
| `attendance` | Registro de asistencia |
| `observations` | Observaciones del profesorado |
| `measures` | Medidas de atención a la diversidad |
| `recoveries` | Planes de recuperación |

### Tipos de Datos Especiales

- **JSONB**: Campos que almacenan objetos complejos (contexto, actividades, rúbricas)
- **ARRAY**: Campos que almacenan listas (criterios, metodologias, dias)
- **UUID**: Identificadores únicos para cada registro

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS activado con las siguientes políticas:

- **SELECT**: Usuarios autenticados pueden leer todos los datos
- **INSERT**: Usuarios autenticados pueden crear registros
- **UPDATE**: Usuarios autenticados pueden modificar registros

### Recomendaciones de Seguridad

1. **No compartas la anon key** públicamente
2. **Usa contraseñas seguras** para los usuarios
3. **Revisa las políticas RLS** si necesitas restricciones más específicas
4. **Habilita 2FA** en Supabase para mayor seguridad

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con Supabase"

**Causa**: Problemas de red o configuración incorrecta

**Solución**:
1. Verifica que la URL y la key sean correctas en `src/lib/supabase.ts`
2. Comprueba que el proyecto de Supabase esté activo
3. La aplicación seguirá funcionando con localStorage

### Error: "Error de autenticación"

**Causa**: Usuario no existe o contraseña incorrecta

**Solución**:
1. Verifica que hayas creado los usuarios en Supabase Auth
2. Comprueba que el email y contraseña sean correctos
3. Asegúrate de que "Auto Confirm User" esté marcado

### Los datos no se sincronizan

**Causa**: Problemas con las políticas RLS o permisos

**Solución**:
1. Verifica que hayas ejecutado el SQL completo
2. Comprueba que las políticas RLS estén correctas
3. Revisa la consola del navegador para ver errores específicos

## 📈 Monitoreo

### Ver Datos en Supabase

1. Ve a **Table Editor** en el dashboard
2. Selecciona cualquier tabla para ver los datos
3. Puedes editar datos directamente desde la interfaz

### Ver Logs de Autenticación

1. Ve a **Authentication** > **Logs**
2. Verás todos los intentos de inicio de sesión
3. Útil para depurar problemas de autenticación

### Ver Uso de la Base de Datos

1. Ve a **Database** > **Connections**
2. Verás el número de conexiones activas
3. Monitorea el uso de almacenamiento en **Database** > **Size**

## 🚀 Próximos Pasos

1. ✅ Ejecutar el esquema SQL
2. ✅ Crear los usuarios en Supabase Auth
3. ✅ Probar la autenticación
4. ✅ Verificar la sincronización de datos
5. ✅ Personalizar las políticas RLS si es necesario

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Comprueba los logs en Supabase Dashboard
3. Verifica que todas las tablas se crearon correctamente
4. Asegúrate de que los usuarios están confirmados

---

**Nota**: La aplicación está diseñada para funcionar incluso si Supabase no está disponible, gracias al sistema de fallback con localStorage.
