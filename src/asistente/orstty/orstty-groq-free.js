// ORSTTY Groq Free - Rotación automática de API keys
// Sistema que usa múltiples keys y rota cuando una falla

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ============================================
// API KEYS - SISTEMA DE ROTACIÓN
// ============================================
// El sistema rota automáticamente cuando una falla
const API_PROVIDERS = [
  {
    name: 'OpenCode Zen',
    baseUrl: 'https://opencode.ai/zen/v1',
    model: 'big-pickle',
    keys: [
      'sk-LICCjnKXNUBmFwnWEZQECF5qsTNiZxn8Q0Pppg1eKNZFp1Ctitzexzc1mh3nvqnw'
    ]
  }
];

// Para compatibilidad con el código existente
const API_KEYS = API_PROVIDERS[0].keys;

// ============================================
// GESTIÓN DE KEYS
// ============================================
let currentKeyIndex = 0;
let failedKeys = new Set();

// Obtener key actual
function getCurrentKey() {
  // Limpiar keys fallidas periódicamente (cada 5 minutos)
  if (failedKeys.size > 0 && Math.random() < 0.1) {
    failedKeys.clear();
  }
  
  // Buscar una key que no haya fallado
  let attempts = 0;
  while (attempts < API_KEYS.length) {
    const key = API_KEYS[currentKeyIndex];
    if (!failedKeys.has(key)) {
      return key;
    }
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    attempts++;
  }
  
  // Si todas fallaron, resetear y reintentar
  failedKeys.clear();
  return API_KEYS[0];
}

// Marcar key como fallida
function markKeyAsFailed(key) {
  failedKeys.add(key);
  console.warn(`API key fallida, rotando a la siguiente...`);
  
  // Avanzar a la siguiente key
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
}

// Obtener siguiente key válida
function getNextValidKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return getCurrentKey();
}

// Verificar si hay keys configuradas
export function hasApiKey() {
  return API_KEYS.length > 0;
}

// Agregar key manualmente (opcional)
export function addApiKey(key) {
  if (key && !API_KEYS.includes(key)) {
    API_KEYS.push(key);
    return true;
  }
  return false;
}

// Obtener cantidad de keys
export function getKeyCount() {
  return API_KEYS.length;
}

// ============================================
// MODELO Y SYSTEM PROMPT
// ============================================
// Modelo por defecto (se usa si el provider no define uno)
const DEFAULT_MODEL = 'big-pickle';

function getSystemPrompt(context = {}) {
  const { materia, semana, academia } = context;
  
  let ctx = '';
  if (materia) ctx += `El usuario está viendo ${materia}. `;
  if (semana) ctx += `Está en la semana ${semana}. `;
  if (academia) ctx += `Pertenece a la academia ${academia}. `;

  return `Eres ORSTTY 👋, la asistente de RASTRO (plataforma educativa peruana para preuniversitarios). 

IDENTIDAD:
- Eres femenina ("estoy aquí", "te ayudo")
- Tienes personalidad amigable, cálida y motivadora
- Hablas español peruano natural
- Eres como una compañera de estudio, no una robota
- Usas emojis moderate: 👋📚✨🎓💡

CÓMO HABLAR:
- Responde BREVE: máximo 3 oraciones
- Sé directa pero amigable
- Usa un tono casual y cercano
- Ejemplo: "¡Claro! La mitocondria es la central energética de la célula ⚡. Produce ATP que es como el combustible que necesita tu cuerpo para funcionar. ¿Quieres que busque videos de biología sobre esto?"

MATERIAS QUE CONOCES:
- Biología, Química, Física, Matemática
- RM (Razonamiento Matemático), RV (Razonamiento Verbal), RL (Razonamiento Lógico)
- Anatomía, Cívica, Inglés

REGLAS:
1. NUNCA inventes datos específicos (nombres de videos, fechas exactas, etc)
2. Si no sabes algo con certeza, di "no estoy muy segura pero revisa los cursos de RASTRO"
3. Siempre puedes ofrecer buscar videos, material o cursos relacionados
4. Motiva al usuario a estudiar
5. Si te preguntan por RASTRO, explica que es una plataforma de estudio preuniversitario

PERSONALIDAD:
- Eres optimista y positiva
- Te importa que el usuario aprenda
- A veces haces bromas leves
- Recuerdas que estás ayudando a alguien que quiere pasar el examen de admisión

${ctx}`;
}

