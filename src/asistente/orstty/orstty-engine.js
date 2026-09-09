// =============================================================================
// ORSTTY ENGINE
// Cerebro local de ORSTTY. 100% JavaScript, sin APIs de IA, sin dependencias
// externas. Autocontenido: no importa nada de RASTRO ni asume su estructura.
//
// RASTRO (u otra IA que lo integre) debe:
//   1. Copiar esta carpeta a src/asistente/orstty/
//   2. Importar lo que necesite desde orstty-engine.js
//   3. Cargar orstty-training.js una vez al iniciar la app (para entrenar)
//   4. Registrar sus propias tools reales con registerTool(...)
//   5. Llamar a process(mensajeDelUsuario) por cada mensaje del chat
// =============================================================================

// ---------------------------------------------------------------------------
// 1. NORMALIZACIÓN DE TEXTO
// ---------------------------------------------------------------------------

const TILDES = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u',
  à: 'a', è: 'e', ì: 'i', ò: 'o', ù: 'u',
};

/**
 * Normaliza texto: minúsculas, sin tildes, sin signos, espacios limpios.
 */
export function normalizeText(text = '') {
  let cleaned = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[áéíóúüàèìòù]/g, (c) => TILDES[c] || c)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Correcciones de mecanografía habituales (ej: amtematica -> matematica) y abreviaturas
  cleaned = cleaned
    .replace(/\bamtematicas?\b/g, 'matematica')
    .replace(/\bamtematicos?\b/g, 'matematico')
    .replace(/\br m\b/g, 'rm')
    .replace(/\br v\b/g, 'rv');

  return cleaned;
}

function tokenize(text) {
  return normalizeText(text).split(' ').filter(Boolean);
}

// ---------------------------------------------------------------------------
// 2. VOCABULARIO DE ENTIDADES (extensible desde fuera con registerVocab)
// ---------------------------------------------------------------------------

const vocab = {
  materia: {
    // Razonamiento Matemático (RM) primero para evitar falsos positivos con matemática
    RAZONAMIENTO_MATEMATICO: [
      'razonamiento matematico',
      'raz matematico',
      'raz mat',
      'razonamiento mat',
      'razonamiento matematica',
      'razonamiento matematicas',
      'raz matematica',
      'raz matematicas',
      'rm',
    ],
    // Razonamiento Verbal (RV) antes de Lenguaje
    RAZONAMIENTO_VERBAL: [
      'razonamiento verbal',
      'raz verbal',
      'raz verb',
      'razonamiento verb',
      'rv',
    ],
    RAZONAMIENTO_LOGICO: [
      'razonamiento logico',
      'raz logico',
      'rl',
    ],
    // Matemática general (Álgebra, Geometría, Trigonometría, Aritmética)
    MATEMATICA: [
      'matematica',
      'matematicas',
      'amtematica',
      'amtematicas',
      'mate',
      'mates',
      'algebra',
      'geometria',
      'trigonometria',
      'aritmetica',
      'matematica 1',
      'matematica 2',
    ],
    BIOLOGIA: ['biologia', 'bio'],
    QUIMICA: ['quimica', 'qui', 'quimi'],
    FISICA: ['fisica', 'fis'],
    LENGUAJE: ['lenguaje', 'comunicacion', 'lengua'],
    HISTORIA: ['historia', 'hist'],
    LITERATURA: ['literatura', 'lite'],
    FILOSOFIA: ['filosofia', 'filo'],
    ECONOMIA: ['economia', 'eco'],
  },
  tipo_recurso: {
    VIDEO: ['video', 'videos', 'clase', 'clases'],
    PDF: ['pdf', 'pdfs', 'separata', 'separatas', 'material', 'materiales'],
    LIBRO: ['libro', 'libros'],
    EXAMEN: ['examen', 'examenes', 'practica', 'practicas', 'simulacro', 'simulacros'],
    PUBLICACION: ['publicacion', 'publicaciones', 'post', 'posts'],
  },
};

