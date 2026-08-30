/* ============================================================
   BASE CURRICULAR LOMLOE
   Estructura: Etapa → Materia → Competencias clave → Descriptores
   operativos → Competencias específicas → Criterios de evaluación
   → Saberes básicos.
   Dataset de referencia (RD 217/2022 y RD 243/2022), editable
   desde Configuración.
   ============================================================ */

export interface Clave { id: string; nombre: string; corto: string; color: string; soft: string; }
export interface Descriptor { id: string; clave: string; texto: string; }
export interface Saber { id: string; codigo: string; texto: string; }
export interface Criterio { id: string; ceId: string; codigo: string; texto: string; saberIds: string[]; }
export interface CompetenciaEspecifica {
  id: string; codigo: string; texto: string; descriptorIds: string[]; criterios: Criterio[];
}
export interface BloqueSaberes { id: string; nombre: string; saberes: Saber[]; }
export interface Curriculum {
  id: string; materia: string; etapa: string; niveles: string;
  bloques: BloqueSaberes[]; ces: CompetenciaEspecifica[];
}

export const CLAVES: Clave[] = [
  { id: "CCL",   nombre: "Competencia en comunicación lingüística", corto: "Lingüística",        color: "#2c6e8f", soft: "#e0ecf2" },
  { id: "CP",    nombre: "Competencia plurilingüe",                 corto: "Plurilingüe",        color: "#4f7cac", soft: "#e4edf5" },
  { id: "STEM",  nombre: "Competencia matemática y en ciencia, tecnología e ingeniería", corto: "STEM", color: "#0e7c66", soft: "#e2efe9" },
  { id: "CD",    nombre: "Competencia digital",                     corto: "Digital",            color: "#5b6b8f", soft: "#e6e9f2" },
  { id: "CPSAA", nombre: "Competencia personal, social y de aprender a aprender", corto: "Aprender a aprender", color: "#c98a12", soft: "#f7ecd4" },
  { id: "CC",    nombre: "Competencia ciudadana",                   corto: "Ciudadana",          color: "#a84a6c", soft: "#f3e2e9" },
  { id: "CE",    nombre: "Competencia emprendedora",                corto: "Emprendedora",       color: "#7a5fb0", soft: "#ece5f6" },
  { id: "CCEC",  nombre: "Competencia en conciencia y expresión culturales", corto: "Cultural",  color: "#d9532c", soft: "#f9e6de" },
];

