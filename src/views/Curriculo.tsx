import { useMemo, useState } from "react";
import { useApp } from "../store";
import { CURRICULA, getCurriculum, allCriterios, descriptorById, claveById, clavesDeCE, criteriosDeSaber, type Criterio } from "../data/curriculum";
import { Ic, Reveal, SectionHead, LevelChip } from "../components/ui";
import { critScore, studentsOf } from "../store";

export default function Curriculo() {
  const { d, nav } = useApp();
  const [curId, setCurId] = useState("epva-eso");
  const [q, setQ] = useState("");
  const [selCrit, setSelCrit] = useState<Criterio | null>(null);
  const [selSaber, setSelSaber] = useState<string | null>(null);
  const [openCE, setOpenCE] = useState<string>("epva.ce1");
  const cur = getCurriculum(curId);

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const filtered = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return cur;
    return {
      ...cur,
      ces: cur.ces
        .map((ce) => ({
          ...ce,
          criterios: ce.criterios.filter((c) => norm(c.texto + c.codigo).includes(t)),
        }))
        .filter((ce) => norm(ce.texto).includes(t) || ce.criterios.length > 0),
    };
  }, [cur, q]);

  /* trazabilidad del criterio seleccionado */
  const sasDelCrit = selCrit ? d.sas.filter((s) => s.criterios.includes(selCrit.id)) : [];
  const instDelCrit = selCrit ? d.instruments.filter((i) => i.criterioIds.includes(selCrit.id)) : [];
  const grupoEval = selCrit
    ? (() => {
        const subject = d.subjects.find((s) => s.curriculumId === curId);
        if (!subject) return null;
        const grupo = studentsOf(d, subject.grupoId);
        const con = grupo.filter((st) => critScore(d, st.id, selCrit.id).score !== null).length;
        const media = grupo.map((st) => critScore(d, st.id, selCrit.id).score).filter((x): x is number => x !== null);
        return { grupo: d.groups.find((g) => g.id === subject.grupoId), con, total: grupo.length, media: media.length ? media.reduce((a, b) => a + b, 0) / media.length : null, subject };
      })()
    : null;

  return (
    <div>
      <SectionHead
        kicker="Base curricular LOMLOE"
        title="Currículo oficial"
        desc="Jerarquía completa: competencias clave → descriptores operativos → competencias específicas → criterios de evaluación → saberes básicos. Selecciona un criterio para ver su red de relaciones."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        {Object.values(CURRICULA).map((c) => (
          <button key={c.id} onClick={() => { setCurId(c.id); setSelCrit(null); setOpenCE(c.ces[0].id); }} className={`cursor-pointer rounded-lg border px-3.5 py-2 text-left transition-all duration-200 ${curId === c.id ? "border-ink bg-ink text-paper shadow-md -translate-y-0.5" : "border-line2 bg-card text-ink2 hover:border-ink3"}`}>
            <p className="text-[13px] font-bold leading-tight">{c.materia}</p>
            <p className="mono text-[10px] uppercase tracking-widest opacity-70">{c.etapa} · {c.niveles}</p>
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-72">
          <Ic n="search" s={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
          <input className="inp !pl-9" placeholder="Buscar criterio, competencia, saber…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* árbol curricular */}
        <div className="space-y-3">
          {filtered.ces.length === 0 && (
            <div className="card px-6 py-10 text-center text-[13px] text-ink3">Sin resultados para «{q}».</div>
          )}
          {filtered.ces.map((ce, i) => {
            const open = openCE === ce.id || q.trim().length > 0;
            return (
              <Reveal key={ce.id} delay={i * 50}>
                <div className="card overflow-hidden">
                  <button onClick={() => setOpenCE(open && !q ? "" : ce.id)} className="flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left transition hover:bg-virl/25">
                    <span className="mono mt-0.5 rounded-md bg-ink px-2 py-1 text-[11px] font-extrabold text-paper">{ce.codigo}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug text-ink">{ce.texto}</span>
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {ce.descriptorIds.map((did) => {
                          const des = descriptorById(did);
                          const kl = des ? claveById(des.clave) : null;
                          return <span key={did} className="mono rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: kl?.soft, color: kl?.color }} title={des?.texto}>{did} · {kl?.corto}</span>;
                        })}
                      </span>
                    </span>
                    <Ic n="chevd" s={17} className={`mt-1 shrink-0 text-ink3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="pop border-t border-line divide-y divide-line/60">
                      {ce.criterios.map((c) => (
                        <button key={c.id} onClick={() => { setSelCrit(c); setSelSaber(null); }} className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition ${selCrit?.id === c.id ? "bg-virl/50" : "hover:bg-virl/25"}`}>
                          <span className={`mono mt-0.5 rounded px-1.5 py-0.5 text-[11px] font-extrabold ${selCrit?.id === c.id ? "bg-vir text-white" : "bg-paper border border-line text-ink2"}`}>{c.codigo}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] leading-snug text-ink">{c.texto}</span>
                            <span className="mt-1.5 flex flex-wrap gap-1">
                              {c.saberIds.map((sid) => {
                                const sb = cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === sid);
                                return (
                                  <span key={sid} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setSelSaber(sid === selSaber ? null : sid); setSelCrit(null); }} className={`mono cursor-pointer rounded border px-1.5 py-0.5 text-[10px] font-bold transition ${selSaber === sid ? "border-azu bg-azu text-white" : "border-line bg-paper text-ink2 hover:border-azu"}`} title={sb?.texto}>
                                    {sb?.codigo}
                                  </span>
                                );
                              })}
                            </span>
                          </span>
                          <Ic n="link" s={14} className="mt-1 shrink-0 text-ink3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}

          {/* saberes básicos */}
          <Reveal delay={100}>
            <div className="card p-4">
              <p className="lbl">Saberes básicos por bloques</p>
              <div className="grid gap-3 md:grid-cols-2">
                {cur.bloques.map((b) => (
                  <div key={b.id} className="rounded-lg border border-line bg-paper p-3">
                    <p className="mono mb-2 text-[10.5px] font-extrabold uppercase tracking-widest text-azu">{b.nombre}</p>
                    <div className="space-y-1.5">
                      {b.saberes.map((s) => (
                        <button key={s.id} onClick={() => { setSelSaber(s.id === selSaber ? null : s.id); setSelCrit(null); }} className={`block w-full cursor-pointer rounded-md border px-2.5 py-1.5 text-left text-[12px] leading-snug transition ${selSaber === s.id ? "border-azu bg-azul text-azu font-semibold" : "border-transparent bg-card text-ink2 hover:border-line2"}`}>
                          <b className="mono mr-1.5 text-[10.5px]">{s.codigo}</b>{s.texto}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* panel de trazabilidad */}
        <aside className="card h-fit p-4 xl:sticky xl:top-20">
          <p className="lbl flex items-center gap-2"><Ic n="link" s={13} /> Trazabilidad</p>
          {!selCrit && !selSaber && (
            <div className="rounded-lg border border-dashed border-line2 px-3 py-6 text-center">
              <p className="text-[12.5px] leading-relaxed text-ink3">Selecciona un <b className="text-ink2">criterio</b> o un <b className="text-ink2">saber básico</b> en el árbol para ver sus relaciones con competencias, descriptores, situaciones de aprendizaje e instrumentos.</p>
            </div>
          )}

          {selSaber && (() => {
            const sb = cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === selSaber);
            const rel = criteriosDeSaber(cur, selSaber);
            return (
              <div className="pop space-y-3">
                <div className="rounded-lg bg-azul p-3">
                  <p className="mono text-[10px] font-extrabold uppercase tracking-widest text-azu">Saber básico {sb?.codigo}</p>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">{sb?.texto}</p>
                </div>
                <p className="mono text-[10px] font-extrabold uppercase tracking-widest text-ink3">Se trabaja en {rel.length} criterios</p>
                {rel.map((c) => {
                  const ce = cur.ces.find((x) => x.id === c.ceId);
                  return (
                    <button key={c.id} onClick={() => { setSelCrit(c); setSelSaber(null); }} className="block w-full cursor-pointer rounded-lg border border-line bg-paper p-2.5 text-left transition hover:border-azu">
                      <p className="mono text-[10.5px] font-extrabold text-azu">{c.codigo} · {ce?.codigo}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-ink2">{c.texto}</p>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {selCrit && (() => {
            const ce = cur.ces.find((x) => x.id === selCrit.ceId);
            return (
              <div className="pop space-y-3">
                <div className="rounded-lg bg-virl p-3">
                  <p className="mono text-[10px] font-extrabold uppercase tracking-widest text-vird">Criterio de evaluación {selCrit.codigo}</p>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">{selCrit.texto}</p>
                </div>
                <div>
                  <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Competencia específica</p>
                  <p className="rounded-lg border border-line bg-paper p-2.5 text-[12px] leading-snug text-ink2"><b className="mono text-ink">{ce?.codigo}</b> — {ce?.texto}</p>
                </div>
                <div>
                  <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Descriptores operativos · competencias clave</p>
                  <div className="space-y-1.5">
                    {(ce?.descriptorIds ?? []).map((did) => {
                      const des = descriptorById(did);
                      const kl = des ? claveById(des.clave) : null;
                      return (
                        <div key={did} className="rounded-lg border border-line bg-paper p-2">
                          <p className="mono text-[10.5px] font-extrabold" style={{ color: kl?.color }}>{did} · {kl?.nombre}</p>
                          <p className="mt-0.5 text-[11.5px] leading-snug text-ink2">{des?.texto}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Saberes básicos</p>
                  <div className="flex flex-wrap gap-1">
                    {selCrit.saberIds.map((sid) => {
                      const sb = cur.bloques.flatMap((b) => b.saberes).find((x) => x.id === sid);
                      return <span key={sid} title={sb?.texto} className="mono cursor-help rounded-md border border-line bg-paper px-2 py-1 text-[10.5px] font-bold text-ink2">{sb?.codigo}</span>;
                    })}
                  </div>
                </div>
                <div>
                  <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Situaciones de aprendizaje ({sasDelCrit.length})</p>
                  {sasDelCrit.map((s) => (
                    <button key={s.id} onClick={() => nav("situaciones", { saId: s.id })} className="mb-1.5 flex w-full cursor-pointer items-center justify-between rounded-lg border border-line bg-paper px-2.5 py-2 text-left transition hover:border-vir">
                      <span className="truncate text-[12px] font-semibold text-ink">{s.titulo}</span>
                      <Ic n="chevr" s={13} className="shrink-0 text-ink3" />
                    </button>
                  ))}
                  {sasDelCrit.length === 0 && <p className="text-[11.5px] italic text-ink3">Ninguna SA lo trabaja todavía.</p>}
                </div>
                <div>
                  <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Instrumentos que lo evalúan ({instDelCrit.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {instDelCrit.map((i) => <span key={i.id} className="rounded-md bg-ambl px-2 py-1 text-[10.5px] font-bold text-amb">{i.nombre.split("·")[0].trim()}</span>)}
                  </div>
                </div>
                {grupoEval && (
                  <div className="rounded-lg border border-line bg-paper p-3">
                    <p className="mono mb-1 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Estado en {grupoEval.grupo?.nombre} · {grupoEval.subject.corto}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-ink2">Evaluado en <b className="text-ink">{grupoEval.con}/{grupoEval.total}</b> alumnos</p>
                      <LevelChip score={grupoEval.media} />
                    </div>
                    <button onClick={() => nav("cuaderno", { groupId: grupoEval.grupo?.id })} className="mono mt-2 text-[11px] font-bold text-vir hover:underline cursor-pointer">abrir cuaderno →</button>
                  </div>
                )}
              </div>
            );
          })()}
        </aside>
      </div>
    </div>
  );
}
