// =============================================================================
// RASTRO TOOLS FOR ORSTTY ENGINE
// Conecta el cerebro local ORSTTY con los datos reales de RASTRO:
// - Cursos y Academias (Esparta, Briceño 2027, Kelsen, Cursos dinámicos Firestore)
// - Videos reales (lecciones de YouTube, clases grabadas de Google Drive)
// - Materiales, Separatas, PDFs y Libros (Tomos CEPRE, Prácticas, Uploads comunitarios)
// - Exámenes y Simulador (bancos de preguntas, ponderaciones por área)
// - Publicaciones y Perfiles comunitarios (respetando privacidad y permisos)
// =============================================================================

import { db } from '../../lib/firebase.js';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where 
} from 'firebase/firestore';
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
  DEFAULT_EXAM_QUESTIONS 
} from '../../data/simuladorData.js';
import { 
  registerTool, 
  registerVocab, 
  registerIntentTool 
} from './orstty-engine.js';
import { 
  searchKnowledge, 
  getKnowledgeResponse, 
  getDesviationResponse 
} from './orstty-knowledge.js';

// -----------------------------------------------------------------------------
// NORMALIZADORES Y VOCABULARIOS COMPLEMENTARIOS DE RASTRO
// -----------------------------------------------------------------------------

export function cleanText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Consulta segura a Firestore con límite de tiempo para garantizar
 * respuesta instantánea incluso si la red o conexión está lenta.
 */
export async function safeGetDocs(queryRef, timeoutMs = 2500) {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), timeoutMs)
    );
    const snap = await Promise.race([getDocs(queryRef), timeoutPromise]);
    return snap;
  } catch (e) {
    return { docs: [] };
  }
}

// Registrar materias adicionales presentes en RASTRO
registerVocab('materia', 'ANATOMIA', ['anatomia', 'anat']);
registerVocab('materia', 'GEOGRAFIA', ['geografia', 'geo']);
registerVocab('materia', 'PSICOLOGIA', ['psicologia', 'psico']);
registerVocab('materia', 'CIVICA', ['civica', 'ed civica', 'educacion civica']);
registerVocab('materia', 'INGLES', ['ingles']);
registerVocab('materia', 'RAZONAMIENTO_LOGICO', ['razonamiento logico', 'rl']);
registerVocab('materia', 'COMPRENSION_LECTORA', ['comprension lectora']);

// Registrar academias
registerVocab('academia', 'esparta', ['esparta', 'academia esparta']);
registerVocab('academia', 'briceno', ['briceno', 'academia briceno', 'briceno 2027']);
registerVocab('academia', 'kelsen', ['kelsen', 'academia kelsen']);

// Registrar tool para filtrar
registerIntentTool('filtrar', 'filtrar');

// Mapeo canónico de nombres de materia para búsquedas
const MATERIA_CANONICAL = {
  BIOLOGIA: 'Biología',
  QUIMICA: 'Química',
  FISICA: 'Física',
  MATEMATICA: 'Matemática',
  LENGUAJE: 'Lenguaje',
  HISTORIA: 'Historia',
  LITERATURA: 'Literatura',
  FILOSOFIA: 'Filosofía',
  ECONOMIA: 'Economía',
  RAZONAMIENTO_VERBAL: 'Raz. Verbal',
  RAZONAMIENTO_MATEMATICO: 'Raz. Matemático',
  ANATOMIA: 'Anatomía',
  GEOGRAFIA: 'Geografía',
  PSICOLOGIA: 'Psicología',
  CIVICA: 'Cívica',
  INGLES: 'Inglés',
  RAZONAMIENTO_LOGICO: 'Raz. Lógico',
  COMPRENSION_LECTORA: 'Comp. Lectora'
};

