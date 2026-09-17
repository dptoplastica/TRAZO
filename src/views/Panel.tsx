import { useApp, visibleSubjects, visibleGroups, visibleProgramaciones, studentsOf, groupSessions, critScore, finalGrade, pendingCriterios, fmt, nivelDe, curso } from "../store";
import { getCurriculum, allCriterios, criterioById } from "../data/curriculum";
import { Ic, Reveal, CountUp, LevelChip, Bar, EstadoBadge, btn, btnGhost } from "../components/ui";

export default function Panel() {
  const { d, me, isAdmin, nav, set } = useApp();
  const subjects = visibleSubjects(d);
  const groups = visibleGroups(d);
  const progs = visibleProgramaciones(d);
  const students = groups.flatMap((g) => studentsOf(d, g.id));

  /* próximos momentos lectivos */
  const proximas = groups
    .flatMap((g) => groupSessions(d, g.id).next.slice(0, 4).map((date) => ({ g, date })))
    .sort((a, b) => +a.date - +b.date)
    .slice(0, 6);

  /* criterios con datos y pendientes */
  const criterioStats: { id: string; label: string; subjectId: string; cobertura: number; media: number | null }[] = [];
  for (const s of subjects) {
    const cur = getCurriculum(s.curriculumId);
    const grupo = studentsOf(d, s.grupoId);
    for (const crit of allCriterios(cur)) {
      let con = 0, sum = 0, n = 0;
      for (const st of grupo) {
        const r = critScore(d, st.id, crit.id);
        if (r.score !== null) { con++; sum += r.score; n++; }
      }
      if (grupo.length) criterioStats.push({ id: crit.id, label: `Criterio ${crit.codigo}`, subjectId: s.id, cobertura: con / grupo.length, media: n ? sum / n : null });
    }
  }
  const evaluados = criterioStats.filter((c) => c.cobertura > 0.5).length;
  const pctEvaluado = criterioStats.length ? Math.round((evaluados / criterioStats.length) * 100) : 0;
  const sinEvaluar = criterioStats.filter((c) => c.cobertura < 0.5).slice(0, 6);

  /* alumnado que necesita seguimiento */
  const seguimiento = progs.flatMap((p) => {
    const s = d.subjects.find((x) => x.id === p.subjectId)!;
    return studentsOf(d, s.grupoId).map((st) => ({ st, subject: s, r: finalGrade(d, p.id, st.id) }))
      .filter((x) => x.r.score !== null && x.r.score < 5);
  }).sort((a, b) => (a.r.score ?? 0) - (b.r.score ?? 0)).slice(0, 6);

  const recuperandos = new Set(
    subjects.flatMap((s) => studentsOf(d, s.grupoId).flatMap((st) => pendingCriterios(d, st.id, s.id).map((c) => `${st.id}|${c.id}`)))
  ).size;

  const saludo = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  const subjectById = (id: string) => d.subjects.find((s) => s.id === id);

  return (
    <div>
      {/* cabecera */}
      <Reveal>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-vir">▞ Panel de control</p>
            <h1 className="lm in font-display text-[28px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px]">
              <span>{saludo()}, {me.nombre.split(" ")[0]}.</span>
            </h1>
            <p className="mt-2 max-w-xl text-[14px] text-ink2">
              {isAdmin
                ? "Visión del departamento: programaciones, grupos y estado de la evaluación."
                : "Tu planificación, tu cuaderno y la evaluación del alumnado, conectados al currículo LOMLOE."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={btnGhost} onClick={() => nav("cuaderno")}><Ic n="pen" s={15} /> Abrir cuaderno</button>
            <button className={btn} onClick={() => nav("informes")}><Ic n="file" s={15} /> Generar informes</button>
          </div>
        </div>
      </Reveal>

      {/* próximas sesiones */}
      <Reveal delay={60}>
        <div className="card mb-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-ink2"><Ic n="clock" s={15} className="text-vir" /> Próximas sesiones</p>
            <button onClick={() => nav("temporalizacion")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">ver temporalización →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 py-4">
            {proximas.length === 0 && <p className="text-[13px] italic text-ink3">Sin sesiones próximas registradas.</p>}
            {proximas.map(({ g, date }, i) => {
              const sub = subjects.find((s) => s.grupoId === g.id);
              return (
                <button
                  key={g.id + date.toISOString()}
                  onClick={() => nav("cuaderno", { groupId: g.id })}
                  className="card card-h group min-w-[150px] flex-1 cursor-pointer border-l-4 px-3.5 py-3 text-left"
                  style={{ borderLeftColor: sub?.color ?? "#0e7c66", animationDelay: `${i * 60}ms` }}
                >
                  <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3 capitalize">{date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}</p>
                  <p className="mt-1 font-display text-[15px] font-bold text-ink">{g.nombre}</p>
                  <p className="truncate text-[12px] font-semibold" style={{ color: sub?.color }}>{sub?.corto ?? "—"}</p>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* estadísticas */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { l: isAdmin ? "Profesorado" : "Mis materias", v: isAdmin ? d.teachers.length : subjects.length, i: isAdmin ? "users" : "book", c: "#0e7c66" },
          { l: isAdmin ? "Materias" : "Mis grupos", v: isAdmin ? d.subjects.length : groups.length, i: "layers", c: "#2c6e8f" },
          { l: "Alumnado", v: students.length, i: "user", c: "#c98a12" },
          { l: "Situaciones", v: d.sas.filter((s) => progs.some((p) => p.id === s.programacionId)).length, i: "spark", c: "#d9532c" },
          { l: "Criterios evaluados", v: pctEvaluado, suf: "%", i: "clipboard", c: "#0e7c66" },
          { l: "Necesitan refuerzo", v: seguimiento.length, i: "heart", c: "#a84a6c" },
        ].map((t, i) => (
          <Reveal key={t.l} delay={i * 70}>
            <div className="card card-h px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink2">{t.l}</p>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${t.c}18`, color: t.c }}><Ic n={t.i} s={15} /></span>
              </div>
              <p className="mt-1.5 font-display text-[28px] font-extrabold leading-none text-ink">
                <CountUp to={t.v} suffix={t.suf ?? ""} />
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* criterios pendientes de evaluar */}
        <Reveal delay={80}>
          <div className="card flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="clipboard" s={16} className="text-amb" /> Criterios pendientes de evaluar</p>
              <button onClick={() => nav("evaluacion")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">evaluación →</button>
            </div>
            <div className="flex-1 space-y-3 px-4 py-4">
              {sinEvaluar.length === 0 && <p className="text-[13px] italic text-ink3">Todos los criterios tienen datos de evaluación. Enhorabuena.</p>}
              {sinEvaluar.map((c) => {
                const sub = subjectById(c.subjectId);
                const cur = getCurriculum(sub?.curriculumId ?? "epva-eso");
                const crit = criterioById(cur, c.id);
                return (
                  <button key={c.id + c.subjectId} onClick={() => nav("cuaderno", { groupId: sub?.grupoId })} className="group block w-full cursor-pointer text-left">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-ink group-hover:text-vir transition-colors">
                        <span className="mono mr-1.5 text-[11px] font-bold" style={{ color: sub?.color }}>{c.label}</span>
                        {crit?.texto.slice(0, 62)}…
                      </p>
                      <span className="mono shrink-0 text-[11px] font-bold text-ink3">{Math.round(c.cobertura * 100)}%</span>
                    </div>
                    <Bar value={c.cobertura * 100} color={sub?.color ?? "#0e7c66"} h={5} />
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* seguimiento */}
        <Reveal delay={140}>
          <div className="card flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="heart" s={16} className="text-ros" /> Alumnado que necesita seguimiento</p>
              <button onClick={() => nav("alumnado")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">alumnado →</button>
            </div>
            <div className="flex-1 divide-y divide-line/70">
              {seguimiento.length === 0 && <p className="px-4 py-6 text-[13px] italic text-ink3">Nadie por debajo del 5 con datos registrados.</p>}
              {seguimiento.map(({ st, subject, r }) => {
                const n = nivelDe(r.score);
                return (
                  <button key={st.id + subject.id} onClick={() => nav("alumnado", { studentId: st.id, groupId: st.groupId })} className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition hover:bg-virl/40">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
                      {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-ink">{st.nombre}</span>
                      <span className="mono text-[10.5px] text-ink3">{d.groups.find((g) => g.id === st.groupId)?.nombre} · {subject.corto}</span>
                    </span>
                    <LevelChip score={r.score} />
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* fila inferior: programaciones + recuperación */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Reveal delay={100} className="lg:col-span-2">
          <div className="card">
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
                      <span className="mono text-[11px] text-ink3">{sasDeP.length} situaciones · {p.criterios.length} criterios · curso {p.curso}</span>
                    </span>
                    <EstadoBadge estado={p.estado} />
                    <Ic n="chevr" s={16} className="text-ink3" />
                  </button>
                );
              })}
              {progs.length === 0 && <p className="px-4 py-6 text-[13px] italic text-ink3">No tienes programaciones asignadas.</p>}
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="card flex h-full flex-col">
            <div className="border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="refresh" s={16} className="text-azu" /> Recuperaciones</p>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
              <p className="font-display text-[40px] font-extrabold leading-none text-azu"><CountUp to={recuperandos} /></p>
              <p className="text-[12.5px] leading-snug text-ink2">criterios suspensos detectados automáticamente en tus grupos</p>
              <button className={btnGhost + " !py-1.5"} onClick={() => nav("recuperacion")}><Ic n="refresh" s={14} /> Ver planes de recuperación</button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* franja de trazo (firma visual) */}
      <Reveal delay={120}>
        <div className="mt-6 flex items-center gap-3 overflow-hidden rounded-xl border border-dashed border-line2 bg-panel/70 px-4 py-3">
          <svg viewBox="0 0 120 24" className="h-5 w-24 shrink-0 text-vir" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path className="draw-path" d="M3 18 C 20 4, 30 22, 46 12 S 74 2, 86 14 S 110 20, 117 6" />
          </svg>
          <p className="mono text-[11px] font-semibold uppercase tracking-widest text-ink2 truncate">
            {fmt(progs.reduce((a, p) => a + p.criterios.length, 0), 0)} criterios LOMLOE vinculados · base curricular {curso().label} · Educantabria / MEFPD
          </p>
        </div>
      </Reveal>

      {/* acceso rápido admin */}
      {isAdmin && (
        <Reveal delay={80}>
          <div className="mt-4 card px-4 py-3 flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-bold text-ink flex items-center gap-2"><Ic n="shield" s={16} className="text-verm" /> Acciones de jefatura</p>
            <button className={btnGhost + " !py-1.5"} onClick={() => nav("config")}><Ic n="layers" s={14} /> Gestionar materias</button>
            <button className={btnGhost + " !py-1.5"} onClick={() => nav("config")}><Ic n="users" s={14} /> Profesorado y grupos</button>
            <button className={btnGhost + " !py-1.5"} onClick={() => { set((s) => ({ ...s })); }}><Ic n="eye" s={14} /> Vista completa del departamento</button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
