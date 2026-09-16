-- Configurar políticas RLS para la tabla usuarios
-- Permitir que los usuarios lean su propio perfil

DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON usuarios;
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON usuarios;
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Permitir que los administradores vean todos los perfiles
DROP POLICY IF EXISTS "Administradores pueden ver todos los perfiles" ON usuarios;
CREATE POLICY "Administradores pueden ver todos los perfiles"
  ON usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'jefe_departamento'
    )
  );

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'usuarios';
