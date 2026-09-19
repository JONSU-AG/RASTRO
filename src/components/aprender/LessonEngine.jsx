import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Award, Flame, Lightbulb, RotateCcw, Check } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { OrsttyMascot, ArtyonMascot } from '../Mascots';
import { FormulaDisplay } from '../FormulaDisplay';

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
  // Pasos 1..N: Retos interactivos (Opción múltiple, match_pairs, cloze)
  const [currentStep, setCurrentStep] = useState(0);
  const [challenges, setChallenges] = useState(lesson.challenges || []);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Modo Fénix / Cola de Redención
  const [redemptionQueue, setRedemptionQueue] = useState([]);
  const [isRedemptionPhase, setIsRedemptionPhase] = useState(false);
  const [showFenixIntro, setShowFenixIntro] = useState(false);

  // Mascota dinámica y emoción interactiva (alterna entre Artyon y Orstty)
  const [useArtyon, setUseArtyon] = useState(false);
  const [mascotMood, setMascotMood] = useState('study');

  // Respuestas
  const [selectedOption, setSelectedOption] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [mismatchedPair, setMismatchedPair] = useState(null); // { leftId: string, rightId: string }
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

  // Manejo de emparejamiento bidireccional interactivo (match_pairs)
  const handleSelectLeft = (leftItem) => {
    if (evaluationStatus !== 'idle' || mismatchedPair) return;
    const leftIdStr = String(leftItem.id);
    if (matchedPairs.has(leftIdStr)) return;

    // Si ya hay un elemento de la derecha seleccionado:
    if (selectedRight) {
      const rightIdStr = String(selectedRight.id);
      if (leftIdStr === rightIdStr) {
        // ¡Coincidencia correcta!
        const newMatched = new Set(matchedPairs);
        newMatched.add(leftIdStr);
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        triggerSuccessFeedback();

        const totalPairs = currentChallenge.pairs?.length || 0;
        if (newMatched.size >= totalPairs && totalPairs > 0) {
          setSelectedOption(true);
          setEvaluationStatus('correct');
          setMascotMood('cheering');
          if (isRedemptionPhase) {
            setRedemptionQueue(prev => prev.filter(c => c.id !== currentChallenge.id));
          }
        }
      } else {
        // ¡Discordancia / No coinciden!
        setMismatchedPair({ leftId: leftIdStr, rightId: rightIdStr });
        setSelectedLeft(leftItem);
        setMascotMood('sad');
        loseHeart();
        setErrorsCount(prev => prev + 1);
        setTimeout(() => {
          setMismatchedPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
          setMascotMood('pensativo');
        }, 600);
      }
    } else {
      // Toggle o selección en la columna izquierda
      if (selectedLeft && String(selectedLeft.id) === leftIdStr) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(leftItem);
      }
    }
  };

  const handleSelectRight = (rightItem) => {
    if (evaluationStatus !== 'idle' || mismatchedPair) return;
    const rightIdStr = String(rightItem.id);
    if (matchedPairs.has(rightIdStr)) return;

    // Si ya hay un elemento de la izquierda seleccionado:
    if (selectedLeft) {
      const leftIdStr = String(selectedLeft.id);
      if (leftIdStr === rightIdStr) {
        // ¡Coincidencia correcta!
        const newMatched = new Set(matchedPairs);
        newMatched.add(rightIdStr);
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        triggerSuccessFeedback();

        const totalPairs = currentChallenge.pairs?.length || 0;
        if (newMatched.size >= totalPairs && totalPairs > 0) {
          setSelectedOption(true);
          setEvaluationStatus('correct');
          setMascotMood('cheering');
          if (isRedemptionPhase) {
            setRedemptionQueue(prev => prev.filter(c => c.id !== currentChallenge.id));
          }
        }
      } else {
        // ¡Discordancia / No coinciden!
        setMismatchedPair({ leftId: leftIdStr, rightId: rightIdStr });
        setSelectedRight(rightItem);
        setMascotMood('sad');
        loseHeart();
        setErrorsCount(prev => prev + 1);
        setTimeout(() => {
          setMismatchedPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
          setMascotMood('pensativo');
        }, 600);
      }
    } else {
      // Toggle o selección en la columna derecha
      if (selectedRight && String(selectedRight.id) === rightIdStr) {
        setSelectedRight(null);
      } else {
        setSelectedRight(rightItem);
      }
    }
  };

  const handleVerify = () => {
    if (!currentChallenge) return;

    let isCorrect = false;

    if (currentChallenge.type === 'multiple_choice') {
      isCorrect = selectedOption === currentChallenge.correctIndex;
    } else if (currentChallenge.type === 'cloze' || currentChallenge.type === 'fill_blank') {
      const target = (currentChallenge.targetWord || currentChallenge.answer || '').toString().toLowerCase().trim();
      isCorrect = (selectedOption || '').toString().toLowerCase().trim() === target;
    } else if (currentChallenge.type === 'match_pairs') {
      const totalPairs = currentChallenge.pairs?.length || 0;
      isCorrect = matchedPairs.size >= totalPairs && totalPairs > 0;
    }

    if (isCorrect) {
      triggerSuccessFeedback();
      setEvaluationStatus('correct');
      setMascotMood('cheering');
      if (isRedemptionPhase) {
        // En fase de redención, eliminar este reto de la cola
        setRedemptionQueue(prev => prev.filter(c => c.id !== currentChallenge.id));
      }
    } else {
      loseHeart();
      setErrorsCount(prev => prev + 1);
      setEvaluationStatus('wrong');
      setMascotMood('sad');
      // Registrar en la cola de redención del Modo Fénix
      setRedemptionQueue(prev => prev.some(c => c.id === currentChallenge.id) ? prev : [...prev, currentChallenge]);
    }
  };

  const handleContinue = () => {
    if (evaluationStatus === 'correct' || evaluationStatus === 'wrong') {
      setEvaluationStatus('idle');
      setSelectedOption(null);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMismatchedPair(null);
      setMatchedPairs(new Set());
      setMascotMood('pensativo');
      setUseArtyon(prev => !prev);

      if (currentChallengeIndex + 1 < challenges.length) {
        setCurrentChallengeIndex(prev => prev + 1);
      } else {
        // Terminó la batería actual
        if (!isRedemptionPhase) {
          // Si hubo errores en la ronda inicial, activar el Modo Fénix
          if (redemptionQueue.length > 0) {
            setShowFenixIntro(true);
          } else {
            // Lección completada sin errores
            const earnedXp = 50;
            recordLessonCompletion(lesson.id, earnedXp, 3);
            setIsFinished(true);
          }
        } else {
          // Ya estábamos en la fase de redención
          if (redemptionQueue.length > 0) {
            // Aún quedan pendientes por redimir
            setChallenges([...redemptionQueue]);
            setCurrentChallengeIndex(0);
          } else {
            // ¡Todas las preguntas fueron redimidas con éxito!
            const earnedXp = Math.max(30, 50 - errorsCount * 5);
            recordLessonCompletion(lesson.id, earnedXp + 20, 3); // Bonus por perseverancia
            setIsFinished(true);
          }
        }
      }
    }
  };

  const startFenixRound = () => {
    setShowFenixIntro(false);
    setIsRedemptionPhase(true);
    setChallenges([...redemptionQueue]);
    setCurrentChallengeIndex(0);
    setSelectedOption(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMismatchedPair(null);
    setMatchedPairs(new Set());
    setEvaluationStatus('idle');
    setMascotMood('emocionado');
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

              {/* Secciones Teóricas Ricas de CEPREUNSA con Fórmulas Matemáticas KaTeX */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1. Marco Teórico Oficial si existe en la lección */}
                {lesson.theory?.marcoteorico && (
                  <div
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
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#2563EB',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        letterSpacing: '0.04em'
                      }}
                    >
                      🏛️ FUNDAMENTO TEÓRICO OFICIAL CEPREUNSA
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: fontSizes[fontSizeLevel],
                        lineHeight: lineHeights[fontSizeLevel],
                        color: 'var(--text-main, currentColor)',
                        fontWeight: 500,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {lesson.theory.marcoteorico}
                    </p>
                  </div>
                )}

                {/* 2. Pizarra de Fórmulas y Teoremas Canónicos con KaTeX */}
                {(lesson.theory?.formula_data || lesson.theory?.mecanismos) && (
                  <FormulaDisplay
                    formulaData={lesson.theory?.formula_data}
                    rawMecanismos={lesson.theory?.mecanismos}
                  />
                )}

                {/* 3. Secciones tradicionales si existen */}
                {lesson.theory?.sections && lesson.theory.sections.map((sec, idx) => {
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
                      <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-main, currentColor)' }}>
                        {sec.heading}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: fontSizes[fontSizeLevel],
                          lineHeight: lineHeights[fontSizeLevel],
                          color: 'var(--text-main, currentColor)',
                          fontWeight: 500,
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {sec.body}
                      </p>
                    </div>
                  );
                })}

                {/* 4. Párrafos simples si existen (con guardia estricta para evitar cajas vacías) */}
                {Array.isArray(lesson.theory?.paragraphs) && lesson.theory.paragraphs.length > 0 && lesson.theory.paragraphs.some(p => p && p.trim()) && (
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
                    {lesson.theory.paragraphs.filter(p => p && p.trim()).map((para, i) => (
                      <p
                        key={i}
                        style={{
                          margin: 0,
                          fontSize: fontSizes[fontSizeLevel],
                          lineHeight: lineHeights[fontSizeLevel],
                          color: 'var(--text-main, currentColor)',
                          fontWeight: 500
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* 5. Clave Fija CEPREUNSA para 80+ Puntos */}
                {lesson.theory?.fijaUnsa && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1.5px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '20px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#DC2626',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        letterSpacing: '0.04em'
                      }}
                    >
                      🔥 CLAVE FIJA CEPREUNSA (META 80+ PUNTOS)
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: fontSizes[fontSizeLevel],
                        lineHeight: lineHeights[fontSizeLevel],
                        color: '#991B1B',
                        fontWeight: 600,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {lesson.theory.fijaUnsa}
                    </p>
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

              {/* Contexto Oficial y Etiqueta de Origen CEPREUNSA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: isRedemptionPhase ? 'rgba(239, 68, 68, 0.16)' : 'rgba(59, 130, 246, 0.14)',
                      color: isRedemptionPhase ? '#EF4444' : '#2563EB',
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isRedemptionPhase ? <Flame size={13} /> : null}
                    {isRedemptionPhase ? '🔥 MODO FÉNIX • REDENCIÓN' : `🏛️ CEPREUNSA • ${lesson.subject || 'ADMISION'}`}
                  </span>

                  {(currentChallenge?.semana || lesson.semana) && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>
                      Semana {currentChallenge?.semana || lesson.semana}
                    </span>
                  )}

                  {currentChallenge?.fuente && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary, #94A3B8)' }}>
                      • {currentChallenge.fuente}
                    </span>
                  )}
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: isRedemptionPhase ? '#EF4444' : '#059669' }}>
                  {isRedemptionPhase
                    ? `Redimiendo ${currentChallengeIndex + 1} de ${challenges.length}`
                    : `Reto ${currentChallengeIndex + 1} de ${challenges.length}`}
                </span>
              </div>

              {/* Diálogo animado de la Mascota (Alternando Artyon u Orstty con emociones reales) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                <div style={{ flexShrink: 0 }}>
                  {useArtyon ? (
                    <ArtyonMascot mood={mascotMood} size={54} />
                  ) : (
                    <OrsttyMascot mood={mascotMood} size={54} />
                  )}
                </div>
                <div
                  style={{
                    background: 'var(--card-bg, #FFFFFF)',
                    border: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.08))',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: 'var(--text-main, #0F172A)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    flex: 1,
                    lineHeight: '1.4'
                  }}
                >
                  {isRedemptionPhase
                    ? '🔥 ¡Tu revancha en el Modo Fénix! Recuerda la explicación oficial y marca con certeza.'
                    : evaluationStatus === 'correct'
                      ? '¡Extraordinaria deducción! Dominas el criterio de admisión.'
                      : evaluationStatus === 'wrong'
                        ? '¡No te desanimes! Revisa la solución para redimirla al final.'
                        : (currentChallenge?.instruction || 'Aplica el principio general estudiado para deducir la solución correcta:')}
                </div>
              </div>

              {/* Enunciado Completo de la Pregunta Oficial CEPREUNSA */}
              <div
                style={{
                  background: 'var(--card-bg, #FFFFFF)',
                  border: '1.5px solid var(--card-border, rgba(0, 0, 0, 0.09))',
                  borderRadius: '18px',
                  padding: '16px 18px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
                }}
              >
                <h2 style={{ fontSize: '1.14rem', fontWeight: 800, lineHeight: 1.55, margin: 0, color: 'var(--text-main, #0F172A)' }}>
                  {currentChallenge?.statement || currentChallenge?.question || currentChallenge?.sentence || currentChallenge?.q || 'Determina la proposición correcta respecto al tema estudiado:'}
                </h2>
              </div>

              {/* 1. RETO: OPCIÓN MÚLTIPLE ESTILO DUOLINGO 3D CON FEEDBACK EDUCATIVO INMEDIATO */}
              {currentChallenge?.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2px' }}>
                  {currentChallenge.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectIndex = idx === currentChallenge.correctIndex;
                    const isWrongChosen = evaluationStatus === 'wrong' && isSelected;
                    const isCorrectTarget = evaluationStatus === 'wrong' && isCorrectIndex;
                    const isCorrectVerified = evaluationStatus === 'correct' && isSelected;

                    // Colores de estado
                    let borderColor = 'var(--card-border, rgba(0, 0, 0, 0.09))';
                    let bgColor = 'var(--card-bg, #FFFFFF)';
                    let textColor = 'var(--text-main, #0F172A)';
                    let badgeBg = 'rgba(0, 0, 0, 0.06)';
                    let badgeColor = 'var(--text-secondary, #64748B)';
                    let shadowColor = '0 4px 0 rgba(0, 0, 0, 0.08)';

                    if (isCorrectVerified || (evaluationStatus === 'correct' && isCorrectIndex)) {
                      borderColor = '#10B981';
                      bgColor = 'rgba(16, 185, 129, 0.14)';
                      textColor = '#065F46';
                      badgeBg = '#10B981';
                      badgeColor = '#FFFFFF';
                      shadowColor = '0 4px 0 #059669';
                    } else if (isWrongChosen) {
                      borderColor = '#EF4444';
                      bgColor = 'rgba(239, 68, 68, 0.12)';
                      textColor = '#991B1B';
                      badgeBg = '#EF4444';
                      badgeColor = '#FFFFFF';
                      shadowColor = '0 4px 0 #DC2626';
                    } else if (isCorrectTarget) {
                      borderColor = '#10B981';
                      bgColor = 'rgba(16, 185, 129, 0.16)';
                      textColor = '#065F46';
                      badgeBg = '#10B981';
                      badgeColor = '#FFFFFF';
                      shadowColor = '0 4px 0 #059669';
                    } else if (isSelected && evaluationStatus === 'idle') {
                      borderColor = '#10B981';
                      bgColor = 'rgba(16, 185, 129, 0.12)';
                      textColor = '#065F46';
                      badgeBg = '#10B981';
                      badgeColor = '#FFFFFF';
                      shadowColor = '0 4px 0 #10B981';
                    }

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
                          border: `2.5px solid ${borderColor}`,
                          background: bgColor,
                          color: textColor,
                          boxShadow: shadowColor,
                          fontSize: '0.98rem',
                          lineHeight: '1.45',
                          cursor: evaluationStatus === 'idle' ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          fontWeight: (isSelected || isCorrectTarget) ? 800 : 600,
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: badgeBg,
                            color: badgeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.88rem',
                            fontWeight: 900,
                            flexShrink: 0
                          }}
                        >
                          {isCorrectTarget || isCorrectVerified ? '✓' : isWrongChosen ? '✕' : String.fromCharCode(65 + idx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isCorrectTarget && (
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 900,
                              background: '#10B981',
                              color: '#FFFFFF',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              letterSpacing: '0.03em',
                              flexShrink: 0
                            }}
                          >
                            Respuesta Correcta
                          </span>
                        )}
                        {isWrongChosen && (
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 900,
                              background: '#EF4444',
                              color: '#FFFFFF',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              letterSpacing: '0.03em',
                              flexShrink: 0
                            }}
                          >
                            Tu Respuesta
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. RETO: ELEGIR SU CORRESPONDIENTE / EMPAREJAR CONCEPTOS (MATCH PAIRS) */}
              {currentChallenge?.type === 'match_pairs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                  {/* Barra de estado y progreso del emparejamiento */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: mismatchedPair
                        ? 'rgba(239, 68, 68, 0.12)'
                        : (selectedLeft || selectedRight)
                          ? 'rgba(59, 130, 246, 0.12)'
                          : 'var(--card-bg, #FFFFFF)',
                      border: `1.5px solid ${mismatchedPair ? '#EF4444' : (selectedLeft || selectedRight) ? '#3B82F6' : 'var(--card-border, rgba(0, 0, 0, 0.08))'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        color: mismatchedPair
                          ? '#DC2626'
                          : (selectedLeft || selectedRight)
                            ? '#1D4ED8'
                            : 'var(--text-secondary, #64748B)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {mismatchedPair
                        ? '✕ No corresponden entre sí. ¡Intenta con otra combinación!'
                        : selectedLeft
                          ? `Buscando pareja para «${selectedLeft.text}»... Toca su definición a la derecha:`
                          : selectedRight
                            ? `Buscando concepto para «${selectedRight.text.slice(0, 28)}...»... Toca a la izquierda:`
                            : 'Toca un concepto (izquierda o derecha) y luego su correspondiente:'}
                    </span>

                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        color: '#10B981',
                        background: 'rgba(16, 185, 129, 0.14)',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        flexShrink: 0
                      }}
                    >
                      {matchedPairs.size} / {currentChallenge.pairs?.length || 0}
                    </span>
                  </div>

                  {/* Columnas Interactivas Bidireccionales */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'start' }}>
                    {/* Columna Izquierda */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentChallenge.pairs?.map((p, pIdx) => {
                        const idStr = String(p.id !== undefined ? p.id : pIdx);
                        const isMatched = matchedPairs.has(idStr);
                        const isSelected = selectedLeft && String(selectedLeft.id) === idStr;
                        const isMismatched = mismatchedPair && mismatchedPair.leftId === idStr;

                        return (
                          <button
                            key={pIdx}
                            disabled={isMatched || evaluationStatus !== 'idle'}
                            onClick={() => handleSelectLeft({ id: idStr, text: p.left })}
                            className={`duo-btn-3d ${isMismatched ? 'rastro-shake-anim' : ''}`}
                            style={{
                              padding: '14px 12px',
                              borderRadius: '16px',
                              border: isMatched
                                ? '2.5px solid #10B981'
                                : isMismatched
                                  ? '2.5px solid #EF4444'
                                  : isSelected
                                    ? '2.5px solid #3B82F6'
                                    : '2px solid var(--card-border, rgba(0, 0, 0, 0.1))',
                              background: isMatched
                                ? 'rgba(16, 185, 129, 0.16)'
                                : isMismatched
                                  ? 'rgba(239, 68, 68, 0.18)'
                                  : isSelected
                                    ? 'rgba(59, 130, 246, 0.18)'
                                    : 'var(--card-bg, #FFFFFF)',
                              color: isMatched
                                ? '#065F46'
                                : isMismatched
                                  ? '#991B1B'
                                  : isSelected
                                    ? '#1D4ED8'
                                    : 'var(--text-main, #0F172A)',
                              fontSize: '0.92rem',
                              fontWeight: (isSelected || isMatched) ? 900 : 700,
                              cursor: isMatched ? 'default' : 'pointer',
                              textAlign: 'center',
                              boxShadow: isMatched
                                ? '0 4px 0 #059669'
                                : isMismatched
                                  ? '0 4px 0 #DC2626'
                                  : isSelected
                                    ? '0 4px 0 #2563EB, 0 0 14px rgba(59, 130, 246, 0.4)'
                                    : '0 3px 0 rgba(0, 0, 0, 0.08)',
                              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                              transition: 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              minHeight: '52px'
                            }}
                          >
                            <span>{p.left}</span>
                            {isMatched && <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1.05rem' }}>✓</span>}
                            {isMismatched && <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '1.05rem' }}>✕</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Columna Derecha */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(currentChallenge.shuffledRight || currentChallenge.pairs?.map((p, pIdx) => ({ id: p.id !== undefined ? p.id : pIdx, text: p.right })) || []).map((rItem, rIdx) => {
                        const idStr = String(rItem.id !== undefined ? rItem.id : rIdx);
                        const isMatched = matchedPairs.has(idStr);
                        const isSelected = selectedRight && String(selectedRight.id) === idStr;
                        const isMismatched = mismatchedPair && mismatchedPair.rightId === idStr;

                        return (
                          <button
                            key={rIdx}
                            disabled={isMatched || evaluationStatus !== 'idle'}
                            onClick={() => handleSelectRight({ id: idStr, text: rItem.text })}
                            className={`duo-btn-3d ${isMismatched ? 'rastro-shake-anim' : ''}`}
                            style={{
                              padding: '14px 12px',
                              borderRadius: '16px',
                              border: isMatched
                                ? '2.5px solid #10B981'
                                : isMismatched
                                  ? '2.5px solid #EF4444'
                                  : isSelected
                                    ? '2.5px solid #3B82F6'
                                    : '2px solid var(--card-border, rgba(0, 0, 0, 0.1))',
                              background: isMatched
                                ? 'rgba(16, 185, 129, 0.16)'
                                : isMismatched
                                  ? 'rgba(239, 68, 68, 0.18)'
                                  : isSelected
                                    ? 'rgba(59, 130, 246, 0.18)'
                                    : 'var(--card-bg, #FFFFFF)',
                              color: isMatched
                                ? '#065F46'
                                : isMismatched
                                  ? '#991B1B'
                                  : isSelected
                                    ? '#1D4ED8'
                                    : 'var(--text-main, #0F172A)',
                              fontSize: '0.88rem',
                              lineHeight: '1.35',
                              fontWeight: (isSelected || isMatched) ? 800 : 600,
                              cursor: isMatched ? 'default' : 'pointer',
                              textAlign: 'center',
                              boxShadow: isMatched
                                ? '0 4px 0 #059669'
                                : isMismatched
                                  ? '0 4px 0 #DC2626'
                                  : isSelected
                                    ? '0 4px 0 #2563EB, 0 0 14px rgba(59, 130, 246, 0.4)'
                                    : '0 3px 0 rgba(0, 0, 0, 0.08)',
                              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                              transition: 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              minHeight: '52px'
                            }}
                          >
                            <span>{rItem.text}</span>
                            {isMatched && <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1.05rem' }}>✓</span>}
                            {isMismatched && <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '1.05rem' }}>✕</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RETO: COMPLETAR LA FRASE (FILL IN THE BLANK / CLOZE) */}
              {(currentChallenge?.type === 'cloze' || currentChallenge?.type === 'fill_blank') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  <div
                    style={{
                      padding: '18px 20px',
                      borderRadius: '18px',
                      background: 'var(--card-bg, #FFFFFF)',
                      border: '2px solid var(--card-border, rgba(0, 0, 0, 0.1))',
                      fontSize: '1.08rem',
                      lineHeight: 1.7,
                      fontWeight: 700,
                      color: 'var(--text-main, #0F172A)'
                    }}
                  >
                    {currentChallenge.sentenceParts?.before || currentChallenge.sentence?.split('___')[0] || 'Principio: '}
                    <span
                      onClick={() => selectedOption && setSelectedOption(null)}
                      style={{
                        display: 'inline-block',
                        minWidth: '100px',
                        borderBottom: selectedOption ? '3px solid #10B981' : '3px dashed #94A3B8',
                        padding: '2px 10px',
                        margin: '0 6px',
                        color: selectedOption ? '#059669' : '#94A3B8',
                        fontWeight: 900,
                        textAlign: 'center',
                        background: selectedOption ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0,0,0,0.04)',
                        borderRadius: '8px',
                        cursor: selectedOption ? 'pointer' : 'default'
                      }}
                    >
                      {selectedOption || '_______'}
                    </span>
                    {currentChallenge.sentenceParts?.after || currentChallenge.sentence?.split('___')[1] || ''}
                  </div>

                  {/* Fichas de palabras seleccionables */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {currentChallenge.chips?.map((chip, idx) => {
                      const isUsed = selectedOption === chip;
                      return (
                        <button
                          key={idx}
                          disabled={isUsed || evaluationStatus !== 'idle'}
                          onClick={() => setSelectedOption(chip)}
                          className="duo-btn-3d"
                          style={{
                            padding: '10px 18px',
                            borderRadius: '14px',
                            border: isUsed ? '2px dashed rgba(0,0,0,0.15)' : '2px solid var(--card-border, rgba(0, 0, 0, 0.1))',
                            background: isUsed ? 'rgba(0,0,0,0.04)' : 'var(--card-bg, #FFFFFF)',
                            color: isUsed ? 'rgba(0,0,0,0.25)' : 'var(--text-main, #0F172A)',
                            boxShadow: isUsed ? 'none' : '0 4px 0 rgba(0, 0, 0, 0.08)',
                            fontSize: '1rem',
                            fontWeight: 800,
                            cursor: isUsed ? 'default' : 'pointer'
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
                  {useArtyon ? (
                    <ArtyonMascot mood="triste" size={48} />
                  ) : (
                    <OrsttyMascot mood="triste" size={48} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991B1B' }}>
                    <AlertCircle size={22} color="#EF4444" strokeWidth={3} />
                    <span style={{ fontSize: '1.12rem', fontWeight: 900 }}>Respuesta Errónea</span>
                  </div>

                  {/* Resaltado prominente de la Clave Correcta */}
                  {currentChallenge?.type === 'multiple_choice' && typeof currentChallenge?.correctIndex === 'number' && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1.5px solid #10B981',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ✅ Clave Correcta: Opción {String.fromCharCode(65 + currentChallenge.correctIndex)}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857' }}>
                        {currentChallenge.options?.[currentChallenge.correctIndex]}
                      </span>
                    </div>
                  )}

                  {/* Resaltado de Emparejamiento Correcto (match_pairs) */}
                  {currentChallenge?.type === 'match_pairs' && Array.isArray(currentChallenge?.pairs) && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1.5px solid #10B981',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ✅ Correspondencias Correctas:
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '4px' }}>
                        {currentChallenge.pairs.map((p, pIdx) => (
                          <div key={pIdx} style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 700 }}>
                            • <strong>{p.left}</strong> ➔ {p.right}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resaltado de Frase Completada (cloze / fill_blank) */}
                  {(currentChallenge?.type === 'cloze' || currentChallenge?.type === 'fill_blank') && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1.5px solid #10B981',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ✅ Término que completa la proposición:
                      </span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857' }}>
                        «{currentChallenge.targetWord || currentChallenge.answer}»
                      </span>
                    </div>
                  )}

                  {/* Solucionario Oficial CEPREUNSA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 900, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      📖 Fundamento CEPREUNSA:
                    </span>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#7F1D1D', lineHeight: '1.45', fontWeight: 600 }}>
                      {currentChallenge?.explanation || 'Revisa la regla teórica anterior para resolver este paso.'}
                    </p>
                  </div>

                  {/* Notificación de Modo Fénix */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#DC2626', fontWeight: 800, marginTop: '2px' }}>
                    <Flame size={15} fill="#EF4444" color="#EF4444" />
                    <span>Esta pregunta se guardó para tu revancha en el <strong>Modo Fénix</strong>.</span>
                  </div>
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
                {currentChallenge?.type === 'match_pairs'
                  ? `Empareja las parejas (${matchedPairs.size} / ${currentChallenge.pairs?.length || 0})`
                  : 'Comprobar'}
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
        {/* ================= MODAL DEL MODO FÉNIX / RONDA DE REDENCIÓN ================= */}
        {showFenixIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000000,
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={{
                width: '100%',
                maxWidth: '430px',
                background: 'var(--card-bg, #FFFFFF)',
                borderRadius: '32px',
                padding: '32px 24px 26px',
                boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.35), 0 0 0 2px rgba(239, 68, 68, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Resplandor ardiente decorativo */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />

              {/* Insignia Fénix */}
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #EF4444, #F97316)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                  marginBottom: '14px'
                }}
              >
                <Flame size={16} fill="#FFFFFF" />
                <span>RONDA DE REDENCIÓN</span>
              </div>

              {/* Mascota ARTYON en modo emocionado/fénix */}
              <div style={{ marginBottom: '12px', filter: 'drop-shadow(0 8px 24px rgba(249, 115, 22, 0.4))' }}>
                <ArtyonMascot mood="emocionado" size={105} />
              </div>

              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: 'var(--text-main, #0F172A)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}
              >
                ¡Llegó el Modo Fénix!
              </h2>

              <p
                style={{
                  margin: '0 0 20px',
                  fontSize: '0.96rem',
                  color: 'var(--text-secondary, #64748B)',
                  lineHeight: 1.5,
                  fontWeight: 600
                }}
              >
                Tuviste <strong>{redemptionQueue.length} {redemptionQueue.length === 1 ? 'pregunta' : 'preguntas'}</strong> con dudas. ¡Es momento de renacer de las cenizas! Recuerda la explicación oficial que leíste y responde con seguridad para asegurar tu 100%.
              </p>

              {/* Contador de preguntas a redimir */}
              <div
                style={{
                  width: '100%',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#B91C1C',
                  fontWeight: 800,
                  fontSize: '0.92rem'
                }}
              >
                <RotateCcw size={18} />
                <span>{redemptionQueue.length} {redemptionQueue.length === 1 ? 'pregunta por redimir' : 'preguntas por redimir'}</span>
              </div>

              {/* Botón 3D Fénix */}
              <button
                onClick={startFenixRound}
                className="duo-btn-3d"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '18px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #EF4444 0%, #EA580C 100%)',
                  boxShadow: '0 6px 0 #B91C1C, 0 10px 24px rgba(239, 68, 68, 0.35)',
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <span>¡Comenzar Redención!</span>
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </motion.div>
          </motion.div>
        )}

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
