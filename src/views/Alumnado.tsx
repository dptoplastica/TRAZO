import { useState } from "react";
import { useApp, visibleProgramaciones, studentsOf, critScore, ceAgg, claveAgg, finalGrade, notaDeEva, pendingCriterios, fmt, nivelDe, claveNivel, curso } from "../store";
import { getCurriculum, CLAVES, clavesDeCE } from "../data/curriculum";
import { Ic, Reveal, SectionHead, LevelChip, Bar, Sparkline, EmptyState } from "../components/ui";

export default function Alumnado() {
  const { d, params, nav, set } = useApp();
  const progs = visibleProgramaciones(d);
  const groups = d.groups.filter((g) => progs.some((p) => {
    const s = d.subjects.find((x) => x.id === p.subjectId);
    return s?.grupoId === g.id;
  }));
  const group = d.groups.find((g) => g.id === (params.groupId ?? groups[0]?.id)) ?? groups[0];
  const students = group ? studentsOf(d, group.id) : [];
  const [q, setQ] = useState("");
  const sel = students.find((s) => s.id === params.studentId) ?? students[0];
  const progDeGrupo = progs.find((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === group?.id);

  if (!group) return <EmptyState icon="users" title="Sin grupos" desc="Este perfil no tiene grupos asignados." />;

  const lista = students.filter((s) => s.nombre.toLowerCase().includes(q.toLowerCase()));
  const finalDe = (stId: string) => (progDeGrupo ? finalGrade(d, progDeGrupo.id, stId) : { score: null, coverage: 0, parts: [] });

  return (
    <div>
      <SectionHead
        kicker="Perfiles académicos"
        title={`Alumnado · ${group.nombre}`}
        desc="Grado de consecución de criterios, competencias específicas y competencias clave, calculado a partir del cuaderno del profesor."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (
          <button key={g.id} onClick={() => nav("alumnado", { groupId: g.id })} className={`cursor-pointer rounded-lg border-2 px-3.5 py-1.5 text-[13px] font-bold transition-all ${g.id === group.id ? "border-ink bg-ink text-paper -translate-y-0.5 shadow" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}>
            {g.nombre}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Ic n="search" s={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
          <input className="inp !pl-8 !py-1.5" placeholder="Buscar alumno/a…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* lista */}
        <Reveal className="lg:h-fit lg:sticky lg:top-20">
          <div className="card overflow-hidden">
            <div className="divide-y divide-line/60 max-h-[560px] overflow-y-auto">
              {lista.map((st) => {
                const f = finalDe(st.id);
                return (
                  <button key={st.id} onClick={() => nav("alumnado", { groupId: group.id, studentId: st.id })} className={`flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left transition ${sel?.id === st.id ? "bg-virl/50" : "hover:bg-virl/25"}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
                      {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold text-ink">{st.nombre}</span>
                      <span className="mono text-[10px] uppercase tracking-widest text-ink3">{st.neae ? "NEAE" : `${Math.round(f.coverage * 100)}% criterios eval.`}</span>
                    </span>
                    <LevelChip score={f.score} sm />
                  </button>
                );
              })}
              {lista.length === 0 && <p className="px-4 py-8 text-center text-[13px] italic text-ink3">Sin resultados.</p>}
            </div>
          </div>
        </Reveal>

        {/* detalle */}
        {sel && progDeGrupo && <Perfil key={sel.id} stId={sel.id} progId={progDeGrupo.id} set={set} />}
      </div>
    </div>
  );
}

