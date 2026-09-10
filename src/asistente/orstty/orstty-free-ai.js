// ORSTTY Free AI - API gratis sin registro ni API key
// Usa Kilo-Free-API: https://api.kilo.ai/api/openrouter/

// Usar proxy CORS para evitar problemas en navegador
const CORS_PROXY = 'https://corsproxy.io/?';
const FREE_AI_URL = 'https://api.kilo.ai/api/openrouter/chat/completions';
const FREE_MODELS_URL = 'https://api.kilo.ai/api/openrouter/models';

// Modelo gratuito por defecto
const DEFAULT_MODEL = 'kilo-auto/free';

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

// Consultar IA gratuita
export async function queryFreeAI(message, context = {}) {
  const { materia, semana, academia, model = DEFAULT_MODEL } = context;

  try {
    // Usar proxy CORS para evitar problemas en navegador
    const response = await fetch(CORS_PROXY + encodeURIComponent(FREE_AI_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: getSystemPrompt({ materia, semana, academia }) },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      }),
      signal: AbortSignal.timeout(20000) // 20 second timeout
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return {
      success: true,
      response: content || 'No pude generar una respuesta.',
      model: data.model || model
    };
  } catch (error) {
    console.error('Free AI query error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

// Verificar si la API está disponible
export async function checkFreeAIAvailability() {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(FREE_MODELS_URL), {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Determinar si se debe usar IA gratuita
export function shouldUseFreeAI(intent, hasToolResult, userMessage) {
  // No usar para:
  if (intent === 'saludar') return false;
  if (intent === 'ayuda') return false;
  if (hasToolResult) return false;
  
  // Usar para preguntas informativas
  if (intent === 'no_entendido') return true;
  if (intent === 'explicar_concepto') return true;
  if (intent === 'consejo_estudio') return true;
  
  // Preguntas que empiezan con "que es", "quien fue", etc.
  if (/que es|que son|quien fue|quien es|como funciona|explica|definicion|significa|dime sobre|hablame de|historia de|ciencia/i.test(userMessage)) {
    return true;
  }
  
  return false;
}

// Función principal para integrar con OrsttyChat
export async function getFreeAIResponse(userMessage, orsttyResult, context = {}) {
  // Determinar si debemos usar IA gratuita
  const shouldUse = shouldUseFreeAI(
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

  // Consultar IA gratuita
  const result = await queryFreeAI(userMessage, {
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
    reason: 'Error en IA gratuita',
    error: result.error,
    response: null
  };
}

export default {
  queryFreeAI,
  checkFreeAIAvailability,
  shouldUseFreeAI,
  getFreeAIResponse
};
