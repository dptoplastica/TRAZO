import { useMemo, useState } from "react";
import { useApp, visibleGroups, groupSessions, studentsOf, uid, fmt, critScore } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { NIVELES_RUBRICA, toISO } from "../data/seed";
import { Ic, SectionHead, EmptyState, btn, LevelChip } from "../components/ui";

type Tab = "asistencia" | "notas" | "rubricas" | "obs";

export default function Cuaderno() {
  const { d, params, set, notify, me } = useApp();
  const groups = visibleGroups(d);
  const [groupId, setGroupId] = useState(params.groupId ?? groups[0]?.id ?? "");
  const group = d.groups.find((g) => g.id === groupId) ?? groups[0];
  const subjects = d.subjects.filter((s) => s.grupoId === group?.id);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const sub = d.subjects.find((s) => s.id === subjectId && s.grupoId === group?.id) ?? subjects[0];
  const [tab, setTab] = useState<Tab>("asistencia");
  const students = group ? studentsOf(d, group.id) : [];

  if (!group || !sub) {
    return <EmptyState icon="pen" title="Sin grupos asignados" desc="Este perfil no tiene materias ni grupos asignados. Cambia de usuario desde la barra lateral." />;
  }

  return (
    <div>
      <SectionHead
        kicker="Seguimiento diario"
        title={`Cuaderno del profesor · ${group.nombre}`}
        desc={`Registro de asistencia, calificaciones por criterio, rúbricas y observaciones de ${sub.nombre}. Todo lo registrado alimenta automáticamente los informes.`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (
          <button key={g.id} onClick={() => { setGroupId(g.id); const s0 = d.subjects.find((s) => s.grupoId === g.id); if (s0) setSubjectId(s0.id); }} className={`cursor-pointer rounded-lg border-2 px-3.5 py-1.5 text-[13px] font-bold transition-all ${g.id === group.id ? "border-ink bg-ink text-paper -translate-y-0.5 shadow" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}>
            {g.nombre}
          </button>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-line2 sm:block" />
        {subjects.map((s) => (
          <button key={s.id} onClick={() => setSubjectId(s.id)} className={`cursor-pointer rounded-lg px-3 py-1.5 text-[12.5px] font-bold transition-all ${s.id === sub.id ? "text-white shadow" : "text-ink2 hover:text-ink"}`} style={s.id === sub.id ? { background: s.color } : undefined}>
            {s.corto}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-line bg-panel p-1">
        {([["asistencia", "Asistencia", "users"], ["notas", "Calificaciones", "clipboard"], ["rubricas", "Rúbricas", "grid"], ["obs", "Observaciones", "eye"]] as const).map(([id, l, ic]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition-all ${tab === id ? "bg-ink text-paper shadow" : "text-ink2 hover:bg-line/50"}`}>
            <Ic n={ic} s={15} /> {l}
          </button>
        ))}
      </div>

      <div className="pop" key={tab}>
        {tab === "asistencia" && <Asistencia groupId={group.id} students={students} set={set} />}
        {tab === "notas" && <Notas subjectId={sub.id} students={students} set={set} notify={notify} />}
        {tab === "rubricas" && <Rubricas subjectId={sub.id} students={students} set={set} notify={notify} />}
        {tab === "obs" && <Obs students={students} set={set} notify={notify} me={me.nombre} />}
      </div>
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

function Rubricas({ subjectId, students, set, notify }: { subjectId: string; students: ReturnType<typeof studentsOf>; set: any; notify: (m: string) => void }) {
  const { d } = useApp();
  const sub = d.subjects.find((s) => s.id === subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const rubs = d.instruments.filter((i) => i.subjectId === subjectId && i.rubrica);
  const [insId, setInsId] = useState(rubs[0]?.id ?? "");
  const ins = rubs.find((i) => i.id === insId);
  const [critId, setCritId] = useState(ins?.criterioIds[0] ?? "");
  const niveles = ins?.rubrica ?? NIVELES_RUBRICA;
  const hoy = toISO(new Date());

  const current = useMemo(() => new Map(
    d.grades.filter((g) => g.instrumentoId === insId && g.criterioId === critId).map((g) => [g.studentId, g.value])
  ), [d.grades, insId, critId]);

  const setLevel = (studentId: string, valor: number) => {
    set((s: any) => ({
      ...s,
      grades: [...s.grades.filter((g: any) => !(g.studentId === studentId && g.instrumentoId === insId && g.criterioId === critId)),
        { id: uid(), studentId, instrumentoId: insId, criterioId: critId, value: valor, fecha: hoy }],
    }));
    notify("Nivel registrado en la rúbrica");
  };

  if (!ins) return <EmptyState icon="grid" title="Sin rúbricas" desc="Crea un instrumento de tipo rúbrica en Evaluación." />;
  const crit = allCriterios(cur).find((c) => c.id === critId);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <div>
          <label className="lbl !mb-1">Rúbrica</label>
          <select className="inp !w-auto !py-1.5 text-[12.5px]" value={insId} onChange={(e) => { setInsId(e.target.value); const i = rubs.find((x) => x.id === e.target.value); setCritId(i?.criterioIds[0] ?? ""); }}>
            {rubs.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl !mb-1">Criterio</label>
          <div className="flex gap-1.5">
            {ins.criterioIds.map((cId) => {
              const c = allCriterios(cur).find((x) => x.id === cId);
              return (
                <button key={cId} onClick={() => setCritId(cId)} className={`mono cursor-pointer rounded-md border px-2.5 py-1.5 text-[11.5px] font-extrabold transition ${critId === cId ? "border-transparent text-white shadow" : "border-line2 bg-card text-ink2"}`} style={critId === cId ? { background: sub.color } : undefined} title={c?.texto}>{c?.codigo}</button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="border-b border-line bg-paper/70 px-4 py-2 text-[12px] italic text-ink2">Criterio {crit?.codigo}: {crit?.texto}</p>
      <div className="divide-y divide-line/60">
        {students.map((st) => {
          const val = current.get(st.id);
          return (
            <div key={st.id} className="flex flex-wrap items-center gap-2 px-4 py-2.5 sm:flex-nowrap">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
                {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
              </span>
              <p className="min-w-[140px] flex-1 truncate text-[13.5px] font-semibold text-ink">{st.nombre}</p>
              <div className="flex flex-1 flex-wrap gap-1">
                {niveles.map((n) => {
                  const on = val !== undefined && Math.abs(val - n.valor) < 0.01;
                  return (
                    <button key={n.id} onClick={() => setLevel(st.id, n.valor)} title={n.desc} className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150 active:scale-95 ${on ? "border-transparent text-white shadow-md scale-[1.04]" : "border-line bg-card text-ink2 hover:border-ink3"}`} style={on ? { background: n.valor >= 9 ? "#2c6e8f" : n.valor >= 7 ? "#0e7c66" : n.valor >= 5 ? "#c98a12" : "#d9532c" } : undefined}>
                      <span className="mono block text-[11px] font-extrabold leading-none">{n.nombre}</span>
                      <span className="mono block text-[9.5px] opacity-80">{n.valor}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Obs({ students, set, notify, me }: { students: ReturnType<typeof studentsOf>; set: any; notify: (m: string) => void; me: string }) {
  const { d } = useApp();
  const [stId, setStId] = useState(students[0]?.id ?? "");
  const [txt, setTxt] = useState("");
  const obs = d.observations.filter((o) => o.studentId === stId).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  const add = () => {
    if (!txt.trim()) return;
    set((s: any) => ({ ...s, observations: [...s.observations, { id: uid(), studentId: stId, fecha: toISO(new Date()), texto: txt.trim(), autor: me }] }));
    setTxt("");
    notify("Observación registrada");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="card h-fit overflow-hidden">
        <p className="border-b border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-ink2">Alumnado del grupo</p>
        <div className="max-h-[420px] divide-y divide-line/60 overflow-y-auto">
          {students.map((st) => {
            const n = d.observations.filter((o) => o.studentId === st.id).length;
            return (
              <button key={st.id} onClick={() => setStId(st.id)} className={`flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left transition ${stId === st.id ? "bg-virl/50" : "hover:bg-virl/25"}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{st.nombre}</span>
                {n > 0 && <span className="mono rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-paper">{n}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-line p-4">
          <label className="lbl">Nueva observación · {students.find((s) => s.id === stId)?.nombre}</label>
          <div className="flex gap-2">
            <textarea rows={2} className="inp flex-1" placeholder="p. ej. Ha mejorado notablemente la limpieza del trazo en las últimas láminas…" value={txt} onChange={(e) => setTxt(e.target.value)} />
            <button className={btn + " self-end"} onClick={add}><Ic n="plus" s={15} /> Registrar</button>
          </div>
        </div>
        <div className="divide-y divide-line/60">
          {obs.map((o) => (
            <div key={o.id} className="px-4 py-3">
              <p className="text-[13px] leading-relaxed text-ink">{o.texto}</p>
              <p className="mono mt-1 text-[10.5px] font-bold uppercase tracking-widest text-ink3">{o.fecha} · {o.autor}</p>
            </div>
          ))}
          {obs.length === 0 && <p className="px-4 py-8 text-center text-[13px] italic text-ink3">Sin observaciones registradas para este alumno/a.</p>}
        </div>
      </div>
    </div>
  );
}
