-- Script para insertar datos iniciales en Supabase
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- 1. INSERTAR PROFESORES
-- ============================================
INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c');

-- ============================================
-- 2. INSERTAR GRUPOS
-- ============================================
INSERT INTO groups (id, nombre, nivel, tutor_id, dias) VALUES
  ('g1', '4º ESO A', '4º ESO', 't1', ARRAY[1, 3]),
  ('g2', '1º Bach A', '1º Bachillerato', 't1', ARRAY[2, 4]),
  ('g3', '2º Bach B', '2º Bachillerato', 't2', ARRAY[1, 4]),
  ('g4', '1º Bach B', '1º Bachillerato', 't2', ARRAY[2, 5]),
  ('g5', '1º Bach C', '1º Bachillerato', 't1', ARRAY[3, 5]),
  ('g6', '2º Bach A', '2º Bachillerato', 't1', ARRAY[1, 3, 4]);

-- ============================================
-- 3. INSERTAR ASIGNATURAS
-- ============================================
INSERT INTO subjects (id, nombre, corto, etapa, nivel, curriculum_id, teacher_id, group_id, color, tipo) VALUES
  ('m1', 'Educación Plástica, Visual y Audiovisual', 'EPVA', 'ESO', '4º ESO', 'epva-eso', 't1', 'g1', '#d9532c', 'optativa'),
  ('m2', 'Expresión Artística', 'Expr. Artística', 'Bachillerato', '1º Bachillerato', 'ea-bach', 't1', 'g2', '#c98a12', 'obligatoria'),
  ('m3', 'Dibujo Técnico II', 'Dibujo Técnico II', 'Bachillerato', '2º Bachillerato', 'dt-bach', 't2', 'g3', '#2c6e8f', 'obligatoria'),
  ('m4', 'Audiovisual y Multimedia', 'Audiovisual', 'ESO', '4º ESO', 'epva-eso', NULL, 'g1', '#7a5fb0', 'optativa'),
  ('m5', 'Dibujo Técnico I', 'Dibujo Técnico I', 'Bachillerato', '1º Bachillerato', 'dt1-bach', 't2', 'g4', '#0e7c66', 'obligatoria'),
  ('m6', 'Taller de Podcast', 'Podcast', 'Bachillerato', '1º Bachillerato', 'tp-bach', 't1', 'g5', '#a84a6c', 'optativa'),
  ('m7', 'Taller de Cortometraje', 'Cortometraje', 'Bachillerato', '2º Bachillerato', 'tc-bach', 't1', 'g6', '#7a5fb0', 'optativa');

