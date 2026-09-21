import { useApp, visibleProgramaciones, uid, fmtFecha } from "../store";
import { getCurriculum } from "../data/curriculum";
import { METODOLOGIAS, type SA } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost } from "../components/ui";
import { fmtFechaL } from "../store";
import { useState } from "react";

export default function Situaciones() {
  const { d, params, nav, set, notify } = useApp();
  const progs = visibleProgramaciones(d);
  const [nueva, setNueva] = useState(false);
  const [progId, setProgId] = useState("");
  const [titulo, setTitulo] = useState("");

  const crear = () => {
    if (!progId || !titulo.trim()) return;
    const sa: SA = { id: uid(), programacionId: progId, titulo: titulo.trim(), eva: 1, inicio: new Date().toISOString().slice(0, 10), fin: new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10), sesiones: 6, justificacion: "", reto: "", producto: "", metodologias: ["Aprendizaje basado en proyectos"], agrupamientos: "Gran grupo", espacios: "Aula-taller", recursos: "", diversidad: "", evidencias: "", criterios: [], objetivos: [], actividades: [], instrumentos: [] };
    set((s) => ({ ...s, sas: [...s.sas, sa] }));
    setNueva(false); setTitulo(""); notify("SA creada");
    nav("situaciones", { saId: sa.id });
  };

  return (
    <div>
      <SectionHead kicker="Diseño de enseñanza" title="Situaciones de aprendizaje" desc="Retos contextualizados con producto final y todos los elementos curriculares vinculados." actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva situación</button>} />
      {progs.map((p) => {
        const sub = d.subjects.find((s) => s.id === p.subjectId);
        const sas = d.sas.filter((s) => s.programacionId === p.id);
        return (
          <Reveal key={p.id}>
            <div className="mb-6">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="h-4 w-1.5 rounded-full" style={{ background: sub?.color }} />
                <p className="font-display text-[16px] font-extrabold text-ink">{sub?.nombre} · {sub?.nivel}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sas.map((sa) => (
                  <button key={sa.id} onClick={() => nav("situaciones", { saId: sa.id })} className="card card-h group cursor-pointer overflow-hidden text-left">
                    <div className="px-4 py-3">
                      <p className="font-display text-[17px] font-extrabold leading-snug text-ink transition-colors group-hover:text-vir">{sa.titulo}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-ink2">{sa.reto || sa.justificacion}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="mono text-[10.5px] font-bold text-ink3">{sa.sesiones} sesiones</span>
                        <span className="mono ml-auto text-[10.5px] font-bold text-ink3">{fmtFecha(sa.inicio)} → {fmtFecha(sa.fin)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
      <Modal open={nueva} onClose={() => setNueva(false)} title="Nueva situación de aprendizaje">
        <label className="lbl">Programación</label>
        <select className="inp mb-3" value={progId} onChange={(e) => setProgId(e.target.value)}>
          <option value="">— elegir —</option>
          {progs.map((p) => { const sub = d.subjects.find((s) => s.id === p.subjectId); return <option key={p.id} value={p.id}>{sub?.nombre}</option>; })}
        </select>
        <label className="lbl">Título</label>
        <input className="inp mb-4" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNueva(false)}>Cancelar</button>
          <button className={btn} onClick={crear}><Ic n="check" s={15} /> Crear</button>
        </div>
      </Modal>
    </div>
  );
}
