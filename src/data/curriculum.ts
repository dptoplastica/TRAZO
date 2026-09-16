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

/* ---------------- Dibujo Técnico I (1º Bachillerato) - LOMLOE oficial ---------------- */

const DT1: Curriculum = {
  id: "dt1-bach",
  materia: "Dibujo Técnico I",
  etapa: "Bachillerato",
  niveles: "1º Bachillerato",
  bloques: [
    {
      id: "dt1-A", nombre: "A · Fundamentos geométricos",
      saberes: [
        { id: "dt1.A1", codigo: "A1", texto: "Desarrollo histórico del dibujo técnico. Campos de acción y aplicaciones: dibujo arquitectónico, mecánico, eléctrico y electrónico, geológico, urbanístico, etc." },
        { id: "dt1.A2", codigo: "A2", texto: "Orígenes de la geometría. Thales, Pitágoras, Euclides, Hipatia de Alejandría." },
        { id: "dt1.A3", codigo: "A3", texto: "Concepto de lugar geométrico. Arco capaz. Aplicaciones de los lugares geométricos a las construcciones fundamentales." },
        { id: "dt1.A4", codigo: "A4", texto: "Proporcionalidad, equivalencia y semejanza." },
        { id: "dt1.A5", codigo: "A5", texto: "Triángulos, cuadriláteros y polígonos regulares. Propiedades y métodos de construcción." },
        { id: "dt1.A6", codigo: "A6", texto: "Tangencias básicas. Curvas técnicas." },
        { id: "dt1.A7", codigo: "A7", texto: "Interés por el rigor en los razonamientos y precisión, claridad y limpieza en las ejecuciones." },
      ],
    },
    {
      id: "dt1-B", nombre: "B · Geometría proyectiva",
      saberes: [
        { id: "dt1.B1", codigo: "B1", texto: "Fundamentos de la geometría proyectiva." },
        { id: "dt1.B2", codigo: "B2", texto: "Sistema diédrico: Representación de punto, recta y plano. Trazas con planos de proyección. Determinación del plano. Pertenencia." },
        { id: "dt1.B3", codigo: "B3", texto: "Relaciones entre elementos: Intersecciones, paralelismo y perpendicularidad. Obtención de distancias." },
        { id: "dt1.B4", codigo: "B4", texto: "Sistema axonométrico, ortogonal y oblicuo. Perspectivas isométrica y caballera. Disposición de los ejes y uso de los coeficientes de reducción. Elementos básicos: punto, recta, plano." },
        { id: "dt1.B5", codigo: "B5", texto: "Sistema de planos acotados. Fundamentos y elementos básicos. Identificación de elementos para su interpretación en planos." },
        { id: "dt1.B6", codigo: "B6", texto: "Sistema cónico: fundamentos y elementos del sistema. Perspectiva frontal y oblicua." },
      ],
    },
    {
      id: "dt1-C", nombre: "C · Normalización y documentación gráfica de proyectos",
      saberes: [
        { id: "dt1.C1", codigo: "C1", texto: "Escalas numéricas y gráficas. Construcción y uso." },
        { id: "dt1.C2", codigo: "C2", texto: "Formatos. Doblado de planos." },
        { id: "dt1.C3", codigo: "C3", texto: "Concepto de normalización. Las normas fundamentales UNE e ISO. Aplicaciones de la normalización: simbología industrial y arquitectónica." },
        { id: "dt1.C4", codigo: "C4", texto: "Elección de vistas necesarias. Líneas normalizadas. Acotación." },
      ],
    },
    {
      id: "dt1-D", nombre: "D · Sistemas CAD",
      saberes: [
        { id: "dt1.D1", codigo: "D1", texto: "Aplicaciones vectoriales 2D-3D." },
        { id: "dt1.D2", codigo: "D2", texto: "Fundamentos de diseño de piezas en tres dimensiones." },
        { id: "dt1.D3", codigo: "D3", texto: "Modelado de caja. Operaciones básicas con primitivas." },
        { id: "dt1.D4", codigo: "D4", texto: "Aplicaciones de trabajo en grupo para conformar piezas complejas a partir de otras más sencillas." },
      ],
    },
  ],
  ces: [
    {
      id: "dt1.ce1", codigo: "CE1", descriptorIds: ["STEM1", "STEM2", "CCL3", "CCEC1"],
      texto: "Interpretar elementos o conjuntos arquitectónicos y de ingeniería, empleando recursos asociados a la percepción, estudio, construcción e investigación de formas para analizar las estructuras geométricas y los elementos técnicos utilizados.",
      criterios: [
        { id: "dt1.1.1", ceId: "dt1.ce1", codigo: "1.1", saberIds: ["dt1.A1", "dt1.A2", "dt1.A3"], texto: "Analizar, a lo largo de la historia, la relación entre las matemáticas y el dibujo geométrico valorando su importancia en diferentes campos como la arquitectura o la ingeniería, desde la perspectiva de género y la diversidad cultural, empleando adecuadamente el vocabulario específico técnico y artístico." },
      ],
    },
    {
      id: "dt1.ce2", codigo: "CE2", descriptorIds: ["STEM2", "STEM3", "CPSAA4"],
      texto: "Utilizar razonamientos inductivos, deductivos y lógicos en problemas de índole gráfico-matemáticos, aplicando fundamentos de la geometría plana para resolver gráficamente operaciones matemáticas, relaciones, construcciones y transformaciones.",
      criterios: [
        { id: "dt1.2.1", ceId: "dt1.ce2", codigo: "2.1", saberIds: ["dt1.A3", "dt1.A4"], texto: "Solucionar gráficamente cálculos matemáticos y transformaciones básicas aplicando conceptos y propiedades de la geometría plana." },
        { id: "dt1.2.2", ceId: "dt1.ce2", codigo: "2.2", saberIds: ["dt1.A5", "dt1.A7"], texto: "Trazar gráficamente construcciones poligonales basándose en sus propiedades y mostrando interés por la precisión, claridad y limpieza." },
        { id: "dt1.2.3", ceId: "dt1.ce2", codigo: "2.3", saberIds: ["dt1.A6", "dt1.A7"], texto: "Resolver gráficamente tangencias y trazar curvas aplicando sus propiedades con rigor en su ejecución." },
      ],
    },
    {
      id: "dt1.ce3", codigo: "CE3", descriptorIds: ["STEM2", "STEM4", "CPSAA3"],
      texto: "Desarrollar la visión espacial, utilizando la geometría descriptiva en proyectos sencillos, considerando la importancia del dibujo en arquitectura e ingenierías para resolver problemas e interpretar y recrear gráficamente la realidad tridimensional sobre la superficie del plano.",
      criterios: [
        { id: "dt1.3.1", ceId: "dt1.ce3", codigo: "3.1", saberIds: ["dt1.B1", "dt1.B2", "dt1.B3"], texto: "Representar en sistema diédrico elementos básicos en el espacio determinando su relación de pertenencia, posición y distancia." },
        { id: "dt1.3.2", ceId: "dt1.ce3", codigo: "3.2", saberIds: ["dt1.B4"], texto: "Definir elementos y figuras planas en sistemas axonométricos valorando su importancia como métodos de representación espacial." },
        { id: "dt1.3.3", ceId: "dt1.ce3", codigo: "3.3", saberIds: ["dt1.B5"], texto: "Representar e interpretar elementos básicos en el sistema de planos acotados haciendo uso de sus fundamentos." },
        { id: "dt1.3.4", ceId: "dt1.ce3", codigo: "3.4", saberIds: ["dt1.B6"], texto: "Dibujar elementos en el espacio empleando la perspectiva cónica." },
        { id: "dt1.3.5", ceId: "dt1.ce3", codigo: "3.5", saberIds: ["dt1.A7", "dt1.B1", "dt1.B2"], texto: "Valorar el rigor gráfico del proceso; la claridad, la precisión y el proceso de resolución y construcción gráfica." },
      ],
    },
    {
      id: "dt1.ce4", codigo: "CE4", descriptorIds: ["STEM4", "CPSAA3", "CE3"],
      texto: "Formalizar y definir diseños técnicos aplicando las normas UNE e ISO de manera apropiada, valorando la importancia que tiene el croquis para documentar gráficamente proyectos arquitectónicos e ingenieriles.",
      criterios: [
        { id: "dt1.4.1", ceId: "dt1.ce4", codigo: "4.1", saberIds: ["dt1.C1", "dt1.C2", "dt1.C3", "dt1.C4"], texto: "Documentar gráficamente objetos sencillos mediante sus vistas acotadas aplicando la normativa UNE e ISO en la utilización de sintaxis, escalas y formatos, valorando la importancia de usar un lenguaje técnico común." },
        { id: "dt1.4.2", ceId: "dt1.ce4", codigo: "4.2", saberIds: ["dt1.C4", "dt1.A7"], texto: "Utilizar el croquis y el boceto como elementos de reflexión en la aproximación e indagación de alternativas y soluciones a los procesos de trabajo." },
      ],
    },
    {
      id: "dt1.ce5", codigo: "CE5", descriptorIds: ["CD2", "CD3", "STEM5", "CE4"],
      texto: "Investigar, experimentar y representar digitalmente elementos, planos y esquemas técnicos mediante el uso de programas específicos CAD de manera individual o grupal, apreciando su uso en las profesiones actuales, para virtualizar objetos y espacios en dos dimensiones y tres dimensiones.",
      criterios: [
        { id: "dt1.5.1", ceId: "dt1.ce5", codigo: "5.1", saberIds: ["dt1.D1", "dt1.D2"], texto: "Crear figuras planas y tridimensionales mediante programas de dibujo vectorial, usando las herramientas que aportan y las técnicas asociadas." },
        { id: "dt1.5.2", ceId: "dt1.ce5", codigo: "5.2", saberIds: ["dt1.D3", "dt1.D4"], texto: "Recrear virtualmente piezas en tres dimensiones aplicando operaciones algebraicas entre primitivas para la presentación de proyectos en grupo." },
      ],
    },
  ],
};

