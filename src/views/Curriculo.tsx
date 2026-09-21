import { useApp } from "../store";
import { CURRICULA, getCurriculum, allCriterios, descriptorById, claveById } from "../data/curriculum";
import { Ic, Reveal, SectionHead } from "../components/ui";
import { useState } from "react";

export default function Curriculo() {
  const { d } = useApp();
  const [curId, setCurId] = useState("epva-eso");
  const cur = getCurriculum(curId);
  const [openCE, setOpenCE] = useState<string>(cur.ces[0]?.id ?? "");

  return (
    <div>
      <SectionHead kicker="Base curricular LOMLOE" title="Currículo oficial" desc="Jerarquía completa: competencias clave → descriptores → competencias específicas → criterios → saberes básicos." />
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        {Object.values(CURRICULA).map((c) => (
          <button key={c.id} onClick={() => { setCurId(c.id); setOpenCE(c.ces[0]?.id ?? ""); }} className={`cursor-pointer rounded-lg border px-3.5 py-2 text-left transition-all ${curId === c.id ? "border-ink bg-ink text-paper shadow-md" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}>
            <p className="text-[13px] font-bold leading-tight">{c.materia}</p>
            <p className="mono text-[10px] uppercase tracking-widest opacity-70">{c.etapa}</p>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {cur.ces.map((ce) => {
          const open = openCE === ce.id;
          return (
            <Reveal key={ce.id}>
              <div className="card overflow-hidden">
                <button onClick={() => setOpenCE(open ? "" : ce.id)} className="flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left transition hover:bg-virl/25">
                  <span className="mono mt-0.5 rounded-md bg-ink px-2 py-1 text-[11px] font-extrabold text-paper">{ce.codigo}</span>
                  <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold leading-snug text-ink">{ce.texto}</span></span>
                  <Ic n="chevd" s={17} className={`mt-1 shrink-0 text-ink3 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="pop border-t border-line divide-y divide-line/60">
                    {ce.criterios.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 px-4 py-3">
                        <span className="mono mt-0.5 rounded px-1.5 py-0.5 text-[11px] font-extrabold bg-paper border border-line text-ink2">{c.codigo}</span>
                        <span className="min-w-0 flex-1"><span className="block text-[13px] leading-snug text-ink">{c.texto}</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
