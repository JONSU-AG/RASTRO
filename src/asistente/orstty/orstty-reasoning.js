// =============================================================================
// ORSTTY REASONING ENGINE - Cerebro de Comprensión y Razonamiento para RASTRO
// Entiende toda la estructura de la aplicación, ponderaciones UNSA,
// temarios oficiales, métodos de estudio y explicaciones académicas profundas.
// =============================================================================

import { normalizeBase } from './orstty-search-indexer.js';
import { datosSimulador } from '../../data/simuladorData.js';

// -----------------------------------------------------------------------------
// 1. MAPA COMPLETO DE LA APLICACIÓN WEB RASTRO
// -----------------------------------------------------------------------------
export const APP_SECTIONS = {
  CURSOS: {
    path: '/cursos',
    title: 'Cursos y Academias',
    desc: 'Catálogo con Academia Briceño (2027/2026), Academia Esparta (18 materias YouTube) y Academia Kelsen (Grabaciones Oficiales Drive).',
    action: 'Ver cursos',
    keywords: ['cursos', 'curso', 'cursoo', 'academias', 'academia', 'clases', 'briceno', 'esparta', 'kelsen', 'donde estudio', 'donde estudiar']
  },
  SIMULADOR: {
    path: '/simulador',
    title: 'Simulador de Admisión UNSA',
    desc: 'Simulador con cronómetro real, cálculo de puntajes por ponderación oficial (Sociales, Ingenierías y Biomédicas) y banco de preguntas.',
    action: 'Ir al Simulador',
    keywords: ['simulador', 'simulacro', 'examen', 'cronometro', 'practicar preguntas', 'calcular puntaje', 'puntaje unsa']
  },
  BIBLIOTECA: {
    path: '/biblioteca',
    title: 'Biblioteca Digital',
    desc: 'Tomos oficiales CEPREUNSA / CEPREQUINTOS, libros Lumbreras, compendios y separatas compartidas por la comunidad.',
    action: 'Abrir Biblioteca',
    keywords: ['biblioteca', 'libros', 'libro', 'tomo', 'tomos', 'cepreunsa libros', 'lumbreras', 'descargar pdf']
  },
  SUBIR: {
    path: '/subir',
    title: 'Aportar Material',
    desc: 'Módulo comunitario para subir tus apuntes, resúmenes, exámenes pasados o separatas para ayudar a otros postulantes.',
    action: 'Subir material',
    keywords: ['subir', 'aportar', 'compartir apuntes', 'subir pdf', 'subir material', 'donar material']
  },
  AVISOS: {
    path: '/avisos',
    title: 'Tablón de Avisos',
    desc: 'Comunicados, cronogramas de admisión, novedades de la plataforma y avisos de la comunidad estudiantil.',
    action: 'Ver avisos',
    keywords: ['avisos', 'noticias', 'comunicados', 'cronograma admision', 'fechas examen', 'cuando es el examen']
  },
  PERFIL: {
    path: '/perfil',
    title: 'Perfil de Estudiante',
    desc: 'Tu progreso, materiales favoritos guardados, estadísticas de estudio y configuración de cuenta.',
    action: 'Mi Perfil',
    keywords: ['perfil', 'mi cuenta', 'favoritos', 'guardados', 'mis notas', 'progreso']
  }
};