/* ---------------- Taller de Podcast (optativa de centro · 1º Bachillerato) ---------------- */

const TP: Curriculum = {
  id: "tp-bach",
  materia: "Taller de Podcast",
  etapa: "Bachillerato",
  niveles: "1º Bachillerato",
  bloques: [
    {
      id: "tp-A", nombre: "A · Cultura sonora y lenguaje radiofónico",
      saberes: [
        { id: "tp.A1", codigo: "A1", texto: "Historia y evolución del medio sonoro: de la radio analógica al podcasting." },
        { id: "tp.A2", codigo: "A2", texto: "Géneros y formatos sonoros: informativo, divulgativo, narrativo, entrevista, debate, ficción." },
        { id: "tp.A3", codigo: "A3", texto: "Escucha crítica: análisis de referentes del podcasting en español." },
      ],
    },
    {
      id: "tp-B", nombre: "B · Guion y narrativa sonora",
      saberes: [
        { id: "tp.B1", codigo: "B1", texto: "Estructura del guion radiofónico: escaleta, guion técnico y guion literario." },
        { id: "tp.B2", codigo: "B2", texto: "Técnicas narrativas: ritmo, tensión, cliffhanger y storytelling." },
        { id: "tp.B3", codigo: "B3", texto: "La voz como herramienta expresiva: dicción, entonación, intención." },
        { id: "tp.B4", codigo: "B4", texto: "Diseño sonoro: música, ambientes, efectos y silencios." },
      ],
    },
    {
      id: "tp-C", nombre: "C · Producción y edición digital",
      saberes: [
        { id: "tp.C1", codigo: "C1", texto: "Captación de audio: micrófonos, técnicas de grabación y tratamiento del espacio." },
        { id: "tp.C2", codigo: "C2", texto: "Edición no lineal con DAW: corte, mezcla, ecualización, compresión y normalización." },
        { id: "tp.C3", codigo: "C3", texto: "Postproducción: masterización, exportación y formatos de distribución." },
        { id: "tp.C4", codigo: "C4", texto: "Identidad sonora y gráfica del podcast: cabecera, sintonía y portada." },
      ],
    },
    {
      id: "tp-D", nombre: "D · Difusión, ética y proyecto",
      saberes: [
        { id: "tp.D1", codigo: "D1", texto: "Publicación y distribución: plataformas, RSS, metadatos y SEO sonoro." },
        { id: "tp.D2", codigo: "D2", texto: "Ética del medio: derechos de autor, privacidad, verificación y responsabilidad." },
        { id: "tp.D3", codigo: "D3", texto: "Proyecto de podcast: planificación, roles, cronograma y evaluación." },
      ],
    },
  ],
  ces: [
    {
      id: "tp.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCL3", "CCEC1"],
      texto: "Analizar críticamente productos sonoros y podcast de referencia, identificando recursos narrativos, técnicos y éticos.",
      criterios: [
        { id: "tp.1.1", ceId: "tp.ce1", codigo: "1.1", saberIds: ["tp.A1", "tp.A2", "tp.A3"], texto: "Analizar podcasts de referencia identificando género, estructura narrativa, recursos sonoros y tratamiento de la información." },
        { id: "tp.1.2", ceId: "tp.ce1", codigo: "1.2", saberIds: ["tp.A3", "tp.D2"], texto: "Valorar críticamente la calidad informativa, la ética y la responsabilidad social de los productos sonoros analizados." },
      ],
    },
    {
      id: "tp.ce2", codigo: "CE2", descriptorIds: ["CCL4", "CPSAA1", "CCEC3"],
      texto: "Diseñar guiones y estructuras narrativas sonoras coherentes, aplicando técnicas de storytelling y adecuando el discurso al formato.",
      criterios: [
        { id: "tp.2.1", ceId: "tp.ce2", codigo: "2.1", saberIds: ["tp.B1", "tp.B2"], texto: "Elaborar escaletas y guiones técnicos y literarios adaptados al género y formato elegidos." },
        { id: "tp.2.2", ceId: "tp.ce2", codigo: "2.2", saberIds: ["tp.B3", "tp.B4"], texto: "Diseñar el paisaje sonoro del proyecto: voz, música, ambientes y silencios con intención narrativa." },
      ],
    },
    {
      id: "tp.ce3", codigo: "CE3", descriptorIds: ["CD2", "CD3", "STEM4"],
      texto: "Producir contenidos sonoros de calidad técnica mediante herramientas digitales de grabación y edición.",
      criterios: [
        { id: "tp.3.1", ceId: "tp.ce3", codigo: "3.1", saberIds: ["tp.C1"], texto: "Grabar voces, ambientes y entrevistas aplicando técnicas de captación adecuadas al espacio y al formato." },
        { id: "tp.3.2", ceId: "tp.ce3", codigo: "3.2", saberIds: ["tp.C2", "tp.C3"], texto: "Editar, mezclar y masterizar el producto final con un DAW, exportándolo en formatos de distribución." },
        { id: "tp.3.3", ceId: "tp.ce3", codigo: "3.3", saberIds: ["tp.C4"], texto: "Diseñar la identidad sonora y gráfica del podcast: cabecera, sintonía y portada coherentes." },
      ],
    },
    {
      id: "tp.ce4", codigo: "CE4", descriptorIds: ["CC4", "CE3", "CPSAA3"],
      texto: "Planificar y ejecutar proyectos de podcast en equipo, asumiendo roles y distribuyendo tareas con responsabilidad.",
      criterios: [
        { id: "tp.4.1", ceId: "tp.ce4", codigo: "4.1", saberIds: ["tp.D3"], texto: "Planificar un proyecto de podcast definiendo roles, cronograma, recursos y entregables." },
        { id: "tp.4.2", ceId: "tp.ce4", codigo: "4.2", saberIds: ["tp.D1", "tp.D3"], texto: "Publicar y difundir el podcast en plataformas digitales, cuidando la comunicación con la audiencia." },
      ],
    },
    {
      id: "tp.ce5", codigo: "CE5", descriptorIds: ["CC3", "CCEC2", "CPSAA5"],
      texto: "Reflexionar sobre el impacto social del podcasting y asumir una práctica responsable, inclusiva y ética del medio sonoro.",
      criterios: [
        { id: "tp.5.1", ceId: "tp.ce5", codigo: "5.1", saberIds: ["tp.D2"], texto: "Aplicar criterios éticos en la producción: derechos de autor, verificación, privacidad y tratamiento de la diversidad." },
        { id: "tp.5.2", ceId: "tp.ce5", codigo: "5.2", saberIds: ["tp.D1", "tp.D2"], texto: "Evaluar el impacto social del proyecto sonoro y proponer mejoras con actitud crítica y constructiva." },
      ],
    },
  ],
};

