import { fmtFecha } from "../store";
import { type AppData, type Programacion, type SA, type Unit, cursoInfo } from "../data/seed";
import { getCurriculum, allCriterios } from "../data/curriculum";
import { Ic, Modal, btn, btnGhost } from "./ui";

interface Props {
  open: boolean;
  onClose: () => void;
  prog: Programacion;
  data: AppData;
}

export function ExportarPDF({ open, onClose, prog, data }: Props) {
  const sub = data.subjects.find(s => s.id === prog.subjectId);
  const cur = sub ? getCurriculum(sub.curriculumId) : null;
  const sas = data.sas.filter(s => s.programacionId === prog.id);
  const units = data.units.filter(u => u.programacionId === prog.id);
  const grupo = sub ? data.groups.find(g => g.id === sub.grupoId) : null;
  const profesor = sub && sub.teacherId ? data.teachers.find(t => t.id === sub.teacherId) : null;
  const c = cursoInfo();

  if (!sub || !cur) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal open={open} onClose={onClose} title="Exportar programación didáctica" wide>
      <div className="space-y-4">
        <div className="rounded-lg bg-virl p-4 border border-vir/20">
          <p className="text-[13px] font-semibold text-vird mb-2">📄 Documento completo para Jefatura de Estudios</p>
          <p className="text-[12px] text-ink2">
            Este documento incluye todos los apartados de la programación didáctica con maquetación profesional:
          </p>
          <ul className="text-[12px] text-ink2 mt-2 space-y-1 ml-4">
            <li>✓ Contextualización completa</li>
            <li>✓ Elementos curriculares LOMLOE</li>
            <li>✓ Criterios de calificación</li>
            <li>✓ Situaciones de aprendizaje</li>
            <li>✓ Unidades didácticas y temporalización</li>
            <li>✓ Evaluación (instrumentos y criterios)</li>
            <li>✓ Anexos (si existen)</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={onClose}>Cancelar</button>
          <button className={btn} onClick={handlePrint}>
            <Ic n="print" s={15} /> Imprimir / Guardar PDF
          </button>
        </div>

        {/* Vista previa del documento */}
        <div className="border-t border-line pt-4">
          <p className="text-[12px] font-bold text-ink3 mb-3">VISTA PREVIA</p>
          <div className="bg-white border border-line rounded-lg p-6 max-h-[500px] overflow-y-auto">
            <ProgramacionDocumento 
              prog={prog} 
              sub={sub} 
              cur={cur} 
              sas={sas} 
              units={units}
              grupo={grupo}
              profesor={profesor}
              data={data}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ProgramacionDocumento({ prog, sub, cur, sas, units, grupo, profesor, data }: {
  prog: Programacion;
  sub: any;
  cur: any;
  sas: SA[];
  units: Unit[];
  grupo: any;
  profesor: any;
  data: AppData;
}) {
  const c = cursoInfo();

  return (
    <div style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#13252c", fontSize: "11px", lineHeight: "1.5" }}>
      {/* Portada */}
      <div style={{ borderBottom: "3px solid #0e7c66", paddingBottom: "16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c929b", margin: "0 0 4px" }}>
              Programación Didáctica · Curso {prog.curso}
            </p>
            <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px", color: "#0e7c66" }}>
              {sub.nombre}
            </h1>
            <p style={{ fontSize: "12px", color: "#47606b", margin: 0 }}>
              {sub.nivel} · {sub.etapa}
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: "9px", color: "#7c929b", lineHeight: "1.6" }}>
            <p style={{ margin: 0 }}>IES Lope de Vega</p>
            <p style={{ margin: 0 }}>Santa María de Cayón</p>
            <p style={{ margin: 0 }}>Cantabria</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px" }}>
          <div>
            <p style={{ margin: 0, color: "#7c929b" }}>Profesorado:</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{profesor?.nombre || "Sin asignar"}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: "#7c929b" }}>Grupo:</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{grupo?.nombre || "Sin asignar"}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: "#7c929b" }}>Estado:</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{prog.estado}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: "#7c929b" }}>Última actualización:</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{fmtFecha(prog.actualizada)}</p>
          </div>
        </div>
      </div>

      {/* 1. Contextualización */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          1. Contextualización
        </h2>
        <div style={{ display: "grid", gap: "8px" }}>
          {([
            ["centro", "Características del centro"],
            ["entorno", "Entorno social y cultural"],
            ["alumnado", "Características del alumnado"],
            ["recursos", "Recursos y equipamiento"],
            ["diversidad", "Atención a la diversidad"]
          ] as const).map(([key, label]) => (
            <div key={key}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#47606b", margin: "0 0 2px" }}>{label}:</p>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{prog.contexto[key] || "Sin especificar"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Elementos Curriculares */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          2. Elementos Curriculares
        </h2>
        <div style={{ display: "grid", gap: "10px" }}>
          {cur.ces.map((ce: any) => (
            <div key={ce.id} style={{ borderLeft: "3px solid #0e7c66", paddingLeft: "10px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, margin: "0 0 4px" }}>
                <span style={{ color: "#0e7c66" }}>{ce.codigo}</span> · {ce.texto}
              </p>
              <div style={{ fontSize: "10px", color: "#47606b", marginLeft: "8px" }}>
                {ce.criterios.filter((c: any) => prog.criterios.includes(c.id)).map((c: any) => (
                  <p key={c.id} style={{ margin: "2px 0" }}>
                    <span style={{ fontWeight: 700, color: sub.color }}>{c.codigo}</span> {c.texto}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Criterios de Calificación */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          3. Criterios de Calificación
        </h2>
        <div style={{ marginBottom: "10px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#47606b", margin: "0 0 4px" }}>Criterios generales:</p>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{prog.ccalificacion}</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
          <thead>
            <tr style={{ background: "#f2f4ef" }}>
              <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Criterio</th>
              <th style={{ padding: "6px", textAlign: "center", borderBottom: "2px solid #d9e0d5", width: "80px" }}>Ponderación</th>
            </tr>
          </thead>
          <tbody>
            {allCriterios(cur).map((c: any) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #d9e0d5" }}>
                <td style={{ padding: "6px" }}>
                  <span style={{ fontWeight: 700, color: sub.color }}>{c.codigo}</span> {c.texto}
                </td>
                <td style={{ padding: "6px", textAlign: "center", fontWeight: 700 }}>
                  {prog.ponderaciones[c.id] ?? 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Situaciones de Aprendizaje */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          4. Situaciones de Aprendizaje
        </h2>
        {sas.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#7c929b" }}>No hay situaciones de aprendizaje definidas</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {sas.map((sa, idx) => (
              <div key={sa.id} style={{ border: "1px solid #d9e0d5", borderRadius: "6px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 2px", color: "#0e7c66" }}>
                      SA{idx + 1}: {sa.titulo}
                    </p>
                    <p style={{ fontSize: "9px", color: "#7c929b", margin: 0 }}>
                      {sa.eva}ª evaluación · {sa.sesiones} sesiones · {fmtFecha(sa.inicio)} - {fmtFecha(sa.fin)}
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: "10px", display: "grid", gap: "4px" }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>Reto:</span> {sa.reto}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>Producto:</span> {sa.producto}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>Metodologías:</span> {sa.metodologias.join(", ")}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>Actividades:</span> {sa.actividades.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Unidades Didácticas y Temporalización */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          5. Unidades Didácticas y Temporalización
        </h2>
        
        {/* Unidades Didácticas */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#47606b", margin: "0 0 8px" }}>Unidades Didácticas:</p>
          {units.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#7c929b" }}>No hay unidades didácticas definidas</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
              <thead>
                <tr style={{ background: "#f2f4ef" }}>
                  <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Unidad</th>
                  <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Temporalización</th>
                  <th style={{ padding: "6px", textAlign: "center", borderBottom: "2px solid #d9e0d5", width: "60px" }}>Sesiones</th>
                  <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Situaciones</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u, idx) => {
                  const sasUnidad = sas.filter(sa => u.saIds.includes(sa.id));
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #d9e0d5" }}>
                      <td style={{ padding: "6px", fontWeight: 700 }}>UD{idx + 1}: {u.titulo}</td>
                      <td style={{ padding: "6px" }}>{fmtFecha(u.inicio)} - {fmtFecha(u.fin)}</td>
                      <td style={{ padding: "6px", textAlign: "center" }}>{u.sesiones}</td>
                      <td style={{ padding: "6px" }}>{sasUnidad.map(sa => sa.titulo).join(", ") || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Temporalización */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#47606b", margin: "0 0 8px" }}>Distribución Temporal:</p>
          <div style={{ fontSize: "10px" }}>
            {c.evas.map((eva: any) => {
              const sasEva = sas.filter(sa => sa.eva === eva.n);
              const sesiones = sasEva.reduce((acc, sa) => acc + sa.sesiones, 0);
              return (
                <div key={eva.n} style={{ marginBottom: "6px", paddingLeft: "8px", borderLeft: "2px solid #d9e0d5" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{eva.label}: {fmtFecha(eva.inicio.toISOString().slice(0, 10))} - {fmtFecha(eva.fin.toISOString().slice(0, 10))}</p>
                  <p style={{ margin: "2px 0 0 8px", color: "#47606b" }}>
                    {sasEva.length} situaciones de aprendizaje · {sesiones} sesiones
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Evaluación */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
          6. Evaluación
        </h2>
        
        {/* Instrumentos de Evaluación */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#47606b", margin: "0 0 8px" }}>Instrumentos de Evaluación:</p>
          {(() => {
            const instruments = data.instruments.filter(i => i.subjectId === sub.id);
            if (instruments.length === 0) {
              return <p style={{ fontStyle: "italic", color: "#7c929b" }}>No hay instrumentos de evaluación definidos</p>;
            }
            return (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead>
                  <tr style={{ background: "#f2f4ef" }}>
                    <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Instrumento</th>
                    <th style={{ padding: "6px", textAlign: "left", borderBottom: "2px solid #d9e0d5" }}>Tipo</th>
                    <th style={{ padding: "6px", textAlign: "center", borderBottom: "2px solid #d9e0d5", width: "80px" }}>Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {instruments.map((inst) => (
                    <tr key={inst.id} style={{ borderBottom: "1px solid #d9e0d5" }}>
                      <td style={{ padding: "6px", fontWeight: 700 }}>{inst.nombre}</td>
                      <td style={{ padding: "6px", textTransform: "capitalize" }}>{inst.tipo}</td>
                      <td style={{ padding: "6px", textAlign: "center", fontWeight: 700 }}>{inst.peso}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>

        {/* Criterios de Calificación */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#47606b", margin: "0 0 8px" }}>Criterios de Calificación:</p>
          <p style={{ margin: 0, fontSize: "10px", whiteSpace: "pre-wrap" }}>{prog.ccalificacion}</p>
        </div>
      </section>

      {/* 7. Anexos */}
      {prog.anexos.length > 0 && (
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 800, color: "#0e7c66", borderBottom: "2px solid #d9e0d5", paddingBottom: "4px", marginBottom: "10px" }}>
            7. Anexos
          </h2>
          <div style={{ display: "grid", gap: "10px" }}>
            {prog.anexos.map((anexo, idx) => (
              <div key={anexo.id} style={{ border: "1px solid #d9e0d5", borderRadius: "6px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, margin: 0, color: "#0e7c66" }}>
                    Anexo {idx + 1}: {anexo.titulo}
                  </p>
                  <p style={{ fontSize: "9px", color: "#7c929b", margin: 0 }}>{fmtFecha(anexo.fecha)}</p>
                </div>
                <p style={{ margin: 0, fontSize: "10px", whiteSpace: "pre-wrap" }}>{anexo.contenido || "Sin contenido"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pie de página */}
      <div style={{ marginTop: "30px", paddingTop: "10px", borderTop: "1px solid #d9e0d5", fontSize: "9px", color: "#7c929b", textAlign: "center" }}>
        <p style={{ margin: 0 }}>
          Documento generado con TRAZO · Sistema de Programación Didáctica LOMLOE · {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>
    </div>
  );
}
