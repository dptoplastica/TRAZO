import { supabase } from './supabase';

// VERSION 2.0 - Sin consultas a centros para evitar error 500

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'jefe_departamento' | 'profesor';
  centro_id: string;
  color: string;
}

export async function signIn(email: string, password: string) {
  console.log('[v2.0] Intentando login con:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('[v2.0] Error en login:', error.message);
  } else {
    console.log('[v2.0] Login exitoso, user ID:', data.user?.id);
  }
  
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  console.log('[v2.0] Obteniendo usuario actual...');
  
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  
  if (!user) {
    console.log('[v2.0] No hay usuario autenticado');
    return null;
  }
  
  console.log('[v2.0] Usuario autenticado:', user.email, 'ID:', user.id);
  
  // Consulta SIMPLE sin JOIN - solo obtiene datos del usuario
  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('id, email, nombre, rol, centro_id, color')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('[v2.0] Error al obtener perfil:', error.message);
    console.error('[v2.0] Detalles completos:', JSON.stringify(error, null, 2));
    return null;
  }
  
  if (!profile) {
    console.error('[v2.0] No se encontro perfil para el usuario', user.id);
    return null;
  }
  
  console.log('[v2.0] Perfil obtenido:', profile.nombre, profile.rol);
  return profile as UserProfile;
}

export async function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getCurrentUser();
      callback(profile);
    } else {
      callback(null);
    }
  });
}
