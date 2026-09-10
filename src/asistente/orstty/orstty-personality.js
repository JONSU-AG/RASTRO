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
    '¡Hola! Soy ORSTTY 👋 Tu asistente de RASTRO. ¿Qué buscamos hoy?',
    'Aquí estoy. Dime qué necesitas y lo encontramos juntos.',
    '¡Hola de nuevo! 🎓 ¿En qué te ayudo?',
    'Hey! ¿Qué necesitas? Puedo buscar videos, material, cursos o lo que tengas en mente.',
  ],
  ayuda: [
    'Puedo ayudarte a buscar videos de clases, separatas, libros, simulacros y cursos. También sé qué hay en RASTRO. Solo dime qué necesitas.',
    'Soy como tu asistente personal de estudio. Pregúntame por cualquier materia, busca material, cursos o preguntas sobre la plataforma.',
    '¡Tengo varias funciones! Puedo buscar videos, material PDF, libros, exámenes, cursos, comparar materias y hasta contarte qué es cada materia. ¡Pregúntame!',
  ],
  buscar_videos: [
    'Buscando videos, dame un segundo...',
    'Voy a revisar qué clases hay para ti...',
    'Déjame buscar entre todas las clases disponibles...',
  ],
  buscar_material: [
    'Buscando el material más reciente...',
    'Revisando separatas, PDFs y guías...',
    'Déjame ver qué hay de material...',
  ],
  buscar_cursos: [
    'Revisando los cursos y academias disponibles...',
    'Veamos qué cursos tenemos en RASTRO...',
    'Déjame buscar entre las academias...',
  ],
  buscar_libros: [
    'Buscando libros en la biblioteca...',
    'Revisando tomos y libros disponibles...',
    'Déjame ver qué hay en la biblioteca...',
  ],
  buscar_examenes: [
    'Buscando exámenes de práctica...',
    'Déjame buscar simulacros y preguntas...',
    'Revisando el banco de exámenes...',
  ],
  buscar_publicaciones: [
    'Revisando publicaciones de la comunidad...',
    'Veamos qué han compartido los compañeros...',
    'Déjame ver los aportes recientes...',
  ],
  buscar_perfiles: [
    'Buscando ese perfil...',
    'Déjame ver si lo encuentro...',
  ],
  buscar_semanas: [
    'Viendo las semanas disponibles...',
    'Déjame revisar el calendario de clases...',
    'Veamos qué semanas hay...',
  ],
  buscar_nuevos: [
    'Revisando qué hay de nuevo...',
    'Déjame ver las novedades más recientes...',
    'Veamos qué han subido últimamente...',
  ],
  comparar_recursos: [
    'Comparando eso ahora mismo...',
    'Déjame ver las diferencias...',
    'Analizando las opciones...',
  ],
  filtrar: [
    'Aplicando ese filtro...',
    'Filtrando resultados...',
    'Veamos solo lo que necesitas...',
  ],
  abrir_recurso: [
    'Abriendo eso...',
    'Déjame llevarte ahí...',
  ],
  volver: [
    'Listo, volvemos. ¿Qué más necesitas?',
    '¡De vuelta! ¿En seguimos?',
  ],
  pregunta_conocimiento: [
    'Déjame contarte sobre eso...',
    'Buena pregunta. Esto es lo que sé:',
  ],
  desviar_recurso: [
    '¡Genial! Déjame buscar lo que tenemos en RASTRO para ti...',
    'Perfecto, veamos qué hay...',
  ],
  conversacion: [
    '¡Interesante! ¿En qué te ayudo?',
    'Cuéntame más. ¿Qué necesitas?',
    'Eso suena bien. ¿Qué buscas en RASTRO?',
  ],
  no_entendido: [
    'No estoy segura de haber entendido eso. ¿Puedes decirlo de otra forma?',
    'Mmm, no capté bien. Intenta con otras palabras, como "videos de biología" o "material de química".',
    'No me quedó claro. ¿Quieres buscar algo específico? Prueba con "videos", "material", "cursos" o "simulacros".',
  ],
  no_results: [
    'No encontré nada con eso. ¿Probamos con otra materia o semana?',
    'No hay resultados para esa búsqueda. ¿Qué tal con otra materia?',
    'No encontré recursos para eso. ¿Quieres que busque en otra materia o semana?',
  ],
  error: [
    'Algo salió mal buscando eso. Intenta de nuevo en un momento.',
    'Parece que hubo un problemita. Intenta otra vez, por favor.',
  ],
  default: [
    'Entendido.',
    'Ok.',
    'Perfecto.',
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
