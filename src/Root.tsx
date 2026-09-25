import { useState, useEffect } from 'react';
import { buildSeed, type AppData } from './data/seed';
import Login from './views/Login';
import App from './App';

function getLocalData(): AppData {
  console.log('📦 Cargando datos locales...');
  try {
    const raw = localStorage.getItem('trazo-lomloe-v19');
    console.log('📦 Datos en localStorage:', raw ? 'Encontrados' : 'No encontrados');
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log('📦 Versión encontrada:', parsed.version);
      if (parsed && parsed.version === 19) {
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
  localStorage.setItem('trazo-lomloe-v19', JSON.stringify(seed));
  return seed;
}

export default function Root() {
  const [user, setUser] = useState<{ id: string; nombre: string; rol: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar datos si no existen
    console.log('🚀 Inicializando aplicación...');
    const existingData = localStorage.getItem('trazo-lomloe-v19');
    if (!existingData) {
      console.log('📦 No hay datos, generando datos iniciales...');
      const seed = buildSeed();
      localStorage.setItem('trazo-lomloe-v19', JSON.stringify(seed));
      console.log('✅ Datos iniciales guardados');
    } else {
      console.log('✅ Datos ya existen en localStorage');
    }

    // Verificar sesión guardada en localStorage
    const savedSession = localStorage.getItem('trazo-session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    console.log('🔐 Intentando login con:', { email, password });
    
    // Autenticación local directa
    const data = getLocalData();
    console.log('📊 Datos cargados:', data);
    console.log('👥 Profesores disponibles:', data.teachers);
    
    const teacher = data.teachers.find(t => t.email === email);
    console.log('🔍 Profesor encontrado:', teacher);
    
    if (!teacher) {
      console.error('❌ Email no encontrado');
      return false;
    }
    if (password !== 'Trazo2025!') {
      console.error('❌ Contraseña incorrecta');
      return false;
    }
    
    const session = {
      id: teacher.id,
      nombre: teacher.nombre,
      rol: teacher.rol,
      email: teacher.email,
    };
    console.log('✅ Login exitoso:', session);
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
