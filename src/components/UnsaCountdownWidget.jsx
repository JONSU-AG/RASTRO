import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Target,
  ExternalLink,
  Award,
  ChevronDown,
  X
} from 'lucide-react';
import { OrsttyAvatarIcon } from './Mascots';

// CRONOGRAMA OFICIAL DE ADMISIÓN UNSA 2027 (MATRIZ OFICIAL)
export const CRONOGRAMA_UNSA_2027 = [
  {
    id: 'ceprunsa_1',
    name: 'CEPRUNSA I Fase',
    badge: 'I FASE',
    targetDate: '2026-07-05T08:00:00', // Evaluación de Conocimientos
    prevDate: '2026-06-21T08:00:00',   // Evaluación Previa
    classesDate: '2026-04-27',
    inscription: '23/03/2026 al 17/04/2026',
    milestones: [
      { label: 'Inscripciones', date: '23/03/2026 – 17/04/2026' },
      { label: 'Inicio de Clases', date: '27/04/2026' },
      { label: 'Evaluación Previa', date: '21/06/2026' },
      { label: 'Evaluación de Conocimientos', date: '05/07/2026', highlight: true }
    ]
  },
  {
    id: 'ordinario_1',
    name: 'Examen Ordinario I Fase',
    badge: 'ORDINARIO I',
    targetDate: '2026-08-09T08:00:00',
    prevDate: '2026-08-02T08:00:00',
    inscription: '22/06/2026 al 17/07/2026',
    milestones: [
      { label: 'Inscripciones', date: '22/06/2026 – 17/07/2026' },
      { label: 'Evaluación Previa', date: '02/08/2026' },
      { label: 'Evaluación de Conocimientos', date: '09/08/2026', highlight: true }
    ]
  },
  {
    id: 'quintos',
    name: 'CEPRUNSA Ciclo Quintos',
    badge: 'QUINTOS',
    targetDate: '2026-11-01T08:00:00',
    prevDate: '2026-10-18T08:00:00',
    classesDate: '2026-08-24',
    inscription: '27/07/2026 al 14/08/2026',
    milestones: [
      { label: 'Inscripciones', date: '27/07/2026 – 14/08/2026' },
      { label: 'Inicio de Clases', date: '24/08/2026' },
      { label: 'Evaluación Previa', date: '18/10/2026' },
      { label: 'Evaluación de Conocimientos', date: '01/11/2026', highlight: true }
    ]
  },
  {
    id: 'ceprunsa_2',
    name: 'CEPRUNSA II Fase',
    badge: 'II FASE',
    targetDate: '2027-01-24T08:00:00',
    prevDate: '2027-01-10T08:00:00',
    classesDate: '2026-11-16',
    inscription: '12/10/2026 al 06/11/2026',
    milestones: [
      { label: 'Inscripciones', date: '12/10/2026 – 06/11/2026' },
      { label: 'Inicio de Clases', date: '16/11/2026' },
      { label: 'Evaluación Previa', date: '10/01/2027' },
      { label: 'Evaluación de Conocimientos', date: '24/01/2027', highlight: true }
    ]
  },
  {
    id: 'extraordinario',
    name: 'Examen Extraordinario',
    badge: 'EXTRAORDINARIO',
    targetDate: '2027-02-21T08:00:00',
    prevDate: '2027-02-14T08:00:00',
    classesDate: '2027-02-01',
    inscription: '04/01/2027 al 27/01/2027',
    milestones: [
      { label: 'Inscripciones', date: '04/01/2027 – 27/01/2027' },
      { label: 'Inicio de Clases', date: '01/02/2027' },
      { label: 'Evaluación Previa', date: '14/02/2027' },
      { label: 'Evaluación de Aptitudes', date: '21/02/2027', highlight: true },
      { label: 'Asignación de Vacantes', date: '23/02/2027' }
    ]
  },
  {
    id: 'ordinario_2',
    name: 'Examen Ordinario II Fase',
    badge: 'ORDINARIO II',
    targetDate: '2027-03-14T08:00:00',
    prevDate: '2027-03-07T08:00:00',
    inscription: '01/02/2027 al 26/02/2027',
    milestones: [
      { label: 'Inscripciones', date: '01/02/2027 – 26/02/2027' },
      { label: 'Evaluación Previa', date: '07/03/2027' },
      { label: 'Evaluación de Conocimientos', date: '14/03/2027', highlight: true }
    ]
  },
  {
    id: 'filiales',
    name: 'Ordinario Filiales (Mollendo, Camaná, Pedregal)',
    badge: 'FILIALES',
    targetDate: '2027-03-20T08:00:00',
    inscription: '01/03/2027 al 16/03/2027',
    milestones: [
      { label: 'Inscripciones', date: '01/03/2027 – 16/03/2027' },
      { label: 'Evaluación de Conocimientos', date: '20/03/2027', highlight: true }
    ]
  }
];