-- ============================================
-- 4. INSERTAR PROGRAMACIONES
-- ============================================
INSERT INTO programaciones (id, subject_id, curso, estado, contexto, criterios, ponderaciones, ccalificacion, anexos, actualizada) VALUES
  ('p1', 'm1', '2025-26', 'Finalizada', 
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['epva.1.1', 'epva.1.2', 'epva.2.1', 'epva.2.2', 'epva.3.1', 'epva.3.2', 'epva.4.1', 'epva.4.2', 'epva.5.1', 'epva.5.2'],
   '{"epva.1.1": 10, "epva.1.2": 10, "epva.2.1": 10, "epva.2.2": 10, "epva.3.1": 10, "epva.3.2": 10, "epva.4.1": 10, "epva.4.2": 10, "epva.5.1": 10, "epva.5.2": 10}',
   'La calificación se obtiene agregando las calificaciones de los instrumentos vinculados a cada criterio.',
   '[]', '2026-01-15'),
  ('p2', 'm2', '2025-26', 'En revisión',
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['ea.1.1', 'ea.1.2', 'ea.2.1', 'ea.2.2', 'ea.3.1', 'ea.3.2', 'ea.4.1', 'ea.4.2', 'ea.5.1', 'ea.5.2'],
   '{"ea.1.1": 10, "ea.1.2": 10, "ea.2.1": 10, "ea.2.2": 10, "ea.3.1": 10, "ea.3.2": 10, "ea.4.1": 10, "ea.4.2": 10, "ea.5.1": 10, "ea.5.2": 10}',
   'El proceso creativo documentado tiene carácter central.',
   '[]', '2026-01-15'),
  ('p3', 'm3', '2025-26', 'Borrador',
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['dt.1.1', 'dt.1.2', 'dt.2.1', 'dt.2.2', 'dt.3.1', 'dt.3.2', 'dt.4.1', 'dt.4.2'],
   '{"dt.1.1": 12.5, "dt.1.2": 12.5, "dt.2.1": 12.5, "dt.2.2": 12.5, "dt.3.1": 12.5, "dt.3.2": 12.5, "dt.4.1": 12.5, "dt.4.2": 12.5}',
   'Las láminas y pruebas prácticas se califican con escalas de valoración.',
   '[]', '2026-01-15'),
  ('p4', 'm5', '2025-26', 'En revisión',
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['dt1.1.1', 'dt1.2.1', 'dt1.2.2', 'dt1.2.3', 'dt1.3.1', 'dt1.3.2', 'dt1.3.3', 'dt1.3.4', 'dt1.3.5', 'dt1.4.1', 'dt1.4.2', 'dt1.5.1', 'dt1.5.2'],
   '{"dt1.1.1": 5, "dt1.2.1": 8, "dt1.2.2": 8, "dt1.2.3": 8, "dt1.3.1": 10, "dt1.3.2": 8, "dt1.3.3": 5, "dt1.3.4": 5, "dt1.3.5": 3, "dt1.4.1": 8, "dt1.4.2": 7, "dt1.5.1": 8, "dt1.5.2": 7}',
   'Las láminas se califican con escalas de valoración publicadas.',
   '[]', '2026-01-15'),
  ('p5', 'm6', '2025-26', 'Finalizada',
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['tp.1.1', 'tp.1.2', 'tp.2.1', 'tp.2.2', 'tp.3.1', 'tp.3.2', 'tp.3.3', 'tp.4.1', 'tp.4.2', 'tp.5.1', 'tp.5.2'],
   '{"tp.1.1": 9, "tp.1.2": 8, "tp.2.1": 10, "tp.2.2": 10, "tp.3.1": 10, "tp.3.2": 13, "tp.3.3": 8, "tp.4.1": 10, "tp.4.2": 8, "tp.5.1": 7, "tp.5.2": 7}',
   'El proyecto final de podcast tiene un peso del 40%.',
   '[]', '2026-01-15'),
  ('p6', 'm7', '2025-26', 'En revisión',
   '{"centro": "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.", "entorno": "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.", "alumnado": "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.", "recursos": "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.", "diversidad": "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación."}',
   ARRAY['tc.1.1', 'tc.1.2', 'tc.2.1', 'tc.2.2', 'tc.3.1', 'tc.3.2', 'tc.4.1', 'tc.4.2', 'tc.5.1', 'tc.5.2', 'tc.5.3'],
   '{"tc.1.1": 8, "tc.1.2": 7, "tc.2.1": 8, "tc.2.2": 8, "tc.3.1": 7, "tc.3.2": 8, "tc.4.1": 10, "tc.4.2": 7, "tc.5.1": 10, "tc.5.2": 10, "tc.5.3": 7}',
   'El cortometraje final tiene un peso del 50%.',
   '[]', '2026-01-15');

-- ============================================
-- VERIFICAR INSERCIÓN
-- ============================================
SELECT '✅ Datos iniciales insertados correctamente' AS mensaje;
SELECT COUNT(*) AS profesores FROM teachers;
SELECT COUNT(*) AS grupos FROM groups;
SELECT COUNT(*) AS asignaturas FROM subjects;
SELECT COUNT(*) AS programaciones FROM programaciones;
