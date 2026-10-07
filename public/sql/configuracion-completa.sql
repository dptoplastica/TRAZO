-- ============================================
-- SCRIPT COMPLETO PARA CONFIGURAR SUPABASE
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TABLAS EXISTENTES
-- ============================================
DROP TABLE IF EXISTS recoveries CASCADE;
DROP TABLE IF EXISTS measures CASCADE;
DROP TABLE IF EXISTS observations CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS instruments CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS situaciones_aprendizaje CASCADE;
DROP TABLE IF EXISTS programaciones CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

-- ============================================
-- PASO 2: CREAR TABLAS CON TEXT IDs
-- ============================================

-- Tabla de profesores
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'profesor')),
  color TEXT DEFAULT '#0e7c66',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de grupos
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,
  tutor_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  dias INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de alumnos
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  base DECIMAL(3,2) DEFAULT 6.5,
  neae TEXT,
  abs_rate DECIMAL(3,2) DEFAULT 0.05,
  hue INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asignaturas
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  corto TEXT NOT NULL,
  etapa TEXT NOT NULL,
  nivel TEXT NOT NULL,
  curriculum_id TEXT NOT NULL,
  teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
  color TEXT DEFAULT '#0e7c66',
  tipo TEXT NOT NULL CHECK (tipo IN ('obligatoria', 'optativa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de programaciones
CREATE TABLE programaciones (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  curso TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Borrador', 'En revisión', 'Finalizada')),
  contexto JSONB DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  ponderaciones JSONB DEFAULT '{}',
  ccalificacion TEXT DEFAULT '',
  anexos JSONB DEFAULT '[]',
  actualizada DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de situaciones de aprendizaje
CREATE TABLE situaciones_aprendizaje (
  id TEXT PRIMARY KEY,
  programacion_id TEXT REFERENCES programaciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  eva INTEGER NOT NULL CHECK (eva IN (1, 2, 3)),
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  sesiones INTEGER NOT NULL,
  justificacion TEXT DEFAULT '',
  reto TEXT DEFAULT '',
  producto TEXT DEFAULT '',
  metodologias TEXT[] DEFAULT '{}',
  agrupamientos TEXT DEFAULT '',
  espacios TEXT DEFAULT '',
  recursos TEXT DEFAULT '',
  diversidad TEXT DEFAULT '',
  evidencias TEXT DEFAULT '',
  criterios TEXT[] DEFAULT '{}',
  objetivos TEXT[] DEFAULT '{}',
  actividades JSONB DEFAULT '[]',
  instrumentos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de unidades didácticas
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  programacion_id TEXT REFERENCES programaciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  sesiones INTEGER NOT NULL,
  sa_ids TEXT[] DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de instrumentos de evaluación
CREATE TABLE instruments (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  peso INTEGER NOT NULL,
  criterio_ids TEXT[] DEFAULT '{}',
  fecha DATE,
  rubrica JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de calificaciones
CREATE TABLE grades (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  instrumento_id TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  value DECIMAL(3,1) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencia
CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('P', 'F', 'R')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de observaciones
CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  texto TEXT NOT NULL,
  autor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de medidas de atención a la diversidad
CREATE TABLE measures (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recuperaciones
CREATE TABLE recoveries (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  criterio_id TEXT NOT NULL,
  actividad TEXT NOT NULL,
  fecha DATE NOT NULL,
  instrumento_id TEXT NOT NULL,
  resultado DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PASO 3: DESACTIVAR RLS (Row Level Security)
-- ============================================
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE programaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE situaciones_aprendizaje DISABLE ROW LEVEL SECURITY;
ALTER TABLE units DISABLE ROW LEVEL SECURITY;
ALTER TABLE instruments DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE measures DISABLE ROW LEVEL SECURITY;
ALTER TABLE recoveries DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 4: INSERTAR DATOS INICIALES
-- ============================================

-- Insertar profesores
INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c');

-- Insertar grupos
INSERT INTO groups (id, nombre, nivel, tutor_id, dias) VALUES
  ('g1', '4º ESO A', '4º ESO', 't1', ARRAY[1, 3]),
  ('g2', '1º Bach A', '1º Bachillerato', 't1', ARRAY[2, 4]),
  ('g3', '2º Bach B', '2º Bachillerato', 't2', ARRAY[1, 4]),
  ('g4', '1º Bach B', '1º Bachillerato', 't2', ARRAY[2, 5]),
  ('g5', '1º Bach C', '1º Bachillerato', 't1', ARRAY[3, 5]),
  ('g6', '2º Bach A', '2º Bachillerato', 't1', ARRAY[1, 3, 4]);

-- Insertar asignaturas
INSERT INTO subjects (id, nombre, corto, etapa, nivel, curriculum_id, teacher_id, group_id, color, tipo) VALUES
  ('m1', 'Educación Plástica, Visual y Audiovisual', 'EPVA', 'ESO', '4º ESO', 'epva-eso', 't1', 'g1', '#d9532c', 'optativa'),
  ('m2', 'Expresión Artística', 'Expr. Artística', 'Bachillerato', '1º Bachillerato', 'ea-bach', 't1', 'g2', '#c98a12', 'obligatoria'),
  ('m3', 'Dibujo Técnico II', 'Dibujo Técnico II', 'Bachillerato', '2º Bachillerato', 'dt-bach', 't2', 'g3', '#2c6e8f', 'obligatoria'),
  ('m4', 'Audiovisual y Multimedia', 'Audiovisual', 'ESO', '4º ESO', 'epva-eso', NULL, 'g1', '#7a5fb0', 'optativa'),
  ('m5', 'Dibujo Técnico I', 'Dibujo Técnico I', 'Bachillerato', '1º Bachillerato', 'dt1-bach', 't2', 'g4', '#0e7c66', 'obligatoria'),
  ('m6', 'Taller de Podcast', 'Podcast', 'Bachillerato', '1º Bachillerato', 'tp-bach', 't1', 'g5', '#a84a6c', 'optativa'),
  ('m7', 'Taller de Cortometraje', 'Cortometraje', 'Bachillerato', '2º Bachillerato', 'tc-bach', 't1', 'g6', '#7a5fb0', 'optativa');

-- Insertar programaciones básicas
INSERT INTO programaciones (id, subject_id, curso, estado, criterios, ponderaciones, ccalificacion, anexos, actualizada) VALUES
  ('p1', 'm1', '2025-26', 'Finalizada', 
   ARRAY['epva.1.1', 'epva.1.2', 'epva.2.1', 'epva.2.2', 'epva.3.1', 'epva.3.2', 'epva.4.1', 'epva.4.2', 'epva.5.1', 'epva.5.2'],
   '{"epva.1.1": 10, "epva.1.2": 10, "epva.2.1": 10, "epva.2.2": 10, "epva.3.1": 10, "epva.3.2": 10, "epva.4.1": 10, "epva.4.2": 10, "epva.5.1": 10, "epva.5.2": 10}',
   'La calificación se obtiene agregando las calificaciones de los instrumentos vinculados a cada criterio.',
   '[]', '2026-01-15'),
  ('p2', 'm2', '2025-26', 'En revisión',
   ARRAY['ea.1.1', 'ea.1.2', 'ea.2.1', 'ea.2.2', 'ea.3.1', 'ea.3.2', 'ea.4.1', 'ea.4.2', 'ea.5.1', 'ea.5.2'],
   '{"ea.1.1": 10, "ea.1.2": 10, "ea.2.1": 10, "ea.2.2": 10, "ea.3.1": 10, "ea.3.2": 10, "ea.4.1": 10, "ea.4.2": 10, "ea.5.1": 10, "ea.5.2": 10}',
   'El proceso creativo documentado tiene carácter central.',
   '[]', '2026-01-15'),
  ('p3', 'm3', '2025-26', 'Borrador',
   ARRAY['dt.1.1', 'dt.1.2', 'dt.2.1', 'dt.2.2', 'dt.3.1', 'dt.3.2', 'dt.4.1', 'dt.4.2'],
   '{"dt.1.1": 12.5, "dt.1.2": 12.5, "dt.2.1": 12.5, "dt.2.2": 12.5, "dt.3.1": 12.5, "dt.3.2": 12.5, "dt.4.1": 12.5, "dt.4.2": 12.5}',
   'Las láminas y pruebas prácticas se califican con escalas de valoración.',
   '[]', '2026-01-15'),
  ('p4', 'm5', '2025-26', 'En revisión',
   ARRAY['dt1.1.1', 'dt1.2.1', 'dt1.2.2', 'dt1.2.3', 'dt1.3.1', 'dt1.3.2', 'dt1.3.3', 'dt1.3.4', 'dt1.3.5', 'dt1.4.1', 'dt1.4.2', 'dt1.5.1', 'dt1.5.2'],
   '{"dt1.1.1": 5, "dt1.2.1": 8, "dt1.2.2": 8, "dt1.2.3": 8, "dt1.3.1": 10, "dt1.3.2": 8, "dt1.3.3": 5, "dt1.3.4": 5, "dt1.3.5": 3, "dt1.4.1": 8, "dt1.4.2": 7, "dt1.5.1": 8, "dt1.5.2": 7}',
   'Las láminas se califican con escalas de valoración publicadas.',
   '[]', '2026-01-15'),
  ('p5', 'm6', '2025-26', 'Finalizada',
   ARRAY['tp.1.1', 'tp.1.2', 'tp.2.1', 'tp.2.2', 'tp.3.1', 'tp.3.2', 'tp.3.3', 'tp.4.1', 'tp.4.2', 'tp.5.1', 'tp.5.2'],
   '{"tp.1.1": 9, "tp.1.2": 8, "tp.2.1": 10, "tp.2.2": 10, "tp.3.1": 10, "tp.3.2": 13, "tp.3.3": 8, "tp.4.1": 10, "tp.4.2": 8, "tp.5.1": 7, "tp.5.2": 7}',
   'El proyecto final de podcast tiene un peso del 40%.',
   '[]', '2026-01-15'),
  ('p6', 'm7', '2025-26', 'En revisión',
   ARRAY['tc.1.1', 'tc.1.2', 'tc.2.1', 'tc.2.2', 'tc.3.1', 'tc.3.2', 'tc.4.1', 'tc.4.2', 'tc.5.1', 'tc.5.2', 'tc.5.3'],
   '{"tc.1.1": 8, "tc.1.2": 7, "tc.2.1": 8, "tc.2.2": 8, "tc.3.1": 7, "tc.3.2": 8, "tc.4.1": 10, "tc.4.2": 7, "tc.5.1": 10, "tc.5.2": 10, "tc.5.3": 7}',
   'El cortometraje final tiene un peso del 50%.',
   '[]', '2026-01-15');

-- ============================================
-- PASO 5: VERIFICAR RESULTADO
-- ============================================
SELECT '✅ CONFIGURACIÓN COMPLETADA' AS mensaje;

SELECT 'Profesores:' AS tabla, COUNT(*) AS cantidad FROM teachers
UNION ALL
SELECT 'Grupos:', COUNT(*) FROM groups
UNION ALL
SELECT 'Asignaturas:', COUNT(*) FROM subjects
UNION ALL
SELECT 'Programaciones:', COUNT(*) FROM programaciones;

SELECT '🎉 Ahora ejecuta el script de migración en la consola del navegador' AS siguiente_paso;
