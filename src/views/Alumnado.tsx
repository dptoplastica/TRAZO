import { useState } from "react";
import { useApp, visibleProgramaciones, studentsOf, finalGrade, ceAgg, claveAgg, fmt, nivelDe, claveNivel } from "../store";
import { getCurriculum, CLAVES, clavesDeCE } from "../data/curriculum";
import { Ic, Reveal, SectionHead, LevelChip, EmptyState, Bar } from "../components/ui";

export default function Alumnado() {
  const { d, params, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const groups = d.groups.filter((g) => progs.some((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === g.id));
  const group = d.groups.find((g) => g.id === (params.groupId ?? groups[0]?.id)) ?? groups[0];
  const students = group ? studentsOf(d, group.id) : [];
  const [q, setQ] = useState("");
  const progDeGrupo = progs.find((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === group?.id);
  const lista = students.filter((s) => s.nombre.toLowerCase().includes(q.toLowerCase()));
  const sel = students.find((s) => s.id === params.studentId) ?? students[0];

  if (!group) return <EmptyState icon="users" title="Sin grupos" />;

  return (
    <div>
      <SectionHead kicker="Perfiles académicos" title={`Alumnado · ${group.nombre}`} desc="Grado de consecución de criterios, competencias específicas y competencias clave, calculado a partir del cuaderno del profesor." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (<button key={g.id} onClick={() => nav("alumnado", { groupId: g.id })} className={`cursor-pointer rounded-lg border-2 px-3.5 py-1.5 text-[13px] font-bold ${g.id === group.id ? "border-ink bg-ink text-paper" : "border-line2 bg-card text-ink2"}`}>{g.nombre}</button>))}
        <div className="relative ml-auto w-full sm:w-64">
          <Ic n="search" s={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
          <input className="inp !pl-8 !py-1.5" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Lista de alumnos */}
        <Reveal className="lg:h-fit lg:sticky lg:top-20">
          <div className="card overflow-hidden">
            <div className="divide-y divide-line/60 max-h-[560px] overflow-y-auto">
              {lista.map((st) => {
                const f = progDeGrupo ? finalGrade(d, progDeGrupo.id, st.id) : { score: null, coverage: 0 };
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

        {/* Perfil del alumno seleccionado */}
        {sel && progDeGrupo && <Perfil key={sel.id} stId={sel.id} progId={progDeGrupo.id} />}
      </div>
    </div>
  );
}

function Perfil({ stId, progId }: { stId: string; progId: string }) {
  const { d, nav } = useApp();
  const st = d.students.find((s) => s.id === stId)!;
  const prog = d.programaciones.find((p) => p.id === progId)!;
  const sub = d.subjects.find((s) => s.id === prog.subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const group = d.groups.find((g) => g.id === st.groupId)!;

  const final = finalGrade(d, progId, stId);
  const asistencia = d.attendance.filter((a) => a.studentId === stId);
  const faltas = asistencia.filter((a) => a.estado === "F").length;
  const retrasos = asistencia.filter((a) => a.estado === "R").length;
  const pctAsis = asistencia.length ? Math.round(((asistencia.length - faltas - retrasos * 0.5) / asistencia.length) * 100) : 100;
  const obs = d.observations.filter((o) => o.studentId === stId);
  const medidas = d.measures.filter((m) => m.studentId === stId || (m.groupId === st.groupId && !m.studentId));

  return (
    <div className="space-y-4">
      {/* Cabecera perfil */}
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
              </div>
            </div>
            <div className="text-right">
              <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Calificación global</p>
              <p className="font-display text-[40px] font-extrabold leading-none" style={{ color: nivelDe(final.score).hex }}>{fmt(final.score)}</p>
              <p className="mono text-[11px] font-bold" style={{ color: nivelDe(final.score).hex }}>{nivelDe(final.score).t}</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Competencias específicas y criterios */}
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

      {/* Competencias clave */}
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

      {/* Observaciones y medidas */}
      <Reveal delay={120}>
        <div className="card overflow-hidden">
          <p className="border-b border-line px-4 py-3 text-[13.5px] font-bold text-ink">Observaciones y medidas</p>
          <div className="divide-y divide-line/60">
            {medidas.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 px-4 py-2.5">
                <span className="mono mt-0.5 shrink-0 rounded bg-azul px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase text-azu">{m.tipo}</span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-ink">{m.titulo}</p>
                  <p className="text-[11.5px] leading-snug text-ink2">{m.descripcion}</p>
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
        </div>
      </Reveal>
    </div>
  );
}
