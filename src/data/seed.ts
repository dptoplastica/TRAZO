/* ============================================================
   DATOS DE DEMANDA — curso académico dinámico (basado en la
   fecha real, de modo que la demo siempre está "en curso").
   ============================================================ */

export interface Teacher { id: string; nombre: string; email: string; rol: "profesor" | "admin"; color: string; }
export interface Group { id: string; nombre: string; nivel: string; tutorId: string; dias: number[]; }
export interface Student { id: string; groupId: string; nombre: string; base: number; neae?: string; absRate: number; hue: number; }
export interface Subject {
  id: string; nombre: string; corto: string; etapa: string; nivel: string;
  curriculumId: string; teacherId?: string; grupoId: string; color: string; tipo: "obligatoria" | "optativa";
}
export interface Programacion {
  id: string; subjectId: string; curso: string; estado: "Borrador" | "En revisión" | "Finalizada";
  contexto: { centro: string; entorno: string; alumnado: string; recursos: string; diversidad: string };
  criterios: string[];
  ponderaciones: Record<string, number>;
  ccalificacion: string;
  actualizada: string;
}
export interface Actividad { id: string; titulo: string; desc: string; fase: "Inicio" | "Desarrollo" | "Cierre"; sesion: number; criterioIds: string[]; }
export interface SA {
  id: string; programacionId: string; titulo: string; eva: 1 | 2 | 3;
  inicio: string; fin: string; sesiones: number;
  justificacion: string; reto: string; producto: string;
  metodologias: string[]; agrupamientos: string; espacios: string; recursos: string;
  diversidad: string; evidencias: string;
  criterios: string[]; objetivos: string[]; actividades: Actividad[]; instrumentos: string[];
}
export interface Unit { id: string; programacionId: string; titulo: string; inicio: string; fin: string; sesiones: number; saIds: string[]; criterios: string[]; }
export interface RubricaNivel { id: string; nombre: string; valor: number; desc: string; }
export type TipoInstrumento = "rubrica" | "escala" | "lista" | "escrita" | "practica" | "proyecto" | "portfolio" | "observacion" | "lamina" | "exposicion" | "digital" | "autoevaluacion" | "coevaluacion";
export interface Instrument {
  id: string; subjectId: string; nombre: string; tipo: TipoInstrumento; peso: number;
  criterioIds: string[]; fecha?: string; rubrica?: RubricaNivel[];
}
export interface Grade { id: string; studentId: string; instrumentoId: string; criterioId: string; value: number; fecha: string; }
export interface AttRec { id: string; groupId: string; fecha: string; studentId: string; estado: "P" | "F" | "R"; }
export interface Obs { id: string; studentId: string; fecha: string; texto: string; autor: string; }
export interface Measure { id: string; tipo: string; titulo: string; desc: string; studentId?: string; groupId?: string; }
export interface Recovery { id: string; studentId: string; criterioId: string; actividad: string; fecha: string; instrumentoId: string; resultado?: number; }

export interface AppData {
  version: number;
  role: "profesor" | "admin";
  teacherId: string;
  cursoLabel: string;
  teachers: Teacher[]; groups: Group[]; students: Student[]; subjects: Subject[];
  programaciones: Programacion[]; sas: SA[]; units: Unit[]; instruments: Instrument[];
  grades: Grade[]; attendance: AttRec[]; observations: Obs[]; measures: Measure[]; recoveries: Recovery[];
}

/* ---------------- utilidades de fecha ---------------- */

const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (iso: string) => new Date(iso + "T12:00:00");
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export function cursoInfo(now = new Date()) {
  const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    label: `${y}-${String(y + 1).slice(2)}`,
    y,
    start: new Date(y, 8, 10),
    end: new Date(y + 1, 5, 22),
    evas: [
      { n: 1 as const, label: "1ª evaluación", inicio: new Date(y, 8, 10), fin: new Date(y, 11, 22) },
      { n: 2 as const, label: "2ª evaluación", inicio: new Date(y + 1, 0, 8), fin: new Date(y + 1, 2, 20) },
      { n: 3 as const, label: "3ª evaluación", inicio: new Date(y + 1, 2, 21), fin: new Date(y + 1, 5, 22) },
    ],
  };
}

export const evaDeFecha = (d: Date) => {
  const c = cursoInfo(d);
  if (d <= c.evas[0].fin) return 1 as const;
  if (d <= c.evas[1].fin) return 2 as const;
  return 3 as const;
};

