export interface Clave { id: string; nombre: string; corto: string; color: string; soft: string; }
export interface Descriptor { id: string; clave: string; texto: string; }
export interface Saber { id: string; codigo: string; texto: string; }
export interface Criterio { id: string; ceId: string; codigo: string; texto: string; saberIds: string[]; }
export interface CompetenciaEspecifica { id: string; codigo: string; texto: string; descriptorIds: string[]; criterios: Criterio[]; }
export interface BloqueSaberes { id: string; nombre: string; saberes: Saber[]; }
export interface Curriculum { id: string; materia: string; etapa: string; niveles: string; bloques: BloqueSaberes[]; ces: CompetenciaEspecifica[]; }

export const CLAVES: Clave[] = [
  { id: "CCL", nombre: "Competencia en comunicación lingüística", corto: "Lingüística", color: "#2c6e8f", soft: "#e0ecf2" },
  { id: "CP", nombre: "Competencia plurilingüe", corto: "Plurilingüe", color: "#4f7cac", soft: "#e4edf5" },
  { id: "STEM", nombre: "Competencia matemática y en ciencia, tecnología e ingeniería", corto: "STEM", color: "#0e7c66", soft: "#e2efe9" },
  { id: "CD", nombre: "Competencia digital", corto: "Digital", color: "#5b6b8f", soft: "#e6e9f2" },
  { id: "CPSAA", nombre: "Competencia personal, social y de aprender a aprender", corto: "Aprender a aprender", color: "#c98a12", soft: "#f7ecd4" },
  { id: "CC", nombre: "Competencia ciudadana", corto: "Ciudadana", color: "#a84a6c", soft: "#f3e2e9" },
  { id: "CE", nombre: "Competencia emprendedora", corto: "Emprendedora", color: "#7a5fb0", soft: "#ece5f6" },
  { id: "CCEC", nombre: "Competencia en conciencia y expresión culturales", corto: "Cultural", color: "#d9532c", soft: "#f9e6de" },
];

export const DESCRIPTORES: Descriptor[] = [
  { id: "CCL1", clave: "CCL", texto: "Se expresa de forma oral, escrita, signada o multimodal con coherencia, corrección y adecuación al contexto." },
  { id: "CCL2", clave: "CCL", texto: "Comprende, interpreta y valora con actitud crítica textos orales, escritos, signados o multimodales." },
  { id: "CCL3", clave: "CCL", texto: "Comprende y analiza textos de los ámbitos personal, social, educativo y profesional." },
  { id: "CCL4", clave: "CCL", texto: "Produce de forma adecuada y autónoma textos orales, escritos, signados y multimodales." },
  { id: "CCL5", clave: "CCL", texto: "Reconoce y reflexiona sobre los usos sociales de la lengua." },
  { id: "CP1", clave: "CP", texto: "Usa eficazmente distintas lenguas y repertorios lingüísticos." },
  { id: "CP2", clave: "CP", texto: "Reconoce y respeta la diversidad lingüística y cultural." },
  { id: "CP3", clave: "CP", texto: "Integra y utiliza de forma adecuada distintas lenguas y sus culturas." },
  { id: "CP4", clave: "CP", texto: "Utiliza una o más lenguas con creatividad e interés personal." },
  { id: "STEM1", clave: "STEM", texto: "Utiliza métodos de indagación y procedimientos del pensamiento científico." },
  { id: "STEM2", clave: "STEM", texto: "Razona con precisión y rigor al formular y resolver problemas." },
  { id: "STEM3", clave: "STEM", texto: "Formula y verifica hipótesis, contrastándolas con datos y evidencias." },
  { id: "STEM4", clave: "STEM", texto: "Interpreta y transmite elementos de procesos de indagación científica." },
  { id: "STEM5", clave: "STEM", texto: "Aplica el pensamiento científico a situaciones de la vida cotidiana." },
  { id: "CD1", clave: "CD", texto: "Realiza búsquedas en internet con criterios de validez y calidad." },
  { id: "CD2", clave: "CD", texto: "Crea e integra contenidos digitales aplicando medidas de seguridad." },
  { id: "CD3", clave: "CD", texto: "Selecciona y utiliza dispositivos y aplicaciones digitales." },
  { id: "CD4", clave: "CD", texto: "Protege los datos personales y adopta medidas de seguridad digital." },
  { id: "CD5", clave: "CD", texto: "Participa en la sociedad digital de forma activa y cívica." },
  { id: "CPSAA1", clave: "CPSAA", texto: "Reconoce y gestiona emociones propias y ajenas." },
  { id: "CPSAA2", clave: "CPSAA", texto: "Adopta una actitud resiliente y proactiva ante el cambio." },
  { id: "CPSAA3", clave: "CPSAA", texto: "Planifica y gestiona proyectos individuales o grupales." },
  { id: "CPSAA4", clave: "CPSAA", texto: "Reflexiona y autorregula su propio proceso de aprendizaje." },
  { id: "CPSAA5", clave: "CPSAA", texto: "Se adapta a situaciones cambiantes y tolera la frustración." },
  { id: "CC1", clave: "CC", texto: "Analiza problemáticas locales y globales con perspectiva crítica." },
  { id: "CC2", clave: "CC", texto: "Adopta un estilo de vida sostenible y responsable." },
  { id: "CC3", clave: "CC", texto: "Promueve el respeto y la resolución dialogada de conflictos." },
  { id: "CC4", clave: "CC", texto: "Participa activamente en la vida cívica y democrática." },
  { id: "CE1", clave: "CE", texto: "Analiza necesidades y oportunidades con sentido de la iniciativa." },
  { id: "CE2", clave: "CE", texto: "Evalúa ideas y soluciones creativas valorando su viabilidad." },
  { id: "CE3", clave: "CE", texto: "Planifica y gestiona proyectos movilizando recursos." },
  { id: "CE4", clave: "CE", texto: "Evalúa el desarrollo y resultados de los proyectos emprendidos." },
  { id: "CCEC1", clave: "CCEC", texto: "Aprecia y analiza críticamente manifestaciones artísticas y culturales." },
  { id: "CCEC2", clave: "CCEC", texto: "Respeta y valora las manifestaciones culturales diversas." },
  { id: "CCEC3", clave: "CCEC", texto: "Expresa ideas y emociones mediante lenguajes artísticos." },
  { id: "CCEC4", clave: "CCEC", texto: "Participa en proyectos artísticos y culturales del entorno." },
];

