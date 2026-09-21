import { useApp, visibleProgramaciones, curso, fmtFecha } from "../store";
import { Ic, Reveal, SectionHead, EmptyState } from "../components/ui";

const MESES = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"];

export default function Temporalizacion() {
  const { d, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const c = curso();
  const total = +c.end - +c.start;
  const pct = (iso: string) => {
    const t = +new Date(iso + "T12:00:00");
    return Math.max(0, Math.min(100, ((t - +c.start) / total) * 100));
  };
  const hoyPct = (() => {
    const h = new Date(); h.setHours(12, 0, 0, 0);
    return Math.max(0, Math.min(100, ((+h - +c.start) / total) * 100));
  })();

  const evaBands = c.evas.map((e, i) => ({
    ...e,
    left: pct(e.inicio.toISOString().slice(0, 10)),
    width: Math.max(0, pct(e.fin.toISOString().slice(0, 10)) - pct(e.inicio.toISOString().slice(0, 10))),
    color: ["#0e7c66", "#2c6e8f", "#c98a12"][i],
  }));

  const filas = progs.map((p) => {
    const sub = d.subjects.find((s) => s.id === p.subjectId)!;
    return { p, sub, sas: d.sas.filter((s) => s.programacionId === p.id) };
  });

  return (
    <div>
      <SectionHead
        kicker="Planificación temporal"
        title={`Calendario del curso ${d.cursoLabel}`}
        desc="Distribución de las situaciones de aprendizaje a lo largo de las tres evaluaciones. La línea continua marca la fecha de hoy."
      />

      {progs.length === 0 ? (
        <EmptyState icon="calendar" title="Nada que temporalizar" desc="No hay programaciones visibles para este perfil." />
      ) : (
        <>
          <Reveal>
            <div className="card overflow-hidden">
              {/* cabecera meses */}
              <div className="border-b-2 border-ink/70">
                <div className="grid" style={{ gridTemplateColumns: "170px 1fr" }}>
                  <div className="border-r border-line px-3 py-2">
                    <p className="mono text-[10px] font-extrabold uppercase tracking-widest text-ink3">Materia / SA</p>
                  </div>
                  <div className="relative grid grid-cols-10">
                    {MESES.map((m) => (
                      <div key={m} className="border-l border-line/70 py-2 text-center first:border-l-0">
                        <span className="mono text-[11px] font-extrabold uppercase tracking-widest text-ink2">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* bandas de evaluación */}
                <div className="grid" style={{ gridTemplateColumns: "170px 1fr" }}>
                  <div className="border-r border-line px-3 py-1.5">
                    <p className="mono text-[9.5px] uppercase tracking-widest text-ink3">Evaluaciones</p>
                  </div>
                  <div className="relative h-7 overflow-hidden">
                    {evaBands.map((e) => (
                      <div key={e.n} className="absolute inset-y-0 flex items-center justify-center" style={{ left: `${e.left}%`, width: `${e.width}%`, background: `${e.color}14`, borderLeft: `2px solid ${e.color}`, borderRight: `2px solid ${e.color}` }}>
                        <span className="mono whitespace-nowrap text-[9.5px] font-extrabold uppercase tracking-widest" style={{ color: e.color }}>{e.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* filas */}
              {filas.map(({ p, sub, sas }) => (
                <div key={p.id} className="border-b border-line/70 last:border-b-0">
                  <div className="grid" style={{ gridTemplateColumns: "170px 1fr" }}>
                    <div className="flex items-center gap-2 border-r border-line bg-paper/60 px-3 py-2">
                      <span className="h-6 w-1.5 rounded-full" style={{ background: sub.color }} />
                      <div className="min-w-0">
                        <p className="truncate font-display text-[13px] font-extrabold text-ink">{sub.corto}</p>
                        <p className="mono text-[9.5px] uppercase tracking-widest text-ink3">{sub.nivel}</p>
                      </div>
                    </div>
                    <div className="relative">
                      {/* rejilla de meses */}
                      <div className="absolute inset-0 grid grid-cols-10">
                        {MESES.map((m) => <div key={m} className="border-l border-line/50 first:border-l-0" />)}
                      </div>
                      {/* hoy */}
                      <div className="absolute inset-y-0 z-10 w-[2px] bg-verm" style={{ left: `${hoyPct}%` }}>
                        <span className="absolute -top-0 left-1 rounded-b bg-verm px-1 py-0.5 mono text-[8.5px] font-extrabold uppercase text-white">hoy</span>
                      </div>
                      {/* barras de SA */}
                      <div className="relative space-y-1.5 py-2 pr-2">
                        {sas.map((sa) => {
                          const left = pct(sa.inicio), width = Math.max(2.5, pct(sa.fin) - left);
                          return (
                            <button
                              key={sa.id}
                              onClick={() => nav("situaciones", { saId: sa.id })}
                              className="group/card relative block h-9 cursor-pointer overflow-hidden rounded-lg text-left shadow-sm transition-all duration-200 hover:shadow-lg hover:brightness-105 hover:-translate-y-px"
                              style={{ marginLeft: `${left}%`, width: `${width}%`, background: `linear-gradient(100deg, ${sub.color}, ${sub.color}cc)`, minWidth: 90 }}
                              title={`${sa.titulo} · ${sa.sesiones} sesiones`}
                            >
                              <span className="absolute inset-0 flex items-center gap-2 px-2.5">
                                <span className="mono shrink-0 rounded bg-white/25 px-1.5 py-0.5 text-[9px] font-extrabold text-white">{sa.eva}ª</span>
                                <span className="truncate text-[12px] font-bold text-white">{sa.titulo}</span>
                                <span className="mono ml-auto hidden shrink-0 text-[9.5px] font-bold text-white/80 md:block">{sa.sesiones} ses.</span>
                              </span>
                            </button>
                          );
                        })}
                        {sas.length === 0 && <p className="py-2 pl-2 text-[12px] italic text-ink3">Sin situaciones planificadas</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* unidades en la línea temporal */}
          <Reveal delay={80}>
            <div className="mt-4 card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <p className="flex items-center gap-2 text-[13px] font-bold text-ink"><Ic n="layers" s={15} className="text-azu" /> Unidades didácticas en el curso</p>
                <button onClick={() => nav("unidades")} className="mono text-[11px] font-bold text-vir hover:underline cursor-pointer">gestionar →</button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 grid grid-cols-10 px-0">
                  {MESES.map((m) => <div key={m} className="border-l border-line/40 first:border-l-0" />)}
                </div>
                <div className="relative space-y-2 p-4">
                  {d.units.filter((un) => progs.some((p) => p.id === un.programacionId)).map((un) => {
                    const prog = d.programaciones.find((p) => p.id === un.programacionId);
                    const sub = d.subjects.find((s) => s.id === prog?.subjectId);
                    const left = pct(un.inicio), width = Math.max(3, pct(un.fin) - left);
                    return (
                      <div key={un.id} className="flex items-center gap-2">
                        <div className="w-[150px] shrink-0 truncate text-[12px] font-bold text-ink2" title={un.titulo}>{un.titulo}</div>
                        <div className="relative h-6 flex-1 rounded-md bg-paper border border-line/60">
                          <div className="absolute inset-y-0 flex items-center rounded-md px-2" style={{ left: `${left}%`, width: `${width}%`, background: `${sub?.color}26`, border: `1.5px solid ${sub?.color}` }}>
                            <span className="mono truncate text-[10px] font-extrabold" style={{ color: sub?.color }}>{un.sesiones} sesiones · {fmtFecha(un.inicio)}–{fmtFecha(un.fin)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* tabla resumen */}
          <Reveal delay={140}>
            <div className="mt-4 card overflow-hidden">
              <div className="border-b border-line px-4 py-2.5"><p className="text-[13px] font-bold text-ink">Detalle de la planificación</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b border-line text-[10.5px] uppercase tracking-widest text-ink3">
                      <th className="px-4 py-2.5 font-bold">Situación</th>
                      <th className="px-4 py-2.5 font-bold">Materia</th>
                      <th className="px-4 py-2.5 font-bold">Inicio</th>
                      <th className="px-4 py-2.5 font-bold">Final</th>
                      <th className="px-4 py-2.5 font-bold text-center">Sesiones</th>
                      <th className="px-4 py-2.5 font-bold text-center">Evaluación</th>
                      <th className="px-4 py-2.5 font-bold text-center">Criterios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70">
                    {filas.flatMap(({ sub, sas }) => sas.map((sa) => (
                      <tr key={sa.id} className="cursor-pointer transition hover:bg-virl/25" onClick={() => nav("situaciones", { saId: sa.id })}>
                        <td className="px-4 py-2.5 text-[13px] font-bold text-ink">{sa.titulo}</td>
                        <td className="px-4 py-2.5"><span className="inline-flex items-center gap-1.5 text-[12px] font-bold" style={{ color: sub.color }}><span className="h-2 w-2 rounded-sm" style={{ background: sub.color }} />{sub.corto}</span></td>
                        <td className="mono px-4 py-2.5 text-[12px] text-ink2">{fmtFecha(sa.inicio)}</td>
                        <td className="mono px-4 py-2.5 text-[12px] text-ink2">{fmtFecha(sa.fin)}</td>
                        <td className="mono px-4 py-2.5 text-center text-[12px] font-bold">{sa.sesiones}</td>
                        <td className="px-4 py-2.5 text-center"><span className="mono rounded bg-paper border border-line px-1.5 py-0.5 text-[10.5px] font-extrabold text-ink2">{sa.eva}ª</span></td>
                        <td className="mono px-4 py-2.5 text-center text-[12px] font-bold text-vir">{sa.criterios.length}</td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </>
      )}
    </div>
  );
}
