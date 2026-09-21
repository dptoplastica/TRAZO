-- Script de diagnostico para error 500
-- Ejecuta este script paso a paso en el SQL Editor de Supabase

-- PASO 1: Verificar que el usuario existe en auth.users
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'carmen.prieto@educantabria.es';

-- PASO 2: Verificar que el perfil existe en la tabla usuarios
SELECT 
  id,
  email,
  nombre,
  rol,
  centro_id,
  color
FROM usuarios 
WHERE email = 'carmen.prieto@educantabria.es';

-- PASO 3: Probar la consulta que falla (sin JOIN)
SELECT 
  id,
  email,
  nombre,
  rol,
  centro_id,
  color
FROM usuarios 
WHERE id = 'b98de6f1-644e-4ead-8a9d-eae315670d01';

-- PASO 4: Verificar politicas RLS en la tabla usuarios
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'usuarios';

-- PASO 5: Si no hay politicas, crearlas
-- Politica 1: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
CREATE POLICY "usuarios_select_own"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Politica 2: Los administradores pueden ver todos los perfiles
DROP POLICY IF EXISTS "usuarios_select_all_admin" ON usuarios;
CREATE POLICY "usuarios_select_all_admin"
  ON usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() 
      AND u.rol = 'jefe_departamento'
    )
  );

-- PASO 6: Verificar que las politicas se crearon
SELECT 
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'usuarios';

-- PASO 7: Probar la consulta de nuevo (deberia funcionar ahora)
SELECT 
  id,
  email,
  nombre,
  rol,
  centro_id,
  color
FROM usuarios 
WHERE id = 'b98de6f1-644e-4ead-8a9d-eae315670d01';

-- PASO 8: Verificar que el centro existe
SELECT 
  id,
  nombre,
  codigo
FROM centros
WHERE codigo = '39014130';

-- PASO 9: Verificar la relacion usuario-centro
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.centro_id,
  c.nombre as centro_nombre
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email = 'carmen.prieto@educantabria.es';
