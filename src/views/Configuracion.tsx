import { useState } from "react";
import { useApp, uid, visibleSubjects } from "../store";
import { Ic, Reveal, SectionHead, Modal, btn, btnGhost, btnDanger } from "../components/ui";

export default function Configuracion() {
  const { d, set, notify, isAdmin, reset } = useApp();

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
            <div className="border-b border-line px-4 py-3"><p className="text-[13.5px] font-bold text-ink">Materias</p></div>
            <div className="divide-y divide-line/60">
              {d.subjects.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-ink">{s.nombre}</p>
                    <p className="mono text-[10.5px] text-ink3">{s.nivel} · {d.groups.find((g) => g.id === s.grupoId)?.nombre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
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
