// ORSTTY Ollama Integration - Fallback para respuestas avanzadas
// Conecta con Ollama local (localhost:11434) cuando la IA local no tiene respuesta

const OLLAMA_BASE_URL = 'http://localhost:11434';

// Verificar si Ollama está disponible
export async function checkOllamaConnection() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        models: data.models || []
      };
    }
    return { connected: false, models: [] };
  } catch (error) {
    return { connected: false, models: [], error: error.message };
  }
}

// Enviar mensaje a Ollama y obtener respuesta
export async function queryOllama(message, context = {}) {
  const { 
    model = 'llama3.2', // Modelo por defecto
    systemPrompt = getSystemPrompt(context),
    temperature = 0.7,
    maxTokens = 500
  } = context;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens
        }
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      response: data.message?.content || 'No pude generar una respuesta.',
      model: data.model,
      totalDuration: data.total_duration
    };
  } catch (error) {
    console.error('Ollama query error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

// System prompt para ORSTTY con Ollama
function getSystemPrompt(context = {}) {
  const { materia, semana, academia } = context;
  
  let contextInfo = '';
  if (materia) contextInfo += `El usuario estudia ${materia}. `;
  if (semana) contextInfo += `Está en la semana ${semana}. `;
  if (academia) contextInfo += `Pertenece a la academia ${academia}. `;

  return `Eres ORSTTY, el asistente inteligente de RASTRO, una plataforma educativa para preuniversitarios en Perú.

Características:
- Responde en español, de forma breve y útil (máximo 3-4 oraciones)
- Eres amigable, motivador y usas emojis ocasionalmente
- Conoces las materias: Biología, Química, Física, Matemática, Razonamiento Matemático (RM), Razonamiento Verbal (RL), Razonamiento Lógico (RL), Anatomía, Cívica, Inglés, Trigonometría, Geometría, Álgebra, Aritmética, Geografía, Economía
- Conoces las funcionalidades de RASTRO: cursos, biblioteca, simulador, chats, perfil
- Puedes dar consejos de estudio, explicar conceptos, y motivar al estudiante
- Si no sabes algo, di que no estás seguro pero sugiere buscar en los cursos de RASTRO

${contextInfo}

Responde de forma concisa y útil.`;
}

// Determinar si se debe usar Ollama
export function shouldUseOllama(intent, hasToolResult, userMessage) {
  // No usar Ollama para:
  if (intent === 'saludar') return false;
  if (intent === 'ayuda') return false;
  if (hasToolResult) return false;
  
  // Usar Ollama para:
  if (intent === 'no_entendido') return true;
  if (intent === 'explicar_concepto') return true;
  if (intent === 'consejo_estudio') return true;
  
  // Para mensajes largos o preguntas complejas
  if (userMessage.length > 50) return true;
  
  return false;
}

// Función principal para integrar con OrsttyChat
export async function getOllamaResponse(userMessage, orsttyResult, context = {}) {
  // Verificar primero si Ollama está disponible
  const connection = await checkOllamaConnection();
  
  if (!connection.connected) {
    return {
      used: false,
      reason: 'Ollama no está disponible',
      response: null
    };
  }

  // Determinar si debemos usar Ollama
  const shouldUse = shouldUseOllama(
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

  // Consultar Ollama
  const ollamaResult = await queryOllama(userMessage, {
    materia: context.materia,
    semana: context.semana,
    academia: context.academia,
    model: connection.models[0]?.name || 'llama3.2'
  });

  if (ollamaResult.success) {
    return {
      used: true,
      response: ollamaResult.response,
      model: ollamaResult.model,
      duration: ollamaResult.totalDuration
    };
  }

  return {
    used: false,
    reason: 'Error en consulta a Ollama',
    error: ollamaResult.error,
    response: null
  };
}

// Exportar para uso directo
export default {
  checkOllamaConnection,
  queryOllama,
  shouldUseOllama,
  getOllamaResponse
};
