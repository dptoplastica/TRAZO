export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'jefatura' | 'profesor';
  avatar?: string;
}

export interface Centro {
  nombre: string;
  localidad: string;
  provincia: string;
  cursoAcademico: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  nivel: string;
  curso: string;
  alumnos: string[];
}

export interface Alumno {
  id: string;
  nombre: string;
  apellidos: string;
  email?: string;
  grupoId: string;
  calificaciones: Calificacion[];
  asistencia: Asistencia[];
  observaciones: string[];
  necesidadesAE?: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
  codigo: string;
  curso: string;
  nivel: string;
  horasSemanales: number;
  profesorId: string;
  grupoIds: string[];
  competenciasEspecificas: CompetenciaEspecifica[];
  situacionesAprendizaje: SituacionAprendizaje[];
}

export interface CompetenciaEspecifica {
  id: string;
  codigo: string;
  descripcion: string;
}

export interface SituacionAprendizaje {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  asignaturaId: string;
  evaluacion: number;
  sesiones: number;
  fechaInicio: string;
  fechaFin: string;
  competenciasClave: string[];
  criteriosEvaluacion: string[];
  instrumentos: Instrumento[];
  producto: string;
  ods: string[];
}

export interface Instrumento {
  id: string;
  nombre: string;
  tipo: 'rubrica' | 'escala' | 'prueba' | 'observacion' | 'coevaluacion' | 'portfolio';
  peso: number;
  criterios: string[];
}

export interface Calificacion {
  id: string;
  alumnoId: string;
  instrumentoId: string;
  saId: string;
  valor: number;
  fecha: string;
  observaciones?: string;
}

export interface Asistencia {
  id: string;
  alumnoId: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'justificada' | 'retraso';
}

export type ViewType = 'dashboard' | 'alumnos' | 'asignaturas' | 'evaluacion' | 'sa' | 'cuaderno' | 'informes';
