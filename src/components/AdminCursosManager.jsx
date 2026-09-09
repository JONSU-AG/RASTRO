import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Video, 
  FileText, 
  ExternalLink, 
  Layers, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon,
  PlayCircle,
  FolderPlus,
  Save,
  ArrowRight,
  Info
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';

const COLOR_PRESETS = [
  { name: 'Rojo Esparta', primary: '#FF3B30', gradient: 'linear-gradient(135deg, #FF3B30, #FF5252)', bg: 'rgba(255, 59, 48, 0.08)', border: 'rgba(255, 59, 48, 0.35)' },
  { name: 'Azul Kelsen', primary: '#007AFF', gradient: 'linear-gradient(135deg, #007AFF, #00C6FF)', bg: 'rgba(0, 122, 255, 0.08)', border: 'rgba(0, 122, 255, 0.35)' },
  { name: 'Verde Briceño', primary: '#059669', gradient: 'linear-gradient(135deg, #059669, #10B981)', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.35)' },
  { name: 'Morado Premium', primary: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)', bg: 'rgba(124, 58, 237, 0.08)', border: 'rgba(124, 58, 237, 0.35)' },
  { name: 'Ámbar Intenso', primary: '#D97706', gradient: 'linear-gradient(135deg, #D97706, #F59E0B)', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.35)' },
  { name: 'Rosa Vibrante', primary: '#DB2777', gradient: 'linear-gradient(135deg, #DB2777, #EC4899)', bg: 'rgba(219, 39, 119, 0.08)', border: 'rgba(219, 39, 119, 0.35)' },
  { name: 'Cyan Pro', primary: '#0891B2', gradient: 'linear-gradient(135deg, #0891B2, #06B6D4)', bg: 'rgba(8, 145, 178, 0.08)', border: 'rgba(8, 145, 178, 0.35)' }
];

