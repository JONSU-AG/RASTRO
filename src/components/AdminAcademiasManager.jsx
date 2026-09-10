import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  serverTimestamp 
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
  AlertCircle,
  Eye,
  Layers,
  ChevronDown,
  Building2
} from 'lucide-react';

// Preset color themes for new academies
export const ACADEMY_COLOR_PRESETS = [
  { 
    name: 'Azul Kelsen', 
    primary: '#007AFF', 
    gradient: 'linear-gradient(135deg, #007AFF, #0A84FF)', 
    badgeGradient: 'linear-gradient(135deg, #007AFF, #00C6FF)',
    bg: 'linear-gradient(180deg, rgba(0, 122, 255, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(0, 122, 255, 0.35)',
    shadow: 'rgba(0, 122, 255, 0.12)',
    btnShadow: 'rgba(0, 122, 255, 0.25)'
  },
  { 
    name: 'Verde Briceño (Plantilla)', 
    primary: '#059669', 
    gradient: 'linear-gradient(135deg, #059669, #10B981)', 
    badgeGradient: 'linear-gradient(135deg, #059669, #34D399)',
    bg: 'linear-gradient(180deg, rgba(5, 150, 105, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(5, 150, 105, 0.35)',
    shadow: 'rgba(5, 150, 105, 0.12)',
    btnShadow: 'rgba(5, 150, 105, 0.25)'
  },
  { 
    name: 'Rojo Esparta', 
    primary: '#FF3B30', 
    gradient: 'linear-gradient(135deg, #FF3B30, #FF5252)', 
    badgeGradient: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
    bg: 'linear-gradient(180deg, rgba(255, 59, 48, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(255, 59, 48, 0.35)',
    shadow: 'rgba(255, 59, 48, 0.12)',
    btnShadow: 'rgba(255, 59, 48, 0.25)'
  },
  { 
    name: 'Morado Premium', 
    primary: '#7C3AED', 
    gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', 
    badgeGradient: 'linear-gradient(135deg, #7C3AED, #C084FC)',
    bg: 'linear-gradient(180deg, rgba(124, 58, 237, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(124, 58, 237, 0.35)',
    shadow: 'rgba(124, 58, 237, 0.12)',
    btnShadow: 'rgba(124, 58, 237, 0.25)'
  },
  { 
    name: 'Ámbar Intenso', 
    primary: '#D97706', 
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B)', 
    badgeGradient: 'linear-gradient(135deg, #D97706, #FBBF24)',
    bg: 'linear-gradient(180deg, rgba(217, 119, 6, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(217, 119, 6, 0.35)',
    shadow: 'rgba(217, 119, 6, 0.12)',
    btnShadow: 'rgba(217, 119, 6, 0.25)'
  },
  { 
    name: 'Cyan Pro', 
    primary: '#0891B2', 
    gradient: 'linear-gradient(135deg, #0891B2, #06B6D4)', 
    badgeGradient: 'linear-gradient(135deg, #0891B2, #22D3EE)',
    bg: 'linear-gradient(180deg, rgba(8, 145, 178, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(8, 145, 178, 0.35)',
    shadow: 'rgba(8, 145, 178, 0.12)',
    btnShadow: 'rgba(8, 145, 178, 0.25)'
  },
  { 
    name: 'Rosa Vibrante', 
    primary: '#DB2777', 
    gradient: 'linear-gradient(135deg, #DB2777, #EC4899)', 
    badgeGradient: 'linear-gradient(135deg, #DB2777, #F472B6)',
    bg: 'linear-gradient(180deg, rgba(219, 39, 119, 0.06) 0%, var(--card-bg) 60%)', 
    border: 'rgba(219, 39, 119, 0.35)',
    shadow: 'rgba(219, 39, 119, 0.12)',
    btnShadow: 'rgba(219, 39, 119, 0.25)'
  }
];

