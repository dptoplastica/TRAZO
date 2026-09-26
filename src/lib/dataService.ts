import { supabase } from './supabase';
import { type AppData } from '../data/seed';

const STORAGE_KEY = 'trazo-lomloe-v19';

// Función para cargar datos desde Supabase
export async function loadDataFromSupabase(userId: string): Promise<AppData | null> {
  try {
    // Intentar cargar desde Supabase
    const { data, error } = await supabase
      .from('programaciones')
      .select('*')
      .limit(1);

    if (error) {
      console.warn('Error cargando desde Supabase, usando localStorage:', error);
      return null;
    }

    // Si no hay datos en Supabase, retornar null
    if (!data || data.length === 0) {
      return null;
    }

    // Cargar todos los datos desde Supabase
    const [teachers, groups, students, subjects, programaciones, sa, units, instruments, grades, attendance, observations, measures, recoveries] = await Promise.all([
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

    // Construir el objeto AppData
    const appData: AppData = {
      version: 19,
      role: 'profesor',
      teacherId: userId,
      cursoLabel: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(2),
      teachers: teachers.data || [],
      groups: groups.data || [],
      students: students.data || [],
      subjects: subjects.data || [],
      programaciones: programaciones.data || [],
      sas: sa.data || [],
      units: units.data || [],
      instruments: instruments.data || [],
      grades: grades.data || [],
      attendance: attendance.data || [],
      observations: observations.data || [],
      measures: measures.data || [],
      recoveries: recoveries.data || [],
    };

    return appData;
  } catch (error) {
    console.error('Error cargando datos desde Supabase:', error);
    return null;
  }
}

// Función para guardar datos en Supabase
export async function saveDataToSupabase(data: AppData): Promise<boolean> {
  try {
    // Guardar cada tabla en Supabase
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
    const hasErrors = results.some(r => r.error);

    if (hasErrors) {
      console.warn('Algunas operaciones fallaron en Supabase, guardando en localStorage como fallback');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return false;
    }

    // También guardar en localStorage como backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error guardando en Supabase:', error);
    // Fallback a localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return false;
  }
}

// Función para cargar datos (primero Supabase, luego localStorage)
export function loadLocalData(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 19) return parsed;
    }
  } catch (error) {
    console.error('Error cargando desde localStorage:', error);
  }
  return null;
}

// Función para guardar datos en localStorage
export function saveLocalData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
}

// Función para autenticar usuario con Supabase
export async function signInWithSupabase(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error de autenticación:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error inesperado en autenticación:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

// Función para cerrar sesión
export async function signOutFromSupabase() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return { success: false, error };
  }
}

// Función para verificar si hay sesión activa
export async function checkSupabaseSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return null;
  }
}
