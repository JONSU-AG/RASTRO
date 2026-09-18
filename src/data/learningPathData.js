// Catálogo pedagógico estructurado del Camino de Aprendizaje Rastro
// Con teoría preuniversitaria rigurosa y preguntas oficiales de CEPREUNSA / UNSA 2027
import { CEPREUNSA_OFFICIAL_THEORY } from './cepreunsaOfficialTheory.js';
export { CEPREUNSA_OFFICIAL_THEORY };

export function normalizeSubject(name) {
  if (!name) return '';
  const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (n.includes('civic')) return 'civica';
  if (n.includes('filosof')) return 'filosofia';
  if (n.includes('biolog')) return 'biologia';
  if (n.includes('fisic')) return 'fisica';
  if (n.includes('quimic')) return 'quimica';
  if (n.includes('geograf')) return 'geografia';
  if (n.includes('histor')) return 'historia';
  if (n.includes('lengua')) return 'lenguaje';
  if (n.includes('literat')) return 'literatura';
  if (n.includes('psicol')) return 'psicologia';
  if (n.includes('logic')) return 'raz. logico';
  if (n.includes('matem')) return 'raz. matematico';
  if (n.includes('verbal')) return 'raz. verbal';
  if (n.includes('algeb')) return 'algebra';
  if (n.includes('ingl') || n.includes('engl')) return 'ingles';
  return n;
}

export const SUBJECTS_CONFIG = [
  {
    id: 'Filosofía',
    name: 'Filosofía',
    area: 'Sociales y Humanidades',
    icon: '💭',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    description: 'Del mito al logos, presocráticos, disciplinas filosóficas y gnoseología.',
    units: CEPREUNSA_OFFICIAL_THEORY['Filosofía']?.units || []
  },
  {
    id: 'Biología',
    name: 'Biología',
    area: 'Biomédicas',
    icon: '🧬',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    description: 'Bases celulares, biomoléculas, genética y ecología para examen UNSA.',
    units: CEPREUNSA_OFFICIAL_THEORY['Biología']?.units || []
  },
  {
    id: 'Lenguaje',
    name: 'Lenguaje',
    area: 'Letras y Social',
    icon: '✍️',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    description: 'Comunicación, funciones del lenguaje, fonología y normativa RAE.',
    units: CEPREUNSA_OFFICIAL_THEORY['Lenguaje']?.units || []
  },
  {
    id: 'Historia',
    name: 'Historia',
    area: 'Sociales',
    icon: '🏛️',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    description: 'Poblamiento americano, altas culturas andinas, incas y virreinato.',
    units: CEPREUNSA_OFFICIAL_THEORY['Historia']?.units || []
  },
  {
    id: 'Psicología',
    name: 'Psicología',
    area: 'Biomédicas / Sociales',
    icon: '🧠',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    description: 'Procesos cognitivos, memoria, afectividad, aprendizaje y personalidad.',
    units: CEPREUNSA_OFFICIAL_THEORY['Psicología']?.units || []
  },
  {
    id: 'Física',
    name: 'Física',
    area: 'Ingenierías',
    icon: '⚡',
    color: '#EAB308',
    gradient: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
    description: 'Análisis dimensional, vectores, cinemática, estática y dinámica.',
    units: CEPREUNSA_OFFICIAL_THEORY['Física']?.units || []
  },
  {
    id: 'Química',
    name: 'Química',
    area: 'Ciencias / Ingenierías',
    icon: '🧪',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    description: 'Materia, estructura atómica, tabla periódica y enlaces químicos.',
    units: CEPREUNSA_OFFICIAL_THEORY['Química']?.units || []
  },
  {
    id: 'Cívica',
    name: 'Cívica',
    area: 'Sociales / Letras',
    icon: '⚖️',
    color: '#64748B',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    description: 'Identidad cultural, derechos humanos, constitución y ciudadanía.',
    units: CEPREUNSA_OFFICIAL_THEORY['Cívica']?.units || []
  },
  {
    id: 'Geografía',
    name: 'Geografía',
    area: 'Sociales / Ciencias',
    icon: '🌍',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    description: 'Espacio geográfico, geosistema, principios geográficos y ecorregiones.',
    units: CEPREUNSA_OFFICIAL_THEORY['Geografía']?.units || []
  },
  {
    id: 'Raz. Lógico',
    name: 'Raz. Lógico',
    area: 'Todas las Áreas',
    icon: '🧩',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    description: 'Proposiciones, principios lógicos supremos, formalización y tablas.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Lógico']?.units || []
  },
  {
    id: 'Raz. Matemático',
    name: 'Raz. Matemático',
    area: 'Todas las Áreas',
    icon: '🔢',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    description: 'Sucesiones, series, progresiones aritméticas y razonamiento numérico.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Matemático']?.units || []
  },
  {
    id: 'Raz. Verbal',
    name: 'Raz. Verbal',
    area: 'Todas las Áreas',
    icon: '📖',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    description: 'Sinónimos contextuales, precisión léxica y comprensión de lectura.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Verbal']?.units || []
  },
  {
    id: 'Literatura',
    name: 'Literatura',
    area: 'Letras y Humanidades',
    icon: '🎭',
    color: '#E11D48',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    description: 'Géneros literarios, figuras retóricas, épica griega y literatura peruana.',
    units: CEPREUNSA_OFFICIAL_THEORY['Literatura']?.units || []
  },
  {
    id: 'Álgebra',
    name: 'Álgebra',
    area: 'Ingenierías / Ciencias',
    icon: '📐',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    description: 'Leyes de exponentes, polinomios, productos notables y factorización.',
    units: CEPREUNSA_OFFICIAL_THEORY['Álgebra']?.units || []
  },
  {
    id: 'Inglés',
    name: 'Inglés',
    area: 'Todas las Áreas',
    icon: '🇬🇧',
    color: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    description: 'Personal pronouns, verb to be, WH-questions, reading and daily routines.',
    units: CEPREUNSA_OFFICIAL_THEORY['Inglés']?.units || []
  }
];

