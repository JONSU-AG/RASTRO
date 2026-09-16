import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Send, CheckCircle, ShieldAlert, EyeOff } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { hideReportedItem } from '../lib/siteSettings';

const GENERAL_REPORT_REASONS = [
  { id: 'broken_link', label: 'Enlace caído o archivo inaccesible' },
  { id: 'wrong_material', label: 'Material incorrecto, incompleto o de otro año' },
  { id: 'copyright', label: 'Derechos de autor / Solicitud de retiro del propietario' },
  { id: 'spam', label: 'Spam, enlaces publicitarios no autorizados' },
  { id: 'inappropriate', label: 'Contenido inapropiado u ofensivo' },
  { id: 'other', label: 'Otro motivo' }
];

const FLASHCARD_REPORT_REASONS = [
  { id: 'incorrect_answer', label: 'Respuesta incorrecta o dato erróneo' },
  { id: 'no_context', label: 'Sin contexto suficiente o información incompleta' },
  { id: 'not_theory', label: 'No es de teoría (es ejercicio de cálculo o problema numérico)' },
  { id: 'invalid_format', label: 'Formato no permitido (verdadero/falso o relación de orden)' },
  { id: 'other', label: 'Otro motivo' }
];

const EXAM_REPORT_REASONS = [
  { id: 'incorrect_answer', label: 'Respuesta o clave errónea' },
  { id: 'no_context', label: 'Sin contexto (falta gráfico, imagen o texto de lectura)' },
  { id: 'incomplete_options', label: 'Opciones de respuesta incompletas o repetidas' },
  { id: 'spam_inappropriate', label: 'Contenido inapropiado o duplicado' },
  { id: 'other', label: 'Otro motivo' }
];

