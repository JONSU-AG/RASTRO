// =============================================================================
// ORSTTY AVANZADO
// Horarios de estudio, modo psicólogo, info del creador, y más personalidad.
// =============================================================================

import { normalizeText } from './orstty-engine.js';

// ---------------------------------------------------------------------------
// 1. INFO DEL CREADOR Y REDES SOCIALES
// ---------------------------------------------------------------------------

const CREADOR = {
  nombre: 'RASTRO',
  descripcion: 'RASTRO es una plataforma educativa gratuita y comunitaria creada por estudiantes para estudiantes.',
  mision: 'Facilitar la preparación académica para el examen de admisión de la UNSA, de manera gratuita y solidaria.',
  mensaje: 'Si estás usando RASTRO, ya diste el primer paso. Estamos aquí para ayudarte a lograrlo. 💪',
  redes: {
    whatsapp: 'https://chat.whatsapp.com/RASTRO',
    instagram: '@rastro.educacion',
    tiktok: '@rastro.edu',
  },
  contactos: [
    'Puedes encontrarnos en nuestras redes sociales.',
    'Si tienes dudas o quieres aportar material, escríbenos por WhatsApp.',
    '¿Quieres ser aliado de RASTRO? Contáctanos por Instagram.',
  ],
  estadisticas: {
    materias: 16,
    areas: 3,
    materiasAreas: {
      Sociales: ['Raz. Lógico', 'Raz. Matemático', 'Raz. Verbal', 'Comp. Lectora', 'Álgebra', 'Aritmética', 'Geometría', 'Trigonometría', 'Historia', 'Geografía', 'Química', 'Biología', 'Física', 'Filosofía', 'Psicología', 'Ed. Cívica', 'Lenguaje', 'Literatura', 'Lectura', 'Gramática'],
      Ingenierías: ['Raz. Lógico', 'Raz. Matemático', 'Raz. Verbal', 'Comp. Lectora', 'Álgebra', 'Aritmética', 'Geometría', 'Trigonometría', 'Historia', 'Geografía', 'Química', 'Biología', 'Física', 'Filosofía', 'Psicología', 'Ed. Cívica', 'Lenguaje', 'Literatura', 'Lectura', 'Gramática'],
      Biomédicas: ['Raz. Lógico', 'Raz. Matemático', 'Raz. Verbal', 'Comp. Lectora', 'Álgebra', 'Aritmética', 'Geometría', 'Trigonometría', 'Historia', 'Geografía', 'Química', 'Biología', 'Física', 'Filosofía', 'Psicología', 'Ed. Cívica', 'Lenguaje', 'Literatura', 'Lectura', 'Gramática'],
    }
  }
};

// ---------------------------------------------------------------------------
// 2. GENERADOR DE HORARIOS DE ESTUDIO
// ---------------------------------------------------------------------------

/**
 * Genera un horario de estudio personalizado según las necesidades del usuario.
 */
