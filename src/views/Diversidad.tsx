import { useState } from "react";
import { useApp, uid, critScore, fmt, fmtFecha, visibleSubjects } from "../store";
import { getCurriculum, allCriterios } from "../data/curriculum";
import type { Measure, Recovery } from "../data/seed";
import { toISO } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, LevelChip } from "../components/ui";

const TIPOS = ["NEAE", "Inclusión", "Refuerzo", "Ampliación", "Metodológica", "Recuperación"];
const COLOR_TIPO: Record<string, string> = { NEAE: "#a84a6c", Inclusión: "#2c6e8f", Refuerzo: "#c98a12", Ampliación: "#0e7c66", Metodológica: "#5b6b8f", Recuperación: "#d9532c" };

/* ================= atención a la diversidad ================= */

export function Diversidad() {
  const { d, set, notify, nav } = useApp();
  const [filtro, setFiltro] = useState("Todas");
  const [nueva, setNueva] = useState(false);
  const [m, setM] = useState<Partial<Measure>>({ tipo: "NEAE" });

  const measures = d.measures.filter((x) => filtro === "Todas" || x.tipo === filtro);
  const neae = d.students.filter((s) => s.neae);

  const crear = () => {
    if (!m.titulo?.trim()) return;
    set((s) => ({ ...s, measures: [...s.measures, { id: uid(), tipo: m.tipo ?? "NEAE", titulo: (m.titulo ?? "").trim(), desc: m.desc ?? "", studentId: m.studentId || undefined, groupId: m.groupId || undefined }] }));
    setNueva(false); setM({ tipo: "NEAE" });
    notify("Medida registrada");
  };

  return (
    <div>
      <SectionHead
        kicker="Inclusión educativa"
        title="Atención a la diversidad"
        desc="Medidas ordinarias, inclusiones, refuerzos y ampliaciones, asociadas al alumnado y reflejadas en el cuaderno y los informes."
        actions={<button className={btn} onClick={() => setNueva(true)}><Ic n="plus" s={15} /> Nueva medida</button>}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          { v: neae.length, l: "alumnado con NEAE", i: "heart", c: "#a84a6c" },
          { v: d.measures.filter((x) => x.studentId).length, l: "medidas individuales", i: "user", c: "#c98a12" },
          { v: d.measures.filter((x) => !x.studentId).length, l: "medidas de grupo", i: "users", c: "#2c6e8f" },
        ].map((t, i) => (
          <Reveal key={t.l} delay={i * 60}>
            <div className="card card-h flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${t.c}16`, color: t.c }}><Ic n={t.i} s={19} /></span>
              <div>
                <p className="font-display text-[26px] font-extrabold leading-none text-ink">{t.v}</p>
                <p className="mono text-[10px] uppercase tracking-widest text-ink3">{t.l}</p>
              </div>
            </div>
          </Reveal>
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
        {measures.map((mm, i) => {
          const st = mm.studentId ? d.students.find((s) => s.id === mm.studentId) : undefined;
          const g = mm.groupId ? d.groups.find((x) => x.id === mm.groupId) : undefined;
          return (
            <Reveal key={mm.id} delay={i * 50}>
              <div className="card card-h flex h-full flex-col overflow-hidden">
                <div className="h-1.5" style={{ background: COLOR_TIPO[mm.tipo] ?? "#0e7c66" }} />
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <span className="mono rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white" style={{ background: COLOR_TIPO[mm.tipo] }}>{mm.tipo}</span>
                    <span className="mono ml-auto text-[10.5px] font-bold text-ink3">{g?.nombre}</span>
                  </div>
                  <p className="mt-2 font-display text-[15.5px] font-extrabold leading-snug text-ink">{mm.titulo}</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-ink2">{mm.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  {st ? (
                    <button className="flex cursor-pointer items-center gap-2 text-left transition hover:opacity-75" onClick={() => nav("alumnado", { groupId: st.groupId, studentId: st.id })}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                      <span className="text-[12px] font-bold text-ink">{st.nombre}</span>
                    </button>
                  ) : (
                    <span className="text-[11.5px] font-semibold text-ink3">Todo el grupo</span>
                  )}
                  <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-verml hover:text-verm" onClick={() => { set((s) => ({ ...s, measures: s.measures.filter((x) => x.id !== mm.id) })); notify("Medida eliminada"); }}>
                    <Ic n="trash" s={15} />
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      {measures.length === 0 && <EmptyState icon="heart" title="Sin medidas de este tipo" desc="Registra la primera medida para este filtro." />}

      <Modal open={nueva} onClose={() => setNueva(false)} title="Nueva medida de atención a la diversidad">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="lbl">Tipo de medida</label>
            <select className="inp" value={m.tipo} onChange={(e) => setM({ ...m, tipo: e.target.value })}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="lbl">Grupo</label>
            <select className="inp" value={m.groupId ?? ""} onChange={(e) => setM({ ...m, groupId: e.target.value || undefined, studentId: undefined })}>
              <option value="">— elegir —</option>
              {d.groups.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </select>
          </div>
        </div>
        <label className="lbl mt-3">Alumno/a (opcional: si se deja vacío, es una medida de grupo)</label>
        <select className="inp" value={m.studentId ?? ""} onChange={(e) => setM({ ...m, studentId: e.target.value || undefined })}>
          <option value="">Todo el grupo</option>
          {d.students.filter((s) => !m.groupId || s.groupId === m.groupId).map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <label className="lbl mt-3">Título</label>
        <input className="inp" value={m.titulo ?? ""} onChange={(e) => setM({ ...m, titulo: e.target.value })} placeholder="p. ej. Adaptaciones de acceso…" />
        <label className="lbl mt-3">Descripción de la medida</label>
        <textarea rows={3} className="inp" value={m.desc ?? ""} onChange={(e) => setM({ ...m, desc: e.target.value })} />
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNueva(false)}>Cancelar</button>
          <button className={btn} onClick={crear}><Ic n="check" s={15} /> Registrar</button>
        </div>
      </Modal>
    </div>
  );
}

/* ================= recuperación ================= */

export function Recuperacion() {
  const { d, set, notify } = useApp();
  const subjects = visibleSubjects(d);
  const [plan, setPlan] = useState<Partial<Recovery> | null>(null);

  /* detección automática: criterios suspensos por alumno */
  const pendientes = subjects.flatMap((sub) => {
    const cur = getCurriculum(sub.curriculumId);
    return d.students.filter((st) => st.groupId === sub.grupoId).flatMap((st) =>
      allCriterios(cur)
        .filter((cr) => { const r = critScore(d, st.id, cr.id); return r.score !== null && r.score < 5; })
        .map((cr) => ({ st, sub, cr, score: critScore(d, st.id, cr.id).score as number, plan: d.recoveries.find((r) => r.studentId === st.id && r.criterioId === cr.id) }))
    );
  });

  const crearPlan = () => {
    if (!plan?.studentId || !plan.criterioId || !plan.actividad?.trim()) return;
    set((s) => ({ ...s, recoveries: [...s.recoveries, { id: uid(), studentId: plan.studentId!, criterioId: plan.criterioId!, actividad: plan.actividad!.trim(), fecha: plan.fecha ?? toISO(new Date(Date.now() + 14 * 864e5)), instrumentoId: plan.instrumentoId ?? "", resultado: plan.resultado }] }));
    setPlan(null);
    notify("Plan de recuperación creado");
  };

  const setResultado = (id: string, v: number) => {
    set((s) => ({ ...s, recoveries: s.recoveries.map((r) => (r.id === id ? { ...r, resultado: v } : r)) }));
    notify("Resultado registrado");
  };

  return (
    <div>
      <SectionHead
        kicker="Criterios no superados"
        title="Recuperación y refuerzo"
        desc="El sistema detecta automáticamente los criterios con calificación inferior a 5 y permite crear planes individuales con su resultado."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Reveal>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="alert" s={16} className="text-verm" /> Criterios pendientes detectados</p>
              <span className="mono rounded-md bg-verml px-2 py-0.5 text-[11px] font-extrabold text-verm">{pendientes.length} en total</span>
            </div>
            {pendientes.length === 0 && <p className="px-4 py-10 text-center text-[13px] italic text-ink3">Enhorabuena: ningún criterio suspenso con datos registrados.</p>}
            <div className="divide-y divide-line/60">
              {pendientes.map(({ st, sub, cr, score, plan: pl }, i) => (
                <div key={st.id + cr.id} className={`flex flex-wrap items-center gap-3 px-4 py-2.5 transition hover:bg-verml/20 ${i % 2 ? "bg-paper/50" : ""}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>{st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                  <div className="min-w-[170px] flex-1">
                    <p className="text-[13px] font-bold text-ink">{st.nombre}</p>
                    <p className="mono text-[10px] uppercase tracking-widest text-ink3" style={{ color: sub.color }}>{sub.corto}</p>
                  </div>
                  <div className="w-[130px]">
                    <p className="mono text-[11px] font-extrabold" style={{ color: sub.color }}>{cr.codigo}</p>
                    <LevelChip score={score} sm />
                  </div>
                  {pl ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-ambl px-2.5 py-1 text-[11px] font-bold text-amb" title={pl.actividad}>Plan: {fmtFecha(pl.fecha)}</span>
                      <input type="number" min={0} max={10} step={0.1} defaultValue={pl.resultado ?? ""} placeholder="nota" className="inp !w-20 !px-2 !py-1 mono text-[12px] text-right" onBlur={(e) => { const v = parseFloat(e.target.value.replace(",", ".")); if (!Number.isNaN(v)) setResultado(pl.id, Math.round(v * 10) / 10); }} />
                      {pl.resultado !== undefined && (
                        <span className={`mono rounded px-1.5 py-0.5 text-[9.5px] font-extrabold ${pl.resultado >= 5 ? "bg-virl text-vird" : "bg-verml text-verm"}`}>{pl.resultado >= 5 ? "RECUPERADO" : "NO SUPERADO"}</span>
                      )}
                    </div>
                  ) : (
                    <button className={btnGhost + " !px-3 !py-1.5 !text-[12px]"} onClick={() => setPlan({ studentId: st.id, criterioId: cr.id })}><Ic n="plus" s={13} /> Crear plan</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <aside className="space-y-4">
          <Reveal delay={80}>
            <div className="card p-4">
              <p className="lbl">Planes de recuperación activos</p>
              <div className="space-y-2">
                {d.recoveries.map((r) => {
                  const st = d.students.find((s) => s.id === r.studentId);
                  return (
                    <div key={r.id} className="rounded-lg border border-line bg-paper p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12.5px] font-bold text-ink">{st?.nombre}</p>
                        <span className={`mono rounded px-1.5 py-0.5 text-[9px] font-extrabold ${r.resultado === undefined ? "bg-ambl text-amb" : r.resultado >= 5 ? "bg-virl text-vird" : "bg-verml text-verm"}`}>
                          {r.resultado === undefined ? "EN CURSO" : r.resultado >= 5 ? "RECUPERADO" : `NO · ${fmt(r.resultado)}`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-ink2">{r.actividad}</p>
                      <p className="mono mt-1 text-[10px] font-bold text-ink3">criterio {r.criterioId.split(".").slice(1).join(".")} · {fmtFecha(r.fecha)}</p>
                    </div>
                  );
                })}
                {d.recoveries.length === 0 && <p className="text-[12px] italic text-ink3">No hay planes registrados.</p>}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card border-dashed p-4">
              <p className="lbl">Criterio de promoción</p>
              <p className="text-[12.5px] leading-relaxed text-ink2">Un criterio se considera <b className="text-ink">superado</b> con calificación ≥ 5. El plan se marca como <b className="text-vird">recuperado</b> al registrar un resultado ≥ 5, y queda reflejado en los informes del alumnado.</p>
            </div>
          </Reveal>
        </aside>
      </div>

      <Modal open={!!plan} onClose={() => setPlan(null)} title="Plan individual de recuperación">
        {plan && (() => {
          const st = d.students.find((s) => s.id === plan.studentId);
          return (
            <>
              <p className="mb-3 rounded-lg bg-verml/60 px-3 py-2 text-[12.5px] font-semibold text-verm">
                {st?.nombre} · criterio {plan.criterioId?.split(".").slice(1).join(".")} · calificación actual {fmt(critScore(d, st?.id ?? "", plan.criterioId ?? "").score)}
              </p>
              <label className="lbl">Actividad de recuperación</label>
              <textarea rows={3} className="inp" value={plan.actividad ?? ""} onChange={(e) => setPlan({ ...plan, actividad: e.target.value })} placeholder="p. ej. Cuaderno de análisis de imágenes: 6 láminas comentadas…" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="lbl">Fecha límite</label>
                  <input type="date" className="inp" value={plan.fecha ?? ""} onChange={(e) => setPlan({ ...plan, fecha: e.target.value })} />
                </div>
                <div>
                  <label className="lbl">Instrumento</label>
                  <select className="inp" value={plan.instrumentoId ?? ""} onChange={(e) => setPlan({ ...plan, instrumentoId: e.target.value })}>
                    <option value="">— sin instrumento —</option>
                    {d.instruments.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className={btnGhost} onClick={() => setPlan(null)}>Cancelar</button>
                <button className={btn} onClick={crearPlan}><Ic n="check" s={15} /> Crear plan</button>
              </div>
            </>
          );
        })()}
      </Modal>
    </div>
  );
}