export function sessionsFor(g: Group, start: Date, end: Date): Date[] {
  const out: Date[] = [];
  const d = new Date(start);
  while (d <= end) {
    if (g.dias.includes(d.getDay())) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

export const TIPOS_INSTRUMENTO: { id: TipoInstrumento; label: string }[] = [
  { id: "rubrica", label: "Rúbrica" }, { id: "escala", label: "Escala de valoración" },
  { id: "lista", label: "Lista de cotejo" }, { id: "escrita", label: "Prueba escrita" },
  { id: "practica", label: "Prueba práctica" }, { id: "proyecto", label: "Trabajo / proyecto" },
  { id: "lamina", label: "Láminas" }, { id: "portfolio", label: "Portfolio" },
  { id: "observacion", label: "Observación directa" }, { id: "exposicion", label: "Exposición oral" },
  { id: "digital", label: "Actividad digital" }, { id: "autoevaluacion", label: "Autoevaluación" },
  { id: "coevaluacion", label: "Coevaluación" },
];

export const NIVELES_RUBRICA: RubricaNivel[] = [
  { id: "NI", nombre: "En inicio", valor: 3, desc: "Aproximación inicial al criterio: requiere apoyo continuo y no alcanza los desempeños mínimos." },
  { id: "ND", nombre: "En desarrollo", valor: 5.5, desc: "Avanza hacia el criterio con autonomía creciente; desempeños parciales en contextos conocidos." },
  { id: "NA", nombre: "Adquirido", valor: 8, desc: "Aplica el criterio con autonomía y adecuación en la mayoría de las situaciones propuestas." },
  { id: "NE", nombre: "Excelente", valor: 9.5, desc: "Domina el criterio y lo transfiere a situaciones nuevas con creatividad y rigor." },
];

export const METODOLOGIAS = ["Aprendizaje basado en proyectos", "Aprendizaje basado en retos", "Design thinking", "Aprendizaje cooperativo", "Aula invertida", "Estudio de casos", "Pensamiento de diseño", "Aprendizaje-servicio", "Gamificación"];

/* ---------------- textos reutilizables de contextualización ---------------- */

const CONTEXTO = {
  centro: "IES La Atalaya (Santander, Cantabria). Centro público de Educación Secundaria y Bachillerato con 620 alumnos y 58 docentes. El Departamento de Dibujo y Artes Plásticas dispone de dos aulas-taller equipadas, aula de informática con software CAD y de edición audiovisual, y participación activa en programas de innovación (Aulas del Futuro, Red de Centros Educativos Sostenibles). El centro desarrolla el Plan Digital y el Plan de Fomento de la Lectura, e integra las situaciones de aprendizaje en su Proyecto Educativo.",
  entorno: "Entorno urbano de tamaño medio, con tejido socioeconómico diverso. Oferta cultural cercana: Museo de Prehistoria y Arqueología de Cantabria, CDIS, Filmoteca de Cantabria, centros culturales municipales y patrimonio industrial de la bahía. Se aprovecha el entorno como recurso didáctico (salidas de observación, fotografía urbana, intervenciones en el espacio próximo).",
  alumnado: "Grupos heterogéneos con motivación alta hacia la creación plástica y audiovisual. Se detectan diferencias significativas en la destreza gráfica de partida y en el manejo de herramientas digitales. Presencia de alumnado con NEAE que requiere adaptaciones de acceso y metodológicas, recogidas en los planes individualizados.",
  recursos: "Aula-taller con mesas de dibujo y tableros, materiales fungibles de dibujo y pintura, cámaras y trípodes, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP, proyector interactivo, pizarra digital y biblioteca de recursos del departamento. Presupuesto anual del departamento para materiales.",
  diversidad: "Se aplican medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, modelos de referencia, tiempos ampliados) y, cuando procede, adaptaciones de acceso y no significativas coordinadas con el Departamento de Orientación. Las actividades de ampliación permiten profundizar sin alterar los criterios de evaluación.",
};

/* ---------------- construcción del dataset ---------------- */

export function buildSeed(): AppData {
  const now = new Date();
  const hoy = toISO(now);
  const c = cursoInfo(now);
  const D = (n: number) => toISO(addDays(c.start, n));
  const applied = (iso: string) => iso <= hoy;

  const teachers: Teacher[] = [
    { id: "t1", nombre: "Laura Gómez", email: "laura.gomez@iesatalaya.es", rol: "profesor", color: "#0e7c66" },
    { id: "t2", nombre: "Miguel Ruiz", email: "miguel.ruiz@iesatalaya.es", rol: "profesor", color: "#2c6e8f" },
    { id: "t3", nombre: "Carmen Prieto", email: "carmen.prieto@iesatalaya.es", rol: "admin", color: "#d9532c" },
  ];

  const groups: Group[] = [
    { id: "g1", nombre: "4º ESO A", nivel: "4º ESO", tutorId: "t1", dias: [1, 3] },
    { id: "g2", nombre: "1º Bach A", nivel: "1º Bachillerato", tutorId: "t1", dias: [2, 4] },
    { id: "g3", nombre: "2º Bach B", nivel: "2º Bachillerato", tutorId: "t2", dias: [1, 4] },
    { id: "g4", nombre: "1º Bach B", nivel: "1º Bachillerato", tutorId: "t2", dias: [2, 5] },
    { id: "g5", nombre: "1º Bach C", nivel: "1º Bachillerato", tutorId: "t1", dias: [3, 5] },
  ];

  const mk = (groupId: string, rows: [string, number, number, string?][], hue0: number) =>
    rows.map(([nombre, base, absRate, neae], i) => ({
      id: `${groupId}-s${i + 1}`, groupId, nombre, base, absRate, neae, hue: (hue0 + i * 29) % 360,
    }));

  const students: Student[] = [
    ...mk("g1", [
      ["Lucía Fernández", 7.8, 0.03], ["Marco Ruiz", 6.4, 0.06], ["Aitana Sáiz", 8.6, 0.02],
      ["Hugo Cobo", 5.6, 0.08], ["Valeria Ríos", 7.1, 0.04], ["Daniel Herrera", 4.3, 0.22, "TDAH · adaptaciones de acceso"],
      ["Nerea Bustamante", 6.9, 0.05], ["Izan Trueba", 5.9, 0.09], ["Carla Miera", 8.9, 0.02],
      ["Álvaro Peña", 6.2, 0.07], ["Sofía Ocejo", 7.4, 0.03], ["Mateo Lavín", 5.2, 0.12, "Refuerzo de expresión gráfica"],
    ], 158),
    ...mk("g2", [
      ["Emma Castañeda", 8.4, 0.02], ["Pablo Argüeso", 6.8, 0.06], ["June Sainz", 9.1, 0.01],
      ["Adrián Solórzano", 5.8, 0.08], ["Lucía Barreda", 7.5, 0.04], ["Marcos Haya", 4.6, 0.15, "Dificultades de planificación"],
      ["Irene Cossío", 8.0, 0.03], ["Diego Raba", 6.1, 0.07], ["Paula Mantilla", 7.2, 0.04],
    ], 22),
    ...mk("g3", [
      ["Claudia Viadero", 8.2, 0.03], ["Sergio Liaño", 6.6, 0.06], ["Alba Cortabitarte", 7.9, 0.02],
      ["Javier Escudero", 5.4, 0.09], ["Noa Pereda", 8.8, 0.02], ["Rubén San Emeterio", 4.9, 0.18, "Lagunas en geometría básica"],
      ["Elena Torre", 7.0, 0.05], ["Pablo Campuzano", 6.3, 0.06], ["Martina Rozadilla", 9.3, 0.01],
    ], 268),
    ...mk("g4", [
      ["Alejandro Bárcena", 7.6, 0.03], ["Lucía Estrada", 6.2, 0.07], ["Pablo Cagigal", 8.1, 0.02],
      ["Marina Setién", 5.7, 0.10, "Dificultades de abstracción espacial"], ["Iker Revuelta", 7.3, 0.04],
      ["Carmen Obregón", 6.8, 0.05], ["Javier Merino", 8.7, 0.02], ["Nuria Salcedo", 5.4, 0.13],
      ["Álvaro Lombera", 7.9, 0.03], ["Sara Quintana", 6.5, 0.06],
    ], 320),
    ...mk("g5", [
      ["Alicia Trueba", 8.3, 0.02], ["David Pelayo", 6.7, 0.06], ["María Salmón", 7.8, 0.03],
      ["Gonzalo Uribe", 5.9, 0.09], ["Clara Mazarío", 9.0, 0.01], ["Samuel Bedia", 4.8, 0.16, "Dislexia · adaptaciones de acceso"],
      ["Nora Colmenares", 7.4, 0.04], ["Hugo Cueto", 6.1, 0.07], ["Valentina Silió", 8.6, 0.02],
    ], 50),
  ];

  const subjects: Subject[] = [
    { id: "m1", nombre: "Educación Plástica, Visual y Audiovisual", corto: "EPVA", etapa: "ESO", nivel: "4º ESO", curriculumId: "epva-eso", teacherId: "t1", grupoId: "g1", color: "#d9532c", tipo: "optativa" },
    { id: "m2", nombre: "Expresión Artística", corto: "Expr. Artística", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "ea-bach", teacherId: "t1", grupoId: "g2", color: "#c98a12", tipo: "obligatoria" },
    { id: "m3", nombre: "Dibujo Técnico II", corto: "Dibujo Técnico II", etapa: "Bachillerato", nivel: "2º Bachillerato", curriculumId: "dt-bach", teacherId: "t2", grupoId: "g3", color: "#2c6e8f", tipo: "obligatoria" },
    { id: "m4", nombre: "Audiovisual y Multimedia", corto: "Audiovisual", etapa: "ESO", nivel: "4º ESO", curriculumId: "epva-eso", teacherId: undefined, grupoId: "g1", color: "#7a5fb0", tipo: "optativa" },
    { id: "m5", nombre: "Dibujo Técnico I", corto: "Dibujo Técnico I", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "dt1-bach", teacherId: "t2", grupoId: "g4", color: "#0e7c66", tipo: "obligatoria" },
    { id: "m6", nombre: "Taller de Podcast", corto: "Podcast", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "tp-bach", teacherId: "t1", grupoId: "g5", color: "#a84a6c", tipo: "optativa" },
  ];

  const epvaCrit = ["epva.1.1", "epva.1.2", "epva.2.1", "epva.2.2", "epva.3.1", "epva.3.2", "epva.4.1", "epva.4.2", "epva.5.1", "epva.5.2"];
  const eaCrit = ["ea.1.1", "ea.1.2", "ea.2.1", "ea.2.2", "ea.3.1", "ea.3.2", "ea.4.1", "ea.4.2", "ea.5.1", "ea.5.2"];
  const dtCrit = ["dt.1.1", "dt.1.2", "dt.2.1", "dt.2.2", "dt.3.1", "dt.3.2", "dt.4.1", "dt.4.2"];

  const programaciones: Programacion[] = [
    {
      id: "p1", subjectId: "m1", curso: c.label, estado: "Finalizada",
      contexto: CONTEXTO,
      criterios: epvaCrit,
      ponderaciones: { "epva.1.1": 10, "epva.1.2": 10, "epva.2.1": 15, "epva.2.2": 15, "epva.3.1": 10, "epva.3.2": 5, "epva.4.1": 10, "epva.4.2": 5, "epva.5.1": 10, "epva.5.2": 10 },
      ccalificacion: "La calificación de cada evaluación se obtiene agregando las calificaciones de los instrumentos vinculados a cada criterio, ponderadas por el peso del instrumento, y aplicando después la ponderación departamental de cada criterio. Se exige la entrega del portfolio completo. La asistencia continuada y la participación se integran a través de la observación directa. Los criterios no superados se recuperan mediante el plan individual del departamento.",
      actualizada: hoy,
    },
    {
      id: "p2", subjectId: "m2", curso: c.label, estado: "En revisión",
      contexto: CONTEXTO,
      criterios: eaCrit,
      ponderaciones: Object.fromEntries(eaCrit.map((k) => [k, 10])),
      ccalificacion: "El proceso creativo documentado (portfolio y diario artístico) tiene un carácter central: ningún instrumento supera el 35 % del peso global. La exposición oral del proyecto se evalúa con rúbrica compartida con el alumnado al inicio de la situación de aprendizaje.",
      actualizada: hoy,
    },
    {
      id: "p3", subjectId: "m3", curso: c.label, estado: "Borrador",
      contexto: CONTEXTO,
      criterios: dtCrit,
      ponderaciones: Object.fromEntries(dtCrit.map((k) => [k, 12.5])),
      ccalificacion: "Las láminas y pruebas prácticas se califican con escalas de valoración publicadas. El proyecto CAD integra los criterios de normalización y diseño digital. Pendiente de revisión por el departamento: ponderaciones provisionales.",
      actualizada: hoy,
    },
    {
      id: "p4", subjectId: "m5", curso: c.label, estado: "En revisión",
      contexto: CONTEXTO,
      criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.3.1", "dt1.3.2", "dt1.3.3", "dt1.3.4", "dt1.3.5", "dt1.4.1", "dt1.4.2", "dt1.5.1", "dt1.5.2"],
      ponderaciones: { "dt1.1.1": 5, "dt1.2.1": 8, "dt1.2.2": 10, "dt1.2.3": 10, "dt1.3.1": 12, "dt1.3.2": 10, "dt1.3.3": 5, "dt1.3.4": 5, "dt1.3.5": 3, "dt1.4.1": 10, "dt1.4.2": 7, "dt1.5.1": 8, "dt1.5.2": 7 },
      ccalificacion: "Las láminas se califican con escalas de valoración publicadas al inicio del curso. La limpieza, precisión y justificación del procedimiento son criterios transversales (criterio 3.5). El proyecto final integra geometría, sistemas de representación y CAD. Las prácticas CAD se evalúan con rúbrica específica.",
      actualizada: hoy,
    },
    {
      id: "p5", subjectId: "m6", curso: c.label, estado: "Finalizada",
      contexto: CONTEXTO,
      criterios: ["tp.1.1", "tp.1.2", "tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2", "tp.3.3", "tp.4.1", "tp.4.2", "tp.5.1", "tp.5.2"],
      ponderaciones: { "tp.1.1": 8, "tp.1.2": 7, "tp.2.1": 12, "tp.2.2": 10, "tp.3.1": 10, "tp.3.2": 15, "tp.3.3": 8, "tp.4.1": 10, "tp.4.2": 8, "tp.5.1": 6, "tp.5.2": 6 },
      ccalificacion: "El proyecto final de podcast (miniserie de 3 episodios) tiene un peso del 40%. Los episodios individuales, el guion técnico y la identidad sonora completan la evaluación. La escucha crítica y los análisis escritos suman un 20%. La autoevaluación y coevaluación del equipo representan un 10%. Se exige la publicación del podcast en plataformas digitales.",
      actualizada: hoy,
    },
  ];

  const sas: SA[] = [
    {
      id: "sa1", programacionId: "p1", titulo: "Carteles que hablan", eva: 1,
      inicio: D(14), fin: D(45), sesiones: 8,
      justificacion: "El alumnado convive a diario con mensajes visuales persuasivos. Esta situación les convierte en emisores conscientes: deben traducir una causa social cercana a un cartel eficaz, aplicando los fundamentos del lenguaje visual y del diseño gráfico.",
      reto: "¿Cómo lograr que un mensaje social importe de verdad a los adolescentes del instituto?",
      producto: "Cartel A3 impreso + exposición en el hall del centro y versión digital para redes del instituto.",
      metodologias: ["Aprendizaje basado en retos", "Design thinking", "Aprendizaje cooperativo"],
      agrupamientos: "Parejas de diseño + plenario de crítica", espacios: "Aula-taller y aula de informática",
      recursos: "Papel de boceto, rotuladores, pantones, GIMP/Krita, impresora A3, referentes de cartelería social",
      diversidad: "Modelos de referencia con niveles de complejidad, pauta de diseño en 6 pasos, ampliación con identidad visual completa.",
      evidencias: "Cuaderno de bocetos, mapa de empatía, cartel final, ficha de autoevaluación.",
      criterios: ["epva.1.1", "epva.2.1", "epva.3.1", "epva.5.1"],
      objetivos: ["Aplicar los elementos del lenguaje visual con intención comunicativa", "Componer con jerarquía tipográfica y color funcional", "Justificar decisiones de diseño ante el grupo"],
      actividades: [
        { id: "sa1a1", titulo: "Caza de carteles", desc: "Análisis crítico de 20 carteles del entorno: ¿qué funciona y qué no?", fase: "Inicio", sesion: 1, criterioIds: ["epva.1.1"] },
        { id: "sa1a2", titulo: "Mapa de empatía y briefing", desc: "Definir público, causa y mensaje esencial en parejas.", fase: "Inicio", sesion: 2, criterioIds: ["epva.5.1"] },
        { id: "sa1a3", titulo: "Bocetos y miniaturas", desc: "Tres vías compositivas en miniatura con estudios de color.", fase: "Desarrollo", sesion: 4, criterioIds: ["epva.2.1"] },
        { id: "sa1a4", titulo: "Producción del cartel", desc: "Versión definitiva analógica o digital A3.", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.1", "epva.3.1"] },
        { id: "sa1a5", titulo: "Crítica colectiva y montaje", desc: "Exposición, coevaluación guiada y mejora final.", fase: "Cierre", sesion: 8, criterioIds: ["epva.3.1", "epva.5.1"] },
      ],
      instrumentos: ["i1", "i2", "i3"],
    },
    {
      id: "sa2", programacionId: "p1", titulo: "Microhistorias en stop-motion", eva: 2,
      inicio: toISO(new Date(c.y + 1, 0, 12)), fin: toISO(new Date(c.y + 1, 1, 13)), sesiones: 9,
      justificacion: "El audiovisual es el lenguaje natural del alumnado. Pasar de consumidores a creadores de microhistorias exige planificación narrativa, técnica de animación y trabajo cooperativo sostenido.",
      reto: "Contar una historia de 45 segundos que nadie pueda dejar de mirar, con materiales cotidianos.",
      producto: "Microcortometraje stop-motion (45-60 s) con banda sonora, proyectado en la semana cultural.",
      metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo", "Aula invertida"],
      agrupamientos: "Equipos de 3 con roles rotativos (dirección, animación, arte)", espacios: "Aula-taller con set de rodaje",
      recursos: "Trípodes, móviles del centro, iluminación LED, DaVinci Resolve, materiales de volumen",
      diversidad: "Guion técnico con plantilla, roles ajustados a fortalezas, subtítulos obligatorios (DUA).",
      evidencias: "Guion técnico y storyboard, making-of, cortometraje final, diana de coevaluación del equipo.",
      criterios: ["epva.1.2", "epva.2.2", "epva.3.2", "epva.5.1"],
      objetivos: ["Planificar una narrativa audiovisual breve", "Aplicar la técnica stop-motion con continuidad", "Documentar y comunicar el proceso"],
      actividades: [
        { id: "sa2a1", titulo: "Visionado y deconstrucción", desc: "Análisis de cortos stop-motion de referencia: ritmo, planos, materiales.", fase: "Inicio", sesion: 1, criterioIds: ["epva.1.2"] },
        { id: "sa2a2", titulo: "Guion técnico y storyboard", desc: "De la idea al guion técnico con 12-16 planos.", fase: "Desarrollo", sesion: 3, criterioIds: ["epva.3.2"] },
        { id: "sa2a3", titulo: "Rodaje por equipos", desc: "Animación cuadro a cuadro en sets simultáneos.", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.2", "epva.5.1"] },
        { id: "sa2a4", titulo: "Montaje y postproducción", desc: "Edición, sonido y subtítulos en DaVinci Resolve.", fase: "Desarrollo", sesion: 8, criterioIds: ["epva.2.2"] },
        { id: "sa2a5", titulo: "Estreno y making-of", desc: "Proyección colectiva y documentación del proceso.", fase: "Cierre", sesion: 9, criterioIds: ["epva.3.2"] },
      ],
      instrumentos: ["i4", "i6"],
    },
    {
      id: "sa3", programacionId: "p1", titulo: "El barrio que miramos", eva: 3,
      inicio: toISO(new Date(c.y + 1, 3, 6)), fin: toISO(new Date(c.y + 1, 4, 8)), sesiones: 10,
      justificacion: "El patrimonio próximo suele ser invisible para el alumnado. Un mapeo artístico del barrio conecta percepción, fotografía y compromiso ciudadano, cerrando el curso con un proyecto de aprendizaje-servicio.",
      reto: "Hacer visible lo que el barrio esconde: crear un mapa artístico que la asociación de vecinos pueda usar.",
      producto: "Mapa ilustrado del barrio (impreso y web) con 12 puntos de interés fotografiados e ilustrados.",
      metodologias: ["Aprendizaje-servicio", "Aprendizaje basado en proyectos", "Estudio de casos"],
      agrupamientos: "Equipos de ruta + redacción editorial conjunta", espacios: "Salidas de campo y aula-taller",
      recursos: "Cámaras y móviles, plantillas de mapa, GIMP, archivo fotográfico municipal",
      diversidad: "Rutas de dificultad adaptada, parejas de apoyo, fichas con pictogramas para la fase de campo.",
      evidencias: "Diario de campo, serie fotográfica comentada, ilustraciones del mapa, mapa final.",
      criterios: ["epva.1.2", "epva.2.1", "epva.4.1", "epva.4.2", "epva.5.2"],
      objetivos: ["Leer el patrimonio próximo con mirada crítica", "Producir fotografía e ilustración con intención documental", "Proponer acciones de difusión del patrimonio"],
      actividades: [
        { id: "sa3a1", titulo: "¿Qué es patrimonio?", desc: "Debate guiado y selección colectiva de 12 puntos del barrio.", fase: "Inicio", sesion: 1, criterioIds: ["epva.4.1"] },
        { id: "sa3a2", titulo: "Salida fotográfica", desc: "Rutas por equipos con guion de observación.", fase: "Desarrollo", sesion: 3, criterioIds: ["epva.1.2", "epva.2.1"] },
        { id: "sa3a3", titulo: "Ilustración de puntos", desc: "Serie ilustrada coherente para el mapa.", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.1"] },
        { id: "sa3a4", titulo: "Editorial del mapa", desc: "Maquetación conjunta: leyenda, textos, créditos.", fase: "Desarrollo", sesion: 8, criterioIds: ["epva.5.2"] },
        { id: "sa3a5", titulo: "Entrega a la asociación", desc: "Presentación pública y evaluación del servicio.", fase: "Cierre", sesion: 10, criterioIds: ["epva.4.2"] },
      ],
      instrumentos: ["i5", "i6"],
    },
    {
      id: "sa4", programacionId: "p2", titulo: "Diario de un proceso: del boceto a la obra", eva: 1,
      inicio: D(21), fin: D(70), sesiones: 12,
      justificacion: "En 1º de Bachillerato el valor está en el proceso tanto como en el resultado. El diario artístico estructura la investigación y la experimentación, y entrena la mirada autocrítica.",
      reto: "¿Puede un diario de proceso ser, él mismo, una obra? Convertir la investigación en materia expresiva.",
      producto: "Diario artístico (analógico o digital) + una obra personal derivada, presentada al grupo.",
      metodologias: ["Aprendizaje basado en proyectos", "Pensamiento de diseño", "Aprendizaje cooperativo"],
      agrupamientos: "Trabajo individual + parejas de crítica quincenales", espacios: "Aula-taller y exteriores",
      recursos: "Cuadernos, tintas y acrílicos, tabletas, referentes contemporáneos (CDIS, museo), portfolio digital",
      diversidad: "Andamiaje con ejemplos de diarios de tres niveles, tutorías de proceso individualizadas.",
      evidencias: "Diario artístico completo, obra final, presentación oral, ficha de autoevaluación del proceso.",
      criterios: ["ea.1.1", "ea.1.2", "ea.2.1", "ea.3.1"],
      objetivos: ["Documentar un proceso creativo de forma sistemática", "Experimentar con al menos dos lenguajes", "Justificar decisiones creativas con vocabulario propio"],
      actividades: [
        { id: "sa4a1", titulo: "El diario como obra", desc: "Análisis de diarios de artistas y definición del formato propio.", fase: "Inicio", sesion: 2, criterioIds: ["ea.1.1"] },
        { id: "sa4a2", titulo: "Investigación y referentes", desc: "Dossier de 8 referentes vinculados al tema personal.", fase: "Desarrollo", sesion: 4, criterioIds: ["ea.1.1", "ea.1.2"] },
        { id: "sa4a3", titulo: "Laboratorio de técnicas", desc: "Experimentación guiada: tinta, acrílico, collage y digital.", fase: "Desarrollo", sesion: 7, criterioIds: ["ea.2.1"] },
        { id: "sa4a4", titulo: "Producción de la obra", desc: "Desarrollo de la obra personal derivada del diario.", fase: "Desarrollo", sesion: 10, criterioIds: ["ea.2.1", "ea.3.1"] },
        { id: "sa4a5", titulo: "Presentación y crítica", desc: "Exposición oral de 5 minutos con ronda de preguntas.", fase: "Cierre", sesion: 12, criterioIds: ["ea.3.1"] },
      ],
      instrumentos: ["i7", "i8"],
    },
    {
      id: "sa5", programacionId: "p2", titulo: "Instalación efímera: memoria del lugar", eva: 2,
      inicio: toISO(new Date(c.y + 1, 0, 15)), fin: toISO(new Date(c.y + 1, 2, 6)), sesiones: 14,
      justificacion: "La instalación conecta espacio, memoria y comunidad. Una intervención efímera en el instituto obliga a negociar significados, materiales y tiempos, y deja huella sin dejar residuo.",
      reto: "Intervenir un espacio del centro para contar una memoria colectiva que dure solo una semana.",
      producto: "Instalación efímera colectiva en el pasillo central, documentada en vídeo y foto.",
      metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo", "Aprendizaje-servicio"],
      agrupamientos: "Comisiones (concepto, producción, montaje, documentación)", espacios: "Pasillo central, aula-taller, exteriores",
      recursos: "Materiales reutilizados, hilo, papel, luz, proyección, permiso de dirección",
      diversidad: "Comisiones por fortalezas, plan de trabajo visual, evaluación por proceso y no solo por producto.",
      evidencias: "Actas de comisiones, prototipo a escala, instalación, documental del proceso, coevaluación.",
      criterios: ["ea.2.2", "ea.3.2", "ea.4.1", "ea.4.2", "ea.5.2"],
      objetivos: ["Crear una pieza colectiva site-specific", "Combinar lenguajes (objeto, luz, sonido, texto)", "Comunicar el valor de la obra a la comunidad"],
      actividades: [
        { id: "sa5a1", titulo: "Memorias del instituto", desc: "Recogida de historias y objetos con entrevistas a la comunidad.", fase: "Inicio", sesion: 3, criterioIds: ["ea.4.2"] },
        { id: "sa5a2", titulo: "Concepto y prototipo", desc: "Propuestas por comisiones y maqueta a escala.", fase: "Desarrollo", sesion: 6, criterioIds: ["ea.2.2"] },
        { id: "sa5a3", titulo: "Producción", desc: "Fabricación de módulos, luz y piezas sonoras.", fase: "Desarrollo", sesion: 10, criterioIds: ["ea.2.2", "ea.4.1"] },
        { id: "sa5a4", titulo: "Montaje", desc: "Instalación en el pasillo en jornada intensiva.", fase: "Desarrollo", sesion: 12, criterioIds: ["ea.4.1"] },
        { id: "sa5a5", titulo: "Inauguración y desmontaje", desc: "Visita guiada, documental y reflexión final.", fase: "Cierre", sesion: 14, criterioIds: ["ea.3.2", "ea.5.2"] },
      ],
      instrumentos: ["i9", "i10", "i11"],
    },
    {
      id: "sa6", programacionId: "p3", titulo: "Vivienda bioclimática: del plano a la maqueta", eva: 1,
      inicio: D(14), fin: toISO(new Date(c.y + 1, 0, 30)), sesiones: 16,
      justificacion: "El proyecto de vivienda integra geometría, sistemas de representación, normalización y CAD en una secuencia real de trabajo técnico. La orientación bioclimática añade la dimensión de sostenibilidad exigida por el currículo.",
      reto: "Diseñar una vivienda de 90 m² para una parcela real de Santander que consuma la mitad de energía que una convencional.",
      producto: "Plano normalizado A2 + modelo 3D paramétrico + maqueta física a escala 1:100.",
      metodologias: ["Aprendizaje basado en proyectos", "Estudio de casos", "Gamificación"],
      agrupamientos: "Estudio técnico de 2 personas con especialización (proyecto/modelado)", espacios: "Aula de dibujo, aula CAD, taller de maquetas",
      recursos: "Tableros, estilógrafos, escalímetros, FreeCAD, cartón pluma, parcelario municipal",
      diversidad: "Plantillas normalizadas de plano, hitos intermedios con retroalimentación, pareja de apoyo en CAD.",
      evidencias: "Croquis acotados, plano A2 normalizado, archivo CAD, maqueta, memoria técnica breve.",
      criterios: ["dt.1.2", "dt.2.1", "dt.3.1", "dt.3.2", "dt.4.1"],
      objetivos: ["Resolver la geometría de la parcela y la vivienda", "Representar en diédrico y axonometría", "Normalizar el plano y modelar en CAD"],
      actividades: [
        { id: "sa6a1", titulo: "Levantamiento y geometría", desc: "Croquis acotado de la parcela y estudios de soleamiento.", fase: "Inicio", sesion: 2, criterioIds: ["dt.1.2"] },
        { id: "sa6a2", titulo: "Planta en diédrico", desc: "Distribución a escala 1:100 con sección por escalera.", fase: "Desarrollo", sesion: 6, criterioIds: ["dt.2.1"] },
        { id: "sa6a3", titulo: "Plano normalizado", desc: "Vistas, cortes, acotación y rotulación según norma.", fase: "Desarrollo", sesion: 10, criterioIds: ["dt.3.1", "dt.3.2"] },
        { id: "sa6a4", titulo: "Modelado CAD", desc: "Modelo paramétrico 3D en FreeCAD con exportación.", fase: "Desarrollo", sesion: 13, criterioIds: ["dt.4.1"] },
        { id: "sa6a5", titulo: "Maqueta y defensa", desc: "Maqueta 1:100 y defensa del proyecto ante el grupo.", fase: "Cierre", sesion: 16, criterioIds: ["dt.3.2"] },
      ],
      instrumentos: ["i12", "i13", "i14", "i15"],
    },
    {
      id: "sa7", programacionId: "p4", titulo: "Geometría del patrimonio cántabro", eva: 1,
      inicio: D(10), fin: D(55), sesiones: 14,
      justificacion: "La geometría plana cobra sentido cuando se aplica a la lectura del entorno. Esta SA conecta construcciones geométricas fundamentales con la arquitectura y el patrimonio próximo, dando contexto real a las láminas.",
      reto: "¿Cómo podemos reconstruir geométricamente la roseta de una iglesia románica de Cantabria?",
      producto: "Dossier de 4 láminas: tangencias, polígonos, roseta reconstruida y maqueta de proporción áurea.",
      metodologias: ["Aprendizaje basado en proyectos", "Estudio de casos", "Aprendizaje-servicio"],
      agrupamientos: "Individual + plenario de corrección", espacios: "Aula de dibujo y salida de campo",
      recursos: "Tableros, estilógrafos, escalímetros, fotografías del patrimonio, compases de precisión",
      diversidad: "Plantillas guía con niveles de complejidad, modelos resueltos, ampliación con rosetas de complejidad superior.",
      evidencias: "Láminas normalizadas, cuaderno de bocetos, memoria geométrica de la reconstrucción.",
      criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"],
      objetivos: ["Analizar la relación histórica entre matemáticas y dibujo geométrico", "Resolver gráficamente cálculos y transformaciones de geometría plana", "Trazar construcciones poligonales y tangencias con rigor", "Documentar gráficamente aplicando normas UNE/ISO"],
      actividades: [
        { id: "sa7a1", titulo: "Historia del dibujo técnico", desc: "De Thales y Euclides a las aplicaciones actuales en arquitectura e ingeniería.", fase: "Inicio", sesion: 2, criterioIds: ["dt1.1.1"] },
        { id: "sa7a2", titulo: "Proporcionalidad y polígonos", desc: "Cálculos gráficos, equivalencias, semejanza y polígonos regulares.", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.2.1", "dt1.2.2"] },
        { id: "sa7a3", titulo: "Tangencias y curvas técnicas", desc: "Resolución gráfica de tangencias y trazado de curvas con rigor.", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.2.3"] },
        { id: "sa7a4", titulo: "Salida de campo: patrimonio cántabro", desc: "Fotografía y análisis geométrico de rosetas y portadas románicas.", fase: "Desarrollo", sesion: 11, criterioIds: ["dt1.1.1", "dt1.2.2"] },
        { id: "sa7a5", titulo: "Documentación normalizada", desc: "Vistas acotadas aplicando normas UNE/ISO, escalas y formatos.", fase: "Cierre", sesion: 14, criterioIds: ["dt1.4.1", "dt1.4.2"] },
      ],
      instrumentos: ["i17", "i18", "i19", "i22"],
    },
    {
      id: "sa8", programacionId: "p4", titulo: "Pieza en sistema diédrico: del croquis al plano", eva: 2,
      inicio: toISO(new Date(c.y + 1, 0, 10)), fin: toISO(new Date(c.y + 1, 1, 28)), sesiones: 12,
      justificacion: "El sistema diédrico es el lenguaje universal del diseño técnico. Esta SA lleva al alumnado desde el croquis a mano alzada hasta el plano normalizado, integrando verdadera magnitud y acotación.",
      reto: "¿Cómo comunicar con precisión una pieza mecánica compleja usando solo líneas y números?",
      producto: "Croquis acotado + plano normalizado A3 con vistas, corte y acotación completa.",
      metodologias: ["Aprendizaje basado en proyectos", "Gamificación"],
      agrupamientos: "Individual con tutorías de proceso", espacios: "Aula de dibujo",
      recursos: "Piezas mecánicas reales, tableros, estilógrafos, escalímetros, normas UNE",
      diversidad: "Piezas con niveles de complejidad graduada, plantillas de acotación, modelos 3D de apoyo.",
      evidencias: "Croquis acotado, plano normalizado, memoria del proceso.",
      criterios: ["dt1.3.1", "dt1.3.2", "dt1.3.5", "dt1.4.1", "dt1.4.2"],
      objetivos: ["Representar en sistema diédrico elementos básicos determinando pertenencia, posición y distancia", "Definir elementos en sistemas axonométricos", "Valorar el rigor gráfico del proceso de resolución", "Documentar gráficamente objetos mediante vistas acotadas aplicando UNE/ISO", "Utilizar el croquis como elemento de reflexión"],
      actividades: [
        { id: "sa8a1", titulo: "Fundamentos del sistema diédrico", desc: "Representación de punto, recta y plano. Trazas y pertenencia.", fase: "Inicio", sesion: 2, criterioIds: ["dt1.3.1"] },
        { id: "sa8a2", titulo: "Relaciones entre elementos", desc: "Intersecciones, paralelismo, perpendicularidad y distancias.", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.3.1", "dt1.3.5"] },
        { id: "sa8a3", titulo: "Sistemas axonométricos", desc: "Perspectivas isométrica y caballera con coeficientes de reducción.", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.3.2"] },
        { id: "sa8a4", titulo: "Croquis como herramienta de reflexión", desc: "Croquizado a mano alzada como elemento de indagación de soluciones.", fase: "Desarrollo", sesion: 10, criterioIds: ["dt1.4.2"] },
        { id: "sa8a5", titulo: "Documentación gráfica normalizada", desc: "Vistas acotadas aplicando normas UNE/ISO, escalas y formatos.", fase: "Cierre", sesion: 12, criterioIds: ["dt1.4.1", "dt1.3.5"] },
      ],
      instrumentos: ["i20", "i21", "i22"],
    },
    {
      id: "sa9", programacionId: "p4", titulo: "Proyecto CAD: diseño paramétrico de mobiliario", eva: 3,
      inicio: toISO(new Date(c.y + 1, 2, 25)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 14,
      justificacion: "El CAD paramétrico es el lenguaje del diseño técnico contemporáneo. Esta SA cierra el curso con un proyecto real de mobiliario que integra geometría, diédrico, normalización y modelado digital.",
      reto: "Diseñar una pieza de mobiliario modular para el aula que sea funcional, sostenible y fabricable.",
      producto: "Modelo 3D paramétrico + plano normalizado A2 + maqueta a escala 1:10.",
      metodologias: ["Aprendizaje basado en proyectos", "Design thinking", "Aprendizaje cooperativo"],
      agrupamientos: "Parejas de diseño", espacios: "Aula de dibujo y aula CAD",
      recursos: "FreeCAD, tableros, materiales para maqueta, impresora 3D (opcional)",
      diversidad: "Plantillas CAD con restricciones predefinidas, tutorías de proceso, ampliación con animaciones.",
      evidencias: "Modelo CAD, plano normalizado, maqueta, memoria técnica.",
      criterios: ["dt1.3.4", "dt1.5.1", "dt1.5.2"],
      objetivos: ["Dibujar elementos en el espacio empleando la perspectiva cónica", "Crear figuras planas y tridimensionales mediante programas de dibujo vectorial", "Recrear virtualmente piezas en 3D aplicando operaciones con primitivas para proyectos en grupo"],
      actividades: [
        { id: "sa9a1", titulo: "Sistema cónico", desc: "Fundamentos y elementos del sistema. Perspectiva frontal y oblicua aplicada al diseño.", fase: "Inicio", sesion: 2, criterioIds: ["dt1.3.4"] },
        { id: "sa9a2", titulo: "Aplicaciones vectoriales 2D-3D", desc: "Introducción al CAD: herramientas de dibujo vectorial y técnicas asociadas.", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.5.1"] },
        { id: "sa9a3", titulo: "Fundamentos de diseño 3D", desc: "Modelado de caja y operaciones básicas con primitivas.", fase: "Desarrollo", sesion: 9, criterioIds: ["dt1.5.1", "dt1.5.2"] },
        { id: "sa9a4", titulo: "Proyecto en grupo", desc: "Conformar piezas complejas a partir de otras más sencillas mediante trabajo colaborativo.", fase: "Desarrollo", sesion: 12, criterioIds: ["dt1.5.2"] },
        { id: "sa9a5", titulo: "Presentación del proyecto", desc: "Defensa del proyecto virtual y su aplicación en profesiones actuales.", fase: "Cierre", sesion: 14, criterioIds: ["dt1.5.2"] },
      ],
      instrumentos: ["i23"],
    },
    {
      id: "sa10", programacionId: "p5", titulo: "Escuchar el mundo: análisis de podcasts de referencia", eva: 1,
      inicio: D(12), fin: D(48), sesiones: 10,
      justificacion: "Antes de producir, hay que escuchar con criterio. Esta SA entrena la escucha crítica mediante el análisis de podcasts de referencia, identificando géneros, estructuras y recursos narrativos.",
      reto: "¿Qué hace que un podcast te atrape desde el primer minuto?",
      producto: "Dossier de análisis de 5 podcasts + podcast-reseña de 5 minutos.",
      metodologias: ["Aprendizaje basado en proyectos", "Aula invertida", "Estudio de casos"],
      agrupamientos: "Individual + plenario de escucha", espacios: "Aula con equipos de audio",
      recursos: "Auriculares, plataforma de podcasts, fichas de análisis, grabadora",
      diversidad: "Podcasts con transcripciones, fichas con pictogramas, ampliación con análisis comparativos.",
      evidencias: "Dossier de análisis, podcast-reseña, ficha de autoevaluación.",
      criterios: ["tp.1.1", "tp.1.2", "tp.5.1"],
      objetivos: ["Analizar críticamente podcasts de referencia", "Identificar géneros y recursos narrativos", "Producir un podcast-reseña"],
      actividades: [
        { id: "sa10a1", titulo: "Historia del podcasting", desc: "De la radio analógica al podcasting contemporáneo.", fase: "Inicio", sesion: 2, criterioIds: ["tp.1.1"] },
        { id: "sa10a2", titulo: "Escucha crítica guiada", desc: "Análisis de 3 podcasts con ficha estructurada.", fase: "Desarrollo", sesion: 5, criterioIds: ["tp.1.1", "tp.1.2"] },
        { id: "sa10a3", titulo: "Ética y responsabilidad", desc: "Derechos de autor, verificación y tratamiento de la diversidad.", fase: "Desarrollo", sesion: 7, criterioIds: ["tp.5.1"] },
        { id: "sa10a4", titulo: "Producción del podcast-reseña", desc: "Guion, grabación y edición de una reseña de 5 minutos.", fase: "Desarrollo", sesion: 9, criterioIds: ["tp.1.1"] },
        { id: "sa10a5", titulo: "Audición colectiva", desc: "Escucha compartida y retroalimentación.", fase: "Cierre", sesion: 10, criterioIds: ["tp.1.2"] },
      ],
      instrumentos: ["i24", "i25"],
    },
    {
      id: "sa11", programacionId: "p5", titulo: "La voz como instrumento: guion y narrativa sonora", eva: 2,
      inicio: toISO(new Date(c.y + 1, 0, 14)), fin: toISO(new Date(c.y + 1, 1, 20)), sesiones: 11,
      justificacion: "El guion es el esqueleto del podcast. Esta SA trabaja la escritura radiofónica, la voz como herramienta expresiva y el diseño sonoro, preparando al alumnado para el proyecto final.",
      reto: "¿Cómo contar una historia de 8 minutos que nadie quiera interrumpir?",
      producto: "Guion técnico completo + episodio piloto de 8 minutos con diseño sonoro.",
      metodologias: ["Aprendizaje basado en proyectos", "Design thinking", "Gamificación"],
      agrupamientos: "Equipos de 3 con roles rotativos", espacios: "Aula con cabina de grabación",
      recursos: "Micrófonos, cabina insonorizada, DAW (Audacity/Reaper), biblioteca sonora",
      diversidad: "Plantillas de guion con andamiaje, roles ajustados a fortalezas, transcripciones de apoyo.",
      evidencias: "Escaleta, guion técnico, guion literario, episodio piloto, ficha de coevaluación.",
      criterios: ["tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2"],
      objetivos: ["Elaborar guiones técnicos y literarios", "Diseñar el paisaje sonoro", "Grabar y editar con calidad técnica"],
      actividades: [
        { id: "sa11a1", titulo: "Estructura del guion radiofónico", desc: "Escaleta, guion técnico y guion literario.", fase: "Inicio", sesion: 2, criterioIds: ["tp.2.1"] },
        { id: "sa11a2", titulo: "La voz como herramienta", desc: "Dicción, entonación, intención y ritmo.", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.2.2"] },
        { id: "sa11a3", titulo: "Diseño sonoro", desc: "Música, ambientes, efectos y silencios con intención.", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.2.2"] },
        { id: "sa11a4", titulo: "Grabación del episodio", desc: "Captación de voces y ambientes con técnicas profesionales.", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.3.1"] },
        { id: "sa11a5", titulo: "Edición y masterización", desc: "Corte, mezcla, ecualización y exportación en DAW.", fase: "Desarrollo", sesion: 10, criterioIds: ["tp.3.2"] },
        { id: "sa11a6", titulo: "Audición y coevaluación", desc: "Escucha colectiva y retroalimentación estructurada.", fase: "Cierre", sesion: 11, criterioIds: ["tp.3.2"] },
      ],
      instrumentos: ["i26", "i27", "i28"],
    },
    {
      id: "sa12", programacionId: "p5", titulo: "Proyecto final: miniserie de podcast", eva: 3,
      inicio: toISO(new Date(c.y + 1, 2, 24)), fin: toISO(new Date(c.y + 1, 4, 28)), sesiones: 15,
      justificacion: "El proyecto final integra todos los aprendizajes del curso en una miniserie de 3 episodios publicada en plataformas digitales. Es el cierre natural del taller y deja huella real.",
      reto: "Crear una miniserie de podcast que merezca ser escuchada más allá del aula.",
      producto: "Miniserie de 3 episodios (10-12 min cada uno) publicada en plataformas + identidad sonora y gráfica completa.",
      metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo", "Aprendizaje-servicio"],
      agrupamientos: "Equipos de producción con roles especializados", espacios: "Aula, cabina, exteriores para grabación",
      recursos: "Equipos de grabación, DAW, plataformas de podcast, dominio web (opcional)",
      diversidad: "Roles ajustados a fortalezas, hitos intermedios con retroalimentación, tutorías de proceso.",
      evidencias: "Miniserie publicada, identidad sonora y gráfica, memoria del proyecto, autoevaluación y coevaluación.",
      criterios: ["tp.3.3", "tp.4.1", "tp.4.2", "tp.5.2"],
      objetivos: ["Planificar y ejecutar un proyecto de podcast completo", "Publicar en plataformas digitales", "Evaluar el impacto social del proyecto"],
      actividades: [
        { id: "sa12a1", titulo: "Planificación del proyecto", desc: "Definición de roles, cronograma, entregables y recursos.", fase: "Inicio", sesion: 2, criterioIds: ["tp.4.1"] },
        { id: "sa12a2", titulo: "Identidad sonora y gráfica", desc: "Cabecera, sintonía, portada y metadatos.", fase: "Desarrollo", sesion: 5, criterioIds: ["tp.3.3"] },
        { id: "sa12a3", titulo: "Producción de episodios", desc: "Guion, grabación y edición de los 3 episodios.", fase: "Desarrollo", sesion: 9, criterioIds: ["tp.4.1"] },
        { id: "sa12a4", titulo: "Publicación y difusión", desc: "Subida a plataformas, RSS y comunicación con la audiencia.", fase: "Desarrollo", sesion: 12, criterioIds: ["tp.4.2"] },
        { id: "sa12a5", titulo: "Evaluación del impacto", desc: "Análisis de audiencia, retroalimentación y mejora.", fase: "Cierre", sesion: 14, criterioIds: ["tp.5.2"] },
        { id: "sa12a6", titulo: "Estreno y celebración", desc: "Audición colectiva, invitación a la comunidad y cierre.", fase: "Cierre", sesion: 15, criterioIds: ["tp.4.2", "tp.5.2"] },
      ],
      instrumentos: ["i29", "i30", "i31"],
    },
  ];

  const units: Unit[] = [
    { id: "u1", programacionId: "p1", titulo: "Percepción y comunicación visual", inicio: D(14), fin: D(60), sesiones: 17, saIds: ["sa1"], criterios: ["epva.1.1", "epva.2.1", "epva.3.1"] },
    { id: "u2", programacionId: "p1", titulo: "Narrativa audiovisual", inicio: toISO(new Date(c.y + 1, 0, 8)), fin: toISO(new Date(c.y + 1, 1, 20)), sesiones: 9, saIds: ["sa2"], criterios: ["epva.1.2", "epva.2.2", "epva.3.2", "epva.5.1"] },
    { id: "u3", programacionId: "p1", titulo: "Patrimonio y entorno próximo", inicio: toISO(new Date(c.y + 1, 2, 21)), fin: toISO(new Date(c.y + 1, 4, 22)), sesiones: 10, saIds: ["sa3"], criterios: ["epva.4.1", "epva.4.2", "epva.5.2"] },
    { id: "u4", programacionId: "p2", titulo: "El proceso creador", inicio: D(21), fin: D(70), sesiones: 12, saIds: ["sa4"], criterios: ["ea.1.1", "ea.1.2", "ea.2.1", "ea.3.1"] },
    { id: "u5", programacionId: "p2", titulo: "Espacio, memoria y comunidad", inicio: toISO(new Date(c.y + 1, 0, 15)), fin: toISO(new Date(c.y + 1, 2, 6)), sesiones: 14, saIds: ["sa5"], criterios: ["ea.2.2", "ea.4.1", "ea.5.2"] },
    { id: "u6", programacionId: "p3", titulo: "Geometría, sistemas y proyecto", inicio: D(14), fin: toISO(new Date(c.y + 1, 0, 30)), sesiones: 16, saIds: ["sa6"], criterios: ["dt.1.2", "dt.2.1", "dt.3.1", "dt.4.1"] },
    { id: "u7", programacionId: "p4", titulo: "Fundamentos geométricos y patrimonio", inicio: D(10), fin: D(55), sesiones: 14, saIds: ["sa7"], criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"] },
    { id: "u8", programacionId: "p4", titulo: "Geometría descriptiva y documentación gráfica", inicio: toISO(new Date(c.y + 1, 0, 10)), fin: toISO(new Date(c.y + 1, 1, 28)), sesiones: 12, saIds: ["sa8"], criterios: ["dt1.3.1", "dt1.3.2", "dt1.3.5", "dt1.4.1", "dt1.4.2"] },
    { id: "u9", programacionId: "p4", titulo: "Sistemas CAD y representación digital", inicio: toISO(new Date(c.y + 1, 2, 25)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 14, saIds: ["sa9"], criterios: ["dt1.3.4", "dt1.5.1", "dt1.5.2"] },
    { id: "u10", programacionId: "p5", titulo: "Cultura sonora y análisis crítico", inicio: D(12), fin: D(48), sesiones: 10, saIds: ["sa10"], criterios: ["tp.1.1", "tp.1.2", "tp.5.1"] },
    { id: "u11", programacionId: "p5", titulo: "Guion y producción sonora", inicio: toISO(new Date(c.y + 1, 0, 14)), fin: toISO(new Date(c.y + 1, 1, 20)), sesiones: 11, saIds: ["sa11"], criterios: ["tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2"] },
    { id: "u12", programacionId: "p5", titulo: "Proyecto final: miniserie de podcast", inicio: toISO(new Date(c.y + 1, 2, 24)), fin: toISO(new Date(c.y + 1, 4, 28)), sesiones: 15, saIds: ["sa12"], criterios: ["tp.3.3", "tp.4.1", "tp.4.2", "tp.5.2"] },
  ];

  const instruments: Instrument[] = [
    { id: "i1", subjectId: "m1", nombre: "Lista de cotejo · láminas y bocetos", tipo: "lista", peso: 15, criterioIds: ["epva.2.1", "epva.1.1"], fecha: D(25) },
    { id: "i2", subjectId: "m1", nombre: "Rúbrica · pieza plástica (cartel)", tipo: "rubrica", peso: 35, criterioIds: ["epva.2.1", "epva.3.1"], fecha: D(48), rubrica: NIVELES_RUBRICA },
    { id: "i3", subjectId: "m1", nombre: "Prueba escrita · lenguaje visual", tipo: "escrita", peso: 20, criterioIds: ["epva.1.1", "epva.1.2"], fecha: D(60) },
    { id: "i4", subjectId: "m1", nombre: "Proyecto audiovisual · stop-motion", tipo: "proyecto", peso: 20, criterioIds: ["epva.2.2", "epva.5.1"], fecha: D(110) },
    { id: "i5", subjectId: "m1", nombre: "Portfolio del proceso", tipo: "portfolio", peso: 10, criterioIds: ["epva.3.2", "epva.5.2"], fecha: D(150) },
    { id: "i6", subjectId: "m1", nombre: "Autoevaluación y coevaluación", tipo: "autoevaluacion", peso: 10, criterioIds: ["epva.5.1", "epva.5.2"], fecha: D(150) },
    { id: "i7", subjectId: "m2", nombre: "Diario artístico del proceso", tipo: "portfolio", peso: 15, criterioIds: ["ea.1.1", "ea.1.2"], fecha: D(30) },
    { id: "i8", subjectId: "m2", nombre: "Rúbrica · obra personal", tipo: "rubrica", peso: 35, criterioIds: ["ea.2.1", "ea.3.1"], fecha: D(65), rubrica: NIVELES_RUBRICA },
    { id: "i9", subjectId: "m2", nombre: "Exposición oral del proyecto", tipo: "exposicion", peso: 15, criterioIds: ["ea.3.2"], fecha: D(115) },
    { id: "i10", subjectId: "m2", nombre: "Prueba práctica · técnicas mixtas", tipo: "practica", peso: 20, criterioIds: ["ea.2.1", "ea.2.2"], fecha: D(100) },
    { id: "i11", subjectId: "m2", nombre: "Coevaluación de la instalación", tipo: "coevaluacion", peso: 15, criterioIds: ["ea.4.1", "ea.5.2"], fecha: D(160) },
    { id: "i12", subjectId: "m3", nombre: "Láminas de geometría · escala de valoración", tipo: "escala", peso: 20, criterioIds: ["dt.1.1", "dt.1.2"], fecha: D(30) },
    { id: "i13", subjectId: "m3", nombre: "Prueba práctica · diédrico y axonometría", tipo: "practica", peso: 30, criterioIds: ["dt.2.1", "dt.2.2"], fecha: D(70) },
    { id: "i14", subjectId: "m3", nombre: "Proyecto CAD · vivienda paramétrica", tipo: "digital", peso: 25, criterioIds: ["dt.4.1", "dt.4.2"], fecha: D(120) },
    { id: "i15", subjectId: "m3", nombre: "Rúbrica · plano normalizado", tipo: "rubrica", peso: 15, criterioIds: ["dt.3.1", "dt.3.2"], fecha: D(140), rubrica: NIVELES_RUBRICA },
    { id: "i16", subjectId: "m3", nombre: "Observación directa del trabajo en aula", tipo: "observacion", peso: 10, criterioIds: ["dt.3.1", "dt.1.1"], fecha: D(40) },
    /* Dibujo Técnico I - criterios LOMLOE oficiales */
    { id: "i17", subjectId: "m5", nombre: "Prueba escrita · historia y fundamentos geométricos", tipo: "escrita", peso: 10, criterioIds: ["dt1.1.1"], fecha: D(30) },
    { id: "i18", subjectId: "m5", nombre: "Escala de valoración · láminas de geometría plana", tipo: "escala", peso: 20, criterioIds: ["dt1.2.1", "dt1.2.2", "dt1.2.3"], fecha: D(50) },
    { id: "i19", subjectId: "m5", nombre: "Rúbrica · rigor gráfico y precisión", tipo: "rubrica", peso: 10, criterioIds: ["dt1.3.5"], fecha: D(55), rubrica: NIVELES_RUBRICA },
    { id: "i20", subjectId: "m5", nombre: "Prueba práctica · sistema diédrico y axonométrico", tipo: "practica", peso: 25, criterioIds: ["dt1.3.1", "dt1.3.2", "dt1.3.3"], fecha: D(95) },
    { id: "i21", subjectId: "m5", nombre: "Rúbrica · perspectiva cónica", tipo: "rubrica", peso: 10, criterioIds: ["dt1.3.4"], fecha: D(100), rubrica: NIVELES_RUBRICA },
    { id: "i22", subjectId: "m5", nombre: "Plano normalizado · vistas acotadas UNE/ISO", tipo: "proyecto", peso: 15, criterioIds: ["dt1.4.1", "dt1.4.2"], fecha: D(110) },
    { id: "i23", subjectId: "m5", nombre: "Proyecto CAD · figuras 2D y modelado 3D", tipo: "digital", peso: 10, criterioIds: ["dt1.5.1", "dt1.5.2"], fecha: D(150) },
    /* Taller de Podcast */
    { id: "i24", subjectId: "m6", nombre: "Dossier de análisis de podcasts", tipo: "proyecto", peso: 15, criterioIds: ["tp.1.1", "tp.1.2"], fecha: D(35) },
    { id: "i25", subjectId: "m6", nombre: "Podcast-reseña de 5 minutos", tipo: "digital", peso: 20, criterioIds: ["tp.1.1", "tp.5.1"], fecha: D(45) },
    { id: "i26", subjectId: "m6", nombre: "Rúbrica · guion técnico y literario", tipo: "rubrica", peso: 20, criterioIds: ["tp.2.1", "tp.2.2"], fecha: D(85), rubrica: NIVELES_RUBRICA },
    { id: "i27", subjectId: "m6", nombre: "Episodio piloto · calidad técnica y narrativa", tipo: "digital", peso: 25, criterioIds: ["tp.3.1", "tp.3.2"], fecha: D(95) },
    { id: "i28", subjectId: "m6", nombre: "Coevaluación del episodio piloto", tipo: "coevaluacion", peso: 10, criterioIds: ["tp.3.2"], fecha: D(100) },
    { id: "i29", subjectId: "m6", nombre: "Rúbrica · miniserie de podcast", tipo: "rubrica", peso: 40, criterioIds: ["tp.3.3", "tp.4.1", "tp.4.2"], fecha: D(160), rubrica: NIVELES_RUBRICA },
    { id: "i30", subjectId: "m6", nombre: "Identidad sonora y gráfica", tipo: "proyecto", peso: 15, criterioIds: ["tp.3.3"], fecha: D(140) },
    { id: "i31", subjectId: "m6", nombre: "Autoevaluación y memoria del proyecto", tipo: "autoevaluacion", peso: 10, criterioIds: ["tp.5.2"], fecha: D(165) },
  ];

  /* calificaciones deterministas a partir del perfil de cada estudiante */
  const grades: Grade[] = [];
  const hoyD = now;
  for (const ins of instruments) {
    if (!ins.fecha || ins.fecha > toISO(hoyD)) continue;
    const subject = subjects.find((s) => s.id === ins.subjectId)!;
    const grupo = students.filter((s) => s.groupId === subject.grupoId);
    for (const st of grupo) {
      for (const crId of ins.criterioIds) {
        const h = hash01(`${ins.id}|${st.id}|${crId}`);
        const v = Math.max(1, Math.min(10, st.base + (h - 0.5) * 3.4 + (ins.tipo === "autoevaluacion" || ins.tipo === "coevaluacion" ? 0.4 : 0)));
        grades.push({ id: `${ins.id}·${st.id}·${crId}`, studentId: st.id, instrumentoId: ins.id, criterioId: crId, value: Math.round(v * 10) / 10, fecha: ins.fecha });
      }
    }
  }

  /* asistencia de las últimas sesiones */
  const attendance: AttRec[] = [];
  for (const g of groups) {
    const past = sessionsFor(g, c.start, hoyD).slice(-22);
    const grupo = students.filter((s) => s.groupId === g.id);
    for (const d of past) {
      const iso = toISO(d);
      for (const st of grupo) {
        const h = hash01(`att|${st.id}|${iso}`);
        const estado: "P" | "F" | "R" = h < st.absRate ? (hash01(`r|${st.id}|${iso}`) < 0.3 ? "R" : "F") : "P";
        attendance.push({ id: `a|${st.id}|${iso}`, groupId: g.id, fecha: iso, studentId: st.id, estado });
      }
    }
  }

  const observations: Obs[] = [
    { id: "o1", studentId: "g1-s6", fecha: D(30), texto: "Responde muy bien a las instrucciones pautadas en pasos cortos. Mantener el apoyovisual en las fases de boceto.", autor: "Laura Gómez" },
    { id: "o2", studentId: "g1-s3", fecha: D(45), texto: "Propuesta de ampliación aceptada: diseñará la identidad visual completa de la campaña.", autor: "Laura Gómez" },
    { id: "o3", studentId: "g1-s12", fecha: D(50), texto: "Mejora notable en la limpieza del trazo. Reforzar la justificación verbal de sus decisiones.", autor: "Laura Gómez" },
    { id: "o4", studentId: "g2-s6", fecha: D(40), texto: "Dificultades para planificar el trabajo semanal. Se le asigna pareja de crítica con June.", autor: "Laura Gómez" },
    { id: "o5", studentId: "g3-s6", fecha: D(35), texto: "Lagunas en construcciones básicas: repasa tangencias con el cuaderno de verano antes de diédrico.", autor: "Miguel Ruiz" },
    { id: "o6", studentId: "g3-s9", fecha: D(55), texto: "Trabajo excelente; candidata para la exposición del certamen regional de dibujo técnico.", autor: "Miguel Ruiz" },
  ];

  const measures: Measure[] = [
    { id: "d1", tipo: "NEAE", titulo: "Adaptaciones de acceso · Daniel Herrera", desc: "Instrucciones en pasos numerados, apoyos visuales, tiempo ampliado en pruebas escritas y ubicación próxima al docente. Coordinado con Orientación.", studentId: "g1-s6", groupId: "g1" },
    { id: "d2", tipo: "Refuerzo", titulo: "Plan de refuerzo de expresión gráfica · Mateo", desc: "Sesiones breves de trazo y encaje con modelos guiados; revisión quincenal del cuaderno de bocetos.", studentId: "g1-s12", groupId: "g1" },
    { id: "d3", tipo: "Ampliación", titulo: "Identidad visual de la campaña · Carla", desc: "Extensión del reto del cartel al sistema completo de identidad (logotipo, paleta, aplicaciones).", studentId: "g1-s9", groupId: "g1" },
    { id: "d4", tipo: "Inclusión", titulo: "Roles rotativos en equipos de stop-motion", desc: "Medida de grupo: rotación de roles con guías de función para garantizar la participación equitativa.", groupId: "g1" },
    { id: "d5", tipo: "Metodológica", titulo: "Andamiaje de planificación · Marcos", desc: "Plantilla semanal de objetivos del proyecto con visto bueno del docente cada jueves.", studentId: "g2-s6", groupId: "g2" },
    { id: "d6", tipo: "Recuperación", titulo: "Cuaderno de tangencias · Rubén", desc: "Repaso estructurado de construcciones fundamentales antes de abordar la sección de diédrico.", studentId: "g3-s6", groupId: "g3" },
  ];

  const recoveries: Recovery[] = [
    { id: "r1", studentId: "g1-s6", criterioId: "epva.1.1", actividad: "Cuaderno de análisis de imágenes: 6 láminas comentadas con vocabulario técnico", fecha: D(80), instrumentoId: "i3" },
    { id: "r2", studentId: "g2-s6", criterioId: "ea.2.1", actividad: "Serie de tres estudios de color derivados del diario artístico", fecha: D(120), instrumentoId: "i10" },
  ];

  return {
    version: 5,
    role: "profesor",
    teacherId: "t1",
    cursoLabel: c.label,
    teachers, groups, students, subjects, programaciones, sas, units,
    instruments, grades, attendance, observations, measures, recoveries,
  };
}
