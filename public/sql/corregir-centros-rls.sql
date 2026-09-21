-- Script para verificar y corregir políticas RLS en tabla centros
-- Ejecuta este script en el SQL Editor de Supabase

-- ============================================
-- PASO 1: Habilitar RLS en tabla centros
-- ============================================
ALTER TABLE centros ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: Crear políticas RLS para centros
-- ============================================

-- Política 1: Los usuarios autenticados pueden ver todos los centros
DROP POLICY IF EXISTS "centros_select_authenticated" ON centros;
CREATE POLICY "centros_select_authenticated"
  ON centros FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política 2: Solo administradores pueden insertar centros
DROP POLICY IF EXISTS "centros_insert_admin" ON centros;
CREATE POLICY "centros_insert_admin"
  ON centros FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() 
      AND u.rol = 'jefe_departamento'
    )
  );

-- Política 3: Solo administradores pueden actualizar centros
DROP POLICY IF EXISTS "centros_update_admin" ON centros;
CREATE POLICY "centros_update_admin"
  ON centros FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() 
      AND u.rol = 'jefe_departamento'
    )
  );

-- ============================================
-- PASO 3: Verificar políticas creadas
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
WHERE tablename = 'centros';

-- ============================================
-- PASO 4: Verificar que el centro existe
-- ============================================
SELECT 
  id,
  nombre,
  codigo,
  direccion,
  localidad,
  provincia
FROM centros
WHERE codigo = '39014130';

-- ============================================
-- PASO 5: Verificar relación entre usuarios y centros
-- ============================================
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  u.centro_id,
  c.nombre as centro_nombre
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);
