// =============================================================================
// ORSTTY SEARCH INDEXER & UNIVERSAL ENGINE
// Superbuscador inteligente de RASTRO / RUMBO:
// - Normalización con tolerancia a typos, faltas de ortografía y fonética
// - Diccionario exhaustivo de alias y equivalencias reales (sin invención)
// - Jerarquía: Materia -> Curso -> Tema -> Academia -> Ciclo -> Semana -> Tipo de recurso
// - Reconocimiento de Temas y Literatura (obras, autores y relación con temario)
// - Temario y Matriz de Evaluación oficial UNSA (datos reales de simuladorData.js)
// - Distinción estricta de tipo de recurso (material vs video vs examen vs libro)
// - Desambiguación inteligente y ranking de relevancia
// =============================================================================

import { 
  COURSES, 
  BRICENO_2027, 
  BRICENO_AREAS, 
  KELSEN_VIDEOS, 
  TOMOS, 
  PRACTICAS 
} from '../../data/legacyData.js';
import { 
  datosSimulador, 
  DEFAULT_EXAM_QUESTIONS, 
  DEFAULT_FLASHCARDS 
} from '../../data/simuladorData.js';
import { db } from '../../lib/firebase.js';
import { collection, query, limit, where, getDocs } from 'firebase/firestore';

// -----------------------------------------------------------------------------
// 1. NORMALIZADOR Y TOLERANCIA A TYPOS / FONÉTICA
// -----------------------------------------------------------------------------

const TILDES_MAP = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u',
  à: 'a', è: 'e', ì: 'i', ò: 'o', ù: 'u',
  ñ: 'n'
};

/**
 * Normaliza texto eliminando acentos, caracteres especiales y dobles espacios.
 */
