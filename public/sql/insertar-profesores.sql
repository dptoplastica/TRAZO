-- Script para insertar profesores con UUIDs válidos
-- Ejecutar este SQL en Supabase SQL Editor

-- Insertar profesores (los UUIDs se generan automáticamente)
INSERT INTO teachers (email, nombre, rol, color) VALUES
  ('laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c')
ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT id, email, nombre, rol, color FROM teachers;

SELECT '✅ Profesores insertados correctamente' AS mensaje;
