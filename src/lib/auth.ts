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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('*, centros(id, nombre, codigo)')
    .eq('id', user.id)
    .single();
  
  if (error || !profile) return null;
  
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
