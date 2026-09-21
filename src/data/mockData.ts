import { User, Centro, Grupo, Alumno, Asignatura, SituacionAprendizaje, CompetenciaEspecifica, Instrumento, Calificacion, Asistencia } from '../types';

export const centro: Centro = {
  nombre: 'IES Lope de Vega',
  localidad: 'Santa María de Cayón',
  provincia: 'Cantabria',
  cursoAcademico: '2025-26'
};

export const users: User[] = [
  { id: 'u1', email: 'carmen.prieto@educantabria.es', password: 'Trazo2025!', name: 'Carmen Prieto Fernández', role: 'jefatura' },
  { id: 'u2', email: 'laura.gomez@educantabria.es', password: 'Trazo2025!', name: 'Laura Gómez Sánchez', role: 'profesor' },
  { id: 'u3', email: 'miguel.ruiz@educantabria.es', password: 'Trazo2025!', name: 'Miguel Ruiz Martínez', role: 'profesor' }
];

export const grupos: Grupo[] = [
  { id: 'g1', nombre: '4º ESO A', nivel: 'ESO', curso: '4º', alumnos: [] },
  { id: 'g2', nombre: '1º Bach A', nivel: 'Bachillerato', curso: '1º', alumnos: [] },
  { id: 'g3', nombre: '1º Bach B', nivel: 'Bachillerato', curso: '1º', alumnos: [] },
  { id: 'g4', nombre: '1º Bach C', nivel: 'Bachillerato', curso: '1º', alumnos: [] },
  { id: 'g5', nombre: '2º Bach B', nivel: 'Bachillerato', curso: '2º', alumnos: [] }
];

const nombres = ['Lucía','Martín','Sofía','Hugo','Valeria','Daniel','Paula','Alejandro','María','Pablo','Alba','Adrián','Carmen','Diego','Elena','Iván','Laura','Marcos','Nerea','Javier','Claudia','Álvaro','Irene','David','Sara','Mario','Ana','Raúl','Marta','Sergio','Noa'];
const apellidos = ['García','Rodríguez','Fernández','López','Martínez','Sánchez','Pérez','González','Gómez','Díaz','Ruiz','Hernández','Jiménez','Moreno','Álvarez','Romero','Alonso','Gutiérrez','Navarro','Torres','Domínguez','Vázquez','Ramos','Gil','Ramírez','Serrano','Blanco','Suárez','Molina','Morales','Ortega'];

export function generarAlumnos(): Alumno[] {
  const stored = localStorage.getItem('trazo_alumnos');
  if (stored) return JSON.parse(stored);
  
  const alumnos: Alumno[] = nombres.map((nombre, i) => {
    const grupoIdx = i < 6 ? 0 : i < 13 ? 1 : i < 20 ? 2 : i < 26 ? 3 : 4;
    return {
      id: `a${i + 1}`,
      nombre,
      apellidos: `${apellidos[i]} ${apellidos[(i + 7) % apellidos.length]}`,
      grupoId: grupos[grupoIdx].id,
      calificaciones: [],
      asistencia: [],
      observaciones: [],
      necesidadesAE: i === 5 ? 'Dislexia' : i === 12 ? 'TDAH' : undefined
    };
  });
  localStorage.setItem('trazo_alumnos', JSON.stringify(alumnos));
  return alumnos;
}

const competenciasDT1: CompetenciaEspecifica[] = [
  { id: 'ce1', codigo: 'CE1', descripcion: 'Interpretar elementos arquitectónicos y formas del entorno mediante el análisis geométrico' },
  { id: 'ce2', codigo: 'CE2', descripcion: 'Razonar gráfica y matemáticamente resolviendo problemas de geometría' },
  { id: 'ce3', codigo: 'CE3', descripcion: 'Utilizar herramientas digitales para el diseño y la comunicación gráfica' },
  { id: 'ce4', codigo: 'CE4', descripcion: 'Formalizar diseños técnicos mediante el lenguaje gráfico normalizado' }
];

