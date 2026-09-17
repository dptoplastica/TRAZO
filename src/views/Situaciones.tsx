import { useState } from "react";
import { useApp, visibleProgramaciones, uid, fmtFecha } from "../store";
import { getCurriculum, descriptorById, claveById } from "../data/curriculum";
import { METODOLOGIAS, type SA, type Actividad } from "../data/seed";
import { Ic, Reveal, SectionHead, SelChip, Modal, EmptyState, btn, btnGhost } from "../components/ui";
import { fmtFechaL } from "../store";

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
    const sa: SA = {
      id: uid(), programacionId: progId, titulo: titulo.trim(), eva: 1,
      inicio: new Date().toISOString().slice(0, 10), fin: new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10),
      sesiones: 6, justificacion: "", reto: "", producto: "", metodologias: ["Aprendizaje basado en proyectos"],
      agrupamientos: "Gran grupo y equipos", espacios: "Aula-taller", recursos: "", diversidad: "", evidencias: "",
      criterios: [], objetivos: [], actividades: [], instrumentos: [],
    };
    set((s) => ({ ...s, sas: [...s.sas, sa] }));
    setNueva(false); setTitulo("");
    notify("Situación de aprendizaje creada");
    nav("situaciones", { saId: sa.id });
  };

  return (
    <div>
      <SectionHead
        kicker="Diseño de enseñanza"
        title="Situaciones de aprendizaje"
        desc="Retos contextualizados con producto final, metodologías activas y todos los elementos curriculares vinculados: de la idea al cuaderno del profesor."
        actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva situación</button>}
      />

      {progs.map((p, pi) => {
        const sub = d.subjects.find((s) => s.id === p.subjectId);
        const sas = d.sas.filter((s) => s.programacionId === p.id);
        return (
          <Reveal key={p.id} delay={pi * 60}>
            <div className="mb-6">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="h-4 w-1.5 rounded-full" style={{ background: sub?.color }} />
                <p className="font-display text-[16px] font-extrabold text-ink">{sub?.nombre} · {sub?.nivel}</p>
                <span className="mono text-[11px] font-bold text-ink3">{sas.length} SA</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sas.map((sa) => (
                  <button key={sa.id} onClick={() => nav("situaciones", { saId: sa.id })} className="card card-h group cursor-pointer overflow-hidden text-left">
                    <div className="flex items-center justify-between border-b border-line px-4 py-2">
                      <span className="mono rounded bg-paper px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ color: sub?.color, border: `1px solid ${sub?.color}40` }}>{sa.eva}ª evaluación</span>
                      <span className="mono text-[11px] font-bold text-ink3">{sa.sesiones} sesiones</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-display text-[17px] font-extrabold leading-snug text-ink transition-colors group-hover:text-vir">{sa.titulo}</p>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink2">{sa.reto || sa.justificacion}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        {sa.criterios.slice(0, 4).map((cId) => {
                          const cur = getCurriculum(sub?.curriculumId ?? "epva-eso");
                          const c = cur.ces.flatMap((ce) => ce.criterios).find((x) => x.id === cId);
                          return <span key={cId} className="mono rounded bg-paper border border-line px-1.5 py-0.5 text-[10px] font-bold text-ink2">{c?.codigo}</span>;
                        })}
                        {sa.criterios.length > 4 && <span className="mono text-[10px] font-bold text-ink3">+{sa.criterios.length - 4}</span>}
                        <span className="ml-auto mono text-[10.5px] font-bold text-ink3">{fmtFecha(sa.inicio)} → {fmtFecha(sa.fin)}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {sas.length === 0 && <div className="card px-5 py-6 text-[13px] italic text-ink3">Sin situaciones de aprendizaje todavía.</div>}
              </div>
            </div>
          </Reveal>
        );
      })}
      {progs.length === 0 && <EmptyState icon="spark" title="Sin programaciones" desc="Crea primero una programación para diseñar sus situaciones de aprendizaje." />}

      <Modal open={nueva} onClose={() => setNueva(false)} title="Nueva situación de aprendizaje">
        <label className="lbl">Programación de destino</label>
        <select className="inp mb-3" value={progId} onChange={(e) => setProgId(e.target.value)}>
          <option value="">— elegir programación —</option>
          {progs.map((p) => {
            const sub = d.subjects.find((s) => s.id === p.subjectId);
            return <option key={p.id} value={p.id}>{sub?.nombre} · {sub?.nivel}</option>;
          })}
        </select>
        <label className="lbl">Título</label>
        <input className="inp mb-4" placeholder="p. ej. Carteles que hablan" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNueva(false)}>Cancelar</button>
          <button className={btn} onClick={crear}><Ic n="check" s={15} /> Crear</button>
        </div>
      </Modal>
    </div>
  );
}