export function generarHorarioEstudio(params = {}) {
  const {
    horasDiarias = 3,
    area = 'General',
    preferencias = [],
    fechaInicio = null,
    fechaExamen = null,
  } = params;

  const MATERIAS_POR_AREA = {
    Sociales: [
      { nombre: 'Raz. Matemático', peso: 1.1, color: '#FF6B6B' },
      { nombre: 'Raz. Lógico', peso: 1.12, color: '#4ECDC4' },
      { nombre: 'Raz. Verbal', peso: 1.12, color: '#45B7D1' },
      { nombre: 'Comp. Lectora', peso: 1.1, color: '#96CEB4' },
      { nombre: 'Álgebra', peso: 0.82, color: '#FFEAA7' },
      { nombre: 'Aritmética', peso: 0.82, color: '#DDA15E' },
      { nombre: 'Geometría', peso: 0.82, color: '#BC6C25' },
      { nombre: 'Trigonometría', peso: 0.86, color: '#606C38' },
      { nombre: 'Historia', peso: 1.77, color: '#283618' },
      { nombre: 'Geografía', peso: 1.76, color: '#FEFAE0' },
      { nombre: 'Química', peso: 1.11, color: '#CDB4DB' },
      { nombre: 'Biología', peso: 1.15, color: '#FFAFCC' },
      { nombre: 'Física', peso: 1.08, color: '#A2D2FF' },
      { nombre: 'Filosofía', peso: 0.89, color: '#BDE0FE' },
      { nombre: 'Psicología', peso: 0.93, color: '#FFC8DD' },
      { nombre: 'Ed. Cívica', peso: 0.89, color: '#DBE2EF' },
      { nombre: 'Lenguaje', peso: 1.7, color: '#D62828' },
      { nombre: 'Literatura', peso: 1.68, color: '#F77F00' },
      { nombre: 'Lectura Inglés', peso: 1.26, color: '#FCBF49' },
      { nombre: 'Gramática Inglés', peso: 1.24, color: '#EAE2B7' },
    ],
    Ingenierías: [
      { nombre: 'Raz. Matemático', peso: 1.1, color: '#FF6B6B' },
      { nombre: 'Raz. Lógico', peso: 1.12, color: '#4ECDC4' },
      { nombre: 'Raz. Verbal', peso: 1.12, color: '#45B7D1' },
      { nombre: 'Comp. Lectora', peso: 1.1, color: '#96CEB4' },
      { nombre: 'Álgebra', peso: 1.66, color: '#FFEAA7' },
      { nombre: 'Aritmética', peso: 1.66, color: '#DDA15E' },
      { nombre: 'Geometría', peso: 1.66, color: '#BC6C25' },
      { nombre: 'Trigonometría', peso: 1.7, color: '#606C38' },
      { nombre: 'Historia', peso: 1.29, color: '#283618' },
      { nombre: 'Geografía', peso: 1.21, color: '#FEFAE0' },
      { nombre: 'Química', peso: 1.43, color: '#CDB4DB' },
      { nombre: 'Biología', peso: 1.15, color: '#FFAFCC' },
      { nombre: 'Física', peso: 1.52, color: '#A2D2FF' },
      { nombre: 'Filosofía', peso: 0.8, color: '#BDE0FE' },
      { nombre: 'Psicología', peso: 0.8, color: '#FFC8DD' },
      { nombre: 'Ed. Cívica', peso: 0.8, color: '#DBE2EF' },
      { nombre: 'Lenguaje', peso: 1.02, color: '#D62828' },
      { nombre: 'Literatura', peso: 0.97, color: '#F77F00' },
      { nombre: 'Lectura Inglés', peso: 1.26, color: '#FCBF49' },
      { nombre: 'Gramática Inglés', peso: 1.24, color: '#EAE2B7' },
    ],
    Biomédicas: [
      { nombre: 'Raz. Matemático', peso: 1.1, color: '#FF6B6B' },
      { nombre: 'Raz. Lógico', peso: 1.12, color: '#4ECDC4' },
      { nombre: 'Raz. Verbal', peso: 1.12, color: '#45B7D1' },
      { nombre: 'Comp. Lectora', peso: 1.1, color: '#96CEB4' },
      { nombre: 'Álgebra', peso: 1.27, color: '#FFEAA7' },
      { nombre: 'Aritmética', peso: 1.27, color: '#DDA15E' },
      { nombre: 'Geometría', peso: 1.27, color: '#BC6C25' },
      { nombre: 'Trigonometría', peso: 1.2, color: '#606C38' },
      { nombre: 'Historia', peso: 1.12, color: '#283618' },
      { nombre: 'Geografía', peso: 1.1, color: '#FEFAE0' },
      { nombre: 'Química', peso: 1.68, color: '#CDB4DB' },
      { nombre: 'Biología', peso: 1.95, color: '#FFAFCC' },
      { nombre: 'Física', peso: 1.48, color: '#A2D2FF' },
      { nombre: 'Filosofía', peso: 0.8, color: '#BDE0FE' },
      { nombre: 'Psicología', peso: 0.8, color: '#FFC8DD' },
      { nombre: 'Ed. Cívica', peso: 0.8, color: '#DBE2EF' },
      { nombre: 'Lenguaje', peso: 1.02, color: '#D62828' },
      { nombre: 'Literatura', peso: 0.97, color: '#F77F00' },
      { nombre: 'Lectura Inglés', peso: 1.26, color: '#FCBF49' },
      { nombre: 'Gramática Inglés', peso: 1.24, color: '#EAE2B7' },
    ],
  };

  const materias = MATERIAS_POR_AREA[area] || MATERIAS_POR_AREA['General'];

  // Ordenar por peso (ponderación) descendente
  const materiasOrdenadas = [...materias].sort((a, b) => b.peso - a.peso);

  // Generar horario semanal
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horasPorDia = horasDiarias;

  const horario = [];
  let materiaIdx = 0;

  dias.forEach(dia => {
    const bloquesDia = [];
    for (let h = 0; h < horasPorDia && materiaIdx < materiasOrdenadas.length; h++) {
      const materia = materiasOrdenadas[materiaIdx % materiasOrdenadas.length];
      bloquesDia.push({
        hora: `${8 + h}:00 - ${9 + h}:00`,
        materia: materia.nombre,
        peso: materia.peso,
        color: materia.color,
        consejo: getConsejoMateria(materia.nombre),
      });
      materiaIdx++;
    }
    horario.push({ dia, bloques: bloquesDia });
  });

  return {
    area,
    horasDiarias,
    horario,
    consejosGenerales: [
      'Descansa 5 minutos cada hora de estudio.',
      'Toma agua regularmente.',
      'Haz ejercicios de stretching entre sesiones.',
      'Duerme al menos 7 horas para consolidar la memoria.',
      'Practica con simulacros los fines de semana.',
    ],
    tipFinal: `Para el área de ${area}, las materias con mayor ponderación son: ${materiasOrdenadas.slice(0, 5).map(m => m.nombre).join(', ')}. Enfócate especialmente en ellas.`,
  };
}

