-- Esquema SQL para TRAZO - Sistema de Programación Didáctica LOMLOE
-- Ejecutar este SQL en el SQL Editor de Supabase

-- Tabla de profesores
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'profesor')),
  color TEXT DEFAULT '#0e7c66',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de grupos
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL,
  tutor_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  dias INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de alumnos
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  base DECIMAL(3,2) DEFAULT 6.5,
  neae TEXT,
  abs_rate DECIMAL(3,2) DEFAULT 0.05,
  hue INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asignaturas
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  corto TEXT NOT NULL,
  etapa TEXT NOT NULL,
  nivel TEXT NOT NULL,
  curriculum_id TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  color TEXT DEFAULT '#0e7c66',
  tipo TEXT NOT NULL CHECK (tipo IN ('obligatoria', 'optativa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de programaciones
CREATE TABLE IF NOT EXISTS programaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  curso TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Borrador', 'En revisión', 'Finalizada')),
  contexto JSONB DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  ponderaciones JSONB DEFAULT '{}',
  ccalificacion TEXT DEFAULT '',
  actualizada DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de situaciones de aprendizaje
CREATE TABLE IF NOT EXISTS situaciones_aprendizaje (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programacion_id UUID REFERENCES programaciones(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programacion_id UUID REFERENCES programaciones(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  sesiones INTEGER NOT NULL,
  sa_ids TEXT[] DEFAULT '{}',
  criterios TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de instrumentos de evaluación
CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  peso INTEGER NOT NULL,
  criterio_ids TEXT[] DEFAULT '{}',
  fecha DATE,
  rubrica JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de calificaciones
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  instrumento_id TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  value DECIMAL(3,1) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencia
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('P', 'F', 'R')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de observaciones
CREATE TABLE IF NOT EXISTS observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  texto TEXT NOT NULL,
  autor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de medidas de atención a la diversidad
CREATE TABLE IF NOT EXISTS measures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recuperaciones
CREATE TABLE IF NOT EXISTS recoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  criterio_id TEXT NOT NULL,
  actividad TEXT NOT NULL,
  fecha DATE NOT NULL,
  instrumento_id TEXT NOT NULL,
  resultado DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_students_group ON students(group_id);
CREATE INDEX IF NOT EXISTS idx_subjects_group ON subjects(group_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_programaciones_subject ON programaciones(subject_id);
CREATE INDEX IF NOT EXISTS idx_sa_programacion ON situaciones_aprendizaje(programacion_id);
CREATE INDEX IF NOT EXISTS idx_units_programacion ON units(programacion_id);
CREATE INDEX IF NOT EXISTS idx_instruments_subject ON instruments(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_group ON attendance(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_observations_student ON observations(student_id);
CREATE INDEX IF NOT EXISTS idx_measures_student ON measures(student_id);
CREATE INDEX IF NOT EXISTS idx_measures_group ON measures(group_id);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE programaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE situaciones_aprendizaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE recoveries ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir lectura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden leer profesores" ON teachers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer grupos" ON groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer alumnos" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer asignaturas" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer programaciones" ON programaciones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer SA" ON situaciones_aprendizaje FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer unidades" ON units FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer instrumentos" ON instruments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer calificaciones" ON grades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer asistencia" ON attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer observaciones" ON observations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer medidas" ON measures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden leer recuperaciones" ON recoveries FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para permitir escritura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden insertar profesores" ON teachers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar profesores" ON teachers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar grupos" ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar grupos" ON groups FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar alumnos" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar alumnos" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar asignaturas" ON subjects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar asignaturas" ON subjects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar programaciones" ON programaciones FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar programaciones" ON programaciones FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar SA" ON situaciones_aprendizaje FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar SA" ON situaciones_aprendizaje FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar unidades" ON units FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar unidades" ON units FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar instrumentos" ON instruments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar instrumentos" ON instruments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar calificaciones" ON grades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar calificaciones" ON grades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar asistencia" ON attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar asistencia" ON attendance FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar observaciones" ON observations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar observaciones" ON observations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar medidas" ON measures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar medidas" ON measures FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden insertar recuperaciones" ON recoveries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden actualizar recuperaciones" ON recoveries FOR UPDATE USING (auth.role() = 'authenticated');

-- Datos iniciales de profesores
INSERT INTO teachers (email, nombre, rol, color) VALUES
  ('carmen.prieto@educantabria.es', 'Carmen Prieto Fernández', 'admin', '#d9532c'),
  ('laura.gomez@educantabria.es', 'Laura Gómez Sánchez', 'profesor', '#0e7c66'),
  ('miguel.ruiz@educantabria.es', 'Miguel Ruiz Martínez', 'profesor', '#2c6e8f')
ON CONFLICT (email) DO NOTHING;