export const AdminAcademiasManager = ({ onNotice, setConfirmModal }) => {
  // Academies list from Firestore 'academias' collection
  const [customAcademies, setCustomAcademies] = useState([]);
  const [selectedAcademyId, setSelectedAcademyId] = useState('');

  // Weeks of the active selected academy
  const [weeks, setWeeks] = useState([]);
  const [weekNum, setWeekNum] = useState(0);
  const [weekNameOverride, setWeekNameOverride] = useState('');
  const [weekStatus, setWeekStatus] = useState('disponible');
  const [jsonInput, setJsonInput] = useState('');
  const [editingWeekId, setEditingWeekId] = useState(null);
  const [isSubmittingWeek, setIsSubmittingWeek] = useState(false);

  // New Academy Modal State
  const [isNewAcademyModalOpen, setIsNewAcademyModalOpen] = useState(false);
  const [academyModalMode, setAcademyModalMode] = useState('create'); // 'create' | 'edit'
  const [academyForm, setAcademyForm] = useState({
    id: '',
    nombre: '',
    badge: '🎓 ',
    subtitulo: 'Ciclo 2027 • Clases y Materiales',
    descripcion: '',
    driveUrl: '',
    driveText: 'Material usado en clases',
    cicloName: 'Ciclo 2027',
    colorTheme: ACADEMY_COLOR_PRESETS[0]
  });

  // Copy feedback states
  const [copiedExtractor, setCopiedExtractor] = useState(false);
  const [copiedZip, setCopiedZip] = useState(false);

  // 1. Subscribe to custom academies in Firestore 'academias' collection
  useEffect(() => {
    try {
      const q = query(collection(db, 'academias'));
      const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Filter out briceno to keep custom academies distinct
        const filtered = list.filter(a => a.id !== 'briceno');
        setCustomAcademies(filtered);
        
        // If current selection is invalid, select the first available
        if (filtered.length > 0) {
          setSelectedAcademyId(prev => {
            if (!prev || !filtered.some(a => a.id === prev)) {
              return filtered[0].id;
            }
            return prev;
          });
        } else {
          setSelectedAcademyId('');
        }
      }, (err) => {
        console.warn('Notice listening to academias:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Error loading academias:', e);
    }
  }, []);

  // Current selected academy
  const activeAcademy = customAcademies.find(a => a.id === selectedAcademyId) || null;

  // 2. Subscribe in real time to the active academy's weeks collection
  useEffect(() => {
    if (!activeAcademy) {
      setWeeks([]);
      return;
    }
    const collName = activeAcademy.semanasCollection || `${activeAcademy.id}_semanas`;
    try {
      const q = query(collection(db, collName));
      const unsub = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.num !== undefined ? a.num : 99) - (b.num !== undefined ? b.num : 99));
        setWeeks(docs);
      }, (err) => {
        console.warn(`Firestore notice on collection ${collName}:`, err);
      });
      return () => unsub();
    } catch (e) {
      console.warn(`Error subscribing to ${collName}:`, e);
    }
  }, [activeAcademy?.id, activeAcademy?.semanasCollection]);

  // Helper: Slugify names to generate safe Firestore IDs
  const generateSlug = (str) => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  // Open Create Academy Modal
  const handleOpenCreateAcademy = () => {
    setAcademyModalMode('create');
    setAcademyForm({
      id: '',
      nombre: '',
      badge: '🎓 ',
      subtitulo: 'Ciclo 2027 • Clases y Materiales',
      descripcion: 'Clases grabadas, materias y materiales organizados por semanas.',
      driveUrl: '',
      driveText: 'Material usado en clases',
      cicloName: 'Ciclo 2027',
      colorTheme: ACADEMY_COLOR_PRESETS[0]
    });
    setIsNewAcademyModalOpen(true);
  };

  // Open Edit Academy Modal
  const handleOpenEditAcademy = (acad) => {
    setAcademyModalMode('edit');
    setAcademyForm({
      id: acad.id,
      nombre: acad.nombre || '',
      badge: acad.badge || '🎓 ACADEMIA',
      subtitulo: acad.subtitulo || '',
      descripcion: acad.descripcion || '',
      driveUrl: acad.driveUrl || '',
      driveText: acad.driveText || 'Material usado en clases',
      cicloName: acad.cicloName || 'Ciclo 2027',
      colorTheme: acad.colorTheme || ACADEMY_COLOR_PRESETS[0]
    });
    setIsNewAcademyModalOpen(true);
  };

  // Save (Create / Update) Academy
  const handleSaveAcademy = async (e) => {
    e.preventDefault();
    if (!academyForm.nombre.trim()) {
      onNotice("Campo requerido", "Por favor ingresa un nombre para la academia.");
      return;
    }

    const cleanSlug = academyModalMode === 'create' 
      ? (generateSlug(academyForm.id) || generateSlug(academyForm.nombre))
      : academyForm.id;

    if (!cleanSlug) {
      onNotice("Identificador inválido", "No se pudo generar un ID válido para la academia.");
      return;
    }

    if (academyModalMode === 'create' && (cleanSlug === 'briceno' || customAcademies.some(a => a.id === cleanSlug))) {
      onNotice("ID en uso", `Ya existe una academia con el ID "${cleanSlug}". Por favor usa otro nombre.`);
      return;
    }

    const collName = `${cleanSlug}_semanas`;

    const payload = {
      id: cleanSlug,
      nombre: academyForm.nombre.trim(),
      badge: academyForm.badge.trim() || `🎓 ${academyForm.nombre.toUpperCase()}`,
      subtitulo: academyForm.subtitulo.trim() || 'Ciclo 2027 • Clases y Materiales',
      descripcion: academyForm.descripcion.trim() || 'Clases grabadas, materias y materiales organizados por semanas.',
      semanasCollection: collName,
      driveUrl: academyForm.driveUrl?.trim() || '',
      driveText: academyForm.driveText?.trim() || 'Material usado en clases',
      cicloName: academyForm.cicloName.trim() || 'Ciclo 2027',
      colorTheme: academyForm.colorTheme || ACADEMY_COLOR_PRESETS[0],
      template: 'briceno',
      updatedAt: serverTimestamp()
    };

    if (academyModalMode === 'create') {
      payload.createdAt = serverTimestamp();
    }

    try {
      await setDoc(doc(db, 'academias', cleanSlug), payload, { merge: true });
      setIsNewAcademyModalOpen(false);
      setSelectedAcademyId(cleanSlug);
      onNotice(
        academyModalMode === 'create' ? "¡Academia Creada!" : "Academia Actualizada",
        academyModalMode === 'create' 
          ? `Se creó "${payload.nombre}" con su colección propia "${collName}". Empieza vacía y lista para agregar semanas.`
          : `Se guardaron los cambios de "${payload.nombre}".`
      );
    } catch (err) {
      onNotice("Error al guardar academia", err.message);
    }
  };

  // Delete an academy
  const handleDeleteAcademy = (acad) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar Academia ${acad.nombre}?`,
      message: `Esta acción eliminará el registro de la academia "${acad.nombre}". Su colección de semanas (${acad.semanasCollection || acad.id + '_semanas'}) no se mostrará más en el catálogo.`,
      confirmText: 'Sí, Eliminar Academia',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'academias', acad.id));
          onNotice("Academia Eliminada", `La academia "${acad.nombre}" fue eliminada.`);
        } catch (e) {
          onNotice("Error", e.message);
        }
      }
    });
  };

  // Preload JSON in editor for a week
  const handleEditWeek = (week) => {
    setEditingWeekId(week.id);
    setWeekNum(week.num !== undefined ? week.num : 0);
    setWeekNameOverride(week.nombre || '');
    setWeekStatus(week.status || 'disponible');
    setJsonInput(JSON.stringify(week.data || [], null, 2));
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingWeekId(null);
    setWeekNum(weeks.length > 0 ? Math.max(...weeks.map(w => w.num || 0)) + 1 : 0);
    setWeekNameOverride('');
    setWeekStatus('disponible');
    setJsonInput('');
  };

  // Submit Week to Firestore
  const handleSaveWeek = async (e) => {
    e.preventDefault();
    if (!activeAcademy) {
      onNotice("Sin academia", "Primero crea o selecciona una academia.");
      return;
    }
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

    setIsSubmittingWeek(true);
    const collName = activeAcademy.semanasCollection || `${activeAcademy.id}_semanas`;
    try {
      await setDoc(doc(db, collName, docId), payload, { merge: true });
      onNotice("¡Semana Guardada!", `Se guardó correctamente "${weekName}" en la colección "${collName}".`);
      setEditingWeekId(null);
      setJsonInput('');
      setWeekNum(Number(weekNum) + 1);
    } catch (err) {
      onNotice("Error al guardar semana", err.message);
    } finally {
      setIsSubmittingWeek(false);
    }
  };

  // Delete Week confirmation
  const handleDeleteWeek = (week) => {
    if (!activeAcademy) return;
    const collName = activeAcademy.semanasCollection || `${activeAcademy.id}_semanas`;
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar ${week.nombre || week.id}?`,
      message: `¿Seguro que deseas eliminar el documento "${week.id}" de la colección "${collName}"? Los cambios se verán al instante en la app.`,
      confirmText: 'Eliminar de Firebase',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, collName, week.id));
          onNotice("Semana Eliminada", `Documento "${week.id}" eliminado de ${collName}.`);
        } catch (e) {
          onNotice("Error", e.message);
        }
      }
    });
  };

  // Extractor script
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
    alert("⚠️ No se extrajo ningún enlace. Revisa que estés logueado en la plataforma de la academia.");
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

    print("\\n🚀 Listo! Puedes copiar el contenido de cada JSON y pegarlo en el Panel de Administración.")