const EPVA: Curriculum = {
  id: "epva-eso", materia: "Educación Plástica, Visual y Audiovisual", etapa: "ESO", niveles: "2º y 4º ESO",
  bloques: [
    { id: "epva-A", nombre: "A · Percepción y análisis de la imagen", saberes: [
      { id: "epva.A1", codigo: "A1", texto: "Elementos del lenguaje visual: punto, línea, plano, textura, color y composición." },
      { id: "epva.A2", codigo: "A2", texto: "Lectura de imágenes: denotación y connotación; persuasión y manipulación visual." },
      { id: "epva.A3", codigo: "A3", texto: "Percepción y representación del espacio: óptica, geometría y percepción." },
    ]},
    { id: "epva-B", nombre: "B · Expresión y creación", saberes: [
      { id: "epva.B1", codigo: "B1", texto: "Técnicas artísticas: dibujo, pintura, collage, grabado y volumen." },
      { id: "epva.B2", codigo: "B2", texto: "El color: propiedades, armonías, simbolismo y aplicaciones." },
      { id: "epva.B3", codigo: "B3", texto: "Composición, ritmo y proporción en la obra plástica." },
      { id: "epva.B4", codigo: "B4", texto: "Fotografía y vídeo digital: captura, edición y montaje." },
      { id: "epva.B5", codigo: "B5", texto: "Animación y narrativa audiovisual: storyboard y stop-motion." },
      { id: "epva.B6", codigo: "B6", texto: "Diseño gráfico: tipografía, maquetación, identidad visual y cartel." },
    ]},
    { id: "epva-C", nombre: "C · Patrimonio artístico y cultural", saberes: [
      { id: "epva.C1", codigo: "C1", texto: "Movimientos artísticos y autores: de las vanguardias a la creación contemporánea." },
      { id: "epva.C2", codigo: "C2", texto: "Patrimonio cultural y artístico de Cantabria y del entorno próximo." },
    ]},
  ],
  ces: [
    { id: "epva.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCEC1", "CCEC2", "CPSAA1"], texto: "Percibir y analizar las manifestaciones del entorno plástico, visual y audiovisual.", criterios: [
      { id: "epva.1.1", ceId: "epva.ce1", codigo: "1.1", saberIds: ["epva.A1", "epva.A2"], texto: "Identificar y describir con sentido crítico los elementos formales y simbólicos de imágenes y manifestaciones artísticas." },
      { id: "epva.1.2", ceId: "epva.ce1", codigo: "1.2", saberIds: ["epva.A2", "epva.C1"], texto: "Analizar de forma guiada obras audiovisuales y del patrimonio artístico y cultural." },
    ]},
    { id: "epva.ce2", codigo: "CE2", descriptorIds: ["CCEC3", "STEM2", "CE2"], texto: "Crear piezas plásticas, visuales y audiovisuales con intención comunicativa y expresiva.", criterios: [
      { id: "epva.2.1", ceId: "epva.ce2", codigo: "2.1", saberIds: ["epva.B1", "epva.B2", "epva.B3"], texto: "Expresar ideas y emociones mediante la creación de dibujos, pinturas, collages y otras piezas plásticas." },
      { id: "epva.2.2", ceId: "epva.ce2", codigo: "2.2", saberIds: ["epva.B4", "epva.B5"], texto: "Crear piezas audiovisuales básicas integrando herramientas digitales y procesos técnicos." },
    ]},
    { id: "epva.ce3", codigo: "CE3", descriptorIds: ["CCL4", "CD2", "CCEC3"], texto: "Comunicar ideas, mensajes y proyectos a través de los lenguajes de la comunicación visual.", criterios: [
      { id: "epva.3.1", ceId: "epva.ce3", codigo: "3.1", saberIds: ["epva.B2", "epva.B6"], texto: "Diseñar piezas de comunicación gráfica aplicando criterios de composición, tipografía y color." },
      { id: "epva.3.2", ceId: "epva.ce3", codigo: "3.2", saberIds: ["epva.A1", "epva.B6"], texto: "Organizar y presentar los procesos y resultados del trabajo creativo de forma clara." },
    ]},
    { id: "epva.ce4", codigo: "CE4", descriptorIds: ["CC2", "CCEC2", "CPSAA2"], texto: "Valorar el patrimonio artístico y cultural desarrollando actitudes de respeto y conservación.", criterios: [
      { id: "epva.4.1", ceId: "epva.ce4", codigo: "4.1", saberIds: ["epva.C1", "epva.C2"], texto: "Reconocer y valorar obras y autores relevantes del patrimonio artístico y cultural." },
      { id: "epva.4.2", ceId: "epva.ce4", codigo: "4.2", saberIds: ["epva.C2"], texto: "Proponer acciones de conservación y difusión del patrimonio cultural." },
    ]},
    { id: "epva.ce5", codigo: "CE5", descriptorIds: ["CPSAA3", "CC4", "CE3"], texto: "Participar en proyectos de creación plástica, visual y audiovisual de forma cooperativa.", criterios: [
      { id: "epva.5.1", ceId: "epva.ce5", codigo: "5.1", saberIds: ["epva.B5", "epva.B6"], texto: "Planificar y desarrollar proyectos de creación en equipo, asumiendo roles." },
      { id: "epva.5.2", ceId: "epva.ce5", codigo: "5.2", saberIds: ["epva.B6"], texto: "Evaluar el proceso y resultado de proyectos colectivos con actitud constructiva." },
    ]},
  ],
};

