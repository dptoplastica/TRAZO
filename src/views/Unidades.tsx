import { useState } from "react";
import { useApp, visibleProgramaciones, uid, fmtFecha, fmtFechaL } from "../store";
import { getCurriculum } from "../data/curriculum";
import type { Unit } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, SelChip } from "../components/ui";

export default function Unidades() {
  const { d, nav, set, notify } = useApp();
  const progs = visibleProgramaciones(d);
  const units = d.units.filter((u) => progs.some((p) => p.id === u.programacionId));
  const [nueva, setNueva] = useState(false);
  const [u, setU] = useState<Partial<Unit>>({ sesiones: 6 });

  const crear = () => {
    if (!u.titulo?.trim() || !u.programacionId) return;
    const prog = d.programaciones.find((p) => p.id === u.programacionId);
    const criterios = u.criterios?.length ? u.criterios : d.sas.filter((s) => (u.saIds ?? []).includes(s.id)).flatMap((s) => s.criterios);
    const nu: Unit = {
      id: uid(), programacionId: u.programacionId, titulo: u.titulo.trim(),
      inicio: u.inicio ?? new Date().toISOString().slice(0, 10),
      fin: u.fin ?? new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
      sesiones: u.sesiones ?? 6, saIds: u.saIds ?? [], criterios: [...new Set(criterios)],
    };
    set((s) => ({ ...s, units: [...s.units, nu] }));
    setNueva(false); setU({ sesiones: 6 });
    notify("Unidad didáctica creada");
    void prog;
  };

  return (
    <div>
      <SectionHead
        kicker="Organización del curso"
        title="Unidades didácticas"
        desc="Agrupación temporal del curso: cada unidad encadena situaciones de aprendizaje y acota los criterios de evaluación que se trabajan."
        actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva unidad</button>}
      />

      <Reveal>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b-2 border-ink/70 text-[10.5px] uppercase tracking-widest text-ink3">
                  <th className="px-4 py-3 font-bold">Unidad</th>
                  <th className="px-4 py-3 font-bold">Materia</th>
                  <th className="px-4 py-3 font-bold">Temporalización</th>
                  <th className="px-4 py-3 font-bold text-center">Sesiones</th>
                  <th className="px-4 py-3 font-bold">Situaciones</th>
                  <th className="px-4 py-3 font-bold">Criterios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {units.map((un) => {
                  const prog = d.programaciones.find((p) => p.id === un.programacionId);
                  const sub = d.subjects.find((s) => s.id === prog?.subjectId);
                  const cur = getCurriculum(sub?.curriculumId ?? "epva-eso");
                  return (
                    <tr key={un.id} className="group transition hover:bg-virl/25">
                      <td className="px-4 py-3">
                        <p className="font-display text-[15px] font-extrabold text-ink">{un.titulo}</p>
                        <p className="mono text-[10.5px] text-ink3">{fmtFechaL(un.inicio)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold" style={{ color: sub?.color }}>
                          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: sub?.color }} />{sub?.corto}
                        </span>
                      </td>
                      <td className="mono px-4 py-3 text-[12px] font-semibold text-ink2">{fmtFecha(un.inicio)} → {fmtFecha(un.fin)}</td>
                      <td className="px-4 py-3 text-center"><span className="mono rounded-md bg-paper border border-line px-2 py-1 text-[12px] font-extrabold text-ink">{un.sesiones}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {un.saIds.map((saId) => {
                            const sa = d.sas.find((s) => s.id === saId);
                            return (
                              <button key={saId} onClick={() => nav("situaciones", { saId })} className="cursor-pointer rounded-md bg-virl px-2 py-1 text-[11px] font-bold text-vird transition hover:bg-vir hover:text-white" title={sa?.titulo}>
                                {sa?.titulo.length && sa.titulo.length > 22 ? sa.titulo.slice(0, 22) + "…" : sa?.titulo}
                              </button>
                            );
                          })}
                          {un.saIds.length === 0 && <span className="text-[11.5px] italic text-ink3">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {un.criterios.slice(0, 5).map((cId) => {
                            const c = cur.ces.flatMap((ce) => ce.criterios).find((x) => x.id === cId);
                            return <span key={cId} className="mono rounded border border-line bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink2">{c?.codigo}</span>;
                          })}
                          {un.criterios.length > 5 && <span className="mono text-[10px] font-bold text-ink3">+{un.criterios.length - 5}</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {units.length === 0 && <div className="p-6"><EmptyState icon="layers" title="Sin unidades didácticas" desc="Crea la primera unidad para organizar el curso." /></div>}
        </div>
      </Reveal>

      <Modal open={nueva} onClose={() => setNueva(false)} title="Nueva unidad didáctica" wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="lbl">Título</label><input className="inp" value={u.titulo ?? ""} onChange={(e) => setU({ ...u, titulo: e.target.value })} placeholder="p. ej. Percepción y comunicación visual" /></div>
          <div>
            <label className="lbl">Programación</label>
            <select className="inp" value={u.programacionId ?? ""} onChange={(e) => setU({ ...u, programacionId: e.target.value, saIds: [], criterios: [] })}>
              <option value="">— elegir —</option>
              {progs.map((p) => { const s = d.subjects.find((x) => x.id === p.subjectId); return <option key={p.id} value={p.id}>{s?.nombre} · {s?.nivel}</option>; })}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="lbl">Inicio</label><input type="date" className="inp" value={u.inicio ?? ""} onChange={(e) => setU({ ...u, inicio: e.target.value })} /></div>
            <div><label className="lbl">Final</label><input type="date" className="inp" value={u.fin ?? ""} onChange={(e) => setU({ ...u, fin: e.target.value })} /></div>
            <div><label className="lbl">Sesiones</label><input type="number" min={1} className="inp" value={u.sesiones ?? 6} onChange={(e) => setU({ ...u, sesiones: Number(e.target.value) })} /></div>
          </div>
        </div>
        {u.programacionId && (
          <>
            <label className="lbl mt-4">Situaciones de aprendizaje incluidas</label>
            <div className="flex flex-wrap gap-1.5">
              {d.sas.filter((s) => s.programacionId === u.programacionId).map((s) => (
                <SelChip key={s.id} active={(u.saIds ?? []).includes(s.id)} onClick={() => setU({ ...u, saIds: (u.saIds ?? []).includes(s.id) ? (u.saIds ?? []).filter((x) => x !== s.id) : [...(u.saIds ?? []), s.id] })}>{s.titulo}</SelChip>
              ))}
            </div>
          </>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNueva(false)}>Cancelar</button>
          <button className={btn} onClick={crear}><Ic n="check" s={15} /> Crear unidad</button>
        </div>
      </Modal>
    </div>
  );
}
