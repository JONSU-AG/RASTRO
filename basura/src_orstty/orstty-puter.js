// ORSTTY Puter.js Integration - API gratuita sin key
// Usa Puter.js para respuestas IA sin necesidad de API key ni signup

// System prompt para ORSTTY
function getSystemPrompt(context = {}) {
  const { materia, semana, academia } = context;
  
  let ctx = '';
  if (materia) ctx += `El usuario estudia ${materia}. `;
  if (semana) ctx += `Está en la semana ${semana}. `;
  if (academia) ctx += `Pertenece a la academia ${academia}. `;

  return `Eres ORSTTY, el asistente de RASTRO (plataforma educativa peruana para preuniversitarios).

Reglas:
- Responde en español, breve (máximo 3 oraciones)
- Eres amigable y usas emojis
- Materias: Biología, Química, Física, Matemática, RM, RV, RL, Anatomía, Cívica, Inglés
- Puedes explicar conceptos, dar consejos de estudio, motivar
- Si no sabes algo, di "no estoy seguro pero revisa los cursos de RASTRO"

${ctx}`;
}

// Verificar si Puter.js está disponible
export function isPuterAvailable() {
  if (typeof window === 'undefined') return false;
  if (!window.puter) return false;
  // Verificar que tiene el método ai.chat
  return typeof window.puter.ai?.chat === 'function';
}

// Consultar Puter.js AI
export async function queryPuter(message, context = {}) {
  const { materia, semana, academia } = context;

  if (!isPuterAvailable()) {
    return {
      success: false,
      error: 'Puter.js no está disponible',
      response: null
    };
  }

  try {
    const systemPrompt = getSystemPrompt({ materia, semana, academia });
    
    // Puter.js AI chat
    const response = await window.puter.ai.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]);

    const content = response?.message?.content || response;

    return {
      success: true,
      response: typeof content === 'string' ? content : 'No pude generar una respuesta.',
      model: 'puter-ai'
    };
  } catch (error) {
    console.error('Puter.js query error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

// Determinar si se debe usar Puter
export function shouldUsePuter(intent, hasToolResult, userMessage) {
  // No usar para:
  if (intent === 'saludar') return false;
  if (intent === 'ayuda') return false;
  if (hasToolResult) return false;
  
  // Usar para:
  if (intent === 'no_entendido') return true;
  if (intent === 'explicar_concepto') return true;
  if (intent === 'consejo_estudio') return true;
  
  // Preguntas largas o complejas
  if (userMessage.length > 50) return true;
  
  return false;
}

// Función principal para integrar con OrsttyChat
export async function getPuterResponse(userMessage, orsttyResult, context = {}) {
  // Verificar si Puter.js está disponible
  if (!isPuterAvailable()) {
    return {
      used: false,
      reason: 'Puter.js no disponible',
      response: null
    };
  }

  // Determinar si debemos usar Puter
  const shouldUse = shouldUsePuter(
    orsttyResult?.intent,
    !!orsttyResult?.toolOutput,
    userMessage
  );

  if (!shouldUse) {
    return {
      used: false,
      reason: 'Respuesta manejada por ORSTTY local',
      response: null
    };
  }

  // Consultar Puter
  const result = await queryPuter(userMessage, {
    materia: context.materia,
    semana: context.semana,
    academia: context.academia
  });

  if (result.success) {
    return {
      used: true,
      response: result.response,
      model: result.model
    };
  }

  return {
    used: false,
    reason: 'Error en Puter',
    error: result.error,
    response: null
  };
}

export default {
  queryPuter,
  isPuterAvailable,
  shouldUsePuter,
  getPuterResponse
};