const EA: Curriculum = {
  id: "ea-bach", materia: "Expresión Artística", etapa: "Bachillerato", niveles: "1º Bachillerato",
  bloques: [
    { id: "ea-A", nombre: "A · Investigación artística", saberes: [
      { id: "ea.A1", codigo: "A1", texto: "Lenguajes artísticos contemporáneos: tendencias, autores y obras." },
      { id: "ea.A2", codigo: "A2", texto: "Fuentes y documentación del proceso creativo: portfolio y diario artístico." },
    ]},
    { id: "ea-B", nombre: "B · Creación artística", saberes: [
      { id: "ea.B1", codigo: "B1", texto: "Dibujo expresivo: línea, forma, espacio y gesto." },
      { id: "ea.B2", codigo: "B2", texto: "Color, textura y composición en la expresión artística." },
      { id: "ea.B3", codigo: "B3", texto: "Volumen, espacio e instalación." },
      { id: "ea.B4", codigo: "B4", texto: "Fotografía, vídeo y creación digital." },
      { id: "ea.B5", codigo: "B5", texto: "Lenguajes performativos y sonoros." },
      { id: "ea.B6", codigo: "B6", texto: "Presentación y difusión del proyecto artístico." },
    ]},
    { id: "ea-C", nombre: "C · Patrimonio artístico", saberes: [
      { id: "ea.C1", codigo: "C1", texto: "Contextos históricos y culturales de las manifestaciones artísticas." },
      { id: "ea.C2", codigo: "C2", texto: "Patrimonio cultural: conservación, difusión y puesta en valor." },
    ]},
  ],
  ces: [
    { id: "ea.ce1", codigo: "CE1", descriptorIds: ["CCL2", "STEM1", "CCEC1"], texto: "Investigar y documentar procesos de creación artística.", criterios: [
      { id: "ea.1.1", ceId: "ea.ce1", codigo: "1.1", saberIds: ["ea.A1", "ea.A2"], texto: "Recopilar, organizar y analizar críticamente referentes artísticos." },
      { id: "ea.1.2", ceId: "ea.ce1", codigo: "1.2", saberIds: ["ea.A2"], texto: "Documentar el proceso de investigación y creación en formatos diversos." },
    ]},
    { id: "ea.ce2", codigo: "CE2", descriptorIds: ["CCEC3", "STEM3", "CE2"], texto: "Experimentar con materiales, técnicas y procedimientos artísticos.", criterios: [
      { id: "ea.2.1", ceId: "ea.ce2", codigo: "2.1", saberIds: ["ea.B1", "ea.B2", "ea.B3"], texto: "Crear piezas experimentando con lenguajes plásticos, visuales, sonoros o performativos." },
      { id: "ea.2.2", ceId: "ea.ce2", codigo: "2.2", saberIds: ["ea.B4", "ea.B5"], texto: "Combinar lenguajes y técnicas diversas en creaciones propias." },
    ]},
    { id: "ea.ce3", codigo: "CE3", descriptorIds: ["CCL4", "CCEC3", "CPSAA1"], texto: "Expresar y comunicar ideas y emociones a través de la creación artística.", criterios: [
      { id: "ea.3.1", ceId: "ea.ce3", codigo: "3.1", saberIds: ["ea.A1", "ea.B6"], texto: "Desarrollar proyectos creativos personales justificando las decisiones adoptadas." },
      { id: "ea.3.2", ceId: "ea.ce3", codigo: "3.2", saberIds: ["ea.B6"], texto: "Comunicar el sentido y valor de las obras propias mediante presentaciones." },
    ]},
    { id: "ea.ce4", codigo: "CE4", descriptorIds: ["CC3", "CCEC2", "CPSAA3"], texto: "Participar en manifestaciones artístico-culturales colectivas.", criterios: [
      { id: "ea.4.1", ceId: "ea.ce4", codigo: "4.1", saberIds: ["ea.B5", "ea.A2"], texto: "Colaborar en proyectos de creación grupal asumiendo responsabilidades." },
      { id: "ea.4.2", ceId: "ea.ce4", codigo: "4.2", saberIds: ["ea.C1"], texto: "Analizar manifestaciones artísticas colectivas con sentido crítico." },
    ]},
    { id: "ea.ce5", codigo: "CE5", descriptorIds: ["CCEC1", "CCEC2", "CC2"], texto: "Valorar el patrimonio artístico y cultural como fuente de conocimiento.", criterios: [
      { id: "ea.5.1", ceId: "ea.ce5", codigo: "5.1", saberIds: ["ea.C1", "ea.C2"], texto: "Analizar obras del patrimonio artístico contextualizándolas histórica y culturalmente." },
      { id: "ea.5.2", ceId: "ea.ce5", codigo: "5.2", saberIds: ["ea.C2"], texto: "Proponer acciones de difusión del patrimonio artístico del entorno." },
    ]},
  ],
};

