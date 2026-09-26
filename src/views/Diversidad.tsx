import { useState } from "react";
import { useApp, uid, critScore, fmt, visibleSubjects } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, LevelChip } from "../components/ui";
import { toISO } from "../data/seed";

const TIPOS = ["NEAE", "Inclusión", "Refuerzo", "Ampliación", "Metodológica", "Recuperación"];
const COLOR_TIPO: Record<string, string> = { NEAE: "#a84a6c", Inclusión: "#2c6e8f", Refuerzo: "#c98a12", Ampliación: "#0e7c66", Metodológica: "#5b6b8f", Recuperación: "#d9532c" };

export function Diversidad() {
  const { d, set, notify, nav } = useApp();
  const [filtro, setFiltro] = useState("Todas");
  const [nueva, setNueva] = useState(false);
  const [m, setM] = useState<any>({ tipo: "NEAE" });
  const measures = d.measures.filter((x) => filtro === "Todas" || x.tipo === filtro);
  const neae = d.students.filter((s) => s.neae);

  const crear = () => {
    if (!m.titulo?.trim()) return;
    set((s) => ({ ...s, measures: [...s.measures, { id: uid(), tipo: m.tipo, titulo: m.titulo.trim(), descripcion: m.desc ?? "", studentId: m.studentId, groupId: m.groupId }] }));
    setNueva(false); setM({ tipo: "NEAE" }); notify("Medida registrada");
  };

  return (
    <div>
      <SectionHead kicker="Inclusión educativa" title="Atención a la diversidad" desc="Medidas ordinarias, inclusiones, refuerzos y ampliaciones, asociadas al alumnado y reflejadas en el cuaderno y los informes." actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva medida</button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[{ v: neae.length, l: "alumnado con NEAE" }, { v: d.measures.filter((x) => x.studentId).length, l: "medidas individuales" }, { v: d.measures.filter((x) => !x.studentId).length, l: "medidas de grupo" }].map((t) => (
          <Reveal key={t.l}><div className="card px-4 py-3.5"><p className="font-display text-[26px] font-extrabold text-ink">{t.v}</p><p className="mono text-[10px] uppercase tracking-widest text-ink3">{t.l}</p></div></Reveal>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["Todas", ...TIPOS].map((t) => (
          <button key={t} onClick={() => setFiltro(t)} className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[12px] font-bold transition ${filtro === t ? "border-transparent text-white shadow" : "border-line2 bg-card text-ink2 hover:border-ink3"}`} style={filtro === t ? { background: t === "Todas" ? "#13252c" : COLOR_TIPO[t] } : undefined}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {measures.map((mm) => (
          <Reveal key={mm.id}>
            <div className="card card-h flex h-full flex-col overflow-hidden">
              <div className="h-1.5" style={{ background: COLOR_TIPO[mm.tipo] ?? "#0e7c66" }} />
              <div className="flex-1 p-4">
                <span className="mono rounded px-2 py-0.5 text-[10px] font-extrabold uppercase text-white" style={{ background: COLOR_TIPO[mm.tipo] ?? "#0e7c66" }}>{mm.tipo}</span>
                <p className="mt-2 font-display text-[15.5px] font-extrabold text-ink">{mm.titulo}</p>
                <p className="mt-1.5 text-[12.5px] text-ink2">{mm.descripcion}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Modal open={nueva} onClose={() => setNueva(false)} title="Nueva medida">
        <label className="lbl">Tipo</label>
        <select className="inp" value={m.tipo} onChange={(e) => setM({ ...m, tipo: e.target.value })}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select>
        <label className="lbl mt-3">Título</label>
        <input className="inp" value={m.titulo ?? ""} onChange={(e) => setM({ ...m, titulo: e.target.value })} />
        <label className="lbl mt-3">Descripción</label>
        <textarea rows={3} className="inp" value={m.desc ?? ""} onChange={(e) => setM({ ...m, desc: e.target.value })} />
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNueva(false)}>Cancelar</button>
          <button className={btn} onClick={crear}><Ic n="check" s={15} /> Registrar</button>
        </div>
      </Modal>
    </div>
  );
}

export function Recuperacion() {
  const { d, set, notify } = useApp();
  const subjects = visibleSubjects(d);
  const pendientes = subjects.flatMap((sub) => {
    const cur = getCurriculum(sub.curriculumId);
    return d.students.filter((st) => st.groupId === sub.grupoId).flatMap((st) => allCriterios(cur).filter((cr) => { const r = critScore(d, st.id, cr.id); return r.score !== null && r.score < 5; }).map((cr) => ({ st, sub, cr, score: critScore(d, st.id, cr.id).score as number })));
  });

  return (
    <div>
      <SectionHead kicker="Criterios no superados" title="Recuperación y refuerzo" desc="El sistema detecta automáticamente los criterios con calificación inferior a 5." />
      <Reveal>
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[13.5px] font-bold text-ink">Criterios pendientes</p>
            <span className="mono rounded-md bg-verml px-2 py-0.5 text-[11px] font-extrabold text-verm">{pendientes.length}</span>
          </div>
          {pendientes.length === 0 && <p className="px-4 py-10 text-center text-[13px] italic text-ink3">Ningún criterio suspenso.</p>}
          <div className="divide-y divide-line/60">
            {pendientes.map(({ st, sub, cr, score }) => (
              <div key={st.id + cr.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                <div className="flex-1"><p className="text-[13px] font-bold text-ink">{st.nombre}</p><p className="mono text-[10px] text-ink3" style={{ color: sub.color }}>{sub.corto}</p></div>
                <span className="mono text-[11px] font-extrabold" style={{ color: sub.color }}>{cr.codigo}</span>
                <LevelChip score={score} sm />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
