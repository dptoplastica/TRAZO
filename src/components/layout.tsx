import { useState, type ReactNode } from "react";
import { useApp, curso, type ViewId } from "../store";
import { Ic } from "./ui";

const NAV: { id: ViewId; label: string; icon: string; admin?: boolean }[] = [
  { id: "panel", label: "Inicio", icon: "home" },
  { id: "programaciones", label: "Programaciones", icon: "book" },
  { id: "curriculo", label: "Currículo", icon: "compass" },
  { id: "situaciones", label: "Situaciones de aprendizaje", icon: "spark" },
  { id: "unidades", label: "Unidades didácticas", icon: "layers" },
  { id: "temporalizacion", label: "Temporalización", icon: "calendar" },
  { id: "evaluacion", label: "Evaluación", icon: "clipboard" },
  { id: "cuaderno", label: "Cuaderno del profesor", icon: "pen" },
  { id: "alumnado", label: "Alumnado", icon: "users" },
  { id: "informes", label: "Informes", icon: "file" },
  { id: "diversidad", label: "Atención a la diversidad", icon: "heart" },
  { id: "recuperacion", label: "Recuperación", icon: "refresh" },
  { id: "config", label: "Configuración", icon: "settings", admin: true },
];

function Brand() {
  return (
    <div className="relative flex items-center gap-3 px-5 pt-6 pb-5">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vir text-white shadow-lg shadow-vir/30">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 20 L12 4 L20 20" />
          <path d="M8.2 13.5h7.6" />
          <circle cx="12" cy="4" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div>
        <p className="font-display text-[20px] font-extrabold leading-none tracking-tight text-paper">TRAZO</p>
        <p className="mono mt-1 text-[9.5px] uppercase tracking-[0.22em] text-mist/80">Suite didáctica LOMLOE</p>
      </div>
    </div>
  );
}

function Compass() {
  return (
    <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 opacity-[0.08]" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow h-full w-full">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#b9cbc9" strokeWidth="1" />
        <circle cx="100" cy="100" r="64" fill="none" stroke="#b9cbc9" strokeWidth="1" />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 * Math.PI) / 180;
          const r1 = i % 9 === 0 ? 52 : 60;
          return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} stroke="#b9cbc9" strokeWidth="1" />;
        })}
        <path d="M100 18 L106 100 L100 118 L94 100 Z" fill="#b9cbc9" />
      </svg>
    </div>
  );
}

interface LayoutProps {
  children: ReactNode;
  currentUser: { id: string; nombre: string; rol: string; email: string };
  onLogout: () => void;
}

export function Layout({ children, currentUser, onLogout }: LayoutProps) {
  const { d, view, nav, me, isAdmin, set } = useApp();
  const [open, setOpen] = useState(false);
  const c = curso();
  const hoy = new Date().toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const items = NAV.filter((n) => !n.admin || isAdmin);

  const sidebar = (
    <aside className="relative flex h-full w-[248px] flex-col overflow-hidden bg-night text-paper">
      <Compass />
      <Brand />
      <nav className="relative z-10 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.map((n) => {
          const active = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => { nav(n.id); setOpen(false); }}
              className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-[9px] text-left text-[13px] font-semibold transition-all duration-200 ${
                active ? "bg-night3 text-white" : "text-mist hover:bg-night2 hover:text-white"
              }`}
            >
              <span className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-vir transition-all duration-300 ${active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`} />
              <Ic n={n.icon} s={17} className={active ? "text-vir" : "text-mist/70 group-hover:text-mist"} />
              <span className="leading-tight">{n.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="relative z-10 border-t border-night3 px-4 py-4">
        <p className="lbl !text-mist/60">Sesión de trabajo</p>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-extrabold text-white" style={{ background: me.color }}>
            {me.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold leading-tight">{me.nombre}</p>
            <p className="mono text-[9.5px] uppercase tracking-widest text-mist/70">{isAdmin ? "Jefa de departamento" : "Profesorado"}</p>
          </div>
        </div>
        <select
          value={d.teacherId}
          onChange={(e) => {
            const t = d.teachers.find((x) => x.id === e.target.value);
            set((s) => ({ ...s, teacherId: e.target.value, role: t?.rol === "admin" ? "admin" : "profesor" }));
          }}
          className="inp mono mt-3 !border-night3 !bg-night2 !py-1.5 text-[11.5px] !text-mist focus:!border-vir"
          aria-label="Cambiar de usuario"
        >
          {d.teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre} · {t.rol === "admin" ? "Jefatura" : "Profesor/a"}</option>
          ))}
        </select>
      </div>
    </aside>
  );

  return (
    <div className="noise min-h-screen bg-paper bg-blueprint">
      {/* sidebar escritorio */}
      <div className="no-print fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {/* sidebar móvil */}
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[248px]">
        {/* cajetín superior */}
        <header className="no-print sticky top-0 z-30 border-b-2 border-ink/80 bg-paper/92 backdrop-blur">
          <div className="flex items-stretch">
            <button onClick={() => setOpen(true)} className="flex items-center border-r border-line px-3 text-ink2 hover:bg-line/40 lg:hidden cursor-pointer" aria-label="Abrir menú">
              <Ic n="menu" s={20} />
            </button>
            <div className="flex flex-1 items-center divide-x divide-line overflow-x-auto">
              <div className="hidden px-4 py-2 sm:block">
                <p className="mono text-[8.5px] uppercase tracking-[0.18em] text-ink3">Proyecto</p>
                <p className="font-display text-[13px] font-bold leading-tight">Programación didáctica · Dpto. Artes Plásticas</p>
              </div>
              <div className="px-4 py-2">
                <p className="mono text-[8.5px] uppercase tracking-[0.18em] text-ink3">Curso</p>
                <p className="mono text-[13px] font-bold leading-tight text-vir">{d.cursoLabel}</p>
              </div>
              <div className="hidden px-4 py-2 md:block">
                <p className="mono text-[8.5px] uppercase tracking-[0.18em] text-ink3">Escala · Rev.</p>
                <p className="mono text-[13px] font-bold leading-tight">1:1 · A</p>
              </div>
              <div className="hidden px-4 py-2 xl:block">
                <p className="mono text-[8.5px] uppercase tracking-[0.18em] text-ink3">Fecha</p>
                <p className="mono text-[13px] font-bold leading-tight capitalize">{hoy}</p>
              </div>
              <div className="flex-1" />
              <div className="hidden items-center gap-2 px-4 sm:flex">
                <span className={`h-2 w-2 rounded-full bg-vir ${"pulse-dot"}`} />
                <span className="mono text-[10px] font-bold uppercase tracking-widest text-ink2">
                  {isAdmin ? "Acceso · Departamento" : "Acceso · Profesorado"}
                </span>
                <button
                  onClick={onLogout}
                  className="ml-2 rounded-md border border-line px-2 py-1 text-[11px] font-semibold text-ink2 transition hover:border-verm hover:bg-verml hover:text-verm cursor-pointer"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="print-root mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