// -----------------------------------------------------------------------------
// 2. CONOCIMIENTO DE PONDERACIONES Y CARRERAS UNSA
// -----------------------------------------------------------------------------
export const UNSA_CAREERS_MATRIX = {
  BIOMEDICAS: {
    nombre: 'Área de Biomédicas',
    carreras: [
      'Medicina', 'Medicina Humana', 'Enfermería', 'Biología', 'Nutrición', 
      'Farmacia', 'Bioquímica', 'Farmacia y Bioquímica', 'Odontología'
    ],
    materiasClave: ['Biología', 'Anatomía', 'Química', 'Física', 'Razonamiento Verbal', 'Razonamiento Lógico'],
    estrategia: 'En Biomédicas, Biología y Química concentran la mayor cantidad de puntos específicos, junto con un puntaje sólido en RV y Anatomía. No descuides Física elemental ni RM.',
    recomendacion: 'Estudia primero los ciclos celulares (mitosis/meiosis), genética mendeliana, sistemas del cuerpo humano en Anatomía y estequiometría/química orgánica.'
  },
  INGENIERIAS: {
    nombre: 'Área de Ingenierías',
    carreras: [
      'Sistemas', 'Ingeniería de Sistemas', 'Civil', 'Ingeniería Civil', 'Industrial', 
      'Ingeniería Industrial', 'Mecánica', 'Ingeniería Mecánica', 'Eléctrica', 'Ingeniería Eléctrica', 
      'Química', 'Ingeniería Química', 'Geología', 'Ingeniería Geológica', 'Minas', 'Ingeniería de Minas', 
      'Arquitectura', 'Computación', 'Ciencia de la Computación'
    ],
    materiasClave: ['Matemática (Álgebra, Aritmética, Geometría, Trigonometría)', 'Física', 'Química', 'Razonamiento Matemático (RM)', 'Razonamiento Lógico (RL)'],
    estrategia: 'En Ingenierías, los bloques de Matemáticas y Física representan más del 50% del examen. La rapidez operativa en RM y Álgebra marca la diferencia de ingreso.',
    recomendacion: 'Domina cinemática, dinámica y trabajo/energía en Física; funciones, polinomios y logaritmos en Álgebra; y geometría analítica/trigonometría.'
  },
  SOCIALES: {
    nombre: 'Área de Sociales',
    carreras: [
      'Derecho', 'Psicología', 'Economía', 'Administración', 'Contabilidad', 
      'Comunicación', 'Ciencias de la Comunicación', 'Sociología', 'Historia', 
      'Educación', 'Filosofía', 'Literatura', 'Literatura y Lingüística'
    ],
    materiasClave: ['Historia del Perú y Universal', 'Geografía', 'Economía', 'Educación Cívica / Constitución', 'Filosofía y Psicología', 'Lenguaje y Literatura', 'Razonamiento Verbal (RV)'],
    estrategia: 'En Sociales, la memoria comprensiva y el análisis crítico de textos son vitales. Las preguntas de Historia, Cívica, Filosofía y RV definen el cuadro de méritos.',
    recomendacion: 'Revisa la Constitución Política del 93 (derechos y estructura del Estado), virreinato y república en Historia, y corrientes filosóficas/literarias.'
  }
};