const competenciasEPVA: CompetenciaEspecifica[] = [
  { id: 'epva1', codigo: 'CE1', descripcion: 'Analizar el lenguaje visual del entorno' },
  { id: 'epva2', codigo: 'CE2', descripcion: 'Utilizar las herramientas y medios del lenguaje plástico y visual' },
  { id: 'epva3', codigo: 'CE3', descripcion: 'Planificar y reflexionar sobre procesos artísticos' }
];

const instrumentosDT1: Instrumento[] = [
  { id: 'i1', nombre: 'Escala de valoración · láminas geometría', tipo: 'escala', peso: 25, criterios: ['Precisión en trazados', 'Limpieza', 'Uso correcto de instrumentos'] },
  { id: 'i2', nombre: 'Rúbrica · reconstrucción patrimonio', tipo: 'rubrica', peso: 30, criterios: ['Análisis geométrico', 'Proporcionalidad', 'Creatividad'] },
  { id: 'i3', nombre: 'Prueba escrita · geometría plana', tipo: 'prueba', peso: 15, criterios: ['Resolución de problemas', 'Aplicación de conceptos'] },
  { id: 'i4', nombre: 'Examen práctico 1 · polígonos', tipo: 'prueba', peso: 20, criterios: ['Trazado de polígonos', 'Equivalencia', 'Proporcionalidad'] },
  { id: 'i5', nombre: 'Examen práctico 2 · tangencias', tipo: 'prueba', peso: 20, criterios: ['Resolución de tangencias', 'Curvas técnicas', 'Acabado'] },
  { id: 'i6', nombre: 'Dossier de láminas', tipo: 'portfolio', peso: 15, criterios: ['Completitud', 'Calidad', 'Presentación'] },
  { id: 'i7', nombre: 'Lámina reconstrucción románico', tipo: 'rubrica', peso: 15, criterios: ['Análisis', 'Trazado', 'Detalles'] },
  { id: 'i8', nombre: 'Dossier análisis iglesias', tipo: 'portfolio', peso: 15, criterios: ['Profundidad', 'Rigor', 'Presentación'] },
  { id: 'i9', nombre: 'Lámina traza reguladora', tipo: 'rubrica', peso: 20, criterios: ['Trazado', 'Proporción', 'Limpieza'] },
  { id: 'i10', nombre: 'Exposición oral', tipo: 'observacion', peso: 10, criterios: ['Claridad', 'Argumentación', 'Uso de vocabulario'] },
  { id: 'i11', nombre: 'Croquis acotado', tipo: 'prueba', peso: 15, criterios: ['Proporción', 'Acotación', 'Trazo'] },
  { id: 'i12', nombre: 'Plano normalizado A3', tipo: 'rubrica', peso: 25, criterios: ['Normalización', 'Vistas', 'Cortes'] },
  { id: 'i13', nombre: 'Coevaluación de planos', tipo: 'coevaluacion', peso: 10, criterios: ['Capacidad crítica', 'Argumentación'] }
];

const instrumentosEPVA: Instrumento[] = [
  { id: 'i14', nombre: 'Portfolio visual', tipo: 'portfolio', peso: 30, criterios: ['Creatividad', 'Técnica', 'Presentación'] },
  { id: 'i15', nombre: 'Proyecto artístico', tipo: 'rubrica', peso: 40, criterios: ['Proceso creativo', 'Resultado', 'Reflexión'] },
  { id: 'i16', nombre: 'Observación directa', tipo: 'observacion', peso: 15, criterios: ['Participación', 'Actitud', 'Trabajo en clase'] },
  { id: 'i17', nombre: 'Prueba teórica', tipo: 'prueba', peso: 15, criterios: ['Conocimientos', 'Análisis', 'Vocabulario'] }
];