function getConsejoMateria(materia) {
  const consejos = {
    'Raz. Matemático': 'Practica problemas de lógica numérica y series.',
    'Raz. Lógico': 'Resuelve secuencias y patrones lógicos.',
    'Raz. Verbal': 'Lee párrafos y practica inferencia.',
    'Comp. Lectora': 'Lee con atención y subraya la idea principal.',
    'Álgebra': 'Domina ecuaciones y desigualdades.',
    'Aritmética': 'Practica operaciones y regla de tres.',
    'Geometría': 'Dibuja figuras y memoriza fórmulas.',
    'Trigonometría': 'Repasa funciones trigonométricas y identidades.',
    'Historia': 'Crea líneas de tiempo de los eventos más importantes.',
    'Geografía': 'Estudia mapas y datos geográficos del Perú.',
    'Química': 'Domina la tabla periódica y reacciones.',
    'Biología': 'Memoriza sistemas del cuerpo y genética.',
    'Física': 'Resuelve problemas con diagramas de fuerzas.',
    'Filosofía': 'Estudia corrientes y filósofos principales.',
    'Psicología': 'Aprende escuelas psicológicas y desarrollo.',
    'Ed. Cívica': 'Repasa constitución y derechos ciudadanos.',
    'Lenguaje': 'Practica gramática y ortografía.',
    'Literatura': 'Estudia géneros literarios y autores.',
    'Lectura Inglés': 'Lee textos en inglés y vocabulario.',
    'Gramática Inglés': 'Repasa tiempos verbales y estructuras.',
  };
  return consejos[materia] || 'Estudia esta materia con constancia.';
}

// ---------------------------------------------------------------------------
// 3. MODO PSICÓLOGO / CONSEJERO EMOCIONAL
// ---------------------------------------------------------------------------

const PSICOLOGIA_RESPUESTAS = {
  ANSIEDAD: [
    'La ansiedad es normal antes de un examen. Respira profundo: inhala 4 segundos, sostén 4, exhala 4. Repite 3 veces. 🧘',
    'Si sientes ansiedad, recuerda: estás preparándote y eso ya es un logro. No eres tu ansiedad. 💪',
    'La ansiedad viene del miedo al futuro. Vuelve al presente: ¿qué puedes hacer HOY? Solo hoy.',
    'Técnica 5-4-3-2-1: Mira 5 cosas, toca 4, escucha 3, huele 2, saborea 1. Te ancla al momento. 🌟',
  ],
  ESTRES: [
    'El estrés es tu cuerpo diciéndote que necesitas pausa. ¿Cuándo fue tu último descanso real?',
    'Divide las tareas grandes en partes pequeñas. Comes elefante un bocado a la vez. 🐘',
    'El estrés no desaparece, pero puedes aprender a manejarlo. ¿Necesitas que busque algo de relax?',
    'A veces el mejor estudio es NO estudiar un rato. Tu cerebro necesita consolidar. 😴',
  ],
  MIEDO_EXAMEN: [
    'Es normal tener miedo. Significa que te importa. Pero recuerda: ya has estudiado, confía en ti.',
    'El examen no define quién eres. Es solo un paso. Pase lo que pase, seguirás adelante. 🌈',
    'Muchos han pasado por donde tú estás y lo lograron. Tú también puedes. 💪',
    'El miedo se enfrenta con preparación. Y tú estás aquí, preparándote. Eso ya vale mucho.',
  ],
  NOVOY_PODER: [
    'Sí vas a poder. Tal vez no hoy, tal vez no mañana, pero vas a llegar. Confía.',
    'Esa frase "no voy a poder" es solo una historia que te cuentas. No es verdad aún.',
    'Recuerda cada vez que superaste algo difícil. Lo hiciste antes, lo harás de nuevo. 🌟',
    'Está bien dudar, pero no te quedes ahí. ¿Qué puedes hacer ahora mismo para avanzar?',
  ],
  AGOTAMIENTO: [
    'Si estás agotado, tu cuerpo te está pidiendo descanso. Escúchalo.',
    'El agotamiento no es debilidad, es señal de que has dado mucho. Descansa y vuelve con energía.',
    'A veces el mejor producto es el descanso. No eres una máquina. 😴',
    '¿Cuántas horas llevas estudiando seguidas? Tómate 20 minutos. Tu cerebro lo necesita.',
  ],
  SOLEDAD: [
    'Estudiar puede sentirse solo, pero no lo estás. RASTRO está lleno de estudiantes como tú.',
  ],
  PRESION_FAMILIA: [
    'La presión familiar es difícil. Recuerda que tu proceso es tuyo, nadie más.',
  ],
  CONFUSION: [
    'Está bien confundirse. Significa que estás aprendiendo. ¿Qué materia te genera más dudas?',
  ],
};

