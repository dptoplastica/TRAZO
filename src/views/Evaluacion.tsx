import { useState, useMemo } from "react";
import { useApp, visibleSubjects, uid, studentsOf } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { TIPOS_INSTRUMENTO, NIVELES_RUBRICA, toISO, type Instrument } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, btnDanger } from "../components/ui";

export default function Evaluacion() {
  const { d, params, nav, set, notify } = useApp();
  const subjects = visibleSubjects(d);
  const [subjectId, setSubjectId] = useState(params.subjectId ?? subjects[0]?.id ?? "");
  const sub = d.subjects.find((s) => s.id === subjectId) ?? subjects[0];
  const cur = sub ? getCurriculum(sub.curriculumId) : null;
  const instrumentos = d.instruments.filter((i) => i.subjectId === sub?.id);
  const [edit, setEdit] = useState<Instrument | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [tab, setTab] = useState<"instrumentos" | "actividades">("instrumentos");
  const [selectedSA, setSelectedSA] = useState<string | null>(null);

  if (!sub || !cur) return <EmptyState icon="clipboard" title="Sin materias" />;

  const del = (id: string) => { set((s) => ({ ...s, instruments: s.instruments.filter((i) => i.id !== id), grades: s.grades.filter((g) => g.instrumentoId !== id) })); notify("Instrumento eliminado"); };
  const save = (ins: Instrument) => { set((s) => { const exists = s.instruments.some((i) => i.id === ins.id); return { ...s, instruments: exists ? s.instruments.map((i) => (i.id === ins.id ? ins : i)) : [...s.instruments, ins] }; }); notify("Instrumento guardado"); setNuevo(false); setEdit(null); };

  const sas = d.sas.filter((sa) => sa.programacionId && d.programaciones.find((p) => p.id === sa.programacionId)?.subjectId === sub.id);

  return (
    <div>
      <SectionHead kicker="Evaluación formativa" title="Evaluación" desc="Gestiona instrumentos de evaluación y califica actividades individuales dentro de las situaciones de aprendizaje." actions={tab === "instrumentos" ? <button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Nuevo instrumento</button> : null} />
      
      <div className="mb-5 flex flex-wrap gap-2">
        {subjects.map((s) => (<button key={s.id} onClick={() => setSubjectId(s.id)} className={`cursor-pointer rounded-lg border-2 px-3.5 py-2 text-left transition-all ${s.id === sub.id ? "border-ink bg-ink text-paper" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}><p className="text-[13px] font-bold">{s.corto}</p></button>))}
      </div>

      <div className="mb-4 flex gap-1 rounded-xl border border-line bg-panel p-1">
        <button onClick={() => setTab("instrumentos")} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition-all ${tab === "instrumentos" ? "bg-ink text-paper shadow" : "text-ink2 hover:bg-line/50"}`}>
          <Ic n="clipboard" s={15} /> Instrumentos
        </button>
        <button onClick={() => setTab("actividades")} className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition-all ${tab === "actividades" ? "bg-ink text-paper shadow" : "text-ink2 hover:bg-line/50"}`}>
          <Ic n="list" s={15} /> Calificar actividades
        </button>
      </div>

      {tab === "instrumentos" && (
        <div className="space-y-3">
          {instrumentos.map((i) => (
            <Reveal key={i.id}>
              <div className="card card-h p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15.5px] font-extrabold text-ink">{i.nombre}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {i.criterioIds.map((cId) => { const c = allCriterios(cur).find((x) => x.id === cId); return <span key={cId} className="mono rounded border border-line bg-paper px-1.5 py-0.5 text-[10.5px] font-bold text-ink2">{c?.codigo}</span>; })}
                      <span className="mono ml-auto rounded-lg bg-ink px-2 py-0.5 text-[11px] font-extrabold text-paper">peso ×{i.peso}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-3">
                  <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => setEdit(i)}><Ic n="edit" s={13} /> Editar</button>
                  <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => nav("cuaderno", { groupId: sub.grupoId })}><Ic n="pen" s={13} /> Calificar</button>
                  <button className={btnDanger + " ml-auto"} onClick={() => del(i.id)}><Ic n="trash" s={13} /></button>
                </div>
              </div>
            </Reveal>
          ))}
          {instrumentos.length === 0 && <EmptyState icon="clipboard" title="Sin instrumentos" action={<button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Crear</button>} />}
        </div>
      )}

      {tab === "actividades" && (
        <div className="space-y-4">
          {sas.length === 0 ? (
            <EmptyState icon="list" title="Sin situaciones de aprendizaje" desc="No hay situaciones de aprendizaje para esta materia." />
          ) : (
            <>
              <div className="card p-4">
                <label className="lbl">Selecciona una situación de aprendizaje</label>
                <div className="space-y-2">
                  {sas.map((sa) => (
                    <button
                      key={sa.id}
                      onClick={() => setSelectedSA(sa.id)}
                      className={`w-full cursor-pointer rounded-lg border-2 p-3 text-left transition-all ${selectedSA === sa.id ? "border-vir bg-virl/30" : "border-line2 bg-card hover:border-line"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[14px] font-bold text-ink">{sa.titulo}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="mono text-[10px] font-bold text-ink3">{sa.sesiones} sesiones</span>
                            <span className="text-[10px] text-ink3">·</span>
                            <span className="text-[10px] text-ink3">{sa.actividades.length} actividades</span>
                            <span className="text-[10px] text-ink3">·</span>
                            <span className="text-[10px] text-ink3">{sa.eva}ª evaluación</span>
                          </div>
                        </div>
                        {selectedSA === sa.id && <Ic n="check" s={20} className="text-vir" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSA && <CalificarActividades saId={selectedSA} />}
            </>
          )}
        </div>
      )}

      <Modal open={nuevo || !!edit} onClose={() => { setNuevo(false); setEdit(null); }} title={edit ? "Editar instrumento" : "Nuevo instrumento"}>
        <InstrumentForm initial={edit ?? { id: uid(), subjectId: sub.id, nombre: "", tipo: "rubrica", peso: 20, criterioIds: [], rubrica: NIVELES_RUBRICA, fecha: toISO(new Date(Date.now() + 7 * 864e5)) }} onSave={save} curId={sub.curriculumId} />
      </Modal>
    </div>
  );
}