export const situacionesAprendizaje: SituacionAprendizaje[] = [
  {
    id: 'sa7', codigo: 'SA7', titulo: 'Geometría del patrimonio cántabro',
    descripcion: 'Análisis geométrico de elementos arquitectónicos del patrimonio cántabro mediante construcciones fundamentales.',
    asignaturaId: 'asig_dt1', evaluacion: 1, sesiones: 14, fechaInicio: '2025-09-20', fechaFin: '2025-11-04',
    competenciasClave: ['CMCT','CD','CSC','CCEC'], criteriosEvaluacion: ['dt1.1.1','dt1.2.1'],
    instrumentos: [instrumentosDT1[0], instrumentosDT1[1], instrumentosDT1[2]],
    producto: 'Dossier de 4 láminas + maqueta de proporción áurea',
    ods: ['ODS 11: Ciudades sostenibles', 'ODS 4: Educación de calidad']
  },
  {
    id: 'sa16', codigo: 'SA16', titulo: 'Geometría que construye',
    descripcion: 'Del románico cántabro a la geometría plana: proporcionalidad, polígonos, tangencias y curvas técnicas.',
    asignaturaId: 'asig_dt1', evaluacion: 1, sesiones: 18, fechaInicio: '2025-09-24', fechaFin: '2025-11-19',
    competenciasClave: ['CMCT','CD','CCEC','AA'], criteriosEvaluacion: ['dt1.2.1','dt1.2.2','dt1.2.3'],
    instrumentos: [instrumentosDT1[3], instrumentosDT1[4], instrumentosDT1[5], instrumentosDT1[6]],
    producto: 'Dossier de 8 láminas + lámina de reconstrucción románica + 2 exámenes',
    ods: ['ODS 4: Educación de calidad', 'ODS 9: Industria e innovación']
  },
  {
    id: 'sa17', codigo: 'SA17', titulo: 'Arquitectura que habla',
    descripcion: 'Lectura geométrica del patrimonio: análisis de iglesias románicas cántabras y sus trazas reguladoras.',
    asignaturaId: 'asig_dt1', evaluacion: 1, sesiones: 10, fechaInicio: '2025-11-21', fechaFin: '2025-12-05',
    competenciasClave: ['CMCT','CSC','CCEC','CP'], criteriosEvaluacion: ['dt1.1.1','dt1.4.1'],
    instrumentos: [instrumentosDT1[7], instrumentosDT1[8], instrumentosDT1[9]],
    producto: 'Dossier de análisis de 3 iglesias + lámina de trazado + exposición oral',
    ods: ['ODS 11: Ciudades sostenibles']
  },
  {
    id: 'sa18', codigo: 'SA18', titulo: 'Del croquis al plano',
    descripcion: 'Normalización aplicada: de la idea al plano técnico mediante croquis acotados y planos normalizados.',
    asignaturaId: 'asig_dt1', evaluacion: 1, sesiones: 10, fechaInicio: '2025-12-07', fechaFin: '2025-12-19',
    competenciasClave: ['CMCT','CD','AA','CCEC'], criteriosEvaluacion: ['dt1.3.1','dt1.3.2','dt1.4.2'],
    instrumentos: [instrumentosDT1[10], instrumentosDT1[11], instrumentosDT1[12]],
    producto: 'Croquis acotado + plano normalizado A3',
    ods: ['ODS 9: Industria e innovación']
  },
  {
    id: 'sa1', codigo: 'SA1', titulo: 'Mi identidad visual',
    descripcion: 'Creación de una identidad visual personal mediante el análisis del lenguaje plástico.',
    asignaturaId: 'asig_epva', evaluacion: 1, sesiones: 12, fechaInicio: '2025-09-15', fechaFin: '2025-10-30',
    competenciasClave: ['CCEC','CD','CP','CSC'], criteriosEvaluacion: ['epva1.1','epva1.2'],
    instrumentos: [instrumentosEPVA[0], instrumentosEPVA[1], instrumentosEPVA[2]],
    producto: 'Portfolio visual con identidad gráfica personal',
    ods: ['ODS 4: Educación de calidad']
  },
  {
    id: 'sa2', codigo: 'SA2', titulo: 'El museo en el aula',
    descripcion: 'Análisis y recreación de obras del arte universal mediante técnicas plásticas diversas.',
    asignaturaId: 'asig_epva', evaluacion: 2, sesiones: 14, fechaInicio: '2026-01-10', fechaFin: '2026-03-01',
    competenciasClave: ['CCEC','CMCT','CSC','CP'], criteriosEvaluacion: ['epva2.1','epva2.2'],
    instrumentos: [instrumentosEPVA[0], instrumentosEPVA[1], instrumentosEPVA[3]],
    producto: 'Exposición virtual del museo del aula',
    ods: ['ODS 4: Educación de calidad', 'ODS 11: Ciudades sostenibles']
  },
  {
    id: 'sa3', codigo: 'SA3', titulo: 'Diseño sonoro: nuestro podcast',
    descripcion: 'Creación de un podcast sobre temas de interés del centro educativo.',
    asignaturaId: 'asig_tp', evaluacion: 1, sesiones: 16, fechaInicio: '2025-09-22', fechaFin: '2025-12-15',
    competenciasClave: ['CD','CCEC','CP','CMCT','CSC'], criteriosEvaluacion: ['tp1.1','tp1.2','tp1.3'],
    instrumentos: [{ id: 'i18', nombre: 'Podcast final', tipo: 'rubrica', peso: 40, criterios: ['Contenido','Técnica','Edición'] }, { id: 'i19', nombre: 'Guion', tipo: 'portfolio', peso: 20, criterios: ['Estructura','Argumentación'] }, { id: 'i20', nombre: 'Trabajo en equipo', tipo: 'observacion', peso: 20, criterios: ['Colaboración','Responsabilidad'] }, { id: 'i21', nombre: 'Autoevaluación', tipo: 'coevaluacion', peso: 20, criterios: ['Reflexión','Honestidad'] }],
    producto: 'Podcast de 15 minutos sobre tema elegido',
    ods: ['ODS 4: Educación de calidad', 'ODS 10: Reducción desigualdades']
  },
  {
    id: 'sa4', codigo: 'SA4', titulo: 'Expresión a través del color',
    descripcion: 'Exploración del color como medio de expresión artística y emocional.',
    asignaturaId: 'asig_ea', evaluacion: 1, sesiones: 10, fechaInicio: '2025-10-01', fechaFin: '2025-11-20',
    competenciasClave: ['CCEC','CP','CD'], criteriosEvaluacion: ['ea1.1','ea1.2'],
    instrumentos: [{ id: 'i22', nombre: 'Serie cromática', tipo: 'rubrica', peso: 40, criterios: ['Técnica','Expresividad','Coherencia'] }, { id: 'i23', nombre: 'Diario visual', tipo: 'portfolio', peso: 30, criterios: ['Proceso','Reflexión','Creatividad'] }, { id: 'i24', nombre: 'Presentación oral', tipo: 'observacion', peso: 30, criterios: ['Comunicación','Argumentación'] }],
    producto: 'Serie de 5 obras explorando el color',
    ods: ['ODS 4: Educación de calidad']
  },
  {
    id: 'sa5', codigo: 'SA5', titulo: 'Cortometraje documental',
    descripcion: 'Producción de un cortometraje documental sobre el entorno del centro.',
    asignaturaId: 'asig_av', evaluacion: 2, sesiones: 18, fechaInicio: '2026-01-15', fechaFin: '2026-03-20',
    competenciasClave: ['CD','CCEC','CP','CMCT'], criteriosEvaluacion: ['av2.1','av2.2'],
    instrumentos: [{ id: 'i25', nombre: 'Cortometraje final', tipo: 'rubrica', peso: 50, criterios: ['Narrativa','Técnica','Edición'] }, { id: 'i26', nombre: 'Storyboard', tipo: 'portfolio', peso: 20, criterios: ['Planificación','Creatividad'] }, { id: 'i27', nombre: 'Trabajo en equipo', tipo: 'observacion', peso: 30, criterios: ['Colaboración','Roles'] }],
    producto: 'Cortometraje documental de 5 minutos',
    ods: ['ODS 4: Educación de calidad', 'ODS 11: Ciudades sostenibles']
  },
  {
    id: 'sa6', codigo: 'SA6', titulo: 'Volumen y espacio',
    descripcion: 'Exploración del volumen tridimensional mediante maquetas y esculturas.',
    asignaturaId: 'asig_ea', evaluacion: 2, sesiones: 12, fechaInicio: '2026-01-10', fechaFin: '2026-02-28',
    competenciasClave: ['CCEC','CMCT','CP'], criteriosEvaluacion: ['ea2.1','ea2.2'],
    instrumentos: [{ id: 'i28', nombre: 'Escultura final', tipo: 'rubrica', peso: 50, criterios: ['Volumen','Composición','Técnica'] }, { id: 'i29', nombre: 'Proceso creativo', tipo: 'portfolio', peso: 30, criterios: ['Bocetos','Evolución','Reflexión'] }, { id: 'i30', nombre: 'Presentación', tipo: 'observacion', peso: 20, criterios: ['Comunicación','Justificación'] }],
    producto: 'Escultura tridimensional con materiales reciclados',
    ods: ['ODS 12: Producción responsable']
  },
  {
    id: 'sa8', codigo: 'SA8', titulo: 'Diseño de interiores',
    descripcion: 'Proyecto de diseño de un espacio interior aplicando principios de funcionalidad y estética.',
    asignaturaId: 'asig_dt2', evaluacion: 2, sesiones: 14, fechaInicio: '2026-01-12', fechaFin: '2026-03-05',
    competenciasClave: ['CMCT','CD','CCEC','AA'], criteriosEvaluacion: ['dt2.1.1','dt2.2.1'],
    instrumentos: [{ id: 'i31', nombre: 'Planta y alzado', tipo: 'rubrica', peso: 40, criterios: ['Normalización','Acotación','Vistas'] }, { id: 'i32', nombre: 'Maqueta', tipo: 'observacion', peso: 30, criterios: ['Escala','Acabado','Funcionalidad'] }, { id: 'i33', nombre: 'Memoria técnica', tipo: 'portfolio', peso: 30, criterios: ['Redacción','Documentación'] }],
    producto: 'Proyecto completo de reforma de un espacio',
    ods: ['ODS 9: Industria e innovación', 'ODS 11: Ciudades sostenibles']
  },
  {
    id: 'sa9', codigo: 'SA9', titulo: 'Comunicación visual digital',
    descripcion: 'Creación de piezas de comunicación visual para redes sociales del centro.',
    asignaturaId: 'asig_epva', evaluacion: 3, sesiones: 10, fechaInicio: '2026-04-01', fechaFin: '2026-05-15',
    competenciasClave: ['CD','CCEC','CP','CMCT'], criteriosEvaluacion: ['epva3.1','epva3.2'],
    instrumentos: [{ id: 'i34', nombre: 'Campaña visual', tipo: 'rubrica', peso: 50, criterios: ['Diseño','Coherencia','Impacto'] }, { id: 'i35', nombre: 'Presentación del proyecto', tipo: 'observacion', peso: 25, criterios: ['Argumentación','Comunicación'] }, { id: 'i36', nombre: 'Portfolio digital', tipo: 'portfolio', peso: 25, criterios: ['Organización','Calidad'] }],
    producto: 'Campaña de comunicación visual completa',
    ods: ['ODS 4: Educación de calidad']
  }
];

