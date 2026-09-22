import { useState } from "react";
import { useApp, uid, visibleSubjects } from "../store";
import { Ic, Reveal, SectionHead, Modal, btn, btnGhost, btnDanger } from "../components/ui";

export default function Configuracion() {
  const { d, set, notify, isAdmin, reset } = useApp();
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [showNewStudent, setShowNewStudent] = useState(false);
  const [showDeleteStudentConfirm, setShowDeleteStudentConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState<string | null>(null);
  
  const [newSubject, setNewSubject] = useState<{
    nombre: string;
    corto: string;
    etapa: string;
    nivel: string;
    curriculumId: string;
    grupoId: string;
    color: string;
    tipo: "obligatoria" | "optativa";
  }>({
    nombre: "",
    corto: "",
    etapa: "Bachillerato",
    nivel: "1º Bachillerato",
    curriculumId: "dt1-bach",
    grupoId: d.groups[0]?.id || "",
    color: "#0e7c66",
    tipo: "obligatoria"
  });

  const [newGroup, setNewGroup] = useState<{
    nombre: string;
    nivel: string;
    tutorId: string;
    dias: number[];
  }>({
    nombre: "",
    nivel: "1º Bachillerato",
    tutorId: d.teachers[0]?.id || "",
    dias: [1, 3]
  });

  const [newStudent, setNewStudent] = useState<{
    nombre: string;
    groupId: string;
    base: number;
    neae?: string;
    absRate: number;
  }>({
    nombre: "",
    groupId: d.groups[0]?.id || "",
    base: 6.5,
    neae: "",
    absRate: 0.05
  });

  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupData, setEditGroupData] = useState<{
    nombre: string;
    nivel: string;
    tutorId: string;
    dias: number[];
  }>({
    nombre: "",
    nivel: "1º Bachillerato",
    tutorId: "",
    dias: []
  });

  if (!isAdmin) {
    return (
      <div>
        <SectionHead kicker="Preferencias" title="Configuración" desc="Con perfil de profesorado solo puedes consultar tus datos." />
        <div className="card p-5">
          <p className="lbl">Tu perfil</p>
          <p className="font-display text-[18px] font-extrabold text-ink">{d.teachers.find((t) => t.id === d.teacherId)?.nombre}</p>
          <p className="text-[12.5px] text-ink2 mt-2">La gestión corresponde a la jefatura de departamento.</p>
        </div>
      </div>
    );
  }

  const exportar = () => {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `trazo-${d.cursoLabel}.json`; a.click();
    URL.revokeObjectURL(url); notify("Exportado");
  };

  const handleAddSubject = () => {
    if (!newSubject.nombre || !newSubject.corto) {
      notify("Nombre y código corto son obligatorios");
      return;
    }
    
    const subject = {
      id: uid(),
      ...newSubject
    };
    
    set(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));
    setShowNewSubject(false);
    setNewSubject({
      nombre: "",
      corto: "",
      etapa: "Bachillerato",
      nivel: "1º Bachillerato",
      curriculumId: "dt1-bach",
      grupoId: d.groups[0]?.id || "",
      color: "#0e7c66",
      tipo: "obligatoria"
    });
    notify("Materia añadida correctamente");
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      set(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== subjectToDelete),
        programaciones: prev.programaciones.filter(p => p.subjectId !== subjectToDelete)
      }));
      notify("Materia eliminada correctamente");
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
    }
  };

  // Gestión de Grupos
  const handleAddGroup = () => {
    if (!newGroup.nombre) {
      notify("El nombre del grupo es obligatorio");
      return;
    }
    
    const group = {
      id: uid(),
      ...newGroup
    };
    
    set(prev => ({ ...prev, groups: [...prev.groups, group] }));
    setShowNewGroup(false);
    setNewGroup({
      nombre: "",
      nivel: "1º Bachillerato",
      tutorId: d.teachers[0]?.id || "",
      dias: [1, 3]
    });
    notify("Grupo añadido correctamente");
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setShowDeleteGroupConfirm(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      set(prev => ({
        ...prev,
        groups: prev.groups.filter(g => g.id !== groupToDelete),
        students: prev.students.filter(s => s.groupId !== groupToDelete),
        subjects: prev.subjects.filter(s => s.grupoId !== groupToDelete)
      }));
      notify("Grupo eliminado correctamente");
      setShowDeleteGroupConfirm(false);
      setGroupToDelete(null);
    }
  };

  // Gestión de Alumnos
  const handleAddStudent = () => {
    if (!newStudent.nombre) {
      notify("El nombre del alumno es obligatorio");
      return;
    }
    
    const student = {
      id: uid(),
      ...newStudent,
      neae: newStudent.neae || undefined,
      hue: Math.floor(Math.random() * 360)
    };
    
    set(prev => ({ ...prev, students: [...prev.students, student] }));
    setShowNewStudent(false);
    setNewStudent({
      nombre: "",
      groupId: d.groups[0]?.id || "",
      base: 6.5,
      neae: "",
      absRate: 0.05
    });
    notify("Alumno añadido correctamente");
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentToDelete(studentId);
    setShowDeleteStudentConfirm(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      set(prev => ({
        ...prev,
        students: prev.students.filter(s => s.id !== studentToDelete),
        grades: prev.grades.filter(g => g.studentId !== studentToDelete),
        attendance: prev.attendance.filter(a => a.studentId !== studentToDelete),
        observations: prev.observations.filter(o => o.studentId !== studentToDelete)
      }));
      notify("Alumno eliminado correctamente");
      setShowDeleteStudentConfirm(false);
      setStudentToDelete(null);
    }
  };

  const updateStudentGroup = (studentId: string, newGroupId: string) => {
    set(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, groupId: newGroupId } : s)
    }));
    notify("Grupo del alumno actualizado");
  };

  // Funciones para editar grupos
  const handleEditGroup = (groupId: string) => {
    const group = d.groups.find(g => g.id === groupId);
    if (group) {
      setEditingGroup(groupId);
      setEditGroupData({
        nombre: group.nombre,
        nivel: group.nivel,
        tutorId: group.tutorId,
        dias: group.dias
      });
    }
  };

  const handleSaveGroup = () => {
    if (!editGroupData.nombre) {
      notify("El nombre del grupo es obligatorio");
      return;
    }

    set(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === editingGroup 
          ? { ...g, ...editGroupData }
          : g
      )
    }));

    notify("Grupo actualizado correctamente");
    setEditingGroup(null);
    setEditGroupData({
      nombre: "",
      nivel: "1º Bachillerato",
      tutorId: "",
      dias: []
    });
  };

  const handleCancelEditGroup = () => {
    setEditingGroup(null);
    setEditGroupData({
      nombre: "",
      nivel: "1º Bachillerato",
      tutorId: "",
      dias: []
    });
  };

  return (
    <div>
      <SectionHead kicker="Administración" title="Configuración general" desc="Gestiona profesorado, materias y grupos del departamento." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Reveal>
          <div className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3"><p className="text-[13.5px] font-bold text-ink">Profesorado</p></div>
            <div className="divide-y divide-line/60">
              {d.teachers.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white" style={{ background: t.color }}>{t.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-ink">{t.nombre}</p>
                    <p className="text-[11.5px] text-ink3">{t.email} · {t.rol === "admin" ? "Jefatura" : "Docente"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3 flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-ink">Materias</p>
              <button className={btn} onClick={() => setShowNewSubject(true)}>
                <Ic n="plus" s={14} /> Nueva materia
              </button>
            </div>
            <div className="divide-y divide-line/60">
              {d.subjects.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-ink">{s.nombre}</p>
                    <p className="mono text-[10.5px] text-ink3">{s.corto} · {s.nivel} · {d.groups.find((g) => g.id === s.grupoId)?.nombre}</p>
                  </div>
                  <button 
                    className="text-verm hover:text-verm-d hover:bg-verm-l p-2 rounded transition-colors"
                    onClick={() => handleDeleteSubject(s.id)}
                    title="Eliminar materia"
                  >
                    <Ic n="trash" s={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Gestión de Grupos */}
        <Reveal delay={120}>
          <div className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3 flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-ink">Grupos</p>
              <button className={btn} onClick={() => setShowNewGroup(true)}>
                <Ic n="plus" s={14} /> Nuevo grupo
              </button>
            </div>
            <div className="divide-y divide-line/60">
              {d.groups.map((g) => {
                const studentCount = d.students.filter(s => s.groupId === g.id).length;
                const tutor = d.teachers.find(t => t.id === g.tutorId);
                return (
                  <div key={g.id} className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-bold text-ink">{g.nombre}</p>
                        <p className="mono text-[10.5px] text-ink3">
                          {g.nivel} · {studentCount} alumnos · Tutor: {tutor?.nombre || "Sin asignar"}
                        </p>
                      </div>
                      <button 
                        className="text-azu hover:bg-azul p-2 rounded transition-colors"
                        onClick={() => setSelectedGroupForStudents(selectedGroupForStudents === g.id ? null : g.id)}
                        title="Ver alumnos"
                      >
                        <Ic n="users" s={16} />
                      </button>
                      <button 
                        className="text-vir hover:bg-vir-l p-2 rounded transition-colors"
                        onClick={() => handleEditGroup(g.id)}
                        title="Editar grupo"
                      >
                        <Ic n="edit" s={16} />
                      </button>
                      <button 
                        className="text-verm hover:text-verm-d hover:bg-verm-l p-2 rounded transition-colors"
                        onClick={() => handleDeleteGroup(g.id)}
                        title="Eliminar grupo"
                      >
                        <Ic n="trash" s={16} />
                      </button>
                    </div>
                    
                    {/* Lista de alumnos del grupo */}
                    {selectedGroupForStudents === g.id && (
                      <div className="mt-3 border-t border-line pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[12px] font-bold text-ink2">Alumnos del grupo</p>
                          <button 
                            className="text-vir hover:bg-vir-l text-[11px] font-bold px-2 py-1 rounded transition-colors"
                            onClick={() => {
                              setNewStudent({ ...newStudent, groupId: g.id });
                              setShowNewStudent(true);
                            }}
                          >
                            <Ic n="plus" s={12} /> Añadir alumno
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-60 overflow-y-auto">
                          {d.students.filter(s => s.groupId === g.id).map((s) => (
                            <div key={s.id} className="flex items-center gap-2 bg-paper rounded px-2 py-1.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white" style={{ background: `hsl(${s.hue} 42% 44%)` }}>
                                {s.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                              </span>
                              <span className="flex-1 text-[12px] font-semibold text-ink">{s.nombre}</span>
                              {s.neae && <span className="text-[9px] bg-rosl text-ros px-1.5 py-0.5 rounded font-bold">NEAE</span>}
                              <button 
                                className="text-verm hover:bg-verm-l p-1 rounded transition-colors"
                                onClick={() => handleDeleteStudent(s.id)}
                                title="Eliminar alumno"
                              >
                                <Ic n="trash" s={12} />
                              </button>
                            </div>
                          ))}
                          {d.students.filter(s => s.groupId === g.id).length === 0 && (
                            <p className="text-[11px] text-ink3 italic text-center py-2">No hay alumnos en este grupo</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Modal open={showNewSubject} onClose={() => setShowNewSubject(false)} title="Nueva materia">
          <div className="space-y-4">
            <div>
              <label className="lbl">Nombre completo</label>
              <input
                type="text"
                className="inp"
                value={newSubject.nombre}
                onChange={(e) => setNewSubject({ ...newSubject, nombre: e.target.value })}
                placeholder="Ej: Dibujo Técnico I"
              />
            </div>
            <div>
              <label className="lbl">Código corto</label>
              <input
                type="text"
                className="inp"
                value={newSubject.corto}
                onChange={(e) => setNewSubject({ ...newSubject, corto: e.target.value })}
                placeholder="Ej: DT1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">Etapa</label>
                <select
                  className="inp"
                  value={newSubject.etapa}
                  onChange={(e) => setNewSubject({ ...newSubject, etapa: e.target.value })}
                >
                  <option value="ESO">ESO</option>
                  <option value="Bachillerato">Bachillerato</option>
                </select>
              </div>
              <div>
                <label className="lbl">Nivel</label>
                <select
                  className="inp"
                  value={newSubject.nivel}
                  onChange={(e) => setNewSubject({ ...newSubject, nivel: e.target.value })}
                >
                  <option value="1º ESO">1º ESO</option>
                  <option value="2º ESO">2º ESO</option>
                  <option value="3º ESO">3º ESO</option>
                  <option value="4º ESO">4º ESO</option>
                  <option value="1º Bachillerato">1º Bachillerato</option>
                  <option value="2º Bachillerato">2º Bachillerato</option>
                </select>
              </div>
            </div>
            <div>
              <label className="lbl">Currículo</label>
              <select
                className="inp"
                value={newSubject.curriculumId}
                onChange={(e) => setNewSubject({ ...newSubject, curriculumId: e.target.value })}
              >
                <option value="dt1-bach">Dibujo Técnico I</option>
                <option value="dt2-bach">Dibujo Técnico II</option>
                <option value="epva-eso">EPVA ESO</option>
                <option value="ea-bach">Expresión Artística</option>
                <option value="tp-bach">Taller de Podcast</option>
                <option value="tc-bach">Taller de Cortometraje</option>
              </select>
            </div>
            <div>
              <label className="lbl">Grupo asignado</label>
              <select
                className="inp"
                value={newSubject.grupoId}
                onChange={(e) => setNewSubject({ ...newSubject, grupoId: e.target.value })}
              >
                {d.groups.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Tipo</label>
              <select
                className="inp"
                value={newSubject.tipo}
                onChange={(e) => setNewSubject({ ...newSubject, tipo: e.target.value as "obligatoria" | "optativa" })}
              >
                <option value="obligatoria">Obligatoria</option>
                <option value="optativa">Optativa</option>
              </select>
            </div>
            <div>
              <label className="lbl">Color</label>
              <input
                type="color"
                className="inp h-10"
                value={newSubject.color}
                onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowNewSubject(false)}>Cancelar</button>
              <button className={btn} onClick={handleAddSubject}>Crear materia</button>
            </div>
          </div>
        </Modal>

        <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar eliminación">
          <div className="space-y-4">
            <p className="text-ink2">
              ¿Estás seguro de que quieres eliminar esta materia?
            </p>
            <p className="text-verm font-semibold">
              ⚠️ Se eliminarán también todas las programaciones, situaciones de aprendizaje y calificaciones asociadas.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className={btnDanger} onClick={confirmDelete}>
                <Ic n="trash" s={14} /> Eliminar materia
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal Nuevo Grupo */}
        <Modal open={showNewGroup} onClose={() => setShowNewGroup(false)} title="Nuevo grupo">
          <div className="space-y-4">
            <div>
              <label className="lbl">Nombre del grupo</label>
              <input
                type="text"
                className="inp"
                value={newGroup.nombre}
                onChange={(e) => setNewGroup({ ...newGroup, nombre: e.target.value })}
                placeholder="Ej: 1º Bach A"
              />
            </div>
            <div>
              <label className="lbl">Nivel</label>
              <select
                className="inp"
                value={newGroup.nivel}
                onChange={(e) => setNewGroup({ ...newGroup, nivel: e.target.value })}
              >
                <option value="1º ESO">1º ESO</option>
                <option value="2º ESO">2º ESO</option>
                <option value="3º ESO">3º ESO</option>
                <option value="4º ESO">4º ESO</option>
                <option value="1º Bachillerato">1º Bachillerato</option>
                <option value="2º Bachillerato">2º Bachillerato</option>
              </select>
            </div>
            <div>
              <label className="lbl">Tutor/a</label>
              <select
                className="inp"
                value={newGroup.tutorId}
                onChange={(e) => setNewGroup({ ...newGroup, tutorId: e.target.value })}
              >
                {d.teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Días de clase</label>
              <div className="flex flex-wrap gap-2">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`px-3 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      newGroup.dias.includes(idx + 1)
                        ? "bg-vir text-white"
                        : "bg-paper text-ink2 hover:bg-line"
                    }`}
                    onClick={() => {
                      const newDias = newGroup.dias.includes(idx + 1)
                        ? newGroup.dias.filter(d => d !== idx + 1)
                        : [...newGroup.dias, idx + 1].sort();
                      setNewGroup({ ...newGroup, dias: newDias });
                    }}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowNewGroup(false)}>Cancelar</button>
              <button className={btn} onClick={handleAddGroup}>Crear grupo</button>
            </div>
          </div>
        </Modal>

        {/* Modal Confirmar Eliminación Grupo */}
        <Modal open={showDeleteGroupConfirm} onClose={() => setShowDeleteGroupConfirm(false)} title="Confirmar eliminación">
          <div className="space-y-4">
            <p className="text-ink2">
              ¿Estás seguro de que quieres eliminar este grupo?
            </p>
            <p className="text-verm font-semibold">
              ⚠️ Se eliminarán también todos los alumnos, materias y datos asociados a este grupo.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowDeleteGroupConfirm(false)}>
                Cancelar
              </button>
              <button className={btnDanger} onClick={confirmDeleteGroup}>
                <Ic n="trash" s={14} /> Eliminar grupo
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal Editar Grupo */}
        <Modal open={editingGroup !== null} onClose={handleCancelEditGroup} title="Editar grupo">
          <div className="space-y-4">
            <div>
              <label className="lbl">Nombre del grupo</label>
              <input
                type="text"
                className="inp"
                value={editGroupData.nombre}
                onChange={(e) => setEditGroupData({ ...editGroupData, nombre: e.target.value })}
                placeholder="Ej: 1º Bach A"
              />
            </div>
            <div>
              <label className="lbl">Nivel</label>
              <select
                className="inp"
                value={editGroupData.nivel}
                onChange={(e) => setEditGroupData({ ...editGroupData, nivel: e.target.value })}
              >
                <option value="1º ESO">1º ESO</option>
                <option value="2º ESO">2º ESO</option>
                <option value="3º ESO">3º ESO</option>
                <option value="4º ESO">4º ESO</option>
                <option value="1º Bachillerato">1º Bachillerato</option>
                <option value="2º Bachillerato">2º Bachillerato</option>
              </select>
            </div>
            <div>
              <label className="lbl">Tutor/a</label>
              <select
                className="inp"
                value={editGroupData.tutorId}
                onChange={(e) => setEditGroupData({ ...editGroupData, tutorId: e.target.value })}
              >
                {d.teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Días de clase</label>
              <div className="flex flex-wrap gap-2">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`px-3 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      editGroupData.dias.includes(idx + 1)
                        ? "bg-vir text-white"
                        : "bg-paper text-ink2 hover:bg-line"
                    }`}
                    onClick={() => {
                      const newDias = editGroupData.dias.includes(idx + 1)
                        ? editGroupData.dias.filter(d => d !== idx + 1)
                        : [...editGroupData.dias, idx + 1].sort();
                      setEditGroupData({ ...editGroupData, dias: newDias });
                    }}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={handleCancelEditGroup}>Cancelar</button>
              <button className={btn} onClick={handleSaveGroup}>Guardar cambios</button>
            </div>
          </div>
        </Modal>

        {/* Modal Nuevo Alumno */}
        <Modal open={showNewStudent} onClose={() => setShowNewStudent(false)} title="Nuevo alumno">
          <div className="space-y-4">
            <div>
              <label className="lbl">Nombre completo</label>
              <input
                type="text"
                className="inp"
                value={newStudent.nombre}
                onChange={(e) => setNewStudent({ ...newStudent, nombre: e.target.value })}
                placeholder="Ej: María García López"
              />
            </div>
            <div>
              <label className="lbl">Grupo</label>
              <select
                className="inp"
                value={newStudent.groupId}
                onChange={(e) => setNewStudent({ ...newStudent, groupId: e.target.value })}
              >
                {d.groups.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Necesidades Específicas (NEAE) - Opcional</label>
              <input
                type="text"
                className="inp"
                value={newStudent.neae}
                onChange={(e) => setNewStudent({ ...newStudent, neae: e.target.value })}
                placeholder="Ej: Dislexia, TDAH, etc. (dejar vacío si no aplica)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">Nivel base estimado</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="inp"
                  value={newStudent.base}
                  onChange={(e) => setNewStudent({ ...newStudent, base: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="lbl">Tasa de absentismo</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="inp"
                  value={newStudent.absRate}
                  onChange={(e) => setNewStudent({ ...newStudent, absRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowNewStudent(false)}>Cancelar</button>
              <button className={btn} onClick={handleAddStudent}>Crear alumno</button>
            </div>
          </div>
        </Modal>

        {/* Modal Confirmar Eliminación Alumno */}
        <Modal open={showDeleteStudentConfirm} onClose={() => setShowDeleteStudentConfirm(false)} title="Confirmar eliminación">
          <div className="space-y-4">
            <p className="text-ink2">
              ¿Estás seguro de que quieres eliminar este alumno?
            </p>
            <p className="text-verm font-semibold">
              ⚠️ Se eliminarán también todas las calificaciones, asistencia y observaciones asociadas.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setShowDeleteStudentConfirm(false)}>
                Cancelar
              </button>
              <button className={btnDanger} onClick={confirmDeleteStudent}>
                <Ic n="trash" s={14} /> Eliminar alumno
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="mt-4 card p-4">
        <p className="lbl">Datos de la aplicación</p>
        <p className="text-[12.5px] text-ink2 mb-3">Todo se guarda localmente en el navegador.</p>
        <div className="flex flex-wrap gap-2">
          <button className={btnGhost} onClick={exportar}><Ic n="download" s={15} /> Exportar JSON</button>
          <button className={btnDanger} onClick={() => { if (confirm("¿Restaurar datos?")) { reset(); notify("Datos restaurados"); } }}><Ic n="refresh" s={14} /> Restaurar demo</button>
        </div>
      </div>
    </div>
  );
}
