import { useState, useEffect } from 'react';
import { buildSeed, type AppData } from './data/seed';
import Login from './views/Login';
import App from './App';

// Sistema de login simple basado en datos locales
// La integración con Supabase se puede activar más adelante

function getLocalData(): AppData {
  try {
    const raw = localStorage.getItem('trazo-lomloe-v11');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 11) return parsed;
    }
  } catch { /* ignore */ }
  const seed = buildSeed();
  localStorage.setItem('trazo-lomloe-v11', JSON.stringify(seed));
  return seed;
}

export default function Root() {
  const [user, setUser] = useState<{ id: string; nombre: string; rol: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedSession = localStorage.getItem('trazo-session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const data = getLocalData();
    const teacher = data.teachers.find(t => t.email === email);
    
    if (!teacher) return false;
    
    // Password simple para demo: Trazo2025!
    if (password !== 'Trazo2025!') return false;
    
    const session = {
      id: teacher.id,
      nombre: teacher.nombre,
      rol: teacher.rol,
      email: teacher.email,
    };
    
    localStorage.setItem('trazo-session', JSON.stringify(session));
    setUser(session);
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('trazo-session');
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