export const SUBJECT_ROADMAP = {
  'Álgebra': [
    { title: 'Leyes de Exponentes y Radicación', shortName: 'Leyes Exponentes', icon: '⚡', keyword: 'exponente' },
    { title: 'Polinomios y Grado Absoluto', shortName: 'Polinomios', icon: '📐', keyword: 'polinomio' },
    { title: 'Productos Notables: Binomio y Legendre', shortName: 'Prod. Notables', icon: '✨', keyword: 'notable' },
    { type: 'chest', title: 'Cofre de Bonificación Álgebra', shortName: 'Cofre UNSA', xp: 50, icon: '🎁' },
    { title: 'División de Polinomios y Horner', shortName: 'División Horner', icon: '🔢', keyword: 'división' },
    { title: 'Teorema del Resto y Descartes', shortName: 'Teor. del Resto', icon: '🎯', keyword: 'resto' },
    { title: 'Factorización y Aspa Simple', shortName: 'Factorización', icon: '🧩', keyword: 'factor' },
    { type: 'trophy', title: 'Desafío Maestro de Álgebra', shortName: 'Trofeo Álgebra', icon: '🏆', keyword: 'álgebra' }
  ],
  'Filosofía': [
    { title: 'Naturaleza y Definición de la Filosofía', shortName: 'Naturaleza', icon: '💭', keyword: 'filosofía' },
    { title: 'Del Mito al Logos y el Arjé', shortName: 'Mito al Logos', icon: '🏛️', keyword: 'logos' },
    { title: 'La Actitud Filosófica y el Ágora', shortName: 'Actitud Filosófica', icon: '💡', keyword: 'admiración' },
    { type: 'chest', title: 'Cofre de Sabiduría Filosófica', shortName: 'Cofre Sabio', xp: 50, icon: '🎁' },
    { title: 'Periodo Cosmológico y Jonios', shortName: 'Cosmológico', icon: '🌌', keyword: 'arjé' },
    { title: 'Periodo Antropológico: Sócrates', shortName: 'Sócrates', icon: '📜', keyword: 'sócrates' },
    { title: 'Disciplinas Filosóficas: Gnoseología y Ética', shortName: 'Disciplinas', icon: '⚖️', keyword: 'disciplina' },
    { type: 'trophy', title: 'Desafío Filosófico UNSA', shortName: 'Trofeo Logos', icon: '🏆', keyword: 'filosofía' }
  ],
  'Biología': [
    { title: 'La Ciencia de la Vida y Etimología', shortName: 'Ciencia Vida', icon: '🧬', keyword: 'biología' },
    { title: 'Niveles de Organización Biológica', shortName: 'Organización', icon: '🔬', keyword: 'celular' },
    { title: 'Bioelementos Primarios y Secundarios', shortName: 'Bioelementos', icon: '🧪', keyword: 'bioelemento' },
    { type: 'chest', title: 'Cofre Biomédico UNSA', shortName: 'Cofre Vida', xp: 50, icon: '🎁' },
    { title: 'Biomoléculas Inorgánicas: Agua y Sales', shortName: 'Agua y Sales', icon: '💧', keyword: 'agua' },
    { title: 'Glúcidos y Lípidos', shortName: 'Biomoléculas', icon: '🍞', keyword: 'lípido' },
    { title: 'Proteínas y Ácidos Nucleicos', shortName: 'Proteínas/ADN', icon: '🧬', keyword: 'proteína' },
    { type: 'trophy', title: 'Desafío Biomédico Final', shortName: 'Trofeo Biología', icon: '🏆', keyword: 'célula' }
  ],
  'Física': [
    { title: 'Análisis Dimensional y Vectores', shortName: 'Vectores', icon: '⚡', keyword: 'vector' },
    { title: 'Operaciones Vectoriales y Resultante', shortName: 'Resultante', icon: '📏', keyword: 'resultante' },
    { title: 'Cinemática: MRU y MRUV', shortName: 'MRU y MRUV', icon: '🏎️', keyword: 'cinemática' },
    { type: 'chest', title: 'Cofre de Energía Newtoniana', shortName: 'Cofre Fuerza', xp: 50, icon: '🎁' },
    { title: 'Caída Libre y Movimiento Parabólico', shortName: 'Caída Libre', icon: '🪂', keyword: 'parabólico' },
    { title: 'Estática: Primera Condición de Equilibrio', shortName: 'Estática', icon: '⚖️', keyword: 'equilibrio' },
    { title: 'Momento de una Fuerza y Segunda Condición', shortName: 'Torque', icon: '🔄', keyword: 'torque' },
    { type: 'trophy', title: 'Desafío de Ingenierías Física', shortName: 'Trofeo Física', icon: '🏆', keyword: 'física' }
  ],
  'Química': [
    { title: 'La Química y Ramas de la Materia', shortName: 'Ramas Química', icon: '🧪', keyword: 'inorgánica' },
    { title: 'Materia y Estados de Agregación', shortName: 'Materia', icon: '❄️', keyword: 'materia' },
    { title: 'Estructura Atómica y Núclidos', shortName: 'Átomo', icon: '⚛️', keyword: 'atómica' },
    { type: 'chest', title: 'Cofre de Laboratorio Químico', shortName: 'Cofre Químico', xp: 50, icon: '🎁' },
    { title: 'Números Cuánticos y Configuración', shortName: 'Configuración', icon: '📊', keyword: 'cuántico' },
    { title: 'Tabla Periódica y Propiedades', shortName: 'Tabla Periódica', icon: '📑', keyword: 'periódica' },
    { title: 'Enlace Químico: Iónico y Covalente', shortName: 'Enlaces', icon: '🔗', keyword: 'enlace' },
    { type: 'trophy', title: 'Desafío de Química UNSA', shortName: 'Trofeo Química', icon: '🏆', keyword: 'química' }
  ],
  'Lenguaje': [
    { title: 'El Lenguaje, Lengua y Habla', shortName: 'Lengua y Habla', icon: '✍️', keyword: 'lengua' },
    { title: 'Funciones del Lenguaje (Bühler/Jakobson)', shortName: 'Funciones', icon: '🗣️', keyword: 'función' },
    { title: 'Fonología y Acentuación RAE', shortName: 'Acentuación', icon: '🔤', keyword: 'acento' },
    { type: 'chest', title: 'Cofre Gramatical de Oro', shortName: 'Cofre Letras', xp: 50, icon: '🎁' },
    { title: 'Morfología: El Sustantivo y Adjetivo', shortName: 'Sustantivo', icon: '📝', keyword: 'sustantivo' },
    { title: 'Determinantes y Pronombres', shortName: 'Determinantes', icon: '📌', keyword: 'determinante' },
    { title: 'Sintaxis: Sujeto y Modificadores', shortName: 'Sintaxis', icon: '🧩', keyword: 'sujeto' },
    { type: 'trophy', title: 'Desafío Lingüístico UNSA', shortName: 'Trofeo Lenguaje', icon: '🏆', keyword: 'lenguaje' }
  ],
  'Historia': [
    { title: 'La Historia como Ciencia Social', shortName: 'Ciencia Histórica', icon: '🏛️', keyword: 'historia' },
    { title: 'Hominización y Poblamiento Americano', shortName: 'Poblamiento', icon: '🏹', keyword: 'poblamiento' },
    { title: 'Comunidades Primitivas en los Andes', shortName: 'Primeros Andes', icon: '🏺', keyword: 'arcaico' },
    { type: 'chest', title: 'Cofre Arqueológico del Imperio', shortName: 'Cofre Historia', xp: 50, icon: '🎁' },
    { title: 'Horizontes Culturales: Chavín y Paracas', shortName: 'Chavín y Paracas', icon: '🗿', keyword: 'chavín' },
    { title: 'Intermedio Temprano: Moche y Nazca', shortName: 'Moche y Nazca', icon: '🎨', keyword: 'moche' },
    { title: 'El Tahuantinsuyo y Organización Inca', shortName: 'Incas', icon: '👑', keyword: 'inca' },
    { type: 'trophy', title: 'Desafío Histórico del Perú', shortName: 'Trofeo Historia', icon: '🏆', keyword: 'tahuantinsuyo' }
  ],
  'Psicología': [
    { title: 'La Psicología Científica y Métodos', shortName: 'Psicología', icon: '🧠', keyword: 'psicología' },
    { title: 'Bases Biológicas de la Conducta', shortName: 'Cerebro y SN', icon: '⚡', keyword: 'nervioso' },
    { title: 'Sensación y Percepción', shortName: 'Percepción', icon: '👁️', keyword: 'percepción' },
    { type: 'chest', title: 'Cofre Cognitivo UNSA', shortName: 'Cofre Mente', xp: 50, icon: '🎁' },
    { title: 'Memoria y Almacenamiento', shortName: 'Memoria', icon: '💾', keyword: 'memoria' },
    { title: 'Pensamiento e Inteligencia', shortName: 'Pensamiento', icon: '💡', keyword: 'inteligencia' },
    { title: 'Afectividad y Emociones', shortName: 'Afectividad', icon: '❤️', keyword: 'emoción' },
    { type: 'trophy', title: 'Desafío de Procesos Mentales', shortName: 'Trofeo Psicología', icon: '🏆', keyword: 'conducta' }
  ],
  'Cívica': [
    { title: 'Identidad y Diversidad Cultural', shortName: 'Identidad', icon: '⚖️', keyword: 'identidad' },
    { title: 'Derechos Humanos y Generaciones', shortName: 'DD.HH.', icon: '📜', keyword: 'derecho' },
    { title: 'Garantías Constitucionales: Amparo y Hábeas', shortName: 'Garantías', icon: '🏛️', keyword: 'hábeas' },
    { type: 'chest', title: 'Cofre de Ciudadanía Activa', shortName: 'Cofre Cívico', xp: 50, icon: '🎁' },
    { title: 'Poderes del Estado Peruano', shortName: 'Poderes Estado', icon: '🏛️', keyword: 'ejecutivo' },
    { title: 'Organismos Constitucionales Autónomos', shortName: 'Autónomos', icon: '🛡️', keyword: 'onpe' },
    { title: 'Mecanismos de Participación Ciudadana', shortName: 'Participación', icon: '🗳️', keyword: 'referéndum' },
    { type: 'trophy', title: 'Desafío Constitucional UNSA', shortName: 'Trofeo Cívica', icon: '🏆', keyword: 'constitución' }
  ],
  'Geografía': [
    { title: 'El Espacio Geográfico y Geosistema', shortName: 'Espacio Geosistema', icon: '🌍', keyword: 'espacio' },
    { title: 'Principios Geográficos Clásicos', shortName: 'Principios', icon: '🧭', keyword: 'localización' },
    { title: 'Cartografía y Escalas Geográficas', shortName: 'Cartografía', icon: '🗺️', keyword: 'escala' },
    { type: 'chest', title: 'Cofre de Exploración Geográfica', shortName: 'Cofre Geo', xp: 50, icon: '🎁' },
    { title: 'Atmósfera y Dinámica del Clima', shortName: 'Clima', icon: '⛅', keyword: 'clima' },
    { title: 'Morfología y Relieve del Perú', shortName: 'Relieve Peruano', icon: '🏔️', keyword: 'cordillera' },
    { title: 'Las 8 Regiones Naturales (Pulgar Vidal)', shortName: '8 Regiones', icon: '🌿', keyword: 'región' },
    { type: 'trophy', title: 'Desafío Territorial UNSA', shortName: 'Trofeo Geografía', icon: '🏆', keyword: 'geografía' }
  ],
  'Raz. Lógico': [
    { title: 'Lógica Proposicional e Inferencias', shortName: 'Proposiciones', icon: '🧩', keyword: 'proposición' },
    { title: 'Formalización de Enunciados', shortName: 'Formalización', icon: '🔣', keyword: 'formalización' },
    { title: 'Tablas de Verdad y Conectores', shortName: 'Tablas Verdad', icon: '📊', keyword: 'tabla' },
    { type: 'chest', title: 'Cofre de Lógica Pura', shortName: 'Cofre Lógico', xp: 50, icon: '🎁' },
    { title: 'Equivalencias Notables y De Morgan', shortName: 'Equivalencias', icon: '🔄', keyword: 'morgan' },
    { title: 'Inferencias Lógicas y Modus Ponens', shortName: 'Inferencias', icon: '🎯', keyword: 'inferencia' },
    { title: 'Circuitos Lógicos a Conmutadores', shortName: 'Circuitos', icon: '🔌', keyword: 'circuito' },
    { type: 'trophy', title: 'Desafío de Lógica Simbólica', shortName: 'Trofeo Lógica', icon: '🏆', keyword: 'lógica' }
  ],
  'Raz. Matemático': [
    { title: 'Sucesiones y Progresiones Aritméticas', shortName: 'Sucesiones', icon: '🔢', keyword: 'sucesión' },
    { title: 'Progresiones Geométricas y Término Enésimo', shortName: 'P.G. y Términos', icon: '📈', keyword: 'geométrica' },
    { title: 'Series y Sumatorias Notables', shortName: 'Sumatorias', icon: '∑', keyword: 'serie' },
    { type: 'chest', title: 'Cofre Numérico UNSA', shortName: 'Cofre Números', xp: 50, icon: '🎁' },
    { title: 'Conteo de Figuras Geométricas', shortName: 'Conteo Figuras', icon: '📐', keyword: 'conteo' },
    { title: 'Operadores Matemáticos Compuestos', shortName: 'Operadores', icon: '⚙️', keyword: 'operador' },
    { title: 'Planteo de Ecuaciones y Edades', shortName: 'Planteo Ecuaciones', icon: '⚖️', keyword: 'ecuación' },
    { type: 'trophy', title: 'Desafío de Razonamiento Numérico', shortName: 'Trofeo Raz. Mat.', icon: '🏆', keyword: 'matemático' }
  ],
  'Raz. Verbal': [
    { title: 'Semántica Contextual y Sinonimia', shortName: 'Sinonimia', icon: '📖', keyword: 'sinonimia' },
    { title: 'Antonimia Contextual y Campo Semántico', shortName: 'Antonimia', icon: '↔️', keyword: 'antonimia' },
    { title: 'Analogías Verbales y Tipos Relacionales', shortName: 'Analogías', icon: '🔗', keyword: 'analogía' },
    { type: 'chest', title: 'Cofre de Léxico Avanzado', shortName: 'Cofre Léxico', xp: 50, icon: '🎁' },
    { title: 'Oraciones Incompletas y Cohesión', shortName: 'Completar Oración', icon: '✏️', keyword: 'incompleta' },
    { title: 'Conectores Lógicos en el Discurso', shortName: 'Conectores', icon: '🪢', keyword: 'conector' },
    { title: 'Comprensión de Lectura: Idea Principal', shortName: 'Comprensión', icon: '📑', keyword: 'lectura' },
    { type: 'trophy', title: 'Desafío de Comprensión Crítica', shortName: 'Trofeo Verbal', icon: '🏆', keyword: 'verbal' }
  ],
  'Literatura': [
    { title: 'Teoría Literaria y Géneros Clásicos', shortName: 'Géneros Literarios', icon: '🎭', keyword: 'género' },
    { title: 'Figuras Literarias Retóricas', shortName: 'Figuras Retóricas', icon: '🎨', keyword: 'metáfora' },
    { title: 'Épica Griega: La Ilíada y La Odisea', shortName: 'Épica Griega', icon: '⚔️', keyword: 'ilíada' },
    { type: 'chest', title: 'Cofre de las Bellas Letras', shortName: 'Cofre Literario', xp: 50, icon: '🎁' },
    { title: 'Tragedia Griega: Sófocles y Edipo Rey', shortName: 'Edipo Rey', icon: '👑', keyword: 'edipo' },
    { title: 'Siglo de Oro Español: Quijote y Calderón', shortName: 'Siglo de Oro', icon: '🛡️', keyword: 'quijote' },
    { title: 'Literatura Peruana: Del Romanticismo a Prada', shortName: 'Literatura Peruana', icon: '🇵🇪', keyword: 'prada' },
    { type: 'trophy', title: 'Desafío Literario de Admisión', shortName: 'Trofeo Letras', icon: '🏆', keyword: 'literatura' }
  ],
  'Inglés': [
    { title: 'Personal Pronouns & Verb To Be', shortName: 'Verb To Be', icon: '🇬🇧', keyword: 'pronoun' },
    { title: 'WH-Questions & Personal Information', shortName: 'WH-Questions', icon: '❓', keyword: 'what' },
    { title: 'Simple Present Tense & Daily Routine', shortName: 'Present Simple', icon: '⏰', keyword: 'present' },
    { type: 'chest', title: 'Oxford Booster Chest', shortName: 'Cofre Inglés', xp: 50, icon: '🎁' },
    { title: 'Adjectives, Opposites and Descriptions', shortName: 'Adjectives', icon: '✨', keyword: 'adjective' },
    { title: 'Modal Verbs: Can and Must', shortName: 'Modal Verbs', icon: '🚦', keyword: 'modal' },
    { title: 'Reading Comprehension for Admission', shortName: 'Reading Passages', icon: '📰', keyword: 'reading' },
    { type: 'trophy', title: 'UNSA English Master Trophy', shortName: 'Trofeo Inglés', icon: '🏆', keyword: 'english' }
  ]
};

