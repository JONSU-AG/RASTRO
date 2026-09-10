// =============================================================================
// ORSTTY KNOWLEDGE BASE - COMPLETA
// Base de conocimiento TIPO SIRI/ALEXA para cada materia, plataforma,
// secciones de la app, y todo lo que el usuario pueda preguntar.
// =============================================================================

import { normalizeText } from './orstty-engine.js';

// ---------------------------------------------------------------------------
// KNOWLEDGE: Materias del examen de admisión UNSA
// ---------------------------------------------------------------------------

const KNOWLEDGE_MATERIAS = {
  BIOLOGIA: {
    aliases: ['biologia', 'bio', 'que es biologia', 'que es la biologia', 'biologico'],
    brief: 'La biología estudia los seres vivos: células, genética, evolución, anatomía y ecología.',
    tips: 'En el examen de admisión caen temas como mitosis, ADN, sistemas del cuerpo humano, biología molecular, genética mendeliana y evolución.',
    emoji: '🧬',
  },
  QUIMICA: {
    aliases: ['quimica', 'qui', 'quimi', 'que es quimica', 'que es la quimica', 'quimico'],
    brief: 'La química estudia la materia, sus propiedades, composición y transformaciones.',
    tips: 'Temas frecuentes: tabla periódica, enlaces químicos, estequiometría, ácidos y bases, reacciones orgánicas, gases y soluciones.',
    emoji: '⚗️',
  },
  FISICA: {
    aliases: ['fisica', 'fis', 'que es fisica', 'que es la fisica', 'fisico'],
    brief: 'La física estudia las leyes de la naturaleza: fuerzas, movimiento, energía y ondas.',
    tips: 'Repasa cinemática, dinámica, work-energy, electricidad, óptica, ondas, termodinámica y magnetismo.',
    emoji: '⚡',
  },
  MATEMATICA: {
    aliases: ['matematica', 'matematicas', 'mate', 'mates', 'amtematica', 'que es matematica'],
    brief: 'La matemática incluye álgebra, geometría, trigonometría y aritmética.',
    tips: 'En el examen: ecuaciones, funciones, polinomios, geometría analítica, áreas, volúmenes, probabilidades y estadística.',
    emoji: '📐',
  },
  RAZONAMIENTO_MATEMATICO: {
    aliases: ['razonamiento matematico', 'rm', 'raz matematico', 'raz mat', 'que es rm', 'razonamiento matematicas'],
    brief: 'El Razonamiento Matemático evalúa tu capacidad de lógica numérica y resolución de problemas.',
    tips: 'Incluye series numéricas, problemas verbales con matemáticas, proporciones, lógica matemática, entrenamiento de velocidad.',
    emoji: '🧮',
  },
  RAZONAMIENTO_VERBAL: {
    aliases: ['razonamiento verbal', 'rv', 'raz verbal', 'raz verb', 'que es rv', 'razonamiento verb'],
    brief: 'El Razonamiento Verbal mide comprensión lectora, inferencia y análisis de textos.',
    tips: 'Practica con sinónimos, antónimos, analogías, comprensión de párrafos, vocabulario en contexto.',
    emoji: '📖',
  },
  RAZONAMIENTO_LOGICO: {
    aliases: ['razonamiento logico', 'rl', 'raz logico', 'que es rl'],
    brief: 'El Razonamiento Lógico evalúa pensamiento abstracto, patrones y secuencias.',
    tips: 'Trabaja con secuencias, diagramas lógicos, premisas, silogismos, problemas de patterning.',
    emoji: '🧠',
  },
  COMPRENSION_LECTORA: {
    aliases: ['comprension lectora', 'comprension', 'lectura', 'que es comprension lectora', 'comp lectora'],
    brief: 'La Comprensión Lectora evalúa tu capacidad de interpretar y analizar textos.',
    tips: 'Lee con atención, identifica la idea principal, deduce significados, practica inferencia.',
    emoji: '📚',
  },
  LENGUAJE: {
    aliases: ['lenguaje', 'lengua', 'comunicacion', 'que es lenguaje'],
    brief: 'Lenguaje abarca gramática, ortografía, redacción y análisis de textos.',
    tips: 'Repasa categorías gramaticales, concordancia, puntuación, estructura de oraciones.',
    emoji: '✍️',
  },
  HISTORIA: {
    aliases: ['historia', 'hist', 'que es historia'],
    brief: 'La Historia estudia los acontecimientos del pasado y su impacto en el presente.',
    tips: 'Enfócate en historia del Perú, virreyes, independencia, república, siglo XX, culturas preincaicas.',
    emoji: '📜',
  },
  LITERATURA: {
    aliases: ['literatura', 'lite', 'que es literatura'],
    brief: 'La Literatura analiza obras, géneros, movimientos literarios y figuras retóricas.',
    tips: 'Estudia los géneros (lírico, narrativo, dramático), corrientes, autores peruanos y universales.',
    emoji: '📖',
  },
  FILOSOFIA: {
    aliases: ['filosofia', 'filo', 'que es filosofia'],
    brief: 'La Filosofía reflexiona sobre el conocimiento, la moral, la existencia y la sociedad.',
    tips: 'Repasa corrientes (empirismo, racionalismo, existencialismo), filósofos griegos, ética.',
    emoji: '🤔',
  },
  PSICOLOGIA: {
    aliases: ['psicologia', 'psico', 'que es psicologia'],
    brief: 'La Psicología estudia la conducta, procesos mentales y desarrollo humano.',
    tips: 'Temas: escuelas psicológicas, desarrollo cognitivo, personalidad, motivación, aprendizaje.',
    emoji: '🧠',
  },
  ANATOMIA: {
    aliases: ['anatomia', 'anat', 'que es anatomia'],
    brief: 'La Anatomía estudia la estructura del cuerpo humano: huesos, músculos, órganos.',
    tips: 'Repasa sistema esquelético, muscular, circulatorio, nervioso, digestivo, respiratorio.',
    emoji: '🫀',
  },
  GEOGRAFIA: {
    aliases: ['geografia', 'geo', 'que es geografia'],
    brief: 'La Geografía estudia el espacio terrestre, clima, población y recursos.',
    tips: 'Enfócate en geografía del Perú, relieve, clima, recursos naturales, demografía.',
    emoji: '🌍',
  },
  ECONOMIA: {
    aliases: ['economia', 'eco', 'que es economia'],
    brief: 'La Economía estudia la producción, distribución y consumo de bienes.',
    tips: 'Repasa oferta y demanda, inflación, PBI, tipos de cambio, política económica.',
    emoji: '💰',
  },
  CIVICA: {
    aliases: ['civica', 'ed civica', 'educacion civica', 'que es civica'],
    brief: 'La Educación Cívica estudia la organización política, derechos y deberes ciudadanos.',
    tips: 'Repasa constitución, poderes del estado, derechos humanos, participación ciudadana.',
    emoji: '🏛️',
  },
  INGLES: {
    aliases: ['ingles', 'que es ingles'],
    brief: 'El inglés evalúa comprensión de lectura, gramática y vocabulario en ese idioma.',
    tips: 'Practica tiempos verbales, vocabulario académico, comprensión de textos en inglés.',
    emoji: '🌐',
  },
  TRIGONOMETRIA: {
    aliases: ['trigonometria', 'trigo', 'que es trigonometria'],
    brief: 'La Trigonometría estudia las relaciones entre ángulos y lados de triángulos.',
    tips: 'Memoriza las razones trigonométricas, identidades, ley de senos y cosenos.',
    emoji: '📊',
  },
  GEOMETRIA: {
    aliases: ['geometria', 'que es geometria'],
    brief: 'La Geometría estudia figuras, formas, áreas, volúmenes y propiedades del espacio.',
    tips: 'Repasa áreas de políngonos, volúmenes de sólidos, geometría analítica, vectores.',
    emoji: '📏',
  },
  ALGEBRA: {
    aliases: ['algebra', 'que es algebra'],
    brief: 'El Álgebra estudia ecuaciones, funciones, polinomios y estructuras abstractas.',
    tips: 'Domina ecuaciones de 1er y 2do grado, sistemas, desigualdades, funciones.',
    emoji: '🔢',
  },
  ARITMETICA: {
    aliases: ['aritmetica', 'arit', 'que es aritmetica'],
    brief: 'La Aritmética estudia las operaciones básicas con números.',
    tips: 'Practica porcentajes, regla de tres, proporciones, fracciones, potencias y raíces.',
    emoji: '➕',
  },
};