// Obtener automáticamente el examen oficial más próximo en el tiempo
export function getClosestUpcomingProcess(now = new Date()) {
  const nowMs = now.getTime();
  const upcoming = CRONOGRAMA_UNSA_2027.find((p) => new Date(p.targetDate).getTime() > nowMs);
  return upcoming || CRONOGRAMA_UNSA_2027[0];
}

export const UnsaCountdownWidget = ({ style = {} }) => {
  const [isManualSelection, setIsManualSelection] = useState(() => {
    return localStorage.getItem('rastro_unsa_process_manual') === 'true';
  });

  // Proceso seleccionado: auto-selecciona el examen más próximo salvo que el usuario lo haya fijado manualmente
  const [selectedProcessId, setSelectedProcessId] = useState(() => {
    const isManual = localStorage.getItem('rastro_unsa_process_manual') === 'true';
    const savedId = localStorage.getItem('rastro_selected_unsa_process');
    if (isManual && savedId) {
      const found = CRONOGRAMA_UNSA_2027.find((p) => p.id === savedId);
      if (found && new Date(found.targetDate).getTime() > Date.now()) {
        return savedId;
      }
    }
    const closest = getClosestUpcomingProcess(new Date());
    return closest ? closest.id : 'ceprunsa_1';
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [now, setNow] = useState(new Date());

  // Proceso activo
  const activeProcess = useMemo(() => {
    return CRONOGRAMA_UNSA_2027.find((p) => p.id === selectedProcessId) || CRONOGRAMA_UNSA_2027[0];
  }, [selectedProcessId]);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-avanzar automáticamente al examen más próximo si no hay selección manual o si el examen ya pasó
  useEffect(() => {
    const nowMs = now.getTime();
    if (!isManualSelection) {
      const closest = getClosestUpcomingProcess(now);
      if (closest && closest.id !== selectedProcessId) {
        setSelectedProcessId(closest.id);
        localStorage.setItem('rastro_selected_unsa_process', closest.id);
      }
    } else {
      const current = CRONOGRAMA_UNSA_2027.find((p) => p.id === selectedProcessId);
      if (current && new Date(current.targetDate).getTime() <= nowMs) {
        // El examen manual ya concluyó: auto-avanza al siguiente proceso de admisión
        const nextUpcoming = getClosestUpcomingProcess(now);
        if (nextUpcoming) {
          setSelectedProcessId(nextUpcoming.id);
          setIsManualSelection(false);
          localStorage.setItem('rastro_selected_unsa_process', nextUpcoming.id);
          localStorage.removeItem('rastro_unsa_process_manual');
        }
      }
    }
  }, [now, isManualSelection, selectedProcessId]);

  const handleSelectProcess = (id) => {
    setSelectedProcessId(id);
    setIsManualSelection(true);
    localStorage.setItem('rastro_selected_unsa_process', id);
    localStorage.setItem('rastro_unsa_process_manual', 'true');
  };

  const handleResetToAuto = () => {
    const closest = getClosestUpcomingProcess(now);
    setSelectedProcessId(closest.id);
    setIsManualSelection(false);
    localStorage.setItem('rastro_selected_unsa_process', closest.id);
    localStorage.removeItem('rastro_unsa_process_manual');
  };

  // Cálculo del tiempo restante hasta el examen de conocimientos
  const timeRemaining = useMemo(() => {
    // Si hay un override administrativo en localStorage, usarlo
    const customTarget = localStorage.getItem('rastro_unsa_custom_target');
    const targetDateStr = customTarget || activeProcess.targetDate;

    const diff = new Date(targetDateStr).getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  }, [now, activeProcess]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1.5px solid rgba(251, 191, 36, 0.45)',
          borderRadius: '24px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245, 158, 11, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          ...style
        }}
      >
        {/* Luz dorada decorativa superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FDE047, #F59E0B, transparent)',
            boxShadow: '0 0 10px #FDE047'
          }}
        />

        {/* Lado izquierdo: Mascota ORSTTY + Título y Proceso Activo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.3))',
              border: '1.5px solid #F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)'
            }}
          >
            <OrsttyAvatarIcon size={28} active={true} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TEMPORIZADOR OFICIAL ADMISIÓN UNSA 2027
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, background: isManualSelection ? '#38BDF8' : '#10B981', color: '#000', padding: '1px 6px', borderRadius: '6px' }}>
                {isManualSelection ? 'FIJADO MANUAL' : 'AUTO • PRÓXIMO'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 900, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeProcess.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '999px',
                  color: '#CBD5E1',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Cambiar</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Lado derecho: Cajas del Contador Ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {[
            { label: 'DÍAS', val: timeRemaining.days },
            { label: 'HORAS', val: String(timeRemaining.hours).padStart(2, '0') },
            { label: 'MIN', val: String(timeRemaining.minutes).padStart(2, '0') },
            { label: 'SEG', val: String(timeRemaining.seconds).padStart(2, '0') }
          ].map((unit, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                padding: '6px 8px',
                minWidth: '44px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
              }}
            >
              <div style={{ fontSize: '1.15rem', fontWeight: 950, color: '#FEF08A', lineHeight: 1, letterSpacing: '-0.5px' }}>
                {unit.val}
              </div>
              <div style={{ fontSize: '0.58rem', fontWeight: 900, color: '#94A3B8', marginTop: '3px', letterSpacing: '0.06em' }}>
                {unit.label}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            title="Ver Cronograma Completo 2027"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              color: '#FDE047',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            <Calendar size={18} />
          </button>
        </div>
      </motion.div>

      {/* MODAL CRONOGRAMA COMPLETO UNSA 2027 */}
      <AnimatePresence>
        {showScheduleModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999999,
              background: 'rgba(5, 8, 20, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px'
            }}
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                background: 'linear-gradient(180deg, rgba(26, 20, 56, 0.98) 0%, rgba(13, 17, 36, 0.99) 100%)',
                border: '2px solid rgba(251, 191, 36, 0.55)',
                borderRadius: '26px',
                boxShadow: '0 24px 70px rgba(0,0,0,0.85), 0 0 35px rgba(245, 158, 11, 0.25)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Cabecera Modal */}
              <div
                style={{
                  padding: '18px 20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000'
                    }}
                  >
                    <Calendar size={22} color="#FFFFFF" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#FDE047', textTransform: 'uppercase' }}>
                      MATRIZ OFICIAL DE EVALUACIÓN
                    </span>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: '#FFFFFF' }}>
                      Cronograma de Admisión UNSA 2027
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#CBD5E1',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lista de Procesos */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>
                    Selecciona tu proceso objetivo o usa la detección automática:
                  </p>
                  <button
                    onClick={handleResetToAuto}
                    style={{
                      background: !isManualSelection ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: !isManualSelection ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.2)',
                      color: !isManualSelection ? '#34D399' : '#CBD5E1',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} />
                    Auto: Examen más próximo
                  </button>
                </div>

                {CRONOGRAMA_UNSA_2027.map((proc) => {
                  const isSelected = activeProcess.id === proc.id;
                  return (
                    <div
                      key={proc.id}
                      onClick={() => handleSelectProcess(proc.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '18px',
                        background: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? '2px solid #FDE047' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: isSelected ? '0 0 20px rgba(245, 158, 11, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.94rem', fontWeight: 900, color: isSelected ? '#FEF08A' : '#FFFFFF' }}>
                            {proc.name}
                          </span>
                          {isSelected && (
                            <span style={{ background: '#F59E0B', color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '2px 6px', borderRadius: '6px' }}>
                              ACTIVO EN TEMPORIZADOR
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                          {proc.badge}
                        </span>
                      </div>

                      {/* Hitos */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px', marginTop: '4px' }}>
                        {proc.milestones.map((ms, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '10px',
                              background: ms.highlight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.3)',
                              border: ms.highlight ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.06)'
                            }}
                          >
                            <span style={{ fontSize: '0.66rem', color: ms.highlight ? '#FDE047' : '#94A3B8', fontWeight: 800, display: 'block' }}>
                              {ms.label}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 900 }}>
                              {ms.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pie de modal */}
              <div
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(10, 14, 28, 0.85)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Fechas extraídas de la Matriz Oficial de Admisión UNSA
                </span>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
