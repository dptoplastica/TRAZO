import { useState, useMemo } from "react";
import { useApp, uid, visibleSubjects } from "../store";
import { CURRICULA, getCurriculum, allCriterios } from "../data/curriculum";
import type { Subject, Group, Teacher, Student } from "../data/seed";
import { Ic, Reveal, SectionHead, Modal, EmptyState, btn, btnGhost, btnDanger, EstadoBadge } from "../components/ui";

/* ================================================================
   CONFIGURACIÓN · Administración del departamento
   - Profesorado (CRUD completo)
   - Materias y optativas (CRUD + asignación a profesor)
   - Grupos (CRUD)
   - Curso académico
   ================================================================ */

const COLORES_PROF = ["#0e7c66", "#2c6e8f", "#d9532c", "#c98a12", "#a84a6c", "#7a5fb0", "#5b6b8f", "#4f7cac"];

export default function Configuracion() {
  const { d, set, notify, isAdmin, reset } = useApp();
  const subjects = visibleSubjects(d);

  /* estados de modales */
  const [nuevaMateria, setNuevaMateria] = useState(false);
  const [m, setM] = useState<Partial<Subject>>({ etapa: "ESO", tipo: "optativa", curriculumId: "epva-eso" });
  const [editMateria, setEditMateria] = useState<Subject | null>(null);
  const [nuevoGrupo, setNuevoGrupo] = useState(false);
  const [g, setG] = useState<Partial<Group>>({ dias: [1, 3] });
  const [nuevoProf, setNuevoProf] = useState(false);
  const [prof, setProf] = useState<Partial<Teacher>>({ rol: "profesor", color: COLORES_PROF[0] });
  const [editProf, setEditProf] = useState<Teacher | null>(null);
  const [asignarMaterias, setAsignarMaterias] = useState<Teacher | null>(null);
  const [verAlumnos, setVerAlumnos] = useState<Group | null>(null);
  const [nuevoAlumno, setNuevoAlumno] = useState(false);
  const [alumno, setAlumno] = useState<Partial<Student>>({ base: 6.5, absRate: 0.05, hue: Math.floor(Math.random() * 360) });
  const [editAlumno, setEditAlumno] = useState<Student | null>(null);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  /* ---------- vista profesorado (sin admin) ---------- */
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
          <Reveal delay={70}><DatosPanel reset={reset} notify={notify} d={d} setConfirmDialog={setConfirmDialog} /></Reveal>
        </div>
      </div>
    );
  }

  /* ---------- acciones ---------- */

  const crearMateria = () => {
    if (!m.nombre?.trim() || !m.grupoId) return;
    set((s) => ({ ...s, subjects: [...s.subjects, { id: uid(), nombre: m.nombre!.trim(), corto: m.corto?.trim() || m.nombre!.trim(), etapa: m.etapa ?? "ESO", nivel: m.nivel ?? "—", curriculumId: m.curriculumId ?? "epva-eso", teacherId: m.teacherId || undefined, grupoId: m.grupoId!, color: m.color ?? "#5b6b8f", tipo: m.tipo ?? "optativa" }] }));
    setNuevaMateria(false); setM({ etapa: "ESO", tipo: "optativa", curriculumId: "epva-eso" });
    notify("Materia creada: ya puede recibir programación");
  };

  const guardarMateria = () => {
    if (!editMateria || !editMateria.nombre.trim() || !editMateria.grupoId) return;
    set((s) => ({ ...s, subjects: s.subjects.map((x) => (x.id === editMateria.id ? editMateria : x)) }));
    setEditMateria(null);
    notify("Materia actualizada");
  };

  const eliminarMateria = (id: string) => {
    const mat = d.subjects.find((s) => s.id === id);
    const prog = d.programaciones.find((p) => p.subjectId === id);
    const msg = prog
      ? `¿Eliminar "${mat?.nombre}"? También se eliminará su programación y todos los datos asociados (situaciones, instrumentos, calificaciones).`
      : `¿Eliminar la materia "${mat?.nombre}"?`;
    setConfirmDialog({
      message: msg,
      onConfirm: () => {
        set((s) => ({
          ...s,
          subjects: s.subjects.filter((x) => x.id !== id),
          programaciones: s.programaciones.filter((p) => p.subjectId !== id),
          sas: s.sas.filter((sa) => !s.programaciones.find((p) => p.id === sa.programacionId && p.subjectId === id)),
          instruments: s.instruments.filter((i) => i.subjectId !== id),
          grades: s.grades.filter((g) => !s.instruments.find((i) => i.id === g.instrumentoId && i.subjectId === id)),
        }));
        notify("Materia eliminada");
        setConfirmDialog(null);
      },
    });
  };

  const crearGrupo = () => {
    if (!g.nombre?.trim()) return;
    set((s) => ({ ...s, groups: [...s.groups, { id: uid(), nombre: g.nombre!.trim(), nivel: g.nivel ?? "—", tutorId: g.tutorId ?? d.teachers[0].id, dias: g.dias ?? [1, 3] }] }));
    setNuevoGrupo(false); setG({ dias: [1, 3] });
    notify("Grupo creado");
  };

  const guardarGrupo = () => {
    if (!editGroup || !editGroup.nombre.trim()) return;
    set((s) => ({ ...s, groups: s.groups.map((gr) => (gr.id === editGroup.id ? editGroup : gr)) }));
    setEditGroup(null);
    notify("Grupo actualizado");
  };

  const crearProfesor = () => {
    if (!prof.nombre?.trim()) return;
    const nuevo: Teacher = {
      id: uid(),
      nombre: prof.nombre.trim(),
      email: prof.email?.trim() || `${prof.nombre.trim().toLowerCase().replace(/\s+/g, ".")}@iesatalaya.es`,
      rol: (prof.rol as "profesor" | "admin") ?? "profesor",
      color: prof.color ?? COLORES_PROF[0],
    };
    set((s) => ({ ...s, teachers: [...s.teachers, nuevo] }));
    setNuevoProf(false); setProf({ rol: "profesor", color: COLORES_PROF[0] });
    notify("Profesor/a añadido/a al departamento");
  };

  const guardarProfesor = () => {
    if (!editProf || !editProf.nombre.trim()) return;
    set((s) => ({ ...s, teachers: s.teachers.map((t) => (t.id === editProf.id ? editProf : t)) }));
    setEditProf(null);
    notify("Profesor/a actualizado/a");
  };

  const eliminarProfesor = (id: string) => {
    const t = d.teachers.find((x) => x.id === id);
    if (!t) return;
    if (id === d.teacherId) { notify("No puedes eliminar tu propia sesión activa"); return; }
    const materias = d.subjects.filter((s) => s.teacherId === id);
    const msg = materias.length
      ? `¿Eliminar a ${t.nombre}? Sus ${materias.length} materia(s) quedarán sin profesorado asignado.`
      : `¿Eliminar a ${t.nombre} del departamento?`;
    setConfirmDialog({
      message: msg,
      onConfirm: () => {
        set((s) => ({
          ...s,
          teachers: s.teachers.filter((x) => x.id !== id),
          subjects: s.subjects.map((sub) => (sub.teacherId === id ? { ...sub, teacherId: undefined } : sub)),
          groups: s.groups.map((gr) => (gr.tutorId === id ? { ...gr, tutorId: s.teachers.find((x) => x.id !== id)?.id ?? s.teachers[0].id } : gr)),
        }));
        notify("Profesor/a eliminado/a del departamento");
        setConfirmDialog(null);
      },
    });
  };

  const asignarMateriaAProfesor = (materiaId: string, profesorId: string | undefined) => {
    set((s) => ({ ...s, subjects: s.subjects.map((sub) => (sub.id === materiaId ? { ...sub, teacherId: profesorId } : sub)) }));
    notify(profesorId ? "Materia asignada" : "Asignación retirada");
  };

  const toggleMateriaDeProfesor = (materiaId: string, teacherId: string) => {
    set((s) => ({
      ...s,
      subjects: s.subjects.map((sub) => {
        if (sub.id !== materiaId) return sub;
        return { ...sub, teacherId: sub.teacherId === teacherId ? undefined : teacherId };
      }),
    }));
  };

  const duplicarCurso = () => {
    const [y0] = d.cursoLabel.split("-");
    const nuevo = `${Number(y0) + 1}-${String(Number(y0) + 2).slice(2)}`;
    set((s) => ({ ...s, cursoLabel: nuevo, programaciones: [...s.programaciones, ...s.programaciones.map((p) => ({ ...p, id: uid(), curso: nuevo, estado: "Borrador" as const, actualizada: new Date().toISOString().slice(0, 10) }))] }));
    notify(`Programaciones duplicadas al curso ${nuevo} como borradores`);
  };

  const crearAlumno = () => {
    if (!alumno.nombre?.trim() || !verAlumnos) return;
    const nuevo: Student = {
      id: uid(),
      groupId: verAlumnos.id,
      nombre: alumno.nombre.trim(),
      base: alumno.base ?? 6.5,
      absRate: alumno.absRate ?? 0.05,
      hue: alumno.hue ?? Math.floor(Math.random() * 360),
      neae: alumno.neae?.trim() || undefined,
    };
    set((s) => ({ ...s, students: [...s.students, nuevo] }));
    setNuevoAlumno(false);
    setAlumno({ base: 6.5, absRate: 0.05, hue: Math.floor(Math.random() * 360) });
    notify("Alumno/a añadido/a al grupo");
  };

  const guardarAlumno = () => {
    if (!editAlumno || !editAlumno.nombre.trim()) return;
    set((s) => ({ ...s, students: s.students.map((st) => (st.id === editAlumno.id ? editAlumno : st)) }));
    setEditAlumno(null);
    notify("Alumno/a actualizado/a");
  };

  const eliminarAlumno = (id: string) => {
    const st = d.students.find((x) => x.id === id);
    if (!st) return;
    setConfirmDialog({
      message: `¿Eliminar a ${st.nombre}? Se eliminarán también sus calificaciones, asistencia y observaciones.`,
      onConfirm: () => {
        set((s) => ({
          ...s,
          students: s.students.filter((x) => x.id !== id),
          grades: s.grades.filter((g) => g.studentId !== id),
          attendance: s.attendance.filter((a) => a.studentId !== id),
          observations: s.observations.filter((o) => o.studentId !== id),
          measures: s.measures.filter((m) => m.studentId !== id),
          recoveries: s.recoveries.filter((r) => r.studentId !== id),
        }));
        notify("Alumno/a eliminado/a");
        setConfirmDialog(null);
      },
    });
  };

  /* ---------- resumen estadístico ---------- */
  const stats = useMemo(() => {
    const sinAsignar = d.subjects.filter((s) => !s.teacherId).length;
    const carga = d.teachers.map((t) => ({ t, n: d.subjects.filter((s) => s.teacherId === t.id).length }));
    return { sinAsignar, carga };
  }, [d]);

  return (
    <div>
      <SectionHead
        kicker="Administración del departamento"
        title="Configuración general"
        desc="Gestiona profesorado, materias y grupos. Asigna materias a cada profesor y controla la carga lectiva del departamento."
      />

      {/* resumen de carga lectiva */}
      <Reveal>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="card px-4 py-3.5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-virl text-vir"><Ic n="users" s={19} /></span>
            <div>
              <p className="font-display text-[26px] font-extrabold leading-none text-ink">{d.teachers.length}</p>
              <p className="mono text-[10px] uppercase tracking-widest text-ink3">profesorado</p>
            </div>
          </div>
          <div className="card px-4 py-3.5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-azul text-azu"><Ic n="layers" s={19} /></span>
            <div>
              <p className="font-display text-[26px] font-extrabold leading-none text-ink">{d.subjects.length}</p>
              <p className="mono text-[10px] uppercase tracking-widest text-ink3">materias</p>
            </div>
          </div>
          <div className={`card px-4 py-3.5 flex items-center gap-3 ${stats.sinAsignar > 0 ? "border-verm/40" : ""}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ambl text-amb"><Ic n="alert" s={19} /></span>
            <div>
              <p className="font-display text-[26px] font-extrabold leading-none text-ink">{stats.sinAsignar}</p>
              <p className="mono text-[10px] uppercase tracking-widest text-ink3">sin profesorado</p>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* ============ PROFESORADO ============ */}
        <Reveal>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="users" s={16} className="text-azu" /> Profesorado del departamento</p>
              <button className={btn + " !py-1.5"} onClick={() => setNuevoProf(true)}><Ic n="plus" s={14} /> Nuevo profesor</button>
            </div>
            <div className="divide-y divide-line/60">
              {d.teachers.map((t) => {
                const sus = d.subjects.filter((s) => s.teacherId === t.id);
                const grupos = d.groups.filter((gr) => gr.tutorId === t.id);
                const esActual = t.id === d.teacherId;
                return (
                  <div key={t.id} className="group flex items-center gap-3 px-4 py-3 transition hover:bg-virl/20">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white shadow-sm" style={{ background: t.color }}>
                      {t.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[14px] font-bold text-ink">{t.nombre}</span>
                        {esActual && <span className="mono rounded bg-virl px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-vird">sesión activa</span>}
                        <span className={`mono rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${t.rol === "admin" ? "bg-verml text-verm" : "bg-paper border border-line text-ink2"}`}>
                          {t.rol === "admin" ? "jefatura" : "docente"}
                        </span>
                      </p>
                      <p className="truncate text-[11.5px] text-ink3">{t.email}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        {sus.length === 0 ? (
                          <span className="mono text-[10px] font-bold text-ink3 italic">sin materias asignadas</span>
                        ) : (
                          sus.map((s) => (
                            <span key={s.id} className="inline-flex items-center gap-1 rounded-md border border-line bg-paper px-1.5 py-0.5 text-[10.5px] font-semibold text-ink2" title={`${s.nombre} · ${d.groups.find((g) => g.id === s.grupoId)?.nombre}`}>
                              <span className="h-1.5 w-1.5 rounded-sm" style={{ background: s.color }} />{s.corto}
                            </span>
                          ))
                        )}
                        {grupos.length > 0 && <span className="mono ml-1 text-[9.5px] text-ink3">· tutor de {grupos.map((g) => g.nombre).join(", ")}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-azul hover:text-azu" onClick={() => setAsignarMaterias(t)} title="Asignar materias">
                        <Ic n="link" s={15} />
                      </button>
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-virl hover:text-vird" onClick={() => setEditProf(t)} title="Editar">
                        <Ic n="edit" s={15} />
                      </button>
                      {!esActual && (
                        <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-verml hover:text-verm" onClick={() => eliminarProfesor(t.id)} title="Eliminar">
                          <Ic n="trash" s={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ============ MATERIAS ============ */}
        <Reveal delay={60}>
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
                  <div key={s.id} className="group flex items-center gap-3 px-4 py-3 transition hover:bg-virl/20">
                    <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-ink">{s.nombre} <span className="mono text-[10.5px] font-bold text-ink3">· {s.nivel}</span></p>
                      <p className="mono text-[10.5px] uppercase tracking-widest text-ink3">{s.etapa} · {cur.materia.split(" ")[0]} ({allCriterios(cur).length} criterios) · {grp?.nombre}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {t ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-paper border border-line px-2 py-0.5 text-[11px] font-semibold text-ink">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full text-[8.5px] font-extrabold text-white" style={{ background: t.color }}>{t.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                            {t.nombre}
                          </span>
                        ) : (
                          <button onClick={() => { setEditMateria(s); }} className="mono cursor-pointer rounded-md border border-dashed border-verm/50 bg-verml/40 px-2 py-0.5 text-[10.5px] font-bold text-verm transition hover:bg-verml">
                            + asignar profesorado
                          </button>
                        )}
                        <span className={`mono rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${s.tipo === "optativa" ? "bg-azul text-azu" : "bg-paper border border-line text-ink2"}`}>{s.tipo}</span>
                        {prog ? <EstadoBadge estado={prog.estado} /> : <span className="mono rounded-md bg-ambl px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amb">sin programar</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-virl hover:text-vird" onClick={() => setEditMateria(s)} title="Editar materia">
                        <Ic n="edit" s={15} />
                      </button>
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-verml hover:text-verm" onClick={() => eliminarMateria(s.id)} title="Eliminar materia">
                        <Ic n="trash" s={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ============ GRUPOS + CURSO ============ */}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Reveal delay={80}>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink"><Ic n="grid" s={16} className="text-amb" /> Grupos del departamento</p>
              <button className={btnGhost + " !py-1.5"} onClick={() => setNuevoGrupo(true)}><Ic n="plus" s={14} /> Nuevo grupo</button>
            </div>
            <div className="divide-y divide-line/60">
              {d.groups.map((gr) => {
                const tutor = d.teachers.find((t) => t.id === gr.tutorId);
                const nAlumnos = d.students.filter((s) => s.groupId === gr.id).length;
                const materias = d.subjects.filter((s) => s.grupoId === gr.id);
                return (
                  <div key={gr.id} className="group flex items-center gap-3 px-4 py-3 transition hover:bg-virl/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ambl text-amb font-display text-[15px] font-extrabold">
                      {gr.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[14px] font-extrabold text-ink">{gr.nombre}</p>
                      <p className="mono text-[10.5px] uppercase tracking-widest text-ink3">{gr.nivel} · {nAlumnos} alumnos · {materias.length} materias</p>
                      <p className="mt-0.5 text-[11.5px] text-ink2">Tutoría: <b className="text-ink">{tutor?.nombre ?? "—"}</b></p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-azul hover:text-azu"
                        onClick={() => setVerAlumnos(gr)}
                        title="Gestionar alumnos"
                      >
                        <Ic n="users" s={15} />
                      </button>
                      <button
                        className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-virl hover:text-vird"
                        onClick={() => setEditGroup(gr)}
                        title="Editar grupo"
                      >
                        <Ic n="edit" s={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
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

        <Reveal delay={120}>
          <DatosPanel reset={reset} notify={notify} d={d} setConfirmDialog={setConfirmDialog} />
          {/* carga lectiva */}
          <div className="card mt-4 p-4">
            <p className="lbl">Carga lectiva por profesor</p>
            <div className="space-y-2">
              {stats.carga.map(({ t, n }) => (
                <div key={t.id} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white" style={{ background: t.color }}>{t.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-ink">{t.nombre}</span>
                  <span className="mono shrink-0 rounded-md bg-paper border border-line px-1.5 py-0.5 text-[10.5px] font-bold text-ink2">{n} {n === 1 ? "materia" : "materias"}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ================================================================
          MODALES
          ================================================================ */}

      {/* Modal: nuevo / editar profesor */}
      <Modal open={nuevoProf || !!editProf} onClose={() => { setNuevoProf(false); setEditProf(null); }} title={editProf ? "Editar profesor/a" : "Nuevo profesor/a"}>
        {editProf ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="lbl">Nombre completo</label><input className="inp" value={editProf.nombre} onChange={(e) => setEditProf({ ...editProf, nombre: e.target.value })} /></div>
            <div><label className="lbl">Correo electrónico</label><input className="inp" value={editProf.email} onChange={(e) => setEditProf({ ...editProf, email: e.target.value })} /></div>
            <div>
              <label className="lbl">Rol</label>
              <select className="inp" value={editProf.rol} onChange={(e) => setEditProf({ ...editProf, rol: e.target.value as "profesor" | "admin" })}>
                <option value="profesor">Profesor/a</option>
                <option value="admin">Jefatura de departamento</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="lbl">Color identificativo</label>
              <div className="flex gap-1.5">
                {COLORES_PROF.map((col) => (
                  <button key={col} onClick={() => setEditProf({ ...editProf, color: col })} className={`h-8 w-8 cursor-pointer rounded-lg border-2 transition ${editProf.color === col ? "border-ink scale-110" : "border-transparent"}`} style={{ background: col }} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="lbl">Nombre completo</label><input className="inp" value={prof.nombre ?? ""} onChange={(e) => setProf({ ...prof, nombre: e.target.value })} placeholder="p. ej. Ana Martínez López" /></div>
            <div><label className="lbl">Correo electrónico</label><input className="inp" value={prof.email ?? ""} onChange={(e) => setProf({ ...prof, email: e.target.value })} placeholder="ana.martinez@iesatalaya.es" /></div>
            <div>
              <label className="lbl">Rol</label>
              <select className="inp" value={prof.rol} onChange={(e) => setProf({ ...prof, rol: e.target.value as "profesor" | "admin" })}>
                <option value="profesor">Profesor/a</option>
                <option value="admin">Jefatura de departamento</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="lbl">Color identificativo</label>
              <div className="flex gap-1.5">
                {COLORES_PROF.map((col) => (
                  <button key={col} onClick={() => setProf({ ...prof, color: col })} className={`h-8 w-8 cursor-pointer rounded-lg border-2 transition ${prof.color === col ? "border-ink scale-110" : "border-transparent"}`} style={{ background: col }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => { setNuevoProf(false); setEditProf(null); }}>Cancelar</button>
          {editProf
            ? <button className={btn} onClick={guardarProfesor}><Ic n="check" s={15} /> Guardar cambios</button>
            : <button className={btn} disabled={!prof.nombre?.trim()} onClick={crearProfesor}><Ic n="check" s={15} /> Añadir profesor</button>}
        </div>
      </Modal>

      {/* Modal: asignar materias a un profesor */}
      <Modal open={!!asignarMaterias} onClose={() => setAsignarMaterias(null)} title={asignarMaterias ? `Materias de ${asignarMaterias.nombre}` : ""} wide>
        {asignarMaterias && (() => {
          const asignadas = d.subjects.filter((s) => s.teacherId === asignarMaterias.id);
          const disponibles = d.subjects.filter((s) => s.teacherId !== asignarMaterias.id);
          return (
            <>
              <p className="mb-3 text-[12.5px] text-ink2">Marca las materias que imparte este profesor. Cada materia solo puede tener un profesor asignado: al marcarla, se retirará del profesor anterior.</p>
              {asignadas.length > 0 && (
                <div className="mb-3">
                  <p className="mono mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-vird">Asignadas actualmente ({asignadas.length})</p>
                  <div className="space-y-1">
                    {asignadas.map((s) => {
                      const grp = d.groups.find((g) => g.id === s.grupoId);
                      return (
                        <label key={s.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-vir/30 bg-virl/40 px-3 py-2 transition hover:bg-virl/60">
                          <input type="checkbox" checked onChange={() => toggleMateriaDeProfesor(s.id, asignarMaterias.id)} className="h-4 w-4 accent-[#0e7c66]" />
                          <span className="h-5 w-1 shrink-0 rounded-full" style={{ background: s.color }} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-bold text-ink">{s.nombre}</span>
                            <span className="mono text-[10px] uppercase tracking-widest text-ink3">{s.nivel} · {grp?.nombre}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <p className="mono mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-ink3">Otras materias disponibles ({disponibles.length})</p>
                <div className="space-y-1">
                  {disponibles.map((s) => {
                    const grp = d.groups.find((g) => g.id === s.grupoId);
                    const otro = d.teachers.find((t) => t.id === s.teacherId);
                    return (
                      <label key={s.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-card px-3 py-2 transition hover:border-azu hover:bg-azul/30">
                        <input type="checkbox" checked={false} onChange={() => toggleMateriaDeProfesor(s.id, asignarMaterias.id)} className="h-4 w-4 accent-[#2c6e8f]" />
                        <span className="h-5 w-1 shrink-0 rounded-full" style={{ background: s.color }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold text-ink">{s.nombre}</span>
                          <span className="mono text-[10px] uppercase tracking-widest text-ink3">{s.nivel} · {grp?.nombre}{otro && <> · <span className="text-ink2">actual: {otro.nombre}</span></>}</span>
                        </span>
                      </label>
                    );
                  })}
                  {disponibles.length === 0 && <p className="text-[12px] italic text-ink3">No hay más materias disponibles.</p>}
                </div>
              </div>
            </>
          );
        })()}
        <div className="mt-4 flex justify-end">
          <button className={btnGhost} onClick={() => setAsignarMaterias(null)}>Cerrar</button>
        </div>
      </Modal>

      {/* Modal: nueva / editar materia */}
      <Modal open={nuevaMateria || !!editMateria} onClose={() => { setNuevaMateria(false); setEditMateria(null); }} title={editMateria ? "Editar materia" : "Nueva materia / optativa"} wide>
        {editMateria ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="lbl">Nombre</label><input className="inp" value={editMateria.nombre} onChange={(e) => setEditMateria({ ...editMateria, nombre: e.target.value })} /></div>
            <div><label className="lbl">Nombre corto</label><input className="inp" value={editMateria.corto} onChange={(e) => setEditMateria({ ...editMateria, corto: e.target.value })} /></div>
            <div>
              <label className="lbl">Etapa</label>
              <select className="inp" value={editMateria.etapa} onChange={(e) => setEditMateria({ ...editMateria, etapa: e.target.value })}><option>ESO</option><option>Bachillerato</option></select>
            </div>
            <div><label className="lbl">Nivel</label><input className="inp" value={editMateria.nivel} onChange={(e) => setEditMateria({ ...editMateria, nivel: e.target.value })} /></div>
            <div>
              <label className="lbl">Currículo LOMLOE</label>
              <select className="inp" value={editMateria.curriculumId} onChange={(e) => setEditMateria({ ...editMateria, curriculumId: e.target.value })}>
                {Object.values(CURRICULA).map((c) => <option key={c.id} value={c.id}>{c.materia}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Tipo</label>
              <select className="inp" value={editMateria.tipo} onChange={(e) => setEditMateria({ ...editMateria, tipo: e.target.value as "obligatoria" | "optativa" })}><option value="obligatoria">Obligatoria</option><option value="optativa">Optativa</option></select>
            </div>
            <div>
              <label className="lbl">Grupo</label>
              <select className="inp" value={editMateria.grupoId} onChange={(e) => setEditMateria({ ...editMateria, grupoId: e.target.value })}>
                {d.groups.map((gr) => <option key={gr.id} value={gr.id}>{gr.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Profesorado asignado</label>
              <select className="inp" value={editMateria.teacherId ?? ""} onChange={(e) => setEditMateria({ ...editMateria, teacherId: e.target.value || undefined })}>
                <option value="">Sin asignar</option>
                {d.teachers.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="lbl">Color identificador</label>
              <div className="flex gap-1.5">
                {["#d9532c", "#0e7c66", "#2c6e8f", "#c98a12", "#a84a6c", "#7a5fb0", "#5b6b8f"].map((col) => (
                  <button key={col} onClick={() => setEditMateria({ ...editMateria, color: col })} className={`h-8 w-8 cursor-pointer rounded-lg border-2 transition ${editMateria.color === col ? "border-ink scale-110" : "border-transparent"}`} style={{ background: col }} />
                ))}
              </div>
            </div>
          </div>
        ) : (
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
                  <button key={col} onClick={() => setM({ ...m, color: col })} className={`h-8 w-8 cursor-pointer rounded-lg border-2 transition ${m.color === col ? "border-ink scale-110" : "border-transparent"}`} style={{ background: col }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {!editMateria && <p className="mt-3 rounded-lg bg-virl px-3 py-2 text-[12px] font-semibold text-vird">Al crear la materia, su currículo completo (competencias, criterios y saberes) queda disponible para programar y evaluar de inmediato.</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => { setNuevaMateria(false); setEditMateria(null); }}>Cancelar</button>
          {editMateria
            ? <button className={btn} disabled={!editMateria.nombre.trim() || !editMateria.grupoId} onClick={guardarMateria}><Ic n="check" s={15} /> Guardar cambios</button>
            : <button className={btn} disabled={!m.nombre?.trim() || !m.grupoId} onClick={crearMateria}><Ic n="check" s={15} /> Crear materia</button>}
        </div>
      </Modal>

      {/* Modal: nuevo grupo */}
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

      {/* Modal: editar grupo */}
      <Modal open={!!editGroup} onClose={() => setEditGroup(null)} title="Editar grupo">
        {editGroup && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="lbl">Nombre</label><input className="inp" value={editGroup.nombre} onChange={(e) => setEditGroup({ ...editGroup, nombre: e.target.value })} /></div>
            <div><label className="lbl">Nivel</label><input className="inp" value={editGroup.nivel} onChange={(e) => setEditGroup({ ...editGroup, nivel: e.target.value })} /></div>
            <div>
              <label className="lbl">Tutoría</label>
              <select className="inp" value={editGroup.tutorId} onChange={(e) => setEditGroup({ ...editGroup, tutorId: e.target.value })}>
                {d.teachers.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Días de clase</label>
              <div className="flex gap-1">
                {["L", "M", "X", "J", "V"].map((dd, i) => {
                  const on = editGroup.dias.includes(i + 1);
                  return <button key={dd} onClick={() => setEditGroup({ ...editGroup, dias: on ? editGroup.dias.filter((x) => x !== i + 1) : [...editGroup.dias, i + 1] })} className={`mono h-9 w-9 cursor-pointer rounded-lg border text-[12px] font-extrabold transition ${on ? "border-vir bg-vir text-white" : "border-line2 bg-card text-ink2"}`}>{dd}</button>;
                })}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setEditGroup(null)}>Cancelar</button>
          <button className={btn} disabled={!editGroup?.nombre.trim()} onClick={guardarGrupo}><Ic n="check" s={15} /> Guardar cambios</button>
        </div>
      </Modal>

      {/* Modal: ver/gestionar alumnos de un grupo */}
      <Modal open={!!verAlumnos} onClose={() => { setVerAlumnos(null); setNuevoAlumno(false); setEditAlumno(null); }} title={verAlumnos ? `Alumnos de ${verAlumnos.nombre}` : ""} wide>
        {verAlumnos && (() => {
          const alumnos = d.students.filter((s) => s.groupId === verAlumnos.id);
          return (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12.5px] text-ink2">{alumnos.length} {alumnos.length === 1 ? "alumno matriculado" : "alumnos matriculados"}</p>
                <button className={btn + " !py-1.5"} onClick={() => setNuevoAlumno(true)}><Ic n="plus" s={14} /> Nuevo alumno</button>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-line/60 rounded-lg border border-line">
                {alumnos.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[13px] italic text-ink3">No hay alumnos matriculados en este grupo.</p>
                  </div>
                )}
                {alumnos.map((st) => (
                  <div key={st.id} className="group flex items-center gap-3 px-4 py-2.5 transition hover:bg-virl/20">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white" style={{ background: `hsl(${st.hue} 42% 44%)` }}>
                      {st.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-ink">{st.nombre}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {st.neae && <span className="mono rounded bg-rosl px-1.5 py-0.5 text-[9px] font-bold text-ros">NEAE</span>}
                        <span className="mono text-[10px] text-ink3">base: {st.base.toFixed(1)} · abs: {(st.absRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-virl hover:text-vird" onClick={() => setEditAlumno(st)} title="Editar">
                        <Ic n="edit" s={14} />
                      </button>
                      <button className="cursor-pointer rounded-md p-1.5 text-ink3 transition hover:bg-verml hover:text-verm" onClick={() => eliminarAlumno(st.id)} title="Eliminar">
                        <Ic n="trash" s={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
        <div className="mt-4 flex justify-end">
          <button className={btnGhost} onClick={() => { setVerAlumnos(null); setNuevoAlumno(false); setEditAlumno(null); }}>Cerrar</button>
        </div>
      </Modal>

      {/* Modal: nuevo alumno */}
      <Modal open={nuevoAlumno} onClose={() => { setNuevoAlumno(false); setAlumno({ base: 6.5, absRate: 0.05, hue: Math.floor(Math.random() * 360) }); }} title="Nuevo alumno/a">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="lbl">Nombre completo</label>
            <input className="inp" value={alumno.nombre ?? ""} onChange={(e) => setAlumno({ ...alumno, nombre: e.target.value })} placeholder="p. ej. María García López" />
          </div>
          <div>
            <label className="lbl">Nivel base estimado (0-10)</label>
            <input type="number" min={0} max={10} step={0.1} className="inp" value={alumno.base ?? 6.5} onChange={(e) => setAlumno({ ...alumno, base: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="lbl">Tasa de absentismo estimada</label>
            <input type="number" min={0} max={1} step={0.01} className="inp" value={alumno.absRate ?? 0.05} onChange={(e) => setAlumno({ ...alumno, absRate: parseFloat(e.target.value) || 0 })} />
            <p className="mono mt-1 text-[9.5px] text-ink3">{((alumno.absRate ?? 0) * 100).toFixed(0)}% de absentismo</p>
          </div>
          <div className="sm:col-span-2">
            <label className="lbl">NEAE (opcional)</label>
            <input className="inp" value={alumno.neae ?? ""} onChange={(e) => setAlumno({ ...alumno, neae: e.target.value })} placeholder="p. ej. TDAH, Dislexia, TEA…" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => { setNuevoAlumno(false); setAlumno({ base: 6.5, absRate: 0.05, hue: Math.floor(Math.random() * 360) }); }}>Cancelar</button>
          <button className={btn} disabled={!alumno.nombre?.trim()} onClick={crearAlumno}><Ic n="check" s={15} /> Añadir alumno</button>
        </div>
      </Modal>

      {/* Modal: editar alumno */}
      <Modal open={!!editAlumno} onClose={() => setEditAlumno(null)} title="Editar alumno/a">
        {editAlumno && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="lbl">Nombre completo</label>
              <input className="inp" value={editAlumno.nombre} onChange={(e) => setEditAlumno({ ...editAlumno, nombre: e.target.value })} />
            </div>
            <div>
              <label className="lbl">Nivel base estimado (0-10)</label>
              <input type="number" min={0} max={10} step={0.1} className="inp" value={editAlumno.base} onChange={(e) => setEditAlumno({ ...editAlumno, base: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="lbl">Tasa de absentismo</label>
              <input type="number" min={0} max={1} step={0.01} className="inp" value={editAlumno.absRate} onChange={(e) => setEditAlumno({ ...editAlumno, absRate: parseFloat(e.target.value) || 0 })} />
              <p className="mono mt-1 text-[9.5px] text-ink3">{(editAlumno.absRate * 100).toFixed(0)}% de absentismo</p>
            </div>
            <div className="sm:col-span-2">
              <label className="lbl">NEAE (opcional)</label>
              <input className="inp" value={editAlumno.neae ?? ""} onChange={(e) => setEditAlumno({ ...editAlumno, neae: e.target.value || undefined })} placeholder="p. ej. TDAH, Dislexia, TEA…" />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setEditAlumno(null)}>Cancelar</button>
          <button className={btn} disabled={!editAlumno?.nombre.trim()} onClick={guardarAlumno}><Ic n="check" s={15} /> Guardar cambios</button>
        </div>
      </Modal>

      {/* Modal de confirmación */}
      <Modal open={!!confirmDialog} onClose={() => setConfirmDialog(null)} title="Confirmar acción">
        <div className="py-4">
          <p className="text-[14px] leading-relaxed text-ink">{confirmDialog?.message}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setConfirmDialog(null)}>Cancelar</button>
          <button className={btnDanger} onClick={confirmDialog?.onConfirm}>
            <Ic n="trash" s={14} /> Confirmar eliminación
          </button>
        </div>
      </Modal>
    </div>
  );
}

function DatosPanel({ reset, notify, d, setConfirmDialog }: { reset: () => void; notify: (m: string) => void; d: ReturnType<typeof useApp>["d"]; setConfirmDialog: (dialog: { message: string; onConfirm: () => void } | null) => void }) {
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
        <button className={btnDanger} onClick={() => {
          setConfirmDialog({
            message: "¿Restaurar los datos de demostración? Se perderán los cambios locales.",
            onConfirm: () => {
              reset();
              notify("Datos de demostración restaurados");
              setConfirmDialog(null);
            },
          });
        }}>
          <Ic n="refresh" s={14} /> Restaurar demo
        </button>
      </div>
    </div>
  );
}
