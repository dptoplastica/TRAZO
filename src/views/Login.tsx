import { useState } from 'react';
import { Ic } from '../components/ui';

interface LoginProps { onLogin: (email: string, password: string) => Promise<boolean>; }

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await onLogin(email, password);
      if (!success) setError('Email o contraseña incorrectos');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper bg-blueprint p-4">
      <div className="card p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vir text-white shadow-lg shadow-vir/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 20 L12 4 L20 20" /><path d="M8.2 13.5h7.6" /><circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-[24px] font-extrabold leading-none tracking-tight text-ink">TRAZO</h1>
            <p className="mono mt-1 text-[9.5px] uppercase tracking-[0.22em] text-ink3">Suite didáctica LOMLOE</p>
          </div>
        </div>
        <p className="text-[13px] text-ink2 mb-6">Inicia sesión para acceder a la plataforma de programación y evaluación.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="lbl">Email</label><input type="email" className="inp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu.email@educantabria.es" required autoFocus /></div>
          <div><label className="lbl">Contraseña</label><input type="password" className="inp" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          {error && (<div className="flex items-center gap-2 rounded-lg bg-verml px-3 py-2 text-[12.5px] font-semibold text-verm"><Ic n="alert" s={14} />{error}</div>)}
          <button type="submit" disabled={loading} className="btn w-full justify-center">
            {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Iniciando sesión...</>) : (<><Ic n="arrowr" s={15} />Iniciar sesión</>)}
          </button>
        </form>
        <div className="mt-6 rounded-lg border border-dashed border-line2 bg-paper/60 p-3">
          <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3 mb-2">Usuarios de prueba</p>
          <div className="space-y-1 text-[11.5px] text-ink2">
            <p><b className="text-vird">Jefatura:</b> carmen.prieto@educantabria.es</p>
            <p><b className="text-vird">Profesor:</b> laura.gomez@educantabria.es</p>
            <p><b className="text-vird">Profesor:</b> miguel.ruiz@educantabria.es</p>
            <p className="mono text-[10px] text-ink3 mt-1">Contraseña: Trazo2025!</p>
          </div>
        </div>
        <p className="mono mt-6 text-center text-[9.5px] uppercase tracking-widest text-ink3">IES Lope de Vega · Santa María de Cayón</p>
      </div>
    </div>
  );
}
