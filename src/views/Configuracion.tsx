import { useState } from "react";
import { useApp, uid, visibleSubjects } from "../store";
import { CURRICULA, getCurriculum, allCriterios } from "../data/curriculum";
import type { Subject, Group } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, btnDanger, EstadoBadge } from "../components/ui";

export default function Configuracion() {
  const { d, set, notify, isAdmin, reset } = useApp();
  const [nuevaMateria, setNuevaMateria] = useState(false);
  const [m, setM] = useState<Partial<Subject>>({ etapa: "ESO", tipo: "optativa", curriculumId: "epva-eso" });
  const [nuevoGrupo, setNuevoGrupo] = useState(false);
  const [g, setG] = useState<Partial<Group>>({ dias: [1, 3] });
  const subjects = visibleSubjects(d);

  if (!isAdmin) {
    return (
      <div>
        <SectionHead kicker="Preferencias" title="Configuración" desc="Con perfil de profesorado solo puedes consultar tus datos y gestionar la copia local de la aplicación." />
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal><div className="card p-5">
            <p className="lbl">Tu perfil</p>
            <p className="font-display text-[18px] font-extrabold text-ink">{d.teachers.find((t) => t.id === d.teacherId)?.nombre}</p>
            <p className="mono text-[11.5px] uppercase tracking-widest text-ink3">{subjects.length} materias · {new Set(subjects.map((s) => s.grupoId)).size} grupos</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink2">La gestión de materias, optativas, profesorado y grupos corresponde a la jefatura de departamento. Cambia de sesión desde la barra lateral para acceder al modo administración.</p>
          </div></Reveal>
          <Reveal delay={70}><DatosPanel reset={reset} notify={notify} d={d} /></Reveal>
        </div>
      </div>
    );
  }

  const crearMateria = () => {
    if (!m.nombre?.trim() || !m.grupoId) return;
    set((s) => ({ ...s, subjects: [...s.subjects, { id: uid(), nombre: m.nombre!.trim(), corto: m.corto?.trim() || m.nombre!.trim(), etapa: m.etapa ?? "ESO", nivel: m.nivel ?? "—", curriculumId: m.curriculumId ?? "epva-eso", teacherId: m.teacherId || undefined, grupoId: m.grupoId!, color: m.color ?? "#5b6b8f", tipo: m.tipo ?? "optativa" }] }));
    setNuevaMateria(false); setM({ etapa: "ESO", tipo: "optativa", curriculumId: "epva-eso" });
    notify("Materia creada: ya puede recibir programación");
  };

  const crearGrupo = () => {
    if (!g.nombre?.trim()) return;
    set((s) => ({ ...s, groups: [...s.groups, { id: uid(), nombre: g.nombre!.trim(), nivel: g.nivel ?? "—", tutorId: g.tutorId ?? d.teachers[0].id, dias: g.dias ?? [1, 3] }] }));
    setNuevoGrupo(false); setG({ dias: [1, 3] });
    notify("Grupo creado");
  };

  const duplicarCurso = () => {
    const [y0] = d.cursoLabel.split("-");
    const nuevo = `${Number(y0) + 1}-${String(Number(y0) + 2).slice(2)}`;
    set((s) => ({ ...s, cursoLabel: nuevo, programaciones: [...s.programaciones, ...s.programaciones.map((p) => ({ ...p, id: uid(), curso: nuevo, estado: "Borrador" as const, actualizada: new Date().toISOString().slice(0, 10) }))] }));
    notify(`Programaciones duplicadas al curso ${nuevo} como borradores`);
  };

  return (
    <div>
      <SectionHead
        kicker="Administración del departamento"
        title="Configuración general"
        desc="Materias y optativas, profesorado, grupos y curso académico. Las materias nuevas pueden recibir programación inmediatamente, sin tocar una línea de código."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {/* materias */}
        <Reveal>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="layers" s={16} className="text-vir" /> Materias y optativas</p>
              <button className={btn + " !py-1.5"} onClick={() => setNuevaMateria(true)}><Ic n="plus" s={14} /> Nueva materia</button>
            </div>
            <div className="divide-y divide-line/60">
              {d.subjects.map((s) => {
                const t = d.teachers.find((x) => x.id === s.teacherId);
                const grp = d.groups.find((x) => x.id === s.grupoId);
                const cur = getCurriculum(s.curriculumId);
                const prog = d.programaciones.find((p) => p.subjectId === s.id);
                return (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-virl/20">
                    <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-ink">{s.nombre} <span className="mono text-[10.5px] font-bold text-ink3">· {s.nivel}</span></p>
                      <p className="mono text-[10.5px] uppercase tracking-widest text-ink3">{s.etapa} · currículo {cur.materia.split(" ")[0]} ({allCriterios(cur).length} criterios) · {grp?.nombre} · {t?.nombre ?? "sin profesorado"}</p>
                    </div>
                    <span className={`mono rounded-md px-2 py-0.5 text-[9.5px] font-extrabold uppercase ${s.tipo === "optativa" ? "bg-azul text-azu" : "bg-paper border border-line text-ink2"}`}>{s.tipo}</span>
                    {prog ? <EstadoBadge estado={prog.estado} /> : <span className="mono rounded-md bg-verml px-2 py-0.5 text-[9.5px] font-extrabold uppercase text-verm">sin programar</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {/* profesorado */}
          <Reveal delay={60}>
            <div className="card overflow-hidden">
              <div className="border-b border-line px-4 py-3"><p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="users" s={16} className="text-azu" /> Profesorado del departamento</p></div>
              <div className="divide-y divide-line/60">
                {d.teachers.map((t) => {
                  const sus = d.subjects.filter((s) => s.teacherId === t.id);
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: t.color }}>{t.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-bold text-ink">{t.nombre} <span className="mono ml-1 rounded bg-paper border border-line px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-ink2">{t.rol === "admin" ? "jefatura" : "docente"}</span></p>
                        <p className="truncate text-[11.5px] text-ink3">{t.email} · {sus.map((s) => s.corto).join(", ") || "sin materias"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* grupos + curso */}
          <Reveal delay={100}>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="grid" s={16} className="text-amb" /> Grupos y curso académico</p>
                <button className={btnGhost + " !py-1.5"} onClick={() => setNuevoGrupo(true)}><Ic n="plus" s={14} /> Nuevo grupo</button>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {d.groups.map((gr) => (
                  <div key={gr.id} className="rounded-lg border border-line bg-paper px-3 py-2">
                    <p className="font-display text-[14px] font-extrabold text-ink">{gr.nombre}</p>
                    <p className="mono text-[9.5px] uppercase tracking-widest text-ink3">{gr.nivel} · {d.students.filter((s) => s.groupId === gr.id).length} alumnos</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/60 px-4 py-3">
                <div>
                  <p className="mono text-[10px] font-extrabold uppercase tracking-widest text-ink3">Curso académico activo</p>
                  <p className="font-display text-[20px] font-extrabold text-vir">{d.cursoLabel}</p>
                </div>
                <button className={btnGhost} onClick={duplicarCurso} title="Duplica todas las programaciones como borradores del curso siguiente"><Ic n="copy" s={15} /> Preparar curso siguiente</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}><DatosPanel reset={reset} notify={notify} d={d} /></Reveal>
        </div>
      </div>

      {/* modal materia */}
      <Modal open={nuevaMateria} onClose={() => setNuevaMateria(false)} title="Nueva materia / optativa" wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="lbl">Nombre</label><input className="inp" value={m.nombre ?? ""} onChange={(e) => setM({ ...m, nombre: e.target.value })} placeholder="p. ej. Fotografía creativa" /></div>
          <div><label className="lbl">Nombre corto</label><input className="inp" value={m.corto ?? ""} onChange={(e) => setM({ ...m, corto: e.target.value })} placeholder="Fotografía" /></div>
          <div>
            <label className="lbl">Etapa</label>
            <select className="inp" value={m.etapa} onChange={(e) => setM({ ...m, etapa: e.target.value })}><option>ESO</option><option>Bachillerato</option></select>
          </div>
          <div><label className="lbl">Nivel</label><input className="inp" value={m.nivel ?? ""} onChange={(e) => setM({ ...m, nivel: e.target.value })} placeholder="p. ej. 4º ESO" /></div>
          <div>
            <label className="lbl">Currículo LOMLOE asociado</label>
            <select className="inp" value={m.curriculumId} onChange={(e) => setM({ ...m, curriculumId: e.target.value })}>
              {Object.values(CURRICULA).map((c) => <option key={c.id} value={c.id}>{c.materia}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Tipo</label>
            <select className="inp" value={m.tipo} onChange={(e) => setM({ ...m, tipo: e.target.value as "obligatoria" | "optativa" })}><option value="obligatoria">Obligatoria</option><option value="optativa">Optativa</option></select>
          </div>
          <div>
            <label className="lbl">Grupo</label>
            <select className="inp" value={m.grupoId ?? ""} onChange={(e) => setM({ ...m, grupoId: e.target.value })}>
              <option value="">— elegir —</option>
              {d.groups.map((gr) => <option key={gr.id} value={gr.id}>{gr.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Profesorado (opcional)</label>
            <select className="inp" value={m.teacherId ?? ""} onChange={(e) => setM({ ...m, teacherId: e.target.value || undefined })}>
              <option value="">Sin asignar</option>
              {d.teachers.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Color identificador</label>
            <div className="flex gap-1.5">
              {["#d9532c", "#0e7c66", "#2c6e8f", "#c98a12", "#a84a6c", "#7a5fb0", "#5b6b8f"].map((col) => (
                <button key={col} onClick={() => setM({ ...m, color: col })} className={`h-8 w-8 cursor-pointer rounded-lg border-2 transition ${m.color === col ? "border-ink scale-110" : "border-transparent"}`} style={{ background: col }} aria-label={col} />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-virl px-3 py-2 text-[12px] font-semibold text-vird">Al crear la materia, su currículo completo (competencias, criterios y saberes) queda disponible para programar y evaluar de inmediato.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNuevaMateria(false)}>Cancelar</button>
          <button className={btn} onClick={crearMateria}><Ic n="check" s={15} /> Crear materia</button>
        </div>
      </Modal>

      {/* modal grupo */}
      <Modal open={nuevoGrupo} onClose={() => setNuevoGrupo(false)} title="Nuevo grupo">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="lbl">Nombre</label><input className="inp" value={g.nombre ?? ""} onChange={(e) => setG({ ...g, nombre: e.target.value })} placeholder="p. ej. 3º ESO B" /></div>
          <div><label className="lbl">Nivel</label><input className="inp" value={g.nivel ?? ""} onChange={(e) => setG({ ...g, nivel: e.target.value })} placeholder="3º ESO" /></div>
          <div>
            <label className="lbl">Tutoría</label>
            <select className="inp" value={g.tutorId ?? ""} onChange={(e) => setG({ ...g, tutorId: e.target.value })}>
              {d.teachers.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Días de clase</label>
            <div className="flex gap-1">
              {["L", "M", "X", "J", "V"].map((dd, i) => {
                const on = (g.dias ?? []).includes(i + 1);
                return <button key={dd} onClick={() => setG({ ...g, dias: on ? (g.dias ?? []).filter((x) => x !== i + 1) : [...(g.dias ?? []), i + 1] })} className={`mono h-9 w-9 cursor-pointer rounded-lg border text-[12px] font-extrabold transition ${on ? "border-vir bg-vir text-white" : "border-line2 bg-card text-ink2"}`}>{dd}</button>;
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setNuevoGrupo(false)}>Cancelar</button>
          <button className={btn} onClick={crearGrupo}><Ic n="check" s={15} /> Crear grupo</button>
        </div>
      </Modal>
    </div>
  );
}

function DatosPanel({ reset, notify, d }: { reset: () => void; notify: (m: string) => void; d: ReturnType<typeof useApp>["d"] }) {
  const exportar = () => {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `trazo-departamento-${d.cursoLabel}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Copia de seguridad exportada");
  };
  return (
    <div className="card p-4">
      <p className="lbl">Datos de la aplicación</p>
      <p className="mb-3 text-[12.5px] leading-relaxed text-ink2">Todo se guarda localmente en el navegador. Puedes exportar una copia JSON o restaurar el dataset de demostración con el curso recalculado a la fecha actual.</p>
      <div className="flex flex-wrap gap-2">
        <button className={btnGhost} onClick={exportar}><Ic n="download" s={15} /> Exportar JSON</button>
        <button className={btnDanger} onClick={() => { if (window.confirm("¿Restaurar los datos de demostración? Se perderán los cambios locales.")) { reset(); notify("Datos de demostración restaurados"); } }}>
          <Ic n="refresh" s={14} /> Restaurar demo
        </button>
      </div>
    </div>
  );
}
