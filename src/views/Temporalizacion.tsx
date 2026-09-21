import { useApp, visibleProgramaciones, curso, fmtFecha } from "../store";
import { Ic, Reveal, SectionHead, EmptyState } from "../components/ui";

export default function Temporalizacion() {
  const { d, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const c = curso();
  const total = +c.end - +c.start;
  const pct = (iso: string) => Math.max(0, Math.min(100, ((+new Date(iso + "T12:00:00") - +c.start) / total) * 100));
  const hoyPct = Math.max(0, Math.min(100, ((+new Date() - +c.start) / total) * 100));
  const filas = progs.map((p) => { const sub = d.subjects.find((s) => s.id === p.subjectId)!; return { p, sub, sas: d.sas.filter((s) => s.programacionId === p.id) }; });

  return (
    <div>
      <SectionHead kicker="Planificación temporal" title={`Calendario ${d.cursoLabel}`} desc="Distribución de las situaciones de aprendizaje a lo largo del curso." />
      {progs.length === 0 ? <EmptyState icon="calendar" title="Nada que temporalizar" /> : (
        <Reveal>
          <div className="card overflow-hidden">
            <div className="relative space-y-2 p-4">
              <div className="absolute inset-y-0 z-10 w-[2px] bg-verm" style={{ left: `${hoyPct}%` }}><span className="absolute -top-0 left-1 rounded-b bg-verm px-1 py-0.5 mono text-[8.5px] font-extrabold text-white">hoy</span></div>
              {filas.map(({ sub, sas }) => (
                <div key={sub.id} className="relative">
                  <p className="mb-1 text-[12px] font-bold" style={{ color: sub.color }}>{sub.corto} · {sub.nivel}</p>
                  <div className="relative h-12 rounded-lg bg-paper border border-line/60">
                    {sas.map((sa) => {
                      const left = pct(sa.inicio), width = Math.max(3, pct(sa.fin) - left);
                      return (
                        <button key={sa.id} onClick={() => nav("situaciones", { saId: sa.id })} className="absolute inset-y-1 flex items-center rounded-lg px-2 text-left text-white shadow-sm transition hover:brightness-110 cursor-pointer" style={{ left: `${left}%`, width: `${width}%`, background: sub.color, minWidth: 80 }} title={sa.titulo}>
                          <span className="truncate text-[11px] font-bold">{sa.titulo}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
