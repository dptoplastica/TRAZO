import { useState } from "react";
import { useApp, visibleSubjects, uid } from "../store";
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

  if (!sub || !cur) return <EmptyState icon="clipboard" title="Sin materias" />;

  const del = (id: string) => { set((s) => ({ ...s, instruments: s.instruments.filter((i) => i.id !== id), grades: s.grades.filter((g) => g.instrumentoId !== id) })); notify("Instrumento eliminado"); };
  const save = (ins: Instrument) => { set((s) => { const exists = s.instruments.some((i) => i.id === ins.id); return { ...s, instruments: exists ? s.instruments.map((i) => (i.id === ins.id ? ins : i)) : [...s.instruments, ins] }; }); notify("Instrumento guardado"); setNuevo(false); setEdit(null); };

  return (
    <div>
      <SectionHead kicker="Evaluación formativa" title="Instrumentos y ponderación" desc="Cada instrumento se vincula a criterios y pondera las calificaciones." actions={<button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Nuevo instrumento</button>} />
      <div className="mb-5 flex flex-wrap gap-2">
        {subjects.map((s) => (<button key={s.id} onClick={() => setSubjectId(s.id)} className={`cursor-pointer rounded-lg border-2 px-3.5 py-2 text-left transition-all ${s.id === sub.id ? "border-ink bg-ink text-paper" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}><p className="text-[13px] font-bold">{s.corto}</p></button>))}
      </div>
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
