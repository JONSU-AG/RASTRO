import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, CheckCircle2, AlertCircle, Link as LinkIcon, Video, Layers, Terminal, Copy, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { getCourseSvgData } from '../pages/AcademyDetail';
import { AI_PROMPT_TEMPLATE, CONSOLE_EXTRACTOR_SCRIPT, parseVideoLinksAuto } from '../lib/consoleExtractorScript';
import { ConsoleExtractorModal } from './ConsoleExtractorModal';

const COMMON_SUBJECTS = [
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

export const AddClassSimpleModal = ({
  isOpen,
  onClose,
  academyId,
  collectionName,
  existingWeeks = [],
  onSuccess = () => {}
}) => {
  const { isAdmin } = useAuth();
  const [subject, setSubject] = useState('Biología');
  const [customSubject, setCustomSubject] = useState('');
  const [weekNum, setWeekNum] = useState(1);
  const [isNewWeek, setIsNewWeek] = useState(false);
  const [linksText, setLinksText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExtractorModalOpen, setIsExtractorModalOpen] = useState(false);

  const activeSubject = subject === 'Otra...' ? (customSubject.trim() || 'Curso General') : subject;
  const svgData = useMemo(() => getCourseSvgData(activeSubject), [activeSubject]);

  const parsedLinks = useMemo(() => parseVideoLinksAuto(linksText), [linksText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (parsedLinks.length === 0) {
      setErrorMsg('Por favor pega al menos un enlace válido (URL).');
      return;
    }

    const coll = collectionName || `${academyId}_semanas`;
    const selectedNum = isNewWeek ? (existingWeeks.length > 0 ? Math.max(...existingWeeks.map(w => w.num || 0)) + 1 : 1) : parseInt(weekNum, 10);
    const weekDocId = `semana_${selectedNum}`;

    setIsSubmitting(true);

    try {
      const weekRef = doc(db, coll, weekDocId);
      const weekSnap = await getDoc(weekRef);

      let weekData = [];
      let weekName = `Semana ${selectedNum.toString().padStart(2, '0')}`;

      if (weekSnap.exists()) {
        const d = weekSnap.data();
        weekData = Array.isArray(d.data) ? [...d.data] : [];
        if (d.nombre) weekName = d.nombre;
      }

      // Buscar si el curso ya existe en esta semana
      const existingCourseIdx = weekData.findIndex(c => c.nombre?.toLowerCase() === activeSubject.toLowerCase());

      if (existingCourseIdx !== -1) {
        // Concatenar nuevos videos al curso existente
        const currentVideos = Array.isArray(weekData[existingCourseIdx].videos) ? weekData[existingCourseIdx].videos : [];
        weekData[existingCourseIdx] = {
          ...weekData[existingCourseIdx],
          videos: [...currentVideos, ...parsedLinks]
        };
      } else {
        // Agregar nuevo curso a la semana
        weekData.push({
          nombre: activeSubject,
          categoria: 'General',
          videos: parsedLinks
        });
      }

      const payload = {
        num: selectedNum,
        nombre: weekName,
        status: 'disponible',
        data: weekData
      };

      await setDoc(weekRef, payload, { merge: true });

      setIsSubmitting(false);
      onSuccess(payload);
      onClose();
    } catch (err) {
      console.error('Error adding classes:', err);
      setErrorMsg('Error al guardar: ' + err.message);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
            border: '1.5px solid var(--card-border)',
            borderRadius: '26px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: 'min(92dvh, 700px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
            boxSizing: 'border-box'
          }}
        >
          {/* Header con preview automático de SVG */}
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #007AFF, #00C6FF)',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
                dangerouslySetInnerHTML={{ __html: svgData.svg }}
              />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                  Agregar Clases / Enlaces
                </h2>
                <span style={{ fontSize: '0.78rem', opacity: 0.9, fontWeight: 700 }}>
                  Icono SVG asignado automáticamente: {activeSubject}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              {/* Materia y Selección de Icono SVG */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Materia / Curso
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  >
                    {COMMON_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="Otra...">Escribir otra materia...</option>
                  </select>
                </div>

                {subject === 'Otra...' && (
                  <input
                    type="text"
                    placeholder="Escribe el nombre de la materia..."
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              </div>

              {/* Selección de Semana */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Semana de Destino
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="weekOpt"
                      checked={!isNewWeek}
                      onChange={() => setIsNewWeek(false)}
                    />
                    Semana existente
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="weekOpt"
                      checked={isNewWeek}
                      onChange={() => setIsNewWeek(true)}
                    />
                    + Nueva Semana
                  </label>
                </div>

                {!isNewWeek && (
                  <select
                    value={weekNum}
                    onChange={e => setWeekNum(parseInt(e.target.value, 10))}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120, 120, 128, 0.05)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    {existingWeeks.length > 0 ? (
                      existingWeeks.map(w => (
                        <option key={w.num} value={w.num}>
                          {w.nombre || `Semana ${w.num}`}
                        </option>
                      ))
                    ) : (
                      <option value="1">Semana 01</option>
                    )}
                  </select>
                )}
              </div>

              {/* Caja de Enlaces Múltiples */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Pega tus enlaces (uno por línea o "Título | URL"):
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
                        gap: '5px',
                        padding: '5px 11px',
                        borderRadius: '10px',
                        background: copiedPrompt ? 'rgba(52, 199, 89, 0.18)' : 'rgba(0, 122, 255, 0.12)',
                        border: copiedPrompt ? '1px solid #34C759' : '1px solid rgba(0, 122, 255, 0.3)',
                        color: copiedPrompt ? '#34C759' : '#007AFF',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title="Copia el prompt para estructurar enlaces con ChatGPT, Gemini o Claude"
                    >
                      {copiedPrompt ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedPrompt ? '¡Prompt Copiado!' : '📋 Copiar Prompt IA'}</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setIsExtractorModalOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 11px',
                          borderRadius: '10px',
                          background: 'rgba(120, 120, 128, 0.12)',
                          border: '1px solid var(--card-border)',
                          color: 'var(--text-main)',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Abrir script para pegar en la consola del navegador y extraer enlaces automáticamente (Solo Admin)"
                      >
                        <Terminal size={13} color="#007AFF" />
                        <span>⚡ Script Consola</span>
                      </button>
                    )}

                    <span style={{ fontSize: '0.72rem', color: '#007AFF', fontWeight: 700 }}>
                      ({parsedLinks.length})
                    </span>
                  </div>
                </div>

                <textarea
                  placeholder={`Clase 01 - Introducción | https://drive.google.com/...\nClase 02 - Práctica | https://youtube.com/...`}
                  value={linksText}
                  onChange={e => setLinksText(e.target.value)}
                  rows={5}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.05)',
                    color: 'var(--text-main)',
                    fontSize: '0.84rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  💡 Puedes pegar solo las URLs sueltas y el sistema las nombrará automáticamente: Clase 01, Clase 02, etc.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              background: 'rgba(120, 120, 128, 0.04)'
            }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || parsedLinks.length === 0}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007AFF 0%, #0051FF 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
                }}
              >
                <Plus size={16} />
                <span>{isSubmitting ? 'Guardando...' : `Guardar ${parsedLinks.length} Clases`}</span>
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
