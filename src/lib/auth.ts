import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'jefe_departamento' | 'profesor';
  centro_id: string;
  color: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) return null;
  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('id, email, nombre, rol, centro_id, color')
    .eq('id', user.id)
    .single();
  if (error || !profile) return null;
  return profile as UserProfile;
}

export async function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  return supabase.auth.onAuthStateChange(async () => {
    const profile = await getCurrentUser();
    callback(profile);
  });
}
