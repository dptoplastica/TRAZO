import { useMemo, useState } from "react";
import { useApp, visibleProgramaciones, visibleSubjects, uid, fmtFecha } from "../store";
import { getCurriculum, allCriterios, descriptorById, claveById, clavesDeCE } from "../data/curriculum";
import type { Programacion as Prog } from "../data/seed";
import { Ic, Reveal, SectionHead, EstadoBadge, Modal, EmptyState, btn, btnGhost } from "../components/ui";
import { fmtFechaL } from "../store";

export default function Programaciones() {
  const { d, params, nav, set, notify, isAdmin } = useApp();
  const sel = params.programacionId ? d.programaciones.find((p) => p.id === params.programacionId) : undefined;
  if (sel) return <Editor prog={sel} />;

  const progs = visibleProgramaciones(d);
  const [nuevo, setNuevo] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const sinProg = d.subjects.filter((s) => !d.programaciones.some((p) => p.subjectId === s.id));

  const crear = () => {
    const sub = d.subjects.find((s) => s.id === subjectId);
    if (!sub) return;
    const cur = getCurriculum(sub.curriculumId);
    const p: Prog = {
      id: uid(), subjectId: sub.id, curso: d.cursoLabel, estado: "Borrador",
      contexto: { centro: d.programaciones[0]?.contexto.centro ?? "", entorno: d.programaciones[0]?.contexto.entorno ?? "", alumnado: "", recursos: "", diversidad: "" },
      criterios: allCriterios(cur).map((c) => c.id),
      ponderaciones: Object.fromEntries(allCriterios(cur).map((c) => [c.id, Math.round(1000 / allCriterios(cur).length) / 10])),
      ccalificacion: "Pendiente de definir por el departamento.", actualizada: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({ ...s, programaciones: [...s.programaciones, p] }));
    setNuevo(false);
    notify("Programación creada en borrador");
    nav("programaciones", { programacionId: p.id });
  };

  const duplicar = (p: Prog) => {
    const copia: Prog = { ...p, id: uid(), estado: "Borrador", actualizada: new Date().toISOString().slice(0, 10), contexto: { ...p.contexto }, ponderaciones: { ...p.ponderaciones }, criterios: [...p.criterios] };
    set((s) => ({ ...s, programaciones: [...s.programaciones, copia] }));
    notify("Programación duplicada como borrador");
  };

  return (
    <div>
      <SectionHead
        kicker="Planificación docente"
        title="Programaciones didácticas"
        desc="Documento vertebrador del curso: contextualización, elementos curriculares LOMLOE y criterios de calificación, listos para reutilizar."
        actions={isAdmin && <button className={btn} onClick={() => setNuevo(true)}><Ic n="plus" s={15} /> Nueva programación</button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {progs.map((p, i) => {
          const sub = d.subjects.find((s) => s.id === p.subjectId);
          const sas = d.sas.filter((s) => s.programacionId === p.id);
          return (
            <Reveal key={p.id} delay={i * 70}>
              <div className="card card-h group flex h-full flex-col overflow-hidden">
                <div className="h-1.5" style={{ background: sub?.color }} />
                <div className="flex-1 px-4 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="mono text-[10.5px] font-bold uppercase tracking-widest" style={{ color: sub?.color }}>{sub?.corto} · {sub?.nivel}</p>
                    <EstadoBadge estado={p.estado} />
                  </div>
                  <button onClick={() => nav("programaciones", { programacionId: p.id })} className="mt-1.5 block cursor-pointer text-left font-display text-[18px] font-extrabold leading-snug text-ink transition-colors group-hover:text-vir">
                    Programación de {sub?.nombre}
                  </button>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[
                      { v: p.criterios.length, l: "criterios" },
                      { v: sas.length, l: "situaciones" },
                      { v: sas.reduce((a, s) => a + s.sesiones, 0), l: "sesiones" },
                    ].map((t) => (
                      <div key={t.l} className="rounded-lg bg-paper px-2 py-2">
                        <p className="font-display text-[19px] font-extrabold text-ink">{t.v}</p>
                        <p className="mono text-[9.5px] uppercase tracking-widest text-ink3">{t.l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mono mt-3 text-[10.5px] text-ink3">Actualizada el {fmtFechaL(p.actualizada)}</p>
                </div>
                <div className="flex items-center gap-1.5 border-t border-line px-3 py-2.5">
                  <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => nav("programaciones", { programacionId: p.id })}><Ic n="edit" s={13} /> Editar</button>
                  <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => duplicar(p)} title="Duplicar programación"><Ic n="copy" s={13} /> Duplicar</button>
                  <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => nav("situaciones")}><Ic n="spark" s={13} /> SA</button>
                </div>
              </div>
            </Reveal>
          );
        })}
        {progs.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState icon="book" title="Sin programaciones visibles" desc="Cambia de perfil o crea una programación nueva para una materia." />
          </div>
        )}
      </div>

      <Modal open={nuevo} onClose={() => setNuevo(false)} title="Nueva programación didáctica">
        <p className="mb-3 text-[13px] text-ink2">Selecciona la materia: la aplicación cargará automáticamente su currículo LOMLOE (competencias, criterios y saberes).</p>
        <label className="lbl">Materia</label>
        <select className="inp mb-4" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">— elegir materia —</option>
          {sinProg.map((s) => <option key={s.id} value={s.id}>{s.nombre} · {s.nivel}</option>)}
        </select>
        {subjectId && (
          <p className="mb-4 rounded-lg bg-virl px-3 py-2 text-[12px] font-semibold text-vird">
            Se cargarán {allCriterios(getCurriculum(d.subjects.find((s) => s.id === subjectId)!.curriculumId)).length} criterios de evaluación y sus saberes básicos.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNuevo(false)}>Cancelar</button>
          <button className={btn} disabled={!subjectId} onClick={crear}><Ic n="check" s={15} /> Crear borrador</button>
        </div>
      </Modal>
    </div>
  );
}

/* ================= editor ================= */

function Editor({ prog }: { prog: Prog }) {
  const { d, nav, set, notify } = useApp();
  const [tab, setTab] = useState<"contexto" | "curricular" | "calificacion">("curricular");
  const sub = d.subjects.find((s) => s.id === prog.subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const criterioEnProg = (id: string) => prog.criterios.includes(id);

  const toggleCriterio = (critId: string, ceId: string) => {
    set((s) => ({
      ...s,
      programaciones: s.programaciones.map((p) => {
        if (p.id !== prog.id) return p;
        const on = !p.criterios.includes(critId);
        const criterios = on ? [...p.criterios, critId] : p.criterios.filter((c) => c !== critId);
        return { ...p, criterios };
      }),
    }));
    void ceId;
  };

  const setPonderacion = (critId: string, v: number) =>
    set((s) => ({ ...s, programaciones: s.programaciones.map((p) => (p.id === prog.id ? { ...p, ponderaciones: { ...p.ponderaciones, [critId]: v }, actualizada: new Date().toISOString().slice(0, 10) } : p)) }));

  const setContexto = (k: keyof Prog["contexto"], v: string) =>
    set((s) => ({ ...s, programaciones: s.programaciones.map((p) => (p.id === prog.id ? { ...p, contexto: { ...p.contexto, [k]: v } } : p)) }));

  const setEstado = (v: Prog["estado"]) => {
    set((s) => ({ ...s, programaciones: s.programaciones.map((p) => (p.id === prog.id ? { ...p, estado: v } : p)) }));
    notify(`Estado actualizado: ${v}`);
  };

  const suma = Object.values(prog.ponderaciones).reduce((a, b) => a + (b || 0), 0);
  const seleccionados = cur.ces.filter((ce) => ce.criterios.some((c) => criterioEnProg(c.id)));
  const saberesSel = useMemo(() => {
    const ids = new Set<string>();
    for (const ce of seleccionados) for (const c of ce.criterios) if (criterioEnProg(c.id)) c.saberIds.forEach((x) => ids.add(x));
    return cur.bloques.map((b) => ({ ...b, saberes: b.saberes.filter((s) => ids.has(s.id)) })).filter((b) => b.saberes.length);
  }, [prog.criterios]);

  const [printing, setPrinting] = useState(false);
  const exportar = () => { setPrinting(true); setTimeout(() => window.print(), 150); };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => nav("programaciones")} className="mono mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-vir hover:underline cursor-pointer">← programaciones</button>
          <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">
            Programación · <span style={{ color: sub.color }}>{sub.nombre}</span> <span className="text-ink3">· {sub.nivel}</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="inp !w-auto !py-1.5 text-[12.5px]" value={prog.estado} onChange={(e) => setEstado(e.target.value as Prog["estado"])}>
            {["Borrador", "En revisión", "Finalizada"].map((e) => <option key={e}>{e}</option>)}
          </select>
          <button className={btnGhost} onClick={exportar}><Ic n="print" s={15} /> Exportar PDF</button>
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-line bg-panel p-1">
        {([["contexto", "Contextualización", "home"], ["curricular", "Elementos curriculares", "compass"], ["calificacion", "Criterios de calificación", "clipboard"]] as const).map(([id, l, ic]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold transition-all ${tab === id ? "bg-ink text-paper shadow" : "text-ink2 hover:bg-line/50"}`}>
            <Ic n={ic} s={15} /> {l}
          </button>
        ))}
      </div>

      {tab === "contexto" && (
        <div className="pop grid gap-4 lg:grid-cols-2">
          {([["centro", "Características del centro", "Reutilizable en todas las programaciones del departamento"],
            ["entorno", "Entorno social y cultural", "Contexto socioeconómico y recursos del entorno"],
            ["alumnado", "Características del alumnado", "Grupos, diversidad y punto de partida"],
            ["recursos", "Recursos, espacios y equipamiento", "Aulas-taller, medios digitales, materiales"],
            ["diversidad", "Atención a la diversidad", "Medidas ordinarias e inclusiones del grupo"]] as const).map(([k, l, hint]) => (
            <div key={k} className={`card p-4 ${k === "centro" ? "lg:col-span-2" : ""}`}>
              <label className="lbl flex items-center justify-between">{l} <span className="mono normal-case tracking-normal text-[9.5px] text-ink3">{hint}</span></label>
              <textarea className="inp" rows={k === "centro" ? 5 : 4} value={prog.contexto[k]} onChange={(e) => setContexto(k, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {tab === "curricular" && (
        <div className="pop">
          <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {cur.ces.map((ce) => {
                const activas = ce.criterios.filter((c) => criterioEnProg(c.id)).length;
                return (
                  <div key={ce.id} className="card overflow-hidden">
                    <div className="flex items-start gap-3 border-b border-line px-4 py-3">
                      <span className="mono mt-0.5 rounded-md bg-ink px-2 py-1 text-[11px] font-extrabold text-paper">{ce.codigo}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold leading-snug text-ink">{ce.texto}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ce.descriptorIds.map((did) => {
                            const des = descriptorById(did);
                            const kl = des ? claveById(des.clave) : null;
                            return (
                              <span key={did} className="mono rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: kl?.soft, color: kl?.color }} title={kl?.nombre}>
                                {did}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <span className={`mono shrink-0 text-[11px] font-bold ${activas ? "text-vir" : "text-ink3"}`}>{activas}/{ce.criterios.length}</span>
                    </div>
                    <div className="divide-y divide-line/60">
                      {ce.criterios.map((c) => {
                        const on = criterioEnProg(c.id);
                        return (
                          <label key={c.id} className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 transition hover:bg-virl/30 ${on ? "bg-virl/25" : ""}`}>
                            <input type="checkbox" checked={on} onChange={() => toggleCriterio(c.id, ce.id)} className="mt-1 h-4 w-4 accent-[#0e7c66]" />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13px] leading-snug text-ink"><b className="mono mr-1.5 text-[11.5px]" style={{ color: sub.color }}>{c.codigo}</b>{c.texto}</span>
                              <span className="mt-1 flex flex-wrap gap-1">
                                {c.saberIds.map((sid) => {
                                  const sb = cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === sid);
                                  return <span key={sid} className="mono rounded bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink2 border border-line">{sb?.codigo}</span>;
                                })}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="card h-fit p-4 xl:sticky xl:top-20">
              <p className="lbl">Trazabilidad curricular</p>
              <p className="mb-3 text-[12.5px] leading-relaxed text-ink2">Al seleccionar un criterio se vinculan automáticamente su competencia específica y sus saberes básicos.</p>
              <div className="space-y-2.5">
                <div className="rounded-lg border border-line bg-paper p-2.5">
                  <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Competencias específicas</p>
                  <p className="mt-1 font-display text-[22px] font-extrabold text-vir">{seleccionados.length}<span className="text-[13px] text-ink3"> / {cur.ces.length}</span></p>
                </div>
                <div className="rounded-lg border border-line bg-paper p-2.5">
                  <p className="mono text-[10px] font-bold uppercase tracking-widest text-ink3">Criterios seleccionados</p>
                  <p className="mt-1 font-display text-[22px] font-extrabold text-azu">{prog.criterios.length}</p>
                </div>
                <div>
                  <p className="mono mb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink3">Saberes básicos implicados</p>
                  <div className="flex flex-wrap gap-1">
                    {saberesSel.flatMap((b) => b.saberes).map((s) => (
                      <span key={s.id} title={s.texto} className="mono cursor-help rounded-md bg-virl px-2 py-1 text-[10.5px] font-bold text-vird">{s.codigo}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mono mb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink3">Competencias clave</p>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(seleccionados.flatMap((ce) => clavesDeCE(ce)))].map((k) => {
                      const kl = claveById(k);
                      return <span key={k} className="mono rounded-md px-2 py-1 text-[10.5px] font-bold" style={{ background: kl.soft, color: kl.color }}>{k}</span>;
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {tab === "calificacion" && (
        <div className="pop grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-bold text-ink">Ponderación de criterios de evaluación</p>
              <span className={`mono rounded-lg px-2.5 py-1 text-[12px] font-extrabold ${Math.abs(suma - 100) < 0.01 ? "bg-virl text-vird" : "bg-ambl text-amb"}`}>Σ {Math.round(suma * 10) / 10}%</span>
            </div>
            <div className="divide-y divide-line/60">
              {allCriterios(cur).map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-2">
                  <span className="mono w-10 shrink-0 text-[12px] font-extrabold" style={{ color: sub.color }}>{c.codigo}</span>
                  <p className="min-w-0 flex-1 truncate text-[12.5px] text-ink2" title={c.texto}>{c.texto}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <input type="number" min={0} max={100} step={0.5} className="inp !w-20 !px-2 !py-1 text-right mono text-[12.5px]" value={prog.ponderaciones[c.id] ?? 0} onChange={(e) => setPonderacion(c.id, parseFloat(e.target.value) || 0)} />
                    <span className="text-[12px] font-bold text-ink3">%</span>
                  </div>
                </div>
              ))}
            </div>
            {Math.abs(suma - 100) >= 0.01 && (
              <p className="mt-3 flex items-center gap-2 rounded-lg bg-ambl px-3 py-2 text-[12px] font-semibold text-amb"><Ic n="alert" s={14} /> La ponderación debe sumar 100 %. Actualmente: {Math.round(suma * 10) / 10} %.</p>
            )}
          </div>
          <div className="space-y-4">
            <div className="card p-4">
              <label className="lbl">Criterios de calificación y condiciones</label>
              <textarea rows={7} className="inp" value={prog.ccalificacion} onChange={(e) => set((s) => ({ ...s, programaciones: s.programaciones.map((p) => (p.id === prog.id ? { ...p, ccalificacion: e.target.value } : p)) }))} />
            </div>
            <div className="card p-4">
              <p className="lbl">Instrumentos vinculados</p>
              <div className="space-y-1.5">
                {d.instruments.filter((i) => i.subjectId === sub.id).map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded-lg bg-paper px-2.5 py-1.5">
                    <span className="truncate text-[12px] font-semibold text-ink">{i.nombre}</span>
                    <span className="mono text-[11px] font-bold text-ink3">×{i.peso}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] text-ink3">El peso de cada instrumento pondera las calificaciones dentro de cada criterio.</p>
            </div>
          </div>
        </div>
      )}

      {printing && (
        <div className="print-area">
          <div style={{ fontFamily: "Instrument Sans, sans-serif", color: "#13252c", padding: 8 }}>
            <h1 style={{ fontFamily: "Bricolage Grotesque", fontSize: 26, marginBottom: 4 }}>Programación didáctica · {sub.nombre} · {sub.nivel}</h1>
            <p style={{ fontSize: 13, color: "#47606b", marginBottom: 18 }}>Curso {prog.curso} · IES Lope de Vega · Santa María de Cayón · Departamento de Dibujo · Estado: {prog.estado}</p>
            <h2 style={{ fontSize: 17, borderBottom: "2px solid #0e7c66", paddingBottom: 4 }}>1 · Contextualización</h2>
            {Object.entries(prog.contexto).map(([k, v]) => <p key={k} style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 8 }}><b className="capitalize">{k}:</b> {v}</p>)}
            <h2 style={{ fontSize: 17, borderBottom: "2px solid #0e7c66", paddingBottom: 4, marginTop: 16 }}>2 · Elementos curriculares</h2>
            {cur.ces.filter((ce) => ce.criterios.some((c) => prog.criterios.includes(c.id))).map((ce) => (
              <div key={ce.id} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{ce.codigo} — {ce.texto}</p>
                {ce.criterios.filter((c) => prog.criterios.includes(c.id)).map((c) => (
                  <p key={c.id} style={{ fontSize: 12.5, marginLeft: 16, lineHeight: 1.55 }}><b>{c.codigo}.</b> {c.texto} <i style={{ color: "#47606b" }}>[{c.saberIds.map((s) => cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === s)?.codigo).join(", ")}]</i></p>
                ))}
              </div>
            ))}
            <h2 style={{ fontSize: 17, borderBottom: "2px solid #0e7c66", paddingBottom: 4, marginTop: 16 }}>3 · Criterios de calificación</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <tbody>
                {allCriterios(cur).map((c) => (
                  <tr key={c.id}><td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", fontWeight: 700 }}>{c.codigo}</td><td style={{ border: "1px solid #d9e0d5", padding: "4px 8px" }}>{c.texto}</td><td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", textAlign: "right", fontWeight: 700 }}>{prog.ponderaciones[c.id] ?? 0} %</td></tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12.5, marginTop: 10, lineHeight: 1.6 }}>{prog.ccalificacion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* re-exports para compatibilidad del import superior */
export { fmtFecha };
