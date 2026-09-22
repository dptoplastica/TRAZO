export interface Teacher { id: string; nombre: string; email: string; rol: "profesor" | "admin"; color: string; }
export interface Group { id: string; nombre: string; nivel: string; tutorId: string; dias: number[]; }
export interface Student { id: string; groupId: string; nombre: string; base: number; neae?: string; absRate: number; hue: number; }
export interface Subject { id: string; nombre: string; corto: string; etapa: string; nivel: string; curriculumId: string; teacherId?: string; grupoId: string; color: string; tipo: "obligatoria" | "optativa"; }
export interface Programacion { id: string; subjectId: string; curso: string; estado: "Borrador" | "En revisión" | "Finalizada"; contexto: { centro: string; entorno: string; alumnado: string; recursos: string; diversidad: string; }; criterios: string[]; ponderaciones: Record<string, number>; ccalificacion: string; actualizada: string; }
export interface PDFFile { name: string; data: string; size: number; addedAt: string; }
export interface Actividad { id: string; titulo: string; desc: string; fase: "Inicio" | "Desarrollo" | "Cierre"; sesion: number; criterioIds: string[]; pdfs?: PDFFile[]; }
export interface SA { id: string; programacionId: string; titulo: string; eva: 1 | 2 | 3; inicio: string; fin: string; sesiones: number; justificacion: string; reto: string; producto: string; metodologias: string[]; agrupamientos: string; espacios: string; recursos: string; diversidad: string; evidencias: string; criterios: string[]; objetivos: string[]; actividades: Actividad[]; instrumentos: string[]; }
export interface Unit { id: string; programacionId: string; titulo: string; inicio: string; fin: string; sesiones: number; saIds: string[]; criterios: string[]; }
export interface RubricaNivel { id: string; nombre: string; valor: number; desc: string; }
export type TipoInstrumento = "rubrica" | "escala" | "lista" | "escrita" | "practica" | "proyecto" | "portfolio" | "observacion" | "lamina" | "exposicion" | "digital" | "autoevaluacion" | "coevaluacion";
export interface Instrument { id: string; subjectId: string; nombre: string; tipo: TipoInstrumento; peso: number; criterioIds: string[]; fecha?: string; rubrica?: RubricaNivel[]; }
export interface Grade { id: string; studentId: string; instrumentoId: string; criterioId: string; value: number; fecha: string; }
export interface AttRec { id: string; groupId: string; fecha: string; studentId: string; estado: "P" | "F" | "R"; }
export interface Obs { id: string; studentId: string; fecha: string; texto: string; autor: string; }
export interface Measure { id: string; tipo: string; titulo: string; desc: string; studentId?: string; groupId?: string; }
export interface Recovery { id: string; studentId: string; criterioId: string; actividad: string; fecha: string; instrumentoId: string; resultado?: number; }

export interface AppData {
  version: number; role: "profesor" | "admin"; teacherId: string; cursoLabel: string;
  teachers: Teacher[]; groups: Group[]; students: Student[]; subjects: Subject[];
  programaciones: Programacion[]; sas: SA[]; units: Unit[]; instruments: Instrument[];
  grades: Grade[]; attendance: AttRec[]; observations: Obs[]; measures: Measure[]; recoveries: Recovery[];
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (iso: string) => new Date(iso + "T12:00:00");
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export function cursoInfo(now = new Date()) {
  const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    label: `${y}-${String(y + 1).slice(2)}`, y,
    start: new Date(y, 8, 10), end: new Date(y + 1, 5, 22),
    evas: [
      { n: 1 as const, label: "1ª evaluación", inicio: new Date(y, 8, 10), fin: new Date(y, 11, 22) },
      { n: 2 as const, label: "2ª evaluación", inicio: new Date(y + 1, 0, 8), fin: new Date(y + 1, 2, 20) },
      { n: 3 as const, label: "3ª evaluación", inicio: new Date(y + 1, 2, 21), fin: new Date(y + 1, 5, 22) },
    ],
  };
}

export const evaDeFecha = (d: Date) => { const c = cursoInfo(d); if (d <= c.evas[0].fin) return 1 as const; if (d <= c.evas[1].fin) return 2 as const; return 3 as const; };