export const AdminCursosManager = ({ onNotice }) => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Bulk add modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [targetModuleId, setTargetModuleId] = useState('');

  // Course Form State
  const [courseForm, setCourseForm] = useState({
    id: '',
    nombre: '',
    badge: '🎓 CURSO',
    colorTheme: COLOR_PRESETS[3],
    subtitulo: 'Ciclo 2027 • Clases y Materiales',
    descripcion: '',
    activo: true,
    modules: []
  });

  // Single video add form inside module
  const [newVideoForm, setNewVideoForm] = useState({
    titulo: '',
    url: '',
    tipo: 'video',
    docUrl: '',
    docNombre: ''
  });

  // Subscribe to real-time courses in Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'cursos'), orderBy('orden', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCursos(list);
      }, (err) => console.warn('Cursos snapshot notice:', err));
      return () => unsub();
    } catch (e) {
      console.warn('Error fetching cursos:', e);
    }
  }, []);

  const resetCourseForm = () => {
    setCourseForm({
      id: '',
      nombre: '',
      badge: '🎓 CURSO',
      colorTheme: COLOR_PRESETS[3],
      subtitulo: 'Ciclo 2027 • Clases y Materiales',
      descripcion: '',
      activo: true,
      modules: [
        {
          id: 'mod_1',
          nombre: 'Módulo 1: Introducción y Fundamentos',
          desc: 'Primeras sesiones y teoría base',
          items: []
        }
      ]
    });
    setIsEditingCourse(false);
  };

  const handleEditCourse = (curso) => {
    setSelectedCurso(curso);
    setCourseForm({
      id: curso.id,
      nombre: curso.nombre || '',
      badge: curso.badge || '🎓 CURSO',
      colorTheme: curso.colorTheme || COLOR_PRESETS[3],
      subtitulo: curso.subtitulo || '',
      descripcion: curso.descripcion || '',
      activo: curso.activo !== false,
      modules: Array.isArray(curso.modules) ? curso.modules : []
    });
    setIsEditingCourse(true);
    setActiveModuleIndex(0);
  };

  const handleSaveCourse = async (e) => {
    e?.preventDefault();
    if (!courseForm.nombre.trim()) {
      if (onNotice) onNotice('Nombre Requerido', 'Por favor ingresa un nombre para el curso o academia.');
      return;
    }

    let slug = courseForm.id.trim();
    if (!slug) {
      slug = courseForm.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    try {
      const courseDoc = {
        nombre: courseForm.nombre.trim(),
        badge: courseForm.badge.trim() || '🎓 CURSO',
        colorTheme: courseForm.colorTheme,
        subtitulo: courseForm.subtitulo.trim(),
        descripcion: courseForm.descripcion.trim(),
        activo: courseForm.activo !== false,
        orden: selectedCurso?.orden ?? cursos.length,
        modules: courseForm.modules || [],
        updatedAt: serverTimestamp()
      };

      if (!selectedCurso) {
        courseDoc.createdAt = serverTimestamp();
      }

      await setDoc(doc(db, 'cursos', slug), courseDoc, { merge: true });

      if (onNotice) {
        onNotice('Curso Guardado 🚀', `El curso "${courseForm.nombre}" fue guardado exitosamente.`);
      }

      // Update local selection
      setSelectedCurso({ id: slug, ...courseDoc });
      setIsEditingCourse(false);
    } catch (err) {
      if (onNotice) onNotice('Error al Guardar', err.message);
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (!confirm(`¿Estás seguro de eliminar el curso "${courseName}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteDoc(doc(db, 'cursos', courseId));
      if (selectedCurso?.id === courseId) {
        setSelectedCurso(null);
        setIsEditingCourse(false);
      }
      if (onNotice) onNotice('Curso Eliminado', `El curso "${courseName}" ha sido eliminado.`);
    } catch (err) {
      if (onNotice) onNotice('Error al Eliminar', err.message);
    }
  };

  // ──────────────── GESTIÓN DE MÓDULOS / DIVS ────────────────
  const handleAddModule = () => {
    const modCount = (courseForm.modules || []).length + 1;
    const newMod = {
      id: `mod_${Date.now()}`,
      nombre: `Módulo ${modCount}: Nuevo Módulo / Sección`,
      desc: '',
      items: []
    };
    const updatedMods = [...(courseForm.modules || []), newMod];
    setCourseForm(prev => ({ ...prev, modules: updatedMods }));
    setActiveModuleIndex(updatedMods.length - 1);
  };

  const handleDeleteModule = (modIndex) => {
    if ((courseForm.modules || []).length <= 1) {
      if (onNotice) onNotice('Aviso', 'El curso debe tener al menos un módulo o sección.');
      return;
    }
    const updated = courseForm.modules.filter((_, i) => i !== modIndex);
    setCourseForm(prev => ({ ...prev, modules: updated }));
    setActiveModuleIndex(Math.max(0, modIndex - 1));
  };

  const handleUpdateModuleName = (modIndex, newName) => {
    const updated = [...courseForm.modules];
    updated[modIndex] = { ...updated[modIndex], nombre: newName };
    setCourseForm(prev => ({ ...prev, modules: updated }));
  };

  const handleUpdateModuleDesc = (modIndex, newDesc) => {
    const updated = [...courseForm.modules];
    updated[modIndex] = { ...updated[modIndex], desc: newDesc };
    setCourseForm(prev => ({ ...prev, modules: updated }));
  };

  // ──────────────── GESTIÓN DE VIDEOS / ITEMS ────────────────
  const handleAddVideoToModule = (modIndex) => {
    if (!newVideoForm.titulo.trim() && !newVideoForm.url.trim()) {
      if (onNotice) onNotice('Campo Requerido', 'Ingresa al menos el título o enlace del video.');
      return;
    }

    const newItem = {
      id: `vid_${Date.now()}`,
      titulo: newVideoForm.titulo.trim() || `Clase ${(courseForm.modules[modIndex]?.items?.length || 0) + 1}`,
      url: newVideoForm.url.trim(),
      tipo: newVideoForm.tipo || 'video',
      docUrl: newVideoForm.docUrl.trim(),
      docNombre: newVideoForm.docNombre.trim() || (newVideoForm.docUrl ? 'Material de clase' : '')
    };

    const updated = [...courseForm.modules];
    updated[modIndex] = {
      ...updated[modIndex],
      items: [...(updated[modIndex].items || []), newItem]
    };

    setCourseForm(prev => ({ ...prev, modules: updated }));
    setNewVideoForm({ titulo: '', url: '', tipo: 'video', docUrl: '', docNombre: '' });
  };

  const handleDeleteVideo = (modIndex, vidIndex) => {
    const updated = [...courseForm.modules];
    updated[modIndex] = {
      ...updated[modIndex],
      items: updated[modIndex].items.filter((_, i) => i !== vidIndex)
    };
    setCourseForm(prev => ({ ...prev, modules: updated }));
  };

  // ──────────────── IMPORTADOR RÁPIDO EN LOTE ────────────────
  const handleProcessBulk = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedItems = [];

    lines.forEach((line, idx) => {
      // Formats supported:
      // Title | VideoURL | MaterialURL
      // or just VideoURL
      // or Title - VideoURL
      const parts = line.split(/[|]/).map(p => p.trim());
      let titulo = '';
      let url = '';
      let docUrl = '';

      if (parts.length >= 2) {
        titulo = parts[0];
        url = parts[1];
        docUrl = parts[2] || '';
      } else {
        // Only one piece
        if (parts[0].startsWith('http')) {
          url = parts[0];
          titulo = `Clase ${idx + 1}`;
        } else {
          titulo = parts[0];
        }
      }

      if (titulo || url) {
        parsedItems.push({
          id: `vid_${Date.now()}_${idx}`,
          titulo: titulo || `Clase ${idx + 1}`,
          url: url,
          tipo: 'video',
          docUrl: docUrl,
          docNombre: docUrl ? 'Material de apoyo' : ''
        });
      }
    });

    if (parsedItems.length === 0) {
      if (onNotice) onNotice('Sin elementos', 'No se pudieron interpretar videos del texto pegado.');
      return;
    }

    const modIndex = courseForm.modules.findIndex(m => m.id === targetModuleId);
    const targetIdx = modIndex >= 0 ? modIndex : activeModuleIndex;

    const updated = [...courseForm.modules];
    updated[targetIdx] = {
      ...updated[targetIdx],
      items: [...(updated[targetIdx].items || []), ...parsedItems]
    };

    setCourseForm(prev => ({ ...prev, modules: updated }));
    setBulkModalOpen(false);
    setBulkText('');
    if (onNotice) onNotice('¡Videos Agregados!', `Se importaron ${parsedItems.length} videos exitosamente a "${updated[targetIdx].nombre}".`);
  };

  const currentModule = courseForm.modules?.[activeModuleIndex];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap style={{ color: 'var(--accent-color)' }} size={26} />
            <span>Gestor de Cursos & Academias</span>
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Crea academias y cursos personalizados. Configura sus módulos (divs), videos de YouTube o Drive y material descargable de forma ultrarrápida.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetCourseForm();
            setIsEditingCourse(true);
          }}
          style={{
            padding: '10px 18px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #007AFF, #00C6FF)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
          }}
        >
          <Plus size={18} />
          <span>+ Nuevo Curso</span>
        </button>
      </div>

      {/* Editor de Curso Activo (Creación / Edición) */}
      {isEditingCourse ? (
        <form onSubmit={handleSaveCourse} className="glass-card" style={{ padding: '24px', borderRadius: '24px', border: '1.5px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚙️</span>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedCurso ? `Editando: ${selectedCurso.nombre}` : 'Nuevo Curso / Academia'}
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsEditingCourse(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Save size={15} />
                <span>Guardar Curso</span>
              </button>
            </div>
          </div>

          {/* Fila 1: Nombre, Slug (ID) y Tag/Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Nombre del Curso o Academia *
              </label>
              <input
                required
                value={courseForm.nombre}
                onChange={e => setCourseForm({ ...courseForm, nombre: e.target.value })}
                placeholder="Ej. Academia Fleming / Ciclo San Marcos"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Etiqueta / Badge (En portada)
              </label>
              <input
                value={courseForm.badge}
                onChange={e => setCourseForm({ ...courseForm, badge: e.target.value })}
                placeholder="Ej. 🔬 FLEMING / 🔥 2027"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Identificador URL (Slug)
              </label>
              <input
                value={courseForm.id}
                onChange={e => setCourseForm({ ...courseForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                placeholder="ej: fleming (autogenerado si está vacío)"
                disabled={Boolean(selectedCurso)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Fila 2: Subtítulo y Descripción */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Subtítulo / Info Rápida
              </label>
              <input
                value={courseForm.subtitulo}
                onChange={e => setCourseForm({ ...courseForm, subtitulo: e.target.value })}
                placeholder="Ej. 18 Materias • Clases en Vivo y Grabadas"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Descripción del Curso
              </label>
              <input
                value={courseForm.descripcion}
                onChange={e => setCourseForm({ ...courseForm, descripcion: e.target.value })}
                placeholder="Ej. Preparación intensiva de ciencias y letras para el examen de admisión"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Fila 3: Paleta de Color y Visibilidad */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Tema y Color Visual
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = courseForm.colorTheme?.name === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, colorTheme: preset })}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${preset.primary}` : '1px solid var(--card-border)',
                        background: isSelected ? preset.bg : 'var(--card-bg)',
                        color: isSelected ? preset.primary : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.gradient }} />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
              <input
                type="checkbox"
                checked={courseForm.activo}
                onChange={e => setCourseForm({ ...courseForm, activo: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
              />
              <span>Publicado / Visible en /cursos</span>
            </label>
          </div>

          {/* ──────────────── SECCIÓN DE DIVS Y MÓDULOS ("SUS DIVS Y SUS VIDEOS") ──────────────── */}
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: courseForm.colorTheme?.primary || 'var(--accent-color)' }} />
                  <span>Módulos y Secciones ("Divs") del Curso</span>
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Organiza el contenido en módulos temáticos, semanas o asignaturas. Cada div contiene sus videos y materiales.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setTargetModuleId(currentModule?.id || courseForm.modules?.[0]?.id || '');
                    setBulkModalOpen(true);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    background: 'rgba(168, 85, 247, 0.1)',
                    color: '#A855F7',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>⚡ Pegar Lista en Lote</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddModule}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: courseForm.colorTheme?.gradient || 'linear-gradient(135deg, #007AFF, #00C6FF)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FolderPlus size={15} />
                  <span>+ Agregar Div / Módulo</span>
                </button>
              </div>
            </div>

            {/* Pestañas de Módulos */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {(courseForm.modules || []).map((mod, idx) => {
                const isActive = activeModuleIndex === idx;
                const vidCount = mod.items?.length || 0;
                return (
                  <button
                    key={mod.id || idx}
                    type="button"
                    onClick={() => setActiveModuleIndex(idx)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: isActive ? `1.5px solid ${courseForm.colorTheme?.primary || 'var(--accent-color)'}` : '1px solid var(--card-border)',
                      background: isActive ? (courseForm.colorTheme?.bg || 'rgba(0, 122, 255, 0.1)') : 'var(--card-bg)',
                      color: isActive ? (courseForm.colorTheme?.primary || 'var(--accent-color)') : 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📁 {mod.nombre || `Módulo ${idx + 1}`}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.8, background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '8px' }}>
                      {vidCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contenido del Módulo Activo */}
            {currentModule && (
              <div style={{ background: 'rgba(120, 120, 128, 0.05)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Cabecera del Módulo con edición rápida */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Título de la Sección / Div:</span>
                      <input
                        value={currentModule.nombre}
                        onChange={e => handleUpdateModuleName(activeModuleIndex, e.target.value)}
                        placeholder="Ej. Módulo 1: Cinemática y Dinámica"
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 700 }}
                      />
                    </div>

                    <input
                      value={currentModule.desc || ''}
                      onChange={e => handleUpdateModuleDesc(activeModuleIndex, e.target.value)}
                      placeholder="Descripción u objetivos de este módulo (opcional)"
                      style={{ width: '100%', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '0.8rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteModule(activeModuleIndex)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#EF4444',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Eliminar Módulo</span>
                  </button>
                </div>

                {/* Formulario para agregar Video Individual */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Video size={14} style={{ color: 'var(--accent-color)' }} />
                    <span>+ Agregar Video o Clase a este Módulo</span>
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <input
                      value={newVideoForm.titulo}
                      onChange={e => setNewVideoForm({ ...newVideoForm, titulo: e.target.value })}
                      placeholder="Título de la clase (Ej: Clase 01: Vectores)"
                      style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(120, 120, 128, 0.05)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                    />

                    <input
                      value={newVideoForm.url}
                      onChange={e => setNewVideoForm({ ...newVideoForm, url: e.target.value })}
                      placeholder="Link de video (YouTube o Google Drive)"
                      style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(120, 120, 128, 0.05)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <input
                      value={newVideoForm.docUrl}
                      onChange={e => setNewVideoForm({ ...newVideoForm, docUrl: e.target.value })}
                      placeholder="Link de PDF o Práctica (Opcional)"
                      style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(120, 120, 128, 0.05)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={newVideoForm.docNombre}
                        onChange={e => setNewVideoForm({ ...newVideoForm, docNombre: e.target.value })}
                        placeholder="Nombre material (Ej: Guía Práctica 1)"
                        style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(120, 120, 128, 0.05)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                      />

                      <button
                        type="button"
                        onClick={() => handleAddVideoToModule(activeModuleIndex)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--accent-color)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Videos Registrados en el Módulo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                    Videos en este Div ({currentModule.items?.length || 0}):
                  </span>

                  {(currentModule.items || []).length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      No hay videos agregados aún en este módulo. Agrega uno arriba o usa "⚡ Pegar Lista en Lote".
                    </div>
                  ) : (
                    currentModule.items.map((vid, vidIdx) => (
                      <div
                        key={vid.id || vidIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-color)', width: '22px' }}>
                            #{vidIdx + 1}
                          </span>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {vid.titulo}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                              {vid.url && (
                                <a href={vid.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.74rem', color: 'var(--accent-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <ExternalLink size={11} /> Video
                                </a>
                              )}
                              {vid.docUrl && (
                                <a href={vid.docUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.74rem', color: '#10B981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <FileText size={11} /> {vid.docNombre || 'Material adjunto'}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(activeModuleIndex, vidIdx)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            cursor: 'pointer'
                          }}
                          title="Eliminar video"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      ) : (
        /* Lista de Cursos Existentes */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Cursos y Academias Activos ({cursos.length})
            </h4>
          </div>

          {cursos.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px 20px', borderRadius: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓</div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                No hay cursos personalizados creados aún
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '480px', margin: '0 auto 16px' }}>
                Actualmente se muestran las academias base (Esparta, Kelsen, Briceño). Haz clic en "+ Nuevo Curso" para agregar más academias con sus divs, videos y temas.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetCourseForm();
                  setIsEditingCourse(true);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent-color)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                + Crear Primer Curso
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {cursos.map(curso => {
                const totalVideos = (curso.modules || []).reduce((acc, m) => acc + (m.items?.length || 0), 0);
                const theme = curso.colorTheme || COLOR_PRESETS[3];

                return (
                  <div
                    key={curso.id}
                    className="glass-card"
                    style={{
                      padding: '18px',
                      borderRadius: '20px',
                      border: `1.5px solid ${theme.border || 'var(--card-border)'}`,
                      background: theme.bg || 'var(--card-bg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '99px',
                            background: theme.gradient,
                            color: '#fff',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            marginBottom: '6px'
                          }}
                        >
                          {curso.badge || '🎓 CURSO'}
                        </span>

                        <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {curso.nombre}
                        </h4>

                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                          {curso.subtitulo || `${(curso.modules || []).length} Módulos`}
                        </span>
                      </div>

                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: curso.activo !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: curso.activo !== false ? '#10B981' : '#EF4444',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}
                      >
                        {curso.activo !== false ? 'Visible' : 'Oculto'}
                      </span>
                    </div>

                    {curso.descripcion && (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {curso.descripcion}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '6px 0' }}>
                      <span>📁 <strong>{(curso.modules || []).length}</strong> Módulos (Divs)</span>
                      <span>🎬 <strong>{totalVideos}</strong> Videos</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                      <a
                        href={`/cursos/${curso.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)',
                          color: 'var(--text-main)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Ver</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleEditCourse(curso)}
                        style={{
                          flex: 1,
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: 'none',
                          background: theme.gradient,
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Configurar / Videos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(curso.id, curso.nombre)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                        title="Eliminar curso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Carga Rápida en Lote (Bulk Add) */}
      {bulkModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '24px',
              border: '1.5px solid var(--card-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: '#A855F7' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ⚡ Importar Lista de Videos en Lote
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Pega varias clases de una sola vez (una por línea). El sistema creará todos los videos automáticamente en el módulo seleccionado.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Destino del Módulo:
              </label>
              <select
                value={targetModuleId}
                onChange={e => setTargetModuleId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
              >
                {(courseForm.modules || []).map((m, idx) => (
                  <option key={m.id || idx} value={m.id} style={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}>
                    {m.nombre || `Módulo ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)', fontSize: '0.78rem', color: 'var(--text-main)' }}>
              <strong>Formato sugerido (1 por línea):</strong>
              <div style={{ fontFamily: 'monospace', marginTop: '4px', color: '#A855F7' }}>
                Título de la Clase | Link de Video | Link de Material (opcional)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Ejemplo: Clase 01: Vectores | https://youtu.be/xyz123 | https://drive.google.com/file/d/...
              </div>
            </div>

            <textarea
              rows={8}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder={`Clase 01: Álgebra Básica | https://youtu.be/ejemplo1\nClase 02: Polinomios | https://youtu.be/ejemplo2 | https://drive.google.com/...\nClase 03: Factorización | https://youtu.be/ejemplo3`}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                lineHeight: 1.4,
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleProcessBulk}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                  color: '#fff',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={16} />
                <span>Procesar e Importar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