export const DESCRIPTORES: Descriptor[] = [
  { id: "CCL1", clave: "CCL", texto: "Se expresa de forma oral, escrita, signada o multimodal con coherencia, corrección y adecuación al contexto, y participa en interacciones comunicativas con actitud cooperativa y respetuosa." },
  { id: "CCL2", clave: "CCL", texto: "Comprende, interpreta y valora con actitud crítica textos orales, escritos, signados o multimodales de los ámbitos personal, social, educativo y profesional." },
  { id: "CCL3", clave: "CCL", texto: "Comprende y analiza textos de los ámbitos personal, social, educativo y profesional atendiendo a su propósito, organización y características." },
  { id: "CCL4", clave: "CCL", texto: "Produce de forma adecuada y autónoma textos orales, escritos, signados y multimodales con coherencia, corrección y cohesión." },
  { id: "CCL5", clave: "CCL", texto: "Reconoce y reflexiona de forma guiada sobre los usos sociales de la lengua, y utiliza estrategias de lectura de manera consciente y autónoma." },
  { id: "CP1", clave: "CP", texto: "Usa eficazmente distintas lenguas y repertorios lingüísticos para la comprensión y la producción de textos." },
  { id: "CP2", clave: "CP", texto: "Reconoce y respeta la diversidad lingüística y cultural, y la integra como fuente de enriquecimiento personal." },
  { id: "CP3", clave: "CP", texto: "Integra y utiliza de forma adecuada distintas lenguas y sus culturas en contextos diversos." },
  { id: "CP4", clave: "CP", texto: "Utiliza una o más lenguas con creatividad e interés personal más allá de la comunicación funcional." },
  { id: "STEM1", clave: "STEM", texto: "Utiliza métodos de indagación y procedimientos de trabajo del pensamiento científico, matemático y de la ingeniería." },
  { id: "STEM2", clave: "STEM", texto: "Razona con precisión y rigor al formular, resolver y justificar problemas matemáticos, científicos y tecnológicos." },
  { id: "STEM3", clave: "STEM", texto: "Formula y verifica hipótesis, contrastándolas con datos y evidencias." },
  { id: "STEM4", clave: "STEM", texto: "Interpreta y transmite los elementos más relevantes de procesos de indagación y razonamiento científico y matemático de forma clara y precisa." },
  { id: "STEM5", clave: "STEM", texto: "Aplica el pensamiento científico y matemático a situaciones de la vida cotidiana y al desarrollo sostenible." },
  { id: "CD1", clave: "CD", texto: "Realiza búsquedas en internet atendiendo a criterios de validez, calidad y fiabilidad, de forma segura y crítica." },
  { id: "CD2", clave: "CD", texto: "Crea, integra y reelabora contenidos digitales de forma individual o colectiva, aplicando medidas de seguridad." },
  { id: "CD3", clave: "CD", texto: "Selecciona, configura y utiliza dispositivos, aplicaciones y servicios digitales acorde a necesidades específicas." },
  { id: "CD4", clave: "CD", texto: "Protege los datos personales, la privacidad y la salud, y adopta medidas de seguridad digital." },
  { id: "CD5", clave: "CD", texto: "Participa en la sociedad digital de forma activa, cívica y reflexiva." },
  { id: "CPSAA1", clave: "CPSAA", texto: "Reconoce y gestiona emociones propias y ajenas, desarrollando actitudes de empatía y cooperación." },
  { id: "CPSAA2", clave: "CPSAA", texto: "Adopta una actitud resiliente y proactiva ante el cambio y la incertidumbre." },
  { id: "CPSAA3", clave: "CPSAA", texto: "Planifica, organiza y gestiona proyectos individuales o grupales, asumiendo responsabilidades." },
  { id: "CPSAA4", clave: "CPSAA", texto: "Reflexiona, evalúa críticamente y autorregula su propio proceso de aprendizaje." },
  { id: "CPSAA5", clave: "CPSAA", texto: "Se adapta a situaciones cambiantes y tolera la frustración manteniendo la motivación." },
  { id: "CC1", clave: "CC", texto: "Analiza y comprende ideas y problemáticas locales y globales desde una perspectiva crítica." },
  { id: "CC2", clave: "CC", texto: "Adopta un estilo de vida sostenible y ecosocialmente responsable." },
  { id: "CC3", clave: "CC", texto: "Promueve el respeto, la empatía y la resolución dialogada de conflictos." },
  { id: "CC4", clave: "CC", texto: "Participa activamente en la vida cívica y en la toma de decisiones democráticas." },
  { id: "CE1", clave: "CE", texto: "Analiza necesidades y oportunidades, y afronta retos con sentido de la iniciativa." },
  { id: "CE2", clave: "CE", texto: "Evalúa ideas y soluciones creativas valorando su viabilidad y su impacto." },
  { id: "CE3", clave: "CE", texto: "Planifica y gestiona proyectos orientados a la acción, movilizando recursos." },
  { id: "CE4", clave: "CE", texto: "Evalúa y reflexiona sobre el desarrollo y los resultados de los proyectos emprendidos." },
  { id: "CCEC1", clave: "CCEC", texto: "Aprecia, analiza críticamente y disfruta las manifestaciones artísticas y culturales." },
  { id: "CCEC2", clave: "CCEC", texto: "Respeta y valora las manifestaciones culturales diversas como fuente de enriquecimiento." },
  { id: "CCEC3", clave: "CCEC", texto: "Expresa ideas, opiniones y emociones de forma creativa mediante lenguajes artísticos." },
  { id: "CCEC4", clave: "CCEC", texto: "Participa de forma activa en proyectos artísticos y culturales de su entorno." },
];

