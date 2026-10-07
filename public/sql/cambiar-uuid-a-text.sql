-- Script para modificar las tablas y usar TEXT en lugar de UUID
-- Esto permite que los datos locales funcionen con Supabase
-- Ejecutar en Supabase SQL Editor

-- Deshabilitar RLS temporalmente
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

-- Eliminar tablas existentes
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

-- Recrear tablas con TEXT en lugar de UUID
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'profesor')),
  color TEXT DEFAULT '#0e7c66',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,
  tutor_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  dias INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE grades (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  instrumento_id TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  value DECIMAL(3,1) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('P', 'F', 'R')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  texto TEXT NOT NULL,
  autor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE measures (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Insertar profesores iniciales
INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c')
ON CONFLICT (id) DO NOTHING;

-- Verificar que todo está correcto
SELECT '✅ Tablas recreadas con TEXT IDs' AS mensaje;
SELECT COUNT(*) AS profesores FROM teachers;