function InstrumentForm({ initial, onSave, curId }: { initial: Instrument; onSave: (i: Instrument) => void; curId: string }) {
  const [v, setV] = useState<Instrument>(initial);
  const cur = getCurriculum(curId);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="lbl">Nombre</label><input className="inp" value={v.nombre} onChange={(e) => setV({ ...v, nombre: e.target.value })} /></div>
        <div><label className="lbl">Tipo</label><select className="inp" value={v.tipo} onChange={(e) => setV({ ...v, tipo: e.target.value as Instrument["tipo"] })}>{TIPOS_INSTRUMENTO.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
        <div><label className="lbl">Peso</label><input type="number" min={1} className="inp" value={v.peso} onChange={(e) => setV({ ...v, peso: Number(e.target.value) || 1 })} /></div>
      </div>
      <label className="lbl mt-4">Criterios</label>
      <div className="flex flex-wrap gap-1.5">
        {allCriterios(cur).map((c) => (<button key={c.id} onClick={() => setV({ ...v, criterioIds: v.criterioIds.includes(c.id) ? v.criterioIds.filter((x) => x !== c.id) : [...v.criterioIds, c.id] })} className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold cursor-pointer ${v.criterioIds.includes(c.id) ? "border-transparent text-white bg-vir" : "border-line2 bg-card text-ink2"}`}>{c.codigo}</button>))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className={btnGhost} onClick={() => onSave(initial)}>Cancelar</button>
        <button className={btn} disabled={!v.nombre.trim() || v.criterioIds.length === 0} onClick={() => onSave(v)}><Ic n="check" s={15} /> Guardar</button>
      </div>
    </div>
  );
}

function CalificarActividades({ saId }: { saId: string }) {
  const { d, set, notify } = useApp();
  const sa = d.sas.find((s) => s.id === saId);
  const prog = sa ? d.programaciones.find((p) => p.id === sa.programacionId) : null;
  const sub = prog ? d.subjects.find((s) => s.id === prog.subjectId) : null;
  const students = sub ? studentsOf(d, sub.grupoId) : [];

  const [selectedActividad, setSelectedActividad] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});

  if (!sa || !sub) return null;

  const actividad = sa.actividades.find((a) => a.id === selectedActividad);

  const guardar = () => {
    if (!actividad) return;

    const hoy = toISO(new Date());
    let nuevasCalificaciones = 0;

    set((s) => {
      let grades = [...s.grades];
      
      for (const st of students) {
        const raw = vals[st.id];
        if (raw === undefined || raw === "") continue;
        
        const v = Math.max(0, Math.min(10, parseFloat(raw.replace(",", "."))));
        if (Number.isNaN(v)) continue;

        // Buscar si ya existe una calificación para esta actividad y alumno
        const existingIdx = grades.findIndex((g) => 
          g.studentId === st.id && 
          g.instrumentoId === `act-${actividad.id}` &&
          g.criterioId === actividad.criterioIds[0] // Usar el primer criterio de la actividad
        );

        if (existingIdx >= 0) {
          grades[existingIdx] = { ...grades[existingIdx], value: v, fecha: hoy };
        } else {
          grades.push({
            id: uid(),
            studentId: st.id,
            instrumentoId: `act-${actividad.id}`,
            criterioId: actividad.criterioIds[0] || "default",
            value: v,
            fecha: hoy
          });
        }
        nuevasCalificaciones++;
      }

      return { ...s, grades };
    });

    setVals({});
    notify(`${nuevasCalificaciones} calificaciones guardadas`);
  };

  const getNotaAlumno = (studentId: string, actividadId: string): number | null => {
    const grade = d.grades.find((g) => 
      g.studentId === studentId && 
      g.instrumentoId === `act-${actividadId}`
    );
    return grade ? grade.value : null;
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="lbl">Selecciona una actividad</label>
        <div className="space-y-2">
          {sa.actividades.map((act) => {
            const nota = students.length > 0 ? getNotaAlumno(students[0].id, act.id) : null;
            return (
              <button
                key={act.id}
                onClick={() => { setSelectedActividad(act.id); setVals({}); }}
                className={`w-full cursor-pointer rounded-lg border-2 p-3 text-left transition-all ${selectedActividad === act.id ? "border-vir bg-virl/30" : "border-line2 bg-card hover:border-line"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-ink">{act.titulo}</p>
                    <p className="mt-1 text-[11px] text-ink2">{act.desc}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="mono text-[10px] font-bold text-ink3">Sesión {act.sesion}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        act.fase === "Inicio" ? "bg-azul text-azu" : 
                        act.fase === "Desarrollo" ? "bg-virl text-vird" : 
                        "bg-ambl text-amb"
                      }`}>{act.fase}</span>
                      {act.criterioIds.length > 0 && (
                        <div className="flex gap-1">
                          {act.criterioIds.map((cId) => {
                            const c = allCriterios(getCurriculum(sub.curriculumId)).find((x) => x.id === cId);
                            return c ? <span key={cId} className="mono rounded border border-line bg-paper px-1 py-0.5 text-[9px] font-bold text-ink2">{c.codigo}</span> : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {nota !== null && (
                    <span className="mono rounded-lg bg-vir px-2 py-1 text-[11px] font-extrabold text-white">
                      {nota.toFixed(1)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedActividad && actividad && (
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-paper/60 px-4 py-3">
            <p className="text-[13px] font-bold text-ink">Calificar: {actividad.titulo}</p>
            <p className="mt-1 text-[11px] text-ink2">{actividad.desc}</p>
          </div>
          <div className="divide-y divide-line/60">
            {students.map((st) => {
              const notaActual = getNotaAlumno(st.id, actividad.id);
              return (
                <div key={st.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
                    {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{st.nombre}</p>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    className="inp !w-20 !px-2 !py-1 text-right mono text-[13px] font-bold"
                    placeholder={notaActual !== null ? notaActual.toFixed(1) : "—"}
                    defaultValue={vals[st.id] !== undefined ? vals[st.id] : notaActual !== null ? String(notaActual) : ""}
                    key={st.id + actividad.id}
                    onChange={(e) => setVals((v) => ({ ...v, [st.id]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-line bg-paper/60 px-4 py-3">
            <p className="text-[12px] text-ink2">
              <b>{Object.values(vals).filter((x) => x !== "").length}</b> calificaciones nuevas
            </p>
            <button className={btn} onClick={guardar}>
              <Ic n="check" s={15} /> Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