const DT1: Curriculum = {
  id: "dt1-bach", materia: "Dibujo Técnico I", etapa: "Bachillerato", niveles: "1º Bachillerato",
  bloques: [
    { id: "dt1-A", nombre: "A · Fundamentos geométricos", saberes: [
      { id: "dt1.A1", codigo: "A1", texto: "Desarrollo histórico del dibujo técnico. Campos de acción y aplicaciones." },
      { id: "dt1.A2", codigo: "A2", texto: "Orígenes de la geometría. Thales, Pitágoras, Euclides, Hipatia." },
      { id: "dt1.A3", codigo: "A3", texto: "Concepto de lugar geométrico. Arco capaz. Aplicaciones." },
      { id: "dt1.A4", codigo: "A4", texto: "Proporcionalidad, equivalencia y semejanza." },
      { id: "dt1.A5", codigo: "A5", texto: "Triángulos, cuadriláteros y polígonos regulares. Propiedades y construcción." },
      { id: "dt1.A6", codigo: "A6", texto: "Tangencias básicas. Curvas técnicas." },
      { id: "dt1.A7", codigo: "A7", texto: "Interés por el rigor, precisión, claridad y limpieza." },
    ]},
    { id: "dt1-B", nombre: "B · Geometría proyectiva", saberes: [
      { id: "dt1.B1", codigo: "B1", texto: "Fundamentos de la geometría proyectiva." },
      { id: "dt1.B2", codigo: "B2", texto: "Sistema diédrico: punto, recta y plano. Trazas y pertenencia." },
      { id: "dt1.B3", codigo: "B3", texto: "Relaciones entre elementos: intersecciones, paralelismo, perpendicularidad." },
      { id: "dt1.B4", codigo: "B4", texto: "Sistema axonométrico. Perspectivas isométrica y caballera." },
      { id: "dt1.B5", codigo: "B5", texto: "Sistema de planos acotados. Fundamentos y elementos básicos." },
      { id: "dt1.B6", codigo: "B6", texto: "Sistema cónico: fundamentos y perspectiva frontal y oblicua." },
    ]},
    { id: "dt1-C", nombre: "C · Normalización y documentación gráfica", saberes: [
      { id: "dt1.C1", codigo: "C1", texto: "Escalas numéricas y gráficas. Construcción y uso." },
      { id: "dt1.C2", codigo: "C2", texto: "Formatos. Doblado de planos." },
      { id: "dt1.C3", codigo: "C3", texto: "Concepto de normalización. Normas UNE e ISO." },
      { id: "dt1.C4", codigo: "C4", texto: "Elección de vistas. Líneas normalizadas. Acotación." },
    ]},
    { id: "dt1-D", nombre: "D · Sistemas CAD", saberes: [
      { id: "dt1.D1", codigo: "D1", texto: "Aplicaciones vectoriales 2D-3D." },
      { id: "dt1.D2", codigo: "D2", texto: "Fundamentos de diseño de piezas en tres dimensiones." },
      { id: "dt1.D3", codigo: "D3", texto: "Modelado de caja. Operaciones básicas con primitivas." },
      { id: "dt1.D4", codigo: "D4", texto: "Aplicaciones de trabajo en grupo para piezas complejas." },
    ]},
  ],
  ces: [
    { id: "dt1.ce1", codigo: "CE1", descriptorIds: ["STEM1", "STEM2", "CCL3", "CCEC1"], texto: "Interpretar elementos o conjuntos arquitectónicos y de ingeniería.", criterios: [
      { id: "dt1.1.1", ceId: "dt1.ce1", codigo: "1.1", saberIds: ["dt1.A1", "dt1.A2", "dt1.A3"], texto: "Analizar la relación entre las matemáticas y el dibujo geométrico valorando su importancia en arquitectura e ingeniería." },
    ]},
    { id: "dt1.ce2", codigo: "CE2", descriptorIds: ["STEM2", "STEM3", "CPSAA4"], texto: "Utilizar razonamientos inductivos, deductivos y lógicos en problemas gráfico-matemáticos.", criterios: [
      { id: "dt1.2.1", ceId: "dt1.ce2", codigo: "2.1", saberIds: ["dt1.A3", "dt1.A4"], texto: "Solucionar gráficamente cálculos matemáticos y transformaciones básicas." },
      { id: "dt1.2.2", ceId: "dt1.ce2", codigo: "2.2", saberIds: ["dt1.A5", "dt1.A7"], texto: "Trazar gráficamente construcciones poligonales con precisión y limpieza." },
      { id: "dt1.2.3", ceId: "dt1.ce2", codigo: "2.3", saberIds: ["dt1.A6", "dt1.A7"], texto: "Resolver gráficamente tangencias y trazar curvas con rigor." },
    ]},
    { id: "dt1.ce3", codigo: "CE3", descriptorIds: ["STEM2", "STEM4", "CPSAA3"], texto: "Desarrollar la visión espacial utilizando la geometría descriptiva.", criterios: [
      { id: "dt1.3.1", ceId: "dt1.ce3", codigo: "3.1", saberIds: ["dt1.B1", "dt1.B2", "dt1.B3"], texto: "Representar en sistema diédrico elementos básicos determinando pertenencia, posición y distancia." },
      { id: "dt1.3.2", ceId: "dt1.ce3", codigo: "3.2", saberIds: ["dt1.B4"], texto: "Definir elementos y figuras planas en sistemas axonométricos." },
      { id: "dt1.3.3", ceId: "dt1.ce3", codigo: "3.3", saberIds: ["dt1.B5"], texto: "Representar e interpretar elementos básicos en planos acotados." },
      { id: "dt1.3.4", ceId: "dt1.ce3", codigo: "3.4", saberIds: ["dt1.B6"], texto: "Dibujar elementos en el espacio empleando la perspectiva cónica." },
      { id: "dt1.3.5", ceId: "dt1.ce3", codigo: "3.5", saberIds: ["dt1.A7", "dt1.B1", "dt1.B2"], texto: "Valorar el rigor gráfico del proceso; la claridad y precisión." },
    ]},
    { id: "dt1.ce4", codigo: "CE4", descriptorIds: ["STEM4", "CPSAA3", "CE3"], texto: "Formalizar diseños técnicos aplicando normas UNE e ISO.", criterios: [
      { id: "dt1.4.1", ceId: "dt1.ce4", codigo: "4.1", saberIds: ["dt1.C1", "dt1.C2", "dt1.C3", "dt1.C4"], texto: "Documentar gráficamente objetos mediante vistas acotadas aplicando normativa UNE e ISO." },
      { id: "dt1.4.2", ceId: "dt1.ce4", codigo: "4.2", saberIds: ["dt1.C4", "dt1.A7"], texto: "Utilizar el croquis como elemento de reflexión en procesos de trabajo." },
    ]},
    { id: "dt1.ce5", codigo: "CE5", descriptorIds: ["CD2", "CD3", "STEM5", "CE4"], texto: "Investigar y representar digitalmente elementos técnicos mediante CAD.", criterios: [
      { id: "dt1.5.1", ceId: "dt1.ce5", codigo: "5.1", saberIds: ["dt1.D1", "dt1.D2"], texto: "Crear figuras planas y tridimensionales mediante programas de dibujo vectorial." },
      { id: "dt1.5.2", ceId: "dt1.ce5", codigo: "5.2", saberIds: ["dt1.D3", "dt1.D4"], texto: "Recrear virtualmente piezas en 3D aplicando operaciones con primitivas." },
    ]},
  ],
};