/* ---------------- Educación Plástica, Visual y Audiovisual (ESO) ---------------- */

const EPVA: Curriculum = {
  id: "epva-eso",
  materia: "Educación Plástica, Visual y Audiovisual",
  etapa: "ESO",
  niveles: "2º y 4º ESO",
  bloques: [
    {
      id: "epva-A", nombre: "A · Percepción y análisis de la imagen",
      saberes: [
        { id: "epva.A1", codigo: "A1", texto: "Elementos del lenguaje visual: punto, línea, plano, textura, color y composición." },
        { id: "epva.A2", codigo: "A2", texto: "Lectura de imágenes: denotación y connotación; persuasión y manipulación visual." },
        { id: "epva.A3", codigo: "A3", texto: "Percepción y representación del espacio: óptica, geometría y percepción." },
      ],
    },
    {
      id: "epva-B", nombre: "B · Expresión y creación",
      saberes: [
        { id: "epva.B1", codigo: "B1", texto: "Técnicas artísticas: dibujo, pintura, collage, grabado y volumen." },
        { id: "epva.B2", codigo: "B2", texto: "El color: propiedades, armonías, simbolismo y aplicaciones." },
        { id: "epva.B3", codigo: "B3", texto: "Composición, ritmo y proporción en la obra plástica." },
        { id: "epva.B4", codigo: "B4", texto: "Fotografía y vídeo digital: captura, edición y montaje." },
        { id: "epva.B5", codigo: "B5", texto: "Animación y narrativa audiovisual: storyboard y stop-motion." },
        { id: "epva.B6", codigo: "B6", texto: "Diseño gráfico: tipografía, maquetación, identidad visual y cartel." },
      ],
    },
    {
      id: "epva-C", nombre: "C · Patrimonio artístico y cultural",
      saberes: [
        { id: "epva.C1", codigo: "C1", texto: "Movimientos artísticos y autores: de las vanguardias a la creación contemporánea." },
        { id: "epva.C2", codigo: "C2", texto: "Patrimonio cultural y artístico de Cantabria y del entorno próximo: lectura e intervención." },
      ],
    },
  ],
  ces: [
    {
      id: "epva.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCEC1", "CCEC2", "CPSAA1"],
      texto: "Percibir y analizar las manifestaciones del entorno plástico, visual y audiovisual, así como del patrimonio artístico y cultural, explorando sus dimensiones comunicativas, expresivas y estéticas.",
      criterios: [
        { id: "epva.1.1", ceId: "epva.ce1", codigo: "1.1", saberIds: ["epva.A1", "epva.A2"], texto: "Identificar y describir con sentido crítico los elementos formales y simbólicos de imágenes y manifestaciones artísticas, plásticas, visuales y audiovisuales del entorno." },
        { id: "epva.1.2", ceId: "epva.ce1", codigo: "1.2", saberIds: ["epva.A2", "epva.C1"], texto: "Analizar de forma guiada obras audiovisuales y del patrimonio artístico y cultural, reconociendo sus recursos expresivos y su contexto." },
      ],
    },
    {
      id: "epva.ce2", codigo: "CE2", descriptorIds: ["CCEC3", "STEM2", "CE2"],
      texto: "Crear piezas plásticas, visuales y audiovisuales con intención comunicativa y expresiva, experimentando con técnicas, herramientas y procesos.",
      criterios: [
        { id: "epva.2.1", ceId: "epva.ce2", codigo: "2.1", saberIds: ["epva.B1", "epva.B2", "epva.B3"], texto: "Expresar ideas y emociones mediante la creación de dibujos, pinturas, collages y otras piezas plásticas, utilizando los elementos del lenguaje visual con adecuación." },
        { id: "epva.2.2", ceId: "epva.ce2", codigo: "2.2", saberIds: ["epva.B4", "epva.B5"], texto: "Crear piezas audiovisuales básicas (fotografía, vídeo, animación) integrando herramientas digitales y procesos técnicos con intención creativa." },
      ],
    },
    {
      id: "epva.ce3", codigo: "CE3", descriptorIds: ["CCL4", "CD2", "CCEC3"],
      texto: "Comunicar ideas, mensajes y proyectos a través de los lenguajes de la comunicación visual, seleccionando las soluciones gráficas más adecuadas.",
      criterios: [
        { id: "epva.3.1", ceId: "epva.ce3", codigo: "3.1", saberIds: ["epva.B2", "epva.B6"], texto: "Diseñar piezas de comunicación gráfica (cartel, identidad visual, maquetación) aplicando criterios de composición, tipografía y color." },
        { id: "epva.3.2", ceId: "epva.ce3", codigo: "3.2", saberIds: ["epva.A1", "epva.B6"], texto: "Organizar y presentar los procesos y resultados del trabajo creativo de forma clara, empleando vocabulario técnico adecuado." },
      ],
    },
    {
      id: "epva.ce4", codigo: "CE4", descriptorIds: ["CC2", "CCEC2", "CPSAA2"],
      texto: "Valorar el patrimonio artístico y cultural plástico, visual y audiovisual, desarrollando actitudes de respeto, conservación y difusión.",
      criterios: [
        { id: "epva.4.1", ceId: "epva.ce4", codigo: "4.1", saberIds: ["epva.C1", "epva.C2"], texto: "Reconocer y valorar obras y autores relevantes del patrimonio artístico y cultural, especialmente los próximos, analizando su función social." },
        { id: "epva.4.2", ceId: "epva.ce4", codigo: "4.2", saberIds: ["epva.C2"], texto: "Proponer acciones de conservación y difusión del patrimonio cultural y del espacio público desde una perspectiva sostenible." },
      ],
    },
    {
      id: "epva.ce5", codigo: "CE5", descriptorIds: ["CPSAA3", "CC4", "CE3"],
      texto: "Participar en proyectos de creación plástica, visual y audiovisual de forma cooperativa, planificando fases y valorando las aportaciones de todas las personas.",
      criterios: [
        { id: "epva.5.1", ceId: "epva.ce5", codigo: "5.1", saberIds: ["epva.B5", "epva.B6"], texto: "Planificar y desarrollar proyectos de creación en equipo, asumiendo roles y respetando los acuerdos adoptados." },
        { id: "epva.5.2", ceId: "epva.ce5", codigo: "5.2", saberIds: ["epva.B6"], texto: "Evaluar el proceso y el resultado de proyectos colectivos, proponiendo mejoras con actitud constructiva." },
      ],
    },
  ],
};