// Cache del banco de preguntas oficial CEPREUNSA para rendimiento óptimo
let _cachedBancoQuestions = null;

async function loadBancoPreguntas() {
  if (_cachedBancoQuestions && _cachedBancoQuestions.length > 0) {
    return _cachedBancoQuestions;
  }
  try {
    const mod = await import('./bancoPreguntasCepreunsa.json');
    const list = mod.default || mod;
    if (Array.isArray(list) && list.length > 0) {
      _cachedBancoQuestions = list;
      return _cachedBancoQuestions;
    }
  } catch (err) {
    console.warn('Carga dinámica de bancoPreguntasCepreunsa falló, intentando fetch:', err);
  }

  try {
    const response = await fetch('/src/data/bancoPreguntasCepreunsa.json');
    if (response.ok) {
      const list = await response.json();
      if (Array.isArray(list) && list.length > 0) {
        _cachedBancoQuestions = list;
        return _cachedBancoQuestions;
      }
    }
  } catch (err) {
    console.error('Fetch de bancoPreguntasCepreunsa falló:', err);
  }

  return [];
}

// Generador de Lección interactiva integrando la Teoría Oficial de CEPREUNSA con preguntas reales de solucionario
export function buildLessonWithRichTheory(subjectId, semanaNum, questionsList, lessonIdx, usedQuestionIds = new Set()) {
  const officialSub = CEPREUNSA_OFFICIAL_THEORY[subjectId];
  const roadmapList = SUBJECT_ROADMAP[subjectId] || [];
  const roadmapItem = roadmapList[lessonIdx % (roadmapList.length || 1)] || {};

  let lessonTheory = null;
  if (officialSub && officialSub.lessons && officialSub.lessons.length > 0) {
    lessonTheory = officialSub.lessons[lessonIdx % officialSub.lessons.length];
  }

  const lessonTitle = roadmapItem.title || (lessonTheory ? lessonTheory.title : `Fundamentos de ${subjectId}`);
  const shortName = roadmapItem.shortName || `Lección ${lessonIdx + 1}`;
  const nodeIcon = roadmapItem.icon || '⭐';
  const nodeType = roadmapItem.type || 'lesson';

  const subjectTheory = lessonTheory ? {
    title: lessonTitle,
    subtitle: lessonTheory.subtitle || `${subjectId} • CEPREUNSA Oficial`,
    sections: lessonTheory.sections,
    takeaway: lessonTheory.takeaway
  } : {
    title: lessonTitle,
    subtitle: `${subjectId} • CEPREUNSA Admisión UNSA`,
    sections: [
      {
        heading: `1. Marco Teórico: ${shortName}`,
        body: `El temario oficial de ${subjectId} evalúa definiciones rigurosas y leyes científicas. Revisa los conceptos esenciales antes de responder las preguntas extraídas del banco de solucionarios.`
      }
    ],
    takeaway: `El dominio de los conceptos esenciales de ${subjectId} garantiza precisión en las preguntas tipo admisión.`
  };

  // Filtrar preguntas válidas del banco de esa asignatura
  const normSub = normalizeSubject(subjectId);
  const subjectQuestions = (questionsList || []).filter(q => 
    normalizeSubject(q.asignatura) === normSub &&
    q.options &&
    q.options.length >= 2 &&
    q.answer !== undefined &&
    q.answer !== null &&
    q.answer >= 0 &&
    q.answer < q.options.length &&
    q.options[q.answer] &&
    q.options[q.answer].trim().length > 0
  );
  
  // Buscar preguntas que coincidan con la temática o palabras clave y que NO se hayan usado antes
  const searchKeywords = [
    roadmapItem.keyword,
    lessonTheory?.targetQuestionKeyword,
    roadmapItem.shortName,
    roadmapItem.title
  ].filter(Boolean);

  let selectedQuestion = null;

  // 1. Buscar coincidencia por palabra clave no utilizada
  for (const kwRaw of searchKeywords) {
    const kw = kwRaw.toLowerCase();
    selectedQuestion = subjectQuestions.find(q => 
      !usedQuestionIds.has(q.id) &&
      ((q.q && q.q.toLowerCase().includes(kw)) ||
       (q.explanation && q.explanation.toLowerCase().includes(kw)))
    );
    if (selectedQuestion) break;
  }

  // 2. Si no hay coincidencia temática no usada, tomar la siguiente pregunta disponible no usada
  if (!selectedQuestion) {
    selectedQuestion = subjectQuestions.find(q => !usedQuestionIds.has(q.id));
  }

  // 3. Si se agotaron todas las preguntas del banco (raro), tomar por correlación sin bloquear
  if (!selectedQuestion && subjectQuestions.length > 0) {
    selectedQuestion = subjectQuestions[lessonIdx % subjectQuestions.length];
  }

  if (selectedQuestion && selectedQuestion.id) {
    usedQuestionIds.add(selectedQuestion.id);
  }

  // 4. Fallback temático dinámico único en caso extremo de que no haya preguntas
  if (!selectedQuestion) {
    selectedQuestion = {
      id: `${subjectId}_fallback_node_${lessonIdx + 1}`,
      q: `¿Cuál es el principio fundamental analizado en "${lessonTitle}" para el examen de admisión?`,
      options: [
        `La deducción rigurosa de principios y leyes de ${subjectId}`,
        'La memorización mecánica sin análisis conceptual',
        'La suposición intuitiva sin comprobación teórica',
        'El descarte al azar sin fundamento científico'
      ],
      answer: 0,
      explanation: `En ${subjectId}, el dominio del tema "${shortName}" requiere aplicar el marco teórico para resolver casos particulares con certeza.`
    };
  }

  const isDrawSubject = subjectId === 'Física' || subjectId === 'Álgebra' || subjectId === 'Raz. Matemático' || subjectId === 'Química';
  const paperHint = isDrawSubject
    ? '✏️ Consejo Rastro: Traza el planteamiento o diagrama en tu borrador antes de marcar tu respuesta.'
    : null;

  // Reto 1: Caso particular oficial del solucionario CEPREUNSA
  const challenge1 = {
    id: `${selectedQuestion.id}_c1`,
    type: 'multiple_choice',
    pedagogicalTier: '🎯 Caso Particular Evaluado por CEPREUNSA',
    instruction: 'Aplica el principio general estudiado para deducir la solución a este caso oficial de admisión:',
    question: selectedQuestion.q,
    options: selectedQuestion.options || [],
    correctIndex: selectedQuestion.answer,
    explanation: selectedQuestion.explanation || 'Respuesta verificada según el solucionario oficial de CEPREUNSA.',
    paperHint,
    xpReward: 25
  };

  // Buscar una segunda pregunta real no usada para el Reto 2 (evita preguntas repetidas y enriquece la sesión)
  let secondaryQuestion = null;
  for (const kwRaw of searchKeywords) {
    const kw = kwRaw.toLowerCase();
    secondaryQuestion = subjectQuestions.find(q => 
      !usedQuestionIds.has(q.id) &&
      ((q.q && q.q.toLowerCase().includes(kw)) ||
       (q.explanation && q.explanation.toLowerCase().includes(kw)))
    );
    if (secondaryQuestion) break;
  }
  if (!secondaryQuestion) {
    secondaryQuestion = subjectQuestions.find(q => !usedQuestionIds.has(q.id));
  }
  if (secondaryQuestion && secondaryQuestion.id) {
    usedQuestionIds.add(secondaryQuestion.id);
  }

  let challenge2 = null;
  if (secondaryQuestion) {
    challenge2 = {
      id: `${secondaryQuestion.id}_c2`,
      type: 'multiple_choice',
      pedagogicalTier: '⚡ Reto Aplicativo • Banco CEPREUNSA',
      instruction: 'Analiza este segundo caso propuesto en los tomos de la UNSA y deduce la respuesta correcta:',
      question: secondaryQuestion.q,
      options: secondaryQuestion.options || [],
      correctIndex: secondaryQuestion.answer,
      explanation: secondaryQuestion.explanation || 'Respuesta oficial contrastada con el temario CEPREUNSA.',
      paperHint,
      xpReward: 25
    };
  } else {
    // Reto de deducción conceptual cloze
    const correctAnswer = selectedQuestion.options ? selectedQuestion.options[selectedQuestion.answer] : '';
    const answerWords = (correctAnswer || '').split(/[\s,.;:()\/\-]+/).filter(w => w.length >= 4 && !['para', 'este', 'esta', 'como', 'entre', 'desde', 'sobre', 'estos'].includes(w.toLowerCase()));
    
    let targetWord = 'principio';
    if (answerWords.length > 0) {
      targetWord = answerWords.sort((a, b) => b.length - a.length)[0].replace(/[.,:;()]/g, '');
    } else if (lessonTheory && lessonTheory.targetQuestionKeyword) {
      targetWord = lessonTheory.targetQuestionKeyword;
    }

    const distractors = ['falacia', 'azar', 'empírico', 'suposición'].filter(d => d.toLowerCase() !== targetWord.toLowerCase()).slice(0, 3);
    const chips = [targetWord, ...distractors].sort(() => Math.random() - 0.5);

    challenge2 = {
      id: `${selectedQuestion.id}_c2`,
      type: 'cloze',
      pedagogicalTier: '🧠 Síntesis Deductiva',
      instruction: 'Completa la deducción del caso particular con el término clave de la teoría general:',
      sentence: `En ${subjectId}, deducimos el caso particular aplicando el concepto: "__________".`,
      targetWord: targetWord,
      chips: chips,
      explanation: `El concepto clave que conecta la teoría general con la respuesta es "${targetWord}".`,
      xpReward: 20
    };
  }

  // Reto 3 opcional de síntesis / fijación
  const challenges = [challenge1, challenge2];

  return {
    id: `lesson_${subjectId}_s${semanaNum}_${lessonIdx + 1}`,
    subject: subjectId,
    semana: semanaNum,
    lessonNumber: lessonIdx + 1,
    title: lessonTitle,
    shortName: shortName,
    nodeIcon: nodeIcon,
    nodeType: nodeType,
    xpReward: nodeType === 'chest' ? 50 : nodeType === 'trophy' ? 40 : 25,
    theory: subjectTheory,
    challenges: challenges
  };
}

// Cargar y estructurar lecciones con teoría rica y preguntas oficiales únicas para cualquier asignatura
export async function getLessonsForSubject(subjectId, limit = 8) {
  const normSub = normalizeSubject(subjectId);
  try {
    const allQuestions = await loadBancoPreguntas();
    const filtered = allQuestions.filter(q => 
      normalizeSubject(q.asignatura) === normSub && 
      q.options && 
      q.options.length >= 2 &&
      q.answer !== undefined &&
      q.answer !== null &&
      q.answer >= 0 &&
      q.answer < q.options.length &&
      q.options[q.answer] &&
      q.options[q.answer].trim().length > 0
    );

    const usedQuestionIds = new Set();
    const generated = [];
    for (let i = 0; i < limit; i++) {
      generated.push(buildLessonWithRichTheory(subjectId, 1, filtered, i, usedQuestionIds));
    }
    return generated;
  } catch (error) {
    console.warn('Error al cargar banco:', error);
    const fallbackList = [];
    const usedQuestionIds = new Set();
    for (let i = 0; i < limit; i++) {
      fallbackList.push(buildLessonWithRichTheory(subjectId, 1, [], i, usedQuestionIds));
    }
    return fallbackList;
  }
}

