# Solución al Error 500 en Login

## Problema Identificado
El error 500 ocurre porque la consulta SQL intenta hacer un JOIN con la tabla `centros`, pero hay un problema con las políticas RLS (Row Level Security) o la relación entre tablas.

## Solución Aplicada
He modificado el código para hacer dos consultas separadas en lugar de un JOIN:
1. Primero obtiene el perfil del usuario
2. Luego obtiene los datos del centro en una consulta separada

## Pasos para Solucionar el Problema

### Paso 1: Ejecutar Script SQL para Corregir RLS en Centros

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/
2. Navega a **SQL Editor**
3. Copia y pega TODO el contenido del archivo `public/sql/corregir-centros-rls.sql`
4. Click en **"Run"** (o presiona Ctrl+Enter)

Este script:
- Habilita RLS en la tabla `centros`
- Crea políticas para que usuarios autenticados puedan ver centros
- Crea políticas para que solo administradores puedan modificar centros
- Verifica que el centro IES Lope de Vega existe

### Paso 2: Reiniciar el Servidor de Desarrollo

```bash
# Detén el servidor con Ctrl+C
# Luego ejecuta:
npm run dev
```

### Paso 3: Probar el Login

1. Abre http://localhost:3000/
2. Abre la **Consola del Navegador** (F12 → pestaña Console)
3. Intenta hacer login con:
   - Email: `carmen.prieto@educantabria.es`
   - Password: `Trazo2025!`

4. Deberías ver en la consola:
   ```
   🔐 Intentando login con: carmen.prieto@educantabria.es
   ✅ Login exitoso, user ID: b98de6f1-644e-4ead-8a9d-eae315670d01
   👤 Obteniendo usuario actual...
   ✅ Usuario autenticado: carmen.prieto@educantabria.es ID: b98de6f1-644e-4ead-8a9d-eae315670d01
   ✅ Perfil obtenido: Carmen Prieto jefe_departamento
   ```

## Si el Error Persiste

### Verificación 1: Comprobar que el Centro Existe

Ejecuta en SQL Editor:
```sql
SELECT id, nombre, codigo FROM centros WHERE codigo = '39014130';
```

Si no aparece nada, ejecuta:
```sql
INSERT INTO centros (nombre, codigo, direccion, localidad, provincia)
VALUES (
  'IES Lope de Vega',
  '39014130',
  'Barrio El Sombrero 42B',
  'Santa María de Cayón',
  'Cantabria'
);
```

### Verificación 2: Comprobar que los Usuarios Tienen centro_id

Ejecuta en SQL Editor:
```sql
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.centro_id,
  c.nombre as centro_nombre
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);
```

Si `centro_id` es NULL, ejecuta:
```sql
UPDATE usuarios
SET centro_id = (SELECT id FROM centros WHERE codigo = '39014130')
WHERE email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);
```

### Verificación 3: Comprobar Políticas RLS

Ejecuta en SQL Editor:
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('usuarios', 'centros');
```

Deberías ver al menos estas políticas:
- `usuarios_select_own`
- `usuarios_select_all_admin`
- `usuarios_update_own`
- `centros_select_authenticated`
- `centros_insert_admin`
- `centros_update_admin`

## Resumen de Cambios Realizados

1. **Modificado `src/lib/auth.ts`**:
   - La función `getCurrentUser()` ahora hace dos consultas separadas
   - Primero obtiene el perfil del usuario sin JOIN
   - Luego obtiene los datos del centro en una consulta separada
   - Esto evita el error 500 causado por el JOIN problemático

2. **Creado `public/sql/corregir-centros-rls.sql`**:
   - Script SQL para configurar correctamente las políticas RLS en la tabla `centros`
   - Permite que usuarios autenticados lean los centros
   - Restringe modificaciones solo a administradores

## Próximos Pasos

Una vez que el login funcione correctamente:
1. Verifica que puedes ver el panel de control
2. Prueba navegar entre las diferentes secciones
3. Verifica que los datos se cargan correctamente desde Supabase