if __name__ == "__main__":
    procesar_recursos()`;

    navigator.clipboard.writeText(zipCode);
    setCopiedZip(true);
    setTimeout(() => setCopiedZip(false), 2500);
    onNotice("Script Copiado", "El script Python fue copiado al portapapeles.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header de la sección Academias */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '24px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(168, 85, 247, 0.08))',
          border: '1.5px solid var(--card-border)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.6rem' }}>🏛️</span>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Gestor de Academias (Plantilla Briceño)
              </h2>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'rgba(0, 122, 255, 0.15)',
                color: 'var(--accent-color)'
              }}>
                {customAcademies.length} {customAcademies.length === 1 ? 'ACADEMIA' : 'ACADEMIAS'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '680px' }}>
              Crea y administra cualquier academia con la plantilla de Briceño. Cada academia tiene su propio nombre, colores, semanas y colección independiente en Firestore.
            </p>
          </div>

          <button
            onClick={handleOpenCreateAcademy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #007AFF, #0051FF)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 122, 255, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} />
            <span>Crear Nueva Academia</span>
          </button>
        </div>
      </div>

      {/* Selector de Academias Creadas */}
      {customAcademies.length === 0 ? (
        <div 
          className="glass-card" 
          style={{ 
            padding: '48px 24px', 
            borderRadius: '24px', 
            textAlign: 'center',
            border: '2px dashed var(--card-border)' 
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🏛️</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Aún no has creado ninguna academia
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', marginInline: 'auto' }}>
            Haz clic en el botón para crear tu primera academia (por ejemplo: Briceño Tarde, Academia San Marcos, CEPREUNSA Virtual, etc.). Usará automáticamente la plantilla de semanas y videos.
          </p>
          <button
            onClick={handleOpenCreateAcademy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '14px',
              border: 'none',
              background: 'var(--accent-color)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Crear Primera Academia
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tus Academias Registradas
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Selecciona una para administrar sus semanas
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
            marginBottom: '10px'
          }}>
            {customAcademies.map(acad => {
              const isSelected = acad.id === selectedAcademyId;
              const theme = acad.colorTheme || ACADEMY_COLOR_PRESETS[0];

              return (
                <div
                  key={acad.id}
                  onClick={() => setSelectedAcademyId(acad.id)}
                  className="glass-card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: '18px',
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${theme.primary}` : '1.5px solid var(--card-border)',
                    background: isSelected ? theme.bg : 'var(--card-bg)',
                    boxShadow: isSelected ? `0 8px 24px ${theme.shadow}` : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      padding: '3px 9px',
                      borderRadius: '10px',
                      fontSize: '0.70rem',
                      fontWeight: 800,
                      background: theme.badgeGradient,
                      color: '#FFFFFF'
                    }}>
                      {acad.badge || '🎓 ACADEMIA'}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEditAcademy(acad)}
                        title="Editar Datos de la Academia"
                        style={{
                          background: 'rgba(120, 120, 128, 0.12)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '5px 7px',
                          cursor: 'pointer',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAcademy(acad)}
                        title="Eliminar Academia"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '5px 7px',
                          cursor: 'pointer',
                          color: '#EF4444'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {acad.nombre}
                  </h3>
                  <p style={{ margin: '0 0 10px', fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                    {acad.subtitulo || 'Plantilla Briceño'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      📁 {acad.semanasCollection || `${acad.id}_semanas`}
                    </span>
                    <a
                      href={`#/cursos/${acad.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: theme.primary,
                        textDecoration: 'none'
                      }}
                    >
                      <Eye size={13} /> Ver en Web ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GESTIÓN DE SEMANAS PARA LA ACADEMIA SELECCIONADA */}
      {activeAcademy && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Banner de Academia Activa */}
          <div 
            className="glass-card"
            style={{
              padding: '18px 22px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              border: `1.5px solid ${(activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).border}`,
              background: (activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).bg
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>📚</span>
                <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Gestión de Semanas: {activeAcademy.nombre}
                </h3>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Colección en Firebase: <strong style={{ color: (activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).primary }}>{activeAcademy.semanasCollection || `${activeAcademy.id}_semanas`}</strong> ({weeks.length} semanas subidas)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleOpenEditAcademy(activeAcademy)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} /> Editar Academia
              </button>

              <a
                href={`#/cursos/${activeAcademy.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  background: (activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).gradient,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
              >
                <Eye size={14} /> Probar Vista de Alumno ↗
              </a>
            </div>
          </div>

          {/* Formulario de Carga de Semana */}
          <div className="glass-card" style={{ padding: '22px', borderRadius: '22px', border: '1.5px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {editingWeekId ? `✏️ Editando: ${editingWeekId}` : `➕ Agregar o Actualizar Semana (${activeAcademy.nombre})`}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Pega el JSON con la lista de cursos y videos correspondiente a la semana.
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
                  disabled={isSubmittingWeek}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: (activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).gradient,
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: isSubmittingWeek ? 'not-allowed' : 'pointer',
                    opacity: isSubmittingWeek ? 0.7 : 1,
                    boxShadow: `0 6px 18px ${(activeAcademy.colorTheme || ACADEMY_COLOR_PRESETS[0]).btnShadow}`
                  }}
                >
                  <Save size={16} />
                  <span>{isSubmittingWeek ? 'Guardando...' : editingWeekId ? 'Actualizar en Firebase' : 'Guardar Semana'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Semanas Subidas */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
              Semanas Registradas en {activeAcademy.nombre} ({weeks.length})
            </h3>

            {weeks.length === 0 ? (
              <div className="glass-card" style={{ padding: '32px 20px', borderRadius: '18px', textAlign: 'center', border: '1.5px dashed var(--card-border)' }}>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Esta academia aún no tiene semanas registradas. Utiliza el formulario superior para subir la primera semana.
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

          {/* Panel de Scripts Extractores */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: '20px', border: '1.5px solid var(--card-border)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🛠️ Scripts Extractores de Videos para {activeAcademy.nombre}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Usa estos scripts para extraer las clases automáticamente de la web de la academia y generar los JSON de las semanas.
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
      )}

      {/* MODAL CREAR / EDITAR ACADEMIA (RESPONSIVE: DEBAJO DEL HEADER Y SOBRE LA NAVBAR) */}
      {isNewAcademyModalOpen && (
        <div className="academy-modal-overlay">
          <div className="academy-modal-card">
            
            {/* Header del Modal (Fijo arriba) */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--card-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
              background: 'var(--card-bg)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {academyModalMode === 'create' ? '🏛️ Crear Nueva Academia' : '✏️ Editar Academia'}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {academyModalMode === 'create' 
                    ? 'Tendrá su propia colección independiente de semanas en Firestore.'
                    : 'Actualiza los datos visibles y enlaces de la academia.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAcademyModalOpen(false)}
                style={{
                  background: 'rgba(120, 120, 128, 0.12)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>

            {/* Formulario con cuerpo scrolleable y pie fijo */}
            <form onSubmit={handleSaveAcademy} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              
              {/* Contenido scrolleable */}
              <div style={{
                padding: '16px 20px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                WebkitOverflowScrolling: 'touch'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Nombre de la Academia *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Academia Briceño Tarde, San Marcos Virtual..."
                    value={academyForm.nombre}
                    onChange={(e) => setAcademyForm({ ...academyForm, nombre: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.90rem',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Badge / Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 🎓 NUEVA ACADEMIA"
                      value={academyForm.badge}
                      onChange={(e) => setAcademyForm({ ...academyForm, badge: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Nombre del Ciclo Visible
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Ciclo Actual 2027"
                      value={academyForm.cicloName}
                      onChange={(e) => setAcademyForm({ ...academyForm, cicloName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Subtítulo Breve
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Ciclo 2027 • CEPREUNSA / Ordinario"
                    value={academyForm.subtitulo}
                    onChange={(e) => setAcademyForm({ ...academyForm, subtitulo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Descripción
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Descripción de la academia, horarios y contenido que se imparte..."
                    value={academyForm.descripcion}
                    onChange={(e) => setAcademyForm({ ...academyForm, descripcion: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Enlace y Texto de Google Drive (OPCIONAL) */}
                <div style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(5, 150, 105, 0.06)',
                  border: '1.5px solid rgba(5, 150, 105, 0.22)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        📁 Enlace a Carpeta de Google Drive (Opcional)
                      </label>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#059669',
                        background: 'rgba(5, 150, 105, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        OPCIONAL
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/... (puedes dejarlo vacío)"
                      value={academyForm.driveUrl}
                      onChange={(e) => setAcademyForm({ ...academyForm, driveUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '3px' }}>
                      Si se deja vacío, no se mostrará ningún botón de Drive a los alumnos.
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ✏️ Texto Personalizado del Botón de Drive
                      </label>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--text-secondary)',
                        background: 'rgba(120, 120, 128, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        EDITABLE
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Ej: Material usado en clases, Guías y Libros, Materiales 2027..."
                      value={academyForm.driveText}
                      onChange={(e) => setAcademyForm({ ...academyForm, driveText: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '3px' }}>
                      Texto visible en el botón del encabezado y al lado de los filtros de semanas.
                    </span>
                  </div>
                </div>

                {/* Selector de Tema de Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Paleta de Color e Identidad Visual
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {ACADEMY_COLOR_PRESETS.map((preset, idx) => {
                      const isSelected = academyForm.colorTheme?.name === preset.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setAcademyForm({ ...academyForm, colorTheme: preset })}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '12px',
                            border: isSelected ? `2px solid ${preset.primary}` : '1.5px solid var(--card-border)',
                            background: isSelected ? 'rgba(120, 120, 128, 0.12)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '6px',
                            background: preset.primary,
                            flexShrink: 0
                          }} />
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {preset.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vista previa de la colección */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 255, 0.08)',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}>
                  ℹ️ Colección en Firebase: <code>{generateSlug(academyForm.id || academyForm.nombre) || 'mi_academia'}_semanas</code>
                </div>

              </div>

              {/* Footer con Botones (Fijo abajo, siempre visible sobre la navbar) */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0
              }}>
                <button
                  type="button"
                  onClick={() => setIsNewAcademyModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--card-border)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'var(--accent-color)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
                  }}
                >
                  {academyModalMode === 'create' ? 'Crear Academia' : 'Guardar Cambios'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
