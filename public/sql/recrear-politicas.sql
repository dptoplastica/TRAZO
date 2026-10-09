-- Script para recrear políticas RLS (si ya existen)
-- Ejecutar este SQL si obtienes errores de "policy already exists"

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer profesores" ON teachers;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer grupos" ON groups;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer alumnos" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer asignaturas" ON subjects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer programaciones" ON programaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer SA" ON situaciones_aprendizaje;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer unidades" ON units;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer instrumentos" ON instruments;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer calificaciones" ON grades;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer asistencia" ON attendance;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer observaciones" ON observations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer medidas" ON measures;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer recuperaciones" ON recoveries;

DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar profesores" ON teachers;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar profesores" ON teachers;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar grupos" ON groups;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar grupos" ON groups;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar alumnos" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar alumnos" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar asignaturas" ON subjects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar asignaturas" ON subjects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar programaciones" ON programaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar programaciones" ON programaciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar SA" ON situaciones_aprendizaje;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar SA" ON situaciones_aprendizaje;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar unidades" ON units;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar unidades" ON units;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar instrumentos" ON instruments;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar instrumentos" ON instruments;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar calificaciones" ON grades;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar calificaciones" ON grades;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar asistencia" ON attendance;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar asistencia" ON attendance;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar observaciones" ON observations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar observaciones" ON observations;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar medidas" ON measures;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar medidas" ON measures;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar recuperaciones" ON recoveries;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar recuperaciones" ON recoveries;

-- Recrear políticas de lectura
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

-- Recrear políticas de escritura
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

-- Insertar profesores (si no existen)
INSERT INTO teachers (id, email, nombre, rol, color) VALUES
  ('t1', 'laura.gomez@educantabria.es', 'Laura Gómez', 'profesor', '#0e7c66'),
  ('t2', 'miguel.ruiz@educantabria.es', 'Miguel Ruiz', 'profesor', '#2c6e8f'),
  ('t3', 'carmen.prieto@educantabria.es', 'Carmen Prieto', 'admin', '#d9532c')
ON CONFLICT (id) DO NOTHING;

SELECT '✅ Políticas RLS recreadas correctamente' AS mensaje;
