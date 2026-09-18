// Catálogo pedagógico estructurado del Camino de Aprendizaje Rastro
// Con teoría preuniversitaria rigurosa y preguntas oficiales de CEPREUNSA / UNSA 2027
// Contiene el 100% de los 15 cursos oficiales de la Matriz de Evaluación CEPREUNSA
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
  if (n.includes('matem') || n.includes('algeb') || n.includes('aritmet') || n.includes('geomet') || n.includes('trigon')) return 'matematica';
  if (n.includes('verbal') || n.includes('lectura')) return 'raz. verbal';
  if (n.includes('ingl') || n.includes('engl')) return 'ingles';
  return n;
}

// Configuración Oficial de las 15 Asignaturas según la Matriz de Admisión UNSA
export const SUBJECTS_CONFIG = [
  {
    id: 'Biología',
    name: 'Biología',
    area: 'Biomédicas',
    icon: '🧬',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    description: 'Origen de la vida, bioquímica, células, histología, anatomía, genética y ecología.',
    units: CEPREUNSA_OFFICIAL_THEORY['Biología']?.units || []
  },
  {
    id: 'Cívica',
    name: 'Cívica',
    area: 'Sociales / Letras',
    icon: '⚖️',
    color: '#64748B',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    description: 'Ciudadanía, Constitución, poderes del Estado, DD.HH., SINAGERD y cultura de paz.',
    units: CEPREUNSA_OFFICIAL_THEORY['Cívica']?.units || []
  },
  {
    id: 'Filosofía',
    name: 'Filosofía',
    area: 'Sociales y Humanidades',
    icon: '💭',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    description: 'Disciplinas filosóficas, historia antigua a contemporánea, ética, ciencia y política.',
    units: CEPREUNSA_OFFICIAL_THEORY['Filosofía']?.units || []
  },
  {
    id: 'Física',
    name: 'Física',
    area: 'Ingenierías',
    icon: '⚡',
    color: '#EAB308',
    gradient: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
    description: 'Vectores, cinemática, leyes de Newton, estática, trabajo, fluidos, calor y electromagnetismo.',
    units: CEPREUNSA_OFFICIAL_THEORY['Física']?.units || []
  },
  {
    id: 'Geografía',
    name: 'Geografía',
    area: 'Sociales / Ciencias',
    icon: '🌍',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    description: 'Espacio geográfico, geosistema, vulnerabilidad, población peruana y calidad de vida.',
    units: CEPREUNSA_OFFICIAL_THEORY['Geografía']?.units || []
  },
  {
    id: 'Historia',
    name: 'Historia',
    area: 'Sociales',
    icon: '🏛️',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    description: 'Historia como ciencia, prehistoria, edades antigua a contemporánea, Perú prehispánico y república.',
    units: CEPREUNSA_OFFICIAL_THEORY['Historia']?.units || []
  },
  {
    id: 'Inglés',
    name: 'Inglés',
    area: 'Todas las Áreas',
    icon: '🇬🇧',
    color: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    description: 'Personal info, routines, family, places, past experiences, future plans & reading.',
    units: CEPREUNSA_OFFICIAL_THEORY['Inglés']?.units || []
  },
  {
    id: 'Lenguaje',
    name: 'Lenguaje',
    area: 'Letras y Social',
    icon: '✍️',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    description: 'Comunicación, fonología, acentuación, mayúsculas, morfología y sintaxis.',
    units: CEPREUNSA_OFFICIAL_THEORY['Lenguaje']?.units || []
  },
  {
    id: 'Literatura',
    name: 'Literatura',
    area: 'Letras y Humanidades',
    icon: '🎭',
    color: '#E11D48',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    description: 'Clásicos griegos, medievales, Quijote, narrativa del siglo XX, literatura peruana y regional.',
    units: CEPREUNSA_OFFICIAL_THEORY['Literatura']?.units || []
  },
  {
    id: 'Matemática',
    name: 'Matemática',
    area: 'Ingenierías / Ciencias',
    icon: '📐',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    description: 'Álgebra, ecuaciones, aritmética, geometría plana y del espacio, trigonometría y estadística.',
    units: CEPREUNSA_OFFICIAL_THEORY['Álgebra']?.units || []
  },
  {
    id: 'Psicología',
    name: 'Psicología',
    area: 'Biomédicas / Sociales',
    icon: '🧠',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    description: 'Proyecto de vida, bases biológicas, motivación, personalidad, aprendizaje e identidad.',
    units: CEPREUNSA_OFFICIAL_THEORY['Psicología']?.units || []
  },
  {
    id: 'Química',
    name: 'Química',
    area: 'Ciencias / Ingenierías',
    icon: '🧪',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    description: 'Materia, estructura atómica, tabla periódica, enlaces, estequiometría, gases e hidrocarburos.',
    units: CEPREUNSA_OFFICIAL_THEORY['Química']?.units || []
  },
  {
    id: 'Raz. Lógico',
    name: 'Raz. Lógico',
    area: 'Todas las Áreas',
    icon: '🧩',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    description: 'Proposiciones, conectores, tablas de verdad, De Morgan, inferencias, silogismos y falacias.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Lógico']?.units || []
  },
  {
    id: 'Raz. Matemático',
    name: 'Raz. Matemático',
    area: 'Todas las Áreas',
    icon: '🔢',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    description: 'Sucesiones, series, magnitudes, porcentajes, edades, áreas sombreadas y combinatoria.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Matemático']?.units || []
  },
  {
    id: 'Raz. Verbal',
    name: 'Raz. Verbal',
    area: 'Todas las Áreas',
    icon: '📖',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    description: 'Sinonimia, antonimia, analogías, lógica de enunciados, pragmática y comprensión lectora.',
    units: CEPREUNSA_OFFICIAL_THEORY['Raz. Verbal']?.units || []
  }
];