export function matchesMateria(itemMateria, targetMateria) {
  if (!targetMateria) return true;
  if (!itemMateria) return false;
  const cTarget = cleanText(targetMateria);
  const cItem = cleanText(itemMateria);

  // Detección estricta de Razonamiento Matemático (RM)
  const isTargetRM = cTarget.includes('razonamiento matematico') || 
                     cTarget.includes('raz matematico') || 
                     cTarget.includes('raz mat') || 
                     cTarget === 'rm';
  const isItemRM = cItem.includes('razonamiento matematico') || 
                   cItem.includes('raz matematico') || 
                   cItem.includes('raz mat') || 
                   cItem.includes(' rm') || 
                   cItem.startsWith('rm ') || 
                   cItem === 'rm' ||
                   cItem.includes('razonamiento-matematico');

  // 1. Caso RAZONAMIENTO MATEMÁTICO: Solo debe coincidir con RM y jamás con matemática general
  if (isTargetRM) {
    return isItemRM;
  }

  // 2. Caso MATEMÁTICA GENERAL (Álgebra, Geometría, Trigonometría, Aritmética)
  const isTargetMath = cTarget.includes('matemat') || 
                       cTarget.includes('amtemat') ||
                       cTarget.includes('algebra') || 
                       cTarget.includes('aritmet') || 
                       cTarget.includes('geomet') || 
                       cTarget.includes('trigono') || 
                       cTarget === 'mate' ||
                       cTarget === 'mates';

  if (isTargetMath) {
    // Si el item es Razonamiento Matemático, NO debe ser considerado matemática pura
    if (isItemRM) return false;
    if (cItem.includes('matemat') || 
        cItem.includes('algebra') || 
        cItem.includes('aritmet') || 
        cItem.includes('geomet') || 
        cItem.includes('trigono') || 
        cItem.includes('mate') ||
        cItem.includes('matematica-1') ||
        cItem.includes('matematica-2')) {
      return true;
    }
  }

  // 3. Caso RAZONAMIENTO VERBAL (RV) vs Lenguaje
  const isTargetRV = cTarget.includes('razonamiento verbal') || 
                    cTarget.includes('raz verbal') || 
                    cTarget.includes('raz verb') || 
                    cTarget === 'rv';
  const isItemRV = cItem.includes('razonamiento verbal') || 
                  cItem.includes('raz verbal') || 
                  cItem.includes('raz verb') || 
                  cItem.includes('rv');
  if (isTargetRV) {
    return isItemRV;
  }
  if (cTarget.includes('lengua') || cTarget.includes('comunicac')) {
    if (isItemRV) return false; // Lenguaje no debe mezclar RV
  }

  // 4. Coincidencia directa exacta
  if (cItem.includes(cTarget) || cTarget.includes(cItem)) return true;

  // 5. Variantes abreviadas estándar
  if (cTarget.includes('biolog') && (cItem.includes('bio') || cItem.includes('biolog'))) return true;
  if (cTarget.includes('quimic') && (cItem.includes('quim') || cItem.includes('quimic'))) return true;
  if (cTarget.includes('fisic') && (cItem.includes('fis') || cItem.includes('fisic'))) return true;
  if (cTarget.includes('lengua') && (cItem.includes('leng') || cItem.includes('comunicac'))) return true;
  if (cTarget.includes('histor') && cItem.includes('hist')) return true;
  if (cTarget.includes('literat') && cItem.includes('lit')) return true;
  if (cTarget.includes('filos') && cItem.includes('filo')) return true;
  if (cTarget.includes('psicol') && cItem.includes('psico')) return true;
  if (cTarget.includes('civic') && cItem.includes('civic')) return true;
  if (cTarget.includes('anatom') && cItem.includes('anat')) return true;
  return false;
}

