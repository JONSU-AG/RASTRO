# ORSTTY ENGINE

Cerebro local de ORSTTY. Sin APIs de IA, sin backend, sin dependencias
externas. Su único trabajo es convertir un mensaje de texto en:

```text
intención + entidades + contexto + tool sugerida + parámetros
```

RASTRO (u otra IA que lo integre) es quien ejecuta la tool real contra
Firebase y muestra los resultados en el chat.

## 1. Estructura de archivos

```text
asistente/
└── orstty/
    ├── orstty-engine.js       // motor: normalización, entidades, contexto, tools, estados
    ├── orstty-training.js     // frases de entrenamiento (se puede editar libremente)
    ├── orstty-personality.js  // textos/respuestas, separados de la lógica
    └── README.md
```

## 2. Cómo copiarlo dentro de RASTRO

1. Copia la carpeta `asistente/orstty/` completa dentro de `src/` en RASTRO,
   quedando en `src/asistente/orstty/`.
2. En el punto donde arranca la app (o donde se monte el chat de ORSTTY),
   importa una sola vez el archivo de entrenamiento para que se ejecute:
   ```js
   import './asistente/orstty/orstty-training.js';
   ```
3. Importa lo que necesites del motor donde vayas a usarlo:
   ```js
   import { process, registerTool, getContext, clearContext } from './asistente/orstty/orstty-engine.js';
   import { getResponse } from './asistente/orstty/orstty-personality.js';
   ```
4. No se necesita ninguna otra configuración: no hay backend, ni claves,
   ni servicios externos.

## 3. Cómo procesar un mensaje del usuario

```js
import { process } from './asistente/orstty/orstty-engine.js';

const resultado = process('Busca videos de biología de la semana 3');

console.log(resultado);
/*
{
  intent: "buscar_videos",
  confidence: 0.85,
  entities: { materia: "BIOLOGIA", semana: 3 },
  tool: "buscarVideos",
  parameters: { materia: "BIOLOGIA", semana: 3 },
  context: { materia: "BIOLOGIA", semana: 3 },
  state: "searching"
}
*/
```

Ejemplo de seguimiento de contexto (sin repetir todo):

```js
process('Quiero videos de biología');
// intent: buscar_videos, parameters: { materia: "BIOLOGIA" }

process('De la semana 3');
// parameters: { materia: "BIOLOGIA", semana: 3 }

process('¿Y hay nuevos?');
// intent: buscar_nuevos, parameters: { materia: "BIOLOGIA", semana: 3 }
```

## 4. Cómo agregar nuevas frases de entrenamiento

Edita `orstty-training.js` (o llama a `train`/`trainMany` desde cualquier
otro archivo, por ejemplo si RASTRO quiere entrenar cosas propias):

```js
import { train, trainMany } from './orstty-engine.js';

train('quiero ver simulacros de admision', 'buscar_examenes');

trainMany([
  ['dame el libro de historia del peru', 'buscar_libros'],
  ['quiero repasar historia', 'buscar_libros'],
]);
```

No hace falta tocar la lógica del motor para enseñarle frases nuevas.

## 5. Cómo crear una nueva intención

1. (Opcional) Regístrala para llevar un catálogo:
   ```js
   import { registerIntent } from './orstty-engine.js';
   registerIntent('recomendar_recurso');
   ```
2. Entrénala con frases de ejemplo:
   ```js
   train('que me recomiendas estudiar hoy', 'recomendar_recurso');
   train('dame una recomendacion', 'recomendar_recurso');
   ```
3. Si esa intención necesita una tool, regístrala (ver punto 6).
4. (Opcional) Agrega una respuesta de personalidad en
   `orstty-personality.js`:
   ```js
   registerResponse('recomendar_recurso', 'Déjame pensar en algo para ti...');
   ```

## 6. Cómo registrar una Tool

Las tools las define e implementa RASTRO (con Firebase, etc). ORSTTY solo
sabe pedirlas por nombre:

```js
import { registerTool } from './orstty-engine.js';

registerTool('buscarVideos', async ({ materia, semana }) => {
  // aquí va la búsqueda real en Firestore, ORSTTY no la implementa
  return await buscarVideosEnFirestore(materia, semana);
});
```

Si una intención nueva necesita otro nombre de tool distinto al que ya
está mapeado, se ajusta con:

```js
import { registerIntentTool } from './orstty-engine.js';
registerIntentTool('recomendar_recurso', 'recomendarRecurso');
```

Para ejecutar la tool sugerida después de llamar a `process()`:

```js
const resultado = process(mensajeUsuario);

if (resultado.tool) {
  const tool = getTool(resultado.tool);
  if (tool) {
    const datosReales = await tool(resultado.parameters);
    // aquí RASTRO arma las mini tarjetas con datosReales
  }
}
```

## 7. Cómo obtener y limpiar el contexto

```js
import { getContext, updateContext, clearContext } from './orstty-engine.js';

getContext();
// { materia: "BIOLOGIA", semana: 3 }

updateContext({ semana: 4 }); // combina con lo que ya había

clearContext();
// {} — útil cuando el usuario cambia totalmente de tema o pide "volver"
```

## 8. Ejemplos de entrada y salida

**Entrada:** `"quiero videos de biologia"`
```js
{
  intent: "buscar_videos",
  confidence: 0.8,
  entities: { materia: "BIOLOGIA" },
  tool: "buscarVideos",
  parameters: { materia: "BIOLOGIA" },
  context: { materia: "BIOLOGIA" },
  state: "searching"
}
```

**Entrada:** `"dame los pdf de quimica"`
```js
{
  intent: "buscar_material",
  confidence: 0.75,
  entities: { materia: "QUIMICA", tipo_recurso: "PDF" },
  tool: "buscarMaterial",
  parameters: { materia: "QUIMICA", tipo_recurso: "PDF" },
  context: { materia: "QUIMICA", tipo_recurso: "PDF" },
  state: "searching"
}
```

**Entrada:** `"xyz asdf 123"` (algo que no reconoce)
```js
{
  intent: "no_entendido",
  confidence: 0,
  entities: {},
  tool: null,
  parameters: {},
  context: {},
  state: "confused"
}
```

## 9. Notas para la IA que integre esto con RASTRO

- ORSTTY nunca inventa recursos: `process()` solo dice qué se pidió, no
  entrega datos. Los datos reales los trae la tool registrada.
- La personalidad (`orstty-personality.js`) está separada del motor a
  propósito, para poder cambiar el tono sin tocar la lógica de detección.
- Los `STATES` exportados desde `orstty-engine.js` son solo sugerencias
  para animar un futuro avatar; RASTRO puede sobreescribirlos según el
  resultado real de la búsqueda (por ejemplo, `no_results` si la tool no
  encontró nada).
- El vocabulario de materias/tipos de recurso es un punto de partida:
  se amplía con `registerVocab(...)` sin tocar el resto del archivo.