function Perfil({ stId, progId, set }: { stId: string; progId: string; set: ReturnType<typeof useApp>["set"] }) {
  const { d, nav } = useApp();
  const st = d.students.find((s) => s.id === stId)!;
  const prog = d.programaciones.find((p) => p.id === progId)!;
  const sub = d.subjects.find((s) => s.id === prog.subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const group = d.groups.find((g) => g.id === st.groupId)!;
  const c = curso();

  const final = finalGrade(d, progId, stId);
  const notas = [1, 2, 3].map((e) => notaDeEva(d, progId, stId, e as 1 | 2 | 3));
  const asistencia = d.attendance.filter((a) => a.studentId === stId);
  const faltas = asistencia.filter((a) => a.estado === "F").length;
  const retrasos = asistencia.filter((a) => a.estado === "R").length;
  const pctAsis = asistencia.length ? Math.round(((asistencia.length - faltas - retrasos * 0.5) / asistencia.length) * 100) : 100;
  const pendientes = pendingCriterios(d, stId, sub.id);
  const obs = d.observations.filter((o) => o.studentId === stId);
  const medidas = d.measures.filter((m) => m.studentId === stId || (m.groupId === st.groupId && !m.studentId));
  const recuperaciones = d.recoveries.filter((r) => r.studentId === stId);

  const [editando, setEditando] = useState(false);

  return (
    <div className="space-y-4">
      {/* cabecera perfil */}
      <Reveal>
        <div className="card overflow-hidden">
          <div className="h-1.5" style={{ background: sub.color }} />
          <div className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-[22px] font-extrabold text-white shadow-lg" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
              {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[22px] font-extrabold text-ink">{st.nombre}</h2>
              <p className="mono text-[11px] uppercase tracking-widest text-ink3">{group.nombre} · {sub.nombre} · curso {d.cursoLabel}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {st.neae && <span className="rounded-md bg-rosl px-2 py-0.5 text-[10.5px] font-bold text-ros">NEAE · {st.neae}</span>}
                <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-bold ${pctAsis >= 90 ? "bg-virl text-vird" : "bg-ambl text-amb"}`}>asistencia {pctAsis}%</span>
                {faltas > 0 && <span className="rounded-md bg-verml px-2 py-0.5 text-[10.5px] font-bold text-verm">{faltas} faltas</span>}
                {pendientes.length > 0 && <span className="rounded-md bg-verml px-2 py-0.5 text-[10.5px] font-bold text-verm">{pendientes.length} criterios pendientes</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Calificación global</p>
              <p className="font-display text-[40px] font-extrabold leading-none" style={{ color: nivelDe(final.score).hex }}>{fmt(final.score)}</p>
              <p className="mono text-[11px] font-bold" style={{ color: nivelDe(final.score).hex }}>{nivelDe(final.score).t}</p>
            </div>
          </div>
          {/* evolución por evaluaciones */}
          <div className="grid gap-3 border-t border-line bg-paper/60 px-5 py-3.5 sm:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-5">
              {c.evas.map((e, i) => (
                <div key={e.n}>
                  <p className="mono text-[9.5px] font-bold uppercase tracking-widest text-ink3">{e.label}</p>
                  <p className="font-display text-[22px] font-extrabold" style={{ color: nivelDe(notas[i]).hex }}>{fmt(notas[i])}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end justify-center">
              <p className="mono mb-1 text-[9.5px] font-bold uppercase tracking-widest text-ink3">Evolución</p>
              <Sparkline points={notas} color={sub.color} w={130} h={36} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* competencias específicas */}
      <Reveal delay={60}>
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="target" s={16} className="text-vir" /> Competencias específicas y criterios</p>
            <span className="mono text-[11px] font-bold text-ink3">{cur.ces.length} competencias</span>
          </div>
          <div className="divide-y divide-line/60">
            {cur.ces.map((ce) => {
              const agg = ceAgg(d, cur, stId, ce.id);
              const n = nivelDe(agg.score);
              return (
                <div key={ce.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-semibold leading-snug text-ink"><b className="mono mr-1.5 text-[11.5px]" style={{ color: sub.color }}>{ce.codigo}</b>{ce.texto}</p>
                    <LevelChip score={agg.score} />
                  </div>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {agg.rows.map(({ crit, score }) => (
                      <button key={crit.id} onClick={() => nav("cuaderno", { groupId: st.groupId })} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line/70 bg-paper px-2.5 py-1.5 text-left transition hover:border-vir/50">
                        <span className="mono text-[11px] font-extrabold" style={{ color: sub.color }}>{crit.codigo}</span>
                        <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink2" title={crit.texto}>{crit.texto}</span>
                        <LevelChip score={score} sm />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Bar value={(agg.score ?? 0) * 10} color={n.hex} h={5} className="flex-1" />
                    <span className="mono w-16 shrink-0 text-right text-[10.5px] font-bold text-ink3">{agg.score !== null ? `${fmt(agg.score)}/10` : "sin datos"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* competencias clave */}
      <Reveal delay={100}>
        <div className="card p-4">
          <p className="mb-3 flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="compass" s={16} className="text-azu" /> Competencias clave <span className="mono text-[10.5px] font-bold text-ink3">· vía descriptores operativos</span></p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {CLAVES.filter((k) => cur.ces.some((ce) => clavesDeCE(ce).includes(k.id))).map((k) => {
              const score = claveAgg(d, cur, stId, k.id);
              const n = claveNivel(score);
              return (
                <div key={k.id} className="rounded-xl border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-bold text-ink"><span className="mono mr-1.5 rounded px-1.5 py-0.5 text-[10px]" style={{ background: k.soft, color: k.color }}>{k.id}</span>{k.corto}</p>
                    <span className={`mono rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${n.cls}`}>{n.t}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Bar value={(score ?? 0) * 10} color={k.color} h={5} className="flex-1" />
                    <span className="mono w-8 shrink-0 text-right text-[10.5px] font-bold text-ink2">{score !== null ? fmt(score) : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* pendientes + recuperaciones + observaciones + medidas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal delay={80}>
          <div className="card h-full overflow-hidden">
            <p className="border-b border-line px-4 py-3 text-[13.5px] font-bold text-ink">Criterios pendientes de superar</p>
            <div className="space-y-2 p-4">
              {pendientes.length === 0 && <p className="text-[13px] italic text-ink3">Ningún criterio suspenso con datos registrados.</p>}
              {pendientes.map((crit) => {
                const plan = recuperaciones.find((r) => r.criterioId === crit.id);
                const score = critScore(d, stId, crit.id).score;
                return (
                  <div key={crit.id} className="rounded-lg border border-verm/25 bg-verml/40 p-3">
                    <div className="flex items-center gap-2">
                      <span className="mono text-[11px] font-extrabold text-verm">{crit.codigo}</span>
                      <LevelChip score={score} sm />
                      {plan && <span className={`mono ml-auto rounded px-1.5 py-0.5 text-[9.5px] font-extrabold ${plan.resultado !== undefined && plan.resultado >= 5 ? "bg-virl text-vird" : "bg-ambl text-amb"}`}>{plan.resultado !== undefined ? (plan.resultado >= 5 ? "RECUPERADO" : `REPETIRÁ · ${fmt(plan.resultado)}`) : "PLAN EN CURSO"}</span>}
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-ink2">{crit.texto}</p>
                    {!plan && <button onClick={() => nav("recuperacion")} className="mono mt-1.5 text-[10.5px] font-bold text-vir hover:underline cursor-pointer">crear plan de recuperación →</button>}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="card h-full overflow-hidden">
            <p className="border-b border-line px-4 py-3 text-[13.5px] font-bold text-ink">Observaciones y medidas</p>
            <div className="divide-y divide-line/60">
              {medidas.map((m) => (
                <div key={m.id} className="flex items-start gap-2.5 px-4 py-2.5">
                  <span className="mono mt-0.5 shrink-0 rounded bg-azul px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase text-azu">{m.tipo}</span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-ink">{m.titulo}</p>
                    <p className="text-[11.5px] leading-snug text-ink2">{m.desc}</p>
                  </div>
                </div>
              ))}
              {obs.map((o) => (
                <div key={o.id} className="px-4 py-2.5">
                  <p className="text-[12.5px] leading-snug text-ink">{o.texto}</p>
                  <p className="mono mt-0.5 text-[10px] font-bold uppercase tracking-widest text-ink3">{o.fecha} · {o.autor}</p>
                </div>
              ))}
              {medidas.length === 0 && obs.length === 0 && <p className="px-4 py-8 text-center text-[13px] italic text-ink3">Sin observaciones ni medidas asociadas.</p>}
            </div>
            {editando ? (
              <div className="border-t border-line p-3">
                <textarea rows={2} className="inp" placeholder="Añadir observación…" id="obs-nueva" />
                <div className="mt-2 flex justify-end gap-2">
                  <button className="cursor-pointer text-[12px] font-bold text-ink2 hover:text-ink" onClick={() => setEditando(false)}>Cancelar</button>
                  <button className="cursor-pointer rounded-lg bg-vir px-3 py-1.5 text-[12px] font-bold text-white hover:bg-vird" onClick={() => {
                    const el = document.getElementById("obs-nueva") as HTMLTextAreaElement | null;
                    if (el && el.value.trim()) {
                      set((s) => ({ ...s, observations: [...s.observations, { id: Math.random().toString(36).slice(2, 9), studentId: stId, fecha: new Date().toISOString().slice(0, 10), texto: el.value.trim(), autor: d.teachers.find((t) => t.id === d.teacherId)?.nombre ?? "Profesorado" }] }));
                      setEditando(false);
                    }
                  }}>Guardar</button>
                </div>
              </div>
            ) : (
              <button className="w-full cursor-pointer border-t border-line px-4 py-2.5 text-left mono text-[11px] font-bold text-vir hover:bg-virl/30" onClick={() => setEditando(true)}>+ añadir observación</button>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