/* ---------------- Expresión Artística (1º Bachillerato) ---------------- */

const EA: Curriculum = {
  id: "ea-bach",
  materia: "Expresión Artística",
  etapa: "Bachillerato",
  niveles: "1º Bachillerato",
  bloques: [
    {
      id: "ea-A", nombre: "A · Investigación artística",
      saberes: [
        { id: "ea.A1", codigo: "A1", texto: "Lenguajes artísticos contemporáneos: tendencias, autores y obras de referencia." },
        { id: "ea.A2", codigo: "A2", texto: "Fuentes y documentación del proceso creativo: portfolio y diario artístico." },
      ],
    },
    {
      id: "ea-B", nombre: "B · Creación artística",
      saberes: [
        { id: "ea.B1", codigo: "B1", texto: "Dibujo expresivo: línea, forma, espacio y gesto." },
        { id: "ea.B2", codigo: "B2", texto: "Color, textura y composición en la expresión artística." },
        { id: "ea.B3", codigo: "B3", texto: "Volumen, espacio e instalación." },
        { id: "ea.B4", codigo: "B4", texto: "Fotografía, vídeo y creación digital." },
        { id: "ea.B5", codigo: "B5", texto: "Lenguajes performativos y sonoros." },
        { id: "ea.B6", codigo: "B6", texto: "Presentación y difusión del proyecto artístico." },
      ],
    },
    {
      id: "ea-C", nombre: "C · Patrimonio artístico",
      saberes: [
        { id: "ea.C1", codigo: "C1", texto: "Contextos históricos y culturales de las manifestaciones artísticas." },
        { id: "ea.C2", codigo: "C2", texto: "Patrimonio cultural: conservación, difusión y puesta en valor." },
      ],
    },
  ],
  ces: [
    {
      id: "ea.ce1", codigo: "CE1", descriptorIds: ["CCL2", "STEM1", "CCEC1"],
      texto: "Investigar y documentar procesos de creación artística, explorando referentes, técnicas y lenguajes artísticos contemporáneos e históricos.",
      criterios: [
        { id: "ea.1.1", ceId: "ea.ce1", codigo: "1.1", saberIds: ["ea.A1", "ea.A2"], texto: "Recopilar, organizar y analizar críticamente referentes artísticos vinculados al proyecto creativo." },
        { id: "ea.1.2", ceId: "ea.ce1", codigo: "1.2", saberIds: ["ea.A2"], texto: "Documentar el proceso de investigación y creación en formatos y soportes diversos." },
      ],
    },
    {
      id: "ea.ce2", codigo: "CE2", descriptorIds: ["CCEC3", "STEM3", "CE2"],
      texto: "Experimentar con materiales, técnicas y procedimientos de distintos lenguajes artísticos, creando piezas con intención expresiva y comunicativa.",
      criterios: [
        { id: "ea.2.1", ceId: "ea.ce2", codigo: "2.1", saberIds: ["ea.B1", "ea.B2", "ea.B3"], texto: "Crear piezas experimentando con lenguajes plásticos, visuales, sonoros o performativos, valorando el resultado y el proceso." },
        { id: "ea.2.2", ceId: "ea.ce2", codigo: "2.2", saberIds: ["ea.B4", "ea.B5"], texto: "Combinar lenguajes y técnicas diversas (mixtas, interdisciplinares, digitales) en creaciones propias." },
      ],
    },
    {
      id: "ea.ce3", codigo: "CE3", descriptorIds: ["CCL4", "CCEC3", "CPSAA1"],
      texto: "Expresar y comunicar ideas y emociones a través de la creación artística, tomando decisiones fundamentadas en el proceso creativo.",
      criterios: [
        { id: "ea.3.1", ceId: "ea.ce3", codigo: "3.1", saberIds: ["ea.A1", "ea.B6"], texto: "Desarrollar proyectos creativos personales que respondan a una propuesta, estímulo o reto, justificando las decisiones adoptadas." },
        { id: "ea.3.2", ceId: "ea.ce3", codigo: "3.2", saberIds: ["ea.B6"], texto: "Comunicar el sentido y el valor de las obras propias mediante presentaciones orales, escritas y multimodales." },
      ],
    },
    {
      id: "ea.ce4", codigo: "CE4", descriptorIds: ["CC3", "CCEC2", "CPSAA3"],
      texto: "Participar en manifestaciones artístico-culturales colectivas de forma activa y respetuosa, valorando la diversidad de expresiones.",
      criterios: [
        { id: "ea.4.1", ceId: "ea.ce4", codigo: "4.1", saberIds: ["ea.B5", "ea.A2"], texto: "Colaborar en proyectos de creación grupal integrando propuestas diversas y asumiendo responsabilidades compartidas." },
        { id: "ea.4.2", ceId: "ea.ce4", codigo: "4.2", saberIds: ["ea.C1"], texto: "Analizar manifestaciones artísticas colectivas con sentido crítico y respeto, reconociendo la diversidad cultural." },
      ],
    },
    {
      id: "ea.ce5", codigo: "CE5", descriptorIds: ["CCEC1", "CCEC2", "CC2"],
      texto: "Valorar el patrimonio artístico y cultural como fuente de conocimiento y disfrute, promoviendo su conservación y difusión.",
      criterios: [
        { id: "ea.5.1", ceId: "ea.ce5", codigo: "5.1", saberIds: ["ea.C1", "ea.C2"], texto: "Analizar obras y manifestaciones significativas del patrimonio artístico, contextualizándolas histórica y culturalmente." },
        { id: "ea.5.2", ceId: "ea.ce5", codigo: "5.2", saberIds: ["ea.C2"], texto: "Proponer acciones de difusión y puesta en valor del patrimonio artístico del entorno próximo." },
      ],
    },
  ],
};

