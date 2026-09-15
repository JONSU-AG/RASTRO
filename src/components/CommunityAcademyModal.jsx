import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, HardDrive, Calendar, BookOpen, Layers, CheckCircle2, AlertCircle, Link as LinkIcon, Info, Terminal, Copy, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { AI_PROMPT_TEMPLATE, parseVideoLinksAuto } from '../lib/consoleExtractorScript';
import { ConsoleExtractorModal } from './ConsoleExtractorModal';

export const AREA_PRESETS = {
  'Biomédicas': {
    name: 'Biomédicas',
    badge: '🧬 BIOMÉDICAS',
    primary: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    badgeGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    bg: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, var(--card-bg) 65%)',
    border: 'rgba(16, 185, 129, 0.35)',
    shadow: 'rgba(16, 185, 129, 0.12)',
    btnShadow: 'rgba(16, 185, 129, 0.25)'
  },
  'Ingenierías': {
    name: 'Ingenierías',
    badge: '⚙️ INGENIERÍAS',
    primary: '#007AFF',
    gradient: 'linear-gradient(135deg, #007AFF 0%, #2563EB 100%)',
    badgeGradient: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
    bg: 'linear-gradient(180deg, rgba(0, 122, 255, 0.08) 0%, var(--card-bg) 65%)',
    border: 'rgba(0, 122, 255, 0.35)',
    shadow: 'rgba(0, 122, 255, 0.12)',
    btnShadow: 'rgba(0, 122, 255, 0.25)'
  },
  'Sociales': {
    name: 'Ciencias Sociales',
    badge: '🏛️ SOCIALES',
    primary: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    badgeGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    bg: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, var(--card-bg) 65%)',
    border: 'rgba(245, 158, 11, 0.35)',
    shadow: 'rgba(245, 158, 11, 0.12)',
    btnShadow: 'rgba(245, 158, 11, 0.25)'
  },
  'General': {
    name: 'General / Todas',
    badge: '🌐 GENERAL',
    primary: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    badgeGradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    bg: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, var(--card-bg) 65%)',
    border: 'rgba(139, 92, 246, 0.35)',
    shadow: 'rgba(139, 92, 246, 0.12)',
    btnShadow: 'rgba(139, 92, 246, 0.25)'
  }
};

// Common subjects quick list
export const SUGGESTED_SUBJECTS = [
  'Biología',
  'Anatomía',
  'Química',
  'Física',
  'Aritmética',
  'Álgebra',
  'Geometría',
  'Trigonometría',
  'Razonamiento Matemático',
  'Razonamiento Verbal',
  'Lenguaje',
  'Literatura',
  'Historia',
  'Geografía',
  'Cívica',
  'Filosofía',
  'Psicología',
  'Inglés'
];

