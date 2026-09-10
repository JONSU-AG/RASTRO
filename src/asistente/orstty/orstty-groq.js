// ORSTTY Groq Integration - API gratuita sin límites de descarga
// Usa Groq free tier para respuestas IA más inteligentes

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// API Key de Groq (gratis, sin tarjeta)
// IMPORTANTE: En producción, esto debería estar en variables de entorno
const GROQ_API_KEY = 'gsk_demo_key_replace_me'; // El usuario debe obtener su propia key gratis

// Modelo gratuito de Groq (ultra rápido)
const MODEL = 'llama-3.3-70b-versatile';

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

// Consultar Groq API
export async function queryGroq(message, context = {}) {
  const { materia, semana, academia } = context;

  // Si no hay API key, retornar error
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_demo_key_replace_me') {
    return {
      success: false,
      error: 'API key no configurada. Obtén una gratis en console.groq.com',
      response: null
    };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: getSystemPrompt({ materia, semana, academia }) },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      }),
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return {
      success: true,
      response: content || 'No pude generar una respuesta.',
      model: MODEL,
      usage: data.usage
    };
  } catch (error) {
    console.error('Groq query error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

// Verificar si la API key está configurada
export function isGroqConfigured() {
  return GROQ_API_KEY && GROQ_API_KEY !== 'gsk_demo_key_replace_me';
}

// Determinar si se debe usar Groq
export function shouldUseGroq(intent, hasToolResult, userMessage) {
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
export async function getGroqResponse(userMessage, orsttyResult, context = {}) {
  // Verificar si Groq está configurado
  if (!isGroqConfigured()) {
    return {
      used: false,
      reason: 'Groq API key no configurada',
      response: null
    };
  }

  // Determinar si debemos usar Groq
  const shouldUse = shouldUseGroq(
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

  // Consultar Groq
  const result = await queryGroq(userMessage, {
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
    reason: 'Error en Groq',
    error: result.error,
    response: null
  };
}

export default {
  queryGroq,
  isGroqConfigured,
  shouldUseGroq,
  getGroqResponse
};