/* ================= editor de SA ================= */

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="lbl">{label}</label>{children}</div>
);

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

  const duplicar = () => {
    const copia: SA = { ...sa, id: uid(), titulo: sa.titulo + " (copia)", actividades: sa.actividades.map((a) => ({ ...a, id: uid() })) };
    set((s) => ({ ...s, sas: [...s.sas, copia] }));
    notify("Situación copiada");
    nav("situaciones", { saId: copia.id });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <button onClick={() => nav("situaciones")} className="mono mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-vir hover:underline cursor-pointer">← situaciones</button>
          <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">{sa.titulo}</h1>
          <p className="mt-1 text-[13px] text-ink2"><b style={{ color: sub?.color }}>{sub?.nombre}</b> · {sa.eva}ª evaluación · {fmtFechaL(sa.inicio)} → {fmtFechaL(sa.fin)}</p>
        </div>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={duplicar}><Ic n="copy" s={15} /> Copiar SA</button>
          <button className={btnGhost} onClick={() => nav("temporalizacion")}><Ic n="calendar" s={15} /> Ver en el calendario</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* ficha */}
          <div className="card p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <F label="Título"><input className="inp" value={sa.titulo} onChange={(e) => upd({ titulo: e.target.value })} /></F>
              <F label="Evaluación">
                <select className="inp" value={sa.eva} onChange={(e) => upd({ eva: Number(e.target.value) as 1 | 2 | 3 })}>
                  {[1, 2, 3].map((n) => <option key={n} value={n}>{n}ª evaluación</option>)}
                </select>
              </F>
              <F label="Inicio"><input type="date" className="inp" value={sa.inicio} onChange={(e) => upd({ inicio: e.target.value })} /></F>
              <F label="Final"><input type="date" className="inp" value={sa.fin} onChange={(e) => upd({ fin: e.target.value })} /></F>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <F label="Justificación"><textarea rows={3} className="inp" value={sa.justificacion} onChange={(e) => upd({ justificacion: e.target.value })} /></F>
              <F label="Contexto o reto"><textarea rows={3} className="inp" value={sa.reto} onChange={(e) => upd({ reto: e.target.value })} /></F>
              <F label="Producto final"><textarea rows={2} className="inp" value={sa.producto} onChange={(e) => upd({ producto: e.target.value })} /></F>
              <F label="Sesiones previstas"><input type="number" min={1} className="inp" value={sa.sesiones} onChange={(e) => upd({ sesiones: Number(e.target.value) || 1 })} /></F>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <F label="Agrupamientos"><input className="inp" value={sa.agrupamientos} onChange={(e) => upd({ agrupamientos: e.target.value })} /></F>
              <F label="Espacios"><input className="inp" value={sa.espacios} onChange={(e) => upd({ espacios: e.target.value })} /></F>
              <F label="Recursos"><textarea rows={2} className="inp" value={sa.recursos} onChange={(e) => upd({ recursos: e.target.value })} /></F>
              <F label="Medidas de atención a la diversidad"><textarea rows={2} className="inp" value={sa.diversidad} onChange={(e) => upd({ diversidad: e.target.value })} /></F>
            </div>
            <div className="mt-3">
              <F label="Evidencias de aprendizaje"><textarea rows={2} className="inp" value={sa.evidencias} onChange={(e) => upd({ evidencias: e.target.value })} /></F>
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
                    {/* PDFs adjuntos */}
                    {a.pdfs && a.pdfs.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {a.pdfs.map((pdf, idx) => (
                          <div key={idx} className="flex items-center gap-2 rounded-md bg-paper border border-line px-2 py-1">
                            <Ic n="file" s={12} className="text-verm shrink-0" />
                            <span className="flex-1 truncate text-[11px] text-ink2">{pdf.name}</span>
                            <span className="mono text-[9px] text-ink3">{(pdf.size / 1024).toFixed(1)} KB</span>
                            <button
                              onClick={() => {
                                const blob = new Blob([Uint8Array.from(atob(pdf.data), c => c.charCodeAt(0))], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');
                              }}
                              className="cursor-pointer rounded p-0.5 text-ink3 transition hover:bg-azul hover:text-azu"
                              title="Ver PDF"
                            >
                              <Ic n="eye" s={12} />
                            </button>
                            <button
                              onClick={() => {
                                const blob = new Blob([Uint8Array.from(atob(pdf.data), c => c.charCodeAt(0))], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = pdf.name;
                                link.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="cursor-pointer rounded p-0.5 text-ink3 transition hover:bg-virl hover:text-vird"
                              title="Descargar PDF"
                            >
                              <Ic n="download" s={12} />
                            </button>
                            <button
                              onClick={() => {
                                const newPdfs = (a.pdfs ?? []).filter((_, i) => i !== idx);
                                upd({ actividades: sa.actividades.map(act => act.id === a.id ? { ...act, pdfs: newPdfs } : act) });
                                notify("PDF eliminado");
                              }}
                              className="cursor-pointer rounded p-0.5 text-ink3 transition hover:bg-verml hover:text-verm"
                              title="Eliminar PDF"
                            >
                              <Ic n="x" s={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Botón añadir PDF */}
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-line2 bg-card px-2 py-1 text-[11px] font-semibold text-ink2 transition hover:border-vir hover:bg-virl/30 hover:text-vird">
                        <Ic n="plus" s={12} />
                        <span>Añadir ejercicio PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.type === 'application/pdf') {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64 = (reader.result as string).split(',')[1];
                                const newPdf = {
                                  name: file.name,
                                  data: base64,
                                  size: file.size,
                                  addedAt: new Date().toISOString()
                                };
                                const currentPdfs = a.pdfs ?? [];
                                upd({ actividades: sa.actividades.map(act => act.id === a.id ? { ...act, pdfs: [...currentPdfs, newPdf] } : act) });
                                notify("PDF añadido correctamente");
                              };
                              reader.readAsDataURL(file);
                            } else {
                              notify("Solo se permiten archivos PDF");
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
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
            <p className="lbl">Objetivos didácticos</p>
            <div className="space-y-1.5">
              {sa.objetivos.map((o, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-line bg-paper px-2.5 py-2">
                  <span className="mono mt-0.5 text-[10px] font-extrabold text-vir">O{i + 1}</span>
                  <p className="flex-1 text-[12px] leading-snug text-ink">{o}</p>
                  <button className="cursor-pointer text-ink3 hover:text-verm" onClick={() => upd({ objetivos: sa.objetivos.filter((_, x) => x !== i) })}><Ic n="x" s={13} /></button>
                </div>
              ))}
              <ObjetivoAdd onAdd={(t) => upd({ objetivos: [...sa.objetivos, t] })} />
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

function ObjetivoAdd({ onAdd }: { onAdd: (t: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-1.5">
      <input className="inp !py-1.5 text-[12px]" placeholder="Nuevo objetivo…" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); } }} />
      <button className="rounded-lg bg-ink px-3 text-paper cursor-pointer hover:bg-night transition" onClick={() => { if (v.trim()) { onAdd(v.trim()); setV(""); } }}><Ic n="plus" s={14} /></button>
    </div>
  );
}