export function normalizeBase(text = '') {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[áéíóúüàèìòùñ]/g, c => TILDES_MAP[c] || c)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcula la distancia de Levenshtein entre dos cadenas para tolerancia a typos.
 */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = [];
  for (let i = 0; i <= b.length; i++) row[i] = i;

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      let val;
      if (a[i - 1] === b[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

/**
 * Verifica si un token coincide con una palabra objetivo admitiendo typos menores (1-2 caracteres).
 */
export function isFuzzyMatch(token, target) {
  if (token === target) return true;
  if (target.length >= 4 && token.startsWith(target)) return true;
  if (token.length >= 4 && target.startsWith(token)) return true;
  
  // Para palabras cortas (3-4 letras), admitir max 1 diferencia
  if (target.length >= 4 && target.length <= 5) {
    return levenshteinDistance(token, target) <= 1;
  }
  // Para palabras de 6 o más letras, admitir hasta 2 diferencias
  if (target.length >= 6) {
    return levenshteinDistance(token, target) <= 2;
  }
  return false;
}

// -----------------------------------------------------------------------------
// 2. DICCIONARIO REAL DE EQUIVALENCIAS Y ALIAS (Materias, Academias, Tipos)
// -----------------------------------------------------------------------------

export const CANONICAL_MATERIAS = {
  RAZONAMIENTO_MATEMATICO: {
    name: 'Razonamiento Matemático',
    slug: 'razonamiento-matematico',
    icon: '🧮',
    aliases: [
      'razonamiento matematico', 'raz matematico', 'raz mat', 'razonamiento mat', 
      'razonamiento matematica', 'rm', 'razonamiento-matematico'
    ]
  },
  RAZONAMIENTO_VERBAL: {
    name: 'Razonamiento Verbal',
    slug: 'razonamiento-verbal',
    icon: '📖',
    aliases: [
      'razonamiento verbal', 'raz verbal', 'raz verb', 'razonamiento verb', 'rv', 'razonamiento-verbal'
    ]
  },
  RAZONAMIENTO_LOGICO: {
    name: 'Razonamiento Lógico',
    slug: 'razonamiento-logico',
    icon: '🧩',
    aliases: [
      'razonamiento logico', 'raz logico', 'rl', 'razonamiento-logico'
    ]
  },
  COMPRENSION_LECTORA: {
    name: 'Comprensión Lectora',
    slug: 'comprension-lectora',
    icon: '📚',
    aliases: [
      'comprension lectora', 'comp lectora', 'comprension', 'lectura critica', 'comprension-lectora'
    ]
  },
  ALGEBRA: {
    name: 'Álgebra',
    slug: 'algebra',
    icon: '🔢',
    aliases: ['algebra', 'algebr', 'aljebra', 'aljebr']
  },
  ARITMETICA: {
    name: 'Aritmética',
    slug: 'aritmetica',
    icon: '➕',
    aliases: ['aritmetica', 'arit', 'arimtetica', 'aritmetik']
  },
  GEOMETRIA: {
    name: 'Geometría',
    slug: 'geometria',
    icon: '📏',
    aliases: ['geometria', 'geom', 'geometrik', 'geometria plana']
  },
  TRIGONOMETRIA: {
    name: 'Trigonometría',
    slug: 'trigonometria',
    icon: '📊',
    aliases: ['trigonometria', 'trigo', 'trig']
  },
  MATEMATICA: {
    name: 'Matemática',
    slug: 'matematica-1',
    icon: '📐',
    aliases: [
      'matematica', 'matematicas', 'mate', 'mates', 'amtematica', 'amtematicas',
      'matematica 1', 'matematica 2', 'matematica-1', 'matematica-2'
    ]
  },
  BIOLOGIA: {
    name: 'Biología',
    slug: 'biologia',
    icon: '🧬',
    aliases: ['biologia', 'bio', 'biol', 'ciencias biologicas']
  },
  ANATOMIA: {
    name: 'Anatomía',
    slug: 'anatomia',
    icon: '🫀',
    aliases: ['anatomia', 'anat', 'anatomia humana']
  },
  QUIMICA: {
    name: 'Química',
    slug: 'quimica',
    icon: '⚗️',
    aliases: ['quimica', 'quim', 'qui', 'quimi', 'quimica 1', 'quimica 2']
  },
  FISICA: {
    name: 'Física',
    slug: 'fisica',
    icon: '⚡',
    aliases: ['fisica', 'fis', 'fisic', 'fisica 1', 'fisica 2']
  },
  LENGUAJE: {
    name: 'Lenguaje',
    slug: 'lenguaje',
    icon: '✍️',
    aliases: ['lenguaje', 'lengua', 'comunicacion', 'gramatica']
  },
  LITERATURA: {
    name: 'Literatura',
    slug: 'literatura',
    icon: '📜',
    aliases: ['literatura', 'lit', 'lite', 'letras']
  },
  HISTORIA: {
    name: 'Historia',
    slug: 'historia',
    icon: '🏛️',
    aliases: [
      'historia', 'hist', 'historia del peru', 'hp', 'historia universal', 'hu'
    ]
  },
  GEOGRAFIA: {
    name: 'Geografía',
    slug: 'geografia',
    icon: '🌍',
    aliases: ['geografia', 'geo', 'geografia del peru']
  },
  FILOSOFIA: {
    name: 'Filosofía',
    slug: 'filosofia',
    icon: '🤔',
    aliases: ['filosofia', 'filo', 'filosofik']
  },
  PSICOLOGIA: {
    name: 'Psicología',
    slug: 'psicologia',
    icon: '🧠',
    aliases: ['psicologia', 'psico', 'psikologia']
  },
  CIVICA: {
    name: 'Educación Cívica',
    slug: 'civica',
    icon: '⚖️',
    aliases: ['civica', 'ed civica', 'educacion civica', 'ciudadania', 'constitucion']
  },
  ECONOMIA: {
    name: 'Economía',
    slug: 'economia',
    icon: '💰',
    aliases: ['economia', 'eco']
  },
  INGLES: {
    name: 'Inglés',
    slug: 'ingles',
    icon: '🌐',
    aliases: ['ingles', 'english', 'idioma extranjero']
  }
};

export const CANONICAL_ACADEMIAS = {
  BRICENO: {
    name: 'Academia Briceño',
    cycle: 'Ciclo 2027',
    path: '/cursos/briceno',
    aliases: ['briceno', 'briceno 2027', 'academia briceno', 'briceno 27', 'briceno virtual', 'brciceño', 'brciceno', 'bricenio', 'brice', 'bricennio', 'ebrciceño', 'ebrciceno']
  },
  ESPARTA: {
    name: 'Academia Esparta',
    cycle: '18 Materias',
    path: '/cursos/esparta',
    aliases: ['esparta', 'academia esparta', 'esparta preu', 'esparata', 'eparat', 'eeparat', 'espartan', 'eeparta']
  },
  KELSEN: {
    name: 'Academia Kelsen',
    cycle: 'Grabaciones Oficiales',
    path: '/cursos/kelsen',
    aliases: ['kelsen', 'academia kelsen', 'kelsen grabaciones', 'kelse', 'kels']
  }
};

export const RESOURCE_TYPES = {
  VIDEO: ['video', 'videos', 'clase', 'clases', 'grabacion', 'grabaciones', 'yt', 'youtube'],
  MATERIAL: ['material', 'materiales', 'pdf', 'pdfs', 'separata', 'separatas', 'apunte', 'apuntes', 'resumen', 'resumenes', 'guia', 'guias'],
  LIBRO: ['libro', 'libros', 'tomo', 'tomos', 'compendio', 'compendios'],
  EXAMEN: ['examen', 'examenes', 'simulacro', 'simulacros', 'practica', 'practicas', 'banco', 'bancos', 'preguntas'],
  TEMARIO: ['temario', 'temas', 'que entra', 'que viene', 'contenido', 'syllabus', 'silabo'],
  MATRIZ: ['matriz', 'ponderacion', 'ponderaciones', 'cuanto vale', 'peso', 'puntaje', 'estructura examen']
};

// -----------------------------------------------------------------------------
// 3. BASE DE DATOS DE LITERATURA PREUNIVERSITARIA (UNSA / CEPREUNSA)
// -----------------------------------------------------------------------------

export const LITERATURA_DATABASE = [
  {
    obra: 'Las cuitas del joven Werther',
    autor: 'Johann Wolfgang von Goethe',
    aliases: ['werther', 'werter', 'el joven werther', 'las cuitas de werther', 'goethe'],
    genero: 'Narrativo (Novela epistolar)',
    corriente: 'Prerromanticismo (Sturm und Drang)',
    materia: 'LITERATURA',
    resumen: 'Novela epistolar donde Werther expresa su amor apasionado e imposible por Lotte (Carlota), prometida de Albert. Ante el dolor desgarrador y la imposibilidad de consumar su amor, Werther decide suicidarse.',
    temasClave: ['El amor no correspondido', 'El conflicto entre la pasión y las normas sociales', 'La naturaleza como reflejo del alma'],
    relevanciaExamen: 'Clásico recurrente en preguntas de literatura universal sobre el Sturm und Drang y el Romanticismo alemán.'
  },
  {
    obra: 'La Ilíada',
    autor: 'Homero',
    aliases: ['la iliada', 'iliada', 'homero iliada', 'aquiles'],
    genero: 'Épico (Epopeya)',
    corriente: 'Clasicismo Griego',
    materia: 'LITERATURA',
    resumen: 'Canto épico sobre la cólera de Aquiles durante el último año de la Guerra de Troya. Inicia con el agravio de Agamenón a Aquiles y concluye con los funerales de Héctor tras la venganza por la muerte de Patroclo.',
    temasClave: ['La cólera de Aquiles', 'El destino (Hado)', 'El honor bélico y la mortalidad'],
    relevanciaExamen: 'Tema fundamental de literatura universal en el temario UNSA.'
  },
  {
    obra: 'La Odisea',
    autor: 'Homero',
    aliases: ['la odisea', 'odisea', 'ulises', 'odiseo'],
    genero: 'Épico (Epopeya)',
    corriente: 'Clasicismo Griego',
    materia: 'LITERATURA',
    resumen: 'Relata el accidentado regreso de Odiseo (Ulises) a su patria Ítaca tras diez años de guerra en Troya, superando pruebas de monstruos y dioses, mientras Penélope y Telémaco resisten el asedio de los pretendientes.',
    temasClave: ['La astucia sobre la fuerza bruta', 'La fidelidad conyugal', 'La nostalgia por la patria'],
    relevanciaExamen: 'Frecuente en preguntas sobre figuras épicas y estructura de cantos homéricos.'
  },
  {
    obra: 'Crimen y castigo',
    autor: 'Fiódor Dostoievski',
    aliases: ['crimen y castigo', 'dostoievski', 'dostoievsky', 'raskolnikov'],
    genero: 'Narrativo (Novela psicológica)',
    corriente: 'Realismo Ruso',
    materia: 'LITERATURA',
    resumen: 'Rodión Raskólnikov asesina a una vieja usurera creyéndose un "hombre extraordinario" por encima de la moral. Atormentado por la culpa psicológica y guiado por Sonia Marmeládova, termina confesando y buscando la redención en Siberia.',
    temasClave: ['La culpa y redención moral', 'La teoría del superhombre y su caída', 'El sacrificio cristiano'],
    relevanciaExamen: 'Obra cumbre del Realismo en los balotarios de admisión.'
  },
  {
    obra: 'Trilce',
    autor: 'César Vallejo',
    aliases: ['trilce', 'vallejo trilce', 'cesar vallejo'],
    genero: 'Lírico (Poemario)',
    corriente: 'Vanguardismo Peruano (1922)',
    materia: 'LITERATURA',
    resumen: 'Poemario vanguardista revolucionario donde Vallejo quiebra la sintaxis castellana tradicional, inventa palabras y profundiza en la soledad, el dolor humano, el presidio y la orfandad.',
    temasClave: ['La ruptura lingüística', 'El dolor y la cárcel', 'La madre ausente'],
    relevanciaExamen: 'Pregunta fija de literatura peruana contemporánea.'
  },
  {
    obra: 'Los heraldos negros',
    autor: 'César Vallejo',
    aliases: ['los heraldos negros', 'heraldos negros', 'hay golpes en la vida tan fuertes'],
    genero: 'Lírico (Poemario)',
    corriente: 'Modernismo / Posmodernismo (1918)',
    materia: 'LITERATURA',
    resumen: 'Poemario de transición donde se combinan influencias modernistas con el dolor andino y la angustia existencial. Comienza con el célebre verso "Hay golpes en la vida, tan fuertes... ¡Yo no sé!".',
    temasClave: ['El dolor humano', 'La duda sobre la justicia divina', 'El hogar andino'],
    relevanciaExamen: 'Frecuente en identificación de versos y corrientes de Vallejo.'
  },
  {
    obra: 'La ciudad y los perros',
    autor: 'Mario Vargas Llosa',
    aliases: ['la ciudad y los perros', 'vargas llosa', 'el jaguar', 'el esclavo', 'el poeta'],
    genero: 'Narrativo (Novela)',
    corriente: 'Boom Latinoamericano (1963)',
    materia: 'LITERATURA',
    resumen: 'Ambientada en el Colegio Militar Leoncio Prado, explora la violencia, la disciplina asfixiante y la hipocresía social a través de cadetes como el Jaguar, el Poeta, el Esclavo y el Círculo.',
    temasClave: ['El machismo y la violencia institucional', 'La pérdida de la inocencia', 'La crítica a la sociedad limeña'],
    relevanciaExamen: 'Imprescindible en preguntas sobre el Boom Latinoamericano y narrativa peruana del siglo XX.'
  },
  {
    obra: 'Edipo Rey',
    autor: 'Sófocles',
    aliases: ['edipo rey', 'edipo', 'sofocles'],
    genero: 'Dramático (Tragedia)',
    corriente: 'Clasicismo Griego',
    materia: 'LITERATURA',
    resumen: 'Edipo, rey de Tebas, investiga la peste que asola la ciudad para descubrir que él mismo, sin saberlo, cumplió el oráculo de matar a su padre Layo y casarse con su madre Yocasta.',
    temasClave: ['El destino inexorable', 'La ceguera física versus la ceguera moral', 'La fragilidad del poder humano'],
    relevanciaExamen: 'Pilar fundamental del teatro clásico griego en el prospecto de admisión.'
  }
];

// -----------------------------------------------------------------------------
// 4. MAPEO DE TEMAS DEL TEMARIO OFICIAL (UNSA)
// -----------------------------------------------------------------------------

export const TEMAS_DATABASE = [
  // Razonamiento Matemático
  { tema: 'Fracciones y Reducción a la unidad', materiaKey: 'RAZONAMIENTO_MATEMATICO', keywords: ['fracciones', 'fraccion', 'fraciones', 'reduccion a la unidad', 'grifos y tanques'] },
  { tema: 'Edades y Móviles', materiaKey: 'RAZONAMIENTO_MATEMATICO', keywords: ['edades', 'moviles', 'velocidad', 'tiempo de encuentro', 'tiempo de alcance'] },
  { tema: 'Operadores Matemáticos', materiaKey: 'RAZONAMIENTO_MATEMATICO', keywords: ['operadores', 'operador matematico', 'tabla de doble entrada'] },
  { tema: 'Cronometría y Campanadas', materiaKey: 'RAZONAMIENTO_MATEMATICO', keywords: ['campanadas', 'cronometria', 'relojes', 'adelantos y atrasos'] },
  { tema: 'Certezas y Principio de Suposición', materiaKey: 'RAZONAMIENTO_MATEMATICO', keywords: ['certezas', 'esferas de colores', 'casos desfavorables'] },
  
  // Álgebra
  { tema: 'Ecuaciones y Sistemas Lineales', materiaKey: 'ALGEBRA', keywords: ['ecuaciones', 'ecuacion', 'sistemas de ecuaciones', 'cramer'] },
  { tema: 'Polinomios y Productos Notables', materiaKey: 'ALGEBRA', keywords: ['polinomios', 'productos notables', 'factorizacion', 'cocientes notables'] },
  { tema: 'Logaritmos y Funciones', materiaKey: 'ALGEBRA', keywords: ['logaritmos', 'logaritmo', 'funciones', 'dominio y rango'] },

  // Aritmética
  { tema: 'Razones y Proporciones', materiaKey: 'ARITMETICA', keywords: ['razones', 'proporciones', 'regla de tres', 'tanto por cuanto', 'porcentajes'] },
  { tema: 'Teoría de Conjuntos y Numeración', materiaKey: 'ARITMETICA', keywords: ['conjuntos', 'cardinal', 'cambio de base', 'numeracion'] },

  // Geometría
  { tema: 'Triángulos y Congruencia', materiaKey: 'GEOMETRIA', keywords: ['triangulos', 'congruencia', 'semejanza', 'pitagoras'] },
  { tema: 'Áreas y Volúmenes de Sólidos', materiaKey: 'GEOMETRIA', keywords: ['areas', 'volumenes', 'geometria del espacio', 'esfera', 'cilindro', 'cono'] },

  // Física
  { tema: 'Cinemática (MRU, MRUV, Caída Libre)', materiaKey: 'FISICA', keywords: ['cinematica', 'mru', 'mruv', 'caida libre', 'movimiento parabolico'] },
  { tema: 'Leyes de Newton y Estática', materiaKey: 'FISICA', keywords: ['leyes de newton', 'newton', 'estatica', 'primera condicion', 'fuerza', 'torque'] },
  { tema: 'Trabajo, Potencia y Energía', materiaKey: 'FISICA', keywords: ['trabajo y energia', 'potencia', 'energia mecanica', 'conservacion de la energia'] },
  { tema: 'Electrostática y Circuitos', materiaKey: 'FISICA', keywords: ['electrostatica', 'ley de coulomb', 'circuitos', 'ley de ohm', 'resistencia'] },

  // Química
  { tema: 'Tabla Periódica y Configuración Electrónica', materiaKey: 'QUIMICA', keywords: ['tabla periodica', 'configuracion electronica', 'numeros cuanticos', 'electronegatividad'] },
  { tema: 'Enlace Químico y Nomenclatura', materiaKey: 'QUIMICA', keywords: ['enlace quimico', 'enlace covalente', 'enlace ionico', 'nomenclatura', 'oxidos', 'acidos'] },
  { tema: 'Estequiometría y Gases Ideales', materiaKey: 'QUIMICA', keywords: ['estequiometria', 'ley de gases', 'reactivo limitante', 'moles', 'masa molar'] },
  { tema: 'Química Orgánica e Hidrocarburos', materiaKey: 'QUIMICA', keywords: ['quimica organica', 'hidrocarburos', 'alcanos', 'alquenos', 'alcoholes'] },

  // Biología
  { tema: 'La Célula y Mitosis / Meiosis', materiaKey: 'BIOLOGIA', keywords: ['la celula', 'celula eucariota', 'mitosis', 'meiosis', 'ciclo celular'] },
  { tema: 'Genética Mendeliana y Ácidos Nucleicos', materiaKey: 'BIOLOGIA', keywords: ['genetica', 'mendel', 'adn', 'arn', 'herencia'] },
  { tema: 'Fotosíntesis y Respiración Celular', materiaKey: 'BIOLOGIA', keywords: ['fotosintesis', 'respiracion celular', 'atp', 'ciclo de krebs'] },
  { tema: 'Ecología y Reinos Biológicos', materiaKey: 'BIOLOGIA', keywords: ['ecologia', 'ecosistema', 'cadena trofica', 'reino animalia', 'reino plantae'] }
];

// -----------------------------------------------------------------------------
// 5. PARSER INTELIGENTE DE ENTIDADES Y FILTROS
// -----------------------------------------------------------------------------

/**
 * Detecta materia canónica evaluando alias directos y tolerancia difusa.
 */
export function detectMateria(text) {
  const norm = normalizeBase(text);
  const tokens = norm.split(' ');

  // 1. Caso RAZONAMIENTO MATEMÁTICO vs MATEMÁTICA: Prioridad absoluta a RM
  for (const alias of CANONICAL_MATERIAS.RAZONAMIENTO_MATEMATICO.aliases) {
    if (alias.length <= 3) {
      if (tokens.includes(alias) || new RegExp(`\\b${alias}\\b`).test(norm)) {
        return 'RAZONAMIENTO_MATEMATICO';
      }
    } else if (norm.includes(alias) || tokens.includes(alias)) {
      return 'RAZONAMIENTO_MATEMATICO';
    }
  }

  // 2. Caso RAZONAMIENTO VERBAL vs LENGUAJE: Prioridad a RV
  for (const alias of CANONICAL_MATERIAS.RAZONAMIENTO_VERBAL.aliases) {
    if (alias.length <= 3) {
      if (tokens.includes(alias) || new RegExp(`\\b${alias}\\b`).test(norm)) {
        return 'RAZONAMIENTO_VERBAL';
      }
    } else if (norm.includes(alias) || tokens.includes(alias)) {
      return 'RAZONAMIENTO_VERBAL';
    }
  }

  // 3. Caso RAZONAMIENTO LÓGICO
  for (const alias of CANONICAL_MATERIAS.RAZONAMIENTO_LOGICO.aliases) {
    if (alias.length <= 3) {
      if (tokens.includes(alias) || new RegExp(`\\b${alias}\\b`).test(norm)) {
        return 'RAZONAMIENTO_LOGICO';
      }
    } else if (norm.includes(alias) || tokens.includes(alias)) {
      return 'RAZONAMIENTO_LOGICO';
    }
  }

  // 4. Buscar coincidencias multipalabra en el resto
  for (const [key, data] of Object.entries(CANONICAL_MATERIAS)) {
    for (const alias of data.aliases) {
      if (alias.includes(' ') && norm.includes(alias)) {
        return key;
      }
    }
  }

  // 5. Coincidencias por tokens con tolerancia a typos
  for (const [key, data] of Object.entries(CANONICAL_MATERIAS)) {
    for (const alias of data.aliases) {
      if (!alias.includes(' ')) {
        for (const tok of tokens) {
          if (alias.length <= 3) {
            if (tok === alias) return key;
          } else if (isFuzzyMatch(tok, alias)) {
            return key;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Detecta si el texto menciona una academia específica con tolerancia a typos.
 */
export function detectAcademia(text) {
  const norm = normalizeBase(text);
  const tokens = norm.split(' ').filter(Boolean);

  // 1. Alias directos
  for (const [key, data] of Object.entries(CANONICAL_ACADEMIAS)) {
    for (const alias of data.aliases) {
      if (norm.includes(alias)) return key;
    }
  }

  // 2. Token match difuso
  for (const tok of tokens) {
    if (tok.length >= 4) {
      if (isFuzzyMatch(tok, 'briceno') || tok.includes('bricen') || tok.includes('brcice')) return 'BRICENO';
      if (isFuzzyMatch(tok, 'esparta') || tok.includes('espart') || tok.includes('eparat')) return 'ESPARTA';
      if (isFuzzyMatch(tok, 'kelsen') || tok.includes('kelse')) return 'KELSEN';
    }
  }

  return null;
}

const WORD_NUMBERS_MAP = {
  cero: 0,
  uno: 1, una: 1, primer: 1, primera: 1, primero: 1,
  dos: 2, segundo: 2, segunda: 2,
  tres: 3, tercer: 3, tercera: 3, tercero: 3,
  cuatro: 4, cuarto: 4, cuarta: 4,
  cinco: 5, quinto: 5, quinta: 5,
  seis: 6, sexto: 6, sexta: 6,
  siete: 7, septimo: 7, septima: 7,
  ocho: 8, octavo: 8, octava: 8,
  nueve: 9, noveno: 9, novena: 9,
  diez: 10, decimo: 10, decima: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16
};

/**
 * Detecta semana numérica o escrita en palabras (ej: "semana 5", "smna dos", "sem 3", "la 2", "s4", "semana tres").
 */
export function detectSemana(text) {
  const norm = normalizeBase(text);

  // 1. Semana con dígitos (ej: "semana 2", "smna 2", "sem 3", "s1", "la 2")
  const digitMatch = norm.match(/\b(?:semanas?|semnas?|smnas?|sem|s|clase|la)\s*(\d{1,2})\b/) || norm.match(/^(\d{1,2})$/);
  if (digitMatch) return parseInt(digitMatch[1], 10);

  // 2. Semana con palabras en español (ej: "semana dos", "smna dos", "sem tres", "semana primera")
  const wordPattern = Object.keys(WORD_NUMBERS_MAP).join('|');
  const wordRegex = new RegExp(`\\b(?:semanas?|semnas?|smnas?|sem|s|clase|la)\\s*(${wordPattern})\\b`);
  const wordMatch = norm.match(wordRegex);
  if (wordMatch && WORD_NUMBERS_MAP[wordMatch[1]] !== undefined) {
    return WORD_NUMBERS_MAP[wordMatch[1]];
  }

  // 3. Palabra aislada
  const isolatedMatch = norm.match(new RegExp(`^(${wordPattern})$`));
  if (isolatedMatch && WORD_NUMBERS_MAP[isolatedMatch[1]] !== undefined) {
    return WORD_NUMBERS_MAP[isolatedMatch[1]];
  }

  return null;
}

/**
 * Detecta si el usuario pregunta por la actualización o estado de una semana o última clase.
 */
export function detectConsultaSemanaActualizacion(text) {
  const norm = normalizeBase(text);
  const patterns = [
    /\b(?:ya salio|ya salieron|salio|subieron|actualizaron|se actualizo|actualizado|esta disponible|hay semana|tienen la semana|llego la semana|cuando sale|ultima semana|ultimas semanas|ultima clase|ultimas clases|lo ultimo subido|lo ultimo)\b/,
    /\b(?:que semanas hay|cuales semanas|que semana va|cuantas semanas)\b/
  ];
  return patterns.some(p => p.test(norm));
}

/**
 * Devuelve el estado real de semanas de las academias en RASTRO.
 */
export function getEstadoSemanas(params = {}) {
  const acad = params.academia || null;
  const sem = params.semana !== null && params.semana !== undefined ? Number(params.semana) : null;

  // Datos reales en RASTRO:
  // - Briceño 2027: Semana 0 (Introducción) y Semana 1 (En curso)
  // - Esparta (COURSES): Semanas 1 a 6 disponibles (18 materias)
  // - Kelsen: Grabaciones oficiales del ciclo intensivo

  if (acad === 'BRICENO') {
    if (sem !== null) {
      if (sem === 0 || sem === 1) {
        return {
          disponible: true,
          academia: 'Academia Briceño',
          semana: sem,
          mensaje: `¡Sí! La **Semana ${sem}** de **Academia Briceño** está disponible en RASTRO con clases de Biología, Matemática, Lenguaje, Química y Raz. Verbal.`,
          sugerencias: [`Ver Semana ${sem} de Briceño`, 'Semana 0 Briceño', 'Ver Esparta']
        };
      } else {
        return {
          disponible: false,
          academia: 'Academia Briceño',
          semana: sem,
          mensaje: `En **Academia Briceño**, actualmente tenemos contenido hasta la **Semana 1** (Semana 0 de Introducción y Semana 1 en curso). La **Semana ${sem}** aún no ha sido publicada por la academia.`,
          sugerencias: ['Semana 1 Briceño', 'Semana 0 Briceño', 'Ver Semana 2 de Esparta']
        };
      }
    }
  }

  if (acad === 'ESPARTA') {
    if (sem !== null) {
      if (sem >= 1 && sem <= 6) {
        return {
          disponible: true,
          academia: 'Academia Esparta',
          semana: sem,
          mensaje: `¡Sí! La **Semana ${sem}** de **Academia Esparta** ya está disponible en RASTRO con lecciones grabadas de sus 18 cursos oficiales.`,
          sugerencias: [`Ver Semana ${sem} Esparta`, 'Clases de Matemática', 'Ver Briceño']
        };
      } else {
        return {
          disponible: false,
          academia: 'Academia Esparta',
          semana: sem,
          mensaje: `En **Academia Esparta**, actualmente tenemos clases registradas hasta la **Semana 6**. La **Semana ${sem}** aún no está disponible.`,
          sugerencias: ['Semana 6 Esparta', 'Semana 5 Esparta', 'Ver Briceño']
        };
      }
    }
  }

  // Resumen global de semanas y últimas clases
  return {
    disponible: true,
    resumenGlobal: true,
    mensaje: `En RASTRO el contenido más reciente está organizado por **Semanas** y dentro de cada una por **Clases**:\n\n` +
      `• **Academia Briceño (Ciclo 2027)**:\n` +
      `  - **Semana más reciente**: **Semana 1** (En curso).\n` +
      `  - **Clases subidas**: Biología (S01), Anatomía (S01), Matemática, Química, Lenguaje y Raz. Verbal.\n` +
      `  - *(Semana 0 de Introducción también disponible)*.\n\n` +
      `• **Academia Esparta (18 Materias)**:\n` +
      `  - **Semana más reciente**: **Semana 6**.\n` +
      `  - **Clases subidas**: Clase 6 de las 18 asignaturas (Literatura, Matemática 1 y 2, Física, Química, etc.).\n` +
      `  - *(Semanas 1 a 6 completas disponibles)*.\n\n` +
      `• **Academia Kelsen**:\n` +
      `  - Grabaciones oficiales del ciclo intensivo organizadas por fechas.\n\n` +
      `¿Deseas ver las clases de alguna de estas semanas?`,
    sugerencias: ['Semana 1 Briceño', 'Semana 6 Esparta', 'Grabaciones Kelsen']
  };
}

/**
 * Detecta el tipo de recurso solicitado explícitamente.
 */
export function detectResourceType(text) {
  const norm = normalizeBase(text);
  const tokens = norm.split(' ').filter(Boolean);

  // Si el usuario pide cursos o academias y no menciona "video" explícitamente, no forzar recurso VIDEO
  const pideCursos = /\b(?:cursos?|cursoos?|curssos?|academias?)\b/.test(norm);
  const pideVideo = /\b(?:videos?|grabacion|grabaciones|youtube)\b/.test(norm);
  if (pideCursos && !pideVideo) {
    return null;
  }

  for (const [type, keywords] of Object.entries(RESOURCE_TYPES)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`);
      if (regex.test(norm) || tokens.includes(kw)) {
        return type;
      }
    }
  }
  return null;
}

/**
 * Detecta si la consulta busca una obra o autor de literatura.
 */
export function detectLiteratura(text) {
  const norm = normalizeBase(text);
  const tokens = norm.split(' ');

  for (const item of LITERATURA_DATABASE) {
    for (const alias of item.aliases) {
      if (norm.includes(alias)) return item;
      for (const tok of tokens) {
        if (tok.length >= 4 && isFuzzyMatch(tok, alias)) return item;
      }
    }
  }
  return null;
}

/**
 * Detecta si la consulta busca un tema específico del temario oficial.
 */
export function detectTema(text) {
  const norm = normalizeBase(text);
  for (const entry of TEMAS_DATABASE) {
    for (const kw of entry.keywords) {
      if (norm.includes(kw)) return entry;
    }
  }
  return null;
}

// -----------------------------------------------------------------------------
// 6. MOTOR DE MATRIZ DE EVALUACIÓN Y TEMARIO (UNSA)
// -----------------------------------------------------------------------------

export function getMatrizInfo(params = {}) {
  const { area = null, materia = null } = params;
  const cleanArea = area ? normalizeBase(area) : null;
  const cleanMat = materia ? normalizeBase(materia) : null;

  const results = [];
  const areasToScan = ['Sociales', 'Ingenierías', 'Biomédicas'];

  areasToScan.forEach(aName => {
    if (cleanArea && !normalizeBase(aName).includes(cleanArea)) return;

    const list = datosSimulador[aName] || [];
    list.forEach(item => {
      if (cleanMat) {
        const asigNorm = normalizeBase(item.asignatura);
        const cursoNorm = normalizeBase(item.curso);
        if (!asigNorm.includes(cleanMat) && !cursoNorm.includes(cleanMat) && !cleanMat.includes(asigNorm)) {
          return;
        }
      }

      results.push({
        area: aName,
        curso: item.curso,
        asignatura: item.asignatura,
        preguntas: item.preguntas,
        valor: item.valor,
        puntajeTotalAsignatura: Number((item.preguntas * item.valor).toFixed(2))
      });
    });
  });

  return results;
}

// -----------------------------------------------------------------------------
// 7. BÚSQUEDA INTEGRADA EN MEMORIA (LegacyData + SimuladorData + Firestore Cache)
// -----------------------------------------------------------------------------

/**
 * Ejecuta la búsqueda universal respetando la jerarquía:
 * Materia -> Curso -> Tema -> Academia -> Ciclo -> Semana -> Tipo de recurso
 */
export async function executeUniversalSearch(params = {}, context = {}) {
  const queryRaw = params.query || '';
  const detectedMat = detectMateria(queryRaw) || params.materia || context.materia || null;
  const detectedAcad = detectAcademia(queryRaw) || params.academia || context.academia || null;
  const detectedSem = detectSemana(queryRaw) !== null ? detectSemana(queryRaw) : (params.semana !== undefined ? params.semana : (context.semana !== undefined ? context.semana : null));
  const detectedType = detectResourceType(queryRaw) || params.tipo_recurso || context.tipo_recurso || null;
  const detectedLit = detectLiteratura(queryRaw);
  const detectedTema = detectTema(queryRaw);

  const cleanQuery = normalizeBase(queryRaw);
  const isSyllabusOrMatrix = detectedType === 'TEMARIO' || detectedType === 'MATRIZ' || 
                             cleanQuery.includes('temario') || cleanQuery.includes('matriz') || cleanQuery.includes('que entra') || cleanQuery.includes('que viene');

  // CASO A: Consulta sobre la MATRIZ DE EVALUACIÓN O PONDERACIONES
  if (isSyllabusOrMatrix && (cleanQuery.includes('matriz') || cleanQuery.includes('ponderacion') || cleanQuery.includes('cuanto vale') || cleanQuery.includes('peso') || cleanQuery.includes('preguntas'))) {
    const matName = detectedMat ? CANONICAL_MATERIAS[detectedMat]?.name : queryRaw;
    const matrizResults = getMatrizInfo({ materia: matName });

    if (matrizResults.length > 0) {
      return {
        success: true,
        category: 'matriz',
        totalFound: matrizResults.length,
        followUp: `Aquí tienes los datos oficiales de la matriz de evaluación para ${matName || 'el examen'}:`,
        matrixData: matrizResults,
        items: matrizResults.map((m, idx) => ({
          id: `matriz-${idx}`,
          title: `${m.asignatura} · Área ${m.area}`,
          materia: m.curso,
          categoria: `Valor: ${m.valor} pts/pregunta · ${m.preguntas} preguntas`,
          desc: `Aporta hasta ${m.puntajeTotalAsignatura} puntos en el examen de admisión ${m.area}.`,
          type: 'comparacion',
          icon: '⚖️'
        })),
        suggestions: ['Ponderación Biomédicas', 'Ponderación Ingenierías', 'Ponderación Sociales']
      };
    }
  }

  // CASO B: Consulta sobre LITERATURA (Obras, Autores, Resúmenes)
  if (detectedLit) {
    return {
      success: true,
      category: 'literatura',
      totalFound: 1,
      followUp: `Encontré la obra en el temario de Literatura:`,
      items: [{
        id: `lit-${normalizeBase(detectedLit.obra)}`,
        title: `${detectedLit.obra}`,
        materia: 'Literatura',
        autor: detectedLit.autor,
        categoria: `${detectedLit.corriente} · ${detectedLit.genero}`,
        desc: `${detectedLit.resumen}\n\n💡 Relevancia: ${detectedLit.relevanciaExamen}`,
        type: 'material',
        icon: '📜'
      }],
      suggestions: ['Ver videos de literatura', 'Temario de literatura', 'Más obras']
    };
  }

  // CASO C: Consulta con TEMA específico detectado (ej: "fracciones", "leyes de newton")
  let targetMateria = detectedMat;
  if (!targetMateria && detectedTema) {
    targetMateria = detectedTema.materiaKey;
  }

  const matData = targetMateria ? CANONICAL_MATERIAS[targetMateria] : null;

  // CASO D: Pregunta sobre actualización o estado de semanas o última clase subida
  if (detectConsultaSemanaActualizacion(queryRaw)) {
    const estado = getEstadoSemanas({ academia: detectedAcad, semana: detectedSem, materia: targetMateria });
    return {
      success: true,
      category: 'actualizacion_semana',
      items: [],
      totalFound: 0,
      followUp: estado.mensaje,
      suggestions: estado.sugerencias,
      filterContext: { materia: targetMateria, academia: detectedAcad, semana: detectedSem }
    };
  }

  // CASO E: Desambiguación de academia para Matemática o cursos con divisiones distintas
  const isGenericMath = (targetMateria === 'MATEMATICA' || cleanQuery.includes('matematica') || cleanQuery.includes('mate')) && !detectedAcad && (detectedType === 'VIDEO' || !detectedType);
  if (isGenericMath && !detectedSem) {
    return {
      success: true,
      category: 'desambiguacion_academia',
      items: [],
      totalFound: 0,
      isAmbiguous: true,
      followUp: `Tenemos clases de **Matemática** en estas academias:\n\n` +
        `• **Academia Briceño**: Ciclo 2027 (Álgebra, Aritmética, Geometría).\n` +
        `• **Academia Esparta**: 18 Materias (dividido en **Matemática 1** y **Matemática 2**).\n` +
        `• **Academia Kelsen**: Grabaciones Oficiales de repaso.\n\n` +
        `¿De cuál academia deseas ver las clases?`,
      suggestions: ['Matemática Briceño', 'Matemática Esparta', 'Matemática Kelsen', 'Ver de todas las academias'],
      filterContext: { materia: 'MATEMATICA' }
    };
  }

  // Búsqueda de recursos reales
  const videoResults = [];
  const materialResults = [];

  // 1. VIDEOS - Briceño 2027
  if (Array.isArray(BRICENO_2027) && (!detectedAcad || detectedAcad === 'BRICENO')) {
    BRICENO_2027.forEach(w => {
      if (detectedSem !== null && w.num !== Number(detectedSem)) return;

      (w.data || []).forEach(course => {
        if (matData) {
          const matchCourse = matData.aliases.some(al => normalizeBase(course.nombre).includes(al));
          if (!matchCourse) return;
        }

        (course.videos || []).forEach((vid, vIdx) => {
          if (cleanQuery && !cleanQuery.includes('video') && !cleanQuery.includes('clase')) {
            const vidClean = normalizeBase(vid.nombre);
            const matchesWords = cleanQuery.split(' ').some(tok => tok.length >= 3 && vidClean.includes(tok));
            if (!matchesWords && !matData) return;
          }

          videoResults.push({
            id: `briceno-w${w.num}-${course.nombre}-${vIdx}`,
            title: vid.nombre,
            materia: course.nombre,
            semana: w.num,
            semanaLabel: w.nombre || `Semana ${w.num}`,
            academia: 'Academia Briceño',
            url: vid.url,
            driveUrl: vid.url?.includes('drive.google.com') ? vid.url : null,
            type: 'video',
            icon: '🎬'
          });
        });
      });
    });
  }

  // 2. VIDEOS - Academia Esparta
  if (COURSES && typeof COURSES === 'object' && (!detectedAcad || detectedAcad === 'ESPARTA')) {
    Object.entries(COURSES).forEach(([slug, c]) => {
      if (!c.name) return;
      if (matData) {
        const matchesName = matData.aliases.some(al => normalizeBase(c.name).includes(al) || slug.includes(al));
        if (!matchesName) return;
      }

      (c.lessons || []).forEach(lesson => {
        if (detectedSem !== null && lesson.n !== Number(detectedSem)) return;

        const title = lesson.title || `Clase ${lesson.n}`;
        videoResults.push({
          id: `esparta-${slug}-${lesson.n}`,
          title: `${title} (${c.name})`,
          materia: c.name,
          semana: lesson.n,
          semanaLabel: `Semana ${lesson.n}`,
          academia: 'Academia Esparta',
          url: lesson.url || (lesson.yt ? `https://www.youtube.com/watch?v=${lesson.yt}` : ''),
          ytId: lesson.yt || null,
          type: 'video',
          icon: '🎬'
        });
      });
    });
  }

  // 3. VIDEOS - Kelsen
  if (Array.isArray(KELSEN_VIDEOS) && (!detectedAcad || detectedAcad === 'KELSEN')) {
    if (!detectedSem || detectedSem === 1) {
      KELSEN_VIDEOS.forEach((v, idx) => {
        if (matData) {
          const matchKelsen = matData.aliases.some(al => normalizeBase(v.titulo).includes(al));
          if (!matchKelsen && targetMateria) return;
        }

        videoResults.push({
          id: `kelsen-${idx + 1}`,
          title: v.titulo,
          materia: matData ? matData.name : 'Clase Grabada',
          semana: 1,
          semanaLabel: 'Grabación Oficial',
          academia: 'Academia Kelsen',
          url: v.url,
          driveUrl: v.url,
          type: 'video',
          icon: '🎬'
        });
      });
    }
  }

  // 4. MATERIALES Y TOMOS
  if (Array.isArray(TOMOS)) {
    TOMOS.forEach((tomo, idx) => {
      const [title, desc, url] = tomo;
      const combined = `${title} ${desc}`.toLowerCase();
      if (matData && !matData.aliases.some(al => combined.includes(al))) {
        if (!cleanQuery.includes('tomo') && !cleanQuery.includes('cepre')) return;
      }

      materialResults.push({
        id: `tomo-${idx}`,
        title: title,
        materia: matData ? matData.name : 'Tomo Oficial',
        categoria: 'Tomos Oficiales',
        author: 'CEPREUNSA / RASTRO',
        url: url,
        driveUrl: url,
        type: 'pdf',
        icon: '📄',
        desc: desc
      });
    });
  }

  if (Array.isArray(PRACTICAS)) {
    PRACTICAS.forEach((prac, idx) => {
      const combined = `${prac.titulo} ${prac.descripcion}`.toLowerCase();
      if (matData && !matData.aliases.some(al => combined.includes(al))) {
        if (!cleanQuery.includes('practica') && !cleanQuery.includes('banco')) return;
      }

      materialResults.push({
        id: `practica-${idx}`,
        title: prac.titulo,
        materia: matData ? matData.name : 'Práctica Oficial',
        categoria: 'Prácticas y Bancos',
        author: 'Academia RASTRO',
        url: prac.carpeta,
        driveUrl: prac.carpeta,
        type: 'drive',
        icon: '📄',
        desc: prac.descripcion
      });
    });
  }

  // DISCRIMINACIÓN ESTRICTA DE TIPO DE RECURSO:
  // - Si el usuario pidió específicamente material -> Solo material
  // - Si pidió específicamente video -> Solo videos
  // - Si no especificó -> Mostrar organizados y preguntar amigablemente
  let finalItems = [];
  let isAmbiguous = false;
  let followUpMessage = '';
  let disambiguationChips = [];

  const matNameLabel = matData ? matData.name : '';
  const semNameLabel = detectedSem !== null ? `Semana ${detectedSem}` : '';

  if (detectedType === 'MATERIAL' || detectedType === 'LIBRO') {
    if (materialResults.length > 0) {
      finalItems = materialResults;
      followUpMessage = `Encontré ${finalItems.length} material${finalItems.length === 1 ? '' : 'es'} y separatas${matNameLabel ? ` de ${matNameLabel}` : ''}:`;
      disambiguationChips = ['Ver videos', 'Simulacros', 'Tomos CEPREUNSA'];
    } else if (videoResults.length > 0) {
      // Fallback solicitado: "si no hay material lo dice y muestra los videos no directamente"
      finalItems = videoResults;
      followUpMessage = `No encontré separatas ni PDFs para ${matNameLabel || 'esta materia'}${semNameLabel ? ` en la ${semNameLabel}` : ''}, pero **sí tenemos disponibles las clases en video**. Aquí tienes las grabaciones para que no te quedes sin estudiar:`;
      disambiguationChips = [`Ver más videos`, 'Tomos CEPREUNSA', 'Simulacros'];
    } else {
      followUpMessage = `No encontré separatas ni material escrito para ${matNameLabel || 'esa búsqueda'}${semNameLabel ? ` en la ${semNameLabel}` : ''}. ¿Quieres buscar en otra materia o academia?`;
      disambiguationChips = ['Academia Briceño', 'Academia Esparta', 'Tomos CEPREUNSA'];
    }
  } else if (detectedType === 'VIDEO') {
    finalItems = videoResults;
    if (finalItems.length > 0) {
      followUpMessage = `Encontré ${finalItems.length} video${finalItems.length === 1 ? '' : 's'}${matNameLabel ? ` de ${matNameLabel}` : ''}${semNameLabel ? ` (${semNameLabel})` : ''}:`;
      disambiguationChips = ['Semana 1', 'Semana 2', 'Semana 3', 'Buscar material'];
    } else {
      if (detectedAcad === 'BRICENO' && detectedSem !== null && Number(detectedSem) > 1) {
        followUpMessage = `En **Academia Briceño**, tenemos clases de ${matNameLabel || 'esta materia'} para la **Semana 0** y **Semana 1**, pero la **Semana ${detectedSem}** aún no ha sido publicada por la academia.`;
        disambiguationChips = [`${matNameLabel || 'Clases'} Briceño Semana 1`, `${matNameLabel || 'Clases'} Briceño Semana 0`, 'Ver en Esparta'];
      } else {
        followUpMessage = `No encontré videos de ${matNameLabel || 'esa materia'}${semNameLabel ? ` para la semana ${detectedSem}` : ''}. ¿Probamos con otra semana o academia?`;
        disambiguationChips = ['Semana 1', 'Semana 2', 'Semana 3', 'Buscar material'];
      }
    }
  } else {
    // Consulta no especificó si video o material (ej: "química" o "biología")
    if (videoResults.length > 0 && materialResults.length > 0) {
      isAmbiguous = true;
      followUpMessage = `¿Qué tipo de recurso buscas para **${matNameLabel || 'esta materia'}**?\n\n` +
        `• **Videos y Clases grabadas**\n` +
        `• **Material y Separatas (PDF)**\n` +
        `• **Ambos recursos combinados**`;
      disambiguationChips = [
        `🎥 Solo videos de ${matNameLabel || 'la materia'}`,
        `📚 Solo material de ${matNameLabel || 'la materia'}`,
        `✨ Ver ambos`,
        `📖 Tomos CEPREUNSA`
      ];
    } else if (videoResults.length > 0) {
      finalItems = videoResults;
      followUpMessage = `Encontré ${finalItems.length} video${finalItems.length === 1 ? '' : 's'}${matNameLabel ? ` de ${matNameLabel}` : ''}:`;
      disambiguationChips = ['Semana 1', 'Semana 2', 'Semana 3', 'Ver material'];
    } else if (materialResults.length > 0) {
      finalItems = materialResults;
      followUpMessage = `Encontré ${finalItems.length} recurso${finalItems.length === 1 ? '' : 's'} escrito${finalItems.length === 1 ? '' : 's'}${matNameLabel ? ` de ${matNameLabel}` : ''}:`;
      disambiguationChips = ['Ver videos', 'Tomos CEPREUNSA', 'Simulacro'];
    } else {
      followUpMessage = `No encuentro esa información en los datos disponibles para "${queryRaw}". ¿Quieres buscar por otra materia o academia?`;
      disambiguationChips = ['Academia Briceño', 'Academia Esparta', 'Tomos CEPREUNSA', 'Simulador'];
    }
  }

  return {
    success: true,
    category: detectedType || 'universal',
    items: finalItems,
    totalFound: finalItems.length,
    isAmbiguous,
    followUp: followUpMessage,
    suggestions: disambiguationChips,
    filterContext: {
      materia: targetMateria,
      academia: detectedAcad,
      semana: detectedSem,
      tipo_recurso: detectedType
    }
  };
}
