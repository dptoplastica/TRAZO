import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildSeed, cursoInfo, sessionsFor, toISO, fromISO, type AppData } from "./data/seed";
import { getCurriculum, allCriterios, ceById, clavesDeCE, type Curriculum, type Criterio } from "./data/curriculum";

export type ViewId =
  | "panel" | "programaciones" | "curriculo" | "situaciones" | "unidades"
  | "temporalizacion" | "evaluacion" | "cuaderno" | "alumnado" | "informes"
  | "diversidad" | "recuperacion" | "config";

export interface Params { programacionId?: string; saId?: string; groupId?: string; studentId?: string; subjectId?: string; }

interface Toast { msg: string; key: number; }

interface Ctx {
  d: AppData;
  view: ViewId;
  params: Params;
  toast: Toast | null;
  me: AppData["teachers"][number];
  isAdmin: boolean;
  set: (fn: (d: AppData) => AppData) => void;
  nav: (view: ViewId, params?: Params) => void;
  notify: (msg: string) => void;
  reset: () => void;
}

const KEY = "trazo-lomloe-v14";

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed && parsed.version === 14) return parsed;
    }
  } catch { /* ignore */ }
  return buildSeed();
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<AppData>(load);
  const [view, setView] = useState<ViewId>("panel");
  const [params, setParams] = useState<Params>({});
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* ignore */ }
  }, [d]);

  const value = useMemo<Ctx>(() => {
    const me = d.teachers.find((t) => t.id === d.teacherId) ?? d.teachers[0];
    return {
      d, view, params, toast, me,
      isAdmin: d.role === "admin",
      set: (fn) => setD((prev) => ({ ...fn(prev) })),
      nav: (v, p) => { setView(v); setParams(p ?? {}); window.scrollTo({ top: 0 }); },
      notify: (msg) => setToast({ msg, key: Date.now() }),
      reset: () => { const fresh = buildSeed(); setD(fresh); setView("panel"); setParams({}); },
    };
  }, [d, view, params, toast]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp fuera de AppProvider");
  return ctx;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

/* ================= visibilidad según perfil ================= */

export const visibleSubjects = (d: AppData) =>
  d.role === "admin" ? d.subjects : d.subjects.filter((s) => s.teacherId === d.teacherId);
export const visibleGroups = (d: AppData) => {
  const ids = new Set(visibleSubjects(d).map((s) => s.grupoId));
  return d.groups.filter((g) => ids.has(g.id));
};
export const visibleProgramaciones = (d: AppData) => {
  const ids = new Set(visibleSubjects(d).map((s) => s.id));
  return d.programaciones.filter((p) => ids.has(p.subjectId));
};
export const studentsOf = (d: AppData, groupId: string) => d.students.filter((s) => s.groupId === groupId);

/* ================= cálculo de calificaciones ================= */

export interface CritResult { score: number | null; grades: AppData["grades"]; }

export function critScore(d: AppData, studentId: string, criterioId: string): CritResult {
  const grades = d.grades.filter((g) => g.studentId === studentId && g.criterioId === criterioId);
  if (!grades.length) return { score: null, grades };
  let sum = 0, w = 0;
  for (const g of grades) {
    const ins = d.instruments.find((i) => i.id === g.instrumentoId);
    const p = ins?.peso ?? 1;
    sum += g.value * p; w += p;
  }
  return { score: w ? sum / w : null, grades };
}

export interface CERow { ce: ReturnType<typeof ceById>; score: number | null; rows: { crit: Criterio; score: number | null }[]; }

export function ceAgg(d: AppData, cur: Curriculum, studentId: string, ceId: string): CERow {
  const ce = ceById(cur, ceId);
  const rows = (ce?.criterios ?? []).map((crit) => ({ crit, score: critScore(d, studentId, crit.id).score }));
  const withScore = rows.filter((r) => r.score !== null) as { crit: Criterio; score: number }[];
  const score = withScore.length ? withScore.reduce((a, r) => a + r.score, 0) / withScore.length : null;
  return { ce, score, rows };
}

export function claveAgg(d: AppData, cur: Curriculum, studentId: string, claveId: string): number | null {
  const ces = cur.ces.filter((ce) => clavesDeCE(ce).includes(claveId));
  const scores = ces.map((ce) => ceAgg(d, cur, studentId, ce.id).score).filter((s): s is number => s !== null);
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

export interface FinalResult { score: number | null; coverage: number; parts: { crit: Criterio; score: number | null; peso: number }[]; }

export function finalGrade(d: AppData, programacionId: string, studentId: string): FinalResult {
  const prog = d.programaciones.find((p) => p.id === programacionId);
  const subject = prog && d.subjects.find((s) => s.id === prog.subjectId);
  const cur = subject ? getCurriculum(subject.curriculumId) : null;
  if (!prog || !cur) return { score: null, coverage: 0, parts: [] };
  const parts = allCriterios(cur).map((crit) => ({
    crit, peso: prog.ponderaciones[crit.id] ?? 0, score: critScore(d, studentId, crit.id).score,
  }));
  const graded = parts.filter((p) => p.score !== null) as (typeof parts[number] & { score: number })[];
  const wSum = graded.reduce((a, p) => a + p.peso, 0);
  const totalW = parts.reduce((a, p) => a + p.peso, 0) || 100;
  const score = wSum ? graded.reduce((a, p) => a + p.score * p.peso, 0) / wSum : null;
  return { score, coverage: wSum / totalW, parts };
}

export function notaDeEva(d: AppData, programacionId: string, studentId: string, eva: 1 | 2 | 3): number | null {
  const prog = d.programaciones.find((p) => p.id === programacionId);
  if (!prog) return null;
  const grades = d.grades.filter((g) => g.studentId === studentId);
  const cur = getCurriculum(d.subjects.find((s) => s.id === prog.subjectId)?.curriculumId ?? "epva-eso");
  const rows = allCriterios(cur)
    .map((crit) => {
      const gs = grades.filter((g) => g.criterioId === crit.id && fromISO(g.fecha) >= cursoInfo(fromISO(g.fecha)).evas[eva - 1].inicio && fromISO(g.fecha) <= cursoInfo(fromISO(g.fecha)).evas[eva - 1].fin);
      if (!gs.length) return null;
      let sum = 0, w = 0;
      for (const g of gs) { const p = d.instruments.find((i) => i.id === g.instrumentoId)?.peso ?? 1; sum += g.value * p; w += p; }
      const score = sum / w;
      return { score, peso: prog.ponderaciones[crit.id] ?? 0 };
    })
    .filter(Boolean) as { score: number; peso: number }[];
  const wSum = rows.reduce((a, r) => a + r.peso, 0);
  return wSum ? rows.reduce((a, r) => a + r.score * r.peso, 0) / wSum : null;
}

export const pendingCriterios = (d: AppData, studentId: string, subjectId: string): Criterio[] => {
  const subject = d.subjects.find((s) => s.id === subjectId);
  if (!subject) return [];
  const cur = getCurriculum(subject.curriculumId);
  return allCriterios(cur).filter((crit) => {
    const r = critScore(d, studentId, crit.id);
    return r.score !== null && r.score < 5;
  });
};

/* ================= niveles ================= */

export function nivelDe(score: number | null) {
  if (score === null) return { t: "Sin datos", s: "—", cls: "bg-line/60 text-ink2", hex: "#7c929b" };
  if (score < 5) return { t: "Insuficiente", s: "IN", cls: "bg-verml text-verm", hex: "#d9532c" };
  if (score < 6.5) return { t: "Suficiente", s: "SU", cls: "bg-ambl text-amb", hex: "#c98a12" };
  if (score < 8.5) return { t: "Notable", s: "NT", cls: "bg-virl text-vird", hex: "#0e7c66" };
  return { t: "Sobresaliente", s: "SB", cls: "bg-azul text-azu", hex: "#2c6e8f" };
}

export function claveNivel(score: number | null) {
  if (score === null) return { t: "Sin datos", cls: "bg-line/60 text-ink2", hex: "#7c929b" };
  if (score < 5) return { t: "En inicio", cls: "bg-verml text-verm", hex: "#d9532c" };
  if (score < 8) return { t: "En desarrollo", cls: "bg-ambl text-amb", hex: "#c98a12" };
  return { t: "Adquirida", cls: "bg-virl text-vird", hex: "#0e7c66" };
}

/* ================= fechas y sesiones ================= */

export const curso = () => cursoInfo();

export function groupSessions(d: AppData, groupId: string) {
  const g = d.groups.find((x) => x.id === groupId);
  if (!g) return { all: [] as Date[], past: [] as Date[], next: [] as Date[] };
  const c = cursoInfo();
  const all = sessionsFor(g, c.start, c.end);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  return { all, past: all.filter((x) => x <= hoy), next: all.filter((x) => x > hoy) };
}

export const fmtFecha = (iso: string) => {
  const d = fromISO(iso);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};
export const fmtFechaL = (iso: string) => {
  const d = fromISO(iso);
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
export const fmt = (n: number | null, dec = 1) => (n === null ? "—" : n.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec }));
