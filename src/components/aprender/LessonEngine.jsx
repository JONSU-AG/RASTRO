import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Award, Flame, Lightbulb } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { OrsttyMascot } from '../Mascots';

export const LessonEngine = ({ lesson, onComplete, onExit }) => {
  const { hearts, loseHeart, triggerSuccessFeedback, recordLessonCompletion } = useGamification();

  // Ocultar barras de navegación globales mientras la lección esté abierta
  useEffect(() => {
    document.body.classList.add('rastro-lesson-active');
    return () => {
      document.body.classList.remove('rastro-lesson-active');
    };
  }, []);

  // Pasos de la lección:
  // Paso 0: Teoría explicativa previa obligatoria (Regla de oro)
  // Pasos 1..N: Retos interactivos (Opción múltiple, cloze, etc.)
  const [currentStep, setCurrentStep] = useState(0);
  const [challenges, setChallenges] = useState(lesson.challenges || []);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Respuestas
  const [selectedOption, setSelectedOption] = useState(null);
  const [evaluationStatus, setEvaluationStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [errorsCount, setErrorsCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  // Ajuste de tamaño de fuente para lectura de textos largos en Android
  const [fontSizeLevel, setFontSizeLevel] = useState(1);
  const fontSizes = ['0.95rem', '1.08rem', '1.24rem'];
  const lineHeights = ['1.6', '1.75', '1.9'];

  const currentChallenge = challenges[currentChallengeIndex];
  const progressPercent = isFinished
    ? 100
    : currentStep === 0
      ? 15
      : 15 + ((currentChallengeIndex + 1) / (challenges.length + 1)) * 85;

  const handleVerify = () => {
    if (!currentChallenge) return;

    let isCorrect = false;

    if (currentChallenge.type === 'multiple_choice') {
      isCorrect = selectedOption === currentChallenge.correctIndex;
    } else if (currentChallenge.type === 'cloze') {
      isCorrect = selectedOption?.toLowerCase() === currentChallenge.targetWord?.toLowerCase();
    }

    if (isCorrect) {
      triggerSuccessFeedback();
      setEvaluationStatus('correct');
    } else {
      loseHeart();
      setErrorsCount(prev => prev + 1);
      setEvaluationStatus('wrong');
      // Reinsertar al final para repaso educativo
      setChallenges(prev => [...prev, currentChallenge]);
    }
  };

  const handleContinue = () => {
    if (evaluationStatus === 'correct' || evaluationStatus === 'wrong') {
      setEvaluationStatus('idle');
      setSelectedOption(null);

      if (currentChallengeIndex + 1 < challenges.length) {
        setCurrentChallengeIndex(prev => prev + 1);
      } else {
        const earnedXp = Math.max(30, 60 - errorsCount * 10);
        const stars = errorsCount === 0 ? 3 : errorsCount <= 2 ? 2 : 1;
        recordLessonCompletion(lesson.id, earnedXp, stars);
        setIsFinished(true);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000000,
        background: 'var(--bg-main, #F8FAFC)',
        color: 'var(--text-main, #0F172A)',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* ================= HEADER SUPERIOR NATIVO DE LA LECCIÓN ================= */}
      <header
        style={{
          paddingTop: 'max(14px, env(safe-area-inset-top, 14px))',
          paddingBottom: '12px',
          paddingLeft: '16px',
          paddingRight: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.08))',
          background: 'var(--card-bg, #FFFFFF)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => setShowExitConfirmModal(true)}
          aria-label="Cerrar lección"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary, #64748B)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            flexShrink: 0
          }}
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        {/* Barra de Progreso animada */}
        <div
          style={{
            flex: 1,
            height: '14px',
            background: 'rgba(0, 0, 0, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #10B981, #059669)',
              borderRadius: '999px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Vidas / Corazones */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#EF4444',
            fontWeight: 900,
            fontSize: '1rem',
            flexShrink: 0,
            padding: '4px 8px',
            borderRadius: '999px',
            background: 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <Heart size={20} fill="#EF4444" color="#EF4444" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* ================= CONTENIDO PRINCIPAL SCROLLABLE ================= */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '20px 16px 140px',
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        <AnimatePresence mode="wait">
          {/* ---------------- PANTALLA DE VICTORIA ---------------- */}
          {isFinished ? (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                <OrsttyMascot mood="emocionado" size={105} />
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--text-main, #0F172A)' }}>
                ¡Lección Completada!
              </h2>

              <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: '1.02rem', margin: 0, lineHeight: 1.5 }}>
                Excelente trabajo. Has dominado los fundamentos de esta unidad de <b>{lesson.subject}</b>.
              </p>

              {/* Estadísticas de la lección */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  width: '100%',
                  maxWidth: '360px',
                  marginTop: '8px'
                }}
              >
                <div
                  style={{
                    background: 'var(--card-bg, #FFFFFF)',
                    padding: '18px 14px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--card-border, rgba(0,0,0,0.08))',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Sparkles size={22} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>+50 XP</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>
                    Experiencia
                  </span>
                </div>

                <div
                  style={{
                    background: 'var(--card-bg, #FFFFFF)',
                    padding: '18px 14px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--card-border, rgba(0,0,0,0.08))',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Flame size={22} fill="#EF4444" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>Racha</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>
                    ¡Día asegurado!
                  </span>
                </div>
              </div>

              <button
                className="duo-btn-3d"
                onClick={onComplete}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  maxWidth: '360px',
                  padding: '16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 5px 0 #059669, 0 10px 20px rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                Continuar en el Camino
              </button>
            </motion.div>
          ) : currentStep === 0 ? (
            /* ---------------- PASO 0: TEORÍA OBLIGATORIA (REGLA DE ORO) ---------------- */
            <motion.div
              key="theory-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Barra superior de lectura con selector de tamaño de letra para móvil */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--card-bg, #FFFFFF)',
                  border: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.08))',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                  <BookOpen size={18} />
                  <span>Método Deductivo • General a Particular</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Aa-', 'Aa', 'Aa+'].map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setFontSizeLevel(idx)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: fontSizeLevel === idx ? '#10B981' : 'rgba(0, 0, 0, 0.06)',
                        color: fontSizeLevel === idx ? '#FFFFFF' : 'var(--text-main, #0F172A)',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Título de la Lección */}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {lesson.theory?.subtitle || lesson.subject}
                </span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '4px 0 0', color: 'var(--text-main, #0F172A)', lineHeight: 1.3 }}>
                  {lesson.theory?.title || lesson.title}
                </h1>
              </div>

              {/* Secciones Teóricas Ricas de CEPREUNSA (De lo General a lo Particular) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {lesson.theory?.sections ? (
                  lesson.theory.sections.map((sec, idx) => {
                    const isGeneral = sec.heading.toLowerCase().includes('general') || idx === 0;
                    const isParticular = sec.heading.toLowerCase().includes('particular') || idx === 1;
                    const tierLabel = isGeneral
                      ? '🏛️ FUNDAMENTO GENERAL (PRINCIPIO UNIVERSAL)'
                      : isParticular
                        ? '🔬 CASOS PARTICULARES Y CLASIFICACIÓN'
                        : '💡 DEDUCCIÓN PRÁCTICA PARA EL EXAMEN';
                    const tierBg = isGeneral
                      ? 'rgba(59, 130, 246, 0.1)'
                      : isParticular
                        ? 'rgba(139, 92, 246, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)';
                    const tierColor = isGeneral
                      ? '#2563EB'
                      : isParticular
                        ? '#7C3AED'
                        : '#059669';

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--card-bg, #FFFFFF)',
                          border: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.08))',
                          borderRadius: '20px',
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <div
                          style={{
                            alignSelf: 'flex-start',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: tierBg,
                            color: tierColor,
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.04em'
                          }}
                        >
                          {tierLabel}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-main, #0F172A)' }}>
                          {sec.heading}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: fontSizes[fontSizeLevel],
                            lineHeight: lineHeights[fontSizeLevel],
                            color: 'var(--text-main, #1E293B)',
                            fontWeight: 500,
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {sec.body}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      background: 'var(--card-bg, #FFFFFF)',
                      border: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.08))',
                      borderRadius: '20px',
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {lesson.theory?.paragraphs?.map((para, i) => (
                      <p
                        key={i}
                        style={{
                          margin: 0,
                          fontSize: fontSizes[fontSizeLevel],
                          lineHeight: lineHeights[fontSizeLevel],
                          color: 'var(--text-main, #1E293B)',
                          fontWeight: 500
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* Tarjeta de Resumen / Idea Clave para el Examen */}
                {(lesson.theory?.takeaway || lesson.theory?.highlight) && (
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderLeft: '4px solid #10B981',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <Lightbulb size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#059669', display: 'block', marginBottom: '2px', letterSpacing: '0.04em' }}>
                        Clave de Admisión UNSA (Deducción)
                      </span>
                      <span style={{ fontSize: '0.94rem', color: '#065F46', fontWeight: 700, lineHeight: 1.45 }}>
                        {lesson.theory.takeaway || lesson.theory.highlight}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón táctil para pasar a la práctica */}
              <button
                className="duo-btn-3d"
                onClick={() => setCurrentStep(1)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '18px',
                  border: 'none',
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 5px 0 #059669, 0 10px 20px rgba(16, 185, 129, 0.25)',
                  marginTop: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}
              >
                <span>Entendido, ¡Poner a prueba!</span>
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </motion.div>
          ) : (
            /* ---------------- RETOS INTERACTIVOS (PREGUNTAS) ---------------- */
            <motion.div
              key={currentChallenge?.id || 'challenge'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Recordatorio de lápiz y papel */}
              {currentChallenge?.paperHint && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1.5px solid rgba(245, 158, 11, 0.35)',
                    color: '#B45309',
                    fontSize: '0.94rem',
                    lineHeight: '1.45',
                    fontWeight: 700
                  }}
                >
                  {currentChallenge.paperHint}
                </div>
              )}

              {/* Nivel Pedagógico Deductivo */}
              {currentChallenge?.pedagogicalTier && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    color: '#2563EB',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em'
                  }}
                >
                  {currentChallenge.pedagogicalTier}
                </div>
              )}

              {/* Instrucción del reto */}
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #64748B)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {currentChallenge?.instruction || 'Aplica el principio general estudiado para deducir la solución:'}
              </span>

              {/* Pregunta o Enunciado */}
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.45, margin: 0, color: 'var(--text-main, #0F172A)' }}>
                {currentChallenge?.question || currentChallenge?.sentence}
              </h2>

              {/* OPCIÓN MÚLTIPLE ESTILO DUOLINGO 3D */}
              {currentChallenge?.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                  {currentChallenge.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        disabled={evaluationStatus !== 'idle'}
                        onClick={() => setSelectedOption(idx)}
                        className="duo-btn-3d"
                        style={{
                          textAlign: 'left',
                          padding: '14px 16px',
                          borderRadius: '18px',
                          border: isSelected
                            ? '2px solid #10B981'
                            : '2px solid var(--card-border, rgba(0, 0, 0, 0.09))',
                          background: isSelected
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'var(--card-bg, #FFFFFF)',
                          color: isSelected ? '#065F46' : 'var(--text-main, #0F172A)',
                          boxShadow: isSelected
                            ? '0 4px 0 #10B981'
                            : '0 4px 0 rgba(0, 0, 0, 0.08)',
                          fontSize: '1rem',
                          lineHeight: '1.45',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          fontWeight: isSelected ? 800 : 600
                        }}
                      >
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: isSelected ? '#10B981' : 'rgba(0, 0, 0, 0.06)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary, #64748B)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 900,
                            flexShrink: 0
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* RETO CLOZE (COMPLETAR PALABRA) */}
              {currentChallenge?.type === 'cloze' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {currentChallenge.chips?.map((chip, idx) => {
                      const isSelected = selectedOption === chip;
                      return (
                        <button
                          key={idx}
                          disabled={evaluationStatus !== 'idle'}
                          onClick={() => setSelectedOption(chip)}
                          className="duo-btn-3d"
                          style={{
                            padding: '12px 20px',
                            borderRadius: '16px',
                            border: isSelected ? '2px solid #10B981' : '2px solid var(--card-border, rgba(0, 0, 0, 0.1))',
                            background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--card-bg, #FFFFFF)',
                            color: isSelected ? '#065F46' : 'var(--text-main, #0F172A)',
                            boxShadow: isSelected ? '0 4px 0 #10B981' : '0 4px 0 rgba(0, 0, 0, 0.08)',
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= BARRA INFERIOR DE EVALUACIÓN TÁCTIL (DUOLINGO) ================= */}
      {currentStep > 0 && !isFinished && (
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: '16px',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
            paddingLeft: '16px',
            paddingRight: '16px',
            borderTop: '2px solid',
            borderColor:
              evaluationStatus === 'correct'
                ? '#A7F3D0'
                : evaluationStatus === 'wrong'
                  ? '#FECACA'
                  : 'var(--card-border, rgba(0, 0, 0, 0.08))',
            background:
              evaluationStatus === 'correct'
                ? '#ECFDF5'
                : evaluationStatus === 'wrong'
                  ? '#FEF2F2'
                  : 'var(--card-bg, #FFFFFF)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
            zIndex: 1000001,
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Mensaje de Retroalimentación Inmediata con Mascota ORSTTY */}
            {evaluationStatus === 'correct' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#065F46' }}>
                <div style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(16,185,129,0.3))' }}>
                  <OrsttyMascot mood="feliz" size={48} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={24} color="#10B981" strokeWidth={3} />
                  <span style={{ fontSize: '1.18rem', fontWeight: 900 }}>¡Respuesta Correcta!</span>
                </div>
              </div>
            )}

            {evaluationStatus === 'wrong' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(239,68,68,0.3))' }}>
                  <OrsttyMascot mood="triste" size={48} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991B1B' }}>
                    <AlertCircle size={22} color="#EF4444" strokeWidth={3} />
                    <span style={{ fontSize: '1.12rem', fontWeight: 900 }}>Solución del Solucionario:</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#7F1D1D', lineHeight: '1.45', fontWeight: 600 }}>
                    {currentChallenge?.explanation || 'Revisa la regla teórica anterior para resolver este paso.'}
                  </p>
                </div>
              </div>
            )}

            {/* Botón de Acción Principal 3D */}
            {evaluationStatus === 'idle' ? (
              <button
                disabled={selectedOption === null}
                onClick={handleVerify}
                className="duo-btn-3d"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: selectedOption !== null ? '#10B981' : 'rgba(0, 0, 0, 0.1)',
                  color: selectedOption !== null ? '#FFFFFF' : 'rgba(0, 0, 0, 0.35)',
                  boxShadow: selectedOption !== null ? '0 5px 0 #059669' : 'none',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Comprobar
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="duo-btn-3d"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: evaluationStatus === 'correct' ? '#10B981' : '#EF4444',
                  boxShadow: evaluationStatus === 'correct' ? '0 5px 0 #059669' : '0 5px 0 #DC2626',
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Continuar
              </button>
            )}
          </div>
        </footer>
      )}

      {/* POPUP CONFIRMACIÓN DE SALIDA ESTILO DUOLINGO CON ORSTTY TRISTE */}
      <AnimatePresence>
        {showExitConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000000,
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowExitConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '410px',
                background: 'var(--card-bg, #FFFFFF)',
                borderRadius: '28px',
                padding: '30px 24px 24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1.5px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Mascota Orstty triste */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 8px 20px rgba(124, 58, 237, 0.22))', marginBottom: '14px' }}
              >
                <OrsttyMascot mood="triste" size={96} />
              </motion.div>

              {/* Título */}
              <h3
                style={{
                  margin: '0 0 8px',
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: 'var(--text-main, #0F172A)',
                  letterSpacing: '-0.02em'
                }}
              >
                ¿Ya te vas?
              </h3>

              {/* Mensaje persuasivo */}
              <p
                style={{
                  margin: '0 0 24px',
                  fontSize: '0.94rem',
                  color: 'var(--text-secondary, #64748B)',
                  lineHeight: 1.5,
                  fontWeight: 600,
                  maxWidth: '320px'
                }}
              >
                Si abandonas ahora, <strong style={{ color: '#EF4444' }}>perderás el progreso</strong> de esta sesión y tus puntos de experiencia en juego.
              </p>

              {/* Botones estilo Duolingo */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="duo-btn-3d"
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    borderRadius: '16px',
                    border: 'none',
                    background: '#10B981',
                    boxShadow: '0 5px 0 #059669',
                    color: '#FFFFFF',
                    fontSize: '0.98rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Continuar Lección
                </button>

                <button
                  onClick={() => {
                    setShowExitConfirmModal(false);
                    onExit();
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '16px',
                    border: '2px solid rgba(239, 68, 68, 0.25)',
                    background: 'transparent',
                    color: '#EF4444',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Salir de todos modos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