/**
 * Permite agregar más materias, tipos de recurso u otras entidades desde
 * fuera (por ejemplo, cuando RASTRO conecte sus datos reales) sin tocar
 * este archivo.
 *
 * registerVocab('materia', 'PSICOLOGIA', ['psicologia', 'psico']);
 */
export function registerVocab(entityName, value, synonyms = []) {
  if (!vocab[entityName]) vocab[entityName] = {};
  if (!vocab[entityName][value]) vocab[entityName][value] = [];
  vocab[entityName][value].push(...synonyms.map(normalizeText));
}

function matchVocab(normalizedText, entityName) {
  const table = vocab[entityName];
  if (!table) return null;
  const tokens = normalizedText.split(' ');

  // 1. Frases multipalabra primero (ej: "raz matematico", "razonamiento verbal")
  for (const [value, synonyms] of Object.entries(table)) {
    for (const syn of synonyms) {
      if (syn.includes(' ')) {
        const regex = new RegExp(`(^|\\s)${syn.replace(/\s+/g, '\\s+')}($|\\s)`);
        if (regex.test(normalizedText)) {
          return value;
        }
      }
    }
  }

  // 2. Coincidencia por tokens individuales
  for (const [value, synonyms] of Object.entries(table)) {
    for (const syn of synonyms) {
      if (!syn.includes(' ') && tokens.includes(syn)) {
        return value;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 3. EXTRACCIÓN DE ENTIDADES
// ---------------------------------------------------------------------------

function extractEntities(rawText) {
  const norm = normalizeText(rawText);
  const entities = {};

  const materia = matchVocab(norm, 'materia');
  if (materia) entities.materia = materia;

  const tipo = matchVocab(norm, 'tipo_recurso');
  if (tipo) entities.tipo_recurso = tipo;

  const semanaMatch = norm.match(/(?:semana|sem|clase|la|s)\s*(\d{1,2})\b/) || norm.match(/^(\d{1,2})$/);
  if (semanaMatch) entities.semana = parseInt(semanaMatch[1], 10);

  // heurísticas simples, "curso de X" / "academia X"
  const cursoMatch = norm.match(/curso de ([a-z0-9]+(?:\s[a-z0-9]+){0,3})/);
  if (cursoMatch) entities.curso = cursoMatch[1].trim();

  const academiaMatch = norm.match(/academia ([a-z0-9]+(?:\s[a-z0-9]+){0,3})/);
  if (academiaMatch) entities.academia = academiaMatch[1].trim();

  return entities;
}

// ---------------------------------------------------------------------------
// 4. ENTRENAMIENTO E INTENCIONES
// ---------------------------------------------------------------------------

const trainingSet = []; // { intent, phrase, tokens: Set<string> }

/**
 * Enseña una frase nueva asociada a una intención.
 * train("quiero videos de biologia", "buscar_videos");
 */
export function train(phrase, intent) {
  trainingSet.push({
    intent,
    phrase,
    tokens: new Set(tokenize(phrase)),
  });
}

/**
 * Entrena varias frases de una vez: trainMany([[frase, intencion], ...])
 */
export function trainMany(pairs = []) {
  pairs.forEach(([phrase, intent]) => train(phrase, intent));
}

const KNOWN_INTENTS = new Set([
  'saludar', 'ayuda', 'buscar_videos', 'buscar_material', 'buscar_cursos',
  'buscar_libros', 'buscar_examenes', 'buscar_publicaciones', 'buscar_perfiles',
  'buscar_semanas', 'buscar_nuevos', 'comparar_recursos', 'filtrar',
  'abrir_recurso', 'volver', 'no_entendido',
]);

/**
 * Registra una intención nueva (no obligatorio, pero ayuda a llevar
 * un catálogo de intenciones conocidas).
 */
export function registerIntent(name) {
  KNOWN_INTENTS.add(name);
}

export function getKnownIntents() {
  return Array.from(KNOWN_INTENTS);
}

function jaccard(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const CONFIDENCE_THRESHOLD = 0.2;

function matchIntent(rawText) {
  const inputTokens = new Set(tokenize(rawText));
  let best = { intent: 'no_entendido', confidence: 0 };

  for (const entry of trainingSet) {
    const score = jaccard(inputTokens, entry.tokens);
    if (score > best.confidence) {
      best = { intent: entry.intent, confidence: score };
    }
  }

  if (best.confidence < CONFIDENCE_THRESHOLD) {
    return { intent: 'no_entendido', confidence: best.confidence };
  }
  return best;
}

// ---------------------------------------------------------------------------
// 5. CONTEXTO TEMPORAL
// ---------------------------------------------------------------------------

let context = {};

const CONTEXT_ENTITY_KEYS = ['materia', 'tipo_recurso', 'semana', 'curso', 'academia'];

export function getContext() {
  return { ...context };
}

export function updateContext(partial = {}) {
  context = { ...context, ...partial };
  return getContext();
}

export function clearContext() {
  context = {};
  return getContext();
}

// ---------------------------------------------------------------------------
// 6. TOOLS (RASTRO las registrará con sus funciones reales)
// ---------------------------------------------------------------------------

const tools = {};

/**
 * registerTool("buscarVideos", async (parametros) => { ... datos reales ... });
 */
export function registerTool(name, fn) {
  tools[name] = fn;
}

export function getTool(name) {
  return tools[name] || null;
}

// Mapeo intención -> nombre de tool esperado. RASTRO puede sobreescribirlo
// con registerIntentTool si usa otros nombres.
const intentToolMap = {
  buscar_videos: 'buscarVideos',
  buscar_material: 'buscarMaterial',
  buscar_cursos: 'buscarCursos',
  buscar_libros: 'buscarLibros',
  buscar_examenes: 'buscarExamenes',
  buscar_publicaciones: 'buscarPublicaciones',
  buscar_perfiles: 'buscarPerfiles',
  buscar_semanas: 'buscarSemanas',
  buscar_nuevos: 'buscarNuevos',
  comparar_recursos: 'compararRecursos',
  abrir_recurso: 'abrirRecurso',
};

export function registerIntentTool(intent, toolName) {
  intentToolMap[intent] = toolName;
}

// ---------------------------------------------------------------------------
// 7. ESTADOS (para que RASTRO controle el avatar más adelante)
// ---------------------------------------------------------------------------

export const STATES = {
  IDLE: 'idle',
  THINKING: 'thinking',
  SEARCHING: 'searching',
  FOUND: 'found',
  HAPPY: 'happy',
  CONFUSED: 'confused',
  NO_RESULTS: 'no_results',
  ERROR: 'error',
};

function suggestState(intent) {
  if (intent === 'no_entendido') return STATES.CONFUSED;
  if (intent === 'saludar') return STATES.HAPPY;
  if (intentToolMap[intent]) return STATES.SEARCHING;
  return STATES.IDLE;
}

// ---------------------------------------------------------------------------
// 8. PROCESAMIENTO PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Procesa un mensaje del usuario y devuelve un resultado estructurado.
 * No ejecuta la tool: solo indica cuál debería usarse y con qué parámetros.
 * RASTRO decide cuándo y cómo llamar a la tool real.
 */
export function process(message) {
  const { intent, confidence } = matchIntent(message);
  const newEntities = extractEntities(message);

  // combina lo nuevo con lo que ya había en contexto (sin perder lo anterior)
  const mergedEntities = { ...context, ...newEntities };

  const relevantEntities = {};
  for (const key of CONTEXT_ENTITY_KEYS) {
    if (mergedEntities[key] !== undefined) relevantEntities[key] = mergedEntities[key];
  }

  updateContext(relevantEntities);

  const toolName = intentToolMap[intent] || null;

  return {
    intent,
    confidence: Number(confidence.toFixed(2)),
    entities: newEntities,
    tool: toolName,
    parameters: toolName ? relevantEntities : {},
    context: getContext(),
    state: suggestState(intent),
  };
}