const DT: Curriculum = {
  id: "dt-bach", materia: "Dibujo Técnico II", etapa: "Bachillerato", niveles: "2º Bachillerato",
  bloques: [
    { id: "dt-A", nombre: "A · Geometría plana y del espacio", saberes: [
      { id: "dt.A1", codigo: "A1", texto: "Construcciones fundamentales: paralelismo, perpendicularidad, ángulos." },
      { id: "dt.A2", codigo: "A2", texto: "Tangencias, equivalencias, transformaciones y cónicas." },
      { id: "dt.A3", codigo: "A3", texto: "Polígonos, proporción, escala y sistemas modulares." },
    ]},
    { id: "dt-B", nombre: "B · Sistemas de representación", saberes: [
      { id: "dt.B1", codigo: "B1", texto: "Sistema diédrico: punto, recta y plano." },
      { id: "dt.B2", codigo: "B2", texto: "Secciones, intersecciones, abatimientos y verdaderas magnitudes." },
      { id: "dt.B3", codigo: "B3", texto: "Axonometría: perspectivas isométrica, dimétrica y caballera." },
      { id: "dt.B4", codigo: "B4", texto: "Sistema cónico: fundamentos de la perspectiva cónica." },
    ]},
    { id: "dt-C", nombre: "C · Normalización", saberes: [
      { id: "dt.C1", codigo: "C1", texto: "Normas: tipos de línea, vistas, cortes y secciones." },
      { id: "dt.C2", codigo: "C2", texto: "Acotación, rotulación y escalas." },
      { id: "dt.C3", codigo: "C3", texto: "Presentación de planos y documentación gráfica." },
    ]},
    { id: "dt-D", nombre: "D · Diseño digital (CAD)", saberes: [
      { id: "dt.D1", codigo: "D1", texto: "CAD paramétrico 2D y modelado 3D." },
    ]},
  ],
  ces: [
    { id: "dt.ce1", codigo: "CE1", descriptorIds: ["STEM1", "STEM2", "CPSAA4"], texto: "Resolver problemas geométricos aplicando construcciones y teoremas.", criterios: [
      { id: "dt.1.1", ceId: "dt.ce1", codigo: "1.1", saberIds: ["dt.A1", "dt.A2"], texto: "Resolver problemas de tangencias, equivalencias y cónicas." },
      { id: "dt.1.2", ceId: "dt.ce1", codigo: "1.2", saberIds: ["dt.A3", "dt.B4"], texto: "Representar objetos aplicando principios de escala y proporción." },
    ]},
    { id: "dt.ce2", codigo: "CE2", descriptorIds: ["STEM2", "STEM4", "CD2"], texto: "Representar objetos en los distintos sistemas de representación.", criterios: [
      { id: "dt.2.1", ceId: "dt.ce2", codigo: "2.1", saberIds: ["dt.B1", "dt.B2"], texto: "Representar piezas en sistema diédrico resolviendo secciones e intersecciones." },
      { id: "dt.2.2", ceId: "dt.ce2", codigo: "2.2", saberIds: ["dt.B3"], texto: "Elaborar perspectivas isométricas y caballeras." },
    ]},
    { id: "dt.ce3", codigo: "CE3", descriptorIds: ["STEM4", "CPSAA3", "CE3"], texto: "Aplicar la normalización del dibujo técnico en croquis y planos.", criterios: [
      { id: "dt.3.1", ceId: "dt.ce3", codigo: "3.1", saberIds: ["dt.C1", "dt.C2"], texto: "Dibujar vistas, cortes y detalles normalizados." },
      { id: "dt.3.2", ceId: "dt.ce3", codigo: "3.2", saberIds: ["dt.C2", "dt.C3"], texto: "Elaborar planos de proyectos siguiendo criterios normativos." },
    ]},
    { id: "dt.ce4", codigo: "CE4", descriptorIds: ["CD2", "CD3", "STEM5"], texto: "Utilizar herramientas digitales y CAD para el diseño.", criterios: [
      { id: "dt.4.1", ceId: "dt.ce4", codigo: "4.1", saberIds: ["dt.D1"], texto: "Modelar piezas con herramientas CAD paramétricas." },
      { id: "dt.4.2", ceId: "dt.ce4", codigo: "4.2", saberIds: ["dt.D1", "dt.C3"], texto: "Comunicar proyectos integrando representaciones analógicas y digitales." },
    ]},
  ],
};

