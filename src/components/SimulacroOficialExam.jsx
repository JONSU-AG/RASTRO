import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Flag,
  Check,
  Pause,
  Play,
  Layers,
  HelpCircle,
  BarChart3,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  Zap,
  Filter,
  Timer,
  Sliders,
  Shuffle,
  Coffee,
  Trophy
} from 'lucide-react';
import { generateSimulacroOficial80, calculateExamScore, datosSimulador, normalizeAsignatura } from '../data/simuladorData';
import { cleanOptionText } from '../pages/Simulador';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { RankingSimulacroModal, getLigaForScore } from './RankingSimulacroModal';
import AnimatedCounter from './AnimatedCounter';

const DURATION_SECONDS = 9000; // 2 horas y 30 minutos (150 minutos = 9,000s)

export const SimulacroOficialExam = ({
  bancoQuestions = [],
  initialArea = 'Biomédicas',
  onTransferToCalculator,
  onBackToMenu
}) => {
  const { user } = useAuth();
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [examStage, setExamStage] = useState('welcome'); // 'welcome' | 'running' | 'results'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [index]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [index]: boolean }
  const [showRankingModal, setShowRankingModal] = useState(false);
  
  // Modos de tiempo: 'temporizador' (2h 30m regresivo), 'cronometro' (libre progresivo), 'sin_tiempo' (relajado)
  const [timeMode, setTimeMode] = useState('temporizador');
  // Orden de cursos: siempre aleatorio por defecto
  const [orderPreference, setOrderPreference] = useState('aleatorio');
  
  const [timeRemaining, setTimeRemaining] = useState(DURATION_SECONDS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'blank'

  // Ref for timer
  const timerRef = useRef(null);

  // Iniciar Simulacro
  const handleStartExam = (areaToUse = selectedArea, orderToUse = 'aleatorio', modeToUse = timeMode) => {
    setSelectedArea(areaToUse);
    setOrderPreference(orderToUse);
    setTimeMode(modeToUse);
    const exam80 = generateSimulacroOficial80(bancoQuestions, areaToUse, orderToUse);
    setQuestions(exam80);
    setUserAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeRemaining(DURATION_SECONDS);
    setElapsedSeconds(0);
    setIsPaused(false);
    setResultsData(null);
    setReviewFilter('all');
    setExamStage('running');
  };

  // Manejador del temporizador / cronómetro
  useEffect(() => {
    if (examStage === 'running' && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);

        if (timeMode === 'temporizador') {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              // Tiempo agotado: autoentrega
              handleFinishExamAuto();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStage, isPaused, timeMode, questions, userAnswers, selectedArea]);

  // Formateador de tiempo HH:MM:SS
  const formatTime = (seconds) => {
    const safeSecs = Math.max(0, Math.floor(seconds || 0));
    const h = Math.floor(safeSecs / 3600).toString().padStart(2, '0');
    const m = Math.floor((safeSecs % 3600) / 60).toString().padStart(2, '0');
    const s = (safeSecs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Finalizar examen y registrar en el ranking oficial
  const handleFinishExam = () => {
    setShowConfirmModal(false);
    const timeSpentSecs = timeMode === 'temporizador'
      ? (DURATION_SECONDS - timeRemaining)
      : elapsedSeconds;
    const timeSpentStr = formatTime(timeSpentSecs);

    const scoreResults = calculateExamScore({
      questions,
      userAnswers,
      area: selectedArea,
      simData: datosSimulador
    });

    const resultsPayload = {
      ...scoreResults,
      timeSpent: timeSpentStr,
      timeMode,
      orderPreference,
      area: selectedArea
    };

    setResultsData(resultsPayload);
    setExamStage('results');

    // Registrar en localStorage para consulta inmediata
    const simSummary = {
      score: scoreResults.unsaWeightedScore || 0,
      correct: scoreResults.score || 0,
      wrong: scoreResults.wrongCount || 0,
      blank: scoreResults.blankCount || 0,
      timeSpent: timeSpentStr,
      area: selectedArea,
      date: new Date().toISOString()
    };
    try {
      localStorage.setItem('rastro_last_simulacro_score', JSON.stringify(simSummary));
    } catch (e) {}

    // Sincronizar en Firebase Firestore ranking_simulacros si el usuario está conectado
    if (user?.uid) {
      try {
        const rankingDocRef = doc(db, 'ranking_simulacros', user.uid);
        setDoc(rankingDocRef, {
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Postulante UNSA',
          userPhoto: user.photoURL || null,
          career: user.career || (user.displayName ? 'Postulante UNSA' : 'Aspirante'),
          area: selectedArea,
          score: scoreResults.unsaWeightedScore || 0,
          correct: scoreResults.score || 0,
          wrong: scoreResults.wrongCount || 0,
          blank: scoreResults.blankCount || 0,
          timeSpent: timeSpentStr,
          date: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.warn('Ranking save firestore warning:', err);
        });
      } catch (err) {
        console.warn('Ranking save err:', err);
      }
    }
  };

  const handleFinishExamAuto = () => {
    handleFinishExam();
  };

  const currentQ = questions[currentIndex] || null;
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const blankCount = Math.max(0, questions.length - answeredCount);

  // Detalle de reglas del área seleccionada
  const areaRules = useMemo(() => {
    return datosSimulador[selectedArea] || datosSimulador['Biomédicas'] || [];
  }, [selectedArea]);

  // Resumen compacto por 4 categorías para no saturar la pantalla móvil con 20 píldoras
  const categorySummary = useMemo(() => {
    let aptitud = 0;
    let matematicas = 0;
    let ciencias = 0;
    let humanidades = 0;

    areaRules.forEach(rule => {
      const asig = (rule.asignatura || '').toLowerCase();
      const curso = (rule.curso || '').toLowerCase();
      if (curso.includes('aptitud') || asig.includes('lógico') || asig.includes('matemático') || asig.includes('verbal') || asig.includes('lectura')) {
        aptitud += rule.preguntas;
      } else if (curso.includes('matemática') || asig.includes('álgebra') || asig.includes('aritmética') || asig.includes('geometría') || asig.includes('trigonometría')) {
        matematicas += rule.preguntas;
      } else if (curso.includes('ciencia') || asig.includes('física') || asig.includes('química') || asig.includes('biología')) {
        ciencias += rule.preguntas;
      } else {
        humanidades += rule.preguntas;
      }
    });

    return { aptitud, matematicas, ciencias, humanidades };
  }, [areaRules]);

  // Filtrado de revisión en pantalla de resultados
  const filteredReviewDetails = useMemo(() => {
    if (!resultsData?.details) return [];
    if (reviewFilter === 'correct') return resultsData.details.filter(d => d.isCorrect);
    if (reviewFilter === 'wrong') return resultsData.details.filter(d => !d.isCorrect && !d.isBlank);
    if (reviewFilter === 'blank') return resultsData.details.filter(d => d.isBlank);
    return resultsData.details;
  }, [resultsData, reviewFilter]);

  // VISTA 1: BIENVENIDA / CONFIGURACIÓN DEL SIMULACRO OFICIAL
  if (examStage === 'welcome') {
    return (
      <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', paddingBottom: '40px' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="ios-glass-card"
          style={{
            padding: 'clamp(18px, 4vw, 32px)',
            borderRadius: '26px',
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.08)'
          }}
        >
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.2))',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#059669',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '12px'
            }}>
              <Award size={15} /> MODALIDAD OFICIAL UNSA
            </div>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
              fontWeight: 900,
              color: 'var(--text-main)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em'
            }}>
              Simulacro de Admisión (80 Preguntas)
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Preguntas oficiales extraídas directamente de los solucionarios CEPREUNSA con ponderación oficial sobre <strong>100.0000 pts</strong>.
            </p>
          </div>

          {/* Selector de Área Académica - Horizontal centrado */}
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', textAlign: 'center' }}>
              1. Selecciona tu Área de Postulación:
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '6px',
              background: 'var(--card-bg)',
              padding: '5px',
              borderRadius: '14px',
              border: '1.5px solid var(--card-border)',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              {[
                { key: 'Sociales', label: 'Sociales', color: '#F59E0B' },
                { key: 'Ingenierías', label: 'Ingenierías', color: '#007AFF' },
                { key: 'Biomédicas', label: 'Biomédicas', color: '#10B981' }
              ].map(item => {
                const isSelected = selectedArea === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedArea(item.key)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${item.color}` : '1px solid transparent',
                      background: isSelected ? `${item.color}20` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 12px ${item.color}30` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      minHeight: '36px'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isSelected ? item.color : 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Subtítulo dinámico con carreras del área */}
            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.70rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {selectedArea === 'Sociales' && 'Derecho, Psicología, Educación, Contabilidad, Administración y afines.'}
              {selectedArea === 'Ingenierías' && 'Sistemas, Civil, Minas, Industrial, Mecánica, Electrónica y afines.'}
              {selectedArea === 'Biomédicas' && 'Medicina Humana, Biología, Enfermería, Nutrición y afines.'}
            </div>
          </div>

          {/* Resumen Compacto de Distribución (Reemplazo amigable de las 20 píldoras verticales) */}
          <div style={{
            background: 'rgba(120, 120, 128, 0.05)',
            border: '1px solid var(--card-border)',
            borderRadius: '18px',
            padding: '12px 16px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Estructura de Preguntas ({selectedArea}):
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#059669' }}>
                Total: 80 preg. (100.0000 pts)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Aptitud</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#2563EB' }}>{categorySummary.aptitud} preg.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Matemática</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10B981' }}>{categorySummary.matematicas} preg.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Ciencias</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#EC4899' }}>{categorySummary.ciencias} preg.</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Humanidades</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#F59E0B' }}>{categorySummary.humanidades} preg.</div>
              </div>
            </div>

            {/* Desglose opcional desplegable */}
            <details style={{ marginTop: '10px', fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 700, color: 'var(--text-main)', padding: '4px 0' }}>
                Ver desglose de las 20 asignaturas y ponderaciones
              </summary>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
                {areaRules.map((rule, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-main)'
                    }}
                  >
                    {rule.asignatura}: <strong style={{ color: '#2563EB' }}>{rule.preguntas}</strong> (+{rule.valor.toFixed(4)} pts)
                  </span>
                ))}
              </div>
            </details>
          </div>

          {/* Modalidad de Tiempo */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              2. Elige la Modalidad de Tiempo:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                {
                  id: 'temporizador',
                  icon: <Clock size={20} color="#10B981" />,
                  title: 'Temporizador Oficial',
                  badge: '2h 30m (150 min)',
                  desc: 'Cuenta regresiva oficial como en el examen real. Se autoentrega al agotarse.',
                  color: '#10B981'
                },
                {
                  id: 'cronometro',
                  icon: <Timer size={20} color="#007AFF" />,
                  title: 'Cronómetro Libre',
                  badge: 'Sin corte forzado',
                  desc: 'Cuenta hacia adelante (00:00). Mide tu velocidad y sé consciente de tu demora.',
                  color: '#007AFF'
                },
                {
                  id: 'sin_tiempo',
                  icon: <Coffee size={20} color="#8B5CF6" />,
                  title: 'Modo Relajado',
                  badge: 'A tu propio ritmo',
                  desc: 'Sin reloj en pantalla ni presión. Practica y analiza las preguntas con calma.',
                  color: '#8B5CF6'
                }
              ].map(mode => {
                const isSelected = timeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTimeMode(mode.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: isSelected ? `2px solid ${mode.color}` : '1.5px solid var(--card-border)',
                      background: isSelected ? `${mode.color}15` : 'var(--card-bg)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 6px 18px ${mode.color}25` : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{mode.icon}</span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: isSelected ? mode.color : 'rgba(120, 120, 128, 0.1)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)'
                      }}>
                        {mode.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isSelected ? mode.color : 'var(--text-main)', marginTop: '4px' }}>
                      {mode.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      {mode.desc}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coffee size={13} color="#F59E0B" />
              <span>Tip: Puedes pausar en cualquier momento si necesitas un descanso.</span>
            </div>
          </div>

          {/* Botón de inicio */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartExam(selectedArea, orderPreference, timeMode)}
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '16px 24px',
                borderRadius: '18px',
                border: 'none',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Zap size={20} />
              Iniciar Simulacro Oficial (80 Preguntas)
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // VISTA 2: EXAMEN EN VIVO (80 PREGUNTAS)
  if (examStage === 'running') {
    const isAnswered = userAnswers[currentIndex] !== undefined;
    const isCurrentFlagged = Boolean(flagged[currentIndex]);
    const progressPercent = Math.round((answeredCount / 80) * 100);

    const isTimerCritical = timeMode === 'temporizador' && timeRemaining < 600; // < 10 minutos
    const isTimerWarning = timeMode === 'temporizador' && timeRemaining < 1800; // < 30 minutos

    return (
      <div style={{
        width: '100%',
        maxWidth: '980px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))'
      }}>
        {/* Scoped Responsive Styles to guarantee 100% full width and no squishing on mobile */}
        <style>{`
          @media (max-width: 900px) {
            .simulacro-layout-grid {
              grid-template-columns: 1fr !important;
            }
            .simulacro-desktop-sidebar {
              display: none !important;
            }
            .simulacro-topbar {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 10px !important;
            }
            .simulacro-topbar-left {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              width: 100% !important;
            }
            .simulacro-topbar-right {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              width: 100% !important;
            }
          }
          @media (min-width: 901px) {
            .simulacro-layout-grid {
              grid-template-columns: 1fr 280px !important;
            }
            .simulacro-desktop-sidebar {
              display: flex !important;
            }
          }
        `}</style>
        
        {/* Top Floating Control Bar */}
        <div className="ios-glass-card simulacro-topbar" style={{
          padding: '12px 18px',
          borderRadius: '20px',
          background: 'var(--card-bg)',
          border: '1.5px solid var(--card-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
        }}>
          {/* Indicador de Tiempo (Temporizador, Cronómetro o Relajado) + Botón Pausa */}
          <div className="simulacro-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '14px',
              background: timeMode === 'temporizador'
                ? (isTimerCritical ? 'rgba(239, 68, 68, 0.15)' : (isTimerWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'))
                : (timeMode === 'cronometro' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(139, 92, 246, 0.15)'),
              border: `1.5px solid ${
                timeMode === 'temporizador'
                  ? (isTimerCritical ? '#EF4444' : (isTimerWarning ? '#F59E0B' : '#10B981'))
                  : (timeMode === 'cronometro' ? '#007AFF' : '#8B5CF6')
              }`,
              color: timeMode === 'temporizador'
                ? (isTimerCritical ? '#DC2626' : (isTimerWarning ? '#D97706' : '#059669'))
                : (timeMode === 'cronometro' ? '#007AFF' : '#7C3AED'),
              fontWeight: 900,
              fontSize: '1.05rem',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {timeMode === 'temporizador' && <Clock size={17} />}
              {timeMode === 'cronometro' && <Timer size={17} />}
              {timeMode === 'sin_tiempo' && <Coffee size={17} />}
              
              <span>
                {timeMode === 'temporizador' && formatTime(timeRemaining)}
                {timeMode === 'cronometro' && formatTime(elapsedSeconds)}
                {timeMode === 'sin_tiempo' && 'Modo Relajado'}
              </span>
            </div>

            {/* Botón Pausa disponible en todos los modos */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Reanudar Examen" : "Pausar Examen"}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: isPaused ? '#F59E0B' : 'var(--card-bg)',
                color: isPaused ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'all 0.2s ease'
              }}
            >
              {isPaused ? <Play size={14} fill="#fff" /> : <Pause size={14} />}
              {isPaused ? 'Reanudar' : 'Pausa'}
            </button>
          </div>

          {/* Progreso + Botones Móvil y Entrega */}
          <div className="simulacro-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>
                {answeredCount} de 80 ({progressPercent}%)
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {blankCount} en blanco • {flaggedCount} marcadas
              </span>
            </div>

            {/* Botón Rejilla para móvil */}
            <button
              type="button"
              onClick={() => setShowNavSheet(true)}
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.08)',
                color: 'var(--text-main)',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Layers size={15} /> Rejilla 1..80
            </button>

            {/* Botón Entregar */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} /> Entregar
            </button>
          </div>
        </div>

        {/* Modal Overlay de Pausa cuando el estudiante es interrumpido ("por si su mamá le llama o algo") */}
        {isPaused && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ios-glass-card"
              style={{
                maxWidth: '440px',
                width: '100%',
                padding: '28px 24px',
                borderRadius: '26px',
                background: 'var(--card-bg)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.8rem'
              }}>
                ⏸️
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px' }}>
                Simulacro en Pausa
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                El tiempo y tus respuestas están seguros. Puedes atender a tu familia, responder llamadas o tomar un descanso sin prisa.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'rgba(120, 120, 128, 0.08)',
                  border: '1px solid var(--card-border)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: 'var(--text-main)'
                }}>
                  {timeMode === 'temporizador' ? `⏳ Restante: ${formatTime(timeRemaining)}` : `⏱️ Tiempo: ${formatTime(elapsedSeconds)}`}
                </span>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#059669'
                }}>
                  📝 {answeredCount} de 80 respondidas
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPaused(false)}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Play size={18} fill="#fff" /> Reanudar Simulacro
              </button>
            </motion.div>
          </div>
        )}

        {/* Main Grid: Responsive - 1 Column on Mobile, 2 Columns on Desktop */}
        <div className="simulacro-layout-grid" style={{ display: 'grid', gap: '16px', alignItems: 'start' }}>
          
          {/* Question Card */}
          <div className="ios-glass-card" style={{
            padding: 'clamp(18px, 3vw, 28px)',
            borderRadius: '26px',
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
          }}>
            {/* Header de la Pregunta Actual */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  🎯 Pregunta {currentIndex + 1} de 80
                </span>

                <span style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: '#2563EB',
                  fontSize: '0.82rem',
                  fontWeight: 800
                }}>
                  🧪 {currentQ?.asignaturaOficial || currentQ?.asignatura}
                </span>

                {currentQ?.valorPonderado && (
                  <span style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    background: 'rgba(236, 72, 153, 0.12)',
                    color: '#EC4899',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}>
                    ⭐ +{currentQ.valorPonderado.toFixed(4)} pts
                  </span>
                )}
              </div>

              {/* Botón Marcar para Revisar */}
              <button
                type="button"
                onClick={() => setFlagged(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: isCurrentFlagged ? '1.5px solid #F59E0B' : '1px solid var(--card-border)',
                  background: isCurrentFlagged ? 'rgba(245, 158, 11, 0.15)' : 'rgba(120, 120, 128, 0.08)',
                  color: isCurrentFlagged ? '#D97706' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Flag size={14} fill={isCurrentFlagged ? '#F59E0B' : 'none'} />
                {isCurrentFlagged ? 'Marcada' : 'Marcar para revisar'}
              </button>
            </div>

            {/* Enunciado */}
            <h3 style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              fontWeight: 800,
              marginBottom: '20px',
              wordBreak: 'break-word'
            }}>
              {currentQ?.q}
            </h3>

            {/* Imagen si la tuviera */}
            {currentQ?.imageUrl && (
              <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
                <img
                  src={currentQ.imageUrl}
                  alt="Gráfico"
                  style={{ maxHeight: '280px', maxWidth: '100%', borderRadius: '14px', objectFit: 'contain', border: '1px solid var(--card-border)' }}
                />
              </div>
            )}

            {/* Opciones A..E */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {(currentQ?.options || []).map((opt, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                const letter = ['A', 'B', 'C', 'D', 'E'][optIdx] || String.fromCharCode(65 + optIdx);
                return (
                  <motion.button
                    key={optIdx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setUserAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
                    }}
                    style={{
                      padding: '13px 16px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #10B981' : '1.5px solid var(--card-border)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.94rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? '#10B981' : 'rgba(120, 120, 128, 0.1)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      flexShrink: 0
                    }}>
                      {isSelected ? <Check size={16} strokeWidth={3} /> : letter}
                    </div>
                    <span style={{ fontWeight: isSelected ? 700 : 500, lineHeight: 1.45, flex: 1 }}>
                      {cleanOptionText(opt)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Controles de Navegación Inferior */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>
              </div>

              {currentIndex < 79 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.min(79, prev + 1))}
                  style={{
                    padding: '11px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Siguiente <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  style={{
                    padding: '11px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(236, 72, 153, 0.35)'
                  }}
                >
                  🏁 Entregar Examen
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar: Rejilla 1..80 Desktop */}
          <div className="ios-glass-card simulacro-desktop-sidebar" style={{
            padding: '18px',
            borderRadius: '24px',
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: 'min(82vh, 620px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Navegador de Preguntas
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>
                {answeredCount}/80
              </span>
            </div>

            {/* Grid 1 to 80 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '6px'
            }}>
              {questions.map((_, idx) => {
                const isAns = userAnswers[idx] !== undefined;
                const isCur = idx === currentIndex;
                const isFlg = Boolean(flagged[idx]);

                let bg = 'rgba(120, 120, 128, 0.08)';
                let color = 'var(--text-secondary)';
                let border = '1px solid var(--card-border)';

                if (isAns) {
                  bg = 'rgba(16, 185, 129, 0.18)';
                  color = '#059669';
                  border = '1px solid #10B981';
                }
                if (isFlg) {
                  bg = 'rgba(245, 158, 11, 0.2)';
                  color = '#D97706';
                  border = '1px solid #F59E0B';
                }
                if (isCur) {
                  border = '2.5px solid #2563EB';
                  color = isAns ? '#059669' : '#2563EB';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '36px',
                      borderRadius: '10px',
                      border,
                      background: bg,
                      color,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                    title={`Pregunta ${idx + 1}${isAns ? ' (Respondida)' : ''}${isFlg ? ' (Marcada)' : ''}`}
                  >
                    {idx + 1}
                    {isFlg && (
                      <span style={{ position: 'absolute', top: 2, right: 2, width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leyenda */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.3)', border: '1px solid #10B981' }} />
                <span>Respondida ({answeredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.3)', border: '1px solid #F59E0B' }} />
                <span>Marcada para revisión ({flaggedCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(120, 120, 128, 0.1)', border: '1px solid var(--card-border)' }} />
                <span>Sin responder ({blankCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Confirmación de Entrega */}
        {showConfirmModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ios-glass-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                borderRadius: '24px',
                padding: '24px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                textAlign: 'center'
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Award size={26} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px' }}>
                ¿Deseas entregar tu simulacro?
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                Has respondido <strong>{answeredCount} de 80 preguntas</strong>.<br />
                {blankCount > 0 ? (
                  <span style={{ color: '#D97706', fontWeight: 700 }}>
                    Tienes {blankCount} preguntas sin responder.
                  </span>
                ) : (
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    ¡Completaste todas las 80 preguntas!
                  </span>
                )}
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Seguir resolviendo
                </button>

                <button
                  type="button"
                  onClick={handleFinishExam}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                    color: '#fff',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)'
                  }}
                >
                  Sí, entregar ahora
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Rejilla 1..80 para dispositivos móviles */}
        {showNavSheet && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000155,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ios-glass-card"
              style={{
                width: '100%',
                maxWidth: '420px',
                maxHeight: '85dvh',
                borderRadius: '24px',
                padding: '22px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Rejilla de 80 Preguntas
                </span>
                <button
                  onClick={() => setShowNavSheet(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', paddingRight: '4px' }}>
                {questions.map((_, idx) => {
                  const isAns = userAnswers[idx] !== undefined;
                  const isCur = idx === currentIndex;
                  const isFlg = Boolean(flagged[idx]);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowNavSheet(false);
                      }}
                      style={{
                        height: '38px',
                        borderRadius: '10px',
                        border: isCur ? '2.5px solid #2563EB' : (isAns ? '1px solid #10B981' : (isFlg ? '1px solid #F59E0B' : '1px solid var(--card-border)')),
                        background: isAns ? 'rgba(16, 185, 129, 0.18)' : (isFlg ? 'rgba(245, 158, 11, 0.2)' : 'rgba(120, 120, 128, 0.08)'),
                        color: isAns ? '#059669' : (isFlg ? '#D97706' : 'var(--text-secondary)'),
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // VISTA 3: RESULTADOS, DESGLOSE PONDERADO Y SOLUCIONARIO PASO A PASO
  if (examStage === 'results' && resultsData) {
    const isApproved = (resultsData.unsaWeightedScore || 0) >= 50.0;

    return (
      <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner de Puntaje Oficial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ios-glass-card"
          style={{
            padding: 'clamp(20px, 4vw, 32px)',
            borderRadius: '28px',
            background: 'var(--card-bg)',
            border: '2px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                SIMULACRO FINALIZADO • ÁREA {selectedArea.toUpperCase()}
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                Tu Puntaje Ponderado Oficial UNSA
              </h2>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Calculado según el baremo y pesos oficiales del examen de admisión
              </span>
            </div>

            {/* Score Big Display con AnimatedCounter y Liga RUMBO */}
            <div style={{
              textAlign: 'right',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08))',
              padding: '12px 24px',
              borderRadius: '20px',
              border: '1.5px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 950, color: '#059669', lineHeight: 1, letterSpacing: '-1px' }}>
                <AnimatedCounter value={resultsData.unsaWeightedScore || 0} decimals={4} duration={1400} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  / 100.0000 PUNTOS
                </span>
                {(() => {
                  const assignedLiga = getLigaForScore(resultsData.unsaWeightedScore || 0);
                  return (
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 900,
                        background: assignedLiga.bg,
                        color: assignedLiga.color,
                        border: `1px solid ${assignedLiga.border}`,
                        padding: '2px 10px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: `0 0 10px ${assignedLiga.color}33`
                      }}
                    >
                      <span>{assignedLiga.icon}</span>
                      <span>{assignedLiga.name}</span>
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Estadísticas de Respuestas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', display: 'block' }}>Correctas</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>{resultsData.score} / 80</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', display: 'block' }}>Incorrectas</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#DC2626' }}>{resultsData.wrongCount}</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(120, 120, 128, 0.1)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>En blanco</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{resultsData.blankCount}</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', display: 'block' }}>Tiempo empleado</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563EB' }}>{resultsData.timeSpent}</span>
            </div>
          </div>

          {/* Desglose de Aciertos por Materia */}
          <div style={{
            background: 'rgba(120, 120, 128, 0.05)',
            borderRadius: '20px',
            padding: '16px 20px',
            marginBottom: '24px',
            border: '1px solid var(--card-border)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '10px' }}>
              Rendimiento por Materia en el Examen:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {areaRules.map((rule, idx) => {
                const aciertos = resultsData.aciertosPorAsignatura[rule.asignatura] || 0;
                const total = rule.preguntas;
                const percent = Math.round((aciertos / total) * 100);
                const ptsObtenidos = (aciertos * rule.valor).toFixed(4);
                const ptsPosibles = (total * rule.valor).toFixed(4);

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800 }}>
                      <span style={{ color: 'var(--text-main)' }}>{rule.asignatura}</span>
                      <span style={{ color: aciertos === total ? '#059669' : (aciertos > 0 ? '#2563EB' : '#DC2626') }}>
                        {aciertos}/{total}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      <span>{ptsObtenidos} pts</span>
                      <span>de {ptsPosibles} pts</span>
                    </div>
                    {/* Mini bar */}
                    <div style={{ width: '100%', height: '4px', borderRadius: '99px', background: 'rgba(120, 120, 128, 0.15)', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: percent === 100 ? '#10B981' : (percent > 0 ? '#2563EB' : '#EF4444') }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleStartExam(selectedArea)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw size={16} /> Dar Otro Simulacro
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setShowRankingModal(true)}
                style={{
                  padding: '12px 22px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(245, 158, 11, 0.45)',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.25))',
                  color: '#D97706',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)'
                }}
              >
                <Trophy size={18} color="#F59E0B" /> Ver Mi Puesto en el Ranking
              </motion.button>
            </div>

            {onTransferToCalculator && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onTransferToCalculator(resultsData.aciertosPorAsignatura, selectedArea)}
                style={{
                  padding: '13px 26px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007AFF 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
                }}
              >
                <BarChart3 size={18} /> Ver si alcanzo vacante en mi carrera
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Sección de Revisión de Preguntas con Solucionario Paso a Paso */}
        <div className="ios-glass-card" style={{
          padding: 'clamp(18px, 3vw, 26px)',
          borderRadius: '26px',
          background: 'var(--card-bg)',
          border: '1.5px solid var(--card-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                Revisión Detallada & Solucionario Oficial CEPREUNSA
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Verifica las respuestas correctas y lee la explicación paso a paso de cada pregunta
              </span>
            </div>

            {/* Filtros de Revisión */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: `Todas (80)` },
                { key: 'correct', label: `Correctas (${resultsData.score})` },
                { key: 'wrong', label: `Incorrectas (${resultsData.wrongCount})` },
                { key: 'blank', label: `En blanco (${resultsData.blankCount})` }
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setReviewFilter(f.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    border: reviewFilter === f.key ? 'none' : '1px solid var(--card-border)',
                    background: reviewFilter === f.key ? 'var(--text-main)' : 'rgba(120, 120, 128, 0.08)',
                    color: reviewFilter === f.key ? 'var(--card-bg)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de preguntas revisadas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredReviewDetails.map((item, qIdx) => {
              const isBlank = item.isBlank;
              const isCorrect = item.isCorrect;
              const userLetter = !isBlank && item.userChoice !== null && item.userChoice !== undefined 
                ? (['A','B','C','D','E'][item.userChoice] || String.fromCharCode(65 + item.userChoice)) 
                : '';
              const userOptText = !isBlank && item.options[item.userChoice] !== undefined 
                ? `(${userLetter}) ${cleanOptionText(item.options[item.userChoice])}` 
                : 'Sin responder';
              const correctLetter = item.correctChoice !== undefined && item.correctChoice !== null 
                ? (['A','B','C','D','E'][item.correctChoice] || String.fromCharCode(65 + item.correctChoice)) 
                : '';
              const correctOptText = `(${correctLetter}) ${cleanOptionText(item.options[item.correctChoice]) || 'N.A.'}`;

              const cardBg = isCorrect 
                ? 'rgba(16, 185, 129, 0.06)' 
                : (isBlank ? 'rgba(120, 120, 128, 0.06)' : 'rgba(239, 68, 68, 0.06)');
              const cardBorder = isCorrect 
                ? '1.5px solid rgba(16, 185, 129, 0.3)' 
                : (isBlank ? '1.5px solid rgba(120, 120, 128, 0.2)' : '1.5px solid rgba(239, 68, 68, 0.3)');

              return (
                <div
                  key={qIdx}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '18px',
                    background: cardBg,
                    border: cardBorder
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: 1.45, display: 'block', marginBottom: '4px' }}>
                        {qIdx + 1}. {item.question}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {item.asignatura} {item.valorPonderado ? `• Ponderación: +${item.valorPonderado.toFixed(4)} pts` : ''}
                      </span>
                    </div>

                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: isCorrect 
                        ? 'rgba(16, 185, 129, 0.18)' 
                        : (isBlank ? 'rgba(120, 120, 128, 0.18)' : 'rgba(239, 68, 68, 0.18)'),
                      color: isCorrect ? '#059669' : (isBlank ? 'var(--text-secondary)' : '#DC2626'),
                      flexShrink: 0
                    }}>
                      {isCorrect ? 'CORRECTA' : (isBlank ? 'EN BLANCO' : 'INCORRECTA')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                    <div style={{ color: isCorrect ? '#059669' : (isBlank ? 'var(--text-secondary)' : '#DC2626'), fontWeight: 700 }}>
                      Tu Respuesta: <span style={{ fontWeight: 800 }}>{userOptText}</span>
                    </div>

                    {!isCorrect && (
                      <div style={{ color: '#059669', fontWeight: 700 }}>
                        Respuesta Correcta: <span style={{ fontWeight: 800 }}>{correctOptText}</span>
                      </div>
                    )}

                    {/* Explicación / Solución CEPREUNSA */}
                    {item.explanation && (
                      <div style={{
                        marginTop: '8px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(236, 72, 153, 0.08)',
                        border: '1px solid rgba(236, 72, 153, 0.25)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: 'var(--text-main)',
                        whiteSpace: 'pre-line'
                      }}>
                        <div style={{ fontWeight: 800, color: '#EC4899', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          Solución Oficial CEPREUNSA:
                        </div>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de Ranking Oficial UNSA */}
        <RankingSimulacroModal
          isOpen={showRankingModal}
          onClose={() => setShowRankingModal(false)}
        />
      </div>
    );
  }

  return null;
};
