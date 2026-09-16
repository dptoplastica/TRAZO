-- Script completo de verificación y corrección para TRAZO
-- Ejecuta este script en el SQL Editor de Supabase

-- ============================================
-- PASO 1: Verificar usuarios en auth.users
-- ============================================
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);

-- ============================================
-- PASO 2: Verificar perfiles en tabla usuarios
-- ============================================
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  u.color,
  c.nombre as centro_nombre
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);

-- ============================================
-- PASO 3: Crear perfiles si no existen
-- ============================================
INSERT INTO usuarios (id, email, nombre, rol, centro_id, color)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'laura.gomez@educantabria.es' THEN 'Laura Gómez'
    WHEN au.email = 'miguel.ruiz@educantabria.es' THEN 'Miguel Ruiz'
    WHEN au.email = 'carmen.prieto@educantabria.es' THEN 'Carmen Prieto'
  END,
  CASE 
    WHEN au.email = 'carmen.prieto@educantabria.es' THEN 'jefe_departamento'
    ELSE 'profesor'
  END,
  (SELECT id FROM centros WHERE codigo = '39014130'),
  CASE 
    WHEN au.email = 'laura.gomez@educantabria.es' THEN '#0e7c66'
    WHEN au.email = 'miguel.ruiz@educantabria.es' THEN '#2c6e8f'
    WHEN au.email = 'carmen.prieto@educantabria.es' THEN '#d9532c'
  END
FROM auth.users au
WHERE au.email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
)
AND NOT EXISTS (
  SELECT 1 FROM usuarios u WHERE u.id = au.id
);

-- ============================================
-- PASO 4: Habilitar RLS en tabla usuarios
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 5: Crear políticas RLS
-- ============================================

-- Política 1: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
CREATE POLICY "usuarios_select_own"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los administradores pueden ver todos los perfiles
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

-- Política 3: Los usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
CREATE POLICY "usuarios_update_own"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- PASO 6: Verificar políticas creadas
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'usuarios';

-- ============================================
-- PASO 7: Verificación final
-- ============================================
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  u.color,
  c.nombre as centro
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);
