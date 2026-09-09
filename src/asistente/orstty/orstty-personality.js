// =============================================================================
// ORSTTY PERSONALITY
// Plantillas de texto separadas de la lógica del motor (orstty-engine.js
// nunca decide qué "dice" ORSTTY, solo qué intención/entidad detectó).
//
// RASTRO puede editar este archivo libremente, o agregar respuestas nuevas
// con registerResponse(), sin tocar el motor.
//
// IMPORTANTE: estas plantillas nunca inventan datos (nombres de videos,
// cursos, usuarios, etc). Solo acompañan el resultado que ya devolvió
// el motor y que RASTRO llenará con datos reales de Firebase.
// =============================================================================

const templates = {
  saludar: [
    '¡Hola! Soy ORSTTY 👋 ¿Qué buscamos hoy?',
    'Aquí estoy. ¿En qué te ayudo?',
    'Hola de nuevo. Dime qué necesitas y vemos qué encontramos.',
  ],
  ayuda: [
    'Puedo ayudarte a buscar videos, material, cursos, libros, exámenes, publicaciones y más. Solo dime qué necesitas.',
  ],
  buscar_videos: [
    'Buscando videos, dame un segundo.',
    'Voy a revisar qué videos hay.',
  ],
  buscar_material: [
    'Buscando el material...',
  ],
  buscar_cursos: [
    'Revisando los cursos disponibles...',
  ],
  buscar_libros: [
    'Buscando libros...',
  ],
  buscar_examenes: [
    'Buscando exámenes de práctica...',
  ],
  buscar_publicaciones: [
    'Revisando publicaciones...',
  ],
  buscar_perfiles: [
    'Buscando ese perfil...',
  ],
  buscar_semanas: [
    'Viendo las semanas disponibles...',
  ],
  buscar_nuevos: [
    'Revisando qué hay de nuevo...',
  ],
  comparar_recursos: [
    'Comparando eso ahora mismo...',
  ],
  filtrar: [
    'Aplicando ese filtro...',
  ],
  abrir_recurso: [
    'Abriendo eso...',
  ],
  volver: [
    'Listo, volvemos.',
  ],
  no_entendido: [
    'No estoy segura de haber entendido eso. ¿Puedes decirlo de otra forma?',
    'Mmm, no capté bien. Intenta con otras palabras.',
  ],
  no_results: [
    'No encontré nada con eso. ¿Probamos con otra materia o semana?',
  ],
  error: [
    'Algo salió mal buscando eso. Intenta de nuevo en un momento.',
  ],
  default: [
    'Entendido.',
  ],
};

/**
 * Devuelve una respuesta de texto para una intención o clave de estado.
 * Si no existe, usa la respuesta por defecto.
 */
export function getResponse(key) {
  const options = templates[key] || templates.default;
  const i = Math.floor(Math.random() * options.length);
  return options[i];
}

/**
 * Agrega una respuesta nueva a una intención/clave existente o nueva,
 * sin tocar el resto del archivo.
 * registerResponse("buscar_videos", "Ya casi tengo tus videos...");
 */
export function registerResponse(key, text) {
  if (!templates[key]) templates[key] = [];
  templates[key].push(text);
}
