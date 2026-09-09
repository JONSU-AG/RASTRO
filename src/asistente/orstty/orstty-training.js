// =============================================================================
// ORSTTY TRAINING
// Frases de entrenamiento iniciales. Importar y ejecutar una sola vez al
// arrancar la app (por ejemplo en el punto de entrada donde se monta el
// chat de ORSTTY dentro de RASTRO).
//
// Para enseñar frases nuevas NO se toca orstty-engine.js: solo se agregan
// líneas aquí (o se llama a train()/trainMany() desde cualquier otro lugar).
// =============================================================================

import { trainMany } from './orstty-engine.js';

trainMany([
  // ---- saludar ------------------------------------------------------------
  ['hola', 'saludar'],
  ['hola orstty', 'saludar'],
  ['buenas', 'saludar'],
  ['buenos dias', 'saludar'],
  ['buenas tardes', 'saludar'],
  ['buenas noches', 'saludar'],
  ['que tal', 'saludar'],

  // ---- ayuda ----------------------------------------------------------------
  ['ayuda', 'ayuda'],
  ['que puedes hacer', 'ayuda'],
  ['como funciona esto', 'ayuda'],
  ['no se que hacer', 'ayuda'],
  ['necesito ayuda', 'ayuda'],

  // ---- buscar_videos --------------------------------------------------------
  ['quiero videos de biologia', 'buscar_videos'],
  ['quiero videos de biologia de la semana 3', 'buscar_videos'],
  ['videos de biologia de la semana 3', 'buscar_videos'],
  ['videos de biologia semana 3', 'buscar_videos'],
  ['clases de biologia semana 3', 'buscar_videos'],
  ['muestrame videos de biologia', 'buscar_videos'],
  ['hay clases de bio', 'buscar_videos'],
  ['busca videos de bio', 'buscar_videos'],
  ['quiero estudiar biologia', 'buscar_videos'],
  ['dame las clases de quimica', 'buscar_videos'],
  ['videos de quimica semana 2', 'buscar_videos'],
  ['quiero ver videos', 'buscar_videos'],
  ['tienes clases de fisica', 'buscar_videos'],
  ['videos de matematicas', 'buscar_videos'],
  ['clases de anatomia', 'buscar_videos'],
  ['videos de historia', 'buscar_videos'],
  ['videos de literatura', 'buscar_videos'],
  ['videos de razonamiento verbal', 'buscar_videos'],
  ['videos de razonamiento matematico', 'buscar_videos'],
  ['videos de civica', 'buscar_videos'],
  ['videos de psicologia', 'buscar_videos'],
  ['videos de filosofia', 'buscar_videos'],
  ['videos de geografia', 'buscar_videos'],
  ['videos de ingles', 'buscar_videos'],

  // ---- buscar_material --------------------------------------------------------
  ['quiero material de quimica', 'buscar_material'],
  ['material de biologia de la semana 3', 'buscar_material'],
  ['separatas de biologia semana 3', 'buscar_material'],
  ['dame los pdf de quimica', 'buscar_material'],
  ['hay separatas de quimica', 'buscar_material'],
  ['busca material de quimica', 'buscar_material'],
  ['necesito los pdf de la semana 2', 'buscar_material'],
  ['tienes separatas de matematica', 'buscar_material'],
  ['dame los tomos', 'buscar_material'],
  ['tomos de ceprunsa', 'buscar_material'],
  ['practicas resueltas', 'buscar_material'],
  ['separatas y guias', 'buscar_material'],

  // ---- buscar_cursos --------------------------------------------------------
  ['que cursos hay', 'buscar_cursos'],
  ['muestrame los cursos', 'buscar_cursos'],
  ['quiero ver los cursos disponibles', 'buscar_cursos'],
  ['hay curso de matematica', 'buscar_cursos'],
  ['que academias hay', 'buscar_cursos'],
  ['academia briceno', 'buscar_cursos'],
  ['academia esparta', 'buscar_cursos'],
  ['academia kelsen', 'buscar_cursos'],

  // ---- buscar_libros --------------------------------------------------------
  ['quiero libros de literatura', 'buscar_libros'],
  ['tienes libros de historia', 'buscar_libros'],
  ['busca libros', 'buscar_libros'],
  ['libros de quimica', 'buscar_libros'],
  ['libros de biologia', 'buscar_libros'],
  ['libros preuniversitarios', 'buscar_libros'],
  ['que libros hay en la biblioteca', 'buscar_libros'],

  // ---- buscar_examenes --------------------------------------------------------
  ['quiero un examen de practica', 'buscar_examenes'],
  ['dame simulacros', 'buscar_examenes'],
  ['hay examenes de quimica', 'buscar_examenes'],
  ['quiero practicar con examenes', 'buscar_examenes'],
  ['simulador de examen', 'buscar_examenes'],
  ['preguntas de examen', 'buscar_examenes'],
  ['simulacro de medicina', 'buscar_examenes'],
  ['simulacro de ingenierias', 'buscar_examenes'],
  ['banco de preguntas', 'buscar_examenes'],

  // ---- buscar_publicaciones --------------------------------------------------------
  ['muestrame publicaciones', 'buscar_publicaciones'],
  ['hay publicaciones nuevas', 'buscar_publicaciones'],
  ['quiero ver posts de la comunidad', 'buscar_publicaciones'],
  ['aportes de la comunidad', 'buscar_publicaciones'],
  ['archivos compartidos', 'buscar_publicaciones'],

  // ---- buscar_perfiles --------------------------------------------------------
  ['busca el perfil de un usuario', 'buscar_perfiles'],
  ['quiero ver perfiles', 'buscar_perfiles'],
  ['muestrame mi perfil', 'buscar_perfiles'],
  ['quien es ese estudiante', 'buscar_perfiles'],

  // ---- buscar_semanas --------------------------------------------------------
  ['que semanas hay', 'buscar_semanas'],
  ['muestrame las semanas del curso', 'buscar_semanas'],
  ['en que semana voy', 'buscar_semanas'],
  ['semanas de briceno', 'buscar_semanas'],

  // ---- buscar_nuevos --------------------------------------------------------
  ['hay algo nuevo', 'buscar_nuevos'],
  ['y hay nuevos', 'buscar_nuevos'],
  ['hay nuevos', 'buscar_nuevos'],
  ['que hay de nuevo', 'buscar_nuevos'],
  ['algo reciente', 'buscar_nuevos'],
  ['subidas recientes', 'buscar_nuevos'],
  ['ultimos aportes', 'buscar_nuevos'],

  // ---- comparar_recursos --------------------------------------------------------
  ['compara estos dos videos', 'comparar_recursos'],
  ['cual es mejor este pdf o este libro', 'comparar_recursos'],
  ['diferencia entre estos cursos', 'comparar_recursos'],

  // ---- filtrar --------------------------------------------------------
  ['filtra por semana 3', 'filtrar'],
  ['solo quiero los de esta semana', 'filtrar'],
  ['filtra por materia', 'filtrar'],
  ['1', 'filtrar'],
  ['2', 'filtrar'],
  ['3', 'filtrar'],
  ['4', 'filtrar'],
  ['5', 'filtrar'],
  ['6', 'filtrar'],
  ['7', 'filtrar'],
  ['8', 'filtrar'],
  ['9', 'filtrar'],
  ['10', 'filtrar'],
  ['11', 'filtrar'],
  ['12', 'filtrar'],
  ['la 1', 'filtrar'],
  ['la 2', 'filtrar'],
  ['la 3', 'filtrar'],
  ['la 4', 'filtrar'],
  ['la 5', 'filtrar'],
  ['la 6', 'filtrar'],
  ['la 7', 'filtrar'],
  ['la 8', 'filtrar'],
  ['la 9', 'filtrar'],
  ['la 10', 'filtrar'],
  ['la 11', 'filtrar'],
  ['la 12', 'filtrar'],
  ['la semana 1', 'filtrar'],
  ['la semana 2', 'filtrar'],
  ['la semana 3', 'filtrar'],
  ['la semana 4', 'filtrar'],
  ['la semana 5', 'filtrar'],
  ['la semana 6', 'filtrar'],
  ['la semana 7', 'filtrar'],
  ['la semana 8', 'filtrar'],
  ['de la semana 1', 'filtrar'],
  ['de la semana 2', 'filtrar'],
  ['de la semana 3', 'filtrar'],
  ['de la semana 4', 'filtrar'],
  ['de la semana 5', 'filtrar'],
  ['de la semana 6', 'filtrar'],
  ['de la semana 7', 'filtrar'],
  ['de la semana 8', 'filtrar'],
  ['semana 1', 'filtrar'],
  ['semana 2', 'filtrar'],
  ['semana 3', 'filtrar'],
  ['semana 4', 'filtrar'],
  ['semana 5', 'filtrar'],
  ['semana 6', 'filtrar'],
  ['semana 7', 'filtrar'],
  ['semana 8', 'filtrar'],
  ['solo de la 1', 'filtrar'],
  ['solo de la 2', 'filtrar'],
  ['solo de la 3', 'filtrar'],
  ['solo de la 4', 'filtrar'],
  ['de la 1', 'filtrar'],
  ['de la 2', 'filtrar'],
  ['de la 3', 'filtrar'],
  ['de la 4', 'filtrar'],
  ['de la 5', 'filtrar'],
  ['de la 6', 'filtrar'],
  ['de la 7', 'filtrar'],
  ['de la 8', 'filtrar'],

  // ---- abrir_recurso --------------------------------------------------------
  ['abre ese video', 'abrir_recurso'],
  ['abreme el pdf', 'abrir_recurso'],
  ['entra a ese curso', 'abrir_recurso'],

  // ---- volver --------------------------------------------------------
  ['regresa', 'volver'],
  ['vuelve atras', 'volver'],
  ['salir de aqui', 'volver'],
]);