export const CommunityAcademyModal = ({ isOpen, onClose, academyToEdit = null, onSaved = () => {} }) => {
  const { user, isAdmin } = useAuth();

  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState('General');
  const [tipoEstructura, setTipoEstructura] = useState('semanas'); // 'semanas' | 'cursos'
  const [driveUrl, setDriveUrl] = useState('');
  const [driveText, setDriveText] = useState('Materiales y Clases en Drive');
  const [descripcion, setDescripcion] = useState('');
  const [cicloName, setCicloName] = useState('Ciclo 2027');
  
  // Modo simple para subida múltiple de enlaces
  const [includeInitialLinks, setIncludeInitialLinks] = useState(false);
  const [initialSubject, setInitialSubject] = useState('Biología');
  const [initialLinksText, setInitialLinksText] = useState('');
  const [initialWeekNum, setInitialWeekNum] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExtractorModalOpen, setIsExtractorModalOpen] = useState(false);

  const isEditMode = !!academyToEdit;

  useEffect(() => {
    if (academyToEdit) {
      setNombre(academyToEdit.nombre || '');
      setArea(academyToEdit.area || 'General');
      setTipoEstructura(academyToEdit.tipoEstructura || 'semanas');
      setDriveUrl(academyToEdit.driveUrl || '');
      setDriveText(academyToEdit.driveText || 'Materiales y Clases en Drive');
      setDescripcion(academyToEdit.descripcion || '');
      setCicloName(academyToEdit.cicloName || 'Ciclo 2027');
      setIncludeInitialLinks(false);
    } else {
      setNombre('');
      setArea('General');
      setTipoEstructura('semanas');
      setDriveUrl('');
      setDriveText('Materiales y Clases en Drive');
      setDescripcion('');
      setCicloName('Ciclo 2027');
      setIncludeInitialLinks(false);
      setInitialSubject('Biología');
      setInitialLinksText('');
      setInitialWeekNum(1);
    }
    setErrorMsg('');
  }, [academyToEdit, isOpen]);

  const generateSlug = (str) => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const parsedInitialLinks = useMemo(() => parseVideoLinksAuto(initialLinksText), [initialLinksText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Debes iniciar sesión para compartir o editar un curso.');
      return;
    }

    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa un nombre para el curso.');
      return;
    }

    const cleanSlug = isEditMode ? academyToEdit.id : generateSlug(nombre);
    if (!cleanSlug) {
      setErrorMsg('No se pudo generar un identificador para el curso.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeTheme = AREA_PRESETS[area] || AREA_PRESETS['General'];
      const collName = `${cleanSlug}_semanas`;

      const payload = {
        id: cleanSlug,
        nombre: nombre.trim(),
        badge: activeTheme.badge,
        area: area,
        tipoEstructura: tipoEstructura,
        subtitulo: `${area} • Clases Organizadas`,
        descripcion: descripcion.trim() || `Clases y materiales organizados del curso de ${area}.`,
        semanasCollection: collName,
        driveUrl: driveUrl.trim(),
        driveText: driveText.trim() || 'Materiales en Drive',
        cicloName: 'General',
        colorTheme: activeTheme,
        template: 'briceno',
        updatedAt: serverTimestamp(),
        updatedBy: user.displayName || user.email?.split('@')[0] || 'Estudiante'
      };

      if (!isEditMode) {
        payload.creatorUid = user.uid;
        payload.creatorName = user.displayName || user.email?.split('@')[0] || 'Estudiante RUMBO';
        payload.createdAt = serverTimestamp();
      }

      // 1. Guardar documento principal de la academia
      await setDoc(doc(db, 'academias', cleanSlug), payload, { merge: true });

      // 2. Si el usuario ingresó enlaces iniciales en modo simple, creamos la primera semana/módulo
      if (includeInitialLinks && parsedInitialLinks.length > 0) {
        const weekNum = parseInt(initialWeekNum, 10) || 1;
        const weekDocId = `semana_${weekNum}`;
        const initialWeekPayload = {
          num: weekNum,
          nombre: `Semana ${weekNum.toString().padStart(2, '0')}`,
          status: 'disponible',
          data: [
            {
              nombre: initialSubject,
              categoria: area,
              videos: parsedInitialLinks
            }
          ]
        };
        await setDoc(doc(db, collName, weekDocId), initialWeekPayload, { merge: true });
      }

      setIsSubmitting(false);
      onSaved(payload);
      onClose();
    } catch (err) {
      console.error('Error saving community academy:', err);
      setErrorMsg('Error al guardar: ' + err.message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentTheme = AREA_PRESETS[area] || AREA_PRESETS['General'];

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1000150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box'
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          style={{
            background: 'var(--card-bg)',
            border: `1.5px solid ${currentTheme.border}`,
            borderRadius: '26px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: 'min(92dvh, 740px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.35), 0 0 30px ${currentTheme.shadow}`,
            boxSizing: 'border-box'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            background: currentTheme.gradient,
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏛️</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
                  {isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}
                </h2>
                <span style={{ fontSize: '0.78rem', opacity: 0.9, fontWeight: 700 }}>
                  Modo Simple • Colaborativo para la comunidad
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {errorMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              {/* Nombre del Curso */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Física Preuniversitaria, Aritmética y Álgebra, Repaso UNSA..."
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.05)',
                    color: 'var(--text-main)',
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Selector de Área */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Selecciona el Área
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {Object.keys(AREA_PRESETS).map(key => {
                    const preset = AREA_PRESETS[key];
                    const isSelected = area === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setArea(key)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '14px',
                          border: isSelected ? `2px solid ${preset.primary}` : '1px solid var(--card-border)',
                          background: isSelected ? preset.gradient : 'rgba(120, 120, 128, 0.05)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? `0 4px 14px ${preset.shadow}` : 'none'
                        }}
                      >
                        <span>{preset.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Estructura */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Formato de Organización
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setTipoEstructura('semanas')}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      border: tipoEstructura === 'semanas' ? `2px solid ${currentTheme.primary}` : '1px solid var(--card-border)',
                      background: tipoEstructura === 'semanas' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📅</span>
                    <span>Por Semanas</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Semana 1, 2, 3...
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipoEstructura('cursos')}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      border: tipoEstructura === 'cursos' ? `2px solid ${currentTheme.primary}` : '1px solid var(--card-border)',
                      background: tipoEstructura === 'cursos' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📚</span>
                    <span>Por Curso Directo</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Materia por materia
                    </span>
                  </button>
                </div>
              </div>

              {/* Enlace Principal de Recursos */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Enlace de Recursos o Drive Principal (Opcional)
                </label>
                <div style={{ position: 'relative' }}>
                  <HardDrive size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: currentTheme.primary }} />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveUrl}
                    onChange={e => setDriveUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Descripción breve */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Descripción breve
                </label>
                <textarea
                  placeholder="Ej: Clases completas, resolución de problemas y material de apoyo."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.05)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Sección Integrada: Carga Rápida de Múltiples Enlaces para un curso */}
              {!isEditMode && (
                <div style={{
                  padding: '16px 18px',
                  borderRadius: '20px',
                  background: includeInitialLinks 
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.09), rgba(0, 122, 255, 0.09))' 
                    : 'rgba(120, 120, 128, 0.05)',
                  border: includeInitialLinks 
                    ? `1.5px solid ${currentTheme.primary}` 
                    : '1px solid var(--card-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.25s ease',
                  boxShadow: includeInitialLinks ? `0 6px 20px ${currentTheme.shadow || 'rgba(0,0,0,0.08)'}` : 'none'
                }}>
                  {/* Encabezado con switch interactivo integrado */}
                  <div 
                    onClick={() => setIncludeInitialLinks(!includeInitialLinks)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      gap: '12px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: includeInitialLinks ? currentTheme.gradient : 'rgba(120, 120, 128, 0.12)',
                        color: includeInitialLinks ? '#FFF' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}>
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', display: 'block' }}>
                          ⚡ Cargar clases o videos ahora mismo
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {includeInitialLinks 
                            ? 'Pega enlaces de YouTube, Drive o Zoom para estructurar las clases' 
                            : 'Opcional: Si tienes links listos, actívalo para subirlos juntos'}
                        </span>
                      </div>
                    </div>

                    {/* Botón Switch iOS estilo píldora */}
                    <div 
                      style={{
                        width: '46px',
                        height: '26px',
                        borderRadius: '13px',
                        background: includeInitialLinks ? currentTheme.primary : 'rgba(120, 120, 128, 0.25)',
                        position: 'relative',
                        transition: 'background 0.25s ease',
                        flexShrink: 0,
                        padding: '2px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div 
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          transform: includeInitialLinks ? 'translateX(20px)' : 'translateX(0)',
                          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.25)'
                        }}
                      />
                    </div>
                  </div>

                  {includeInitialLinks && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Materia
                          </label>
                          <select
                            value={initialSubject}
                            onChange={e => setInitialSubject(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '12px',
                              border: '1px solid var(--card-border)',
                              background: 'var(--card-bg)',
                              color: 'var(--text-main)',
                              fontWeight: 700,
                              fontSize: '0.86rem'
                            }}
                          >
                            {SUGGESTED_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        {tipoEstructura === 'semanas' && (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                              Número de Semana
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={initialWeekNum}
                              onChange={e => setInitialWeekNum(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.86rem'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                            Pega tus enlaces (uno por línea o "Título | URL"):
                          </label>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
                                setCopiedPrompt(true);
                                setTimeout(() => setCopiedPrompt(false), 2500);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 9px',
                                borderRadius: '8px',
                                background: copiedPrompt ? 'rgba(52, 199, 89, 0.18)' : 'rgba(0, 122, 255, 0.12)',
                                border: copiedPrompt ? '1px solid #34C759' : '1px solid rgba(0, 122, 255, 0.3)',
                                color: copiedPrompt ? '#34C759' : '#007AFF',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                              title="Copia el prompt para estructurar tus enlaces con IA"
                            >
                              {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedPrompt ? '¡Prompt Copiado!' : '📋 Copiar Prompt IA'}</span>
                            </button>

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => setIsExtractorModalOpen(true)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 9px',
                                  borderRadius: '8px',
                                  background: 'rgba(120, 120, 128, 0.12)',
                                  border: '1px solid var(--card-border)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                                title="Script extractor para pegar en consola del navegador (Solo Admin)"
                              >
                                <Terminal size={12} color="#007AFF" />
                                <span>⚡ Script Consola</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          placeholder={`Clase 01 | https://drive.google.com/file/...\nClase 02 | https://youtube.com/watch?...`}
                          value={initialLinksText}
                          onChange={e => setInitialLinksText(e.target.value)}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '1px solid var(--card-border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem',
                            fontFamily: 'monospace',
                            boxSizing: 'border-box'
                          }}
                        />
                        <span style={{ fontSize: '0.74rem', color: currentTheme.primary, fontWeight: 700 }}>
                          ✨ Se detectaron {parsedInitialLinks.length} clases listas para guardar con su SVG automático.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              background: 'rgba(120, 120, 128, 0.04)'
            }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  padding: '11px 20px',
                  borderRadius: '14px',
                  border: '1px solid var(--card-border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '11px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  background: currentTheme.gradient,
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: `0 6px 18px ${currentTheme.btnShadow}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>{isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Curso' : 'Crear Curso')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <ConsoleExtractorModal
        isOpen={isExtractorModalOpen}
        onClose={() => setIsExtractorModalOpen(false)}
      />
    </AnimatePresence>
  );
};