// -----------------------------------------------------------------------------
// 3. BASE DE CONCEPTOS ACADÉMICOS Y EXPLICACIONES PEDAGÓGICAS
// -----------------------------------------------------------------------------
export const ACADEMIC_EXPLANATIONS = {
  MITOSIS: {
    keywords: ['mitosis', 'fases de la mitosis', 'division celular', 'profase metafase anafase telofase'],
    materia: 'Biología',
    titulo: 'Mitosis: División Celular Eucariota',
    explicacion: `La **mitosis** es el proceso de división celular mediante el cual una célula madre diploide (2n) genera dos células hijas genéticamente idénticas (2n).

📌 **Fases fundamentales (Regla mnemotécnica: PRO-METE-ANA-TE):**
1. **Profase:** La cromatina se condensa en cromosomas visibles, desaparece el nucléolo y la carioteca se fragmenta. Se forma el huso mitótico.
2. **Metafase:** Los cromosomas alcanzan su máxima condensación y se alinean en la placa ecuatorial de la célula.
3. **Anafase:** Las cromátidas hermanas se separan y migran hacia polos celulares opuestos jaladas por las fibras cinetocóricas.
4. **Telofase:** Se reorganiza la membrana nuclear (carioteca) alrededor de cada grupo de cromosomas y reaparece el nucléolo.
5. **Citocinesis:** División física del citoplasma (por estrangulamiento en células animales, o por formación de fragmoplasto en vegetales).

💡 **Pregunta típica UNSA:** ¿En qué fase se observa el cariotipo con mayor nitidez? -> **Metafase**.`
  },
  MEIOSIS: {
    keywords: ['meiosis', 'crossing over', 'entrecruzamiento', 'gametogenesis'],
    materia: 'Biología',
    titulo: 'Meiosis y Variabilidad Genética',
    explicacion: `La **meiosis** es la división reduccional (2n -> n) que ocurre en las células germinales para formar gametos (óvulos y espermatozoides).

📌 **Claves para el examen:**
• **Meiosis I (Reduccional):** Reduce el número de cromosomas a la mitad.
• **Profase I:** Es la etapa más importante y larga. Se divide en Leptoteno, Cigoteno, Paquiteno, Diploteno y Diacinesis.
• **Paquiteno:** Ocurre el **Crossing Over** (entrecruzamiento génico), responsable de la variabilidad genética humana.
• **Meiosis II (Ecuacional):** Similar a una mitosis normal, separa cromátidas hermanas resultando en 4 células haploides (n).`
  },
  LEYES_NEWTON: {
    keywords: ['leyes de newton', 'newton', 'primera ley de newton', 'segunda ley de newton', 'tercera ley de newton', 'inercia accion y reaccion'],
    materia: 'Física',
    titulo: 'Las 3 Leyes del Movimiento de Newton',
    explicacion: `Las leyes de Newton fundamentan la dinámica clásica:

1. **1ra Ley (Ley de la Inercia):** Todo cuerpo permanece en reposo o con movimiento rectilíneo uniforme (MRU, velocidad constante) a menos que actúe sobre él una fuerza neta externa no nula (∑F = 0).
2. **2da Ley (Ley Fundamental de la Dinámica):** La aceleración de un cuerpo es directamente proporcional a la fuerza resultante e inversamente proporcional a su masa:
   $$\\vec{F}_{res} = m \\cdot \\vec{a}$$ (Unidad: Newtons $[N] = kg \\cdot m/s^2$).
3. **3ra Ley (Principio de Acción y Reacción):** A toda acción se opone una reacción igual en magnitud y dirección pero en sentido contrario. **Ojo UNSA:** La acción y la reacción actúan sobre **cuerpos diferentes**, por lo que nunca se anulan entre sí.`
  },
  TABLA_PERIODICA: {
    keywords: ['tabla periodica', 'electronegatividad', 'radio atomico', 'grupos y periodos', 'enlace quimico'],
    materia: 'Química',
    titulo: 'Tabla Periódica y Propiedades Periódicas',
    explicacion: `La tabla periódica moderna está ordenada según el **número atómico creciente (Z)** (Ley de Moseley).

📌 **Estructura:**
• **7 Periodos (filas horizontales):** Indican el número de niveles de energía del átomo.
• **18 Grupos (columnas verticales):** Elementos con la misma configuración electrónica externa y propiedades químicas similares.

📈 **Variación de Propiedades Periódicas en el examen:**
• **Electronegatividad (EN) y Energía de Ionización (EI):** Aumentan de izquierda a derecha en un periodo y de abajo hacia arriba en un grupo (El Flúor $F$ es el elemento más electronegativo: $EN = 4.0$).
• **Radio Atómico (RA):** Aumenta de derecha a izquierda y de arriba hacia abajo (El Francio $Fr$ es el de mayor radio).`
  },
  ECUACIONES_SEGUNDO_GRADO: {
    keywords: ['ecuacion de segundo grado', 'formula general', 'discriminante', 'raices de la ecuacion', 'ecuaciones cuadraticas'],
    materia: 'Álgebra',
    titulo: 'Ecuaciones Cuadráticas ($ax^2 + bx + c = 0$)',
    explicacion: `Para resolver una ecuación cuadrática general:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

📌 **Análisis del Discriminante ($\\Delta = b^2 - 4ac$):**
• Si $\\Delta > 0$: Dos raíces reales y diferentes.
• Si $\\Delta = 0$: Dos raíces reales e iguales (raíz única / trinomio cuadrado perfecto).
• Si $\\Delta < 0$: Raíces complejas conjugadas (sin soluciones reales).

📌 **Propiedades de las Raíces (Teorema de Cardano-Vieta):**
• Suma de raíces: $x_1 + x_2 = -\\frac{b}{a}$
• Producto de raíces: $x_1 \\cdot x_2 = \\frac{c}{a}$`
  },
  SINTAGMA_NOMINAL: {
    keywords: ['sintagma nominal', 'sujeto y predicado', 'nucleo del sujeto', 'modificadores', 'gramatica lenguaje'],
    materia: 'Lenguaje',
    titulo: 'Estructura del Sintagma Nominal (SN)',
    explicacion: `El **Sintagma Nominal** tiene como núcleo principal a un sustantivo o pronombre ($N$).

📌 **Estructura típica en el análisis oracional UNSA:**
• **Núcleo (N):** Sustantivo, pronombre o palabra sustantivada. (ej. *El **estudiante** aplicado*).
• **Modificador Directo (MD):** Artículos y adjetivos que acompañan al núcleo sin preposición intermediaria. (ej. ***El*** alumno ***responsable***).
• **Modificador Indirecto (MI):** Va encabezado por una preposición subordinante (ej. *El libro **de anatomía***).
• **Aposición (Ap):** Sustantivo o frase que reitera o aclara el núcleo. Puede ser explicativa (entre comas: *Arequipa, **la Ciudad Blanca***) o especificativa (*El profesor **Pérez***).`
  }
};

