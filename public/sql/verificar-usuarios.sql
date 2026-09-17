-- Verificar usuarios en auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN ('laura.gomez@educantabria.es', 'miguel.ruiz@educantabria.es', 'carmen.prieto@educantabria.es');

-- Verificar perfiles en la tabla usuarios
SELECT u.id, u.email, u.nombre, u.rol, c.nombre as centro
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN ('laura.gomez@educantabria.es', 'miguel.ruiz@educantabria.es', 'carmen.prieto@educantabria.es');
