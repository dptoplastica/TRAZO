import { useApp, visibleProgramaciones, uid, fmtFecha, fmtFechaL } from "../store";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost } from "../components/ui";
import { useState } from "react";

export default function Unidades() {
  const { d, nav, set, notify } = useApp();
  const progs = visibleProgramaciones(d);
  const units = d.units.filter((u) => progs.some((p) => p.id === u.programacionId));
  const [nueva, setNueva] = useState(false);

  return (
    <div>
      <SectionHead kicker="Organización del curso" title="Unidades didácticas" desc="Agrupación temporal del curso: cada unidad encadena situaciones de aprendizaje." actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva unidad</button>} />
      <Reveal>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead><tr className="border-b-2 border-ink/70 text-[10.5px] uppercase tracking-widest text-ink3"><th className="px-4 py-3 font-bold">Unidad</th><th className="px-4 py-3 font-bold">Materia</th><th className="px-4 py-3 font-bold">Temporalización</th><th className="px-4 py-3 font-bold text-center">Sesiones</th></tr></thead>
              <tbody className="divide-y divide-line/70">
                {units.map((un) => {
                  const prog = d.programaciones.find((p) => p.id === un.programacionId);
                  const sub = d.subjects.find((s) => s.id === prog?.subjectId);
                  return (
                    <tr key={un.id} className="group transition hover:bg-virl/25">
                      <td className="px-4 py-3"><p className="font-display text-[15px] font-extrabold text-ink">{un.titulo}</p></td>
                      <td className="px-4 py-3"><span className="text-[12.5px] font-bold" style={{ color: sub?.color }}>{sub?.corto}</span></td>
                      <td className="mono px-4 py-3 text-[12px] font-semibold text-ink2">{fmtFecha(un.inicio)} → {fmtFecha(un.fin)}</td>
                      <td className="px-4 py-3 text-center"><span className="mono rounded-md bg-paper border border-line px-2 py-1 text-[12px] font-extrabold">{un.sesiones}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {units.length === 0 && <EmptyState icon="layers" title="Sin unidades" desc="Crea la primera unidad." />}
        </div>
      </Reveal>
    </div>
  );
}
