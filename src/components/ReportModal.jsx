import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const REPORT_REASONS = [
  { id: 'broken_link', label: '🔗 Enlace caído o archivo inaccesible' },
  { id: 'wrong_material', label: '❌ Material incorrecto, incompleto o de otro año' },
  { id: 'copyright', label: '⚖️ Derechos de autor / Solicitud de retiro del propietario' },
  { id: 'spam', label: '⚠️ Spam, enlaces publicitarios no autorizados' },
  { id: 'inappropriate', label: '🚫 Contenido inapropiado u ofensivo' },
  { id: 'other', label: '📝 Otro motivo' }
];

export const ReportModal = ({ isOpen, onClose, targetId, targetTitle = '', targetType = 'material', reportedUser = null }) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Umbrales de moderación comunitaria: 5 reportes para Cursos, 3 reportes para biblioteca/comentarios
  const isCourse = targetType === 'curso' || targetType === 'academia' || targetType === 'comunidad_academias';
  const autoHideThreshold = isCourse ? 5 : 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'reportes'), {
        targetId,
        targetTitle,
        targetType, // 'material' | 'curso' | 'user' | 'perfil' | 'comentario' | 'profile_comment' | 'foro'
        reportedUser: reportedUser || null,
        reporterUid: user?.uid || 'anonimo',
        reporterEmail: user?.email || 'anonimo',
        reason: selectedReason,
        reasonLabel: REPORT_REASONS.find(r => r.id === selectedReason)?.label || selectedReason,
        details: details.trim(),
        status: 'pendiente', // 'pendiente' | 'revisado' | 'sancionado'
        createdAt: serverTimestamp(),
        timestamp: Date.now()
      });

      // Update target document with reports count and auto-hide if threshold reached
      if (targetId) {
        let targetCollection = 'uploads';
        if (targetType === 'user' || targetType === 'perfil') targetCollection = 'usuarios';
        else if (targetType === 'comentario') targetCollection = 'comments';
        else if (targetType === 'profile_comment') targetCollection = 'profile_comments';
        else if (targetType === 'foro') targetCollection = 'foro_preguntas';
        else if (isCourse) targetCollection = 'academias';

        try {
          const qReports = query(collection(db, 'reportes'), where('targetId', '==', targetId));
          const snap = await getDocs(qReports);
          const reportCount = snap.size;
          const shouldAutoHide = reportCount >= autoHideThreshold;

          const targetRef = doc(db, targetCollection, targetId);
          const updateData = {
            reportsCount: reportCount,
            lastReportedAt: Date.now()
          };

          // Para perfiles de usuarios: Los reportes van al Admin, pero el perfil NUNCA se auto-cierra.
          const isUserProfile = targetType === 'user' || targetType === 'perfil';
          if (shouldAutoHide && !isUserProfile) {
            updateData.oculto = true;
            updateData.hidden = true;
            updateData.autoHidden = true;
            updateData.tripleReported = (autoHideThreshold === 3);
            updateData.fiveReported = (autoHideThreshold === 5);
            updateData.hiddenReason = `${autoHideThreshold}_reports_community`;
          }

          await setDoc(targetRef, updateData, { merge: true });
        } catch (errCount) {
          console.warn("Could not sync report count on target doc:", errCount);
        }
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1800);
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
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000150,
          padding: '12px',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box'
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="ios-glass-card"
          style={{
            width: '100%',
            maxWidth: '460px',
            maxHeight: 'min(90dvh, 640px)',
            background: 'var(--card-bg, #ffffff)',
            border: '1.5px solid var(--card-border)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(52, 168, 83, 0.15)', borderRadius: '50%', color: '#34A853', marginBottom: '16px' }}>
                <CheckCircle size={44} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
                Reporte Enviado
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '320px', lineHeight: 1.4 }}>
                Gracias por colaborar. Con <strong>{autoHideThreshold} reportes</strong> comunitarios el contenido se ocultará automáticamente para proteger a los estudiantes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, margin: 0, overflow: 'hidden' }}>
              {/* Header (Fijo arriba) */}
              <div style={{
                padding: '14px 18px 12px',
                borderBottom: '1px solid var(--card-border)',
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
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      Reportar {isCourse ? 'Curso' : (targetType === 'user' ? 'Usuario' : 'Material')}
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
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    flexShrink: 0
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div style={{
                padding: '14px 18px',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Notice de moderación comunitaria */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 255, 0.08)',
                  border: '1px solid rgba(0, 122, 255, 0.2)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  lineHeight: 1.4
                }}>
                  🛡️ <strong>Tu reporte es anónimo y confidencial.</strong> Con <strong>{autoHideThreshold} reportes</strong> este contenido se ocultará automáticamente de la vista pública.
                </div>

                {/* Reasons List */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Selecciona el motivo:
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {REPORT_REASONS.map(r => {
                      const isSelected = selectedReason === r.id;
                      return (
                        <label
                          key={r.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            border: isSelected ? '1.5px solid #ff3b30' : '1px solid var(--card-border)',
                            background: isSelected ? 'rgba(255,59,48,0.08)' : 'rgba(120,120,128,0.05)',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)',
                            transition: 'all 0.15s ease',
                            minHeight: '38px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={r.id}
                            checked={isSelected}
                            onChange={() => setSelectedReason(r.id)}
                            style={{ accentColor: '#ff3b30', margin: 0 }}
                          />
                          <span style={{ lineHeight: 1.3 }}>{r.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Additional details */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Detalles adicionales (opcional):
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={2}
                    placeholder="Explica brevemente qué ocurrió..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--card-border)',
                      background: 'rgba(120,120,128,0.06)',
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

              {/* Fixed Footer (Siempre visible abajo) */}
              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--card-border)',
                background: 'var(--card-bg, #ffffff)',
                display: 'flex',
                gap: '10px',
                flexShrink: 0
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--card-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1.6,
                    padding: '11px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#ff3b30',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: submitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(255,59,48,0.35)'
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
