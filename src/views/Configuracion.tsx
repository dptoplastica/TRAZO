import { useState } from "react";
import { useApp, uid, visibleSubjects } from "../store";
import { Ic, Reveal, SectionHead, Modal, btn, btnGhost, btnDanger } from "../components/ui";

export default function Configuracion() {
  const { d, set, notify, isAdmin, reset } = useApp();
  const [showNewSubject, setShowNewSubject] = useState(false);
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
    if (confirm("¿Estás seguro de que quieres eliminar esta materia? Se eliminarán también todas las programaciones asociadas.")) {
      set(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== subjectId),
        programaciones: prev.programaciones.filter(p => p.subjectId !== subjectId)
      }));
      notify("Materia eliminada");
    }
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