/* ---------------- Dibujo Técnico I y II (Bachillerato) ---------------- */

const DT: Curriculum = {
  id: "dt-bach",
  materia: "Dibujo Técnico I y II",
  etapa: "Bachillerato",
  niveles: "1º y 2º Bachillerato",
  bloques: [
    {
      id: "dt-A", nombre: "A · Geometría plana y del espacio",
      saberes: [
        { id: "dt.A1", codigo: "A1", texto: "Construcciones fundamentales: paralelismo, perpendicularidad, ángulos y arcos." },
        { id: "dt.A2", codigo: "A2", texto: "Tangencias, equivalencias, transformaciones geométricas y cónicas." },
        { id: "dt.A3", codigo: "A3", texto: "Polígonos, proporción, escala y sistemas modulares." },
      ],
    },
    {
      id: "dt-B", nombre: "B · Sistemas de representación",
      saberes: [
        { id: "dt.B1", codigo: "B1", texto: "Sistema diédrico: punto, recta y plano; pertenencia y paralelismo." },
        { id: "dt.B2", codigo: "B2", texto: "Secciones, intersecciones, abatimientos y verdaderas magnitudes." },
        { id: "dt.B3", codigo: "B3", texto: "Axonometría: perspectiva isométrica, dimétrica y caballera." },
        { id: "dt.B4", codigo: "B4", texto: "Sistema cónico: fundamentos de la perspectiva cónica." },
      ],
    },
    {
      id: "dt-C", nombre: "C · Normalización",
      saberes: [
        { id: "dt.C1", codigo: "C1", texto: "Normas: tipos de línea, vistas, cortes y secciones." },
        { id: "dt.C2", codigo: "C2", texto: "Acotación, rotulación y escalas en el dibujo técnico." },
        { id: "dt.C3", codigo: "C3", texto: "Presentación de planos y documentación gráfica." },
      ],
    },
    {
      id: "dt-D", nombre: "D · Diseño digital (CAD)",
      saberes: [
        { id: "dt.D1", codigo: "D1", texto: "CAD paramétrico 2D y modelado 3D: croquizado, restricciones y exportación." },
      ],
    },
  ],
  ces: [
    {
      id: "dt.ce1", codigo: "CE1", descriptorIds: ["STEM1", "STEM2", "CPSAA4"],
      texto: "Resolver problemas geométricos planos y espaciales aplicando construcciones y teoremas de la geometría con precisión y limpieza.",
      criterios: [
        { id: "dt.1.1", ceId: "dt.ce1", codigo: "1.1", saberIds: ["dt.A1", "dt.A2"], texto: "Resolver problemas de tangencias, equivalencias, transformaciones y cónicas, aplicando las construcciones adecuadas y justificando el proceso." },
        { id: "dt.1.2", ceId: "dt.ce1", codigo: "1.2", saberIds: ["dt.A3", "dt.B4"], texto: "Representar objetos y espacios arquitectónicos mediante construcciones geométricas, aplicando principios de escala y proporción." },
      ],
    },
    {
      id: "dt.ce2", codigo: "CE2", descriptorIds: ["STEM2", "STEM4", "CD2"],
      texto: "Representar objetos y espacios en los distintos sistemas de representación, seleccionando el más adecuado según la finalidad.",
      criterios: [
        { id: "dt.2.1", ceId: "dt.ce2", codigo: "2.1", saberIds: ["dt.B1", "dt.B2"], texto: "Representar piezas y construcciones en sistema diédrico, resolviendo secciones, intersecciones, abatimientos y verdaderas magnitudes con corrección." },
        { id: "dt.2.2", ceId: "dt.ce2", codigo: "2.2", saberIds: ["dt.B3"], texto: "Elaborar perspectivas isométricas y caballeras con y sin coeficiente de reducción, aplicadas a la representación de piezas y proyectos." },
      ],
    },
    {
      id: "dt.ce3", codigo: "CE3", descriptorIds: ["STEM4", "CPSAA3", "CE3"],
      texto: "Aplicar la normalización del dibujo técnico en croquis y planos, empleando convenciones gráficas y escalas con rigor.",
      criterios: [
        { id: "dt.3.1", ceId: "dt.ce3", codigo: "3.1", saberIds: ["dt.C1", "dt.C2"], texto: "Dibujar vistas, cortes y detalles normalizados aplicando normas de línea, acotación y rotulación." },
        { id: "dt.3.2", ceId: "dt.ce3", codigo: "3.2", saberIds: ["dt.C2", "dt.C3"], texto: "Elaborar planos de proyectos de arquitectura e ingeniería siguiendo criterios normativos y de presentación." },
      ],
    },
    {
      id: "dt.ce4", codigo: "CE4", descriptorIds: ["CD2", "CD3", "STEM5"],
      texto: "Utilizar herramientas digitales y CAD para el diseño, la representación y la comunicación de proyectos técnicos.",
      criterios: [
        { id: "dt.4.1", ceId: "dt.ce4", codigo: "4.1", saberIds: ["dt.D1"], texto: "Modelar piezas y espacios con herramientas CAD paramétricas, generando la documentación del proyecto." },
        { id: "dt.4.2", ceId: "dt.ce4", codigo: "4.2", saberIds: ["dt.D1", "dt.C3"], texto: "Comunicar proyectos técnicos integrando representaciones analógicas y digitales, valorando su sostenibilidad." },
      ],
    },
  ],
};