// ---------------------------------------------------------------------------
// KNOWLEDGE: Plataforma RASTRO - TODAS las secciones
// ---------------------------------------------------------------------------

const KNOWLEDGE_PLATAFORMA = {
  RASTRO: {
    aliases: ['que es rastro', 'cuente de rastro', 'cuente de la pagina', 'de que trata la pagina', 'que tiene rastro', 'que es esta app', 'que es rumbo', 'que es la app'],
    brief: 'RASTRO (antes RUMBO) es una plataforma educativa gratuita y comunitaria para la preparación del examen de admisión de la UNSA.',
    tips: 'Ofrece videos de 3 academias (Esparta, Briceño, Kelsen), materiales PDF, simulacros, biblioteca, chat privado, y un asistente inteligente (yo).',
    emoji: '🎓',
  },
  SIMULADOR: {
    aliases: ['que es el simulador', 'como funciona el simulador', 'como calcula el puntaje', 'que es el examen', 'simulador'],
    brief: 'El Simulador calcula tu puntaje estimado según las ponderaciones reales del examen de admisión.',
    tips: 'Tiene 3 áreas: Sociales, Ingenierías y Biomédicas. Cada una con diferentes ponderaciones por materia. También tiene modo práctica con bancos de preguntas.',
    emoji: '📊',
  },
  AREAS: {
    aliases: ['que areas tiene el examen', 'cuantas preguntas tiene el examen', 'areas del examen', 'como es el examen'],
    brief: 'El examen tiene 3 áreas: Sociales, Ingenierías y Biomédicas, cada una con 130 preguntas.',
    tips: 'Las materias incluyen: Aptitud Académica, Matemática, Ciencias Sociales, Ciencia y Tecnología, Persona y Familia, Comunicación e Idioma Extranjero.',
    emoji: '📋',
  },
  ACADEMIA_BRICENO: {
    aliases: ['que es briceno', 'briceno', 'academia briceno', 'briceno 2027'],
    brief: 'Academia Briceño 2027 es un ciclo intensivo organizado semana a semana con clases y materiales.',
    tips: 'Tiene videos en Drive, organizados por semanas y materias. Ideal para seguir un ritmo constante de estudio.',
    emoji: '🏛️',
  },
  ACADEMIA_ESPARTA: {
    aliases: ['que es esparta', 'esparta', 'academia esparta'],
    brief: 'Academia Esparta ofrece 18 materias preuniversitarias completas con lecciones en video de YouTube.',
    tips: 'Cada materia tiene varias lecciones organizadas. Muy completo para todas las áreas del examen.',
    emoji: '🏛️',
  },
  ACADEMIA_KELSEN: {
    aliases: ['que es kelsen', 'kelsen', 'academia kelsen'],
    brief: 'Academia Kelsen ofrece clases grabadas oficiales y banco de grabaciones en Drive.',
    tips: 'Ideal si prefieres ver las clases a tu ritmo con el banco oficial de grabaciones.',
    emoji: '🏛️',
  },
  BIBLIOTECA: {
    aliases: ['que es la biblioteca', 'biblioteca', 'libros', 'documentos'],
    brief: 'La Biblioteca de RASTRO tiene libros, tomos oficiales y materiales compartidos por la comunidad.',
    tips: 'Tiene 3 secciones: Documentos Oficiales (Tomos CEPRE), Aportes de la Comunidad, y Libros. Puedes buscar, guardar y compartir.',
    emoji: '📚',
  },
  CHATS: {
    aliases: ['que son los chats', 'chats', 'mensajes', 'mensajes privados', 'chat privado', 'dm'],
    brief: 'Los Chats te permiten enviar mensajes privados a otros estudiantes de RASTRO.',
    tips: 'Puedes escribir a cualquier usuario registrado. Es una forma de conectar con compañeros de estudio.',
    emoji: '💬',
  },
  PERFIL: {
    aliases: ['mi perfil', 'perfil', 'como veo mi perfil', 'configuracion', 'ajustes'],
    brief: 'Tu perfil muestra tus contribuciones, materiales guardados, comentarios y configuración.',
    tips: 'Puedes cambiar tu foto, tema, nombre de usuario, y ver tus estadísticas de participación.',
    emoji: '👤',
  },
  SUBIR_MATERIAL: {
    aliases: ['como subir material', 'quiero compartir', 'subir archivos', 'subir material', 'compartir'],
    brief: 'Puedes subir material desde tu perfil o desde la Biblioteca usando el botón de subir.',
    tips: 'Los archivos se guardan en tu Google Drive y se comparten automáticamente. Puedes subir PDFs, imágenes y documentos.',
    emoji: '📤',
  },
  REGISTRO: {
    aliases: ['como registro', 'como creo cuenta', 'quiero registrarme', 'crear cuenta', 'login', 'iniciar sesion'],
    brief: 'Puedes crear tu cuenta gratis con Google o correo electrónico.',
    tips: 'Una vez registrado, puedes guardar tu progreso, subir material, chatear y participar en la comunidad.',
    emoji: '👤',
  },
  TEMAS: {
    aliases: ['temas', 'tema oscuro', 'tema claro', 'cambiar tema', 'modoscuro', 'dark mode', 'personalizar'],
    brief: 'RASTRO tiene 9 temas: claro, oscuro, guinda, coraje, beige-carmesi, google-vibrant y más.',
    tips: 'Puedes cambiar tu tema desde tu perfil. Se guarda automáticamente.',
    emoji: '🎨',
  },
  NOTIFICACIONES: {
    aliases: ['notificaciones', 'notificaciones push', 'alertas'],
    brief: 'RASTRO puede enviarte notificaciones sobre actividad nueva.',
    tips: 'Actívalas desde tu navegador o dispositivo para enterarte de nuevos materiales y mensajes.',
    emoji: '🔔',
  },
  ADMIN: {
    aliases: ['admin', 'administrador', 'panel de admin', 'administrar'],
    brief: 'El panel de administración permite gestionar usuarios, contenido, cursos y configuración del sitio.',
    tips: 'Solo los administradores pueden acceder. Controla usuarios, materiales, acceso y textos del sitio.',
    emoji: '⚙️',
  },
  ACCESO: {
    aliases: ['acceso', 'acceso restringido', 'secciones bloqueadas', 'credenciales'],
    brief: 'Algunas secciones pueden estar en mantenimiento o requerir credenciales especiales.',
    tips: 'Los aliados y administradores tienen acceso automático. Si una sección está bloqueada, contacta al admin.',
    emoji: '🔐',
  },
  TOMOS: {
    aliases: ['tomo', 'tomas', 'tomos', 'tomos cepre', 'cepreunsa', 'ceprequintos'],
    brief: 'Los Tomos son materiales oficiales de CEPREUNSA y CEPREQUINTOS para el examen de admisión.',
    tips: 'Hay 4 tomos disponibles en Google Drive: CEPREUNSA 2023, 2024, Exámenes Pasados y Guías de Estudio.',
    emoji: '📖',
  },
  EXAMENES_PASADOS: {
    aliases: ['examenes pasados', 'examenes anteriores', 'examenes de admision', 'practicar examen'],
    brief: 'Tenemos una recopilación de exámenes de admisión anteriores para practicar.',
    tips: 'Úsalos para familiarizarte con el formato y nivel de dificultad del examen real.',
    emoji: '📝',
  },
  COMUNIDAD: {
    aliases: ['comunidad', 'comunidad rastro', 'estudiantes', 'compañeros'],
    brief: 'RASTRO es una comunidad de estudiantes que se ayudan entre sí.',
    tips: 'Puedes compartir materiales, comentar, reaccionar y conectar con otros postulantes.',
    emoji: '👥',
  },
  PONDERACIONES: {
    aliases: ['ponderaciones', 'peso', 'peso de materias', 'cuanto vale cada materia', 'puntaje'],
    brief: 'Cada materia tiene un valor (ponderación) diferente según el área del examen.',
    tips: 'En Biomédicas, Biología vale 1.95 pts/pregunta. En Ingenierías, Física vale 1.52. En Sociales, Historia vale 1.77.',
    emoji: '⚖️',
  },
  FLASHCARDS: {
    aliases: ['flashcards', 'tarjetas', 'fichas', 'fichas de estudio'],
    brief: 'Las Flashcards son tarjetas de memoria con preguntas y respuestas rápidas.',
    tips: 'Úsalas para repasar conceptos clave de cada materia de forma rápida.',
    emoji: '🃏',
  },
  REACCIONES: {
    aliases: ['reacciones', 'reaccionar', 'likes', 'me gusta'],
    brief: 'Puedes reaccionar con emojis a los materiales y publicaciones de la comunidad.',
    tips: 'Las reacciones ayudan a destacar el mejor contenido.',
    emoji: '❤️',
  },
  GUARDADOS: {
    aliases: ['guardados', 'guardar', 'marcadores', 'favoritos', 'saved'],
    brief: 'Puedes guardar materiales en tu lista de favoritos para encontrarlos fácilmente.',
    tips: 'Haz clic en el icono de bookmark para guardar cualquier material.',
    emoji: '🔖',
  },
  // --- Secciones HOME ---
  HOME: {
    aliases: ['pagina principal', 'inicio', 'home', 'que hay en la pagina', 'principal', 'volver al inicio'],
    brief: 'La página principal de RASTRO tiene bienvenida, frase del día, carrusel de aliados y formulario para subir material.',
    tips: 'Desde aquí puedes acceder a todas las secciones: Cursos, Biblioteca, Simulador, Chats y ORSTTY.',
    emoji: '🏠',
  },
  FRASE_DIA: {
    aliases: ['frase del dia', 'versiculo del dia', 'frase inspiracional', 'frase motivacional del dia', 'inspiracion'],
    brief: 'Cada día RASTRO muestra una frase inspiracional o versículo para motivarte a estudiar.',
    tips: 'La puedes ver en la página principal y en cada sección de la app.',
    emoji: '✨',
  },
  CARRUSEL_ALIADOS: {
    aliases: ['aliados', 'carrusel de aliados', 'tarjetas de aliados', 'quien es aliado', 'aliados rastro'],
    brief: 'El carrusel muestra las tarjetas de los aliados de RASTRO: estudiantes que aportan material.',
    tips: 'Para ser aliado necesitas subir al menos 10 materiales a la comunidad.',
    emoji: '🤝',
  },
  SER_ALIADO: {
    aliases: ['ser aliado', 'quiero ser aliado', 'aliado rastro', 'tarjeta de aliado', 'crear tarjeta aliado'],
    brief: 'Puedes crear tu Tarjeta de Aliado si tienes 10+ aportes. Aparecerás en el carrusel de la página principal.',
    tips: 'Configura tu nombre, especialidad, WhatsApp y TikTok desde el formulario de Home.',
    emoji: '⭐',
  },
  SUBIR_MATERIAL_HOME: {
    aliases: ['subir material desde home', 'compartir desde la pagina', 'subir aporte'],
    brief: 'Desde la página principal puedes subir material directamente: tomos, prácticas, exámenes, resúmenes o variado.',
    tips: 'Necesitas un enlace de Google Drive en modo "Cualquier persona con el enlace puede ver".',
    emoji: '📤',
  },
  CANAL_WHATSAPP: {
    aliases: ['canal whatsapp', 'whatsapp rastro', 'grupo whatsapp', 'unirse al canal'],
    brief: 'RASTRO tiene un canal oficial de WhatsApp para noticias y comunidad.',
    tips: 'Únete para enterarte de nuevos materiales y eventos.',
    emoji: '📱',
  },
  // --- Secciones BIBLIOTECA ---
  BIBLIOTECA_TOMOS: {
    aliases: ['tomos academicos', 'tomos cepre', 'tomos oficiales', 'material oficial', 'cepreunsa tomos', 'ceprequintos tomos'],
    brief: 'La Biblioteca tiene 4 Tomos oficiales: CEPREQUINTOS 2027, CEPREUNSA, Exámenes Pasados y Material Clave.',
    tips: 'Cada tomo tiene vista previa integrada y botón para abrir en Google Drive.',
    emoji: '📕',
  },
  BIBLIOTECA_PRACTICAS: {
    aliases: ['practicas', 'practicas oficiales', 'bancos de preguntas', 'ejercicios'],
    brief: 'Hay prácticas de: CEPREQUINTOS 2027, Academia Esparta, Academia Briceño y CEPREUNSA.',
    tips: 'Cada práctica tiene vista previa y enlace directo a Google Drive.',
    emoji: '📗',
  },
  BIBLIOTECA_COMUNIDAD: {
    aliases: ['aportes de la comunidad', 'material de la comunidad', 'publicaciones de la comunidad', 'material compartido'],
    brief: 'La sección Comunidad muestra materiales subidos por aliados y estudiantes: resúmenes, prácticas, exámenes.',
    tips: 'Puedes buscar, reaccionar, comentar y reportar materiales. Los admin pueden ocultar contenido.',
    emoji: '🤝',
  },
  BIBLIOTECA_LIBROS: {
    aliases: ['libros', 'coleccion de libros', 'libros disponibles', 'libros rastro'],
    brief: 'La sección Libros muestra una colección de libros preuniversitarios disponibles.',
    tips: 'Accede a la colección completa desde la pestaña Libros en la Biblioteca.',
    emoji: '📚',
  },
  // --- Secciones SIMULADOR ---
  SIMULADOR_PUNTAJE: {
    aliases: ['calcular puntaje', 'puntaje estimado', 'cuanto saco', 'mi puntaje', 'simular puntaje'],
    brief: 'El simulador calcula tu puntaje estimado según las ponderaciones reales del examen de admisión.',
    tips: 'Selecciona tu área (Sociales, Ingenierías o Biomédicas) e ingresa tus respuestas.',
    emoji: '📊',
  },
  SIMULADOR_FLASHCARDS: {
    aliases: ['flashcards', 'tarjetas de memoria', 'fichas de estudio', 'repasar flashcards'],
    brief: 'Las Flashcards son tarjetas con pregunta y respuesta para repasar conceptos rápidamente.',
    tips: 'Puedes crear las tuyas, filtrar por materia y compartirlas con la comunidad.',
    emoji: '🃏',
  },
  SIMULADOR_EXAMENES: {
    aliases: ['examenes de practica', 'practicar examen', 'banco de preguntas', 'simulacro', 'examen simulado'],
    brief: 'El simulador tiene bancos de preguntas de exámenes de admisión pasados.',
    tips: 'Practica con preguntas reales y revisa tus respuestas con explicaciones.',
    emoji: '📝',
  },
  // --- Secciones CHATS ---
  CHATS_PRIVADOS: {
    aliases: ['escribir mensaje', 'mandar mensaje', 'hablar con alguien', 'mensaje privado', 'chatear'],
    brief: 'Puedes enviar mensajes privados a cualquier usuario de RASTRO.',
    tips: 'Haz clic en el perfil de un usuario y selecciona "Mandar mensaje".',
    emoji: '💬',
  },
  // --- Secciones PERFIL ---
  MI_PERFIL: {
    aliases: ['ver mi perfil', 'mi cuenta', 'mis datos', 'mis estadisticas', 'mi configuracion'],
    brief: 'Tu perfil muestra tus materiales subidos, guardados, reacciones y configuración.',
    tips: 'Puedes cambiar tu foto, nombre de usuario, tema y ver tu progreso.',
    emoji: '👤',
  },
  // --- FUNCIONES ESPECIALES ---
  COMENTARIOS: {
    aliases: ['comentarios', 'comentar', 'opinar', 'dejar comentario'],
    brief: 'Puedes comentar en los materiales y publicaciones de la comunidad.',
    tips: 'Los comentarios ayudan a mejorar el contenido y conectar con otros estudiantes.',
    emoji: '💬',
  },
  REPORTAR: {
    aliases: ['reportar', 'reportar material', 'denunciar', 'contenido inapropiado'],
    brief: 'Si ves material inapropiado o incorrecto, puedes reportarlo. Al acumular 3 reportes pasa a revisión.',
    tips: 'El sistema de reportes mantiene la calidad del contenido en RASTRO.',
    emoji: '🚨',
  },
  COMPARTIR: {
    aliases: ['compartir rastro', 'compartir enlace', 'invitar amigos', 'compartir la pagina'],
    brief: 'Puedes compartir el enlace de RASTRO con tus compañeros para que se unan.',
    tips: 'Copia el enlace desde el botón "Compartir" en la página de Cursos.',
    emoji: '🔗',
  },
  GUARDAR_MATERIAL: {
    aliases: ['guardar material', 'guardar en favoritos', 'marcar material', 'bookmark'],
    brief: 'Puedes guardar cualquier material en tus favoritos para encontrarlo después.',
    tips: 'Haz clic en el icono de bookmark en cualquier tarjeta de material.',
    emoji: '🔖',
  },
  REACCIONES: {
    aliases: ['reacciones', 'reaccionar', 'likes', 'me gusta', 'emojis'],
    brief: 'Puedes reaccionar con emojis a los materiales: ❤️ 👍 🔥 ⭐ 📚',
    tips: 'Las reacciones ayudan a destacar el mejor contenido de la comunidad.',
    emoji: '❤️',
  },
  TEMAS: {
    aliases: ['temas', 'tema oscuro', 'tema claro', 'dark mode', 'cambiar tema', 'personalizar tema'],
    brief: 'RASTRO tiene 9 temas visuales: claro, oscuro, guinda, coraje y más.',
    tips: 'Cambia tu tema desde tu perfil. Se guarda automáticamente.',
    emoji: '🎨',
  },
  NOTIFICACIONES: {
    aliases: ['notificaciones', 'alertas', 'avisos', 'notificaciones push'],
    brief: 'RASTRO puede enviarte notificaciones sobre materiales nuevos y mensajes.',
    tips: 'Actívalas desde tu navegador para no perderte nada.',
    emoji: '🔔',
  },
  PONDERACIONES: {
    aliases: ['ponderaciones', 'peso de materias', 'cuanto vale cada materia', 'puntaje por materia', 'valor de materia'],
    brief: 'Cada materia tiene un valor diferente según el área del examen.',
    tips: 'En Biomédicas, Biología vale 1.95. En Ingenierías, Trigonometría vale 1.70. En Sociales, Historia vale 1.77.',
    emoji: '⚖️',
  },
  // --- MATERIAS ESPECÍFICAS (agregadas para completitud) ---
  ANATOMIA: {
    aliases: ['anatomia', 'anat', 'que es anatomia', 'cuerpo humano'],
    brief: 'La Anatomía estudia la estructura del cuerpo humano: huesos, músculos, órganos.',
    tips: 'Repasa sistema esquelético, muscular, circulatorio, nervioso, digestivo, respiratorio.',
    emoji: '🫀',
  },
  CIVICA: {
    aliases: ['civica', 'ed civica', 'educacion civica', 'que es civica'],
    brief: 'La Educación Cívica estudia la organización política, derechos y deberes ciudadanos.',
    tips: 'Repasa constitución, poderes del estado, derechos humanos, participación ciudadana.',
    emoji: '🏛️',
  },
  INGLES: {
    aliases: ['ingles', 'que es ingles', 'idioma ingles'],
    brief: 'El inglés evalúa comprensión de lectura, gramática y vocabulario.',
    tips: 'Practica tiempos verbales, vocabulario académico, comprensión de textos en inglés.',
    emoji: '🌐',
  },
  TRIGONOMETRIA: {
    aliases: ['trigonometria', 'trigo', 'que es trigonometria'],
    brief: 'La Trigonometría estudia las relaciones entre ángulos y lados de triángulos.',
    tips: 'Memoriza las razones trigonométricas, identidades, ley de senos y cosenos.',
    emoji: '📊',
  },
  GEOMETRIA: {
    aliases: ['geometria', 'que es geometria'],
    brief: 'La Geometría estudia figuras, formas, áreas, volúmenes y propiedades del espacio.',
    tips: 'Repasa áreas de políngonos, volúmenes de sólidos, geometría analítica, vectores.',
    emoji: '📏',
  },
  ALGEBRA: {
    aliases: ['algebra', 'que es algebra'],
    brief: 'El Álgebra estudia ecuaciones, funciones, polinomios y estructuras abstractas.',
    tips: 'Domina ecuaciones de 1er y 2do grado, sistemas, desigualdades, funciones.',
    emoji: '🔢',
  },
  ARITMETICA: {
    aliases: ['aritmetica', 'arit', 'que es aritmetica'],
    brief: 'La Aritmética estudia las operaciones básicas con números.',
    tips: 'Practica porcentajes, regla de tres, proporciones, fracciones, potencias y raíces.',
    emoji: '➕',
  },
  GEOGRAFIA: {
    aliases: ['geografia', 'geo', 'que es geografia'],
    brief: 'La Geografía estudia el espacio terrestre, clima, población y recursos.',
    tips: 'Enfócate en geografía del Perú, relieve, clima, recursos naturales, demografía.',
    emoji: '🌍',
  },
  ECONOMIA: {
    aliases: ['economia', 'eco', 'que es economia'],
    brief: 'La Economía estudia la producción, distribución y consumo de bienes.',
    tips: 'Repasa oferta y demanda, inflación, PBI, tipos de cambio, política económica.',
    emoji: '💰',
  },
};

