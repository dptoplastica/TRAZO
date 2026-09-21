import { useState } from "react";
import { useApp, visibleProgramaciones, studentsOf, finalGrade, notaDeEva, fmt, nivelDe } from "../store";
import { SectionHead, EmptyState, btn, btnGhost, Ic, Reveal } from "../components/ui";

export default function Informes() {
  const { d, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const groups = d.groups.filter((g) => progs.some((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === g.id));
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const group = d.groups.find((g) => g.id === groupId) ?? groups[0];
  const prog = progs.find((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === group?.id);
  const sub = prog ? d.subjects.find((s) => s.id === prog.subjectId) : undefined;
  const students = group ? studentsOf(d, group.id) : [];

  if (!group || !prog || !sub) return <EmptyState icon="file" title="Sin datos" />;

  return (
    <div>
      <SectionHead kicker="Documentación oficial" title="Informes del alumnado" desc="Informes generados automáticamente desde el cuaderno." actions={<><button className={btnGhost} onClick={() => nav("alumnado")}><Ic n="users" s={15} /> Perfiles</button><button className={btn} onClick={() => window.print()}><Ic n="print" s={15} /> Exportar PDF</button></>} />
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <select className="inp !w-auto !py-1.5 text-[12.5px]" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
      </div>
      <Reveal>
        <div className="mx-auto max-w-[820px] rounded-xl border border-line bg-card p-6 shadow-lg sm:p-9">
          <div style={{ borderBottom: "3px solid #13252c", paddingBottom: 12, marginBottom: 18 }}>
            <p style={{ fontSize: 22, fontWeight: 800 }}>IES Lope de Vega · {sub.nombre}</p>
            <p style={{ fontSize: 12, color: "#47606b" }}>{group.nombre} · Curso {d.cursoLabel}</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ background: "#13252c", color: "#fff" }}><th style={{ padding: "6px 10px", textAlign: "left" }}>Alumno/a</th><th style={{ padding: "6px 10px", textAlign: "center" }}>Nota</th><th style={{ padding: "6px 10px", textAlign: "center" }}>Nivel</th></tr></thead>
            <tbody>
              {students.map((st) => {
                const f = finalGrade(d, prog.id, st.id);
                return (
                  <tr key={st.id} style={{ borderBottom: "1px solid #d9e0d5" }}>
                    <td style={{ padding: "6px 10px", fontWeight: 700 }}>{st.nombre}{st.neae ? " (NEAE)" : ""}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 800, color: nivelDe(f.score).hex }}>{fmt(f.score)}</td>
                    <td style={{ padding: "6px 10px", textAlign: "center" }}>{nivelDe(f.score).t}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
