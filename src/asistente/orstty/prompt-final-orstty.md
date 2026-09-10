# PROMPT: Integrar y convertir a Orstty en el asistente central de la plataforma

## ANTES DE PROGRAMAR: ANALIZA EL PROYECTO

Orstty **ya existe** dentro de mi proyecto (dentro de `src`). No crees otro asistente desde cero.

Antes de escribir una sola línea de código, analiza y entiende:

- La implementación actual de Orstty: dónde está, qué archivos usa, cómo funciona.
- La navbar principal (PC/laptop/tablet) y la pseudo-navbar superior que aparece en móvil.
- El sistema responsive general del proyecto.
- Dónde y cómo están almacenados los datos de: cursos, materias, temas, prácticas, tomos, materiales, PDFs, libros, videos, academias, ciclos, semanas, temarios, matriz de evaluación, obras literarias, autores, simuladores y cualquier otro recurso educativo (JSON, arrays, objetos, colecciones, etc.).
- Cualquier sistema de búsqueda que ya exista.
- Cualquier IA/API que ya esté integrada.

Con eso, entrégame primero un análisis breve (no código):

1. **Orstty actual** — dónde está, qué archivos usa, cómo funciona.
2. **Navegación** — navbar de escritorio, pseudo-navbar móvil, cómo funciona el responsive.
3. **Datos** — dónde vive cada tipo de recurso (cursos, materias, videos, materiales, academias, ciclos, semanas, prácticas, tomos, literatura, temario, matriz).
4. **Búsqueda** — qué existe hoy y qué se puede reutilizar.
5. **IA** — si hay alguna IA integrada hoy, cómo funciona, si conviene mantenerla, y qué alternativa gratuita podría usarse si hiciera falta.

Recién después de ese análisis, propón la arquitectura de integración y comienza a programar.

No reestructures el proyecto, no cambies de framework, no elimines ni reemplaces componentes que ya funcionan, no agregues backend si no es necesario, no metas dependencias pesadas sin justificarlas. Trabaja sobre lo que ya existe.

---

## QUÉ DEBE SER ORSTTY

Orstty no es un chatbot genérico. Es:

🧠 Asistente educativo · 🔎 Superbuscador inteligente de toda la plataforma · 📚 Buscador de materiales · 🎥 Buscador de videos · 📝 Buscador de prácticas · 📖 Asistente de literatura · 🎓 Asistente de temarios y matriz de evaluación · 💬 Conversación amigable · ⏰ Ayuda para organizar el estudio.

Su objetivo: **entender lo que el estudiante quiere decir —aunque lo escriba mal, abreviado, incompleto o informal— y encontrar dentro de la plataforma lo que realmente necesita.** El usuario no debe aprender a usar Orstty; Orstty aprende a entenderlo a él.

## PERSONALIDAD

Tono cercano, tipo asistente personal (Alexa/Siri) pero enfocado en estudiar: amable, natural, paciente, positivo, sencillo, educativo. Nada de respuestas frías, robóticas o repetitivas tipo "Claro, puedo ayudarte con eso." La conversación debe sentirse fluida, no un menú disfrazado de chat.

Ejemplo de tono:

> **Usuario:** quiero estudiar rm
> **Orstty:** ¡Vamos con RM! 🧠 Razonamiento Matemático.
> ¿Qué te gustaría hacer? 📚 Ver material · 🎥 Ver videos · 📝 Practicar · 🧠 Aprender desde cero

Solo texto por ahora: nada de análisis de imágenes, visión artificial, ni ejercicios por cámara. Flujo: **usuario escribe → Orstty interpreta → busca → responde.**

---

## SUPERBUSCADOR INTELIGENTE

Esta es la función más importante. Debe encontrar, dentro de los datos reales del proyecto: cursos, materias, subtemas, materiales, apuntes, PDFs, libros, tomos, videos, prácticas, simuladores, flashcards/preguntas, obras literarias, autores, academias, ciclos, semanas, temarios y matriz de evaluación.

Nada de `texto.includes(busqueda)`. El flujo debe ser:

```
Usuario → normalización → detección de intención → detección de entidades/filtros
→ búsqueda inteligente → ranking por relevancia → respuesta amigable
```

### Debe tolerar

Errores ortográficos, falta de tildes, palabras incompletas o mal escritas, abreviaturas, singular/plural, consultas muy cortas, escritura informal. Ejemplos que debe resolver:

```
rm, rv, raz mat, raz matematico, razonamiento m, raz mate, mat, quim, fis, bio,
literatura, werther, werter, fraciones, algebr, quiero ber videos de rm,
material de quimica 1, quimica 1 semana 5, videos quimica semana 5,
material de quimica trilce, quimica ciclo verano, que entra en rm,
temario unsa, matriz unsa
```

### Abreviaturas y alias

Debe existir un sistema de equivalencias (RM/raz mat/razonamiento matemático → Razonamiento Matemático, etc.), pero **construido a partir de las materias, cursos y academias reales que existan en el proyecto**. Nunca inventar equivalencias que no correspondan a datos reales.

### Distinción de tipo de recurso

Si el usuario dice "material / apuntes / PDF / libro / tomo / teoría / separata / documento" → priorizar material. Si dice "video / videos / clase / clases" → priorizar video. No mezclar ambos si el usuario ya especificó uno.

### Jerarquía de datos

Una materia puede tener varios cursos/niveles (Química, Química 1, Química 2...), y los recursos pueden variar por academia, ciclo y semana. Orstty no debe asumir que son lo mismo: debe analizar cómo están estructurados los datos reales y, cuando el usuario dé varios filtros ("videos de quimica 1 semana 5 trilce"), intentar cruzarlos todos:

```
Materia → Curso → Tema → Academia → Ciclo → Semana → Tipo de recurso
```

Solo usar academias y ciclos que existan realmente en los datos — nunca inventarlos.

### Búsqueda por tema y por obra literaria

Debe reconocer temas específicos aunque no se mencione el curso ("fracciones" → Razonamiento Matemático/Matemática; "leyes de newton" → Física) y obras literarias con sus variantes de escritura ("werther", "werter", "joven werther" → la obra registrada, si existe), relacionando Obra → Autor → Materia → Tema → Recursos.

### Temario y matriz de evaluación

Debe poder responder preguntas como "qué entra en rm", "qué temas de física vienen", "qué dice la matriz" usando los datos reales del proyecto (por ejemplo, matriz de la UNSA si existe). Si el dato no está disponible: **"No encuentro esa información en los datos disponibles."** Nunca inventar contenido de la matriz o del temario.

### Ranking y ambigüedad

Ordenar resultados por relevancia; los filtros que el usuario escribió explícitamente pesan más. Si la consulta es ambigua (p. ej. "quimica 1" sin decir tipo de recurso), Orstty debe **preguntar** en vez de inventar qué quiere el usuario — por ejemplo ofreciendo botones: 📚 Material · 🎥 Videos · 📝 Prácticas · 📖 Tomos. Pero si el contexto de la conversación ya lo deja claro (mensaje anterior fue "videos de quimica 1", el siguiente es "semana 5"), no debe volver a preguntar: debe entender "videos de química 1, semana 5" directamente.

### Contexto de conversación

Debe recordar lo dicho antes durante la conversación (materia, curso, academia, ciclo, semana, tipo de recurso) para que el usuario no tenga que repetir todo en cada mensaje ("y videos", "y material", "semana 5" deben heredar el resto del contexto).

---

## CÓMO SE MUESTRAN LOS RESULTADOS

Esta parte es clave:

- **Recursos que requieren salir del chat** (PDFs, apuntes, libros, tomos, cursos, prácticas largas, etc.) se muestran como **tarjetas de vista previa**: imagen/ícono, título, y los datos disponibles (materia · curso · academia · ciclo · semana), con un botón que lleva al recurso real. Nunca inventar el enlace: solo se usan URLs/recursos que realmente existan en los datos.
- **Recursos simples que se pueden resolver dentro del mismo chat** (por ejemplo un video corto, una flashcard, una pregunta suelta) deben poder **ejecutarse ahí mismo**, sin sacar al usuario del chat — por ejemplo un video embebido con solo presionar un botón dentro de la tarjeta, o una flashcard/pregunta que se responde directamente en la conversación.
- Cuando el usuario pide algo ambiguo entre tipos de recurso (p. ej. no aclaró si quiere video o material), Orstty debe **preguntarle** con opciones claras (📚 Material · 🎥 Video · 📝 Práctica · 📖 Libro/Apunte/Tomo) antes de mostrar resultados, salvo que el contexto ya lo haya dejado claro.
- Si hay muchos resultados, mostrar solo los más relevantes con un botón para ver todos, no una lista enorme de golpe.