export const CURRICULA: Record<string, Curriculum> = {
  "epva-eso": EPVA,
  "ea-bach": EA,
  "dt-bach": DT,
};

/* ---------------- utilidades de consulta ---------------- */

export const getCurriculum = (id: string): Curriculum => CURRICULA[id] ?? EPVA;

export const allCriterios = (cur: Curriculum): Criterio[] =>
  cur.ces.flatMap((ce) => ce.criterios);

export const criterioById = (cur: Curriculum, id: string): Criterio | undefined =>
  allCriterios(cur).find((c) => c.id === id);

export const ceById = (cur: Curriculum, id: string): CompetenciaEspecifica | undefined =>
  cur.ces.find((c) => c.id === id);

export const saberById = (cur: Curriculum, id: string): Saber | undefined =>
  cur.bloques.flatMap((b) => b.saberes).find((s) => s.id === id);

export const descriptorById = (id: string): Descriptor | undefined =>
  DESCRIPTORES.find((d) => d.id === id);

export const claveById = (id: string): Clave => CLAVES.find((c) => c.id === id) ?? CLAVES[0];

/** Claves que interviene una CE a través de sus descriptores */
export const clavesDeCE = (ce: CompetenciaEspecifica): string[] =>
  [...new Set(ce.descriptorIds.map((d) => d.slice(0, d.search(/\d/))))];

/** Criterios relacionados automáticamente con un saber */
export const criteriosDeSaber = (cur: Curriculum, saberId: string): Criterio[] =>
  allCriterios(cur).filter((c) => c.saberIds.includes(saberId));