// ---------------------------------------------------------------------------
// KNOWLEDGE: Tips de estudio por materia
// ---------------------------------------------------------------------------

const STUDY_TIPS = {
  BIOLOGIA: [
    'Dibuja los sistemas del cuerpo humano para memorizar mejor.',
    'Usa mapas conceptuales para conectar ideas de genética y evolución.',
    'Practica con flashcards de vocabulario biológico.',
    'La biología se aprende más viendo diagrams que leyendo.',
  ],
  QUIMICA: [
    'Domina la tabla periódica: es la base de todo.',
    'Practica estequiometría con ejercicios paso a paso.',
    'Crea fichas de reacciones químicas más comunes.',
    'Usa colores para recordar grupos de la tabla periódica.',
  ],
  FISICA: [
    'Resuelve problemas de cinemática con diagramas de fuerzas.',
    'Memoriza las fórmulas fundamentales y sus unidades.',
    'Practica con problemas reales de exámenes pasados.',
    'No solo memorices fórmulas, entiende qué significan.',
  ],
  MATEMATICA: [
    'Practica diariamente ejercicios de álgebra y geometría.',
    'No memorices fórmulas: entiende de dónde vienen.',
    'Usa el método de resolver y revisar.',
    'Empieza por lo básico y sube de nivel gradualmente.',
  ],
  RM: [
    'Entrena con problemas de lógica numérica y series.',
    'Lee el enunciado completo antes de responder.',
    'Practica con tiempo para ganar velocidad.',
    'No te estanques: si no sale en 2 minutos, sigue y vuelve.',
  ],
  RV: [
    'Lee un párrafo al día y resume la idea principal.',
    'Amplía tu vocabulario con sinónimos y antónimos.',
    'Practica inferencia: ¿qué significa entre líneas?',
    'Lee con lápiz: subraya keywords.',
  ],
  RL: [
    'Resuelve secuencias lógicas cada día.',
    'Dibuja diagramas para problemas de patrones.',
    'Entrena la lógica con juegos de deducción.',
    'No te confundas: lee bien las premisas.',
  ],
  HISTORIA: [
    'Crea líneas de tiempo de los eventos más importantes.',
    'Relaciona causas y consecuencias de cada evento.',
    'Memoriza fechas clave: 1532 (conquista), 1821 (independencia).',
    'Estudia la historia del Perú por períodos.',
  ],
  FILOSOFIA: [
    'Entiende las corrientes antes de memorizar filósofos.',
    'Relaciona la filosofía con problemas actuales.',
    'Crea mapas mentales de cada corriente.',
    'No memorices定义iciones, entiende las ideas.',
  ],
};