const TP: Curriculum = {
  id: "tp-bach", materia: "Taller de Podcast", etapa: "Bachillerato", niveles: "1º Bachillerato",
  bloques: [
    { id: "tp-A", nombre: "A · Cultura sonora y lenguaje radiofónico", saberes: [
      { id: "tp.A1", codigo: "A1", texto: "Historia y evolución del medio sonoro." },
      { id: "tp.A2", codigo: "A2", texto: "Géneros y formatos sonoros." },
      { id: "tp.A3", codigo: "A3", texto: "Escucha crítica: análisis de podcasts de referencia." },
    ]},
    { id: "tp-B", nombre: "B · Guion y narrativa sonora", saberes: [
      { id: "tp.B1", codigo: "B1", texto: "Estructura del guion radiofónico." },
      { id: "tp.B2", codigo: "B2", texto: "Técnicas narrativas: ritmo, tensión, storytelling." },
      { id: "tp.B3", codigo: "B3", texto: "La voz como herramienta expresiva." },
      { id: "tp.B4", codigo: "B4", texto: "Diseño sonoro: música, ambientes, efectos." },
    ]},
    { id: "tp-C", nombre: "C · Producción y edición digital", saberes: [
      { id: "tp.C1", codigo: "C1", texto: "Captación de audio: micrófonos y técnicas." },
      { id: "tp.C2", codigo: "C2", texto: "Edición no lineal con DAW." },
      { id: "tp.C3", codigo: "C3", texto: "Postproducción: masterización y exportación." },
      { id: "tp.C4", codigo: "C4", texto: "Identidad sonora y gráfica del podcast." },
    ]},
    { id: "tp-D", nombre: "D · Difusión, ética y proyecto", saberes: [
      { id: "tp.D1", codigo: "D1", texto: "Publicación y distribución: plataformas, RSS." },
      { id: "tp.D2", codigo: "D2", texto: "Ética del medio: derechos de autor, privacidad." },
      { id: "tp.D3", codigo: "D3", texto: "Proyecto de podcast: planificación y evaluación." },
    ]},
  ],
  ces: [
    { id: "tp.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCL3", "CCEC1"], texto: "Analizar críticamente productos sonoros y podcast de referencia.", criterios: [
      { id: "tp.1.1", ceId: "tp.ce1", codigo: "1.1", saberIds: ["tp.A1", "tp.A2", "tp.A3"], texto: "Analizar podcasts identificando género, estructura y recursos sonoros." },
      { id: "tp.1.2", ceId: "tp.ce1", codigo: "1.2", saberIds: ["tp.A3", "tp.D2"], texto: "Valorar críticamente la calidad informativa y ética de productos sonoros." },
    ]},
    { id: "tp.ce2", codigo: "CE2", descriptorIds: ["CCL4", "CPSAA1", "CCEC3"], texto: "Diseñar guiones y estructuras narrativas sonoras coherentes.", criterios: [
      { id: "tp.2.1", ceId: "tp.ce2", codigo: "2.1", saberIds: ["tp.B1", "tp.B2"], texto: "Elaborar escaletas y guiones técnicos y literarios." },
      { id: "tp.2.2", ceId: "tp.ce2", codigo: "2.2", saberIds: ["tp.B3", "tp.B4"], texto: "Diseñar el paisaje sonoro del proyecto." },
    ]},
    { id: "tp.ce3", codigo: "CE3", descriptorIds: ["CD2", "CD3", "STEM4"], texto: "Producir contenidos sonoros de calidad técnica.", criterios: [
      { id: "tp.3.1", ceId: "tp.ce3", codigo: "3.1", saberIds: ["tp.C1"], texto: "Grabar voces y ambientes aplicando técnicas de captación." },
      { id: "tp.3.2", ceId: "tp.ce3", codigo: "3.2", saberIds: ["tp.C2", "tp.C3"], texto: "Editar, mezclar y masterizar con un DAW." },
      { id: "tp.3.3", ceId: "tp.ce3", codigo: "3.3", saberIds: ["tp.C4"], texto: "Diseñar la identidad sonora y gráfica del podcast." },
    ]},
    { id: "tp.ce4", codigo: "CE4", descriptorIds: ["CC4", "CE3", "CPSAA3"], texto: "Planificar y ejecutar proyectos de podcast en equipo.", criterios: [
      { id: "tp.4.1", ceId: "tp.ce4", codigo: "4.1", saberIds: ["tp.D3"], texto: "Planificar un proyecto de podcast definiendo roles y cronograma." },
      { id: "tp.4.2", ceId: "tp.ce4", codigo: "4.2", saberIds: ["tp.D1", "tp.D3"], texto: "Publicar y difundir el podcast en plataformas digitales." },
    ]},
    { id: "tp.ce5", codigo: "CE5", descriptorIds: ["CC3", "CCEC2", "CPSAA5"], texto: "Reflexionar sobre el impacto social del podcasting.", criterios: [
      { id: "tp.5.1", ceId: "tp.ce5", codigo: "5.1", saberIds: ["tp.D2"], texto: "Aplicar criterios éticos en la producción sonora." },
      { id: "tp.5.2", ceId: "tp.ce5", codigo: "5.2", saberIds: ["tp.D1", "tp.D2"], texto: "Evaluar el impacto social del proyecto sonoro." },
    ]},
  ],
};