/* ---------------- Taller de Cortometraje (2º Bachillerato) ---------------- */

const TC: Curriculum = {
  id: "tc-bach",
  materia: "Taller de Cortometraje",
  etapa: "Bachillerato",
  niveles: "2º Bachillerato",
  bloques: [
    {
      id: "tc-A", nombre: "A · Lenguaje cinematográfico y narrativa audiovisual",
      saberes: [
        { id: "tc.A1", codigo: "A1", texto: "Historia del cine: movimientos, autores y obras fundamentales. Del cine mudo a la era digital." },
        { id: "tc.A2", codigo: "A2", texto: "Elementos del lenguaje cinematográfico: plano, encadenamiento, ritmo, montaje, sonido." },
        { id: "tc.A3", codigo: "A3", texto: "Géneros cinematográficos: drama, comedia, thriller, documental, experimental." },
        { id: "tc.A4", codigo: "A4", texto: "Narrativa audiovisual: estructura dramática, personajes, conflictos, arcos narrativos." },
        { id: "tc.A5", codigo: "A5", texto: "Análisis fílmico: lectura crítica de cortometrajes y largometrajes." },
      ],
    },
    {
      id: "tc-B", nombre: "B · Guion y preproducción",
      saberes: [
        { id: "tc.B1", codigo: "B1", texto: "Ideación y desarrollo de la idea: sinopsis, treatment, biblia." },
        { id: "tc.B2", codigo: "B2", texto: "Escritura de guion literario: formato estándar, diálogos, acotaciones." },
        { id: "tc.B3", codigo: "B3", texto: "Guion técnico: plan de rodaje, desglose, storyboard." },
        { id: "tc.B4", codigo: "B4", texto: "Preproducción: casting, localizaciones, permisos, equipo técnico." },
        { id: "tc.B5", codigo: "B5", texto: "Diseño de producción: presupuesto, cronograma, logística." },
      ],
    },
    {
      id: "tc-C", nombre: "C · Producción y rodaje",
      saberes: [
        { id: "tc.C1", codigo: "C1", texto: "Dirección de actores: técnicas de interpretación, ensayos, motivación." },
        { id: "tc.C2", codigo: "C2", texto: "Dirección de fotografía: composición, iluminación, movimiento de cámara." },
        { id: "tc.C3", codigo: "C3", texto: "Dirección de sonido: captación in situ, microfonía, ambientes." },
        { id: "tc.C4", codigo: "C4", texto: "Dirección de arte: escenografía, vestuario, maquillaje, utilería." },
        { id: "tc.C5", codigo: "C5", texto: "Rodaje: organización del set, continuidad, gestión del equipo." },
      ],
    },
    {
      id: "tc-D", nombre: "D · Postproducción y distribución",
      saberes: [
        { id: "tc.D1", codigo: "D1", texto: "Montaje: teoría y práctica del montaje cinematográfico. Ritmo, continuidad, elipsis." },
        { id: "tc.D2", codigo: "D2", texto: "Edición no lineal con software profesional: DaVinci Resolve, Premiere Pro." },
        { id: "tc.D3", codigo: "D3", texto: "Corrección de color y etalonaje: teoría del color, LUTs, grading." },
        { id: "tc.D4", codigo: "D4", texto: "Diseño sonoro: música, efectos, Foley, mezcla final." },
        { id: "tc.D5", codigo: "D5", texto: "Distribución y festivales: circuitos de exhibición, plataformas, derechos." },
      ],
    },
  ],
  ces: [
    {
      id: "tc.ce1", codigo: "CE1", descriptorIds: ["CCL2", "CCL3", "CCEC1", "CCEC2"],
      texto: "Analizar obras cinematográficas de referencia, identificando recursos narrativos, estéticos y técnicos, y valorando su contexto histórico y cultural.",
      criterios: [
        { id: "tc.1.1", ceId: "tc.ce1", codigo: "1.1", saberIds: ["tc.A1", "tc.A2", "tc.A5"], texto: "Analizar cortometrajes y largometrajes identificando elementos del lenguaje cinematográfico y su función narrativa y expresiva." },
        { id: "tc.1.2", ceId: "tc.ce1", codigo: "1.2", saberIds: ["tc.A3", "tc.A5"], texto: "Contextualizar obras cinematográficas en su momento histórico y cultural, reconociendo la evolución del lenguaje fílmico." },
      ],
    },
    {
      id: "tc.ce2", codigo: "CE2", descriptorIds: ["CCL4", "CCEC3", "CE2"],
      texto: "Diseñar proyectos audiovisuales originales, desarrollando ideas creativas desde la concepción hasta el guion técnico.",
      criterios: [
        { id: "tc.2.1", ceId: "tc.ce2", codigo: "2.1", saberIds: ["tc.B1", "tc.B2"], texto: "Desarrollar ideas originales para cortometrajes, elaborando sinopsis, treatment y guion literario con formato profesional." },
        { id: "tc.2.2", ceId: "tc.ce2", codigo: "2.2", saberIds: ["tc.B3", "tc.B4"], texto: "Elaborar guion técnico, storyboard y plan de rodaje detallado para la producción del cortometraje." },
      ],
    },
    {
      id: "tc.ce3", codigo: "CE3", descriptorIds: ["CD2", "CD3", "STEM4", "CPSAA3"],
      texto: "Planificar y organizar la producción de un cortometraje, gestionando recursos humanos, técnicos y económicos.",
      criterios: [
        { id: "tc.3.1", ceId: "tc.ce3", codigo: "3.1", saberIds: ["tc.B4", "tc.B5"], texto: "Elaborar un plan de producción completo: presupuesto, cronograma, equipo técnico y artístico, localizaciones y permisos." },
        { id: "tc.3.2", ceId: "tc.ce3", codigo: "3.2", saberIds: ["tc.C5"], texto: "Coordinar el rodaje del cortometraje, gestionando el equipo, el tiempo y los recursos disponibles." },
      ],
    },
    {
      id: "tc.ce4", codigo: "CE4", descriptorIds: ["CCEC3", "CD2", "CPSAA1"],
      texto: "Dirigir el rodaje de un cortometraje, coordinando los aspectos técnicos y artísticos con sensibilidad estética.",
      criterios: [
        { id: "tc.4.1", ceId: "tc.ce4", codigo: "4.1", saberIds: ["tc.C1", "tc.C2", "tc.C3"], texto: "Dirigir a actores y coordinar los departamentos de fotografía, sonido y arte durante el rodaje." },
        { id: "tc.4.2", ceId: "tc.ce4", codigo: "4.2", saberIds: ["tc.C4", "tc.C5"], texto: "Supervisar la dirección de arte y mantener la coherencia estética y narrativa del proyecto." },
      ],
    },
    {
      id: "tc.ce5", codigo: "CE5", descriptorIds: ["CD2", "CD3", "CCEC3", "CPSAA4"],
      texto: "Realizar la postproducción del cortometraje, aplicando técnicas de montaje, corrección de color y diseño sonoro.",
      criterios: [
        { id: "tc.5.1", ceId: "tc.ce5", codigo: "5.1", saberIds: ["tc.D1", "tc.D2"], texto: "Montar el cortometraje utilizando software profesional, aplicando criterios de ritmo, continuidad y narrativa." },
        { id: "tc.5.2", ceId: "tc.ce5", codigo: "5.2", saberIds: ["tc.D3", "tc.D4"], texto: "Realizar la corrección de color y el diseño sonoro final del cortometraje." },
        { id: "tc.5.3", ceId: "tc.ce5", codigo: "5.3", saberIds: ["tc.D5"], texto: "Preparar el cortometraje para su distribución en festivales y plataformas digitales." },
      ],
    },
  ],
};

export const CURRICULA: Record<string, Curriculum> = {
  "epva-eso": EPVA,
  "ea-bach": EA,
  "dt-bach": DT,
  "dt1-bach": DT1,
  "tp-bach": TP,
  "tc-bach": TC,
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