/**
 * Detecta el estado emocional del usuario y devuelve una respuesta empática.
 */
export function detectarEstadoEmocional(text) {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (norm.match(/\b(ansiedad|ansioso|ansiosa|nervioso|nerviosa|panico|angustia|preocupado|preocupada)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.ANSIEDAD);
  }
  if (norm.match(/\b(estres|estresado|estresada|presionado|presionada|sobrecargado|sobrecargada)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.ESTRES);
  }
  if (norm.match(/\b(miedo del examen|tengo miedo|miedo a aprobar|miedo a reprobar|que paso si no entro|que paso si reprov)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.MIEDO_EXAMEN);
  }
  if (norm.match(/\b(no voy a poder|no puedo|es muy dificil|no se si pueda|muy dificil|imposible|no llego)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.NOVOY_PODER);
  }
  if (norm.match(/\b(agotado|agotada|sin fuerzas|sin energia|muy cansado|muy cansada|burnout)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.AGOTAMIENTO);
  }
  if (norm.match(/\b(solo|solito|solita|me siento solo|me siento sola|no tengo amigos)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.SOLEDAD);
  }
  if (norm.match(/\b(presion familiar|mis padres me presionan|mis papas quieren|obligacion|me obligan)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.PRESION_FAMILIA);
  }
  if (norm.match(/\b(confundido|confundida|no entiendo nada|todo es confuso|perdido|perdida)\b/)) {
    return pickRandom(PSICOLOGIA_RESPUESTAS.CONFUSION);
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. CONSEJOS ESTILO VIDA DE ESTUDIANTE
// ---------------------------------------------------------------------------

const CONSEJOS_VIDA = [
  'Dormir bien es tan importante como estudiar. El cerebro consolida memorias mientras duermes. 😴',
  'Haz ejercicio aunque sea 20 minutos al día. La sangre fluye mejor al cerebro. 🏃',
  'Come bien. El cerebro consume el 20% de tu energía. No lo dejes sin combustible. 🍎',
  'Evita las pantallas 1 hora antes de dormir. El azul luz interfiere con el sueño. 📵',
  'Estudiar en intervalos (Pomodoro) es más efectivo que sesiones largas. 25 min estudio, 5 min descanso.',
  'Hidrátate. El cerebro es 75% agua. Si estás deshidratado, piensas más lento. 💧',
  'Haz resúmenes a mano. Escribir ayuda a memorizar más que leer. ✍️',
  'Enseña lo que aprendiste. Si puedes explicárselo a alguien más, es que lo entendiste. 🎓',
  'No compares tu progreso con el de otros. Tu camino es único. 🌟',
  'Celebra los pequeños logros. Cada tema que dominas es un paso adelante. 🎉',
];

/**
 * Devuelve un consejo aleatorio de estilo de vida.
 */
export function getConsejoVida() {
  return pickRandom(CONSEJOS_VIDA);
}

// ---------------------------------------------------------------------------
// 5. DETECTOR DE INTENCIONES AVANZADO
// ---------------------------------------------------------------------------

/**
 * Detecta si el mensaje requiere respuesta avanzada (horario, psicólogo, creador, etc.)
 */
export function detectarIntencionAvanzada(text) {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Horarios de estudio (con tolerancia a typos)
  if (norm.match(/\b(horario|horarios|horario de estudio|horario de estudios|como organizo mi tiempo|organizar mi tiempo|plan de estudio|plan de estudios|planifica|como estudio|rutina|rutina de estudio|quiero un horario|crea un horario|hazme un horario|genera un horario|generame un horario|generar un horario|quiero horario|dame un horario|dame horario|mi horario|organiza mi horario|crea mi horario|hazme un plan|quiero mi horario|quiero crear mi horario|quiero organizar|quiero estudiar|como me organizo|organizar estudio|planes de estudio|horario de studios|horarios de estudio|mi plan de estudio|organizar estudios|estudiar|planes de studios|plan de studios|horario de estudios|necesito un horario|arregla mi horario|organizame el tiempo|como distribuyo mi tiempo|cuanto estudio al dia|ayudame a organizar|ayudame con mi horario)\b/)) {
    return { tipo: 'horario', params: extraerParamsHorario(norm) };
  }

  // Info del creador / RASTRO
  if (norm.match(/\b(quien creo|quien hizo|quien es el creador|creador de rastro|desarrollador|programador|dueño|redes sociales|redes|instagram|tiktok|whatsapp|contacto|contactar|como me comunico)\b/)) {
    return { tipo: 'creador' };
  }

  // Psicólogo / emocional
  const estadoEmocional = detectarEstadoEmocional(norm);
  if (estadoEmocional) {
    return { tipo: 'psicologo', respuesta: estadoEmocional };
  }

  // Consejos de vida
  if (norm.match(/\b(consejo|consejos|consejame|aconsejame|que me aconsejas|tips|tip|recomendacion|recomendame|como puedo mejorar|como estudiar mejor)\b/)) {
    return { tipo: 'consejo' };
  }

  return null;
}

function extraerParamsHorario(text) {
  let horas = 3;
  let area = 'General';

  if (text.match(/\b(1 hora|una hora|1h)\b/)) horas = 1;
  else if (text.match(/\b(2 horas|dos horas|2h)\b/)) horas = 2;
  else if (text.match(/\b(3 horas|tres horas|3h)\b/)) horas = 3;
  else if (text.match(/\b(4 horas|cuatro horas|4h)\b/)) horas = 4;
  else if (text.match(/\b(5 horas|cinco horas|5h)\b/)) horas = 5;
  else if (text.match(/\b(6 horas|seis horas|6h)\b/)) horas = 6;

  if (text.match(/\b(sociales|social)\b/)) area = 'Sociales';
  else if (text.match(/\b(ingenieria|ingenierias|ingeniero|ing)\b/)) area = 'Ingenierías';
  else if (text.match(/\b(biomedicas|biomedicina|biomedico|medicina|med)\b/)) area = 'Biomédicas';

  return { horasDiarias: horas, area };
}

// ---------------------------------------------------------------------------
// 6. RESPUESTAS INTELIGENTES SEGÚN CONTEXTO
// ---------------------------------------------------------------------------

/**
 * Genera una respuesta inteligente basada en el contexto de la conversación.
 */
export function generarRespuestaContextual(intencion, params = {}) {
  const { tipo, respuesta, params: intencionParams } = intencion;

  switch (tipo) {
    case 'horario': {
      const horario = generarHorarioEstudio(intencionParams || params);
      let texto = `📅 **Horario de Estudio Personalizado**\n\n`;
      texto += `Área: ${horario.area} | Horas diarias: ${horario.horasDiarias}\n\n`;
      horario.horario.forEach(dia => {
        texto += `**${dia.dia}:**\n`;
        dia.bloques.forEach(b => {
          texto += `  ${b.hora} → ${b.materia} (${b.peso} pts/preg)\n`;
        });
      });
      texto += `\n💡 ${horario.tipFinal}`;
      return texto;
    }

    case 'creador': {
      return `👨‍💻 **Sobre RASTRO:**\n\n${CREADOR.descripcion}\n\n📜 **Misión:** ${CREADOR.mision}\n\n💬 **Redes:**\n📱 WhatsApp: ${CREADOR.redes.whatsapp}\n📸 Instagram: ${CREADOR.redes.instagram}\n🎵 TikTok: ${CREADOR.redes.tiktok}\n\n${CREADOR.mensaje}`;
    }

    case 'psicologo': {
      return respuesta;
    }

    case 'consejo': {
      return getConsejoVida();
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// UTILIDAD
// ---------------------------------------------------------------------------

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Función principal que integra todo.
 */
export function procesarIntencionAvanzada(text) {
  const intencion = detectarIntencionAvanzada(text);
  if (!intencion) return null;
  return generarRespuestaContextual(intencion);
}
