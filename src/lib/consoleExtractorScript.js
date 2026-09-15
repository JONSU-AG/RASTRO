// Script extractor de recursos para la consola del navegador y Prompts de IA
export const CONSOLE_EXTRACTOR_SCRIPT = `(async () => {
  "use strict";

  // ============================================================
  // 🚀 EXTRACTOR DE CLASES Y VIDEOS PARA LA CONSOLA (DevTools F12)
  // SALIDA: recursos.txt
  // ============================================================

  const CATEGORIAS = [
    "CIENCIAS ONLINE MAÑANA",
    "SEMINARIOS DE CIENCIAS",
    "CIENCIAS",
    "LETRAS",
    "INGENIERIAS",
    "BIOMEDICAS",
    "SOCIALES"
  ];

  const RESULTADO = [];
  const ESPERA_CATEGORIA = 1800;
  const ESPERA_CURSO = 1200;
  const ESPERA_SEMANA = 1000;
  const ESPERA_VIDEO = 800;

  const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

  function normalizar(texto) {
    return (texto || "").replace(/\\s+/g, " ").trim();
  }

  function obtenerNumeroSemana(texto) {
    const t = normalizar(texto);
    let match = t.match(/\\bSEMANA\\s*0*(\\d{1,3})\\b/i);
    if (match) return Number(match[1]);
    match = t.match(/\\bS0*(\\d{1,3})\\b/i);
    if (match) return Number(match[1]);
    return null;
  }

  function obtenerNombreSemana(texto, numero) {
    const limpio = normalizar(texto);
    if (limpio) return limpio;
    return \`SEMANA \${String(numero).padStart(2, "0")}\`;
  }

  function convertirYoutube(url) {
    if (!url) return null;
    const patrones = [
      /youtube\\.com\\/embed\\/([A-Za-z0-9_-]+)/i,
      /youtu\\.be\\/([A-Za-z0-9_-]+)/i,
      /youtube\\.com\\/watch\\?v=([A-Za-z0-9_-]+)/i,
      /youtube\\.com\\/watch[^"' ]*[?&]v=([A-Za-z0-9_-]+)/i,
      /youtube-nocookie\\.com\\/embed\\/([A-Za-z0-9_-]+)/i
    ];
    for (const patron of patrones) {
      const match = String(url).match(patron);
      if (match) return \`https://youtu.be/\${match[1]}\`;
    }
    return null;
  }

  function youtubesActuales() {
    const urls = new Set();
    document.querySelectorAll("iframe[src], a[href], video[src], source[src]").forEach(elemento => {
      const url = convertirYoutube(elemento.src || elemento.href);
      if (url) urls.add(url);
    });
    return urls;
  }

  function buscarCategoria(nombre) {
    const elementos = [...document.querySelectorAll("button, a, [role='tab'], [role='button']")];
    const objetivo = normalizar(nombre).toUpperCase();
    return elementos.find(elemento => {
      const texto = normalizar(elemento.innerText || elemento.textContent).toUpperCase();
      return texto === objetivo;
    });
  }

  async function cambiarCategoria(nombre) {
    console.log(\`\\n================================\\n📂 CATEGORÍA: \${nombre}\\n================================\`);
    const boton = buscarCategoria(nombre);
    if (!boton) {
      console.warn(\`❌ No encontré la categoría: \${nombre}\`);
      return false;
    }
    try { boton.click(); } catch (error) { return false; }
    await esperar(ESPERA_CATEGORIA);
    return true;
  }

  function buscarSelectorCursos() {
    const directo = document.querySelector("#gm-curso-select-51");
    if (directo) return directo;
    const selects = [...document.querySelectorAll("select")];
    const candidatos = selects.filter(select => {
      const opciones = [...select.options].filter(option => option.value && normalizar(option.text));
      return opciones.length > 0;
    });
    if (!candidatos.length) return null;
    return candidatos.sort((a, b) => b.options.length - a.options.length)[0];
  }

  function obtenerCursos() {
    const select = buscarSelectorCursos();
    if (!select) return [];
    return [...select.options]
      .filter(option => option.value && normalizar(option.text))
      .map(option => ({ value: option.value, nombre: normalizar(option.text) }))
      .filter((curso, index, array) => index === array.findIndex(x => x.value === curso.value));
  }

  async function cambiarCurso(select, valor) {
    select.value = valor;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await esperar(ESPERA_CURSO);
  }

  function obtenerSemanas() {
    const botones = [...document.querySelectorAll("button, [role='button'], .card, .acordeon, .collapse")];
    const semanas = [];
    botones.forEach(boton => {
      const texto = normalizar(boton.innerText || boton.textContent);
      const numero = obtenerNumeroSemana(texto);
      if (numero !== null) {
        semanas.push({ elemento: boton, texto, numero, nombre: obtenerNombreSemana(texto, numero) });
      }
    });
    return semanas.sort((a, b) => a.numero - b.numero);
  }

  async function abrirSemana(semana) {
    try { semana.elemento.click(); } catch (error) {}
    await esperar(ESPERA_SEMANA);
  }

  function obtenerVideosSemana() {
    const videos = [];
    const selectores = [
      "a[href*='youtube']", "a[href*='youtu.be']",
      "button[data-url]", "button[data-video]",
      ".video-item", ".list-group-item", "li"
    ];

    document.querySelectorAll(selectores.join(", ")).forEach(elemento => {
      let url = elemento.getAttribute("data-url") || elemento.getAttribute("data-video") || elemento.href;
      url = convertirYoutube(url);

      const nombre = normalizar(
        elemento.getAttribute("data-name") ||
        elemento.getAttribute("data-title") ||
        elemento.innerText ||
        elemento.textContent
      );

      if (url || (elemento.tagName.toLowerCase() === "button" && nombre)) {
        videos.push({ elemento, nombre: nombre || "Video sin nombre", urlDirecta: url });
      }
    });

    return videos;
  }

  async function obtenerUrlVideo(video) {
    if (video.urlDirecta) return video.urlDirecta;
    const antes = youtubesActuales();
    try { video.elemento.click(); } catch (error) { return null; }
    await esperar(ESPERA_VIDEO);
    const despues = youtubesActuales();
    for (const url of despues) {
      if (!antes.has(url)) return url;
    }
    return [...despues][0] || null;
  }

  function descargarArchivo(nombre, contenido) {
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  console.log("🚀 INICIANDO EXTRACCIÓN DE RECURSOS...");

  for (const nombreCategoria of CATEGORIAS) {
    const ok = await cambiarCategoria(nombreCategoria);
    if (!ok) continue;

    const selectorCursos = buscarSelectorCursos();
    const cursos = obtenerCursos();
    console.log(\`📚 Cursos encontrados: \${cursos.length}\`);

    for (const curso of cursos) {
      console.log(\`\\n  🔹 Curso: \${curso.nombre}\`);
      await cambiarCurso(selectorCursos, curso.value);

      const semanas = obtenerSemanas();
      console.log(\`   📅 Semanas encontradas: \${semanas.length}\`);

      for (const semana of semanas) {
        console.log(\`     📌 \${semana.nombre}\`);
        await abrirSemana(semana);

        const videos = obtenerVideosSemana();
        console.log(\`     🎥 Videos detectados: \${videos.length}\`);

        for (const video of videos) {
          const url = await obtenerUrlVideo(video);
          if (!url) continue;

          console.log(\`        ✔ \${video.nombre} -> \${url}\`);
          RESULTADO.push({
            categoria: nombreCategoria,
            curso: curso.nombre,
            semanaNumero: semana.numero,
            semanaNombre: semana.nombre,
            videoNombre: video.nombre,
            videoUrl: url
          });
        }
      }
    }
  }

  console.log(\`\\n🎉 EXTRACCIÓN COMPLETADA! Total recursos: \${RESULTADO.length}\`);

  if (!RESULTADO.length) {
    alert("⚠️ No se extrajo ningún enlace. Asegúrate de estar dentro del aula o plataforma con las clases abiertas.");
    return;
  }

  const lineas = RESULTADO.map(r => 
    \`\${r.categoria} | \${r.curso} | \${r.semanaNombre} | \${r.videoNombre} | \${r.videoUrl}\`
  );

  descargarArchivo("recursos.txt", lineas.join("\\n"));
  alert(\`✅ Archivo recursos.txt descargado con \${RESULTADO.length} enlaces listos para subir a RUMBO.\`);
})();`;

