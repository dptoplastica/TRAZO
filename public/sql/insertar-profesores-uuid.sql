-- Script para insertar profesores con UUIDs generados automáticamente
-- Ejecutar este SQL en Supabase SQL Editor

-- Primero, eliminar cualquier profesor existente con emails duplicados
DELETE FROM teachers WHERE email IN (
  'laura.gomez@educantabria.es',
  'miguel.ruiz@educantabria.es',
  'carmen.prieto@educantabria.es'
);

-- Insertar profesores (los UUIDs se generan automáticamente)
INSERT INTO teachers (email, nombre, rol, color) VALUES
  ('laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c');

-- Verificar que se insertaron correctamente
SELECT id, email, nombre, rol, color FROM teachers ORDER BY email;

-- Mostrar mensaje de éxito
SELECT '✅ Profesores insertados correctamente con UUIDs válidos' AS mensaje;
