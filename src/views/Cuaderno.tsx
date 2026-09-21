import { useMemo, useState } from "react";
import { useApp, visibleGroups, groupSessions, studentsOf, uid, fmt, critScore } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { NIVELES_RUBRICA, toISO } from "../data/seed";
import { Ic, SectionHead, EmptyState, btn, LevelChip } from "../components/ui";

export default function Cuaderno() {
  const { d, params, set, notify, me } = useApp();
  const groups = visibleGroups(d);
  const [groupId, setGroupId] = useState(params.groupId ?? groups[0]?.id ?? "");
  const group = d.groups.find((g) => g.id === groupId) ?? groups[0];
  const subjects = d.subjects.filter((s) => s.grupoId === group?.id);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const sub = d.subjects.find((s) => s.id === subjectId && s.grupoId === group?.id) ?? subjects[0];
  const [tab, setTab] = useState<"asistencia" | "notas">("asistencia");
  const students = group ? studentsOf(d, group.id) : [];

  if (!group || !sub) return <EmptyState icon="pen" title="Sin grupos" />;

  return (
    <div>
      <SectionHead kicker="Seguimiento diario" title={`Cuaderno · ${group.nombre}`} desc={`Registro de asistencia y calificaciones de ${sub.nombre}.`} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (<button key={g.id} onClick={() => { setGroupId(g.id); const s0 = d.subjects.find((s) => s.grupoId === g.id); if (s0) setSubjectId(s0.id); }} className={`cursor-pointer rounded-lg border-2 px-3.5 py-1.5 text-[13px] font-bold ${g.id === group.id ? "border-ink bg-ink text-paper" : "border-line2 bg-card text-ink2"}`}>{g.nombre}</button>))}
        {subjects.map((s) => (<button key={s.id} onClick={() => setSubjectId(s.id)} className={`cursor-pointer rounded-lg px-3 py-1.5 text-[12.5px] font-bold ${s.id === sub.id ? "text-white shadow" : "text-ink2"}`} style={s.id === sub.id ? { background: s.color } : undefined}>{s.corto}</button>))}
      </div>
      <div className="mb-4 flex gap-1 rounded-xl border border-line bg-panel p-1">
        {([["asistencia", "Asistencia", "users"], ["notas", "Calificaciones", "clipboard"]] as const).map(([id, l, ic]) => (<button key={id} onClick={() => setTab(id)} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold ${tab === id ? "bg-ink text-paper" : "text-ink2 hover:bg-line/50"}`}><Ic n={ic} s={15} /> {l}</button>))}
      </div>
      {tab === "asistencia" && <Asistencia groupId={group.id} students={students} set={set} />}
      {tab === "notas" && <Notas subjectId={sub.id} students={students} set={set} notify={notify} />}
    </div>
  );
}

function Asistencia({ groupId, students, set }: { groupId: string; students: ReturnType<typeof studentsOf>; set: any }) {
  const { d } = useApp();
  const past = groupSessions(d, groupId).past.slice(-12).reverse();
  const [fecha, setFecha] = useState(past[0] ? toISO(past[0]) : toISO(new Date()));
  const recs = useMemo(() => new Map(d.attendance.filter((a: any) => a.fecha === fecha && a.groupId === groupId).map((a: any) => [a.studentId, a.estado])), [d.attendance, fecha, groupId]);
  const mark = (studentId: string, estado: "P" | "F" | "R") => set((s: any) => ({ ...s, attendance: [...s.attendance.filter((a: any) => !(a.fecha === fecha && a.groupId === groupId && a.studentId === studentId)), { id: `a|${studentId}|${fecha}`, groupId, fecha, studentId, estado }] }));

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <p className="mr-2 text-[13px] font-bold text-ink">Sesión:</p>
        {past.map((dt) => { const iso = toISO(dt); return (<button key={iso} onClick={() => setFecha(iso)} className={`mono cursor-pointer rounded-md border px-2 py-1 text-[11px] font-bold capitalize ${fecha === iso ? "border-vir bg-vir text-white" : "border-line bg-card text-ink2"}`}>{dt.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}</button>); })}
      </div>
      <div className="divide-y divide-line/60">
        {students.map((st) => {
          const e = recs.get(st.id) ?? "P";
          return (
            <div key={st.id} className="flex items-center gap-3 px-4 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
              <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink">{st.nombre}</p>
              <div className="flex gap-1">
                {([["P", "bg-vir"], ["F", "bg-verm"], ["R", "bg-amb"]] as const).map(([k, col]) => (<button key={k} onClick={() => mark(st.id, k)} className={`mono h-8 w-8 cursor-pointer rounded-lg border text-[12px] font-extrabold ${e === k ? `${col} text-white border-transparent` : "border-line bg-card text-ink3"}`}>{k}</button>))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Notas({ subjectId, students, set, notify }: { subjectId: string; students: ReturnType<typeof studentsOf>; set: any; notify: (m: string) => void }) {
  const { d } = useApp();
  const sub = d.subjects.find((s) => s.id === subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const instrumentos = d.instruments.filter((i) => i.subjectId === subjectId);
  const [insId, setInsId] = useState(instrumentos[0]?.id ?? "");
  const ins = instrumentos.find((i) => i.id === insId);
  const [critId, setCritId] = useState(ins?.criterioIds[0] ?? "");
  const [vals, setVals] = useState<Record<string, string>>({});
  const existentes = useMemo(() => new Map(d.grades.filter((g) => g.instrumentoId === insId && g.criterioId === critId).map((g) => [g.studentId, g.value])), [d.grades, insId, critId]);

  const guardar = () => {
    const hoy = toISO(new Date());
    set((s: any) => {
      let grades = [...s.grades];
      for (const st of students) {
        const raw = vals[st.id]; if (raw === undefined || raw === "") continue;
        const v = Math.max(0, Math.min(10, parseFloat(raw.replace(",", "."))));
        if (Number.isNaN(v)) continue;
        grades = grades.filter((g) => !(g.studentId === st.id && g.instrumentoId === insId && g.criterioId === critId));
        grades.push({ id: uid(), studentId: st.id, instrumentoId: insId, criterioId: critId, value: Math.round(v * 10) / 10, fecha: hoy });
      }
      return { ...s, grades };
    });
    setVals({}); notify("Calificaciones guardadas");
  };

  if (!ins) return <EmptyState icon="clipboard" title="Sin instrumentos" />;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <select className="inp !w-auto !py-1.5 text-[12.5px]" value={insId} onChange={(e) => { setInsId(e.target.value); const i = instrumentos.find((x) => x.id === e.target.value); setCritId(i?.criterioIds[0] ?? ""); setVals({}); }}>
          {instrumentos.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
        <div className="flex flex-wrap gap-1.5">
          {ins.criterioIds.map((cId) => { const c = allCriterios(cur).find((x) => x.id === cId); return (<button key={cId} onClick={() => { setCritId(cId); setVals({}); }} className={`mono cursor-pointer rounded-md border px-2.5 py-1.5 text-[11.5px] font-extrabold ${critId === cId ? "border-transparent text-white" : "border-line2 bg-card text-ink2"}`} style={critId === cId ? { background: sub.color } : undefined}>{c?.codigo}</button>); })}
        </div>
      </div>
      <div className="divide-y divide-line/60">
        {students.map((st) => {
          const cur0 = existentes.get(st.id);
          const r = critScore(d, st.id, critId);
          return (
            <div key={st.id} className="flex items-center gap-3 px-4 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
              <p className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink">{st.nombre}</p>
              <input type="number" min={0} max={10} step={0.1} className="inp !w-20 !px-2 !py-1 text-right mono text-[13px] font-bold" placeholder="—" defaultValue={vals[st.id] !== undefined ? vals[st.id] : cur0 !== undefined ? String(cur0) : ""} key={st.id + insId + critId} onChange={(e) => setVals((v) => ({ ...v, [st.id]: e.target.value }))} />
              <LevelChip score={r.score} sm />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-line bg-paper/60 px-4 py-3">
        <p className="text-[12px] text-ink2"><b>{Object.values(vals).filter((x) => x !== "").length}</b> calificaciones nuevas</p>
        <button className={btn} onClick={guardar}><Ic n="check" s={15} /> Guardar</button>
      </div>
    </div>
  );
}
