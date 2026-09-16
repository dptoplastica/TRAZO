import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'jefe_departamento' | 'profesor';
  centro_id: string;
  color: string;
  centros?: {
    id: string;
    nombre: string;
    codigo: string;
  };
}

export async function signIn(email: string, password: string) {
  console.log('🔐 Intentando login con:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('❌ Error en login:', error.message);
  } else {
    console.log('✅ Login exitoso, user ID:', data.user?.id);
  }
  
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  console.log('👤 Obteniendo usuario actual...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('⚠️ No hay usuario autenticado');
    return null;
  }
  
  console.log('✅ Usuario autenticado:', user.email, 'ID:', user.id);
  
  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('*, centros(id, nombre, codigo)')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('❌ Error al obtener perfil:', error.message);
    console.error('Detalles del error:', error);
    return null;
  }
  
  if (!profile) {
    console.error('⚠️ No se encontró perfil para el usuario', user.id);
    return null;
  }
  
  console.log('✅ Perfil obtenido:', profile.nombre, profile.rol);
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
