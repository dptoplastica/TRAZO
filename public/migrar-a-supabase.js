// Script de migración de localStorage a Supabase
// Ejecutar en la consola del navegador (F12)

(async function migrarDatos() {
  console.log('🚀 Iniciando migración de datos a Supabase...\n');

  // Importar Supabase
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    'https://hhsmjmgxarxofyigystd.supabase.co',
    'sb_publishable_q8GojCWi5kKiybPp_kd6yQ_DlD-sJ-o'
  );

  // Cargar datos desde localStorage
  const localData = JSON.parse(localStorage.getItem('trazo-lomloe-v24'));
  
  if (!localData) {
    console.error('❌ No hay datos en localStorage');
    return;
  }

  console.log('✅ Datos cargados desde localStorage');
  console.log(`📊 ${localData.teachers.length} profesores`);
  console.log(`📊 ${localData.groups.length} grupos`);
  console.log(`📊 ${localData.students.length} alumnos`);
  console.log(`📊 ${localData.subjects.length} asignaturas`);
  console.log(`📊 ${localData.programaciones.length} programaciones`);
  console.log(`📊 ${localData.sas.length} situaciones de aprendizaje`);
  console.log('');

  // Función para subir datos
  async function uploadTable(tableName, data) {
    console.log(`📤 Subiendo ${tableName}...`);
    const { error } = await supabase.from(tableName).upsert(data, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error subiendo ${tableName}:`, error.message);
      return false;
    } else {
      console.log(`✅ ${tableName} subido correctamente (${data.length} registros)`);
      return true;
    }
  }

  // Subir todas las tablas
  const results = await Promise.all([
    uploadTable('teachers', localData.teachers),
    uploadTable('groups', localData.groups),
    uploadTable('students', localData.students),
    uploadTable('subjects', localData.subjects),
    uploadTable('programaciones', localData.programaciones),
    uploadTable('situaciones_aprendizaje', localData.sas),
    uploadTable('units', localData.units),
    uploadTable('instruments', localData.instruments),
    uploadTable('grades', localData.grades),
    uploadTable('attendance', localData.attendance),
    uploadTable('observations', localData.observations),
    uploadTable('measures', localData.measures),
    uploadTable('recoveries', localData.recoveries),
  ]);

  console.log('');
  const successCount = results.filter(r => r).length;
  const totalCount = results.length;

  if (successCount === totalCount) {
    console.log('✅ ¡Migración completada exitosamente!');
    console.log(`📊 ${successCount}/${totalCount} tablas subidas correctamente`);
    console.log('');
    console.log('🔄 Recargando datos desde Supabase...');
    
    // Recargar datos desde Supabase
    const [
      teachersRes, groupsRes, studentsRes, subjectsRes, programacionesRes,
      sasRes, unitsRes, instrumentsRes, gradesRes, attendanceRes,
      observationsRes, measuresRes, recoveriesRes
    ] = await Promise.all([
      supabase.from('teachers').select('*'),
      supabase.from('groups').select('*'),
      supabase.from('students').select('*'),
      supabase.from('subjects').select('*'),
      supabase.from('programaciones').select('*'),
      supabase.from('situaciones_aprendizaje').select('*'),
      supabase.from('units').select('*'),
      supabase.from('instruments').select('*'),
      supabase.from('grades').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('observations').select('*'),
      supabase.from('measures').select('*'),
      supabase.from('recoveries').select('*'),
    ]);

    const newData = {
      version: 24,
      role: localData.role,
      teacherId: localData.teacherId,
      cursoLabel: localData.cursoLabel,
      teachers: teachersRes.data || [],
      groups: groupsRes.data || [],
      students: studentsRes.data || [],
      subjects: subjectsRes.data || [],
      programaciones: programacionesRes.data || [],
      sas: sasRes.data || [],
      units: unitsRes.data || [],
      instruments: instrumentsRes.data || [],
      grades: gradesRes.data || [],
      attendance: attendanceRes.data || [],
      observations: observationsRes.data || [],
      measures: measuresRes.data || [],
      recoveries: recoveriesRes.data || [],
    };

    localStorage.setItem('trazo-lomloe-v24', JSON.stringify(newData));
    console.log('✅ Datos recargados desde Supabase');
    console.log('');
    console.log('🎉 ¡Listo! Recarga la página (Ctrl + Shift + R) para ver los cambios');
  } else {
    console.error(`❌ Migración incompleta: ${successCount}/${totalCount} tablas`);
    console.error('Revisa los errores arriba y ejecuta el SQL de corrección');
  }
})();