export const asignaturas: Asignatura[] = [
  {
    id: 'asig_dt1', nombre: 'Dibujo Técnico I', codigo: 'DT1', curso: '1º Bachillerato', nivel: 'Bachillerato',
    horasSemanales: 4, profesorId: 'u1', grupoIds: ['g2','g3'],
    competenciasEspecificas: competenciasDT1,
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_dt1')
  },
  {
    id: 'asig_dt2', nombre: 'Dibujo Técnico II', codigo: 'DT2', curso: '2º Bachillerato', nivel: 'Bachillerato',
    horasSemanales: 4, profesorId: 'u1', grupoIds: ['g5'],
    competenciasEspecificas: competenciasDT1,
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_dt2')
  },
  {
    id: 'asig_epva', nombre: 'Educación Plástica, Visual y Audiovisual', codigo: 'EPVA', curso: '4º ESO', nivel: 'ESO',
    horasSemanales: 3, profesorId: 'u2', grupoIds: ['g1'],
    competenciasEspecificas: competenciasEPVA,
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_epva')
  },
  {
    id: 'asig_ea', nombre: 'Expresión Artística', codigo: 'EA', curso: '1º Bachillerato', nivel: 'Bachillerato',
    horasSemanales: 3, profesorId: 'u2', grupoIds: ['g4'],
    competenciasEspecificas: [{ id: 'ea1', codigo: 'CE1', descripcion: 'Explorar el lenguaje plástico y visual' }, { id: 'ea2', codigo: 'CE2', descripcion: 'Crear producciones artísticas tridimensionales' }],
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_ea')
  },
  {
    id: 'asig_tp', nombre: 'Taller de Podcast', codigo: 'TP', curso: '1º Bachillerato', nivel: 'Bachillerato',
    horasSemanales: 2, profesorId: 'u3', grupoIds: ['g3'],
    competenciasEspecificas: [{ id: 'tp1', codigo: 'CE1', descripcion: 'Producir contenidos audiovisuales y sonoros' }, { id: 'tp2', codigo: 'CE2', descripcion: 'Analizar críticamente medios de comunicación' }, { id: 'tp3', codigo: 'CE3', descripcion: 'Comunicar eficazmente mediante medios digitales' }],
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_tp')
  },
  {
    id: 'asig_av', nombre: 'Cultura Audiovisual', codigo: 'AV', curso: '2º Bachillerato', nivel: 'Bachillerato',
    horasSemanales: 3, profesorId: 'u2', grupoIds: ['g5'],
    competenciasEspecificas: [{ id: 'av1', codigo: 'CE1', descripcion: 'Analizar producciones audiovisuales' }, { id: 'av2', codigo: 'CE2', descripcion: 'Crear producciones audiovisuales' }],
    situacionesAprendizaje: situacionesAprendizaje.filter(sa => sa.asignaturaId === 'asig_av')
  }
];