export function sessionsFor(g: Group, start: Date, end: Date): Date[] {
  const out: Date[] = []; const d = new Date(start);
  while (d <= end) { if (g.dias.includes(d.getDay())) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
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
  { id: "NI", nombre: "En inicio", valor: 3, desc: "Aproximación inicial al criterio: requiere apoyo continuo." },
  { id: "ND", nombre: "En desarrollo", valor: 5.5, desc: "Avanza hacia el criterio con autonomía creciente." },
  { id: "NA", nombre: "Adquirido", valor: 8, desc: "Aplica el criterio con autonomía y adecuación." },
  { id: "NE", nombre: "Excelente", valor: 9.5, desc: "Domina el criterio y lo transfiere con creatividad." },
];

export const METODOLOGIAS = ["Aprendizaje basado en proyectos", "Aprendizaje basado en retos", "Design thinking", "Aprendizaje cooperativo", "Aula invertida", "Estudio de casos", "Pensamiento de diseño", "Aprendizaje-servicio", "Gamificación"];

const CONTEXTO = {
  centro: "IES Lope de Vega (Santa María de Cayón, Cantabria). Instituto público de Educación Secundaria, Bachillerato y Ciclos Formativos. Departamento de Dibujo con aula-taller, aula de informática con software CAD y de edición audiovisual.",
  entorno: "Santa María de Cayón, Valle de Cayón, comarca con rico patrimonio románico. Entorno rural-urbano con vías verdes y arquitectura histórica.",
  alumnado: "Grupos heterogéneos con motivación hacia la creación plástica y audiovisual. Presencia de alumnado con NEAE que requiere adaptaciones.",
  recursos: "Aula-taller con mesas de dibujo, materiales fungibles, cámaras, tabletas gráficas, aula de informática con FreeCAD, Krita, DaVinci Resolve y GIMP.",
  diversidad: "Medidas ordinarias (agrupamientos flexibles, instrucciones pautadas, tiempos ampliados) y adaptaciones coordinadas con Orientación.",
};

export function buildSeed(): AppData {
  const now = new Date(); const hoy = toISO(now); const c = cursoInfo(now);
  const D = (n: number) => toISO(addDays(c.start, n));

  const teachers: Teacher[] = [
    { id: "t1", nombre: "Laura Gómez", email: "laura.gomez@educantabria.es", rol: "profesor", color: "#0e7c66" },
    { id: "t2", nombre: "Miguel Ruiz", email: "miguel.ruiz@educantabria.es", rol: "profesor", color: "#2c6e8f" },
    { id: "t3", nombre: "Carmen Prieto", email: "carmen.prieto@educantabria.es", rol: "admin", color: "#d9532c" },
  ];

  const groups: Group[] = [
    { id: "g1", nombre: "4º ESO A", nivel: "4º ESO", tutorId: "t1", dias: [1, 3] },
    { id: "g2", nombre: "1º Bach A", nivel: "1º Bachillerato", tutorId: "t1", dias: [2, 4] },
    { id: "g3", nombre: "2º Bach B", nivel: "2º Bachillerato", tutorId: "t2", dias: [1, 4] },
    { id: "g4", nombre: "1º Bach B", nivel: "1º Bachillerato", tutorId: "t2", dias: [2, 5] },
    { id: "g5", nombre: "1º Bach C", nivel: "1º Bachillerato", tutorId: "t1", dias: [3, 5] },
    { id: "g6", nombre: "2º Bach A", nivel: "2º Bachillerato", tutorId: "t1", dias: [1, 3, 4] },
  ];

  const mk = (groupId: string, rows: [string, number, number, string?][], hue0: number) =>
    rows.map(([nombre, base, absRate, neae], i) => ({ id: `${groupId}-s${i + 1}`, groupId, nombre, base, absRate, neae, hue: (hue0 + i * 29) % 360 }));

  const students: Student[] = [
    ...mk("g1", [["Lucía Fernández", 7.8, 0.03], ["Marco Ruiz", 6.4, 0.06], ["Aitana Sáiz", 8.6, 0.02], ["Hugo Cobo", 5.6, 0.08], ["Valeria Ríos", 7.1, 0.04], ["Daniel Herrera", 4.3, 0.22, "TDAH · adaptaciones de acceso"], ["Nerea Bustamante", 6.9, 0.05], ["Izan Trueba", 5.9, 0.09], ["Carla Miera", 8.9, 0.02], ["Álvaro Peña", 6.2, 0.07], ["Sofía Ocejo", 7.4, 0.03], ["Mateo Lavín", 5.2, 0.12, "Refuerzo de expresión gráfica"]], 158),
    ...mk("g2", [["Emma Castañeda", 8.4, 0.02], ["Pablo Argüeso", 6.8, 0.06], ["June Sainz", 9.1, 0.01], ["Adrián Solórzano", 5.8, 0.08], ["Lucía Barreda", 7.5, 0.04], ["Marcos Haya", 4.6, 0.15, "Dificultades de planificación"], ["Irene Cossío", 8.0, 0.03], ["Diego Raba", 6.1, 0.07], ["Paula Mantilla", 7.2, 0.04]], 22),
    ...mk("g3", [["Claudia Viadero", 8.2, 0.03], ["Sergio Liaño", 6.6, 0.06], ["Alba Cortabitarte", 7.9, 0.02], ["Javier Escudero", 5.4, 0.09], ["Noa Pereda", 8.8, 0.02], ["Rubén San Emeterio", 4.9, 0.18, "Lagunas en geometría básica"], ["Elena Torre", 7.0, 0.05], ["Pablo Campuzano", 6.3, 0.06], ["Martina Rozadilla", 9.3, 0.01]], 268),
    ...mk("g4", [["Alejandro Bárcena", 7.6, 0.03], ["Lucía Estrada", 6.2, 0.07], ["Pablo Cagigal", 8.1, 0.02], ["Marina Setién", 5.7, 0.10, "Dificultades de abstracción espacial"], ["Iker Revuelta", 7.3, 0.04], ["Carmen Obregón", 6.8, 0.05], ["Javier Merino", 8.7, 0.02], ["Nuria Salcedo", 5.4, 0.13], ["Álvaro Lombera", 7.9, 0.03], ["Sara Quintana", 6.5, 0.06]], 320),
    ...mk("g5", [["Alicia Trueba", 8.3, 0.02], ["David Pelayo", 6.7, 0.06], ["María Salmón", 7.8, 0.03], ["Gonzalo Uribe", 5.9, 0.09], ["Clara Mazarío", 9.0, 0.01], ["Samuel Bedia", 4.8, 0.16, "Dislexia · adaptaciones de acceso"], ["Nora Colmenares", 7.4, 0.04], ["Hugo Cueto", 6.1, 0.07], ["Valentina Silió", 8.6, 0.02]], 50),
    ...mk("g6", [["Lucía Fernández", 8.5, 0.02], ["Marco Ruiz", 7.2, 0.04], ["Aitana Sáiz", 9.1, 0.01], ["Hugo Cobo", 6.8, 0.05], ["Valeria Ríos", 7.9, 0.03], ["Daniel Herrera", 5.4, 0.12, "TDAH · adaptaciones de acceso"], ["Nerea Bustamante", 8.2, 0.02], ["Izan Trueba", 6.5, 0.06], ["Carla Miera", 9.3, 0.01], ["Álvaro Peña", 7.1, 0.04], ["Sofía Ocejo", 8.7, 0.02], ["Mateo Lavín", 6.3, 0.07], ["Elena Torre", 7.6, 0.03], ["Pablo Campuzano", 6.9, 0.05], ["Martina Rozadilla", 9.5, 0.01]], 280),
  ];

  const subjects: Subject[] = [
    { id: "m1", nombre: "Educación Plástica, Visual y Audiovisual", corto: "EPVA", etapa: "ESO", nivel: "4º ESO", curriculumId: "epva-eso", teacherId: "t1", grupoId: "g1", color: "#d9532c", tipo: "optativa" },
    { id: "m2", nombre: "Expresión Artística", corto: "Expr. Artística", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "ea-bach", teacherId: "t1", grupoId: "g2", color: "#c98a12", tipo: "obligatoria" },
    { id: "m3", nombre: "Dibujo Técnico II", corto: "Dibujo Técnico II", etapa: "Bachillerato", nivel: "2º Bachillerato", curriculumId: "dt-bach", teacherId: "t2", grupoId: "g3", color: "#2c6e8f", tipo: "obligatoria" },
    { id: "m4", nombre: "Audiovisual y Multimedia", corto: "Audiovisual", etapa: "ESO", nivel: "4º ESO", curriculumId: "epva-eso", teacherId: undefined, grupoId: "g1", color: "#7a5fb0", tipo: "optativa" },
    { id: "m5", nombre: "Dibujo Técnico I", corto: "Dibujo Técnico I", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "dt1-bach", teacherId: "t2", grupoId: "g4", color: "#0e7c66", tipo: "obligatoria" },
    { id: "m6", nombre: "Taller de Podcast", corto: "Podcast", etapa: "Bachillerato", nivel: "1º Bachillerato", curriculumId: "tp-bach", teacherId: "t1", grupoId: "g5", color: "#a84a6c", tipo: "optativa" },
    { id: "m7", nombre: "Taller de Cortometraje", corto: "Cortometraje", etapa: "Bachillerato", nivel: "2º Bachillerato", curriculumId: "tc-bach", teacherId: "t1", grupoId: "g6", color: "#7a5fb0", tipo: "optativa" },
  ];

  const epvaCrit = ["epva.1.1", "epva.1.2", "epva.2.1", "epva.2.2", "epva.3.1", "epva.3.2", "epva.4.1", "epva.4.2", "epva.5.1", "epva.5.2"];
  const eaCrit = ["ea.1.1", "ea.1.2", "ea.2.1", "ea.2.2", "ea.3.1", "ea.3.2", "ea.4.1", "ea.4.2", "ea.5.1", "ea.5.2"];
  const dtCrit = ["dt.1.1", "dt.1.2", "dt.2.1", "dt.2.2", "dt.3.1", "dt.3.2", "dt.4.1", "dt.4.2"];

  const programaciones: Programacion[] = [
    { id: "p1", subjectId: "m1", curso: c.label, estado: "Finalizada", contexto: CONTEXTO, criterios: epvaCrit, ponderaciones: Object.fromEntries(epvaCrit.map(k => [k, 10])), ccalificacion: "La calificación se obtiene agregando las calificaciones de los instrumentos vinculados a cada criterio.", actualizada: hoy },
    { id: "p2", subjectId: "m2", curso: c.label, estado: "En revisión", contexto: CONTEXTO, criterios: eaCrit, ponderaciones: Object.fromEntries(eaCrit.map(k => [k, 10])), ccalificacion: "El proceso creativo documentado tiene carácter central.", actualizada: hoy },
    { id: "p3", subjectId: "m3", curso: c.label, estado: "Borrador", contexto: CONTEXTO, criterios: dtCrit, ponderaciones: Object.fromEntries(dtCrit.map(k => [k, 12.5])), ccalificacion: "Las láminas y pruebas prácticas se califican con escalas de valoración.", actualizada: hoy },
    { id: "p4", subjectId: "m5", curso: c.label, estado: "En revisión", contexto: CONTEXTO, criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.3.1", "dt1.3.2", "dt1.3.3", "dt1.3.4", "dt1.3.5", "dt1.4.1", "dt1.4.2", "dt1.5.1", "dt1.5.2"], ponderaciones: { "dt1.1.1": 5, "dt1.2.1": 8, "dt1.2.2": 8, "dt1.2.3": 8, "dt1.3.1": 10, "dt1.3.2": 8, "dt1.3.3": 5, "dt1.3.4": 5, "dt1.3.5": 3, "dt1.4.1": 8, "dt1.4.2": 7, "dt1.5.1": 8, "dt1.5.2": 7 }, ccalificacion: "Las láminas se califican con escalas de valoración publicadas.", actualizada: hoy },
    { id: "p5", subjectId: "m6", curso: c.label, estado: "Finalizada", contexto: CONTEXTO, criterios: ["tp.1.1", "tp.1.2", "tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2", "tp.3.3", "tp.4.1", "tp.4.2", "tp.5.1", "tp.5.2"], ponderaciones: { "tp.1.1": 9, "tp.1.2": 8, "tp.2.1": 10, "tp.2.2": 10, "tp.3.1": 10, "tp.3.2": 13, "tp.3.3": 8, "tp.4.1": 10, "tp.4.2": 8, "tp.5.1": 7, "tp.5.2": 7 }, ccalificacion: "El proyecto final de podcast tiene un peso del 40%.", actualizada: hoy },
    { id: "p6", subjectId: "m7", curso: c.label, estado: "En revisión", contexto: CONTEXTO, criterios: ["tc.1.1", "tc.1.2", "tc.2.1", "tc.2.2", "tc.3.1", "tc.3.2", "tc.4.1", "tc.4.2", "tc.5.1", "tc.5.2", "tc.5.3"], ponderaciones: { "tc.1.1": 8, "tc.1.2": 7, "tc.2.1": 8, "tc.2.2": 8, "tc.3.1": 7, "tc.3.2": 8, "tc.4.1": 10, "tc.4.2": 7, "tc.5.1": 10, "tc.5.2": 10, "tc.5.3": 7 }, ccalificacion: "El cortometraje final tiene un peso del 50%.", actualizada: hoy },
  ];

  const sas: SA[] = [
    { id: "sa1", programacionId: "p1", titulo: "Carteles que hablan", eva: 1, inicio: D(14), fin: D(45), sesiones: 8, justificacion: "El alumnado convive a diario con mensajes visuales persuasivos.", reto: "¿Cómo lograr que un mensaje social importe de verdad?", producto: "Cartel A3 impreso + exposición en el hall del centro.", metodologias: ["Aprendizaje basado en retos", "Design thinking", "Aprendizaje cooperativo"], agrupamientos: "Parejas de diseño + plenario", espacios: "Aula-taller y aula de informática", recursos: "Papel de boceto, rotuladores, GIMP/Krita, impresora A3", diversidad: "Modelos de referencia con niveles de complejidad", evidencias: "Cuaderno de bocetos, mapa de empatía, cartel final", criterios: ["epva.1.1", "epva.2.1", "epva.3.1", "epva.5.1"], objetivos: ["Aplicar los elementos del lenguaje visual", "Componer con jerarquía tipográfica y color"], actividades: [
      { id: "sa1a1", titulo: "Caza de carteles", desc: "Análisis crítico de 20 carteles del entorno", fase: "Inicio", sesion: 1, criterioIds: ["epva.1.1"] },
      { id: "sa1a2", titulo: "Mapa de empatía y briefing", desc: "Definir público, causa y mensaje esencial", fase: "Inicio", sesion: 2, criterioIds: ["epva.5.1"] },
      { id: "sa1a3", titulo: "Bocetos y miniaturas", desc: "Tres vías compositivas en miniatura", fase: "Desarrollo", sesion: 4, criterioIds: ["epva.2.1"] },
      { id: "sa1a4", titulo: "Producción del cartel", desc: "Versión definitiva analógica o digital A3", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.1", "epva.3.1"] },
      { id: "sa1a5", titulo: "Crítica colectiva y montaje", desc: "Exposición, coevaluación guiada y mejora final", fase: "Cierre", sesion: 8, criterioIds: ["epva.3.1", "epva.5.1"] },
    ], instrumentos: ["i1", "i2", "i3"] },
    { id: "sa2", programacionId: "p1", titulo: "Microhistorias en stop-motion", eva: 2, inicio: toISO(new Date(c.y + 1, 0, 12)), fin: toISO(new Date(c.y + 1, 1, 13)), sesiones: 9, justificacion: "El audiovisual es el lenguaje natural del alumnado.", reto: "Contar una historia de 45 segundos que nadie pueda dejar de mirar", producto: "Microcortometraje stop-motion (45-60 s)", metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo"], agrupamientos: "Equipos de 3 con roles rotativos", espacios: "Aula-taller con set de rodaje", recursos: "Trípodes, móviles, iluminación LED, DaVinci Resolve", diversidad: "Guion técnico con plantilla, subtítulos obligatorios", evidencias: "Guion técnico, making-of, cortometraje final", criterios: ["epva.1.2", "epva.2.2", "epva.3.2", "epva.5.1"], objetivos: ["Planificar una narrativa audiovisual breve", "Aplicar la técnica stop-motion"], actividades: [
      { id: "sa2a1", titulo: "Visionado y deconstrucción", desc: "Análisis de cortos stop-motion de referencia", fase: "Inicio", sesion: 1, criterioIds: ["epva.1.2"] },
      { id: "sa2a2", titulo: "Guion técnico y storyboard", desc: "De la idea al guion técnico con 12-16 planos", fase: "Desarrollo", sesion: 3, criterioIds: ["epva.3.2"] },
      { id: "sa2a3", titulo: "Rodaje por equipos", desc: "Animación cuadro a cuadro en sets simultáneos", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.2", "epva.5.1"] },
      { id: "sa2a4", titulo: "Montaje y postproducción", desc: "Edición, sonido y subtítulos en DaVinci Resolve", fase: "Desarrollo", sesion: 8, criterioIds: ["epva.2.2"] },
      { id: "sa2a5", titulo: "Estreno y making-of", desc: "Proyección colectiva y documentación del proceso", fase: "Cierre", sesion: 9, criterioIds: ["epva.3.2"] },
    ], instrumentos: ["i4", "i6"] },
    { id: "sa3", programacionId: "p1", titulo: "El barrio que miramos", eva: 3, inicio: toISO(new Date(c.y + 1, 3, 6)), fin: toISO(new Date(c.y + 1, 4, 8)), sesiones: 10, justificacion: "El patrimonio próximo suele ser invisible para el alumnado.", reto: "Hacer visible lo que el barrio esconde", producto: "Mapa ilustrado del barrio con 12 puntos de interés", metodologias: ["Aprendizaje-servicio", "Aprendizaje basado en proyectos"], agrupamientos: "Equipos de ruta + redacción editorial", espacios: "Salidas de campo y aula-taller", recursos: "Cámaras, plantillas de mapa, GIMP", diversidad: "Rutas de dificultad adaptada, fichas con pictogramas", evidencias: "Diario de campo, serie fotográfica, mapa final", criterios: ["epva.1.2", "epva.2.1", "epva.4.1", "epva.4.2", "epva.5.2"], objetivos: ["Leer el patrimonio próximo con mirada crítica", "Producir fotografía e ilustración documental"], actividades: [
      { id: "sa3a1", titulo: "¿Qué es patrimonio?", desc: "Debate guiado y selección de 12 puntos", fase: "Inicio", sesion: 1, criterioIds: ["epva.4.1"] },
      { id: "sa3a2", titulo: "Salida fotográfica", desc: "Rutas por equipos con guion de observación", fase: "Desarrollo", sesion: 3, criterioIds: ["epva.1.2", "epva.2.1"] },
      { id: "sa3a3", titulo: "Ilustración de puntos", desc: "Serie ilustrada coherente para el mapa", fase: "Desarrollo", sesion: 6, criterioIds: ["epva.2.1"] },
      { id: "sa3a4", titulo: "Editorial del mapa", desc: "Maquetación conjunta: leyenda, textos, créditos", fase: "Desarrollo", sesion: 8, criterioIds: ["epva.5.2"] },
      { id: "sa3a5", titulo: "Entrega a la asociación", desc: "Presentación pública y evaluación del servicio", fase: "Cierre", sesion: 10, criterioIds: ["epva.4.2"] },
    ], instrumentos: ["i5", "i6"] },
    { id: "sa7", programacionId: "p4", titulo: "Geometría del patrimonio cántabro", eva: 1, inicio: D(10), fin: D(55), sesiones: 14, justificacion: "La geometría plana cobra sentido cuando se aplica a la lectura del entorno.", reto: "¿Cómo podemos reconstruir geométricamente la roseta de una iglesia románica?", producto: "Dossier de 4 láminas + maqueta de proporción áurea", metodologias: ["Aprendizaje basado en proyectos", "Estudio de casos"], agrupamientos: "Individual + plenario de corrección", espacios: "Aula de dibujo y salida de campo", recursos: "Tableros, estilógrafos, fotografías del patrimonio", diversidad: "Plantillas guía con niveles de complejidad", evidencias: "Láminas normalizadas, cuaderno de bocetos", criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"], objetivos: ["Analizar la relación entre matemáticas y dibujo geométrico", "Resolver gráficamente cálculos de geometría plana", "Trazar construcciones poligonales y tangencias"], actividades: [
      { id: "sa7a1", titulo: "Historia del dibujo técnico", desc: "De Thales y Euclides a las aplicaciones actuales", fase: "Inicio", sesion: 2, criterioIds: ["dt1.1.1"] },
      { id: "sa7a2", titulo: "Proporcionalidad y polígonos", desc: "Cálculos gráficos, equivalencias, polígonos regulares", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.2.1", "dt1.2.2"] },
      { id: "sa7a3", titulo: "Tangencias y curvas técnicas", desc: "Resolución gráfica de tangencias y trazado de curvas", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.2.3"] },
      { id: "sa7a4", titulo: "Salida de campo: patrimonio cántabro", desc: "Fotografía y análisis geométrico de rosetas románicas", fase: "Desarrollo", sesion: 11, criterioIds: ["dt1.1.1", "dt1.2.2"] },
      { id: "sa7a5", titulo: "Documentación normalizada", desc: "Vistas acotadas aplicando normas UNE/ISO", fase: "Cierre", sesion: 14, criterioIds: ["dt1.4.1", "dt1.4.2"] },
    ], instrumentos: ["i17", "i18", "i19", "i22"] },
    { id: "sa10", programacionId: "p5", titulo: "Escuchar el mundo: análisis de podcasts", eva: 1, inicio: D(12), fin: D(35), sesiones: 8, justificacion: "Antes de producir, hay que escuchar con criterio.", reto: "¿Qué hace que un podcast te atrape desde el primer minuto?", producto: "Dossier de análisis de 5 podcasts + podcast-reseña", metodologias: ["Aprendizaje basado en proyectos", "Aula invertida"], agrupamientos: "Individual + plenario de escucha", espacios: "Aula con equipos de audio", recursos: "Auriculares, plataforma de podcasts, fichas de análisis", diversidad: "Podcasts con transcripciones, fichas con pictogramas", evidencias: "Dossier de análisis, podcast-reseña", criterios: ["tp.1.1", "tp.1.2", "tp.5.1"], objetivos: ["Analizar críticamente podcasts de referencia", "Identificar géneros y recursos narrativos"], actividades: [
      { id: "sa10a1", titulo: "Historia del podcasting", desc: "De la radio analógica al podcasting contemporáneo", fase: "Inicio", sesion: 2, criterioIds: ["tp.1.1"] },
      { id: "sa10a2", titulo: "Escucha crítica guiada", desc: "Análisis de 3 podcasts con ficha estructurada", fase: "Desarrollo", sesion: 5, criterioIds: ["tp.1.1", "tp.1.2"] },
      { id: "sa10a3", titulo: "Ética y responsabilidad", desc: "Derechos de autor, verificación y tratamiento de la diversidad", fase: "Desarrollo", sesion: 7, criterioIds: ["tp.5.1"] },
      { id: "sa10a4", titulo: "Producción del podcast-reseña", desc: "Guion, grabación y edición de una reseña de 5 minutos", fase: "Desarrollo", sesion: 7, criterioIds: ["tp.1.1"] },
      { id: "sa10a5", titulo: "Audición colectiva", desc: "Escucha compartida y retroalimentación", fase: "Cierre", sesion: 8, criterioIds: ["tp.1.2"] },
    ], instrumentos: ["i24", "i25"] },
    { id: "sa20", programacionId: "p5", titulo: "Géneros sonoros: del informativo al narrativo", eva: 1, inicio: D(38), fin: D(65), sesiones: 10, justificacion: "Conocer los géneros sonoros permite elegir el formato adecuado para cada mensaje.", reto: "¿Cómo adaptar el contenido al género sonoro más efectivo?", producto: "Comparativa de 3 géneros + mini-producción en cada género", metodologias: ["Aprendizaje basado en proyectos", "Estudio de casos"], agrupamientos: "Equipos de 2 + plenario comparativo", espacios: "Aula con equipos de audio", recursos: "Ejemplos de podcasts por género, fichas comparativas", diversidad: "Géneros con diferentes niveles de complejidad técnica", evidencias: "Comparativa de géneros, 3 mini-producciones", criterios: ["tp.1.1", "tp.1.2", "tp.5.1"], objetivos: ["Diferenciar géneros y formatos sonoros", "Producir contenido adaptado a cada género", "Valorar la adecuación género-contenido"], actividades: [
      { id: "sa20a1", titulo: "Mapa de géneros sonoros", desc: "Informativo, divulgativo, narrativo, entrevista, debate, ficción", fase: "Inicio", sesion: 2, criterioIds: ["tp.1.1"] },
      { id: "sa20a2", titulo: "Análisis comparativo", desc: "Escucha crítica de 3 géneros diferentes con ficha estructurada", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.1.1", "tp.1.2"] },
      { id: "sa20a3", titulo: "Mini-producción informativa", desc: "Podcast informativo de 3 minutos sobre actualidad del centro", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.1.1", "tp.5.1"] },
      { id: "sa20a4", titulo: "Mini-producción narrativa", desc: "Podcast narrativo de 3 minutos con storytelling", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.1.1", "tp.5.1"] },
      { id: "sa20a5", titulo: "Comparativa final y debate", desc: "Presentación de producciones y análisis de adecuación género-contenido", fase: "Cierre", sesion: 10, criterioIds: ["tp.1.2", "tp.5.1"] },
    ], instrumentos: ["i41", "i42"] },
    { id: "sa23", programacionId: "p5", titulo: "Entrevistas y reportajes sonoros", eva: 1, inicio: D(68), fin: D(95), sesiones: 10, justificacion: "La entrevista es el formato más utilizado en podcasting y requiere técnicas específicas.", reto: "¿Cómo conseguir que un entrevistado se abra y cuente su historia de forma auténtica?", producto: "Entrevista de 8 minutos + reportaje sonoro de 5 minutos", metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo"], agrupamientos: "Equipos de 3 (entrevistador, técnico, editor)", espacios: "Estudio de grabación + exteriores", recursos: "Micrófonos de mano, grabadoras portátiles, DAW", diversidad: "Entrevistados con diferentes perfiles y niveles de comodidad ante el micrófono", evidencias: "Entrevista completa, reportaje sonoro, dossier de preparación", criterios: ["tp.2.1", "tp.3.1", "tp.3.2", "tp.5.1"], objetivos: ["Preparar y conducir entrevistas profesionales", "Producir reportajes sonoros con múltiples fuentes", "Aplicar técnicas de edición para mejorar la narrativa"], actividades: [
      { id: "sa23a1", titulo: "Anatomía de la entrevista", desc: "Análisis de 5 entrevistas de referencia en podcasts profesionales", fase: "Inicio", sesion: 2, criterioIds: ["tp.2.1"] },
      { id: "sa23a2", titulo: "Técnicas de entrevista", desc: "Preparación, preguntas abiertas, escucha activa, seguimiento", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.2.1"] },
      { id: "sa23a3", titulo: "Práctica de entrevistas", desc: "Simulacros en clase con retroalimentación entre pares", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.2.1", "tp.3.1"] },
      { id: "sa23a4", titulo: "Grabación de entrevistas reales", desc: "Entrevistas a miembros de la comunidad educativa", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.3.1", "tp.5.1"] },
      { id: "sa23a5", titulo: "Edición y montaje", desc: "Selección de momentos clave, música, efectos, masterización", fase: "Desarrollo", sesion: 9, criterioIds: ["tp.3.2"] },
      { id: "sa23a6", titulo: "Audición colectiva y evaluación", desc: "Presentación de entrevistas y reportajes + coevaluación", fase: "Cierre", sesion: 10, criterioIds: ["tp.3.2", "tp.5.1"] },
    ], instrumentos: ["i47", "i48"] },
    { id: "sa13", programacionId: "p6", titulo: "Miradas cinematográficas", eva: 1, inicio: D(10), fin: D(50), sesiones: 16, justificacion: "Antes de crear, hay que saber mirar. El análisis crítico de obras audiovisuales es fundamental para desarrollar una mirada cinematográfica informada y reflexiva.", reto: "¿Qué hace que un cortometraje te atrape más que una película de 2 horas?", producto: "Dossier de análisis de 5 cortometrajes + ensayo crítico de 2000 palabras + presentación oral", metodologias: ["Aprendizaje basado en proyectos", "Aula invertida", "Cinefórum", "Análisis comparativo"], agrupamientos: "Individual + cinefórum grupal (equipos de 4)", espacios: "Aula con proyector 4K, equipo de sonido 5.1, pizarra digital", recursos: "Selección de 12 cortometrajes internacionales, fichas de análisis estructuradas, libros de teoría cinematográfica, acceso a plataformas (Filmin, Vimeo)", diversidad: "Cortometrajes con subtítulos en español, audiodescripción disponible, materiales complementarios en formato accesible", evidencias: "Dossier de análisis (5 fichas completas), ensayo crítico, presentación oral de 10 minutos, portfolio de capturas comentadas", criterios: ["tc.1.1", "tc.1.2"], objetivos: ["Analizar cortometrajes identificando elementos del lenguaje cinematográfico", "Contextualizar obras en su momento histórico y cultural", "Desarrollar pensamiento crítico sobre producciones audiovisuales", "Comunicar análisis de forma oral y escrita con rigor académico"], actividades: [
      { id: "sa13a1", titulo: "Historia del cine en 90 minutos", desc: "Sesión magistral interactiva: del cine mudo (Lumière, Méliès) al cine digital contemporáneo. Se proyectan fragmentos emblemáticos de cada época: 'Llegada del tren' (1895), 'Viaje a la Luna' (1902), 'El acorazado Potemkin' (1925), 'Ciudadano Kane' (1941), 'Pulp Fiction' (1994), 'Parásitos' (2019). Los estudiantes completan una línea del tiempo colaborativa en la pizarra digital identificando hitos técnicos y estéticos.", fase: "Inicio", sesion: 2, criterioIds: ["tc.1.2"], pdfs: [{ name: "Ejercicio_Historia_Cine.pdf", data: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDQ+PnN0cmVhbQpCVApxCi9GMSAxMiBUZgo1MCA3MDBUZAooSGlzdG9yaWEgZGVsIENpbmUpIFRqCkVUCnEgQlQgRVRRCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzMjggMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MTUKJSVFT0Y=", size: 2450, addedAt: "2025-10-15T10:00:00Z" }] },
      { id: "sa13a2", titulo: "Anatomía del plano cinematográfico", desc: "Taller práctico sobre tipología de planos: plano general, plano medio, primer plano, plano detalle, plano americano. Análisis de la composición (regla de los tercios, líneas de fuerza, simetría), profundidad de campo, ángulos de cámara (picado, contrapicado, cenital, holandés) y movimientos de cámara (panorámica, travelling, zoom, steadicam). Se proyectan 3 cortometrajes seleccionados ('The Neighbors' Window, 2019; 'Skin', 2018; 'Stutterer', 2015) y los estudiantes identifican y catalogan los recursos visuales utilizados mediante fichas de análisis detalladas.", fase: "Desarrollo", sesion: 5, criterioIds: ["tc.1.1"], pdfs: [{ name: "Ficha_Analisis_Plano.pdf", data: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNTI+PnN0cmVhbQpCVApxCi9GMSAxMiBUZgo1MCA3MDBUZAooQW5hbGlzaXMgZGVsIFBsYW5vKSAvalRqCkVUCnEgQlQgRVRRCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzMzYgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MjMKJSVFT0Y=", size: 2890, addedAt: "2025-10-20T10:00:00Z" }] },
      { id: "sa13a3", titulo: "El arte del montaje cinematográfico", desc: "Sesión teórica-práctica sobre el montaje como herramienta narrativa fundamental. Se estudian los principios del montaje clásico (continuidad, raccord) y las rupturas modernas (elipsis, salto, montaje paralelo). Análisis comparativo de secuencias: la escena del baño de 'Psicosis' (Hitchcock, 1960), el montaje de apertura de 'Up' (Pixar, 2009), y la secuencia final de 'Ciudad de Dios' (Meirelles, 2002). Los estudiantes reciben 10 minutos de material en bruto y deben realizar 3 montajes diferentes del mismo material para experimentar cómo el montaje transforma el significado.", fase: "Desarrollo", sesion: 9, criterioIds: ["tc.1.1"], pdfs: [{ name: "Ejercicio_Montaje.pdf", data: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDg+PnN0cmVhbQpCVApxCi9GMSAxMiBUZgo1MCA3MDBUZAooRWwgYXJ0ZSBkZWwgbW9udGFqZSkgVGoKRVQKcSBCVCBFVFEKZW5kc3RyZWFtCmVuZG9iagoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzMjQgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MTAKJSVFT0Y=", size: 2680, addedAt: "2025-10-25T10:00:00Z" }] },
      { id: "sa13a4", titulo: "Géneros cinematográficos y autores de referencia", desc: "Análisis comparativo de géneros: drama ('The Silent Child', 2017), comedia ('The New Tenants', 2009), thriller ('Cargo', 2013), documental ('Extremis', 2016), experimental ('Begone Dull Care', 1949). Estudio de autores clave: Wes Anderson (simetría y paleta cromática), Pedro Almodóvar (melodrama y color), Christopher Nolan (narrativa no lineal), Greta Gerwig (perspectiva femenina). Cada estudiante elige un género y un autor para realizar un análisis en profundidad de 800 palabras con capturas comentadas.", fase: "Desarrollo", sesion: 12, criterioIds: ["tc.1.2"], pdfs: [{ name: "Guia_Generos_Autores.pdf", data: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNTY+PnN0cmVhbQpCVApxCi9GMSAxMiBUZgo1MCA3MDBUZAooR2VuZXJvcyB5IEF1dG9yZXMgZGUgUmVmZXJlbmNpYSkgVGoKRVQKcSBCVCBFVFEKZW5kc3RyZWFtCmVuZG9iagoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzNDAgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MjgKJSVFT0Y=", size: 3120, addedAt: "2025-11-01T10:00:00Z" }] },
      { id: "sa13a5", titulo: "Cinefórum y defensa del ensayo crítico", desc: "Sesión final de presentación y debate. Cada estudiante presenta su ensayo crítico (10 minutos de exposición oral + 5 minutos de preguntas). Los ensayos deben incluir: contextualización histórica, análisis formal (planos, montaje, sonido, interpretación), análisis temático, valoración crítica argumentada. Se organiza un cinefórum donde los estudiantes debaten sobre las diferentes interpretaciones y descubren nuevas perspectivas. Evaluación mediante rúbrica que valora: rigor analítico, uso de terminología cinematográfica, capacidad argumentativa, originalidad de las interpretaciones.", fase: "Cierre", sesion: 16, criterioIds: ["tc.1.1", "tc.1.2"], pdfs: [{ name: "Rubrica_Ensayo_Critico.pdf", data: "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNTQ+PnN0cmVhbQpCVApxCi9GMSAxMiBUZgo1MCA3MDBUZAooUnVicmljYSBFbnNheW8gQ3JpdGljbykgVGoKRVQKcSBCVCBFVFEKZW5kc3RyZWFtCmVuZG9iagoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjM0IDAwMDAwIG4gCjAwMDAwMDAzMzIgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MjAKJSVFT0Y=", size: 2950, addedAt: "2025-11-05T10:00:00Z" }] },
    ], instrumentos: ["i32", "i33"] },
    // DIBUJO TÉCNICO I - 2ª Evaluación
    { id: "sa14", programacionId: "p4", titulo: "Sistemas de representación: diédrico y axonometría", eva: 2, inicio: toISO(new Date(c.y + 1, 0, 8)), fin: toISO(new Date(c.y + 1, 1, 28)), sesiones: 14, justificacion: "La visión espacial requiere dominar los sistemas de representación.", reto: "¿Cómo representar un objeto tridimensional en dos dimensiones sin perder información?", producto: "Láminas de sistema diédrico + perspectiva isométrica de una pieza", metodologias: ["Aprendizaje basado en problemas", "Estudio de casos"], agrupamientos: "Individual + corrección en pequeño grupo", espacios: "Aula de dibujo técnico", recursos: "Tableros, reglas, compases, piezas industriales", diversidad: "Piezas con diferentes niveles de complejidad", evidencias: "Láminas normalizadas, cuaderno de bocetos", criterios: ["dt1.3.1", "dt1.3.2", "dt1.3.3", "dt1.3.5"], objetivos: ["Representar objetos en sistema diédrico", "Elaborar perspectivas axonométricas", "Desarrollar la visión espacial"], actividades: [
      { id: "sa14a1", titulo: "Fundamentos del sistema diédrico", desc: "Proyección ortogonal, alfabeto del punto, recta y plano", fase: "Inicio", sesion: 2, criterioIds: ["dt1.3.1"] },
      { id: "sa14a2", titulo: "Posiciones y relaciones", desc: "Pertenencia, paralelismo, perpendicularidad", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.3.1"] },
      { id: "sa14a3", titulo: "Verdaderas magnitudes", desc: "Abatimientos, giros y cambios de plano", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.3.1", "dt1.3.5"] },
      { id: "sa14a4", titulo: "Sistema axonométrico", desc: "Isométrica, dimétrica y caballera", fase: "Desarrollo", sesion: 11, criterioIds: ["dt1.3.2", "dt1.3.3"] },
      { id: "sa14a5", titulo: "Pieza industrial completa", desc: "Representación en diédrico + perspectiva", fase: "Cierre", sesion: 14, criterioIds: ["dt1.3.1", "dt1.3.2", "dt1.3.5"] },
    ], instrumentos: ["i20", "i21"] },
    // DIBUJO TÉCNICO I - 3ª Evaluación
    { id: "sa15", programacionId: "p4", titulo: "Normalización y diseño asistido por ordenador", eva: 3, inicio: toISO(new Date(c.y + 1, 2, 25)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 14, justificacion: "La normalización es el lenguaje universal del diseño técnico.", reto: "¿Cómo comunicar un diseño de forma inequívoca a cualquier profesional del mundo?", producto: "Plano normalizado completo + modelo 3D en CAD", metodologias: ["Aprendizaje basado en proyectos", "Aula invertida"], agrupamientos: "Individual + trabajo en parejas", espacios: "Aula de dibujo y aula de informática", recursos: "Normas UNE-ISO, software FreeCAD", diversidad: "Proyectos con diferentes niveles de complejidad", evidencias: "Planos normalizados, modelo 3D, memoria técnica", criterios: ["dt1.4.1", "dt1.4.2", "dt1.5.1", "dt1.5.2"], objetivos: ["Aplicar la normalización en la documentación gráfica", "Modelar piezas en 3D con CAD", "Comunicar proyectos técnicamente"], actividades: [
      { id: "sa15a1", titulo: "Normas UNE-ISO", desc: "Formatos, escalas, tipos de línea, rotulación", fase: "Inicio", sesion: 2, criterioIds: ["dt1.4.1"] },
      { id: "sa15a2", titulo: "Vistas, cortes y secciones", desc: "Selección y representación normalizada", fase: "Desarrollo", sesion: 5, criterioIds: ["dt1.4.1", "dt1.4.2"] },
      { id: "sa15a3", titulo: "Acotación normalizada", desc: "Principios, sistemas y casos particulares", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.4.1"] },
      { id: "sa15a4", titulo: "Introducción al CAD", desc: "FreeCAD: interfaz, croquis y operaciones básicas", fase: "Desarrollo", sesion: 10, criterioIds: ["dt1.5.1"] },
      { id: "sa15a5", titulo: "Modelado 3D", desc: "Operaciones con primitivas y booleanas", fase: "Desarrollo", sesion: 12, criterioIds: ["dt1.5.1", "dt1.5.2"] },
      { id: "sa15a6", titulo: "Proyecto final: pieza completa", desc: "Plano normalizado + modelo 3D + memoria", fase: "Cierre", sesion: 14, criterioIds: ["dt1.4.1", "dt1.4.2", "dt1.5.1", "dt1.5.2"] },
    ], instrumentos: ["i22", "i23"] },
    { id: "sa24", programacionId: "p4", titulo: "Geometría que construye: del románico cántabro a la geometría plana", eva: 1, inicio: D(15), fin: D(70), sesiones: 18, justificacion: "La geometría plana cobra sentido cuando se aplica a la lectura del patrimonio arquitectónico próximo. El románico cántabro ofrece ejemplos excepcionales de proporción, simetría y trazados geométricos.", reto: "¿Cómo podemos reconstruir geométricamente las trazas reguladoras de las iglesias románicas de Cantabria?", producto: "Dossier de 8 láminas + lámina de reconstrucción románica + 2 exámenes prácticos", metodologias: ["Aprendizaje basado en proyectos", "Estudio de casos", "Aprendizaje cooperativo", "Salida de campo"], agrupamientos: "Individual + corrección entre pares + trabajo en pequeño grupo", espacios: "Aula de dibujo técnico, salida de campo (iglesias románicas), aula de informática", recursos: "Tableros de dibujo, compases de precisión, reglas, escuadras, cartabones, papel A3, fotografías del patrimonio, software GeoGebra", diversidad: "Láminas con diferentes niveles de complejidad, plantillas guía, tutoriales en vídeo, tiempo adicional para alumnado NEAE", evidencias: "Dossier de 8 láminas normalizadas, cuaderno de bocetos de campo, lámina de reconstrucción románica, exámenes prácticos", criterios: ["dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"], objetivos: ["Analizar la relación entre matemáticas y dibujo geométrico", "Resolver gráficamente cálculos de geometría plana", "Trazar construcciones poligonales y tangencias", "Aplicar la geometría al análisis del patrimonio arquitectónico"], actividades: [
      { id: "sa24a1", titulo: "Lugares geométricos: la recta como frontera", desc: "Concepto de lugar geométrico. Rectas paralelas, perpendiculares y oblicuas. Mediatriz y bisectriz como lugares geométricos fundamentales. Ejercicios prácticos de trazado con instrumentos tradicionales.", fase: "Inicio", sesion: 2, criterioIds: ["dt1.2.1"] },
      { id: "sa24a2", titulo: "Proporcionalidad y semejanza", desc: "Teorema de Thales. División de segmentos en partes proporcionales. Escalas numéricas y gráficas. Aplicación a la reducción y ampliación de figuras. Ejercicios de proporcionalidad con elementos del patrimonio cántabro.", fase: "Desarrollo", sesion: 4, criterioIds: ["dt1.2.1", "dt1.2.2"] },
      { id: "sa24a3", titulo: "Polígonos regulares: construcción y propiedades", desc: "Métodos generales y particulares para la construcción de polígonos regulares inscritos y circunscritos. Propiedades métricas y angulares. Ángulos centrales e interiores. Trazado de polígonos estrellados. Relación con rosetones románicos.", fase: "Desarrollo", sesion: 6, criterioIds: ["dt1.2.2"] },
      { id: "sa24a4", titulo: "Equivalencia de figuras planas", desc: "Transformación de polígonos en otros equivalentes con diferente número de lados. Triangulación de polígonos. Construcción de cuadrados equivalentes a polígonos dados. Aplicación al cálculo de superficies en plantas de iglesias.", fase: "Desarrollo", sesion: 8, criterioIds: ["dt1.2.2"] },
      { id: "sa24a5", titulo: "Tangencias fundamentales", desc: "Posiciones relativas de rectas y circunferencias. Tangencias entre rectas y circunferencias. Tangencias entre circunferencias. Enlaces y empalmes. Construcción de figuras con tangencias. Aplicación a arcos y bóvedas románicas.", fase: "Desarrollo", sesion: 10, criterioIds: ["dt1.2.3"] },
      { id: "sa24a6", titulo: "Curvas técnicas y cónicas", desc: "Ovoides, eggoides y espirales. Curvas cónicas: elipse, parábola e hipérbola. Métodos de trazado por puntos y por tangentes. Propiedades geométricas. Aplicación en arquitectura: bóvedas, arcos y trazas reguladoras.", fase: "Desarrollo", sesion: 12, criterioIds: ["dt1.2.3"] },
      { id: "sa24a7", titulo: "Salida de campo: patrimonio románico cántabro", desc: "Visita a iglesias románicas de Cantabria (Santa María la Real de Santillana, San Martín de Elines, Santa Cruz de Castañeda). Toma de medidas, bocetos y fotografías. Análisis geométrico in situ de proporciones, simetrías y trazados.", fase: "Desarrollo", sesion: 14, criterioIds: ["dt1.2.1", "dt1.2.2", "dt1.4.1"] },
      { id: "sa24a8", titulo: "Reconstrucción geométrica del románico", desc: "Análisis de trazas reguladoras de iglesias románicas. Reconstrucción geométrica de rosetones, portadas y capiteles. Identificación de proporciones áureas y relaciones geométricas. Elaboración de láminas de reconstrucción con justificación geométrica.", fase: "Desarrollo", sesion: 16, criterioIds: ["dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"] },
      { id: "sa24a9", titulo: "Exposición y evaluación del dossier", desc: "Presentación del dossier completo de 8 láminas + lámina de reconstrucción románica. Defensa oral de los trabajos ante el grupo. Coevaluación entre pares. Evaluación final con rúbrica que valora precisión, limpieza, normalización y rigor geométrico.", fase: "Cierre", sesion: 18, criterioIds: ["dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"] },
    ], instrumentos: ["i49", "i50", "i51", "i52"] },
    // PODCAST - 2ª Evaluación
    { id: "sa16", programacionId: "p5", titulo: "La voz del podcast: guion y producción sonora", eva: 2, inicio: toISO(new Date(c.y + 1, 0, 14)), fin: toISO(new Date(c.y + 1, 1, 20)), sesiones: 12, justificacion: "Un buen podcast nace de un guion sólido y una producción cuidada.", reto: "¿Cómo convertir una idea en un producto sonoro profesional?", producto: "Episodio piloto de 8 minutos con identidad sonora", metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo"], agrupamientos: "Equipos de 3 con roles rotativos", espacios: "Aula de informática con DAW", recursos: "Micrófonos, DaVinci Resolve, Audacity", diversidad: "Guiones con plantillas estructuradas", evidencias: "Guion técnico, episodio piloto, identidad sonora", criterios: ["tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2"], objetivos: ["Elaborar guiones técnicos y literarios", "Grabar y editar audio con calidad profesional", "Diseñar la identidad sonora del podcast"], actividades: [
      { id: "sa16a1", titulo: "Estructura del guion", desc: "Escaleta, guion literario y técnico", fase: "Inicio", sesion: 2, criterioIds: ["tp.2.1"] },
      { id: "sa16a2", titulo: "Técnicas narrativas", desc: "Ritmo, tensión, storytelling sonoro", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.2.1", "tp.2.2"] },
      { id: "sa16a3", titulo: "La voz como instrumento", desc: "Dicción, entonación, intención comunicativa", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.2.2"] },
      { id: "sa16a4", titulo: "Captación de audio", desc: "Micrófonos, técnicas de grabación, tratamiento del espacio", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.3.1"] },
      { id: "sa16a5", titulo: "Edición y postproducción", desc: "Corte, mezcla, ecualización, masterización", fase: "Desarrollo", sesion: 10, criterioIds: ["tp.3.2"] },
      { id: "sa16a6", titulo: "Episodio piloto", desc: "Producción completa con identidad sonora", fase: "Cierre", sesion: 12, criterioIds: ["tp.3.1", "tp.3.2"] },
    ], instrumentos: ["i26", "i27"] },
    { id: "sa21", programacionId: "p5", titulo: "Diseño sonoro: paisajes auditivos", eva: 2, inicio: toISO(new Date(c.y + 1, 1, 22)), fin: toISO(new Date(c.y + 1, 2, 15)), sesiones: 10, justificacion: "El diseño sonoro es el alma invisible que da vida a las producciones audiovisuales.", reto: "¿Cómo crear atmósferas sonoras que transporten al oyente?", producto: "Paisaje sonoro de 5 minutos + documentación técnica", metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo"], agrupamientos: "Equipos de 2 + revisión entre pares", espacios: "Exteriores para grabación + aula de edición", recursos: "Grabadoras portátiles, micrófonos ambientales, DAW", diversidad: "Entornos sonoros con diferentes niveles de complejidad", evidencias: "Paisaje sonoro, documentación técnica, justificación artística", criterios: ["tp.2.2", "tp.3.1", "tp.3.2"], objetivos: ["Captar ambientes sonoros en diferentes entornos", "Diseñar paisajes sonoros con intención narrativa", "Mezclar y masterizar con calidad profesional"], actividades: [
      { id: "sa21a1", titulo: "Introducción al diseño sonoro", desc: "Concepto de paisaje sonoro, elementos y funciones narrativas", fase: "Inicio", sesion: 2, criterioIds: ["tp.2.2"] },
      { id: "sa21a2", titulo: "Técnicas de captación ambiental", desc: "Micrófonos, técnicas de grabación, tratamiento del espacio", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.3.1"] },
      { id: "sa21a3", titulo: "Salida de grabación", desc: "Captación de ambientes en 3 entornos diferentes del centro", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.3.1"] },
      { id: "sa21a4", titulo: "Edición y composición", desc: "Selección, edición y composición de paisajes sonoros", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.3.2"] },
      { id: "sa21a5", titulo: "Presentación y justificación", desc: "Audición colectiva y justificación artística del diseño sonoro", fase: "Cierre", sesion: 10, criterioIds: ["tp.2.2", "tp.3.2"] },
    ], instrumentos: ["i43", "i44"] },
    // PODCAST - 3ª Evaluación
    { id: "sa17", programacionId: "p5", titulo: "Proyecto final: miniserie de podcast", eva: 3, inicio: toISO(new Date(c.y + 1, 2, 24)), fin: toISO(new Date(c.y + 1, 4, 28)), sesiones: 15, justificacion: "El proyecto final integra todas las competencias desarrolladas.", reto: "¿Puedes crear una miniserie de podcast que enganche a tu audiencia?", producto: "Miniserie de 3 episodios publicada en plataforma digital", metodologias: ["Aprendizaje basado en proyectos", "Design thinking"], agrupamientos: "Equipos de producción con roles profesionales", espacios: "Estudio de grabación y aula de edición", recursos: "Equipo completo de producción, plataformas de distribución", diversidad: "Roles adaptados a perfiles y competencias", evidencias: "Miniserie completa, materiales de promoción, memoria del proyecto", criterios: ["tp.3.3", "tp.4.1", "tp.4.2", "tp.5.2"], objetivos: ["Planificar y ejecutar un proyecto de podcast completo", "Publicar y difundir el producto final", "Evaluar el impacto social del proyecto"], actividades: [
      { id: "sa17a1", titulo: "Concepto y planificación", desc: "Definición del proyecto, roles, cronograma", fase: "Inicio", sesion: 2, criterioIds: ["tp.4.1"] },
      { id: "sa17a2", titulo: "Identidad sonora y gráfica", desc: "Cabecera, sintonía, portada", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.3.3"] },
      { id: "sa17a3", titulo: "Producción de episodios", desc: "Grabación y edición de los 3 episodios", fase: "Desarrollo", sesion: 8, criterioIds: ["tp.3.1", "tp.3.2"] },
      { id: "sa17a4", titulo: "Publicación y difusión", desc: "Plataformas, RSS, metadatos, SEO sonoro", fase: "Desarrollo", sesion: 12, criterioIds: ["tp.4.2"] },
      { id: "sa17a5", titulo: "Evaluación y memoria", desc: "Análisis del impacto, autoevaluación, memoria final", fase: "Cierre", sesion: 15, criterioIds: ["tp.5.2"] },
    ], instrumentos: ["i29", "i30", "i31"] },
    { id: "sa22", programacionId: "p5", titulo: "Difusión y comunidad de oyentes", eva: 3, inicio: toISO(new Date(c.y + 1, 4, 30)), fin: toISO(new Date(c.y + 1, 5, 20)), sesiones: 8, justificacion: "Un podcast solo existe si llega a su audiencia.", reto: "¿Cómo construir una comunidad de oyentes fiel?", producto: "Estrategia de difusión + análisis de métricas + propuesta de mejora", metodologias: ["Aprendizaje basado en proyectos", "Design thinking"], agrupamientos: "Equipos de marketing + presentación final", espacios: "Aula de informática + sala de presentaciones", recursos: "Plataformas de podcast, herramientas de analítica, redes sociales", diversidad: "Estrategias adaptadas a diferentes tipos de audiencia", evidencias: "Estrategia de difusión, análisis de métricas, propuesta de mejora", criterios: ["tp.4.2", "tp.5.2"], objetivos: ["Diseñar estrategias de difusión efectivas", "Analizar métricas de audiencia", "Proponer mejoras basadas en datos"], actividades: [
      { id: "sa22a1", titulo: "Estrategias de difusión", desc: "Plataformas, SEO sonoro, redes sociales, colaboración", fase: "Inicio", sesion: 2, criterioIds: ["tp.4.2"] },
      { id: "sa22a2", titulo: "Análisis de métricas", desc: "Descargas, retención, demografía, engagement", fase: "Desarrollo", sesion: 4, criterioIds: ["tp.4.2", "tp.5.2"] },
      { id: "sa22a3", titulo: "Propuesta de mejora", desc: "Análisis DAFO y plan de acción para futuros episodios", fase: "Desarrollo", sesion: 6, criterioIds: ["tp.5.2"] },
      { id: "sa22a4", titulo: "Presentación final", desc: "Defensa de la estrategia y cierre del proyecto", fase: "Cierre", sesion: 8, criterioIds: ["tp.4.2", "tp.5.2"] },
    ], instrumentos: ["i45", "i46"] },
    // CORTOMETRAJE - 2ª Evaluación
    { id: "sa18", programacionId: "p6", titulo: "Del guion al storyboard: preproducción cinematográfica", eva: 2, inicio: toISO(new Date(c.y + 1, 0, 12)), fin: toISO(new Date(c.y + 1, 1, 25)), sesiones: 18, justificacion: "Un cortometraje exitoso se construye en la preproducción.", reto: "¿Cómo transformar una idea en un proyecto cinematográfico viable?", producto: "Guion literario + guion técnico + storyboard + plan de producción", metodologias: ["Aprendizaje basado en proyectos", "Design thinking"], agrupamientos: "Equipos de guion y producción", espacios: "Aula con proyector y pizarra digital", recursos: "Software de guion, plantillas de storyboard", diversidad: "Proyectos con diferentes géneros y complejidades", evidencias: "Guion literario, guion técnico, storyboard, plan de producción", criterios: ["tc.2.1", "tc.2.2", "tc.3.1"], objetivos: ["Desarrollar ideas originales para cortometrajes", "Elaborar documentación técnica profesional", "Planificar la producción cinematográfica"], actividades: [
      { id: "sa18a1", titulo: "La idea cinematográfica", desc: "Brainstorming, sinopsis, treatment", fase: "Inicio", sesion: 2, criterioIds: ["tc.2.1"] },
      { id: "sa18a2", titulo: "Escritura de guion", desc: "Formato estándar, diálogos, acotaciones", fase: "Desarrollo", sesion: 6, criterioIds: ["tc.2.1"] },
      { id: "sa18a3", titulo: "Guion técnico", desc: "Plan de rodaje, desglose, planificación", fase: "Desarrollo", sesion: 10, criterioIds: ["tc.2.2"] },
      { id: "sa18a4", titulo: "Storyboard visual", desc: "Dibujo de planos, composición, continuidad", fase: "Desarrollo", sesion: 14, criterioIds: ["tc.2.2"] },
      { id: "sa18a5", titulo: "Plan de producción", desc: "Presupuesto, cronograma, equipo, localizaciones", fase: "Desarrollo", sesion: 16, criterioIds: ["tc.3.1"] },
      { id: "sa18a6", titulo: "Pitch del proyecto", desc: "Presentación profesional ante productores", fase: "Cierre", sesion: 18, criterioIds: ["tc.2.1", "tc.3.1"] },
    ], instrumentos: ["i34", "i35", "i36"] },
    // CORTOMETRAJE - 3ª Evaluación
    { id: "sa19", programacionId: "p6", titulo: "Rodaje, postproducción y estreno", eva: 3, inicio: toISO(new Date(c.y + 1, 2, 20)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 26, justificacion: "La producción cinematográfica integra todas las competencias del taller.", reto: "¿Puedes dirigir, rodar y postproducir un cortometraje profesional?", producto: "Cortometraje final de 5-7 minutos + materiales de promoción", metodologias: ["Aprendizaje basado en proyectos", "Aprendizaje cooperativo"], agrupamientos: "Equipo de rodaje con roles profesionales", espacios: "Exteriores, estudio, sala de edición", recursos: "Cámaras, iluminación, equipo de sonido, DaVinci Resolve", diversidad: "Roles adaptados a competencias y perfiles", evidencias: "Cortometraje final, materiales de promoción, memoria de producción", criterios: ["tc.3.2", "tc.4.1", "tc.4.2", "tc.5.1", "tc.5.2", "tc.5.3"], objetivos: ["Dirigir el rodaje coordinando equipos técnicos y artísticos", "Realizar la postproducción completa", "Preparar el cortometraje para distribución"], actividades: [
      { id: "sa19a1", titulo: "Preparación del rodaje", desc: "Casting, ensayos, preparación de sets", fase: "Inicio", sesion: 2, criterioIds: ["tc.3.2"] },
      { id: "sa19a2", titulo: "Dirección de actores", desc: "Técnicas de interpretación, motivación", fase: "Desarrollo", sesion: 6, criterioIds: ["tc.4.1"] },
      { id: "sa19a3", titulo: "Rodaje", desc: "Grabación de todas las escenas planificadas", fase: "Desarrollo", sesion: 12, criterioIds: ["tc.4.1", "tc.4.2"] },
      { id: "sa19a4", titulo: "Montaje", desc: "Edición no lineal, ritmo, continuidad", fase: "Desarrollo", sesion: 18, criterioIds: ["tc.5.1"] },
      { id: "sa19a5", titulo: "Postproducción", desc: "Corrección de color, diseño sonoro, mezcla", fase: "Desarrollo", sesion: 22, criterioIds: ["tc.5.2"] },
      { id: "sa19a6", titulo: "Distribución y estreno", desc: "Materiales de promoción, festivales, plataformas", fase: "Cierre", sesion: 26, criterioIds: ["tc.5.3"] },
    ], instrumentos: ["i37", "i38", "i39", "i40"] },
  ];

  const units: Unit[] = [
    { id: "u1", programacionId: "p1", titulo: "Percepción y comunicación visual", inicio: D(14), fin: D(60), sesiones: 17, saIds: ["sa1"], criterios: ["epva.1.1", "epva.2.1", "epva.3.1"] },
    { id: "u2", programacionId: "p1", titulo: "Narrativa audiovisual", inicio: toISO(new Date(c.y + 1, 0, 8)), fin: toISO(new Date(c.y + 1, 1, 20)), sesiones: 9, saIds: ["sa2"], criterios: ["epva.1.2", "epva.2.2", "epva.3.2"] },
    { id: "u3", programacionId: "p1", titulo: "Patrimonio y entorno próximo", inicio: toISO(new Date(c.y + 1, 2, 21)), fin: toISO(new Date(c.y + 1, 4, 22)), sesiones: 10, saIds: ["sa3"], criterios: ["epva.4.1", "epva.4.2", "epva.5.2"] },
    { id: "u7", programacionId: "p4", titulo: "Fundamentos geométricos y patrimonio", inicio: D(10), fin: D(70), sesiones: 32, saIds: ["sa7"], criterios: ["dt1.1.1", "dt1.2.1", "dt1.2.2", "dt1.2.3", "dt1.4.1", "dt1.4.2"] },
    { id: "u8", programacionId: "p4", titulo: "Sistemas de representación", inicio: toISO(new Date(c.y + 1, 0, 8)), fin: toISO(new Date(c.y + 1, 1, 28)), sesiones: 14, saIds: ["sa14"], criterios: ["dt1.3.1", "dt1.3.2", "dt1.3.3", "dt1.3.5"] },
    { id: "u9", programacionId: "p4", titulo: "Normalización y CAD", inicio: toISO(new Date(c.y + 1, 2, 25)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 14, saIds: ["sa15"], criterios: ["dt1.4.1", "dt1.4.2", "dt1.5.1", "dt1.5.2"] },
    { id: "u10", programacionId: "p5", titulo: "Cultura sonora y análisis crítico", inicio: D(12), fin: D(95), sesiones: 28, saIds: ["sa10", "sa20", "sa23"], criterios: ["tp.1.1", "tp.1.2", "tp.2.1", "tp.3.1", "tp.3.2", "tp.5.1"] },
    { id: "u11", programacionId: "p5", titulo: "Guion y producción sonora", inicio: toISO(new Date(c.y + 1, 0, 14)), fin: toISO(new Date(c.y + 1, 2, 15)), sesiones: 22, saIds: ["sa16", "sa21"], criterios: ["tp.2.1", "tp.2.2", "tp.3.1", "tp.3.2"] },
    { id: "u12", programacionId: "p5", titulo: "Proyecto final de podcast", inicio: toISO(new Date(c.y + 1, 2, 24)), fin: toISO(new Date(c.y + 1, 5, 20)), sesiones: 23, saIds: ["sa17", "sa22"], criterios: ["tp.3.3", "tp.4.1", "tp.4.2", "tp.5.2"] },
    { id: "u13", programacionId: "p6", titulo: "Lenguaje cinematográfico y análisis fílmico", inicio: D(10), fin: D(50), sesiones: 16, saIds: ["sa13"], criterios: ["tc.1.1", "tc.1.2"] },
    { id: "u14", programacionId: "p6", titulo: "Preproducción cinematográfica", inicio: toISO(new Date(c.y + 1, 0, 12)), fin: toISO(new Date(c.y + 1, 1, 25)), sesiones: 18, saIds: ["sa18"], criterios: ["tc.2.1", "tc.2.2", "tc.3.1"] },
    { id: "u15", programacionId: "p6", titulo: "Producción y postproducción", inicio: toISO(new Date(c.y + 1, 2, 20)), fin: toISO(new Date(c.y + 1, 4, 30)), sesiones: 26, saIds: ["sa19"], criterios: ["tc.3.2", "tc.4.1", "tc.4.2", "tc.5.1", "tc.5.2", "tc.5.3"] },
  ];

  const instruments: Instrument[] = [
    { id: "i1", subjectId: "m1", nombre: "Lista de cotejo · láminas y bocetos", tipo: "lista", peso: 15, criterioIds: ["epva.2.1", "epva.1.1"], fecha: D(25) },
    { id: "i2", subjectId: "m1", nombre: "Rúbrica · pieza plástica (cartel)", tipo: "rubrica", peso: 35, criterioIds: ["epva.2.1", "epva.3.1"], fecha: D(48), rubrica: NIVELES_RUBRICA },
    { id: "i3", subjectId: "m1", nombre: "Prueba escrita · lenguaje visual", tipo: "escrita", peso: 20, criterioIds: ["epva.1.1", "epva.1.2"], fecha: D(60) },
    { id: "i4", subjectId: "m1", nombre: "Proyecto audiovisual · stop-motion", tipo: "proyecto", peso: 20, criterioIds: ["epva.2.2", "epva.5.1"], fecha: D(110) },
    { id: "i5", subjectId: "m1", nombre: "Portfolio del proceso", tipo: "portfolio", peso: 10, criterioIds: ["epva.3.2", "epva.5.2"], fecha: D(150) },
    { id: "i6", subjectId: "m1", nombre: "Autoevaluación y coevaluación", tipo: "autoevaluacion", peso: 10, criterioIds: ["epva.5.1", "epva.5.2"], fecha: D(150) },
    { id: "i17", subjectId: "m5", nombre: "Prueba escrita · historia y fundamentos", tipo: "escrita", peso: 10, criterioIds: ["dt1.1.1"], fecha: D(30) },
    { id: "i18", subjectId: "m5", nombre: "Escala de valoración · láminas de geometría", tipo: "escala", peso: 20, criterioIds: ["dt1.2.1", "dt1.2.2", "dt1.2.3"], fecha: D(50) },
    { id: "i19", subjectId: "m5", nombre: "Rúbrica · rigor gráfico y precisión", tipo: "rubrica", peso: 10, criterioIds: ["dt1.3.5"], fecha: D(55), rubrica: NIVELES_RUBRICA },
    { id: "i22", subjectId: "m5", nombre: "Plano normalizado · vistas acotadas UNE/ISO", tipo: "proyecto", peso: 15, criterioIds: ["dt1.4.1", "dt1.4.2"], fecha: D(110) },
    { id: "i24", subjectId: "m6", nombre: "Dossier de análisis de podcasts", tipo: "proyecto", peso: 15, criterioIds: ["tp.1.1", "tp.1.2"], fecha: D(35) },
    { id: "i25", subjectId: "m6", nombre: "Podcast-reseña de 5 minutos", tipo: "digital", peso: 20, criterioIds: ["tp.1.1", "tp.5.1"], fecha: D(45) },
    // Podcast - 1ª Evaluación (Géneros sonoros)
    { id: "i41", subjectId: "m6", nombre: "Comparativa de géneros sonoros", tipo: "proyecto", peso: 15, criterioIds: ["tp.1.1", "tp.1.2"], fecha: D(55) },
    { id: "i42", subjectId: "m6", nombre: "Mini-producciones por género", tipo: "digital", peso: 20, criterioIds: ["tp.1.1", "tp.5.1"], fecha: D(65) },
    // Podcast - 1ª Evaluación (Entrevistas y reportajes - Noviembre/Diciembre)
    { id: "i47", subjectId: "m6", nombre: "Entrevista de 8 minutos", tipo: "digital", peso: 25, criterioIds: ["tp.2.1", "tp.3.1", "tp.5.1"], fecha: D(85) },
    { id: "i48", subjectId: "m6", nombre: "Reportaje sonoro de 5 minutos", tipo: "digital", peso: 20, criterioIds: ["tp.3.1", "tp.3.2"], fecha: D(95) },
    { id: "i32", subjectId: "m7", nombre: "Dossier de análisis fílmico", tipo: "proyecto", peso: 15, criterioIds: ["tc.1.1", "tc.1.2"], fecha: D(40) },
    { id: "i33", subjectId: "m7", nombre: "Ensayo crítico y presentación oral", tipo: "exposicion", peso: 10, criterioIds: ["tc.1.1", "tc.1.2"], fecha: D(50) },
    // Dibujo Técnico I - 2ª Evaluación
    { id: "i20", subjectId: "m5", nombre: "Prueba práctica · sistema diédrico y axonométrico", tipo: "practica", peso: 25, criterioIds: ["dt1.3.1", "dt1.3.2", "dt1.3.3"], fecha: toISO(new Date(c.y + 1, 1, 15)) },
    { id: "i21", subjectId: "m5", nombre: "Rúbrica · perspectiva cónica", tipo: "rubrica", peso: 10, criterioIds: ["dt1.3.4"], fecha: toISO(new Date(c.y + 1, 1, 20)), rubrica: NIVELES_RUBRICA },
    // Dibujo Técnico I - 3ª Evaluación
    { id: "i23", subjectId: "m5", nombre: "Proyecto CAD · figuras 2D y modelado 3D", tipo: "digital", peso: 10, criterioIds: ["dt1.5.1", "dt1.5.2"], fecha: toISO(new Date(c.y + 1, 4, 15)) },
    // Podcast - 2ª Evaluación
    { id: "i26", subjectId: "m6", nombre: "Rúbrica · guion técnico y literario", tipo: "rubrica", peso: 20, criterioIds: ["tp.2.1", "tp.2.2"], fecha: toISO(new Date(c.y + 1, 0, 28)), rubrica: NIVELES_RUBRICA },
    { id: "i27", subjectId: "m6", nombre: "Episodio piloto · calidad técnica y narrativa", tipo: "digital", peso: 25, criterioIds: ["tp.3.1", "tp.3.2"], fecha: toISO(new Date(c.y + 1, 1, 10)) },
    { id: "i43", subjectId: "m6", nombre: "Paisaje sonoro · captación y composición", tipo: "proyecto", peso: 20, criterioIds: ["tp.3.1", "tp.3.2"], fecha: toISO(new Date(c.y + 1, 2, 5)) },
    { id: "i44", subjectId: "m6", nombre: "Rúbrica · diseño sonoro con intención narrativa", tipo: "rubrica", peso: 15, criterioIds: ["tp.2.2"], fecha: toISO(new Date(c.y + 1, 2, 15)), rubrica: NIVELES_RUBRICA },
    // Podcast - 3ª Evaluación
    { id: "i29", subjectId: "m6", nombre: "Rúbrica · miniserie de podcast", tipo: "rubrica", peso: 40, criterioIds: ["tp.3.3", "tp.4.1", "tp.4.2"], fecha: toISO(new Date(c.y + 1, 4, 15)), rubrica: NIVELES_RUBRICA },
    { id: "i30", subjectId: "m6", nombre: "Identidad sonora y gráfica", tipo: "proyecto", peso: 15, criterioIds: ["tp.3.3"], fecha: toISO(new Date(c.y + 1, 3, 20)) },
    { id: "i31", subjectId: "m6", nombre: "Autoevaluación y memoria del proyecto", tipo: "autoevaluacion", peso: 10, criterioIds: ["tp.5.2"], fecha: toISO(new Date(c.y + 1, 4, 25)) },
    { id: "i45", subjectId: "m6", nombre: "Estrategia de difusión y análisis de métricas", tipo: "proyecto", peso: 15, criterioIds: ["tp.4.2", "tp.5.2"], fecha: toISO(new Date(c.y + 1, 5, 10)) },
    { id: "i46", subjectId: "m6", nombre: "Presentación final y propuesta de mejora", tipo: "exposicion", peso: 10, criterioIds: ["tp.4.2", "tp.5.2"], fecha: toISO(new Date(c.y + 1, 5, 20)) },
    // Cortometraje - 2ª Evaluación
    { id: "i34", subjectId: "m7", nombre: "Rúbrica · guion literario", tipo: "rubrica", peso: 15, criterioIds: ["tc.2.1"], fecha: toISO(new Date(c.y + 1, 1, 5)), rubrica: NIVELES_RUBRICA },
    { id: "i35", subjectId: "m7", nombre: "Guion técnico y storyboard", tipo: "proyecto", peso: 15, criterioIds: ["tc.2.2"], fecha: toISO(new Date(c.y + 1, 1, 15)) },
    { id: "i36", subjectId: "m7", nombre: "Plan de producción y pitch", tipo: "exposicion", peso: 10, criterioIds: ["tc.3.1"], fecha: toISO(new Date(c.y + 1, 1, 25)) },
    // Cortometraje - 3ª Evaluación
    { id: "i37", subjectId: "m7", nombre: "Rúbrica · dirección y rodaje", tipo: "rubrica", peso: 20, criterioIds: ["tc.4.1", "tc.4.2"], fecha: toISO(new Date(c.y + 1, 3, 10)), rubrica: NIVELES_RUBRICA },
    { id: "i38", subjectId: "m7", nombre: "Cortometraje final · montaje y postproducción", tipo: "proyecto", peso: 30, criterioIds: ["tc.5.1", "tc.5.2"], fecha: toISO(new Date(c.y + 1, 4, 10)) },
    { id: "i39", subjectId: "m7", nombre: "Materiales de promoción y distribución", tipo: "proyecto", peso: 10, criterioIds: ["tc.5.3"], fecha: toISO(new Date(c.y + 1, 4, 20)) },
    { id: "i40", subjectId: "m7", nombre: "Autoevaluación, coevaluación y defensa pública", tipo: "autoevaluacion", peso: 15, criterioIds: ["tc.3.2", "tc.5.3"], fecha: toISO(new Date(c.y + 1, 4, 30)) },
  ];

  const grades: Grade[] = [];
  const hoyD = now;
  for (const ins of instruments) {
    if (!ins.fecha || ins.fecha > toISO(hoyD)) continue;
    const subject = subjects.find(s => s.id === ins.subjectId)!;
    const grupo = students.filter(s => s.groupId === subject.grupoId);
    for (const st of grupo) {
      for (const crId of ins.criterioIds) {
        const h = hash01(`${ins.id}|${st.id}|${crId}`);
        const v = Math.max(1, Math.min(10, st.base + (h - 0.5) * 3.4));
        grades.push({ id: `${ins.id}·${st.id}·${crId}`, studentId: st.id, instrumentoId: ins.id, criterioId: crId, value: Math.round(v * 10) / 10, fecha: ins.fecha });
      }
    }
  }

  const attendance: AttRec[] = [];
  for (const g of groups) {
    const past = sessionsFor(g, c.start, hoyD).slice(-22);
    const grupo = students.filter(s => s.groupId === g.id);
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
    { id: "o1", studentId: "g1-s6", fecha: D(30), texto: "Responde muy bien a las instrucciones pautadas en pasos cortos.", autor: "Laura Gómez" },
    { id: "o2", studentId: "g1-s3", fecha: D(45), texto: "Propuesta de ampliación aceptada: diseñará la identidad visual completa.", autor: "Laura Gómez" },
    { id: "o3", studentId: "g3-s6", fecha: D(35), texto: "Lagunas en construcciones básicas: repasa tangencias antes de diédrico.", autor: "Miguel Ruiz" },
  ];

  const measures: Measure[] = [
    { id: "d1", tipo: "NEAE", titulo: "Adaptaciones de acceso · Daniel Herrera", desc: "Instrucciones en pasos numerados, apoyos visuales, tiempo ampliado.", studentId: "g1-s6", groupId: "g1" },
    { id: "d2", tipo: "Refuerzo", titulo: "Plan de refuerzo de expresión gráfica · Mateo", desc: "Sesiones breves de trazo y encaje con modelos guiados.", studentId: "g1-s12", groupId: "g1" },
    { id: "d3", tipo: "Ampliación", titulo: "Identidad visual de la campaña · Carla", desc: "Extensión del reto del cartel al sistema completo de identidad.", studentId: "g1-s9", groupId: "g1" },
  ];

  const recoveries: Recovery[] = [
    { id: "r1", studentId: "g1-s6", criterioId: "epva.1.1", actividad: "Cuaderno de análisis de imágenes: 6 láminas comentadas", fecha: D(80), instrumentoId: "i3" },
  ];

  return { version: 16, role: "profesor", teacherId: "t1", cursoLabel: c.label, teachers, groups, students, subjects, programaciones, sas, units, instruments, grades, attendance, observations, measures, recoveries };
}
