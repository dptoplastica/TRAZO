import { useState } from "react";
import { useApp, visibleProgramaciones, studentsOf, finalGrade, notaDeEva, ceAgg, claveAgg, pendingCriterios, fmt, nivelDe, claveNivel, curso, fmtFechaL } from "../store";
import { getCurriculum, CLAVES, clavesDeCE } from "../data/curriculum";
import type { Student } from "../data/seed";
import { Ic, Reveal, SectionHead, EmptyState, btn, btnGhost } from "../components/ui";

export default function Informes() {
  const { d, nav } = useApp();
  const progs = visibleProgramaciones(d);
  const groups = d.groups.filter((g) => progs.some((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === g.id));
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const group = d.groups.find((g) => g.id === groupId) ?? groups[0];
  const prog = progs.find((p) => d.subjects.find((s) => s.id === p.subjectId)?.grupoId === group?.id);
  const sub = prog ? d.subjects.find((s) => s.id === prog.subjectId) : undefined;
  const students = group ? studentsOf(d, group.id) : [];
  const [stId, setStId] = useState(students[0]?.id ?? "");
  const st = students.find((s) => s.id === stId) ?? students[0];
  const [modo, setModo] = useState<"individual" | "grupo">("individual");
  const [eva, setEva] = useState<0 | 1 | 2 | 3>(0);

  if (!group || !prog || !sub) return <EmptyState icon="file" title="Sin datos para informes" desc="No hay programaciones visibles para este perfil." />;

  const exportar = () => window.print();

  return (
    <div>
      <SectionHead
        kicker="Documentación oficial"
        title="Informes del alumnado"
        desc="Informes individuales y de grupo generados automáticamente desde el cuaderno: calificaciones, competencias específicas, clave y observaciones. Listos para imprimir o guardar en PDF."
        actions={
          <>
            <button className={btnGhost} onClick={() => nav("alumnado")}><Ic n="users" s={15} /> Ver perfiles</button>
            <button className={btn} onClick={exportar}><Ic n="print" s={15} /> Exportar PDF</button>
          </>
        }
      />

      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg border border-line bg-panel p-1">
          {([["individual", "Informe individual", "user"], ["grupo", "Informe de grupo", "users"]] as const).map(([id, l, ic]) => (
            <button key={id} onClick={() => setModo(id)} className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-bold transition ${modo === id ? "bg-ink text-paper" : "text-ink2 hover:bg-line/50"}`}>
              <Ic n={ic} s={14} /> {l}
            </button>
          ))}
        </div>
        <select className="inp !w-auto !py-1.5 text-[12.5px]" value={groupId} onChange={(e) => { setGroupId(e.target.value); const g = d.groups.find((x) => x.id === e.target.value); const s0 = g ? studentsOf(d, g.id)[0] : undefined; if (s0) setStId(s0.id); }}>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.nombre} · {d.subjects.find((s) => s.grupoId === g.id)?.corto}</option>)}
        </select>
        {modo === "individual" && (
          <select className="inp !w-auto !py-1.5 text-[12.5px]" value={st?.id ?? ""} onChange={(e) => setStId(e.target.value)}>
            {students.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        )}
        <select className="inp !w-auto !py-1.5 text-[12.5px]" value={eva} onChange={(e) => setEva(Number(e.target.value) as 0 | 1 | 2 | 3)}>
          <option value={0}>Evaluación final</option>
          <option value={1}>1ª evaluación</option>
          <option value={2}>2ª evaluación</option>
          <option value={3}>3ª evaluación</option>
        </select>
        <span className="mono ml-auto hidden text-[10.5px] font-bold uppercase tracking-widest text-ink3 md:block">El diálogo de impresión genera el PDF</span>
      </div>

      {/* vista en pantalla */}
      <Reveal className="no-print">
        <div className="mx-auto max-w-[820px] rounded-xl border border-line bg-card p-6 shadow-[0_24px_60px_-30px_rgba(15,34,41,0.35)] sm:p-9">
          {modo === "individual" && st ? <InformeIndividual stId={st.id} progId={prog.id} eva={eva} /> : <InformeGrupo progId={prog.id} groupId={group.id} eva={eva} />}
        </div>
      </Reveal>

      {/* área de impresión */}
      <div className="print-area" style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#13252c" }}>
        {modo === "individual" && st ? <InformeIndividual stId={st.id} progId={prog.id} eva={eva} /> : <InformeGrupo progId={prog.id} groupId={group.id} eva={eva} />}
      </div>
    </div>
  );
}

/* ================= cabecera oficial ================= */

function Membrete({ titulo, sub }: { titulo: string; sub: string }) {
  const { d } = useApp();
  return (
    <div style={{ borderBottom: "3px solid #13252c", paddingBottom: 12, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, margin: 0 }}>IES La Atalaya · Santander</p>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#47606b", margin: "3px 0 0" }}>Departamento de Dibujo y Artes Plásticas · Gobierno de Cantabria</p>
        </div>
        <div style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#47606b", lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>DOC-EV · REV A</p>
          <p style={{ margin: 0 }}>CURSO {d.cursoLabel}</p>
          <p style={{ margin: 0 }}>{new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 800, marginTop: 14, marginBottom: 0, color: "#0e7c66" }}>{titulo}</p>
      <p style={{ fontSize: 12, color: "#47606b", margin: "2px 0 0" }}>{sub}</p>
    </div>
  );
}

/* ================= informe individual ================= */

function InformeIndividual({ stId, progId, eva }: { stId: string; progId: string; eva: 0 | 1 | 2 | 3 }) {
  const { d } = useApp();
  const st = d.students.find((s) => s.id === stId)!;
  const prog = d.programaciones.find((p) => p.id === progId)!;
  const sub = d.subjects.find((s) => s.id === prog.subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const group = d.groups.find((g) => g.id === st.groupId)!;
  const teacher = d.teachers.find((t) => t.id === sub.teacherId);
  const c = curso();

  const final = finalGrade(d, progId, stId);
  const nota = eva === 0 ? final.score : notaDeEva(d, progId, stId, eva as 1 | 2 | 3);
  const notasEvas = [1, 2, 3].map((e) => notaDeEva(d, progId, stId, e as 1 | 2 | 3));
  const pendientes = pendingCriterios(d, stId, sub.id);
  const obs = d.observations.filter((o) => o.studentId === stId);
  const medidas = d.measures.filter((m) => m.studentId === stId || (m.groupId === st.groupId && !m.studentId));

  return (
    <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>
      <Membrete
        titulo={eva === 0 ? "Informe de evaluación final del alumnado" : `Informe de la ${eva}ª evaluación`}
        sub={`${sub.nombre} · ${group.nombre} · curso ${d.cursoLabel}`}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 12.5 }}>
        <tbody>
          <tr>
            {[["Alumno/a", st.nombre], ["Grupo", group.nombre], ["Materia", sub.nombre], ["Profesorado", teacher?.nombre ?? "—"]].map(([k, v]) => (
              <td key={k} style={{ border: "1px solid #d9e0d5", padding: "6px 10px" }}>
                <p style={{ margin: 0, fontFamily: "JetBrains Mono, monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c929b" }}>{k}</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{v}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, padding: "10px 14px", background: "#f2f4ef", border: "1px solid #d9e0d5", borderRadius: 8 }}>
        <p style={{ margin: 0, fontFamily: "JetBrains Mono, monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#47606b" }}>Calificación {eva === 0 ? "final" : `${eva}ª evaluación`}</p>
        <p style={{ margin: 0, fontFamily: "'Bricolage Grotesque'", fontSize: 30, fontWeight: 800, color: nivelDe(nota).hex }}>{fmt(nota)}</p>
        <p style={{ margin: 0, fontWeight: 700, color: nivelDe(nota).hex }}>{nivelDe(nota).t}</p>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {c.evas.map((e, i) => (
            <div key={e.n} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#7c929b" }}>{e.n}ª EV</p>
              <p style={{ margin: 0, fontWeight: 800, color: nivelDe(notasEvas[i]).hex }}>{fmt(notasEvas[i])}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 800, borderBottom: "2px solid #0e7c66", paddingBottom: 3, margin: "0 0 8px" }}>1 · Competencias específicas y criterios de evaluación</h3>
      {cur.ces.map((ce) => {
        const agg = ceAgg(d, cur, stId, ce.id);
        return (
          <div key={ce.id} style={{ marginBottom: 10, breakInside: "avoid" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 12.5 }}><span style={{ fontFamily: "JetBrains Mono, monospace", color: sub.color }}>{ce.codigo}</span> · {ce.texto}</p>
              <p style={{ margin: 0, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: nivelDe(agg.score).hex, whiteSpace: "nowrap" }}>{agg.score === null ? "SD" : `${fmt(agg.score)} · ${nivelDe(agg.score).t}`}</p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <tbody>
                {agg.rows.map(({ crit, score }) => {
                  const inst = d.grades.filter((g) => g.studentId === stId && g.criterioId === crit.id).map((g) => d.instruments.find((i) => i.id === g.instrumentoId)?.nombre.split("·")[0].trim()).filter(Boolean);
                  return (
                    <tr key={crit.id}>
                      <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", width: 44, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: sub.color }}>{crit.codigo}</td>
                      <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px" }}>{crit.texto}<br /><span style={{ fontSize: 10, color: "#7c929b" }}>Instrumentos: {[...new Set(inst)].join(", ") || "—"}</span></td>
                      <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", width: 130, textAlign: "right", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: nivelDe(score).hex }}>{score === null ? "Sin datos" : `${fmt(score)} · ${nivelDe(score).s}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      <h3 style={{ fontSize: 14, fontWeight: 800, borderBottom: "2px solid #2c6e8f", paddingBottom: 3, margin: "16px 0 8px" }}>2 · Grado de adquisición de las competencias clave</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
        <tbody>
          {CLAVES.filter((k) => cur.ces.some((ce) => clavesDeCE(ce).includes(k.id))).map((k) => {
            const score = claveAgg(d, cur, stId, k.id);
            const n = claveNivel(score);
            return (
              <tr key={k.id}>
                <td style={{ border: "1px solid #d9e0d5", padding: "5px 8px", width: 60, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: k.color }}>{k.id}</td>
                <td style={{ border: "1px solid #d9e0d5", padding: "5px 8px" }}>{k.nombre}</td>
                <td style={{ border: "1px solid #d9e0d5", padding: "5px 8px", width: 150, fontWeight: 800, color: n.hex, textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{score === null ? "Sin datos" : `${fmt(score)} · ${n.t}`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pendientes.length > 0 && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 800, borderBottom: "2px solid #d9532c", paddingBottom: 3, margin: "16px 0 8px" }}>3 · Criterios pendientes y medidas de refuerzo</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {pendientes.map((crit) => <li key={crit.id} style={{ marginBottom: 4 }}><b style={{ fontFamily: "JetBrains Mono, monospace" }}>{crit.codigo}.</b> {crit.texto}</li>)}
          </ul>
        </>
      )}
      {medidas.length > 0 && (
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {medidas.map((m) => <li key={m.id} style={{ marginBottom: 4 }}><b>[{m.tipo}]</b> {m.titulo}: {m.desc}</li>)}
        </ul>
      )}

      <h3 style={{ fontSize: 14, fontWeight: 800, borderBottom: "2px solid #c98a12", paddingBottom: 3, margin: "16px 0 8px" }}>{pendientes.length || medidas.length ? "4" : "3"} · Observaciones del profesorado y evolución</h3>
      <p style={{ margin: "0 0 6px" }}>Evolución durante el curso: {c.evas.map((e, i) => `${e.n}ª: ${fmt(notasEvas[i])}`).join(" · ") || "sin datos"}.</p>
      {obs.length
        ? <ul style={{ margin: 0, paddingLeft: 18 }}>{obs.map((o) => <li key={o.id} style={{ marginBottom: 4 }}>{o.texto} <span style={{ color: "#7c929b", fontSize: 10.5 }}>({o.fecha}, {o.autor})</span></li>)}</ul>
        : <p style={{ margin: 0, color: "#7c929b", fontStyle: "italic" }}>Sin observaciones registradas en el periodo.</p>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, gap: 40 }}>
        {["Firma del profesorado", "VºBº Jefatura de Departamento", "Familia / alumnado"].map((f) => (
          <div key={f} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 44 }} />
            <p style={{ borderTop: "1px solid #13252c", margin: 0, paddingTop: 4, fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "#47606b" }}>{f}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#7c929b", textAlign: "center" }}>Generado con TRAZO · suite de programación y evaluación LOMLOE · {fmtFechaL(new Date().toISOString().slice(0, 10))}</p>
    </div>
  );
}

/* ================= informe de grupo ================= */

function InformeGrupo({ progId, groupId, eva }: { progId: string; groupId: string; eva: 0 | 1 | 2 | 3 }) {
  const { d } = useApp();
  const prog = d.programaciones.find((p) => p.id === progId)!;
  const sub = d.subjects.find((s) => s.id === prog.subjectId)!;
  const cur = getCurriculum(sub.curriculumId);
  const group = d.groups.find((g) => g.id === groupId)!;
  const students = studentsOf(d, groupId);
  const rows = students.map((st) => ({ st, final: finalGrade(d, progId, st.id), nota: eva === 0 ? finalGrade(d, progId, st.id).score : notaDeEva(d, progId, st.id, eva as 1 | 2 | 3), pend: pendingCriterios(d, st.id, sub.id) }));
  const medias = cur.ces.map((ce) => {
    const vals = students.map((st) => ceAgg(d, cur, st.id, ce.id).score).filter((x): x is number => x !== null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  });
  const mediaGrupo = rows.map((r) => r.nota).filter((x): x is number => x !== null);
  const mg = mediaGrupo.length ? mediaGrupo.reduce((a, b) => a + b, 0) / mediaGrupo.length : null;
  const aprobados = mediaGrupo.filter((x) => x >= 5).length;

  return (
    <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
      <Membrete
        titulo={eva === 0 ? "Informe de evaluación del grupo" : `Informe de la ${eva}ª evaluación · grupo`}
        sub={`${sub.nombre} · ${group.nombre} · curso ${d.cursoLabel} · ${students.length} alumnos/as`}
      />
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {[["Media del grupo", fmt(mg)], ["Aprobados", mediaGrupo.length ? `${aprobados}/${mediaGrupo.length}` : "—"], ["Con criterios pendientes", String(rows.filter((r) => r.pend.length).length)]].map(([k, v]) => (
          <div key={k} style={{ flex: 1, background: "#f2f4ef", border: "1px solid #d9e0d5", borderRadius: 8, padding: "8px 12px" }}>
            <p style={{ margin: 0, fontFamily: "JetBrains Mono, monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c929b" }}>{k}</p>
            <p style={{ margin: 0, fontFamily: "'Bricolage Grotesque'", fontSize: 22, fontWeight: 800 }}>{v}</p>
          </div>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, marginBottom: 14 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #13252c", padding: "5px 8px", textAlign: "left", background: "#13252c", color: "#fff" }}>Alumno/a</th>
            {cur.ces.map((ce) => <th key={ce.id} style={{ border: "1px solid #13252c", padding: "5px 4px", background: "#13252c", color: "#fff", fontFamily: "JetBrains Mono, monospace" }}>{ce.codigo}</th>)}
            <th style={{ border: "1px solid #13252c", padding: "5px 8px", background: "#0e7c66", color: "#fff" }}>Nota</th>
            <th style={{ border: "1px solid #13252c", padding: "5px 8px", background: "#13252c", color: "#fff" }}>Pend.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ st, final, nota, pend }) => (
            <tr key={st.id} style={{ breakInside: "avoid" }}>
              <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", fontWeight: 700 }}>{st.nombre}{st.neae ? " (NEAE)" : ""}</td>
              {cur.ces.map((ce) => {
                const a = ceAgg(d, cur, st.id, ce.id);
                return <td key={ce.id} style={{ border: "1px solid #d9e0d5", padding: "4px 4px", textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: nivelDe(a.score).hex }}>{a.score === null ? "—" : fmt(a.score)}</td>;
              })}
              <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 800, background: "#f2f4ef", color: nivelDe(nota).hex }}>{fmt(nota)}</td>
              <td style={{ border: "1px solid #d9e0d5", padding: "4px 8px", textAlign: "center", fontFamily: "JetBrains Mono, monospace", color: pend.length ? "#d9532c" : "#0e7c66", fontWeight: 700 }}>{pend.length || "✓"}</td>
            </tr>
          ))}
          <tr style={{ background: "#f2f4ef" }}>
            <td style={{ border: "1px solid #13252c", padding: "4px 8px", fontWeight: 800 }}>MEDIA DEL GRUPO</td>
            {medias.map((m, i) => <td key={i} style={{ border: "1px solid #13252c", padding: "4px 4px", textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 800 }}>{m === null ? "—" : fmt(m)}</td>)}
            <td style={{ border: "1px solid #13252c", padding: "4px 8px", textAlign: "center", fontFamily: "JetBrains Mono, monospace", fontWeight: 800, color: nivelDe(mg).hex }}>{fmt(mg)}</td>
            <td style={{ border: "1px solid #13252c", padding: "4px 8px" }} />
          </tr>
        </tbody>
      </table>
      <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "#7c929b" }}>Escala: IN insuficiente · SU suficiente · NT notable · SB sobresaliente. Pend.: criterios con calificación inferior a 5.</p>
      <p style={{ marginTop: 12, fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#7c929b", textAlign: "center" }}>Generado con TRAZO · suite de programación y evaluación LOMLOE</p>
    </div>
  );
}
