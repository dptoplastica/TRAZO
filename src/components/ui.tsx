import { useEffect, useRef, useState, type ReactNode } from "react";
import { useApp, nivelDe, claveNivel } from "../store";

const P: Record<string, ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  spark: <><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /><path d="M19 17v4M17 19h4" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1z" /></>,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9.5h18" /></>,
  clipboard: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6M9 16h4" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
  refresh: <><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5M3 21v-5h5" /></>,
  settings: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M1.5 14h5M9.5 8h5M17.5 16h5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  chevr: <path d="m9 18 6-6-6-6" />,
  chevd: <path d="m6 9 6 6 6-6" />,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  print: <><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" rx="1" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" /></>,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  arrowr: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  trash: <><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  gauge: <><path d="M12 15l3.5-5.5" /><path d="M20.3 18a10 10 0 1 0-16.6 0" /></>,
};

export function Ic({ n, s = 18, className = "" }: { n: string; s?: number; className?: string }) {
  return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{P[n] ?? P.info}</svg>);
}

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }), { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (<div ref={ref} className={`rv ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>);
}

export function CountUp({ to, dec = 0, suffix = "", className = "" }: { to: number; dec?: number; suffix?: string; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    const t0 = performance.now(); const dur = 900; let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3); setV(to * e); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref} className={className}>{v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</span>;
}

export function LevelChip({ score, clave = false, sm = false }: { score: number | null; clave?: boolean; sm?: boolean }) {
  const n = { ...nivelDe(score), ...(clave ? claveNivel(score) : {}) };
  return (<span className={`inline-flex items-center gap-1 rounded-md font-bold mono ${sm ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"} ${n.cls}`} title={score === null ? "Sin datos" : score.toLocaleString("es-ES", { maximumFractionDigits: 1 })}>
    {!clave && score !== null && <>{score.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</>}
    {!clave && <span className="opacity-60">·</span>}
    {clave ? n.t : n.s}
  </span>);
}

export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = { "Borrador": "bg-ambl text-amb", "En revisión": "bg-azul text-azu", "Finalizada": "bg-virl text-vird" };
  const dot: Record<string, string> = { "Borrador": "#c98a12", "En revisión": "#2c6e8f", "Finalizada": "#0e7c66" };
  return (<span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold ${map[estado] ?? "bg-line/60 text-ink2"}`}><span className="h-1.5 w-1.5 rounded-full" style={{ background: dot[estado] ?? "#7c929b" }} />{estado}</span>);
}

export function SelChip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (<button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition-all duration-200 cursor-pointer ${active ? "border-transparent text-white shadow-sm scale-[1.03]" : "border-line2 bg-card text-ink2 hover:border-ink3 hover:text-ink"}`} style={active ? { background: color ?? "#0e7c66" } : undefined}>
    {active && <Ic n="check" s={12} />}{children}
  </button>);
}

export function Bar({ value, color = "#0e7c66", className = "", h = 6 }: { value: number; color?: string; className?: string; h?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (<div ref={ref} className={`w-full overflow-hidden rounded-full bg-line/70 ${className}`} style={{ height: h }}><div className="h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: inView ? `${Math.max(0, Math.min(100, value))}%` : "0%", background: color }} /></div>);
}

export function Sparkline({ points, color = "#0e7c66", w = 120, h = 34 }: { points: (number | null)[]; color?: string; w?: number; h?: number }) {
  const vals = points.filter((p): p is number => p !== null);
  if (vals.length < 2) return <div className="text-[11px] text-ink3 italic">Sin datos suficientes</div>;
  const min = Math.min(...vals) - 0.5, max = Math.max(...vals) + 0.5;
  const pts = points.map((p, i) => { if (p === null) return null; const x = (i / (points.length - 1)) * (w - 6) + 3; const y = h - 4 - ((p - min) / (max - min)) * (h - 8); return `${x},${y}`; }).filter(Boolean);
  const d = pts.length ? `M${pts.join(" L")}` : "";
  return (<svg width={w} height={h} className="overflow-visible"><path d={`${d} L${w - 3},${h} L3,${h} Z`} fill={color} opacity="0.1" /><path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className="draw-path" />{pts.map((p, i) => { const [x, y] = p!.split(",").map(Number); return <circle key={i} cx={x} cy={y} r="2.4" fill={color} />; })}</svg>);
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => { if (!open) return; const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [open, onClose]);
  if (!open) return null;
  return (<div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
    <div className="absolute inset-0 bg-night/55 backdrop-blur-[2px]" onClick={onClose} />
    <div className={`pop relative w-full ${wide ? "max-w-3xl" : "max-w-xl"} max-h-[88vh] overflow-y-auto rounded-xl border border-line bg-panel shadow-2xl`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel/95 px-5 py-3.5 backdrop-blur">
        <h3 className="font-display text-[17px] font-bold text-ink">{title}</h3>
        <button onClick={onClose} className="rounded-md p-1.5 text-ink2 transition hover:bg-line/60 hover:text-ink cursor-pointer" aria-label="Cerrar"><Ic n="x" s={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>);
}

export function SectionHead({ kicker, title, desc, actions }: { kicker: string; title: string; desc?: string; actions?: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (<div ref={ref} className={`rv ${inView ? "in" : ""} mb-6 flex flex-wrap items-end justify-between gap-4`}>
    <div className="max-w-2xl">
      <p className="mono mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-vir">▞ {kicker}</p>
      <h1 className="lm in font-display text-[26px] leading-tight font-extrabold tracking-tight text-ink sm:text-[32px]"><span>{title}</span></h1>
      {desc && <p className="mt-2 text-[14px] leading-relaxed text-ink2">{desc}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>);
}

export function EmptyState({ icon = "info", title, desc, action }: { icon?: string; title: string; desc?: string; action?: ReactNode }) {
  return (<div className="card flex flex-col items-center justify-center gap-2 px-8 py-14 text-center">
    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-virl text-vir"><Ic n={icon} s={22} /></div>
    <p className="font-display text-[16px] font-bold text-ink">{title}</p>
    {desc && <p className="max-w-sm text-[13px] text-ink2">{desc}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>);
}

export function ToastHost() {
  const { toast } = useApp();
  const [show, setShow] = useState<{ msg: string; key: number } | null>(null);
  useEffect(() => { if (!toast) return; setShow(toast); const t = setTimeout(() => setShow(null), 2600); return () => clearTimeout(t); }, [toast]);
  if (!show) return null;
  return (<div key={show.key} className="toast-in fixed bottom-5 right-5 z-[90] flex items-center gap-2.5 rounded-xl border border-vir/30 bg-night px-4 py-3 text-[13px] font-semibold text-paper shadow-2xl no-print">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vir text-white"><Ic n="check" s={13} /></span>{show.msg}
  </div>);
}

export const btn = "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-vir px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-vird hover:shadow-md hover:-translate-y-px active:translate-y-0";
export const btnGhost = "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line2 bg-card px-4 py-2 text-[13px] font-bold text-ink2 transition-all duration-200 hover:border-ink3 hover:text-ink hover:-translate-y-px";
export const btnDanger = "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-verm/30 bg-verml px-3 py-1.5 text-[12px] font-bold text-verm transition-all duration-200 hover:bg-verm hover:text-white";