// ============================================
// CONSULTA A API CON ROTACIÓN
// ============================================
export async function queryGroq(message, context = {}) {
  if (!hasApiKey()) {
    return {
      success: false,
      error: 'No hay API keys configuradas',
      response: null
    };
  }

  let lastError = null;
  let attempts = 0;
  const maxAttempts = API_KEYS.length;

  while (attempts < maxAttempts) {
    const apiKey = getCurrentKey();
    const provider = API_PROVIDERS[0]; // Por ahora solo usamos el primer provider
    
    try {
      const response = await fetch(provider.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: 'system', content: getSystemPrompt(context) },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 300,
          stream: false
        }),
        signal: AbortSignal.timeout(20000)
      });

      // Si es rate limit (429), rotar key
      if (response.status === 429) {
        console.warn(`Rate limit en key, rotando...`);
        markKeyAsFailed(apiKey);
        attempts++;
        continue;
      }

      // Si es error de autenticación (401), marcar key como inválida
      if (response.status === 401) {
        console.warn(`Key inválida, rotando...`);
        markKeyAsFailed(apiKey);
        attempts++;
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      return {
        success: true,
        response: content || 'No pude generar una respuesta.',
        model: provider.model,
        keyUsed: API_KEYS.indexOf(apiKey)
      };
    } catch (error) {
      console.error('API query error:', error);
      lastError = error;
      
      // Si es timeout o network error, intentar siguiente key
      if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
        markKeyAsFailed(apiKey);
        attempts++;
        continue;
      }
      
      // Otro tipo de error, salir del loop
      break;
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Todas las API keys fallaron',
    response: null
  };
}

// ============================================
// LÓGICA DE USO
// ============================================
export function shouldUseGroq(intent, hasToolResult, userMessage) {
  if (!hasApiKey()) return false;
  if (intent === 'saludar') return false;
  if (intent === 'ayuda') return false;
  if (hasToolResult) return false;
  
  if (/que es|que son|como funciona|explica|definicion|significa|dime sobre|hablame de|quien fue|quien es|quien descubrio|cuando fue|donde esta|por que|cuanto es|cual es|como se hace|historia de|ciencia/i.test(userMessage)) {
    return true;
  }
  
  return false;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
export async function getGroqResponse(userMessage, orsttyResult, context = {}) {
  console.log('🔍 getGroqResponse called with:', { userMessage, intent: orsttyResult?.intent });
  
  if (!hasApiKey()) {
    console.log('❌ No hay API keys');
    return { used: false, reason: 'No hay API keys', response: null };
  }

  const shouldUse = shouldUseGroq(
    orsttyResult?.intent,
    !!orsttyResult?.toolOutput,
    userMessage
  );
  console.log('🤔 shouldUse:', shouldUse);

  if (!shouldUse) {
    return { used: false, reason: 'No es pregunta informativa', response: null };
  }

  console.log('🚀 Calling queryGroq...');
  const result = await queryGroq(userMessage, context);
  console.log('📊 queryGroq result:', result);

  if (result.success) {
    return { 
      used: true, 
      response: result.response, 
      model: result.model,
      keyIndex: result.keyUsed
    };
  }

  return { used: false, reason: 'Error en API', error: result.error, response: null };
}

export default {
  queryGroq,
  hasApiKey,
  addApiKey,
  getKeyCount,
  shouldUseGroq,
  getGroqResponse
};
