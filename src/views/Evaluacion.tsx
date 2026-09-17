import { useState } from "react";
import { useApp, visibleSubjects, uid } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { TIPOS_INSTRUMENTO, NIVELES_RUBRICA, toISO, type Instrument } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, btnDanger, SelChip } from "../components/ui";

const ICONO_TIPO: Record<string, string> = {
  rubrica: "grid", escala: "gauge", lista: "list", escrita: "pen", practica: "compass", proyecto: "target",
  portfolio: "book", observacion: "eye", lamina: "file", exposicion: "users", digital: "grid", autoevaluacion: "user", coevaluacion: "users",
};

export default function Evaluacion() {
  const { d, params, nav, set, notify } = useApp();
  const subjects = visibleSubjects(d);
  const [subjectId, setSubjectId] = useState(params.subjectId ?? subjects[0]?.id ?? "");
  const sub = d.subjects.find((s) => s.id === subjectId) ?? subjects[0];
  const cur = sub ? getCurriculum(sub.curriculumId) : null;
  const prog = sub ? d.programaciones.find((p) => p.subjectId === sub.id) : undefined;
  const instrumentos = d.instruments.filter((i) => i.subjectId === sub?.id);
  const [edit, setEdit] = useState<Instrument | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [rubSel, setRubSel] = useState<string | null>(null);
  const hoy = toISO(new Date());

  if (!sub || !cur) return <EmptyState icon="clipboard" title="Sin materias" desc="No hay materias visibles para este perfil." />;

  const del = (id: string) => {
    set((s) => ({ ...s, instruments: s.instruments.filter((i) => i.id !== id), grades: s.grades.filter((g) => g.instrumentoId !== id) }));
    notify("Instrumento eliminado (y sus calificaciones)");
  };
  const dup = (i: Instrument) => {
    set((s) => ({ ...s, instruments: [...s.instruments, { ...i, id: uid(), nombre: i.nombre + " (copia)", fecha: undefined }] }));
    notify("Instrumento duplicado");
  };
  const save = (ins: Instrument) => {
    set((s) => {
      const exists = s.instruments.some((i) => i.id === ins.id);
      return { ...s, instruments: exists ? s.instruments.map((i) => (i.id === ins.id ? ins : i)) : [...s.instruments, ins] };
    });
    notify("Instrumento guardado");
    setNuevo(false); setEdit(null);
  };

  const rubrica = instrumentos.find((i) => i.id === rubSel && i.rubrica) ?? instrumentos.find((i) => i.rubrica);

  return (
    <div>
      <SectionHead
        kicker="Evaluación formativa"
        title="Instrumentos y ponderación"
        desc="Cada instrumento se vincula a criterios de evaluación y pondera las calificaciones. Las rúbricas comparten niveles de desempeño coherentes."
        actions={<button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Nuevo instrumento</button>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button key={s.id} onClick={() => { setSubjectId(s.id); nav("evaluacion", { subjectId: s.id }); }} className={`cursor-pointer rounded-lg border-2 px-3.5 py-2 text-left transition-all ${s.id === sub.id ? "border-ink bg-ink text-paper -translate-y-0.5 shadow-md" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}>
            <p className="text-[13px] font-bold leading-tight">{s.corto}</p>
            <p className="mono text-[10px] uppercase tracking-widest opacity-70">{d.groups.find((g) => g.id === s.grupoId)?.nombre}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* instrumentos */}
        <div className="space-y-3">
          {instrumentos.map((i, idx) => {
            const aplicado = i.fecha ? i.fecha <= hoy : false;
            const nNotas = d.grades.filter((g) => g.instrumentoId === i.id).length;
            return (
              <Reveal key={i.id} delay={idx * 50}>
                <div className="card card-h p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${sub.color}16`, color: sub.color }}>
                      <Ic n={ICONO_TIPO[i.tipo] ?? "clipboard"} s={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-[15.5px] font-extrabold text-ink">{i.nombre}</p>
                        <span className="mono rounded bg-paper border border-line px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink2">{TIPOS_INSTRUMENTO.find((t) => t.id === i.tipo)?.label}</span>
                        {aplicado
                          ? <span className="inline-flex items-center gap-1 rounded-md bg-virl px-1.5 py-0.5 text-[10px] font-bold text-vird"><Ic n="check" s={10} /> aplicado · {nNotas} notas</span>
                          : <span className="inline-flex items-center gap-1 rounded-md bg-ambl px-1.5 py-0.5 text-[10px] font-bold text-amb"><Ic n="clock" s={10} /> previsto{i.fecha ? ` · ${i.fecha}` : ""}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {i.criterioIds.map((cId) => {
                          const c = allCriterios(cur).find((x) => x.id === cId);
                          return <span key={cId} className="mono rounded border border-line bg-paper px-1.5 py-0.5 text-[10.5px] font-bold text-ink2" title={c?.texto}>{c?.codigo}</span>;
                        })}
                        <span className="mono ml-auto rounded-lg bg-ink px-2 py-0.5 text-[11px] font-extrabold text-paper" title="Peso del instrumento dentro de cada criterio">peso ×{i.peso}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-3">
                    <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => setEdit(i)}><Ic n="edit" s={13} /> Editar</button>
                    <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => dup(i)}><Ic n="copy" s={13} /> Duplicar</button>
                    {i.rubrica && <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => setRubSel(i.id)}><Ic n="grid" s={13} /> Ver rúbrica</button>}
                    <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => nav("cuaderno", { groupId: sub.grupoId })}><Ic n="pen" s={13} /> Calificar</button>
                    <button className={btnDanger + " ml-auto"} onClick={() => del(i.id)}><Ic n="trash" s={13} /></button>
                  </div>
                </div>
              </Reveal>
            );
          })}
          {instrumentos.length === 0 && <EmptyState icon="clipboard" title="Sin instrumentos" desc="Crea el primer instrumento de evaluación para esta materia." action={<button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Crear instrumento</button>} />}
        </div>

        {/* lateral: ponderación + rúbrica */}
        <aside className="space-y-4">
          {prog && (
            <div className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="lbl !mb-0">Ponderación de criterios</p>
                <button onClick={() => nav("programaciones", { programacionId: prog.id })} className="mono text-[10.5px] font-bold text-vir hover:underline cursor-pointer">editar →</button>
              </div>
              <div className="space-y-1">
                {allCriterios(cur).map((c) => {
                  const p = prog.ponderaciones[c.id] ?? 0;
                  return (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="mono w-9 shrink-0 text-[11px] font-extrabold" style={{ color: sub.color }}>{c.codigo}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/70">
                        <div className="h-full rounded-full" style={{ width: `${p * 5}%`, background: sub.color }} />
                      </div>
                      <span className="mono w-10 shrink-0 text-right text-[11px] font-bold text-ink2">{p}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {rubrica && (
            <div className="card overflow-hidden">
              <div className="border-b border-line px-4 py-3">
                <p className="lbl !mb-0">Rúbrica · {rubrica.nombre}</p>
                <p className="mt-0.5 text-[11.5px] text-ink3">Escala de desempeño compartida por el departamento</p>
              </div>
              <div className="divide-y divide-line/60">
                {(rubrica.rubrica ?? NIVELES_RUBRICA).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-2.5">
                    <span className={`mono mt-0.5 shrink-0 rounded-md px-2 py-1 text-[11px] font-extrabold text-white ${n.valor >= 9 ? "bg-azu" : n.valor >= 7 ? "bg-vir" : n.valor >= 5 ? "bg-amb" : "bg-verm"}`}>{n.valor}</span>
                    <div>
                      <p className="text-[12.5px] font-bold text-ink">{n.nombre}</p>
                      <p className="text-[11.5px] leading-snug text-ink2">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line bg-paper/70 px-4 py-2.5">
                <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Evalúa los criterios</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rubrica.criterioIds.map((cId) => {
                    const c = allCriterios(cur).find((x) => x.id === cId);
                    return <span key={cId} className="mono rounded bg-card border border-line px-1.5 py-0.5 text-[10.5px] font-bold text-ink2">{c?.codigo}</span>;
                  })}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      <InstrumentModal
        open={nuevo || !!edit}
        initial={edit ?? { id: uid(), subjectId: sub.id, nombre: "", tipo: "rubrica", peso: 20, criterioIds: [], rubrica: NIVELES_RUBRICA, fecha: toISO(new Date(Date.now() + 7 * 864e5)) }}
        onClose={() => { setNuevo(false); setEdit(null); }}
        onSave={save}
        curId={sub.curriculumId}
      />
    </div>
  );
}

function InstrumentModal({ open, initial, onClose, onSave, curId }: { open: boolean; initial: Instrument; onClose: () => void; onSave: (i: Instrument) => void; curId: string }) {
  const [v, setV] = useState<Instrument>(initial);
  const [key, setKey] = useState(initial.id);
  if (open && key !== initial.id) { setV(initial); setKey(initial.id); }
  const cur = getCurriculum(curId);
  return (
    <Modal open={open} onClose={onClose} title={initial.nombre ? "Editar instrumento" : "Nuevo instrumento"} wide>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="lbl">Nombre</label><input className="inp" value={v.nombre} onChange={(e) => setV({ ...v, nombre: e.target.value })} placeholder="p. ej. Rúbrica · proyecto final" /></div>
        <div>
          <label className="lbl">Tipo de instrumento</label>
          <select className="inp" value={v.tipo} onChange={(e) => setV({ ...v, tipo: e.target.value as Instrument["tipo"], rubrica: e.target.value === "rubrica" ? NIVELES_RUBRICA : v.rubrica })}>
            {TIPOS_INSTRUMENTO.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="lbl">Peso</label><input type="number" min={1} className="inp" value={v.peso} onChange={(e) => setV({ ...v, peso: Number(e.target.value) || 1 })} /></div>
          <div><label className="lbl">Fecha prevista</label><input type="date" className="inp" value={v.fecha ?? ""} onChange={(e) => setV({ ...v, fecha: e.target.value || undefined })} /></div>
        </div>
      </div>
      <label className="lbl mt-4">Criterios de evaluación vinculados</label>
      <div className="flex flex-wrap gap-1.5">
        {allCriterios(cur).map((c) => (
          <SelChip key={c.id} active={v.criterioIds.includes(c.id)} onClick={() => setV({ ...v, criterioIds: v.criterioIds.includes(c.id) ? v.criterioIds.filter((x) => x !== c.id) : [...v.criterioIds, c.id] })} color="#c98a12">{c.codigo}</SelChip>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-ink3">Cada calificación de este instrumento computará dentro de los criterios seleccionados, ponderada por su peso.</p>
      <div className="mt-4 flex justify-end gap-2">
        <button className={btnGhost} onClick={onClose}>Cancelar</button>
        <button className={btn} disabled={!v.nombre.trim() || v.criterioIds.length === 0} onClick={() => onSave(v)}><Ic n="check" s={15} /> Guardar</button>
      </div>
    </Modal>
  );
}
