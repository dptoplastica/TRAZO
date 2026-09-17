-- Crear perfiles de usuarios en la tabla usuarios
-- IMPORTANTE: Primero verifica que los usuarios existan en Authentication

INSERT INTO usuarios (id, email, nombre, rol, centro_id, color)
VALUES 
  (
    (SELECT id FROM auth.users WHERE email = 'laura.gomez@educantabria.es'),
    'laura.gomez@educantabria.es',
    'Laura Gómez',
    'profesor',
    (SELECT id FROM centros WHERE codigo = '39014130'),
    '#0e7c66'
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'miguel.ruiz@educantabria.es'),
    'miguel.ruiz@educantabria.es',
    'Miguel Ruiz',
    'profesor',
    (SELECT id FROM centros WHERE codigo = '39014130'),
    '#2c6e8f'
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'carmen.prieto@educantabria.es'),
    'carmen.prieto@educantabria.es',
    'Carmen Prieto',
    'jefe_departamento',
    (SELECT id FROM centros WHERE codigo = '39014130'),
    '#d9532c'
  )
ON CONFLICT (id) DO NOTHING;

-- Verificar que se crearon correctamente
SELECT u.id, u.email, u.nombre, u.rol, c.nombre as centro
FROM usuarios u
LEFT JOIN centros c ON c.id = u.centro_id
WHERE u.email IN ('laura.gomez@educantabria.es', 'miguel.ruiz@educantabria.es', 'carmen.prieto@educantabria.es');
