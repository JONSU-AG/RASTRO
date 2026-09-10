import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Save, 
  Trash2, 
  Edit3, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  FolderPlus, 
  HardDrive, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

const BRICENO_COLLECTION = 'briceno_2027_semanas';

export const AdminBricenoManager = ({ onNotice, setConfirmModal }) => {
  const [weeks, setWeeks] = useState([]);
  const [weekNum, setWeekNum] = useState(0);
  const [weekNameOverride, setWeekNameOverride] = useState('');
  const [weekStatus, setWeekStatus] = useState('disponible');
  const [jsonInput, setJsonInput] = useState('');
  const [editingWeekId, setEditingWeekId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [copiedExtractor, setCopiedExtractor] = useState(false);
  const [copiedZip, setCopiedZip] = useState(false);

  // Escuchar en tiempo real la colección de semanas de Briceño 2027
  useEffect(() => {
    try {
      const q = query(collection(db, BRICENO_COLLECTION));
      const unsub = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Ordenar por número de semana
        docs.sort((a, b) => (a.num !== undefined ? a.num : 99) - (b.num !== undefined ? b.num : 99));
        setWeeks(docs);
      }, (err) => {
        console.warn("Firestore notice on briceno_2027_semanas:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Error subscribing to briceno_2027_semanas:", e);
    }
  }, []);

  // Pre-cargar JSON en el editor para una semana existente
  const handleEditWeek = (week) => {
    setEditingWeekId(week.id);
    setWeekNum(week.num !== undefined ? week.num : 0);
    setWeekNameOverride(week.nombre || '');
    setWeekStatus(week.status || 'disponible');
    setJsonInput(JSON.stringify(week.data || [], null, 2));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingWeekId(null);
    setWeekNum(weeks.length > 0 ? Math.max(...weeks.map(w => w.num || 0)) + 1 : 0);
    setWeekNameOverride('');
    setWeekStatus('disponible');
    setJsonInput('');
  };

  // Guardar semana en Firestore
  const handleSaveWeek = async (e) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      onNotice("JSON vacío", "Por favor ingresa o pega el JSON con los cursos y videos.");
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
    } catch (err) {
      onNotice("Error de sintaxis JSON", `El contenido pegado no es un JSON válido:\n${err.message}`);
      return;
    }

    let dataArray = [];
    if (Array.isArray(parsedData)) {
      dataArray = parsedData;
    } else if (parsedData && Array.isArray(parsedData.data)) {
      dataArray = parsedData.data;
    } else {
      onNotice("Formato incorrecto", "El JSON debe ser un Array [...] de cursos o un objeto con la propiedad 'data': [...]");
      return;
    }

    const docId = editingWeekId || `semana_${weekNum}`;
    const weekName = weekNameOverride || (weekNum === 0 ? 'Semana 00' : `Semana ${String(weekNum).padStart(2, '0')}`);

    const payload = {
      id: docId,
      num: Number(weekNum),
      nombre: weekName,
      status: weekStatus,
      data: dataArray,
      updatedAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, BRICENO_COLLECTION, docId), payload, { merge: true });
      onNotice("¡Semana Guardada!", `Se guardó correctamente "${weekName}" en la colección "${BRICENO_COLLECTION}".`);
      setEditingWeekId(null);
      setJsonInput('');
      setWeekNum(Number(weekNum) + 1);
    } catch (err) {
      onNotice("Error al guardar semana", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar semana
  const handleDeleteWeek = (week) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar ${week.nombre || week.id}?`,
      message: `¿Seguro que deseas eliminar el documento "${week.id}" de Briceño 2027? Los cambios se verán al instante en la app.`,
      confirmText: 'Eliminar de Firebase',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, BRICENO_COLLECTION, week.id));
          onNotice("Semana Eliminada", `Documento "${week.id}" eliminado de ${BRICENO_COLLECTION}.`);
        } catch (e) {
          onNotice("Error", e.message);
        }
      }
    });
  };

  // The Exact Video Extractor Script
  const copyVideoExtractorScript = () => {
    const scriptCode = `(async () => {
  "use strict";

  // ============================================================
  // 🚀 EXTRACTOR DE CLASES Y VIDEOS (PLANTILLA BRICEÑO)
  // SALIDA: recursos.txt
  // ============================================================

  const CATEGORIAS = [
    "CIENCIAS ONLINE MAÑANA",
    "SEMINARIOS DE CIENCIAS"
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
    document.querySelectorAll(selectores.join(",")).forEach(elemento => {
      const texto = normalizar(elemento.innerText || elemento.textContent);
      if (!texto) return;
      const urlDirecta = convertirYoutube(elemento.href || elemento.dataset.url || elemento.dataset.video);
      videos.push({ elemento, nombre: texto, urlDirecta });
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
    if (despues.size > 0) return [...despues][0];
    return null;
  }

  function descargarArchivo(nombre, contenido) {
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  console.log("🚀 INICIANDO EXTRACCIÓN AUTOMÁTICA...");

  for (const nombreCategoria of CATEGORIAS) {
    const ok = await cambiarCategoria(nombreCategoria);
    if (!ok) continue;

    const selectCursos = buscarSelectorCursos();
    if (!selectCursos) {
      console.warn("❌ No encontré selector de cursos");
      continue;
    }

    const cursos = obtenerCursos();
    console.log(\`📚 Cursos encontrados: \${cursos.length}\`);

    for (const curso of cursos) {
      console.log(\`\\n📘 Curso: \${curso.nombre}\`);
      await cambiarCurso(selectCursos, curso.value);

      const semanas = obtenerSemanas();
      console.log(\`🗓️ Semanas encontradas: \${semanas.length}\`);

      for (const semana of semanas) {
        console.log(\`  ➡️ \${semana.nombre}\`);
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
    alert("⚠️ No se extrajo ningún enlace. Revisa que estés logueado en la plataforma de Briceño.");
    return;
  }

  const lineas = RESULTADO.map(r => 
    \`\${r.categoria} | \${r.curso} | \${r.semanaNombre} | \${r.videoNombre} | \${r.videoUrl}\`
  );

  descargarArchivo("recursos.txt", lineas.join("\\n"));
  alert(\`✅ Archivo recursos.txt descargado con \${RESULTADO.length} enlaces listos para subir.\`);
})();`;

    navigator.clipboard.writeText(scriptCode);
    setCopiedExtractor(true);
    setTimeout(() => setCopiedExtractor(false), 2500);
    onNotice("Script Copiado", "El script del extractor fue copiado al portapapeles. Pégalo en la consola DevTools del navegador.");
  };

  const copyZipScript = () => {
    const zipCode = `import os
import re
import json

# Script Python para convertir recursos.txt a JSON por semanas
def procesar_recursos():
    if not os.path.exists("recursos.txt"):
        print("❌ No se encontró recursos.txt")
        return

    semanas = {}

    with open("recursos.txt", "r", encoding="utf-8") as f:
        for linea in f:
            linea = linea.strip()
            if not linea:
                continue
            partes = [p.strip() for p in linea.split("|")]
            if len(partes) < 5:
                continue
            categoria, curso, sem_nombre, vid_nombre, vid_url = partes[:5]
            
            # Extraer número de semana
            m = re.search(r'\\b(?:SEMANA|S)\\s*0*(\\d+)\\b', sem_nombre, re.IGNORECASE)
            num_sem = int(m.group(1)) if m else 0

            if num_sem not in semanas:
                semanas[num_sem] = {}

            if curso not in semanas[num_sem]:
                semanas[num_sem][curso] = {
                    "nombre": curso,
                    "categoria": categoria,
                    "videos": []
                }

            semanas[num_sem][curso]["videos"].append({
                "nombre": vid_nombre,
                "url": vid_url
            })

    os.makedirs("semanas_json", exist_ok=True)
    for num, cursos_dict in semanas.items():
        cursos_list = list(cursos_dict.values())
        salida = {
            "num": num,
            "nombre": f"Semana {num:02d}",
            "status": "disponible",
            "data": cursos_list
        }
        path = f"semanas_json/semana_{num:02d}.json"
        with open(path, "w", encoding="utf-8") as out:
            json.dump(salida, out, ensure_ascii=False, indent=2)
        print(f"✅ Generado: {path} con {len(cursos_list)} cursos")

    print("\\n🚀 Listo! Puedes copiar el contenido de cada JSON y pegarlo en el Panel de Administración de Briceño.")

if __name__ == "__main__":
    procesar_recursos()`;

    navigator.clipboard.writeText(zipCode);
    setCopiedZip(true);
    setTimeout(() => setCopiedZip(false), 2500);
    onNotice("Script Copiado", "El script Python fue copiado al portapapeles.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header oficial de Briceño */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '24px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(16, 185, 129, 0.06))',
          border: '1.5px solid rgba(5, 150, 105, 0.3)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.6rem' }}>🎓</span>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Gestor Briceño 2027 (Oficial)
              </h2>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 800,
                background: '#059669',
                color: '#FFFFFF'
              }}>
                OFICIAL
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '680px' }}>
              Sube y administra las semanas del Ciclo 2027 de Academia Briceño directamente en Firestore (<code>{BRICENO_COLLECTION}</code>).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="https://drive.google.com/drive/folders/1sGaLVsVGtWeggLUWtw_vB14iwH3mHHH1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '14px',
                background: 'rgba(5, 150, 105, 0.15)',
                border: '1.5px solid rgba(5, 150, 105, 0.35)',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.86rem',
                textDecoration: 'none'
              }}
            >
              <HardDrive size={16} /> Carpeta Drive ↗
            </a>

            <a
              href="#/cursos/briceno"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #059669, #10B981)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.86rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
              }}
            >
              <ExternalLink size={16} /> Ver Briceño en Web ↗
            </a>
          </div>
        </div>
      </div>

      {/* Formulario de Carga de Semana para Briceño */}
      <div className="glass-card" style={{ padding: '22px', borderRadius: '22px', border: '1.5px solid var(--card-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {editingWeekId ? `✏️ Editando: ${editingWeekId}` : '➕ Agregar o Actualizar Semana (Ciclo 2027)'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Pega el JSON con la lista de cursos y videos de Briceño.
            </p>
          </div>

          {editingWeekId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.1)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSaveWeek} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Número de Semana (ej: 0, 1, 2...)
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={weekNum}
                onChange={(e) => setWeekNum(parseInt(e.target.value) || 0)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Nombre Visible (Opcional)
              </label>
              <input
                type="text"
                placeholder={`Semana ${String(weekNum).padStart(2, '0')}`}
                value={weekNameOverride}
                onChange={(e) => setWeekNameOverride(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Estado de Publicación
              </label>
              <select
                value={weekStatus}
                onChange={(e) => setWeekStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              >
                <option value="disponible">✅ Disponible (Público)</option>
                <option value="proximamente">⏳ Próximamente</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Contenido JSON de la Semana (Cursos y Videos):
            </label>
            <textarea
              rows={8}
              placeholder={`[\n  {\n    "nombre": "ÁLGEBRA",\n    "categoria": "CIENCIAS ONLINE MAÑANA",\n    "videos": [\n      {\n        "nombre": "ÁLGEBRA - CLASE 01",\n        "url": "https://youtu.be/..."\n      }\n    ]\n  }\n]`}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1.5px solid var(--card-border)',
                background: 'rgba(0,0,0,0.08)',
                color: 'var(--text-main)',
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                boxSizing: 'border-box',
                lineHeight: 1.4
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #10B981)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 6px 18px rgba(5, 150, 105, 0.25)'
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Guardando...' : editingWeekId ? 'Actualizar en Firebase' : 'Guardar Semana'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Semanas Registradas en Briceño */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
          Semanas Registradas en Briceño 2027 ({weeks.length})
        </h3>

        {weeks.length === 0 ? (
          <div className="glass-card" style={{ padding: '32px 20px', borderRadius: '18px', textAlign: 'center', border: '1.5px dashed var(--card-border)' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              No hay semanas registradas aún en <code>{BRICENO_COLLECTION}</code>. Utiliza el formulario superior para subir la primera.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weeks.map((w) => {
              const totalVideos = (w.data || []).reduce((acc, c) => acc + (c.videos ? c.videos.length : 0), 0);
              const totalCursos = (w.data || []).length;

              return (
                <div
                  key={w.id}
                  className="glass-card"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    border: '1.5px solid var(--card-border)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {w.nombre || w.id}
                      </h4>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '0.70rem',
                        fontWeight: 800,
                        background: w.status === 'disponible' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 149, 0, 0.15)',
                        color: w.status === 'disponible' ? '#34C759' : '#FF9500'
                      }}>
                        {w.status === 'disponible' ? '● Disponible' : '⏳ Próximamente'}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                      ID: <code>{w.id}</code> • {totalCursos} materias • {totalVideos} videos grabados
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditWeek(w)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--card-border)',
                        background: 'rgba(120, 120, 128, 0.1)',
                        color: 'var(--text-main)',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} /> Editar JSON
                    </button>
                    <button
                      onClick={() => handleDeleteWeek(w)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#EF4444',
                        fontSize: '0.80rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Panel de Scripts Extractores de Briceño */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '20px', border: '1.5px solid var(--card-border)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
          🛠️ Scripts Extractores de Videos para Briceño
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          Usa estos scripts para extraer las clases automáticamente de la web de Briceño y generar los JSON de las semanas.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={copyVideoExtractorScript}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '12px',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {copiedExtractor ? <Check size={15} color="#34C759" /> : <Copy size={15} />}
            <span>{copiedExtractor ? '¡Script Copiado!' : 'Copiar Script Extractor (Navegador)'}</span>
          </button>

          <button
            onClick={copyZipScript}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '12px',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {copiedZip ? <Check size={15} color="#34C759" /> : <Copy size={15} />}
            <span>{copiedZip ? '¡Script Copiado!' : 'Copiar Script Python (Generador JSON)'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