// ---------------------------------------------------------------------------
// KNOWLEDGE: Acerca del creador
// ---------------------------------------------------------------------------

const CREADOR_INFO = {
  aliases: ['quien creo', 'quien hizo', 'quien es el creador', 'creador', 'desarrollador', 'programador', 'dueño', 'jonsu', 'aguilar'],
  brief: 'RASTRO fue creado por Jonsu Aguilar, un desarrollador comprometido con la educación.',
  tips: 'Email: aguilar.jonsu@gmail.com | GitHub: github.com/jonsu | RASTRO es una iniciativa solidaria, sin fines de lucro.',
  emoji: '👨‍💻',
  redes: {
    whatsapp: 'https://chat.whatsapp.com/RASTRO',
    instagram: '@rastro.educacion',
    tiktok: '@rastro.edu',
    github: 'github.com/jonsu',
    email: 'aguilar.jonsu@gmail.com',
    web: 'https://rumbo.vercel.app',
  },
};

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL: Buscar en la base de conocimiento
// ---------------------------------------------------------------------------

/**
 * Busca una respuesta en la base de conocimiento.
 */
export function searchKnowledge(rawText) {
  const norm = normalizeText(rawText);

  // 0. PRIMERO: Buscar preguntas específicas sobre academias/cursos (antes que RASTRO general)
  if (norm.match(/\b(academia|academias|cursos|curso|que hay|que tienes|que hay en|que tengo|que ofreces|que me ofreces|que puedo ver|que puedo hacer|que hay para ver)\b/)) {
    // Si menciona una academia específica
    if (norm.match(/\b(briceno|esparta|kelsen)\b/)) {
      if (norm.match(/\b(briceno)\b/)) {
        return {
          found: true,
          type: 'plataforma',
          subject: 'ACADEMIA_BRICENO',
          emoji: KNOWLEDGE_PLATAFORMA.ACADEMIA_BRICENO.emoji,
          brief: KNOWLEDGE_PLATAFORMA.ACADEMIA_BRICENO.brief,
          tips: KNOWLEDGE_PLATAFORMA.ACADEMIA_BRICENO.tips,
          studyTip: null,
        };
      }
      if (norm.match(/\b(esparta)\b/)) {
        return {
          found: true,
          type: 'plataforma',
          subject: 'ACADEMIA_ESPARTA',
          emoji: KNOWLEDGE_PLATAFORMA.ACADEMIA_ESPARTA.emoji,
          brief: KNOWLEDGE_PLATAFORMA.ACADEMIA_ESPARTA.brief,
          tips: KNOWLEDGE_PLATAFORMA.ACADEMIA_ESPARTA.tips,
          studyTip: null,
        };
      }
      if (norm.match(/\b(kelsen)\b/)) {
        return {
          found: true,
          type: 'plataforma',
          subject: 'ACADEMIA_KELSEN',
          emoji: KNOWLEDGE_PLATAFORMA.ACADEMIA_KELSEN.emoji,
          brief: KNOWLEDGE_PLATAFORMA.ACADEMIA_KELSEN.brief,
          tips: KNOWLEDGE_PLATAFORMA.ACADEMIA_KELSEN.tips,
          studyTip: null,
        };
      }
    }
    // Si pregunta "que academias hay" / "que academias tienes" / "que cursos hay"
    if (norm.match(/\b(academias|cursos)\b/) && norm.match(/\b(hay|tienes|tengo|ofreces|existen|disponibles|ver|mostrar)\b/)) {
      return {
        found: true,
        type: 'plataforma',
        subject: 'TODAS_ACADEMIAS',
        emoji: '🏛️',
        brief: 'RASTRO tiene 3 academias principales:',
        tips: '• **Academia Briceño 2027**: Ciclo intensivo semana a semana con videos en Drive.\n• **Academia Esparta**: 18 materias completas con clases en YouTube.\n• **Academia Kelsen**: Clases grabadas oficiales y banco de grabaciones.',
        studyTip: '¿Cuál te interesa? Puedo buscarte videos de cualquiera.',
      };
    }
  }

  // 1. Buscar en creador
  for (const alias of CREADOR_INFO.aliases) {
    if (norm.includes(normalizeText(alias))) {
      return {
        found: true,
        type: 'creador',
        subject: 'CREADOR',
        emoji: CREADOR_INFO.emoji,
        brief: CREADOR_INFO.brief,
        tips: CREADOR_INFO.tips,
        redes: CREADOR_INFO.redes,
        studyTip: null,
      };
    }
  }

  // 2. Buscar en materias (aliases más largos primero para evitar falsos positivos)
  for (const [key, data] of Object.entries(KNOWLEDGE_MATERIAS)) {
    const sortedAliases = [...data.aliases].sort((a, b) => b.length - a.length);
    for (const alias of sortedAliases) {
      if (norm.includes(normalizeText(alias))) {
        const studyTip = STUDY_TIPS[key] ? STUDY_TIPS[key][Math.floor(Math.random() * STUDY_TIPS[key].length)] : null;
        return {
          found: true,
          type: 'materia',
          subject: key,
          emoji: data.emoji,
          brief: data.brief,
          tips: data.tips,
          studyTip,
        };
      }
    }
  }

  // 3. Buscar en plataforma (general)
  for (const [key, data] of Object.entries(KNOWLEDGE_PLATAFORMA)) {
    for (const alias of data.aliases) {
      if (norm.includes(normalizeText(alias))) {
        return {
          found: true,
          type: 'plataforma',
          subject: key,
          emoji: data.emoji,
          brief: data.brief,
          tips: data.tips,
          studyTip: null,
        };
      }
    }
  }

  return { found: false };
}

