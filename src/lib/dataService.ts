import { supabase } from './supabase';
import type { AppData } from '../data/seed';

// Cargar todos los datos desde Supabase
export async function loadAppData(): Promise<AppData | null> {
  try {
    console.log('🔄 Cargando datos desde Supabase...');

    // Cargar todas las tablas en paralelo
    const [
      teachersRes,
      groupsRes,
      studentsRes,
      subjectsRes,
      programacionesRes,
      sasRes,
      unitsRes,
      instrumentsRes,
      gradesRes,
      attendanceRes,
      observationsRes,
      measuresRes,
      recoveriesRes,
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

    // Verificar errores
    const errors = [
      teachersRes.error,
      groupsRes.error,
      studentsRes.error,
      subjectsRes.error,
      programacionesRes.error,
      sasRes.error,
      unitsRes.error,
      instrumentsRes.error,
      gradesRes.error,
      attendanceRes.error,
      observationsRes.error,
      measuresRes.error,
      recoveriesRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('❌ Errores al cargar datos:', errors);
      return null;
    }

    // Construir objeto AppData
    const data: AppData = {
      version: 23,
      role: 'profesor',
      teacherId: teachersRes.data?.[0]?.id || '',
      cursoLabel: '2025-26',
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

    console.log('✅ Datos cargados desde Supabase');
    return data;
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    return null;
  }
}

// Guardar todos los datos en Supabase
export async function saveAppData(data: AppData): Promise<boolean> {
  try {
    console.log('💾 Guardando datos en Supabase...');

    // Guardar cada tabla
    const operations = [
      supabase.from('teachers').upsert(data.teachers, { onConflict: 'id' }),
      supabase.from('groups').upsert(data.groups, { onConflict: 'id' }),
      supabase.from('students').upsert(data.students, { onConflict: 'id' }),
      supabase.from('subjects').upsert(data.subjects, { onConflict: 'id' }),
      supabase.from('programaciones').upsert(data.programaciones, { onConflict: 'id' }),
      supabase.from('situaciones_aprendizaje').upsert(data.sas, { onConflict: 'id' }),
      supabase.from('units').upsert(data.units, { onConflict: 'id' }),
      supabase.from('instruments').upsert(data.instruments, { onConflict: 'id' }),
      supabase.from('grades').upsert(data.grades, { onConflict: 'id' }),
      supabase.from('attendance').upsert(data.attendance, { onConflict: 'id' }),
      supabase.from('observations').upsert(data.observations, { onConflict: 'id' }),
      supabase.from('measures').upsert(data.measures, { onConflict: 'id' }),
      supabase.from('recoveries').upsert(data.recoveries, { onConflict: 'id' }),
    ];

    const results = await Promise.all(operations);
    const errors = results.map(r => r.error).filter(Boolean);

    if (errors.length > 0) {
      console.error('❌ Errores al guardar:', errors);
      return false;
    }

    console.log('✅ Datos guardados en Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error al guardar datos:', error);
    return false;
  }
}

// Guardar solo una tabla específica
export async function saveTable(tableName: string, data: any[]): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).upsert(data, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error al guardar ${tableName}:`, error);
      return false;
    }

    console.log(`✅ ${tableName} guardado en Supabase`);
    return true;
  } catch (error) {
    console.error(`❌ Error al guardar ${tableName}:`, error);
    return false;
  }
}

// Suscribirse a cambios en tiempo real
export function subscribeToChanges(callback: () => void) {
  const channel = supabase
    .channel('app-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'programaciones' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'situaciones_aprendizaje' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'units' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'instruments' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'observations' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'measures' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'recoveries' }, callback)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
