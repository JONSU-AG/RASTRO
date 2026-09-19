// ORSTTY WebLLM Integration - IA en el navegador sin servidor
// Corre modelos de IA directamente en el browser via WebGPU

import { CreateMLCEngine } from '@mlc-ai/web-llm';

let engine = null;
let engineLoading = false;
let engineReady = false;
let loadProgress = 0;

// Modelo pequeño (~2GB descarga en browser, cache automático)
const MODEL_ID = 'Phi-3.5-mini-instruct-q4f32_1-MLC'; // 3.8B params, rápido

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

// Cargar el modelo (una vez)
export async function loadModel(onProgress) {
  if (engineReady) return engine;
  if (engineLoading) return null;
  
  engineLoading = true;
  
  try {
    engine = await CreateMLCEngine(MODEL_ID, {
      logLevel: 'WARN',
      initProgressCallback: (progress) => {
        loadProgress = Math.round(progress.progress * 100);
        if (onProgress) onProgress(loadProgress);
        console.log(`📊 WebLLM loading: ${loadProgress}%`);
      }
    });
    
    engineReady = true;
    engineLoading = false;
    console.log('✅ WebLLM model loaded:', MODEL_ID);
    return engine;
  } catch (error) {
    console.error('❌ WebLLM load error:', error);
    engineLoading = false;
    return null;
  }
}

// Consultar la IA
export async function queryWebLLM(message, context = {}) {
  const { 
    materia,
    semana,
    academia,
    onProgress
  } = context;

  // Cargar modelo si no está listo
  if (!engineReady) {
    await loadModel(onProgress);
  }
  
  if (!engine) {
    return {
      success: false,
      error: 'Modelo no disponible',
      response: null
    };
  }

  try {
    const systemPrompt = getSystemPrompt({ materia, semana, academia });
    
    const response = await engine.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: false
    });

    const content = response.choices[0]?.message?.content;
    
    return {
      success: true,
      response: content || 'No pude generar una respuesta.',
      model: MODEL_ID
    };
  } catch (error) {
    console.error('WebLLM query error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

// Verificar si WebGPU está disponible
export function isWebGPUAvailable() {
  return typeof navigator !== 'undefined' && navigator.gpu !== undefined;
}

// Verificar si el modelo está cargado
export function isModelReady() {
  return engineReady;
}

// Obtener progreso de carga
export function getLoadProgress() {
  return loadProgress;
}

// Determinar si se debe usar WebLLM
export function shouldUseWebLLM(intent, hasToolResult, userMessage) {
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
export async function getWebLLMResponse(userMessage, orsttyResult, context = {}) {
  // Verificar WebGPU
  if (!isWebGPUAvailable()) {
    return {
      used: false,
      reason: 'WebGPU no disponible en este navegador',
      response: null
    };
  }

  // Determinar si debemos usar WebLLM
  const shouldUse = shouldUseWebLLM(
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

  // Consultar WebLLM
  const result = await queryWebLLM(userMessage, {
    materia: context.materia,
    semana: context.semana,
    academia: context.academia,
    onProgress: context.onProgress
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
    reason: 'Error en WebLLM',
    error: result.error,
    response: null
  };
}

export default {
  queryWebLLM,
  isWebGPUAvailable,
  isModelReady,
  getLoadProgress,
  shouldUseWebLLM,
  getWebLLMResponse,
  loadModel
};
