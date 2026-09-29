import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'profesor';
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: 'No se pudo obtener el usuario' };
  }

  // Obtener datos del profesor desde la tabla teachers
  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('*')
    .eq('email', email)
    .single();

  if (teacherError || !teacher) {
    return { user: null, error: 'Usuario no encontrado en la base de datos' };
  }

  return {
    user: {
      id: teacher.id,
      email: teacher.email,
      nombre: teacher.nombre,
      rol: teacher.rol,
    },
    error: null,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('email', user.email)
    .single();

  if (!teacher) return null;

  return {
    id: teacher.id,
    email: teacher.email,
    nombre: teacher.nombre,
    rol: teacher.rol,
  };
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}
