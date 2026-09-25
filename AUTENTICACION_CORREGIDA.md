# 🔐 Sistema de Autenticación Corregido

## ✅ Problema Resuelto

El sistema de autenticación ha sido simplificado para usar **autenticación local directa** en lugar de depender de Supabase Auth.

## 🎯 Cambios Realizados

### Antes:
- Intentaba autenticar primero con Supabase Auth
- Si fallaba, hacía fallback a autenticación local
- Requería crear usuarios manualmente en Supabase Auth
- Complejidad innecesaria

### Ahora:
- Autenticación local directa
- No depende de Supabase Auth
- Usuarios ya definidos en el seed de datos
- Funciona inmediatamente sin configuración adicional

## 👥 Usuarios Disponibles

### 1. Carmen Prieto (Jefatura de Departamento)
- **Email**: `carmen.prieto@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Admin
- **Permisos**: Acceso completo a todas las funcionalidades

### 2. Laura Gómez (Profesora)
- **Email**: `laura.gomez@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Profesor
- **Permisos**: Acceso a funcionalidades de profesor

### 3. Miguel Ruiz (Profesor)
- **Email**: `miguel.ruiz@educantabria.es`
- **Contraseña**: `Trazo2025!`
- **Rol**: Profesor
- **Permisos**: Acceso a funcionalidades de profesor

## 🚀 Cómo Iniciar Sesión

1. Abre la aplicación TRAZO
2. Verás la pantalla de inicio de sesión
3. Introduce el email y contraseña de uno de los usuarios
4. Haz clic en "Iniciar sesión"
5. Serás redirigido al panel de control

## 💾 Sincronización con Supabase

Aunque la autenticación es local, **los datos se sincronizan con Supabase**:

- ✅ Autenticación: Local (sin dependencia de Supabase Auth)
- ✅ Datos: Sincronizados con Supabase (si está configurado)
- ✅ Fallback: localStorage si Supabase no está disponible
- ✅ Offline: Funciona completamente sin conexión

## 🔧 Archivos Modificados

### src/Root.tsx
- Eliminada dependencia de Supabase Auth
- Autenticación local directa
- Simplificación del código

### src/views/Login.tsx
- Cambiado de función asíncrona a síncrona
- Eliminada complejidad innecesaria

### src/lib/dataService.ts
- Mantiene sincronización de datos con Supabase
- Ya no se usa para autenticación

## 🎨 Flujo de Autenticación

```
Usuario introduce credenciales
         ↓
Validación local (email + contraseña)
         ↓
    ¿Válido?
    ↓       ↓
   Sí      No
    ↓       ↓
Crear    Mostrar
sesión   error
    ↓
Guardar en localStorage
    ↓
Cargar datos (Supabase o localStorage)
    ↓
Mostrar aplicación
```

## 🔒 Seguridad

### Autenticación Local
- Contraseña hardcoded: `Trazo2025!`
- Usuarios definidos en seed de datos
- Sesión guardada en localStorage

### Sincronización de Datos
- Datos sincronizados con Supabase (si está configurado)
- Políticas RLS activas en Supabase
- Fallback a localStorage si Supabase falla

## 📝 Notas Importantes

1. **No necesitas crear usuarios en Supabase Auth**: Los usuarios ya están definidos en el código
2. **La contraseña es la misma para todos**: `Trazo2025!`
3. **Supabase se usa solo para datos**: No para autenticación
4. **Funciona offline**: Gracias al fallback a localStorage

## 🐛 Solución de Problemas

### No puedo iniciar sesión
- Verifica que el email sea correcto
- Asegúrate de que la contraseña sea `Trazo2025!` (con mayúscula y exclamación)
- Limpia el localStorage del navegador

### La sesión no se mantiene
- Verifica que el navegador permita localStorage
- No uses modo incógnito
- Limpia la caché del navegador

### Los datos no se sincronizan con Supabase
- Verifica que las credenciales de Supabase sean correctas
- Comprueba que el esquema SQL se haya ejecutado
- Revisa la consola del navegador para ver errores

## 🎓 Próximos Pasos

1. ✅ Iniciar sesión con uno de los usuarios
2. ✅ Explorar las funcionalidades
3. ✅ Crear programaciones didácticas
4. ✅ Gestionar alumnos y grupos
5. ✅ Registrar calificaciones
6. ✅ Generar informes

---

**Estado**: ✅ Funcionando correctamente  
**Versión**: 1.0.0  
**Fecha**: 2026