// -----------------------------------------------------------------------------
// TOOL 1: BUSCAR VIDEOS
// Consulta lecciones de Briceño 2027, Academia Esparta, Kelsen y Firestore
// -----------------------------------------------------------------------------
export async function toolBuscarVideos(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const semana = params.semana !== undefined ? params.semana : (context.semana !== undefined ? context.semana : null);
  const queryText = params.query || params.tema || '';
  const cleanQ = cleanText(queryText);

  const results = [];

  // 1. Briceño 2027 (organizado por semanas y materias)
  if (Array.isArray(BRICENO_2027)) {
    BRICENO_2027.forEach((week) => {
      // Filtrar por semana si se especificó
      if (semana !== null && week.num !== Number(semana)) {
        return;
      }

      (week.data || []).forEach((course) => {
        if (materia && !matchesMateria(course.nombre, materia)) {
          return;
        }

        (course.videos || []).forEach((vid, vIdx) => {
          if (cleanQ && !cleanText(vid.nombre).includes(cleanQ) && !cleanText(course.nombre).includes(cleanQ)) {
            return;
          }

          results.push({
            id: `briceno-2027-w${week.num}-${course.nombre}-${vIdx}`,
            title: vid.nombre || `Clase ${vIdx + 1}`,
            materia: course.nombre,
            semana: week.num,
            semanaLabel: week.nombre || `Semana ${week.num}`,
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

  // 2. Academia Esparta (COURSES)
  if (COURSES && typeof COURSES === 'object') {
    Object.entries(COURSES).forEach(([slug, c]) => {
      if (!c.name) return;
      if (materia && !matchesMateria(c.name, materia)) return;

      (c.lessons || []).forEach((lesson) => {
        if (semana !== null && lesson.n !== Number(semana)) return;

        const title = lesson.title || `Clase ${lesson.n}`;
        if (cleanQ && !cleanText(title).includes(cleanQ) && !cleanText(c.name).includes(cleanQ)) {
          return;
        }

        const url = lesson.url || (lesson.yt ? `https://www.youtube.com/watch?v=${lesson.yt}` : '');
        results.push({
          id: `esparta-${slug}-${lesson.n}`,
          title: title,
          materia: c.name,
          semana: lesson.n,
          semanaLabel: `Semana ${lesson.n}`,
          academia: 'Academia Esparta',
          url,
          ytId: lesson.yt || null,
          type: 'video',
          icon: '🎬'
        });
      });
    });
  }

  // 3. Academia Kelsen
  if ((!semana || semana === 1) && Array.isArray(KELSEN_VIDEOS)) {
    KELSEN_VIDEOS.forEach((v, idx) => {
      if (materia && !matchesMateria(v.titulo, materia)) return;
      if (cleanQ && !cleanText(v.titulo).includes(cleanQ)) return;

      results.push({
        id: `kelsen-${idx + 1}`,
        title: v.titulo,
        materia: materia ? MATERIA_CANONICAL[materia] || materia : 'General',
        semana: 1,
        semanaLabel: 'Grabación Oficial',
        academia: 'Academia Kelsen',
        url: v.url,
        type: 'video',
        icon: '🎬'
      });
    });
  }

  // 4. Firestore: Colección 'cursos' dinámicos (si existen)
  try {
    const qCursos = query(collection(db, 'cursos'), limit(8));
    const snap = await safeGetDocs(qCursos);
    snap.docs.forEach((docSnap) => {
      const cData = docSnap.data();
      if (cData.oculto) return;
      (cData.modules || []).forEach((mod, mIdx) => {
        (mod.items || []).forEach((item, itIdx) => {
          if (!item.url) return;
          if (materia && !matchesMateria(item.titulo, materia) && !matchesMateria(mod.nombre, materia)) return;
          if (semana !== null && mod.semana !== undefined && Number(mod.semana) !== Number(semana)) return;

          results.push({
            id: `fs-curso-${docSnap.id}-${mIdx}-${itIdx}`,
            title: item.titulo,
            materia: mod.nombre || cData.name,
            semana: mod.semana || 1,
            semanaLabel: mod.nombre || 'Módulo',
            academia: cData.name || 'Curso RASTRO',
            url: item.url,
            type: 'video',
            icon: '🎬'
          });
        });
      });
    });
  } catch (e) {
    // Si la lectura en Firestore falla por red o permisos, se mantiene el catálogo estático seguro
  }

  // Si el usuario pidió videos de una materia pero no especificó semana:
  let followUp = null;
  let suggestions = [];

  if (materia && semana === null) {
    const matName = MATERIA_CANONICAL[materia] || materia;
    followUp = `¿Qué semana buscas para ${matName}?`;
    suggestions = ['la 1', 'la 2', 'la 3', 'la 4', 'Ver todas'];
  } else if (results.length > 0) {
    const matName = materia ? (MATERIA_CANONICAL[materia] || materia) : '';
    const semName = semana !== null ? `Semana ${semana}` : '';
    followUp = `Encontré ${results.length} video${results.length === 1 ? '' : 's'}${matName ? ` de ${matName}` : ''}${semName ? ` (${semName})` : ''}:`;
  } else {
    followUp = `No encontré videos de ${materia ? MATERIA_CANONICAL[materia] || materia : 'esa búsqueda'}${semana !== null ? ` para la semana ${semana}` : ''}. ¿Probamos con otra semana?`;
    suggestions = ['la 1', 'la 2', 'la 3', 'Buscar material'];
  }

  return {
    success: true,
    toolName: 'buscarVideos',
    items: results,
    totalFound: results.length,
    followUp,
    suggestions,
    filterContext: { materia, semana }
  };
}

// -----------------------------------------------------------------------------
// TOOL 2: BUSCAR MATERIAL (Separatas, PDFs, Prácticas, Resúmenes)
// Consulta TOMOS, PRACTICAS, y la colección 'uploads' comunitaria de Firestore
// -----------------------------------------------------------------------------
export async function toolBuscarMaterial(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const semana = params.semana !== undefined ? params.semana : (context.semana !== undefined ? context.semana : null);
  const cleanQ = cleanText(params.query || params.tema || '');
  const categoria = params.categoria || null;

  const results = [];

  // 1. Tomos oficiales (Drive)
  if (Array.isArray(TOMOS)) {
    TOMOS.forEach((tomo, idx) => {
      const [title, desc, url] = tomo;
      const combinedText = `${title} ${desc}`;
      if (materia && !matchesMateria(combinedText, materia)) {
        // Permitir si es general y no hay filtro específico
        if (cleanQ && !cleanText(title).includes(cleanQ)) return;
      }
      results.push({
        id: `tomo-${idx}`,
        title: title,
        materia: materia ? MATERIA_CANONICAL[materia] || materia : 'Tomos Generales',
        semana: null,
        categoria: 'Tomos y Libros',
        author: 'CEPREUNSA / RASTRO',
        url: url,
        driveUrl: url,
        type: 'pdf',
        icon: '📄',
        desc: desc
      });
    });
  }

  // 2. Prácticas oficiales
  if (Array.isArray(PRACTICAS)) {
    PRACTICAS.forEach((prac, idx) => {
      const combinedText = `${prac.titulo} ${prac.descripcion}`;
      if (materia && !matchesMateria(combinedText, materia)) {
        if (cleanQ && !cleanText(prac.titulo).includes(cleanQ)) return;
      }
      results.push({
        id: `practica-${idx}`,
        title: prac.titulo,
        materia: materia ? MATERIA_CANONICAL[materia] || materia : 'Prácticas',
        semana: null,
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

  // 3. Firestore: 'uploads' de la comunidad (material compartido real)
  try {
    const qUploads = query(
      collection(db, 'uploads'),
      where('oculto', '==', false),
      limit(30)
    );
    const snap = await safeGetDocs(qUploads);
    snap.docs.forEach((docSnap) => {
      const item = docSnap.data();
      if (item.hidden || (item.reportsCount || 0) >= 3) return;

      if (categoria && item.category !== categoria) return;

      const titleMatch = cleanText(item.title || '');
      const descMatch = cleanText(item.desc || '');
      const catLabelMatch = cleanText(item.categoriaLabel || '');

      if (materia) {
        const fullItemText = `${titleMatch} ${descMatch} ${catLabelMatch}`;
        const match = matchesMateria(fullItemText, materia);
        if (!match) return;
      }

      if (semana !== null) {
        const semClean = `semana ${semana}`;
        const semClean2 = `sem ${semana}`;
        const semClean3 = `s${semana}`;
        const matchSem = titleMatch.includes(semClean) || titleMatch.includes(semClean2) || titleMatch.includes(semClean3) ||
                         descMatch.includes(semClean);
        if (!matchSem && item.semana !== undefined && Number(item.semana) !== Number(semana)) {
          return;
        }
      }

      if (cleanQ && !titleMatch.includes(cleanQ) && !descMatch.includes(cleanQ)) {
        return;
      }

      results.push({
        id: `upload-${docSnap.id}`,
        title: item.title,
        materia: materia ? MATERIA_CANONICAL[materia] || materia : (item.categoriaLabel || 'Material'),
        semana: semana !== null ? semana : (item.semana || null),
        categoria: item.categoriaLabel || 'Separata / Apunte',
        author: item.author || item.uploadedBy?.name || 'Comunidad RASTRO',
        url: item.url || item.driveUrl,
        driveUrl: item.driveUrl || item.url,
        type: item.type === 'pdf' ? 'pdf' : (item.url?.includes('drive.google.com') ? 'drive' : 'archivo'),
        icon: '📄',
        desc: item.desc || ''
      });
    });
  } catch (e) {
    // Lectura segura con fallback
  }

  const matName = materia ? (MATERIA_CANONICAL[materia] || materia) : '';
  const semName = semana !== null ? ` (Semana ${semana})` : '';

  return {
    success: true,
    toolName: 'buscarMaterial',
    items: results,
    totalFound: results.length,
    followUp: results.length > 0 
      ? `Encontré ${results.length} documento${results.length === 1 ? '' : 's'}${matName ? ` de ${matName}` : ''}${semName}:`
      : `No encontré material directo para ${matName || 'esa búsqueda'}${semName}. ¿Quieres buscar videos o exámenes?`,
    suggestions: ['Ver videos', 'Simulacros', 'Tomos CEPREUNSA'],
    filterContext: { materia, semana }
  };
}

// -----------------------------------------------------------------------------
// TOOL 3: BUSCAR CURSOS Y ACADEMIAS
// -----------------------------------------------------------------------------
export async function toolBuscarCursos(params = {}) {
  const cleanQ = cleanText(params.query || params.academia || '');

  const coursesList = [
    {
      id: 'briceno',
      name: 'Academia Briceño 2027',
      type: 'briceno',
      path: '/cursos/briceno',
      description: 'Ciclo intensivo 2027 organizado semana a semana con videos, materias y materiales.',
      icon: '🏛️',
      badge: 'Ciclo 2027 Activo',
      tags: ['Semanas', 'Videos Drive', 'Material']
    },
    {
      id: 'esparta',
      name: 'Academia Esparta',
      type: 'esparta',
      path: '/cursos/esparta',
      description: '18 materias preuniversitarias completas con lecciones en video de YouTube.',
      icon: '🏛️',
      badge: '18 Materias',
      tags: ['Biología', 'Química', 'Matemática', 'Física', 'Lenguaje']
    },
    {
      id: 'kelsen',
      name: 'Academia Kelsen',
      type: 'kelsen',
      path: '/cursos/kelsen',
      description: 'Clases grabadas oficiales, horarios y banco de grabaciones en Drive.',
      icon: '🏛️',
      badge: 'Clases Grabadas',
      tags: ['Grabaciones Oficiales', 'Horario']
    }
  ];

  // Cursos personalizados desde Firestore
  try {
    const qC = query(collection(db, 'cursos'), limit(10));
    const snap = await safeGetDocs(qC);
    snap.docs.forEach(d => {
      const cd = d.data();
      if (cd.oculto) return;
      coursesList.push({
        id: d.id,
        name: cd.name,
        type: 'custom',
        path: `/cursos/${d.id}`,
        description: cd.descripcion || 'Módulo de preparación académica en RASTRO.',
        icon: '📚',
        badge: 'Comunitario',
        tags: (cd.modules || []).map(m => m.nombre).slice(0, 3)
      });
    });
  } catch (e) {}

  const filtered = coursesList.filter(c => {
    if (!cleanQ) return true;
    return cleanText(c.name).includes(cleanQ) || cleanText(c.description).includes(cleanQ);
  });

  return {
    success: true,
    toolName: 'buscarCursos',
    items: filtered,
    totalFound: filtered.length,
    followUp: `Aquí tienes los cursos y academias disponibles en RASTRO:`,
    suggestions: ['Academia Briceño', 'Academia Esparta', 'Academia Kelsen']
  };
}

// -----------------------------------------------------------------------------
// TOOL 4: BUSCAR LIBROS Y TOMOS
// -----------------------------------------------------------------------------
export async function toolBuscarLibros(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const cleanQ = cleanText(params.query || '');

  const results = [];

  // 1. Tomos estáticos de legacyData
  if (Array.isArray(TOMOS)) {
    TOMOS.forEach((tomo, idx) => {
      const [title, desc, url] = tomo;
      results.push({
        id: `libro-tomo-${idx}`,
        title: title,
        materia: 'Tomo / Libro Oficial',
        author: 'CEPREUNSA / CEPREQUINTOS',
        url: url,
        driveUrl: url,
        type: 'pdf',
        icon: '📚',
        desc: desc
      });
    });
  }

  // 2. Firestore: 'libros' collection
  try {
    const qL = query(collection(db, 'libros'), limit(15));
    const snap = await safeGetDocs(qL);
    snap.docs.forEach(d => {
      const lb = d.data();
      if (cleanQ && !cleanText(lb.titulo).includes(cleanQ) && !cleanText(lb.autor).includes(cleanQ)) return;
      results.push({
        id: `fs-libro-${d.id}`,
        title: lb.titulo,
        materia: lb.categoria || 'Biblioteca RASTRO',
        author: lb.autor || 'Editorial',
        url: lb.enlace || lb.url,
        driveUrl: lb.enlace || lb.url,
        type: 'pdf',
        icon: '📚',
        desc: lb.descripcion || ''
      });
    });
  } catch (e) {}

  // 3. Firestore uploads con categoría 'tomos'
  try {
    const qU = query(collection(db, 'uploads'), where('category', '==', 'tomos'), limit(10));
    const snap = await safeGetDocs(qU);
    snap.docs.forEach(d => {
      const up = d.data();
      if (up.oculto || up.hidden) return;
      results.push({
        id: `upload-tomo-${d.id}`,
        title: up.title,
        materia: up.categoriaLabel || 'Tomo / Libro',
        author: up.author || 'Comunidad RASTRO',
        url: up.url || up.driveUrl,
        driveUrl: up.driveUrl || up.url,
        type: 'pdf',
        icon: '📚',
        desc: up.desc || ''
      });
    });
  } catch (e) {}

  return {
    success: true,
    toolName: 'buscarLibros',
    items: results,
    totalFound: results.length,
    followUp: `Libros y tomos encontrados en la Biblioteca RASTRO:`,
    suggestions: ['Tomos CEPREUNSA', 'Prácticas', 'Simulacros']
  };
}

// -----------------------------------------------------------------------------
// TOOL 5: BUSCAR EXÁMENES Y SIMULACROS
// -----------------------------------------------------------------------------
export async function toolBuscarExamenes(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const cleanQ = cleanText(params.query || '');

  const results = [];

  // 1. Preguntas de práctica reales (DEFAULT_EXAM_QUESTIONS)
  if (Array.isArray(DEFAULT_EXAM_QUESTIONS)) {
    DEFAULT_EXAM_QUESTIONS.forEach((q, idx) => {
      if (materia && !matchesMateria(q.subject, materia)) return;
      if (cleanQ && !cleanText(q.q).includes(cleanQ) && !cleanText(q.subject).includes(cleanQ)) return;

      results.push({
        id: `exam-question-${idx}`,
        title: `Pregunta de ${q.subject}: ${q.q.substring(0, 55)}...`,
        materia: q.subject,
        categoria: 'Examen de Admisión',
        question: q.q,
        options: q.options || [],
        correctAnswer: q.ans,
        explanation: q.explanation || '',
        year: q.year || '2024',
        type: 'examen',
        icon: '📝'
      });
    });
  }

  // 2. Tomo de Exámenes Pasados (Drive)
  if (Array.isArray(TOMOS) && TOMOS[2]) {
    results.unshift({
      id: 'tomo-examenes-pasados',
      title: TOMOS[2][0] || 'Exámenes de Admisión Pasados',
      materia: 'Todas las Áreas',
      categoria: 'Banco de Exámenes',
      author: 'Comisión de Admisión',
      url: TOMOS[2][2],
      driveUrl: TOMOS[2][2],
      type: 'drive',
      icon: '📝',
      desc: TOMOS[2][1]
    });
  }

  // 3. Firestore: 'uploads' categoría 'examenes'
  try {
    const qEx = query(collection(db, 'uploads'), where('category', '==', 'examenes'), limit(8));
    const snap = await safeGetDocs(qEx);
    snap.docs.forEach(d => {
      const it = d.data();
      if (it.oculto || it.hidden) return;
      results.push({
        id: `up-exam-${d.id}`,
        title: it.title,
        materia: it.categoriaLabel || 'Examen',
        categoria: 'Examen Pasado',
        author: it.author || 'Comunidad RASTRO',
        url: it.url || it.driveUrl,
        driveUrl: it.driveUrl || it.url,
        type: 'pdf',
        icon: '📝',
        desc: it.desc || ''
      });
    });
  } catch (e) {}

  return {
    success: true,
    toolName: 'buscarExamenes',
    items: results,
    totalFound: results.length,
    followUp: `Exámenes y preguntas de práctica encontrados para tu preparación:`,
    suggestions: ['Practicar examen', 'Ponderación de puntajes', 'Ver tomos']
  };
}

// -----------------------------------------------------------------------------
// TOOL 6: BUSCAR PUBLICACIONES Y APORTES COMUNITARIOS
// -----------------------------------------------------------------------------
export async function toolBuscarPublicaciones(params = {}) {
  const cleanQ = cleanText(params.query || '');
  const results = [];

  try {
    const qUp = query(
      collection(db, 'uploads'),
      where('oculto', '==', false),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await safeGetDocs(qUp);
    snap.docs.forEach(d => {
      const up = d.data();
      if (up.hidden || (up.reportsCount || 0) >= 3) return;
      if (cleanQ && !cleanText(up.title).includes(cleanQ) && !cleanText(up.desc).includes(cleanQ)) return;

      results.push({
        id: `post-${d.id}`,
        title: up.title,
        author: up.author || up.uploadedBy?.name || 'Estudiante RASTRO',
        categoria: up.categoriaLabel || 'Aporte',
        desc: up.desc || '',
        url: up.url || up.driveUrl,
        driveUrl: up.driveUrl || up.url,
        type: 'publicacion',
        icon: '📢'
      });
    });
  } catch (e) {}

  return {
    success: true,
    toolName: 'buscarPublicaciones',
    items: results,
    totalFound: results.length,
    followUp: `Últimas publicaciones y aportes de la comunidad en RASTRO:`,
    suggestions: ['Subir material', 'Ver biblioteca', 'Buscar cursos']
  };
}

// -----------------------------------------------------------------------------
// TOOL 7: BUSCAR PERFILES PÚBLICOS
// Respeta estrictamente la privacidad: SOLO campos públicos autorizados
// Si el usuario quiere mensajear, incluye link al chat
// -----------------------------------------------------------------------------
export async function toolBuscarPerfiles(params = {}) {
  const cleanQ = cleanText(params.query || params.username || '');
  const quiereMensajear = cleanQ.includes('mensaje') || cleanQ.includes('escribir') || cleanQ.includes('hablar') || cleanQ.includes('mandar') || cleanQ.includes('decirle');
  const results = [];

  if (!cleanQ) {
    return {
      success: true,
      toolName: 'buscarPerfiles',
      items: [],
      totalFound: 0,
      followUp: '¿Qué usuario o compañero buscas? Escribe su nombre o nombre de usuario.',
      suggestions: ['Mi perfil', 'Aliados de RASTRO']
    };
  }

  try {
    const qUsers = query(collection(db, 'usuarios'), limit(15));
    const snap = await safeGetDocs(qUsers);
    snap.docs.forEach(d => {
      const u = d.data();
      const nameMatch = cleanText(u.displayName || '').includes(cleanQ);
      const userMatch = cleanText(u.username || '').includes(cleanQ);
      if (!nameMatch && !userMatch) return;

      // SOLO campos estrictamente públicos
      const perfil = {
        id: `user-${d.id}`,
        title: u.displayName || u.username || 'Estudiante RASTRO',
        username: u.username ? `@${u.username}` : '',
        carrera: u.carrera || 'Postulante',
        universidad: u.universidad || 'UNSA',
        isAlly: Boolean(u.isAlly),
        uploadCount: u.uploadCount || 0,
        photoURL: u.photoURL || null,
        profileUrl: `/usuario/${d.id}`,
        type: 'perfil',
        icon: '👤'
      };

      // Si quiere mensajear, agregar link al chat
      if (quiereMensajear) {
        perfil.chatUrl = `/chats?with=${d.id}`;
        perfil.actionLabel = `💬 Mandar mensaje a ${u.username || u.displayName}`;
      }

      results.push(perfil);
    });
  } catch (e) {}

  const followUp = results.length > 0
    ? (quiereMensajear
      ? `Encontré ${results.length} usuario${results.length === 1 ? '' : 's'}. Haz clic en "Mandar mensaje" para abrir el chat:`
      : `Perfiles encontrados en la comunidad:`)
    : `No encontré un perfil con ese nombre.`;

  return {
    success: true,
    toolName: 'buscarPerfiles',
    items: results,
    totalFound: results.length,
    followUp,
    suggestions: ['Ver mi perfil', 'Ir a la comunidad']
  };
}

// -----------------------------------------------------------------------------
// TOOL 8: BUSCAR SEMANAS DISPONIBLES
// -----------------------------------------------------------------------------
export async function toolBuscarSemanas(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const weeks = [];

  if (Array.isArray(BRICENO_2027)) {
    BRICENO_2027.forEach(w => {
      const subjectCount = (w.data || []).length;
      let hasTarget = false;
      if (materia) {
        hasTarget = (w.data || []).some(c => matchesMateria(c.nombre, materia));
      }
      weeks.push({
        id: `semana-${w.num}`,
        num: w.num,
        title: w.nombre || `Semana ${w.num}`,
        status: w.status || 'Disponible',
        subjectCount,
        hasTargetMateria: hasTarget,
        type: 'semana',
        icon: '📅'
      });
    });
  }

  const matName = materia ? (MATERIA_CANONICAL[materia] || materia) : '';
  const filteredWeeks = materia ? weeks.filter(w => w.hasTargetMateria) : weeks;

  return {
    success: true,
    toolName: 'buscarSemanas',
    items: filteredWeeks,
    totalFound: filteredWeeks.length,
    followUp: materia 
      ? `En Briceño 2027 hay clases de ${matName} en las siguientes semanas:`
      : `Las semanas disponibles en el ciclo Briceño 2027 son:`,
    suggestions: filteredWeeks.slice(0, 4).map(w => `la ${w.num}`)
  };
}

// -----------------------------------------------------------------------------
// TOOL 9: BUSCAR NUEVOS (¿Y hay nuevos?)
// Consulta los uploads más recientes o las semanas más recientes
// -----------------------------------------------------------------------------
export async function toolBuscarNuevos(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;
  const semana = params.semana !== undefined ? params.semana : (context.semana !== undefined ? context.semana : null);
  const results = [];

  // 1. Revisar uploads recientes en Firestore
  try {
    const qRecent = query(
      collection(db, 'uploads'),
      where('oculto', '==', false),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await safeGetDocs(qRecent);
    snap.docs.forEach(d => {
      const up = d.data();
      if (up.hidden || (up.reportsCount || 0) >= 3) return;

      if (materia) {
        const cTitle = cleanText(up.title || '');
        const cDesc = cleanText(up.desc || '');
        if (!cTitle.includes(cleanText(materia)) && !cDesc.includes(cleanText(materia))) {
          return;
        }
      }

      results.push({
        id: `new-upload-${d.id}`,
        title: up.title,
        materia: up.categoriaLabel || (materia ? MATERIA_CANONICAL[materia] || materia : 'Comunidad'),
        categoria: 'Subido recientemente',
        author: up.author || 'Comunidad RASTRO',
        url: up.url || up.driveUrl,
        driveUrl: up.driveUrl || up.url,
        type: 'material',
        icon: '✨',
        desc: up.desc || 'Nuevo material aportado'
      });
    });
  } catch (e) {}

  // 2. Si se consultó por una materia o semana específica en el contexto,
  // mostrar las clases más avanzadas o recientes del ciclo
  if (Array.isArray(BRICENO_2027) && results.length < 3) {
    const activeWeeks = BRICENO_2027.filter(w => w.status === 'activo' || w.num >= 3).slice(-3);
    activeWeeks.forEach(w => {
      (w.data || []).forEach(course => {
        if (materia && !matchesMateria(course.nombre, materia)) return;
        (course.videos || []).slice(0, 1).forEach((vid, vIdx) => {
          results.push({
            id: `new-briceno-${w.num}-${course.nombre}-${vIdx}`,
            title: vid.nombre || `Nueva clase ${w.nombre}`,
            materia: course.nombre,
            semana: w.num,
            semanaLabel: `${w.nombre} (Último ciclo)`,
            academia: 'Academia Briceño',
            url: vid.url,
            driveUrl: vid.url?.includes('drive.google.com') ? vid.url : null,
            type: 'video',
            icon: '🆕'
          });
        });
      });
    });
  }

  const matName = materia ? (MATERIA_CANONICAL[materia] || materia) : '';

  return {
    success: true,
    toolName: 'buscarNuevos',
    items: results,
    totalFound: results.length,
    followUp: results.length > 0
      ? `Revisé lo más reciente${matName ? ` para ${matName}` : ''}:`
      : `No hay actualizaciones adicionales recientes para ${matName || 'este filtro'}.`,
    suggestions: ['Ver videos', 'Buscar exámenes', 'Ver tomos']
  };
}

// -----------------------------------------------------------------------------
// TOOL 10: COMPARAR RECURSOS O ÁREAS
// -----------------------------------------------------------------------------
export async function toolCompararRecursos(params = {}, context = {}) {
  const materia = params.materia || context.materia || null;

  // Si se trata de materias o áreas del simulador, comparar ponderaciones
  const items = [];
  if (datosSimulador) {
    ['Sociales', 'Ingenierías', 'Biomédicas'].forEach(areaKey => {
      const areaData = datosSimulador[areaKey] || [];
      const matched = materia 
        ? areaData.filter(a => matchesMateria(a.asignatura, materia) || matchesMateria(a.curso, materia))
        : areaData.slice(0, 3);

      matched.forEach((m, idx) => {
        items.push({
          id: `comp-${areaKey}-${idx}`,
          title: `${m.asignatura} (${areaKey})`,
          materia: m.curso,
          categoria: `Ponderación: ${m.valor} pts/pregunta`,
          desc: `${m.preguntas} preguntas en el examen de admisión ${areaKey}.`,
          type: 'comparacion',
          icon: '⚖️'
        });
      });
    });
  }

  return {
    success: true,
    toolName: 'compararRecursos',
    items,
    totalFound: items.length,
    followUp: materia
      ? `Comparación de ${MATERIA_CANONICAL[materia] || materia} entre áreas del simulador de admisión:`
      : `Comparativa de asignaturas y ponderaciones por área:`,
    suggestions: ['Simulador Biomédicas', 'Simulador Ingenierías', 'Simulador Sociales']
  };
}

// -----------------------------------------------------------------------------
// TOOL 11: ABRIR RECURSO
// -----------------------------------------------------------------------------
export async function toolAbrirRecurso(params = {}, context = {}) {
  return {
    success: true,
    toolName: 'abrirRecurso',
    items: [],
    totalFound: 0,
    followUp: 'Haz clic en [Ver video] o [Vista previa] en la tarjeta que deseas abrir directamente.',
    suggestions: []
  };
}

// -----------------------------------------------------------------------------
// TOOL 12: CONOCIMIENTO (Q&A breve tipo Siri + búsqueda en publicaciones)
// -----------------------------------------------------------------------------
export async function toolConocimiento(params = {}, context = {}) {
  const query = params.query || params.materia || params.queryText || '';
  
  // 1. Primero buscar en la base de conocimiento estática
  const knowledge = searchKnowledge(query);
  
  if (knowledge.found) {
    const responseText = getKnowledgeResponse(knowledge);
    return {
      success: true,
      toolName: 'conocimiento',
      items: [],
      totalFound: 0,
      followUp: responseText,
      suggestions: ['Ver videos', 'Ver material', 'Simulacro'],
      knowledgeData: knowledge
    };
  }
  
  // 2. Si no encontró en conocimiento estático, buscar en publicaciones de Firestore
  try {
    const cleanQ = cleanText(query);
    if (cleanQ && cleanQ.length >= 2) {
      const qUploads = query(
        collection(db, 'uploads'),
        where('oculto', '==', false),
        limit(5)
      );
      const snap = await safeGetDocs(qUploads, 3000);
      const matchingUploads = [];
      
      snap.docs.forEach(d => {
        const item = d.data();
        if (item.hidden || (item.reportsCount || 0) >= 3) return;
        
        const title = cleanText(item.title || '');
        const desc = cleanText(item.desc || '');
        const cat = cleanText(item.categoriaLabel || item.category || '');
        
        if (title.includes(cleanQ) || desc.includes(cleanQ) || cat.includes(cleanQ)) {
          matchingUploads.push({
            id: `upload-${d.id}`,
            title: item.title,
            materia: item.categoriaLabel || 'Material',
            author: item.author || 'Comunidad RASTRO',
            url: item.url || item.driveUrl,
            type: 'material',
            icon: '📄',
            desc: item.desc || ''
          });
        }
      });
      
      if (matchingUploads.length > 0) {
        const items = matchingUploads.slice(0, 3);
        return {
          success: true,
          toolName: 'conocimiento',
          items,
          totalFound: items.length,
          followUp: `Encontré ${items.length} publicación${items.length > 1 ? 'es' : ''} relacionada${items.length > 1 ? 's' : ''} en la comunidad:`,
          suggestions: ['Ver más publicaciones', 'Buscar videos', 'Subir material']
        };
      }
    }
  } catch (e) {
    // Silenciar errores de Firestore
  }
  
  // 3. Si no encontró nada, dar respuesta genérica con sugerencias
  return {
    success: true,
    toolName: 'conocimiento',
    items: [],
    totalFound: 0,
    followUp: 'No tengo información específica sobre eso. ¿Quieres que busque videos, material o cursos de alguna materia?',
    suggestions: ['Videos de biología', 'Material de química', 'Simulacros', 'Ver cursos']
  };
}

// -----------------------------------------------------------------------------
// REGISTRO DE TODAS LAS TOOLS EN EL MOTOR DE ORSTTY
// -----------------------------------------------------------------------------
export function registerAllRastroTools() {
  registerTool('buscarVideos', toolBuscarVideos);
  registerTool('buscarMaterial', toolBuscarMaterial);
  registerTool('buscarCursos', toolBuscarCursos);
  registerTool('buscarLibros', toolBuscarLibros);
  registerTool('buscarExamenes', toolBuscarExamenes);
  registerTool('buscarPublicaciones', toolBuscarPublicaciones);
  registerTool('buscarPerfiles', toolBuscarPerfiles);
  registerTool('buscarSemanas', toolBuscarSemanas);
  registerTool('buscarNuevos', toolBuscarNuevos);
  registerTool('compararRecursos', toolCompararRecursos);
  registerTool('abrirRecurso', toolAbrirRecurso);
  registerTool('conocimiento', toolConocimiento);

  // Tool para 'filtrar': si el usuario aplica un filtro de semana o materia sobre un contexto anterior
  registerTool('filtrar', async (params, context) => {
    // Si el contexto tenía 'VIDEO' o venía de buscar_videos
    if (context.tipo_recurso === 'VIDEO' || context.materia) {
      return toolBuscarVideos(params, context);
    }
    if (context.tipo_recurso === 'PDF' || context.tipo_recurso === 'LIBRO') {
      return toolBuscarMaterial(params, context);
    }
    return toolBuscarVideos(params, context);
  });
}

// Auto-registrar al importar
registerAllRastroTools();