// Prompt optimizado para ChatGPT / Gemini / Claude para estructurar enlaces desordenados
export const AI_PROMPT_TEMPLATE = `Actúa como un asistente organizador de cursos preuniversitarios.
Tengo los siguientes enlaces y nombres de clases (pueden ser de Google Drive, YouTube, Zoom, carpetas o páginas web):

[PEGA AQUÍ TUS ENLACES O TEXTO DESORDENADO]

Por favor ordénalos y formátelos exactamente de esta manera (un elemento por línea, sin listas con guiones ni números, solo el título, una barra vertical | y el enlace):

Título o Tema de la Clase | Enlace Completo

Ejemplo del formato que necesito:
Clase 01 - Célula y Teoría Celular | https://drive.google.com/file/d/12345/view
Clase 02 - Genética y Leyes de Mendel | https://youtu.be/abcdef
Clase 03 - Repaso en Vivo | https://zoom.us/rec/...

Devuélveme ÚNICAMENTE las líneas en ese formato exacto para poder copiarlas y pegarlas directamente.`;

// Parser inteligente automático para múltiples enlaces de cualquier fuente (YouTube, Drive, Zoom, etc.)
export const parseVideoLinksAuto = (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  return lines.map((line, idx) => {
    // 1. Formato explícito: Título | URL
    if (line.includes('|')) {
      const parts = line.split('|').map(s => s.trim());
      const title = parts[0];
      const url = parts.slice(1).join('|').trim();
      return {
        nombre: title || `Clase ${(idx + 1).toString().padStart(2, '0')}`,
        url: url || ''
      };
    }

    // 2. Limpiar numeración o viñetas iniciales ("1. ", "- ", "• ")
    let cleanLine = line.replace(/^(\d+[\.\)\:\-]|[-*•])\s*/, '').trim();

    // 3. Extraer URL de la línea
    const urlMatch = cleanLine.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch) {
      const detectedUrl = urlMatch[1];
      const remainingText = cleanLine.replace(detectedUrl, '').replace(/[-–—:;,|]+$/, '').replace(/^[-–—:;,|]+/, '').trim();
      
      let finalTitle = remainingText;
      if (!finalTitle) {
        if (detectedUrl.includes('youtube.com') || detectedUrl.includes('youtu.be')) {
          finalTitle = `Video ${(idx + 1).toString().padStart(2, '0')} (YouTube)`;
        } else if (detectedUrl.includes('drive.google.com')) {
          finalTitle = `Clase ${(idx + 1).toString().padStart(2, '0')} (Drive)`;
        } else if (detectedUrl.includes('zoom.us')) {
          finalTitle = `Grabación ${(idx + 1).toString().padStart(2, '0')} (Zoom)`;
        } else {
          finalTitle = `Clase ${(idx + 1).toString().padStart(2, '0')}`;
        }
      }
      return {
        nombre: finalTitle,
        url: detectedUrl
      };
    }

    return {
      nombre: `Clase ${(idx + 1).toString().padStart(2, '0')}`,
      url: cleanLine
    };
  }).filter(it => it.url && (it.url.startsWith('http://') || it.url.startsWith('https://') || it.url.length > 8));
};