const TC: Curriculum = {
  id: "tc-bach", materia: "Taller de Cortometraje", etapa: "Bachillerato", niveles: "2º Bachillerato",
  bloques: [
    { id: "tc-A", nombre: "A · Lenguaje cinematográfico", saberes: [
      { id: "tc.A1", codigo: "A1", texto: "Historia del cine: movimientos, autores y obras." },
      { id: "tc.A2", codigo: "A2", texto: "Elementos del lenguaje cinematográfico." },
      { id: "tc.A3", codigo: "A3", texto: "Géneros cinematográficos." },
      { id: "tc.A4", codigo: "A4", texto: "Narrativa audiovisual: estructura dramática." },
      { id: "tc.A5", codigo: "A5", texto: "Análisis fílmico: lectura crítica." },
    ]},
    { id: "tc-B", nombre: "B · Guion y preproducción", saberes: [
      { id: "tc.B1", codigo: "B1", texto: "Ideación y desarrollo de la idea." },
      { id: "tc.B2", codigo: "B2", texto: "Escritura de guion literario." },
      { id: "tc.B3", codigo: "B3", texto: "Guion técnico: plan de rodaje, storyboard." },
      { id: "tc.B4", codigo: "B4", texto: "Preproducción: casting, localizaciones." },
      { id: "tc.B5", codigo: "B5", texto: "Diseño de producción: presupuesto, cronograma." },
    ]},
    { id: "tc-C", nombre: "C · Producción y rodaje", saberes: [
      { id: "tc.C1", codigo: "C1", texto: "Dirección de actores." },
      { id: "tc.C2", codigo: "C2", texto: "Dirección de fotografía." },
      { id: "tc.C3", codigo: "C3", texto: "Dirección de sonido." },
      { id: "tc.C4", codigo: "C4", texto: "Dirección de arte." },
      { id: "tc.C5", codigo: "C5", texto: "Rodaje: organización del set." },
    ]},
    { id: "tc-D", nombre: "D · Postproducción y distribución", saberes: [
      { id: "tc.D1", codigo: "D1", texto: "Montaje: teoría y práctica." },
      { id: "tc.D2", codigo: "D2", texto: "Edición no lineal con software profesional." },
      { id: "tc.D3", codigo: "D3", texto: "Corrección de color y etalonaje." },
      { id: "tc.D4", codigo: "D4", texto: "Diseño sonoro: música, efectos, mezcla." },
      { id: "tc.D5", codigo: "D5", texto: "Distribución y festivales." },
    ]},
  ],
  ces: [
    { id: "tc.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCL3", "CCEC1", "CCEC2"], texto: "Analizar obras cinematográficas de referencia.", criterios: [
      { id: "tc.1.1", ceId: "tc.ce1", codigo: "1.1", saberIds: ["tc.A1", "tc.A2", "tc.A5"], texto: "Analizar cortometrajes identificando elementos del lenguaje cinematográfico." },
      { id: "tc.1.2", ceId: "tc.ce1", codigo: "1.2", saberIds: ["tc.A3", "tc.A5"], texto: "Contextualizar obras cinematográficas en su momento histórico." },
    ]},
    { id: "tc.ce2", codigo: "CE2", descriptorIds: ["CCL4", "CCEC3", "CE2"], texto: "Diseñar proyectos audiovisuales originales.", criterios: [
      { id: "tc.2.1", ceId: "tc.ce2", codigo: "2.1", saberIds: ["tc.B1", "tc.B2"], texto: "Desarrollar ideas originales elaborando guion literario profesional." },
      { id: "tc.2.2", ceId: "tc.ce2", codigo: "2.2", saberIds: ["tc.B3", "tc.B4"], texto: "Elaborar guion técnico, storyboard y plan de rodaje." },
    ]},
    { id: "tc.ce3", codigo: "CE3", descriptorIds: ["CD2", "CD3", "STEM4", "CPSAA3"], texto: "Planificar y organizar la producción de un cortometraje.", criterios: [
      { id: "tc.3.1", ceId: "tc.ce3", codigo: "3.1", saberIds: ["tc.B4", "tc.B5"], texto: "Elaborar un plan de producción completo." },
      { id: "tc.3.2", ceId: "tc.ce3", codigo: "3.2", saberIds: ["tc.C5"], texto: "Coordinar el rodaje gestionando equipo y recursos." },
    ]},
    { id: "tc.ce4", codigo: "CE4", descriptorIds: ["CCEC3", "CD2", "CPSAA1"], texto: "Dirigir el rodaje de un cortometraje.", criterios: [
      { id: "tc.4.1", ceId: "tc.ce4", codigo: "4.1", saberIds: ["tc.C1", "tc.C2", "tc.C3"], texto: "Dirigir a actores y coordinar departamentos técnicos." },
      { id: "tc.4.2", ceId: "tc.ce4", codigo: "4.2", saberIds: ["tc.C4", "tc.C5"], texto: "Supervisar la dirección de arte y coherencia estética." },
    ]},
    { id: "tc.ce5", codigo: "CE5", descriptorIds: ["CD2", "CD3", "CCEC3", "CPSAA4"], texto: "Realizar la postproducción del cortometraje.", criterios: [
      { id: "tc.5.1", ceId: "tc.ce5", codigo: "5.1", saberIds: ["tc.D1", "tc.D2"], texto: "Montar el cortometraje aplicando criterios de ritmo y narrativa." },
      { id: "tc.5.2", ceId: "tc.ce5", codigo: "5.2", saberIds: ["tc.D3", "tc.D4"], texto: "Realizar corrección de color y diseño sonoro final." },
      { id: "tc.5.3", ceId: "tc.ce5", codigo: "5.3", saberIds: ["tc.D5"], texto: "Preparar el cortometraje para distribución en festivales." },
    ]},
  ],
};

