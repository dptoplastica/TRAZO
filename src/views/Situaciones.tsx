import { useApp, visibleProgramaciones, uid, fmtFecha } from "../store";
import { getCurriculum, descriptorById, claveById } from "../data/curriculum";
import { METODOLOGIAS, type SA, type Actividad } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, SelChip } from "../components/ui";
import { fmtFechaL } from "../store";
import { useState } from "react";

export default function Situaciones() {
  const { d, params, nav, set, notify } = useApp();
  const sel = params.saId ? d.sas.find((s) => s.id === params.saId) : undefined;
  if (sel) return <EditorSA sa={sel} />;

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

/* ================= editor de SA ================= */

function EditorSA({ sa }: { sa: SA }) {
  const { d, nav, set, notify } = useApp();
  const prog = d.programaciones.find((p) => p.id === sa.programacionId);
  const sub = d.subjects.find((s) => s.id === prog?.subjectId);
  const cur = getCurriculum(sub?.curriculumId ?? "epva-eso");
  const upd = (patch: Partial<SA>) => set((s) => ({ ...s, sas: s.sas.map((x) => (x.id === sa.id ? { ...x, ...patch } : x)) }));
  const [act, setAct] = useState<Partial<Actividad>>({ fase: "Inicio", sesion: 1 });

  const toggleCrit = (id: string) => upd({ criterios: sa.criterios.includes(id) ? sa.criterios.filter((c) => c !== id) : [...sa.criterios, id] });
  const toggleMet = (m: string) => upd({ metodologias: sa.metodologias.includes(m) ? sa.metodologias.filter((x) => x !== m) : [...sa.metodologias, m] });
  const toggleInst = (i: string) => upd({ instrumentos: sa.instrumentos.includes(i) ? sa.instrumentos.filter((x) => x !== i) : [...sa.instrumentos, i] });

  const addActividad = () => {
    if (!act.titulo?.trim()) return;
    upd({ actividades: [...sa.actividades, { id: uid(), titulo: act.titulo, desc: act.desc ?? "", fase: (act.fase ?? "Inicio") as Actividad["fase"], sesion: act.sesion ?? 1, criterioIds: act.criterioIds ?? [] }] });
    setAct({ fase: "Inicio", sesion: (sa.actividades.length ? sa.actividades[sa.actividades.length - 1].sesion : 0) + 1 });
    notify("Actividad añadida");
  };

  const descriptoresAuto = [...new Set(cur.ces.filter((ce) => ce.criterios.some((c) => sa.criterios.includes(c.id))).flatMap((ce) => ce.descriptorIds))];
  const saberesAuto = [...new Set(cur.ces.flatMap((ce) => ce.criterios).filter((c) => sa.criterios.includes(c.id)).flatMap((c) => c.saberIds))];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <button onClick={() => nav("situaciones")} className="mono mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-vir hover:underline cursor-pointer">← situaciones</button>
          <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">{sa.titulo}</h1>
          <p className="mt-1 text-[13px] text-ink2"><b style={{ color: sub?.color }}>{sub?.nombre}</b> · {sa.eva}ª evaluación · {fmtFechaL(sa.inicio)} → {fmtFechaL(sa.fin)}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* ficha */}
          <div className="card p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div><label className="lbl">Título</label><input className="inp" value={sa.titulo} onChange={(e) => upd({ titulo: e.target.value })} /></div>
              <div><label className="lbl">Evaluación</label>
                <select className="inp" value={sa.eva} onChange={(e) => upd({ eva: Number(e.target.value) as 1 | 2 | 3 })}>
                  {[1, 2, 3].map((n) => <option key={n} value={n}>{n}ª evaluación</option>)}
                </select>
              </div>
              <div><label className="lbl">Inicio</label><input type="date" className="inp" value={sa.inicio} onChange={(e) => upd({ inicio: e.target.value })} /></div>
              <div><label className="lbl">Final</label><input type="date" className="inp" value={sa.fin} onChange={(e) => upd({ fin: e.target.value })} /></div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div><label className="lbl">Justificación</label><textarea rows={3} className="inp" value={sa.justificacion} onChange={(e) => upd({ justificacion: e.target.value })} /></div>
              <div><label className="lbl">Contexto o reto</label><textarea rows={3} className="inp" value={sa.reto} onChange={(e) => upd({ reto: e.target.value })} /></div>
              <div><label className="lbl">Producto final</label><textarea rows={2} className="inp" value={sa.producto} onChange={(e) => upd({ producto: e.target.value })} /></div>
              <div><label className="lbl">Sesiones previstas</label><input type="number" min={1} className="inp" value={sa.sesiones} onChange={(e) => upd({ sesiones: Number(e.target.value) || 1 })} /></div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div><label className="lbl">Agrupamientos</label><input className="inp" value={sa.agrupamientos} onChange={(e) => upd({ agrupamientos: e.target.value })} /></div>
              <div><label className="lbl">Espacios</label><input className="inp" value={sa.espacios} onChange={(e) => upd({ espacios: e.target.value })} /></div>
              <div><label className="lbl">Recursos</label><textarea rows={2} className="inp" value={sa.recursos} onChange={(e) => upd({ recursos: e.target.value })} /></div>
              <div><label className="lbl">Atención a la diversidad</label><textarea rows={2} className="inp" value={sa.diversidad} onChange={(e) => upd({ diversidad: e.target.value })} /></div>
            </div>
            <div className="mt-3">
              <label className="lbl">Evidencias de aprendizaje</label><textarea rows={2} className="inp" value={sa.evidencias} onChange={(e) => upd({ evidencias: e.target.value })} />
            </div>
          </div>

          {/* criterios */}
          <div className="card p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-[14px] font-bold text-ink">Criterios de evaluación trabajados</p>
              <span className="mono text-[11px] font-bold text-vir">{sa.criterios.length} seleccionados</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cur.ces.flatMap((ce) => ce.criterios).map((c) => (
                <SelChip key={c.id} active={sa.criterios.includes(c.id)} onClick={() => toggleCrit(c.id)} color={sub?.color}>
                  {c.codigo}
                </SelChip>
              ))}
            </div>
            {sa.criterios.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-paper border border-line p-2.5">
                  <p className="mono mb-1 text-[9.5px] font-extrabold uppercase tracking-widest text-ink3">Descriptores operativos (auto)</p>
                  <div className="flex flex-wrap gap-1">{descriptoresAuto.map((dd) => { const des = descriptorById(dd); const kl = des ? claveById(des.clave) : null; return <span key={dd} className="mono rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: kl?.soft, color: kl?.color }}>{dd}</span>; })}</div>
                </div>
                <div className="rounded-lg bg-paper border border-line p-2.5">
                  <p className="mono mb-1 text-[9.5px] font-extrabold uppercase tracking-widest text-ink3">Saberes básicos (auto)</p>
                  <div className="flex flex-wrap gap-1">{saberesAuto.map((sid) => { const sb = cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === sid); return <span key={sid} className="mono rounded border border-line bg-card px-1.5 py-0.5 text-[10px] font-bold text-ink2">{sb?.codigo}</span>; })}</div>
                </div>
              </div>
            )}
          </div>

          {/* metodologías */}
          <div className="card p-4">
            <p className="mb-2.5 text-[14px] font-bold text-ink">Metodologías activas</p>
            <div className="flex flex-wrap gap-1.5">
              {METODOLOGIAS.map((m) => <SelChip key={m} active={sa.metodologias.includes(m)} onClick={() => toggleMet(m)} color="#2c6e8f">{m}</SelChip>)}
            </div>
          </div>

          {/* actividades */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[14px] font-bold text-ink">Secuencia de actividades</p>
              <span className="mono text-[11px] font-bold text-ink3">{sa.actividades.length} actividades · {sa.actividades.reduce((a, x) => Math.max(a, x.sesion), 0)} sesiones usadas</span>
            </div>
            <div className="divide-y divide-line/60">
              {sa.actividades.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={`mono mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${a.fase === "Inicio" ? "bg-azul text-azu" : a.fase === "Desarrollo" ? "bg-virl text-vird" : "bg-ambl text-amb"}`}>{a.fase}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-ink"><span className="mono mr-1.5 text-[11px] text-ink3">S{a.sesion}</span>{a.titulo}</p>
                    <p className="text-[12.5px] leading-snug text-ink2">{a.desc}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {a.criterioIds.map((cId) => { const c = cur.ces.flatMap((ce) => ce.criterios).find((x) => x.id === cId); return <span key={cId} className="mono rounded bg-paper border border-line px-1.5 py-0.5 text-[9.5px] font-bold text-ink2">{c?.codigo}</span>; })}
                    </div>
                  </div>
                  <button onClick={() => upd({ actividades: sa.actividades.filter((x) => x.id !== a.id) })} className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-verml hover:text-verm" title="Eliminar actividad"><Ic n="trash" s={15} /></button>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dashed border-line bg-paper/60 p-4">
              <p className="lbl">Añadir actividad</p>
              <div className="grid gap-2 sm:grid-cols-[1fr_120px_110px]">
                <input className="inp" placeholder="Título de la actividad" value={act.titulo ?? ""} onChange={(e) => setAct({ ...act, titulo: e.target.value })} />
                <select className="inp" value={act.fase} onChange={(e) => setAct({ ...act, fase: e.target.value as Actividad["fase"] })}>
                  {["Inicio", "Desarrollo", "Cierre"].map((f) => <option key={f}>{f}</option>)}
                </select>
                <input type="number" min={1} className="inp" placeholder="Sesión" value={act.sesion ?? 1} onChange={(e) => setAct({ ...act, sesion: Number(e.target.value) })} />
              </div>
              <textarea rows={2} className="inp mt-2" placeholder="Descripción breve…" value={act.desc ?? ""} onChange={(e) => setAct({ ...act, desc: e.target.value })} />
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Criterios:</span>
                {sa.criterios.map((cId) => {
                  const c = cur.ces.flatMap((ce) => ce.criterios).find((x) => x.id === cId);
                  const on = (act.criterioIds ?? []).includes(cId);
                  return <SelChip key={cId} active={on} onClick={() => setAct({ ...act, criterioIds: on ? (act.criterioIds ?? []).filter((x) => x !== cId) : [...(act.criterioIds ?? []), cId] })} color={sub?.color}>{c?.codigo}</SelChip>;
                })}
                {sa.criterios.length === 0 && <span className="text-[11.5px] italic text-ink3">selecciona antes criterios de la SA</span>}
                <button className={btn + " !py-1.5 ml-auto"} onClick={addActividad}><Ic n="plus" s={14} /> Añadir</button>
              </div>
            </div>
          </div>
        </div>

        {/* lateral */}
        <aside className="space-y-4">
          <div className="card p-4 xl:sticky xl:top-20">
            <p className="lbl">Instrumentos de evaluación</p>
            <div className="space-y-1.5">
              {d.instruments.filter((i) => i.subjectId === sub?.id).map((i) => {
                const on = sa.instrumentos.includes(i.id);
                return (
                  <button key={i.id} onClick={() => toggleInst(i.id)} className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${on ? "border-vir bg-virl/50" : "border-line bg-card hover:border-line2"}`}>
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-vir bg-vir text-white" : "border-line2"}`}>{on && <Ic n="check" s={11} />}</span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-ink">{i.nombre}</span>
                    <span className="mono text-[10px] font-bold text-ink3">{i.tipo}</span>
                  </button>
                );
              })}
              {d.instruments.filter((i) => i.subjectId === sub?.id).length === 0 && <p className="text-[12px] italic text-ink3">Crea instrumentos en el módulo de Evaluación.</p>}
            </div>
          </div>
          <div className="card p-4">
            <p className="lbl">Resumen curricular</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { v: sa.criterios.length, l: "criterios" },
                { v: descriptoresAuto.length, l: "descriptores" },
                { v: saberesAuto.length, l: "saberes" },
              ].map((t) => (
                <div key={t.l} className="rounded-lg bg-paper px-2 py-2.5">
                  <p className="font-display text-[22px] font-extrabold text-ink">{t.v}</p>
                  <p className="mono text-[9px] uppercase tracking-widest text-ink3">{t.l}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