// Temarios Oficiales Exhaustivos (100% de los capítulos del temario de evaluación UNSA)
export const SUBJECT_ROADMAP = {
  'Biología': [
    { title: 'Origen de la Vida, Evolución y Niveles de Organización', shortName: 'Origen y Niveles', icon: '🧬', keyword: 'origen' },
    { title: 'Base Química de la Vida: Enzimas y Ácidos Nucleicos', shortName: 'Base Química', icon: '🧪', keyword: 'enzima' },
    { title: 'Célula, Ciclo Celular, Bacterias y Cianobacterias', shortName: 'Célula y Dominios', icon: '🔬', keyword: 'célula' },
    { type: 'chest', title: 'Cofre Biomédico UNSA', shortName: 'Cofre Vida', xp: 50, icon: '🎁' },
    { title: 'Reinos e Histología Vegetal y Animal', shortName: 'Histología y Reinos', icon: '🌱', keyword: 'histología' },
    { title: 'Nutrición y Metabolismo Celular', shortName: 'Nutrición/Metabolismo', icon: '⚡', keyword: 'metabolismo' },
    { title: 'Sistema Digestivo y Excretor Humano', shortName: 'Digestivo y Excretor', icon: '🫀', keyword: 'digestivo' },
    { type: 'chest', title: 'Cofre de la Salud y Homeostasis', shortName: 'Cofre Homeostasis', xp: 50, icon: '🎁' },
    { title: 'Sistema Sensorial y Sistema Endocrino', shortName: 'Sensorial y Hormonas', icon: '👁️', keyword: 'endocrino' },
    { title: 'Reproducción y Sistema Inmunitario', shortName: 'Inmunidad y Reprod.', icon: '🛡️', keyword: 'inmune' },
    { title: 'Genética, Biotecnología y Bioética', shortName: 'Genética y Bioética', icon: '🧬', keyword: 'genética' },
    { title: 'Ecología, Biodiversidad, Biomas y ODS', shortName: 'Ecología y ODS', icon: '🌍', keyword: 'ecología' },
    { type: 'trophy', title: 'Desafío Biomédico Supremo UNSA', shortName: 'Trofeo Biología', icon: '🏆', keyword: 'biología' }
  ],

  'Cívica': [
    { title: 'Ciudadanía e Identidad Cultural', shortName: 'Identidad Cultural', icon: '🇵🇪', keyword: 'identidad' },
    { title: 'Estado Peruano y Constitución Política', shortName: 'Estado y Constitución', icon: '⚖️', keyword: 'constitución' },
    { title: 'Poderes del Estado y Organismos Autónomos', shortName: 'Poderes y Órganos', icon: '🏛️', keyword: 'ejecutivo' },
    { type: 'chest', title: 'Cofre de Ciudadanía Activa', shortName: 'Cofre Cívico', xp: 50, icon: '🎁' },
    { title: 'Mecanismos de Participación Ciudadana', shortName: 'Participación', icon: '🗳️', keyword: 'participación' },
    { title: 'Derechos Humanos y Garantías Constitucionales', shortName: 'Derechos Humanos', icon: '📜', keyword: 'derecho' },
    { title: 'Sistema Nacional de Gestión de Riesgo (SINAGERD)', shortName: 'SINAGERD', icon: '🚨', keyword: 'desastres' },
    { type: 'chest', title: 'Cofre de Convivencia y Democracia', shortName: 'Cofre Democracia', xp: 50, icon: '🎁' },
    { title: 'Gobiernos Regionales y Funciones Municipales', shortName: 'Gobiernos Locales', icon: '🏢', keyword: 'municipal' },
    { title: 'Desarrollo, Convivencia y Cultura de Paz', shortName: 'Cultura de Paz', icon: '🕊️', keyword: 'paz' },
    { type: 'trophy', title: 'Desafío Constitucional Supremo UNSA', shortName: 'Trofeo Cívica', icon: '🏆', keyword: 'cívica' }
  ],

  'Filosofía': [
    { title: 'Nociones Preliminares: Etimología y Rasgos del Saber', shortName: 'Nociones Filosofía', icon: '💭', keyword: 'filosofía' },
    { title: 'Disciplinas Filosóficas: Ontología, Gnoseología y Ética', shortName: 'Disciplinas Filos.', icon: '⚖️', keyword: 'gnoseología' },
    { title: 'Filosofía Antigua: Presocráticos, Sócrates y Clásicos', shortName: 'Filosofía Antigua', icon: '🏛️', keyword: 'sócrates' },
    { type: 'chest', title: 'Cofre de Sabiduría Filosófica', shortName: 'Cofre Sabio', xp: 50, icon: '🎁' },
    { title: 'Filosofía Medieval: Razón y Fe en Agustín y Tomás', shortName: 'Filosofía Medieval', icon: '⛪', keyword: 'medieval' },
    { title: 'Filosofía Moderna: Racionalismo, Empirismo y Kant', shortName: 'Filosofía Moderna', icon: '💡', keyword: 'moderna' },
    { title: 'Filosofía Contemporánea: Marx, Nietzsche y Positivismo', shortName: 'Contemporánea', icon: '🔥', keyword: 'contemporánea' },
    { title: 'Filosofía de la Ciencia y Crítica a la Tecnología', shortName: 'Ciencia y Tecnología', icon: '🔬', keyword: 'epistemología' },
    { type: 'chest', title: 'Cofre de Episteme y Verdad', shortName: 'Cofre Episteme', xp: 50, icon: '🎁' },
    { title: 'Estética, Arte y la Experiencia Estética', shortName: 'Estética y Arte', icon: '🎨', keyword: 'estética' },
    { title: 'Filosofía en el Perú y el Pensamiento Latinoamericano', shortName: 'Filosofía en el Perú', icon: '🇵🇪', keyword: 'perú' },
    { title: 'Axiología y Ética: Valores, Justicia y Moral', shortName: 'Axiología y Ética', icon: '💎', keyword: 'valor' },
    { title: 'Filosofía Política: Estado, Poder, Justicia y Democracia', shortName: 'Filosofía Política', icon: '👑', keyword: 'estado' },
    { title: 'Filosofía del Ser Humano: Antropología y Racionalidad', shortName: 'El Ser Humano', icon: '🧠', keyword: 'humano' },
    { type: 'trophy', title: 'Desafío del Logos Filosófico UNSA', shortName: 'Trofeo Filosofía', icon: '🏆', keyword: 'filosofía' }
  ],

  'Física': [
    { title: 'Análisis Dimensional y Operaciones Vectoriales', shortName: 'Vectores y Magnitud', icon: '⚡', keyword: 'vector' },
    { title: 'Cinemática Unidimensional: MRU y MRUV', shortName: 'MRU y MRUV', icon: '🏎️', keyword: 'cinemática' },
    { title: 'Movimiento Bidimensional, Caída Libre y Parabólico', shortName: 'Parabólico y Caída', icon: '🪂', keyword: 'parabólico' },
    { type: 'chest', title: 'Cofre de Energía Newtoniana', shortName: 'Cofre Fuerza', xp: 50, icon: '🎁' },
    { title: 'Leyes de Newton, Estática y Torque', shortName: 'Estática y Dinámica', icon: '⚖️', keyword: 'fuerza' },
    { title: 'Trabajo Mecánico, Energía y Potencia', shortName: 'Trabajo y Energía', icon: '🔋', keyword: 'energía' },
    { title: 'Mecánica de Fluidos: Hidrostática y Empuje', shortName: 'Fluidos y Presión', icon: '💧', keyword: 'presión' },
    { type: 'chest', title: 'Cofre de Termodinámica', shortName: 'Cofre Térmico', xp: 50, icon: '🎁' },
    { title: 'Fenómenos Térmicos: Calorimetría y Dilatación', shortName: 'Calorimetría', icon: '🔥', keyword: 'calor' },
    { title: 'Electrostática: Ley de Coulomb y Campo Eléctrico', shortName: 'Electrostática', icon: '⚡', keyword: 'eléctrico' },
    { title: 'Electrodinámica: Ley de Ohm y Circuitos Eléctricos', shortName: 'Circuitos y Ohm', icon: '🔌', keyword: 'resistencia' },
    { title: 'Magnetismo e Inducción Electromagnética', shortName: 'Electromagnetismo', icon: '🧲', keyword: 'campo' },
    { type: 'trophy', title: 'Desafío de Ingenierías Física UNSA', shortName: 'Trofeo Física', icon: '🏆', keyword: 'física' }
  ],

  'Geografía': [
    { title: 'La Geografía como Ciencia del Espacio Geográfico', shortName: 'Ciencia Geográfica', icon: '🧭', keyword: 'geografía' },
    { title: 'El Geosistema: Entidades Bióticas, Abióticas y Antrópicas', shortName: 'Geosistema', icon: '🌍', keyword: 'geosistema' },
    { title: 'La Tierra como Planeta, Coordenadas y Cartografía', shortName: 'La Tierra y Mapas', icon: '🗺️', keyword: 'coordenada' },
    { type: 'chest', title: 'Cofre de Exploración Geográfica', shortName: 'Cofre Geo', xp: 50, icon: '🎁' },
    { title: 'Factores de Vulnerabilidad: Exposición, Fragilidad y Resiliencia', shortName: 'Vulnerabilidad', icon: '⚠️', keyword: 'vulnerabilidad' },
    { title: 'Dimensiones de Elementos Expuestos: Social y Económico', shortName: 'Riesgos Sociales', icon: '🏘️', keyword: 'social' },
    { title: 'Población Peruana: Demografía, Migraciones y Crecimiento', shortName: 'Demografía Perú', icon: '👥', keyword: 'población' },
    { type: 'chest', title: 'Cofre de Ecorregiones y Recursos', shortName: 'Cofre Ecorregiones', xp: 50, icon: '🎁' },
    { title: 'Calidad de Vida: Salud, Educación y Vivienda Básica', shortName: 'Calidad de Vida', icon: '🏥', keyword: 'calidad' },
    { title: 'Economía de la Población y Desarrollo Humano', shortName: 'Desarrollo Humano', icon: '📈', keyword: 'desarrollo' },
    { title: 'La Antártida: Geografía, Relieve y Tratados', shortName: 'La Antártida', icon: '❄️', keyword: 'antártida' },
    { type: 'trophy', title: 'Desafío Territorial Supremo UNSA', shortName: 'Trofeo Geografía', icon: '🏆', keyword: 'geografía' }
  ],

  'Historia': [
    { title: 'La Historia como Ciencia Social y Fuentes Históricas', shortName: 'Ciencia Histórica', icon: '📜', keyword: 'historia' },
    { title: 'La Prehistoria, Edad de Piedra y Proceso de Hominización', shortName: 'Hominización', icon: '🏹', keyword: 'hominización' },
    { title: 'Edad Antigua: Sociedades Fluviales y Mediterráneas', shortName: 'Edad Antigua', icon: '🏛️', keyword: 'antigua' },
    { type: 'chest', title: 'Cofre Arqueológico de la Humanidad', shortName: 'Cofre Arqueológico', xp: 50, icon: '🎁' },
    { title: 'Edad Media: Feudalismo, Imperio Bizantino e Islam', shortName: 'Edad Media', icon: '⚔️', keyword: 'feudalismo' },
    { title: 'Edad Moderna: Humanismo, Renacimiento y Reformas', shortName: 'Edad Moderna', icon: '🎨', keyword: 'moderna' },
    { title: 'Edad Contemporánea: Revoluciones y Conflictos Mundiales', shortName: 'Contemporánea', icon: '🏭', keyword: 'revolución' },
    { type: 'chest', title: 'Cofre Arqueológico del Imperio Inca', shortName: 'Cofre Inca', xp: 50, icon: '🎁' },
    { title: 'El Perú Prehispánico: De Caral y Chavín al Tahuantinsuyo', shortName: 'Perú Prehispánico', icon: '🗿', keyword: 'chavín' },
    { title: 'Invasión, Virreinato e Independencia del Perú', shortName: 'Virreinato e Indep.', icon: '👑', keyword: 'virreinato' },
    { title: 'La República del Perú: Prosperidad Falaz a la Actualidad', shortName: 'República del Perú', icon: '🇵🇪', keyword: 'república' },
    { type: 'trophy', title: 'Desafío Histórico Supremo UNSA', shortName: 'Trofeo Historia', icon: '🏆', keyword: 'historia' }
  ],

  'Inglés': [
    { title: 'Personal Information, Pronouns & Verb To Be', shortName: 'Verb To Be & Info', icon: '🇬🇧', keyword: 'verb' },
    { title: 'Daily Routines and Free Time Activities (Present Simple)', shortName: 'Daily Routines', icon: '⏰', keyword: 'routine' },
    { title: 'Family Members, Relationships and Possessives', shortName: 'Family & Relations', icon: '👨‍👩‍👧', keyword: 'family' },
    { type: 'chest', title: 'Oxford Booster Chest', shortName: 'Cofre Inglés', xp: 50, icon: '🎁' },
    { title: 'House, City Places and Prepositions of Location', shortName: 'House & Places', icon: '🏙️', keyword: 'place' },
    { title: 'Food, Quantities, Countable & Uncountable Nouns', shortName: 'Food & Quantities', icon: '🍎', keyword: 'food' },
    { title: 'Past Experiences: Simple Past Regular & Irregular', shortName: 'Past Experiences', icon: '📜', keyword: 'past' },
    { type: 'chest', title: 'Cambridge Grammar Crystal', shortName: 'Cofre Cambridge', xp: 50, icon: '🎁' },
    { title: 'Future Plans: Be Going To, Will & Predictions', shortName: 'Future Plans', icon: '🚀', keyword: 'future' },
    { title: 'Health, Illnesses and Modal Recommendations (Should)', shortName: 'Health & Advice', icon: '💊', keyword: 'health' },
    { title: 'Descriptions, Comparative and Superlative Forms', shortName: 'Comparisons', icon: '📏', keyword: 'comparative' },
    { title: 'Reading Comprehension & Admission Grammar Review', shortName: 'Reading Passages', icon: '📖', keyword: 'reading' },
    { type: 'trophy', title: 'UNSA English Master Trophy', shortName: 'Trofeo Inglés', icon: '🏆', keyword: 'english' }
  ],

  'Lenguaje': [
    { title: 'El Lenguaje: Concepto, Propiedades y Funciones', shortName: 'El Lenguaje', icon: '🗣️', keyword: 'lenguaje' },
    { title: 'La Comunicación: Proceso, Elementos y Ruido', shortName: 'La Comunicación', icon: '📡', keyword: 'comunicación' },
    { title: 'Realidad Lingüística del Perú: Multilingüismo y Variedades', shortName: 'Realidad Lingüística', icon: '🇵🇪', keyword: 'lengua' },
    { type: 'chest', title: 'Cofre Gramatical de Oro', shortName: 'Cofre Letras', xp: 50, icon: '🎁' },
    { title: 'Fonética y Fonología: Aparato Fonador y Grafías', shortName: 'Fonética/Fonología', icon: '🔊', keyword: 'fonema' },
    { title: 'Acentuación General, Tildación Diacrítica y Especial', shortName: 'El Acento y Tildes', icon: '🔤', keyword: 'acento' },
    { title: 'Uso Normativo de Mayúsculas, Minúsculas y Puntuación', shortName: 'Mayúsculas y Signos', icon: '✍️', keyword: 'mayúscula' },
    { type: 'chest', title: 'Cofre de la RAE y Ortografía', shortName: 'Cofre RAE', xp: 50, icon: '🎁' },
    { title: 'Morfología: Estructura y Formación de Palabras', shortName: 'Morfología', icon: '🧩', keyword: 'morfema' },
    { title: 'Categorías Gramaticales: Sustantivo, Adjetivo y Verbo', shortName: 'Categorías Gramat.', icon: '📝', keyword: 'sustantivo' },
    { title: 'Sintaxis: Oración Simple, Sujeto y Predicado', shortName: 'Sintaxis Oracional', icon: '🔍', keyword: 'oración' },
    { type: 'trophy', title: 'Desafío Lingüístico Supremo UNSA', shortName: 'Trofeo Lenguaje', icon: '🏆', keyword: 'lenguaje' }
  ],

  'Literatura': [
    { title: 'Conceptos Fundamentales de la Literatura y Géneros', shortName: 'Conceptos y Géneros', icon: '🎭', keyword: 'género' },
    { title: 'Literatura Clásica Griega: La Ilíada y Tragedia', shortName: 'Clásica Griega', icon: '⚔️', keyword: 'ilíada' },
    { title: 'Literatura Medieval: El Cantar de mio Cid', shortName: 'Mio Cid', icon: '🛡️', keyword: 'cid' },
    { title: 'Literatura Moderna: Siglo de Oro Español', shortName: 'Literatura Moderna', icon: '🏰', keyword: 'renacimiento' },
    { type: 'chest', title: 'Manuscrito de Oro Literario', shortName: 'Cofre Clásico', xp: 50, icon: '🎁' },
    { title: 'Literatura Contemporánea: La Metamorfosis (Kafka)', shortName: 'Kafka: Metamorfosis', icon: '🪲', keyword: 'kafka' },
    { title: 'Novela Moderna: Don Quijote de la Mancha (Cervantes)', shortName: 'El Quijote', icon: '🐴', keyword: 'quijote' },
    { title: 'Narrativa Hispanoamericana del Siglo XX', shortName: 'Hispanoamericana XX', icon: '🌎', keyword: 'narrativa' },
    { title: 'Ficciones: El Laberinto de Jorge Luis Borges', shortName: 'Borges: Ficciones', icon: '🌌', keyword: 'borges' },
    { type: 'chest', title: 'Cofre de las Bellas Letras', shortName: 'Cofre Letras', xp: 50, icon: '🎁' },
    { title: 'Literatura Peruana Costumbrista: Ña Catita (Segura)', shortName: 'Segura: Ña Catita', icon: '👵', keyword: 'segura' },
    { title: 'Literatura Peruana Romántica: Tradiciones Peruanas (Palma)', shortName: 'Palma: Tradiciones', icon: '📜', keyword: 'palma' },
    { title: 'Realismo Peruano: Discurso en el Politeama (Prada)', shortName: 'González Prada', icon: '🔥', keyword: 'prada' },
    { title: 'Posmodernismo Peruano: El Caballero Carmelo (Valdelomar)', shortName: 'Valdelomar: Carmelo', icon: '🐓', keyword: 'valdelomar' },
    { title: 'Indigenismo Peruano: Aves sin nido (Matto de Turner)', shortName: 'Aves sin nido', icon: '🕊️', keyword: 'aves' },
    { type: 'chest', title: 'Cofre de la Vanguardia Peruana', shortName: 'Cofre Vanguardia', xp: 50, icon: '🎁' },
    { title: 'Vanguardismo Peruano: Los heraldos negros y Trilce (Vallejo)', shortName: 'Vallejo: Trilce', icon: '🖋️', keyword: 'vallejo' },
    { title: 'Neoindigenismo: Los ríos profundos (Arguedas)', shortName: 'Arguedas: Ríos', icon: '🌊', keyword: 'arguedas' },
    { title: 'Generación del 50: Los gallinazos sin plumas (Ribeyro)', shortName: 'Ribeyro: Gallinazos', icon: '🏙️', keyword: 'ribeyro' },
    { title: 'El Boom: La ciudad y los perros (Vargas Llosa)', shortName: 'Vargas Llosa: Perros', icon: '🎖️', keyword: 'llosa' },
    { title: 'Novela Total: Conversación en La Catedral (Vargas Llosa)', shortName: 'Conversación Catedral', icon: '🏛️', keyword: 'catedral' },
    { title: 'Literatura Regional Arequipeña: Los inocentes (Reynoso)', shortName: 'Reynoso: Inocentes', icon: '🌋', keyword: 'reynoso' },
    { type: 'trophy', title: 'Gran Desafío Literario Supremo UNSA', shortName: 'Trofeo Literatura', icon: '🏆', keyword: 'literatura' }
  ],

  'Matemática': [
    { title: 'Álgebra: Potenciación, Radicación y Leyes de Exponentes', shortName: 'Leyes Exponentes', icon: '⚡', keyword: 'exponente' },
    { title: 'Ecuaciones e Inecuaciones Lineales y Cuadráticas', shortName: 'Ecuaciones/Inecuac.', icon: '📐', keyword: 'ecuación' },
    { title: 'Aritmética como Conocimiento: Razones y Proporciones', shortName: 'Aritmética/Razones', icon: '🔢', keyword: 'razón' },
    { type: 'chest', title: 'Cofre de Bonificación Matemática', shortName: 'Cofre Matemático', xp: 50, icon: '🎁' },
    { title: 'Geometría Plana: Triángulos, Polígonos y Áreas', shortName: 'Geometría Plana', icon: '🔺', keyword: 'triángulo' },
    { title: 'Trigonometría: Razones Trigonométricas y Ángulos', shortName: 'Trigonometría', icon: '📐', keyword: 'seno' },
    { title: 'Aritmética y Álgebra: Interés Simple y Relaciones Binarias', shortName: 'Interés y Relaciones', icon: '📊', keyword: 'interés' },
    { title: 'Geometría del Espacio: Cuerpos Sólidos y Prismas', shortName: 'Geometría Espacio', icon: '🧊', keyword: 'espacio' },
    { type: 'chest', title: 'Cofre de Euclides y Gauss', shortName: 'Cofre Euclides', xp: 50, icon: '🎁' },
    { title: 'Funciones Especiales, Dominio, Rango y Logaritmos', shortName: 'Funciones y Log.', icon: '📈', keyword: 'función' },
    { title: 'Geometría Analítica: Ecuación de la Recta y Circunferencia', shortName: 'Geometría Analítica', icon: '🎯', keyword: 'recta' },
    { title: 'Estadística Descriptiva y Probabilidades de Eventos', shortName: 'Estadística y Prob.', icon: '🎲', keyword: 'probabilidad' },
    { type: 'trophy', title: 'Desafío Matemático Supremo UNSA', shortName: 'Trofeo Matemática', icon: '🏆', keyword: 'matemática' }
  ],

  'Psicología': [
    { title: 'La Psicología como Ciencia, Objeto y Métodos', shortName: 'Psicología Ciencia', icon: '🧠', keyword: 'psicología' },
    { title: 'Proyecto de Vida, Orientación y Vocación', shortName: 'Proyecto de Vida', icon: '🎯', keyword: 'proyecto' },
    { title: 'Bases Biológicas del Comportamiento: Cerebro y SN', shortName: 'Bases Biológicas', icon: '⚡', keyword: 'nervioso' },
    { type: 'chest', title: 'Cofre Cognitivo UNSA', shortName: 'Cofre Mente', xp: 50, icon: '🎁' },
    { title: 'Hábitos de Estudio y Gestión del Tiempo Efectivo', shortName: 'Hábitos de Estudio', icon: '⏱️', keyword: 'hábito' },
    { title: 'Motivación y Afectividad Humana: Pasiones y Emociones', shortName: 'Motivación/Afecto', icon: '❤️', keyword: 'afectividad' },
    { title: 'Teorías de la Personalidad y Rasgos Individuales', shortName: 'Personalidad', icon: '🎭', keyword: 'personalidad' },
    { type: 'chest', title: 'Cofre de la Inteligencia Emocional', shortName: 'Cofre Inteligencia', xp: 50, icon: '🎁' },
    { title: 'El Aprendizaje: Condicionamiento Clásico y Operante', shortName: 'Aprendizaje', icon: '💡', keyword: 'aprendizaje' },
    { title: 'Procesos Psicológicos Básicos y Superiores (Memoria/Atención)', shortName: 'Procesos Mentales', icon: '💾', keyword: 'memoria' },
    { title: 'Factores de Protección, Resiliencia y Autoestima', shortName: 'Resiliencia/Protec.', icon: '🛡️', keyword: 'protección' },
    { title: 'Conductas de Riesgo en la Etapa Juvenil', shortName: 'Conductas Riesgo', icon: '⚠️', keyword: 'riesgo' },
    { title: 'Búsqueda de Identidad, Autoconcepto y Socialización', shortName: 'Identidad y Género', icon: '🪞', keyword: 'identidad' },
    { title: 'Crecimiento, Maduración y Desarrollo Humano Integral', shortName: 'Desarrollo Humano', icon: '🌱', keyword: 'desarrollo' },
    { type: 'trophy', title: 'Desafío Psicológico Supremo UNSA', shortName: 'Trofeo Psicología', icon: '🏆', keyword: 'psicología' }
  ],

  'Química': [
    { title: 'La Química como Ciencia, Ramas y Sistema Internacional (SI)', shortName: 'Química y Unidades', icon: '🧪', keyword: 'química' },
    { title: 'Materia: Clasificación, Estados y Fenómenos Físico-Químicos', shortName: 'Materia y Cambios', icon: '❄️', keyword: 'materia' },
    { title: 'Estructura Atómica, Modelos y Especies Núclidas', shortName: 'Átomo y Modelos', icon: '⚛️', keyword: 'atómica' },
    { type: 'chest', title: 'Cofre de Laboratorio Químico', shortName: 'Cofre Químico', xp: 50, icon: '🎁' },
    { title: 'Estructura Electrónica y Tabla Periódica Moderna', shortName: 'Tabla Periódica', icon: '📑', keyword: 'periódica' },
    { title: 'Enlace Químico: Iónico, Covalente y Fuerzas Intermoleculares', shortName: 'Enlace Químico', icon: '🔗', keyword: 'enlace' },
    { title: 'Nomenclatura Inorgánica: Óxidos, Hidróxidos y Ácidos', shortName: 'Nomenclatura', icon: '🏷️', keyword: 'óxido' },
    { type: 'chest', title: 'Cofre de Estequiometría y Masa', shortName: 'Cofre Masa', xp: 50, icon: '🎁' },
    { title: 'Reacciones Químicas y Cálculos Estequiométricos', shortName: 'Reacciones y Moles', icon: '💥', keyword: 'estequiometría' },
    { title: 'Estado Gaseoso: Leyes de los Gases Ideales', shortName: 'Leyes de Gases', icon: '💨', keyword: 'gas' },
    { title: 'Sistemas Dispersos: Soluciones, Unidades Físicas y Químicas', shortName: 'Soluciones', icon: '🧪', keyword: 'solución' },
    { title: 'Química Orgánica: Átomo de Carbono e Hidrocarburos', shortName: 'Química Orgánica', icon: '⛽', keyword: 'orgánica' },
    { type: 'trophy', title: 'Desafío Químico Supremo UNSA', shortName: 'Trofeo Química', icon: '🏆', keyword: 'química' }
  ],

  'Raz. Lógico': [
    { title: 'Proposiciones y Enunciados: Principios Lógicos Supremos', shortName: 'Proposiciones', icon: '🧩', keyword: 'proposición' },
    { title: 'Formalización de Proposiciones y Conectores Lógicos', shortName: 'Formalización', icon: '🔣', keyword: 'formalización' },
    { title: 'Tablas de Verdad y Equivalencias Lógicas (De Morgan)', shortName: 'Tablas y De Morgan', icon: '📊', keyword: 'morgan' },
    { type: 'chest', title: 'Cofre de Lógica Pura', shortName: 'Cofre Lógico', xp: 50, icon: '🎁' },
    { title: 'Inferencias Lógicas, Modus Ponens y Tollens', shortName: 'Inferencias', icon: '🎯', keyword: 'inferencia' },
    { title: 'Silogismos Categóricos y Razonamiento Deductivo', shortName: 'Silogismos', icon: '🏛️', keyword: 'silogismo' },
    { title: 'Circuitos Lógicos de Conmutadores y Compuertas', shortName: 'Circuitos Lógicos', icon: '🔌', keyword: 'circuito' },
    { title: 'Falacias Lógicas Formales y No Formales', shortName: 'Falacias Lógicas', icon: '🚫', keyword: 'falacia' },
    { type: 'trophy', title: 'Desafío de Lógica Simbólica UNSA', shortName: 'Trofeo Lógica', icon: '🏆', keyword: 'lógica' }
  ],

  'Raz. Matemático': [
    { title: 'Sucesiones Numéricas, Alfanuméricas y Especiales', shortName: 'Sucesiones', icon: '🔢', keyword: 'sucesión' },
    { title: 'Progresiones Aritméticas y Geométricas', shortName: 'Progresiones', icon: '📈', keyword: 'progresión' },
    { title: 'Proporcionalidad, Razones y Magnitudes', shortName: 'Proporcionalidad', icon: '⚖️', keyword: 'proporcional' },
    { type: 'chest', title: 'Cofre Numérico UNSA', shortName: 'Cofre Números', xp: 50, icon: '🎁' },
    { title: 'Porcentajes, Aumentos, Descuentos y Aplicaciones Comerciales', shortName: 'Porcentajes', icon: '🏷️', keyword: 'porcentaje' },
    { title: 'Planteo y Solución de Ecuaciones Clásicas', shortName: 'Planteo Ecuaciones', icon: '📝', keyword: 'ecuación' },
    { title: 'Problemas de Edades y Cuadros Temporales', shortName: 'Problemas de Edades', icon: '⏳', keyword: 'edad' },
    { type: 'chest', title: 'Cofre de Desafíos Métricos', shortName: 'Cofre Métrico', xp: 50, icon: '🎁' },
    { title: 'Razonamiento Geométrico: Perímetros y Áreas de Regiones', shortName: 'Perímetros y Áreas', icon: '📐', keyword: 'área' },
    { title: 'Factoriales, Conteo de Rutas y Figuras 3D', shortName: 'Rutas y Conteo 3D', icon: '🧭', keyword: 'conteo' },
    { title: 'Análisis Combinatorio y Permutaciones Lineales', shortName: 'Combinatoria', icon: '🎲', keyword: 'permutación' },
    { title: 'Probabilidades y Estadística: Mediana y Moda', shortName: 'Probabilidades/Moda', icon: '📊', keyword: 'mediana' },
    { type: 'trophy', title: 'Desafío de Razonamiento Matemático UNSA', shortName: 'Trofeo Raz. Mat.', icon: '🏆', keyword: 'matemático' }
  ],

  'Raz. Verbal': [
    { title: 'Relaciones Semánticas: Sinonimia Contextual', shortName: 'Sinonimia Context.', icon: '📖', keyword: 'sinónim' },
    { title: 'Antonimia Contextual y Adecuación Léxica', shortName: 'Antonimia Context.', icon: '↔️', keyword: 'antónim' },
    { title: 'Polisemia y Ambigüedades Semánticas', shortName: 'Polisemia Léxica', icon: '🪞', keyword: 'polisemia' },
    { type: 'chest', title: 'Cofre de Léxico Avanzado', shortName: 'Cofre Léxico', xp: 50, icon: '🎁' },
    { title: 'Analogías Verbales y Pares de Relación', shortName: 'Analogías Verbales', icon: '🔗', keyword: 'analogía' },
    { title: 'Series y Clasificaciones Verbales', shortName: 'Series Verbales', icon: '📑', keyword: 'serie' },
    { title: 'Lógica de Enunciados: Enunciados Incompletos', shortName: 'Enunciados Incomp.', icon: '✏️', keyword: 'incompleto' },
    { type: 'chest', title: 'Cofre del Discurso Crítico', shortName: 'Cofre Discurso', xp: 50, icon: '🎁' },
    { title: 'Reordenamiento Textual y Contradicciones', shortName: 'Reordenamiento', icon: '🪢', keyword: 'ordenamiento' },
    { title: 'Pragmática en Enunciados y Registro Discursivo', shortName: 'Pragmática', icon: '🗣️', keyword: 'pragmática' },
    { title: 'Comprensión Lectora: Nivel Literal e Inferencial', shortName: 'Comprensión Literal', icon: '🔍', keyword: 'lectura' },
    { title: 'Intención del Autor, Coherencia y Tipos de Textos', shortName: 'Intención y Tipología', icon: '📑', keyword: 'texto' },
    { type: 'trophy', title: 'Desafío Verbal Supremo UNSA', shortName: 'Trofeo Verbal', icon: '🏆', keyword: 'verbal' }
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
  const officialSub = CEPREUNSA_OFFICIAL_THEORY[subjectId] || CEPREUNSA_OFFICIAL_THEORY['Filosofía'];
  const roadmapList = SUBJECT_ROADMAP[subjectId] || SUBJECT_ROADMAP['Filosofía'] || [];
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
        body: `El temario oficial de ${subjectId} para el examen de admisión evalúa principios, leyes y casos aplicativos. Domina los conceptos clave de este capítulo para responder con máxima precisión.`
      }
    ],
    takeaway: `El dominio de "${shortName}" en ${subjectId} garantiza aciertos decisivos en el examen de admisión.`
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

  const isDrawSubject = subjectId === 'Física' || subjectId === 'Matemática' || subjectId === 'Álgebra' || subjectId === 'Raz. Matemático' || subjectId === 'Química';
  const paperHint = isDrawSubject
    ? '✏️ Consejo Rastro: Traza el planteamiento o diagrama en tu borrador antes de marcar tu respuesta.'
    : null;

  // Reto 1: Caso particular oficial del solucionario CEPREUNSA
  const challenge1 = {
    id: `${selectedQuestion.id}_c1`,
    type: 'multiple_choice',
    pedagogicalTier: '🎯 Deducción de Caso Particular • Examen Real UNSA',
    instruction: 'Aplica el principio teórico estudiado para deducir la respuesta correcta en este caso oficial:',
    question: selectedQuestion.q,
    options: selectedQuestion.options || [],
    correctIndex: selectedQuestion.answer,
    explanation: selectedQuestion.explanation || 'Respuesta oficial contrastada con el temario CEPREUNSA.',
    paperHint,
    xpReward: 25
  };

  // Reto 2: Segunda pregunta de banco o reto complementario
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
// Si no se especifica limit, carga el 100% de los capítulos del temario oficial de esa materia
export async function getLessonsForSubject(subjectId, limit = null) {
  const normSub = normalizeSubject(subjectId);
  const roadmapList = SUBJECT_ROADMAP[subjectId] || SUBJECT_ROADMAP['Filosofía'] || [];
  const targetCount = limit !== null ? limit : (roadmapList.length || 8);

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
    for (let i = 0; i < targetCount; i++) {
      generated.push(buildLessonWithRichTheory(subjectId, 1, filtered, i, usedQuestionIds));
    }
    return generated;
  } catch (error) {
    console.warn('Error al cargar banco:', error);
    const fallbackList = [];
    const usedQuestionIds = new Set();
    for (let i = 0; i < targetCount; i++) {
      fallbackList.push(buildLessonWithRichTheory(subjectId, 1, [], i, usedQuestionIds));
    }
    return fallbackList;
  }
}