export function generarCalificaciones(alumnos: Alumno[]): Calificacion[] {
  const stored = localStorage.getItem('trazo_calificaciones');
  if (stored) return JSON.parse(stored);
  
  const calificaciones: Calificacion[] = [];
  const allInstrumentos = [...instrumentosDT1, ...instrumentosEPVA];
  
  alumnos.forEach(alumno => {
    const asigAlumno = asignaturas.find(a => a.grupoIds.includes(alumno.grupoId));
    if (!asigAlumno) return;
    
    const sas = situacionesAprendizaje.filter(sa => sa.asignaturaId === asigAlumno.id);
    sas.forEach(sa => {
      sa.instrumentos.forEach(inst => {
        const valor = Math.round((Math.random() * 5 + 5) * 10) / 10;
        calificaciones.push({
          id: `cal_${alumno.id}_${inst.id}`,
          alumnoId: alumno.id,
          instrumentoId: inst.id,
          saId: sa.id,
          valor: Math.min(10, Math.max(0, valor)),
          fecha: sa.fechaInicio,
          observaciones: ''
        });
      });
    });
  });
  
  localStorage.setItem('trazo_calificaciones', JSON.stringify(calificaciones));
  return calificaciones;
}

export function generarAsistencia(alumnos: Alumno[]): Asistencia[] {
  const stored = localStorage.getItem('trazo_asistencia');
  if (stored) return JSON.parse(stored);
  
  const asistencia: Asistencia[] = [];
  const fechas = ['2025-09-22','2025-09-24','2025-09-29','2025-10-01','2025-10-06','2025-10-08','2025-10-13','2025-10-15'];
  
  alumnos.forEach(alumno => {
    fechas.forEach(fecha => {
      const rand = Math.random();
      const estado: Asistencia['estado'] = rand > 0.95 ? 'ausente' : rand > 0.9 ? 'retraso' : rand > 0.87 ? 'justificada' : 'presente';
      asistencia.push({
        id: `as_${alumno.id}_${fecha}`,
        alumnoId: alumno.id,
        fecha,
        estado
      });
    });
  });
  
  localStorage.setItem('trazo_asistencia', JSON.stringify(asistencia));
  return asistencia;
}
