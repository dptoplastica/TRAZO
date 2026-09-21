-- Habilitar RLS en la tabla usuarios si no está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'usuarios';
