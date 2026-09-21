# Guía de Diagnóstico para Login de TRAZO

## Problema: No se puede hacer login

### Paso 1: Verificar credenciales de Supabase

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Debe contener:
```env
VITE_SUPABASE_URL=https://nvdfmlxztqirghlkhsgg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_LKlJz6iQezFSQoDS_RcGcw_RY6rrbHU
```

3. **IMPORTANTE**: Después de guardar `.env.local`, reinicia el servidor:
```bash
# Detén el servidor con Ctrl+C
# Luego ejecuta:
npm run dev
```

### Paso 2: Verificar usuarios en Supabase Authentication

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/
2. Navega a **Authentication → Users**
3. Verifica que existan estos usuarios:
   - laura.gomez@educantabria.es
   - miguel.ruiz@educantabria.es
   - carmen.prieto@educantabria.es

4. Si NO existen, créalos:
   - Click en **"Add user"** → **"Create new user"**
   - Email: uno de los emails arriba
   - Password: `Trazo2025!`
   - **IMPORTANTE**: Marca la casilla **"Auto Confirm User"**
   - Click en **"Create user"**
   - Repite para los 3 usuarios

### Paso 3: Ejecutar script SQL de verificación

1. En Supabase, ve a **SQL Editor**
2. Copia y pega TODO el contenido del archivo `public/sql/verificar-y-corregir.sql`
3. Click en **"Run"** (o presiona Ctrl+Enter)
4. Revisa los resultados de cada paso

### Paso 4: Verificar resultados del SQL

El script ejecuta 7 pasos. Verifica que:

**Paso 1**: Debe mostrar 3 usuarios en `auth.users`
- Si no aparecen, ve al Paso 2 de esta guía

**Paso 2**: Debe mostrar 3 perfiles en la tabla `usuarios`
- Si no aparecen, el Paso 3 del script los creará automáticamente

**Paso 3**: Crea los perfiles si no existen
- Debe mostrar "Success. No rows returned"

**Paso 4**: Habilita RLS
- Debe mostrar "Success. No rows returned"

**Paso 5**: Crea las políticas RLS
- Debe mostrar "Success. No rows returned" para cada política

**Paso 6**: Muestra las políticas creadas
- Debe mostrar 3 políticas:
  - usuarios_select_own
  - usuarios_select_all_admin
  - usuarios_update_own

**Paso 7**: Verificación final
- Debe mostrar 3 usuarios con sus datos completos

### Paso 5: Probar el login

1. Abre tu navegador en http://localhost:3000/
2. Abre la **Consola del Navegador** (F12 → pestaña Console)
3. Intenta hacer login con:
   - Email: carmen.prieto@educantabria.es
   - Password: Trazo2025!

4. Revisa los logs en la consola:
   - 🔐 Intentando login con: ...
   - ✅ Login exitoso, user ID: ...
   - 👤 Obteniendo usuario actual...
   - ✅ Usuario autenticado: ...
   - ✅ Perfil obtenido: ...

### Paso 6: Si sigue sin funcionar

Copia los mensajes de error de la consola del navegador y compártelos para diagnóstico.

Los errores más comunes son:

1. **"Invalid login credentials"**
   - El usuario no existe o la contraseña es incorrecta
   - Solución: Verifica el Paso 2

2. **"Email not confirmed"**
   - El usuario no está confirmado
   - Solución: Edita el usuario en Authentication y marca "Auto Confirm User"

3. **"new row violates row-level security policy"**
   - Las políticas RLS no están configuradas
   - Solución: Ejecuta el script SQL completo

4. **Error al obtener perfil**
   - No existe el perfil en la tabla `usuarios`
   - Solución: El Paso 3 del script SQL lo crea automáticamente

## Usuarios de prueba

- **Jefatura de departamento**: carmen.prieto@educantabria.es / Trazo2025!
- **Profesor**: laura.gomez@educantabria.es / Trazo2025!
- **Profesor**: miguel.ruiz@educantabria.es / Trazo2025!
