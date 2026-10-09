import { useApp, visibleSubjects, visibleGroups, visibleProgramaciones, studentsOf, groupSessions, critScore, finalGrade, pendingCriterios, fmt, nivelDe, curso } from "../store";
import { getCurriculum, allCriterios, criterioById } from "../data/curriculum";
import { Ic, Reveal, CountUp, LevelChip, Bar, EstadoBadge, btn, btnGhost } from "../components/ui";

export default function Panel() {
  const { d, me, isAdmin, nav } = useApp();
  const subjects = visibleSubjects(d);
  const groups = visibleGroups(d);
  const progs = visibleProgramaciones(d);
  const students = groups.flatMap((g) => studentsOf(d, g.id));
  const proximas = groups.flatMap((g) => groupSessions(d, g.id).next.slice(0, 4).map((date) => ({ g, date }))).sort((a, b) => +a.date - +b.date).slice(0, 6);
  const seguimiento = progs.flatMap((p) => { const s = d.subjects.find((x) => x.id === p.subjectId)!; return studentsOf(d, s.grupoId).map((st) => ({ st, subject: s, r: finalGrade(d, p.id, st.id) })).filter((x) => x.r.score !== null && x.r.score < 5); }).sort((a, b) => (a.r.score ?? 0) - (b.r.score ?? 0)).slice(0, 6);
  const recuperandos = new Set(subjects.flatMap((s) => studentsOf(d, s.grupoId).flatMap((st) => pendingCriterios(d, st.id, s.id).map((c) => `${st.id}|${c.id}`)))).size;
  const saludo = () => { const h = new Date().getHours(); if (h < 12) return "Buenos días"; if (h < 20) return "Buenas tardes"; return "Buenas noches"; };

  return (
    <div>
      <Reveal>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-vir">▞ Panel de control</p>
            <h1 className="lm in font-display text-[28px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px]"><span>{saludo()}, {me.nombre.split(" ")[0]}.</span></h1>
            <p className="mt-2 max-w-xl text-[14px] text-ink2">{isAdmin ? "Visión del departamento: programaciones, grupos y estado de la evaluación." : "Tu planificación, tu cuaderno y la evaluación del alumnado, conectados al currículo LOMLOE."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={btnGhost} onClick={() => nav("cuaderno")}><Ic n="pen" s={15} /> Abrir cuaderno</button>
            <button className={btn} onClick={() => nav("informes")}><Ic n="file" s={15} /> Generar informes</button>
          </div>
        </div>
      </Reveal>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { l: isAdmin ? "Profesorado" : "Mis materias", v: isAdmin ? d.teachers.length : subjects.length, i: isAdmin ? "users" : "book", c: "#0e7c66" },
          { l: isAdmin ? "Materias" : "Mis grupos", v: isAdmin ? d.subjects.length : groups.length, i: "layers", c: "#2c6e8f" },
          { l: "Alumnado", v: students.length, i: "user", c: "#c98a12" },
          { l: "Situaciones", v: d.sas.filter((s) => progs.some((p) => p.id === s.programacionId)).length, i: "spark", c: "#d9532c" },
          { l: "Criterios evaluados", v: Math.round((progs.reduce((a, p) => a + p.criterios.length, 0) / Math.max(1, progs.length * 10)) * 100), suf: "%", i: "clipboard", c: "#0e7c66" },
          { l: "Necesitan refuerzo", v: seguimiento.length, i: "heart", c: "#a84a6c" },
        ].map((t, i) => (
          <Reveal key={t.l} delay={i * 70}>
            <div className="card card-h px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink2">{t.l}</p>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${t.c}18`, color: t.c }}><Ic n={t.i} s={15} /></span>
              </div>
              <p className="mt-1.5 font-display text-[28px] font-extrabold leading-none text-ink"><CountUp to={t.v} suffix={t.suf ?? ""} /></p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal delay={80}>
          <div className="card flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="book" s={16} className="text-vir" /> Estado de las programaciones</p>
              <button onClick={() => nav("programaciones")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">gestionar →</button>
            </div>
            <div className="divide-y divide-line/70">
              {progs.map((p) => {
                const sub = d.subjects.find((s) => s.id === p.subjectId);
                const sasDeP = d.sas.filter((s) => s.programacionId === p.id);
                return (
                  <button key={p.id} onClick={() => nav("programaciones", { programacionId: p.id })} className="flex w-full cursor-pointer flex-wrap items-center gap-3 px-4 py-3 text-left transition hover:bg-virl/40">
                    <span className="h-9 w-1.5 rounded-full" style={{ background: sub?.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[15px] font-bold text-ink">{sub?.nombre} · {sub?.nivel}</span>
                      <span className="mono text-[11px] text-ink3">{sasDeP.length} situaciones · {p.criterios.length} criterios</span>
                    </span>
                    <EstadoBadge estado={p.estado} />
                    <Ic n="chevr" s={16} className="text-ink3" />
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="card flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="heart" s={16} className="text-ros" /> Alumnado que necesita seguimiento</p>
              <button onClick={() => nav("alumnado")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">alumnado →</button>
            </div>
            <div className="flex-1 divide-y divide-line/70">
              {seguimiento.length === 0 && <p className="px-4 py-6 text-[13px] italic text-ink3">Nadie por debajo del 5 con datos registrados.</p>}
              {seguimiento.map(({ st, subject, r }) => (
                <button key={st.id + subject.id} onClick={() => nav("alumnado", { studentId: st.id, groupId: st.groupId })} className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition hover:bg-virl/40">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink">{st.nombre}</span>
                    <span className="mono text-[10.5px] text-ink3">{d.groups.find((g) => g.id === st.groupId)?.nombre} · {subject.corto}</span>
                  </span>
                  <LevelChip score={r.score} />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