Regla absoluta: **si el recurso existe, se muestra; si no existe, se dice que no se encontró.** Nunca inventar videos, PDFs, libros, tomos, prácticas, academias, ciclos, semanas, cursos, temas, URLs, datos de la UNSA/matriz ni ningún recurso inexistente.

---

## ORSTTY COMO TUTOR (función complementaria)

Además de buscar, si el usuario pide aprender un tema, Orstty puede explicar paso a paso, dar ejemplos, plantear ejercicios, revisar la respuesta del usuario, y si está mal, explicar **dónde** estuvo el error (no solo decir "incorrecto") antes de dar otro ejercicio similar, aumentando la dificultad poco a poco.

También puede corregir ortografía de forma natural y no invasiva, solo cuando aporte (mostrando brevemente la forma correcta y siguiendo con la conversación), y ayudar a armar horarios o planes de estudio simples como función secundaria — el núcleo sigue siendo **comprender + buscar + orientar + enseñar**.

---

## CAPA DE IA (opcional, nunca el núcleo)

El superbuscador interno (normalización + alias + tolerancia a errores + detección de intención/entidades + ranking) debe funcionar **sin IA**. Una IA externa gratuita puede añadirse como capa opcional para conversación, interpretación de preguntas complejas, explicaciones y tutoría — nunca como la fuente de los recursos reales de la plataforma.

Si esa IA falla, se queda sin cuota, no hay conexión o da error: Orstty debe seguir funcionando con su buscador interno, avisando de forma natural (p. ej. "Mi modo de IA no está disponible ahora, pero todavía puedo buscar el contenido de la plataforma 🔎") y sin quedar inutilizable.

Si se usa una IA externa: no exponer claves en el frontend. Analizar si hace falta backend/proxy/función serverless/variable de entorno, y explicarme las implicaciones (incluyendo costos) antes de implementarlo.

---

## DISEÑO Y UBICACIÓN

- Orstty debe respetar el estilo visual actual del proyecto (colores, tipografía, botones, tarjetas, bordes, sombras, espaciados) — debe sentirse parte de la plataforma, no un plugin ajeno.
- **En PC/laptop/tablet:** Orstty aparece como un apartado más dentro de la navbar principal (junto a Inicio, Cursos, Prácticas, Tomos, Simulador, Temario, etc.).
- **En móvil:** Orstty NO va en la navbar principal móvil — va únicamente en la pseudo-navbar/barra superior que ya existe en el proyecto para celulares. Sin duplicados.
- Responsive completo en PC, laptop, tablet y teléfonos: sin scroll horizontal, chat y tarjetas adaptables al ancho, botones cómodos al tacto, mensajes que se ajustan, el teclado del celular no debe romper la interfaz, videos responsive.

## RENDIMIENTO

Si hay muchos recursos, evitar recalcular todo en cada búsqueda: normalizar los datos una sola vez, indexar si hace falta, reutilizar resultados y usar caché cuando tenga sentido, siempre adaptado a la arquitectura ya existente.

---

## DOCUMENTACIÓN DE CADA CAMBIO

Por cada archivo modificado o creado, indicar:

**ARCHIVO:** `ruta/del/archivo`
**CAMBIO:** qué se modificó
**MOTIVO:** por qué era necesario
**CONSERVADO:** qué funcionalidad existente se respetó

**ARCHIVO NUEVO:** `ruta/del/archivo`
**FUNCIÓN:** para qué sirve

---

## RESUMEN DE LA IDEA CENTRAL

Orstty no tiene que "memorizarse" toda la página. Tiene que tener acceso inteligente a un índice de lo que la página realmente contiene, para que si mañana se agrega, por ejemplo, *Química 4 → Academia X → Ciclo intensivo → Semana 7 → Videos*, Orstty pueda encontrarlo sin que nadie tenga que enseñárselo a mano.

El estudiante escribe como quiera — con errores, abreviado, incompleto — y Orstty se encarga de entenderlo y de encontrar, dentro de la página, exactamente lo que necesita: mostrando tarjetas de vista previa para lo que lleva a otra pantalla, y resolviendo dentro del mismo chat lo que se pueda resolver ahí (videos cortos, flashcards, preguntas sueltas), preguntando primero cuando falte precisar si se busca video, material, práctica u otro tipo de recurso.

**Antes de programar: analiza el proyecto actual y la implementación existente de Orstty dentro de `src`. No inventes arquitectura — entiende primero, propone después, y recién entonces programa.**