export const CURRICULA: Record<string, Curriculum> = {
  "epva-eso": EPVA, "ea-bach": EA, "dt-bach": DT, "dt1-bach": DT1, "tp-bach": TP, "tc-bach": TC,
};

export const getCurriculum = (id: string): Curriculum => CURRICULA[id] ?? EPVA;
export const allCriterios = (cur: Curriculum): Criterio[] => cur.ces.flatMap((ce) => ce.criterios);
export const criterioById = (cur: Curriculum, id: string): Criterio | undefined => allCriterios(cur).find((c) => c.id === id);
export const ceById = (cur: Curriculum, id: string): CompetenciaEspecifica | undefined => cur.ces.find((c) => c.id === id);
export const saberById = (cur: Curriculum, id: string): Saber | undefined => cur.bloques.flatMap((b) => b.saberes).find((s) => s.id === id);
export const descriptorById = (id: string): Descriptor | undefined => DESCRIPTORES.find((d) => d.id === id);
export const claveById = (id: string): Clave => CLAVES.find((c) => c.id === id) ?? CLAVES[0];
export const clavesDeCE = (ce: CompetenciaEspecifica): string[] => [...new Set(ce.descriptorIds.map((d) => d.slice(0, d.search(/\d/))))];
export const criteriosDeSaber = (cur: Curriculum, saberId: string): Criterio[] => allCriterios(cur).filter((c) => c.saberIds.includes(saberId));