/**
 * Devuelve una respuesta Siri/Alexa para algo encontrado.
 */
export function getKnowledgeResponse(knowledge) {
  if (!knowledge || !knowledge.found) return null;

  const { emoji, brief, tips, studyTip, redes } = knowledge;

  let response = `${emoji} ${brief}`;

  if (tips) {
    response += `\n\n💡 Tip: ${tips}`;
  }

  if (studyTip) {
    response += `\n\n📚 Consejo de estudio: ${studyTip}`;
  }

  if (redes) {
    response += `\n\n📱 Redes:\n• Instagram: ${redes.instagram}\n• TikTok: ${redes.tiktok}\n• WhatsApp: ${redes.whatsapp}\n• Web: ${redes.web}`;
  }

  response += `\n\n¿Quieres que busque videos, materiales o exámenes de esta materia en RASTRO?`;

  return response;
}

/**
 * Respuesta de desviación a recursos.
 */
export function getDesviationResponse(materiaKey) {
  const data = KNOWLEDGE_MATERIAS[materiaKey];
  if (!data) return null;

  const studyTips = STUDY_TIPS[materiaKey];
  const randomTip = studyTips ? studyTips[Math.floor(Math.random() * studyTips.length)] : null;

  let response = `¡Genial que quieras aprender ${data.brief.split('.')[0].toLowerCase()}! 🎯`;

  if (randomTip) {
    response += `\n\n📚 Consejo: ${randomTip}`;
  }

  response += `\n\nDéjame buscar qué tenemos en RASTRO para ti...`;

  return response;
}

