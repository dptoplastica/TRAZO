import { useState } from "react";
import { useApp, visibleProgramaciones, studentsOf, finalGrade, fmt, nivelDe } from "../store";
import { Ic, Reveal, SectionHead, LevelChip, EmptyState } from "../components/ui";

export default function Alumnado() {
  const { d, params, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const groups = d.groups.filter((g) => progs.some((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === g.id));
  const group = d.groups.find((g) => g.id === (params.groupId ?? groups[0]?.id)) ?? groups[0];
  const students = group ? studentsOf(d, group.id) : [];
  const [q, setQ] = useState("");
  const progDeGrupo = progs.find((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === group?.id);
  const lista = students.filter((s) => s.nombre.toLowerCase().includes(q.toLowerCase()));

  if (!group) return <EmptyState icon="users" title="Sin grupos" />;

  return (
    <div>
      <SectionHead kicker="Perfiles académicos" title={`Alumnado · ${group.nombre}`} desc="Grado de consecución de criterios y competencias." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (<button key={g.id} onClick={() => nav("alumnado", { groupId: g.id })} className={`cursor-pointer rounded-lg border-2 px-3.5 py-1.5 text-[13px] font-bold ${g.id === group.id ? "border-ink bg-ink text-paper" : "border-line2 bg-card text-ink2"}`}>{g.nombre}</button>))}
        <div className="relative ml-auto w-full sm:w-64">
          <Ic n="search" s={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
          <input className="inp !pl-8 !py-1.5" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <Reveal>
        <div className="card overflow-hidden">
          <div className="divide-y divide-line/60">
            {lista.map((st) => {
              const f = progDeGrupo ? finalGrade(d, progDeGrupo.id, st.id) : { score: null, coverage: 0 };
              return (
                <button key={st.id} onClick={() => nav("alumnado", { groupId: group.id, studentId: st.id })} className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left hover:bg-virl/25">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold text-ink">{st.nombre}</span>
                    <span className="mono text-[10px] uppercase tracking-widest text-ink3">{st.neae ? "NEAE" : `${Math.round(f.coverage * 100)}% eval.`}</span>
                  </span>
                  <LevelChip score={f.score} sm />
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