// -----------------------------------------------------------------------------
// 4. MOTOR DE RAZONAMIENTO Y DETECCIÓN INTELIGENTE
// -----------------------------------------------------------------------------

/**
 * Razona sobre la consulta del usuario analizando intenciones complejas,
 * preguntas académicas, orientación de carrera o navegación en la app.
 */
export function reasonAboutQuery(queryText, activeContext = {}) {
  const norm = normalizeBase(queryText);

  // A) PREGUNTA SOBRE CARRERA O ÁREA DE POSTULACIÓN
  for (const [key, areaData] of Object.entries(UNSA_CAREERS_MATRIX)) {
    const mentionsArea = norm.includes(key.toLowerCase()) || norm.includes(areaData.nombre.toLowerCase());
    const mentionsCareer = areaData.carreras.some(c => norm.includes(normalizeBase(c)));

    if (mentionsArea || mentionsCareer) {
      const carreraMencionada = areaData.carreras.find(c => norm.includes(normalizeBase(c)));
      let textResponse = `🎯 **Orientación de Estudio UNSA - ${areaData.nombre}**\n\n`;
      if (carreraMencionada) {
        textResponse += `Para postular a **${carreraMencionada}** (área de ${areaData.nombre}):\n\n`;
      }
      textResponse += `• **Materias con mayor peso:** ${areaData.materiasClave.join(', ')}.\n\n`;
      textResponse += `• **Estrategia recomendada:** ${areaData.estrategia}\n\n`;
      textResponse += `• **Consejo clave:** ${areaData.recomendacion}\n\n`;
      textResponse += `💡 Puedes practicar un examen completo con el tiempo y ponderación real en el **Simulador** o repasar las clases en **Cursos**.`;

      return {
        handled: true,
        type: 'carrera_orientacion',
        text: textResponse,
        suggestions: ['Ir al Simulador', 'Ver cursos', 'Tomos de la biblioteca']
      };
    }
  }

  // B) PREGUNTA GENERAL SOBRE SECCIONES O QUÉ HAY EN LA WEB
  if (norm.includes('secciones') || norm.includes('que tiene la') || norm.includes('que hay en rastro') || norm.includes('que ofrece') || norm.includes('que puedo hacer') || norm.includes('como funciona la app')) {
    let sectionsText = `🌐 **Estructura y Módulos de RASTRO**\n\nEn RASTRO tienes todo centralizado para tu preparación preuniversitaria:\n\n`;
    for (const sec of Object.values(APP_SECTIONS)) {
      sectionsText += `• **${sec.title}** (\`${sec.path}\`): ${sec.desc}\n`;
    }
    sectionsText += `\n¿A qué sección te gustaría que te guíe?`;
    return {
      handled: true,
      type: 'app_overview',
      text: sectionsText,
      suggestions: ['Ver cursos', 'Ir al Simulador', 'Abrir Biblioteca', 'Crear Horario']
    };
  }

  // B2) PREGUNTA ESPECÍFICA SOBRE SECCIONES Y FUNCIONALIDADES DE LA WEB APP
  for (const [secKey, sec] of Object.entries(APP_SECTIONS)) {
    const matchesSec = sec.keywords.some(kw => {
      const regex = new RegExp(`\\b${kw}\\b`);
      return regex.test(norm);
    });

    // Si el usuario pregunta "donde veo cursos", "como entro a la biblioteca", etc.
    if (matchesSec && (norm.includes('donde') || norm.includes('como') || norm.includes('que es') || norm.includes('abrir') || norm.includes('ver') || norm.includes('ir'))) {
      const textResponse = `📌 **${sec.title} en RASTRO (${sec.path})**\n\n${sec.desc}\n\nPuedes ingresar directamente desde la barra de navegación o haciendo clic abajo:`;
      return {
        handled: true,
        type: 'app_navigation',
        section: sec,
        text: textResponse,
        suggestions: [sec.action, 'Ver otras secciones', 'Preguntar otra duda']
      };
    }
  }

  // C) EXPLICACIONES ACADÉMICAS DIDÁCTICAS (CIENCIA, MATE, LETRAS)
  for (const [conceptKey, item] of Object.entries(ACADEMIC_EXPLANATIONS)) {
    const matchesConcept = item.keywords.some(kw => {
      const regex = new RegExp(`\\b${kw}\\b`);
      return regex.test(norm) || norm.includes(kw);
    });

    if (matchesConcept) {
      const textResponse = `📖 **${item.titulo}** (${item.materia})\n\n${item.explicacion}\n\n¿Quieres que busque videos o materiales de ${item.materia} en RASTRO para profundizar?`;
      return {
        handled: true,
        type: 'academic_explanation',
        materia: item.materia,
        text: textResponse,
        suggestions: [`Videos de ${item.materia}`, `Material de ${item.materia}`, 'Simulador']
      };
    }
  }

  // D) CONSULTAS GENERALES DE ORIENTACIÓN ("NO SÉ POR DÓNDE EMPEZAR", "CÓMO ESTUDIAR", "QUÉ ES RASTRO")
  if (norm.includes('por donde empezar') || norm.includes('como empezar') || norm.includes('no se que hacer') || norm.includes('guia de estudio') || norm.includes('como usar rastro')) {
    const guideText = `🌟 **Guía de Inicio Rápido en RASTRO**

¡Bienvenido! Aquí tienes la ruta recomendada para preparar tu ingreso a la UNSA:

1. 🎓 **Elige tu Academia y Materias:** En **/cursos** tienes las clases de Briceño (semana a semana), Esparta (18 materias en YouTube) y Kelsen (Grabaciones Drive).
2. 📚 **Descarga el Material de Apoyo:** En **/biblioteca** encuentras los Tomos Oficiales CEPREUNSA y libros Lumbreras en PDF.
3. ⏱️ **Mide tu Nivel:** En **/simulador** pon a prueba tus conocimientos con el examen cronometrado y las ponderaciones de tu área.
4. 🤖 **Pregúntame lo que necesites:** Si tienes dudas sobre un tema (ej. *mitosis*, *leyes de newton*, *química orgánica*) o buscas videos específicos, solo escríbemelo aquí.

¿Qué materia o carrera tienes en mente hoy?`;

    return {
      handled: true,
      type: 'general_guide',
      text: guideText,
      suggestions: ['Ver cursos', 'Simulador', 'Tomos CEPREUNSA']
    };
  }

  return { handled: false };
}