export const ReportModal = ({
  isOpen,
  onClose,
  targetId,
  targetTitle = '',
  targetType = 'material',
  reportedUser = null,
  onItemHidden = null
}) => {
  const { user } = useAuth();

  const isFlashcard = targetType === 'flashcard';
  const isExam = targetType === 'examen' || targetType === 'pregunta_rapida';
  const isStudyItem = isFlashcard || isExam;
  const isCourse = targetType === 'curso' || targetType === 'academia' || targetType === 'comunidad_academias';

  const currentReasons = useMemo(() => {
    if (isFlashcard) return FLASHCARD_REPORT_REASONS;
    if (isExam) return EXAM_REPORT_REASONS;
    return GENERAL_REPORT_REASONS;
  }, [isFlashcard, isExam]);

  const [selectedReason, setSelectedReason] = useState(currentReasons[0].id);
  const [details, setDetails] = useState('');
  const [autoHideOption, setAutoHideOption] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reiniciar motivo por defecto cuando cambie el targetType o se abra el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(currentReasons[0].id);
      setAutoHideOption(true);
      setDetails('');
    }
  }, [isOpen, targetType, currentReasons]);

  if (!isOpen) return null;

  // Umbrales de moderación comunitaria:
  // Flashcards y preguntas rápidas: 1 reporte (con solo 1 reporte se dejan de mostrar)
  // Cursos: 5 reportes
  // Biblioteca y comentarios: 3 reportes
  const autoHideThreshold = isStudyItem ? 1 : (isCourse ? 5 : 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const reasonObj = currentReasons.find(r => r.id === selectedReason);

      await addDoc(collection(db, 'reportes'), {
        targetId: String(targetId || ''),
        targetTitle,
        targetType, // 'flashcard' | 'examen' | 'pregunta_rapida' | 'material' | 'curso' | 'user' | etc.
        reportedUser: reportedUser || null,
        reporterUid: user?.uid || 'anonimo',
        reporterEmail: user?.email || 'anonimo',
        reason: selectedReason,
        reasonLabel: reasonObj?.label || selectedReason,
        details: details.trim(),
        autoHideApplied: isStudyItem && autoHideOption,
        status: 'pendiente',
        createdAt: serverTimestamp(),
        timestamp: Date.now()
      });

      // Si es una flashcard o pregunta rápida y tiene activa la opción de auto-ocultar:
      if (isStudyItem && autoHideOption && targetId) {
        try {
          await hideReportedItem(targetId);
          if (onItemHidden) {
            onItemHidden(targetId);
          }
        } catch (errHide) {
          console.warn("Error hiding reported study item:", errHide);
        }
      }

      // Sincronizar conteo de reportes y auto-ocultamiento si el documento existe en Firestore
      if (targetId) {
        let targetCollection = 'uploads';
        if (isFlashcard) targetCollection = 'flashcards';
        else if (isExam) targetCollection = 'preguntas_examen';
        else if (targetType === 'user' || targetType === 'perfil') targetCollection = 'usuarios';
        else if (targetType === 'comentario') targetCollection = 'comments';
        else if (targetType === 'profile_comment') targetCollection = 'profile_comments';
        else if (targetType === 'foro') targetCollection = 'foro_preguntas';
        else if (isCourse) targetCollection = 'academias';

        try {
          const qReports = query(collection(db, 'reportes'), where('targetId', '==', String(targetId)));
          const snap = await getDocs(qReports);
          const reportCount = snap.size;
          const shouldAutoHide = reportCount >= autoHideThreshold || (isStudyItem && autoHideOption);

          const targetRef = doc(db, targetCollection, String(targetId));
          const updateData = {
            reportsCount: reportCount,
            lastReportedAt: Date.now()
          };

          const isUserProfile = targetType === 'user' || targetType === 'perfil';
          if (shouldAutoHide && !isUserProfile) {
            updateData.oculto = true;
            updateData.hidden = true;
            updateData.autoHidden = true;
            updateData.singleReportedHidden = isStudyItem;
            updateData.hiddenReason = isStudyItem ? 'reported_incorrect_or_no_context' : `${autoHideThreshold}_reports_community`;
          }

          await setDoc(targetRef, updateData, { merge: true });
        } catch (errCount) {
          // Si no es un doc de Firestore (banco oficial CEPRE o predeterminado), hideReportedItem ya lo ocultó local y globalmente
        }
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1600);
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Error al enviar reporte: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="ios-modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.68)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000150,
          padding: '16px',
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box'
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{
            width: '100%',
            maxWidth: '460px',
            maxHeight: 'min(90dvh, 640px)',
            background: 'var(--glass-bg, var(--card-bg))',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            border: '1.5px solid var(--card-border)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(52, 168, 83, 0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '50%', color: '#34A853', marginBottom: '16px' }}>
                <CheckCircle size={44} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
                {isStudyItem ? 'Reporte Enviado y Contenido Ocultado' : 'Reporte Enviado'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '340px', lineHeight: 1.45 }}>
                {isStudyItem
                  ? `Gracias por colaborar. Con este reporte, la ${isFlashcard ? 'tarjeta' : 'pregunta'} se ha ocultado inmediatamente y dejará de mostrarse.`
                  : `Gracias por colaborar. Con ${autoHideThreshold} reportes comunitarios el contenido se ocultará automáticamente para proteger a los estudiantes.`
                }
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, margin: 0, overflow: 'hidden' }}>
              {/* Header (Fijo arriba con desenfoque Apple) */}
              <div style={{
                padding: '16px 20px 14px',
                borderBottom: '1px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 59, 48, 0.15)',
                    color: '#ff3b30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldAlert size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      Reportar {isFlashcard ? 'Tarjeta de Repaso' : (isExam ? 'Pregunta de Examen' : (isCourse ? 'Curso' : (targetType === 'user' ? 'Usuario' : 'Material')))}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {targetTitle || 'Contenido seleccionado'}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  style={{
                    background: 'rgba(120, 120, 128, 0.12)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    flexShrink: 0,
                    transition: 'background 0.15s ease'
                  }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div style={{
                padding: '16px 20px',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* Notice de moderación */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isStudyItem ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 122, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isStudyItem ? '1px solid rgba(239, 68, 68, 0.22)' : '1px solid rgba(0, 122, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  lineHeight: 1.45
                }}>
                  {isStudyItem ? (
                    <>
                      <strong>Moderación de calidad:</strong> Tu reporte ayuda a depurar el banco. Al confirmar, este elemento se dejará de mostrar de forma permanente.
                    </>
                  ) : (
                    <>
                      <strong>Reporte anónimo y confidencial:</strong> Con <strong>{autoHideThreshold} reportes</strong> este contenido se ocultará automáticamente de la vista pública.
                    </>
                  )}
                </div>

                {/* Reasons List */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Selecciona el motivo:
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentReasons.map(r => {
                      const isSelected = selectedReason === r.id;
                      return (
                        <label
                          key={r.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '14px',
                            border: isSelected ? '1.5px solid #ff3b30' : '1px solid var(--card-border)',
                            background: isSelected ? 'rgba(255,59,48,0.12)' : 'rgba(120,120,128,0.06)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            fontSize: '0.84rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)',
                            transition: 'all 0.15s ease',
                            minHeight: '40px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={r.id}
                            checked={isSelected}
                            onChange={() => setSelectedReason(r.id)}
                            style={{ accentColor: '#ff3b30', margin: 0, width: '16px', height: '16px' }}
                          />
                          <span style={{ lineHeight: 1.3 }}>{r.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Opción de auto-ocultamiento inmediato para flashcards y preguntas de examen */}
                {isStudyItem && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: autoHideOption ? 'rgba(239, 68, 68, 0.08)' : 'rgba(120, 120, 128, 0.06)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: autoHideOption ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--card-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                    <input
                      type="checkbox"
                      checked={autoHideOption}
                      onChange={(e) => setAutoHideOption(e.target.checked)}
                      style={{ marginTop: '3px', accentColor: '#ff3b30', width: '16px', height: '16px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Ocultar de inmediato con este reporte
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                        Deja de mostrar esta {isFlashcard ? 'tarjeta' : 'pregunta'} de inmediato para no volver a verla en tus sesiones.
                      </span>
                    </div>
                  </label>
                )}

                {/* Additional details */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Detalles adicionales (opcional):
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={2}
                    placeholder="Explica brevemente qué ocurrió..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120,120,128,0.06)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* Fixed Footer (Siempre visible abajo, estilo Apple Glass sin color sólido) */}
              <div style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.05)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexShrink: 0,
                boxSizing: 'border-box'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: '14px',
                    border: '1px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(120, 120, 128, 0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(120, 120, 128, 0.12)'}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1.5,
                    padding: '11px 16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FF3B30 0%, #E02E24 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: submitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(255, 59, 48, 0.35)',
                    transition: 'all 0.15s ease',
                    opacity: submitting ? 0.75 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.currentTarget.style.filter = 'brightness(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <Send size={15} />
                  {submitting ? 'Enviando...' : 'Enviar Reporte'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
