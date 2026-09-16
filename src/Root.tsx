import { useEffect, useState } from 'react';
import { getCurrentUser, type UserProfile } from './lib/auth';
import { supabase } from './lib/supabase';
import Login from './views/Login';
import App from './App';

export default function Root() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario actual al iniciar
    getCurrentUser().then(setUser).finally(() => setLoading(false));
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const profile = await getCurrentUser();
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper bg-blueprint">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-vir text-white shadow-lg shadow-vir/30 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 20 L12 4 L20 20" />
              <path d="M8.2 13.5h7.6" />
              <circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <p className="font-display text-[18px] font-bold text-ink">TRAZO</p>
          <p className="mono mt-2 text-[11px] uppercase tracking-widest text-ink3">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <App user={user} />;
}
