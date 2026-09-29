import { useState, useEffect } from 'react';
import { buildSeed, type AppData } from './data/seed';
import Login from './views/Login';
import App from './App';
import { signIn, signOut, getCurrentUser } from './lib/auth';

function getLocalData(): AppData {
  console.log('📦 Cargando datos locales...');
  try {
    const raw = localStorage.getItem('trazo-lomloe-v23');
    console.log('📦 Datos en localStorage:', raw ? 'Encontrados' : 'No encontrados');
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log('📦 Versión encontrada:', parsed.version);
      if (parsed && parsed.version === 23) {
        console.log('✅ Usando datos de localStorage');
        return parsed;
      }
    }
  } catch (e) {
    console.error('❌ Error cargando localStorage:', e);
  }
  console.log('🆕 Generando datos nuevos...');
  const seed = buildSeed();
  console.log('🆕 Datos generados:', seed);
  localStorage.setItem('trazo-lomloe-v23', JSON.stringify(seed));
  return seed;
}

export default function Root() {
  const [user, setUser] = useState<{ id: string; nombre: string; rol: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar datos si no existen
    console.log('🚀 Inicializando aplicación...');
    const existingData = localStorage.getItem('trazo-lomloe-v23');
    if (!existingData) {
      console.log('📦 No hay datos, generando datos iniciales...');
      const seed = buildSeed();
      localStorage.setItem('trazo-lomloe-v23', JSON.stringify(seed));
      console.log('✅ Datos iniciales guardados');
    } else {
      console.log('✅ Datos ya existen en localStorage');
    }

    // Verificar sesión de Supabase
    const checkSession = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Intentando login con Supabase:', { email });
    
    const { user: authUser, error } = await signIn(email, password);
    
    if (error || !authUser) {
      console.error('❌ Error de autenticación:', error);
      return false;
    }
    
    console.log('✅ Login exitoso:', authUser);
    setUser(authUser);
    return true;
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

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
    return <Login onLogin={handleLogin} />;
  }

  return <App currentUser={user} onLogout={handleLogout} />;
}
