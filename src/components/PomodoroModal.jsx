import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Plus,
  Sliders,
  Repeat,
  Music,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { OrsttyMascot } from './Mascots';
import { soundEngine, SOUND_CATALOG } from '../lib/soundEffects';

const MODES = {
  study: {
    id: 'study',
    name: 'Estudio UNSA',
    duration: 25 * 60, // 25 min
    color: '#A855F7',
    icon: Brain,
    tip: '¡Cero distracciones! Concéntrate en resolver preguntas o repasar teoría.'
  },
  shortBreak: {
    id: 'shortBreak',
    name: 'Descanso Corto',
    duration: 5 * 60, // 5 min
    color: '#10B981',
    icon: Coffee,
    tip: 'Estira las piernas, bebe un sorbo de agua y descansa la vista.'
  },
  longBreak: {
    id: 'longBreak',
    name: 'Descanso Largo',
    duration: 15 * 60, // 15 min
    color: '#38BDF8',
    icon: Sparkles,
    tip: '¡Excelente bloque completado! Desconecta y recarga energías para la siguiente sesión.'
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    duration: 60, // 1 min inicial por defecto
    color: '#F59E0B',
    icon: Sliders,
    tip: '¡Configura el tiempo exacto en minutos o segundos que prefieras para estudiar o probar!'
  }
};

export const PomodoroModal = ({ isOpen, onClose }) => {
  const [activeModeKey, setActiveModeKey] = useState('study');
  const [timeLeft, setTimeLeft] = useState(MODES.study.duration);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(2); // 2 segundos iniciales para prueba rápida
  const [isRunning, setIsRunning] = useState(false);
  const [autoCycle, setAutoCycle] = useState(true); // Modo automático
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Selector de sonido de alarma (24 opciones gratuitas de hasta 4s)
  const [selectedSoundId, setSelectedSoundId] = useState(() => {
    return localStorage.getItem('rastro_pomodoro_sound') || 'campana_zen';
  });
  const [showSoundSelector, setShowSoundSelector] = useState(false);
  const [soundCategoryFilter, setSoundCategoryFilter] = useState('Todos');
  const [previewingId, setPreviewingId] = useState(null);

  const activeMode = MODES[activeModeKey];
  const timerRef = useRef(null);

  // Reproducir sonido configurado al finalizar
  const playAlarmSound = () => {
    if (!soundEnabled) return;
    soundEngine.play(selectedSoundId);
  };

  const handlePreviewSound = (soundId, e) => {
    if (e) e.stopPropagation();
    setPreviewingId(soundId);
    soundEngine.play(soundId);
    setTimeout(() => {
      setPreviewingId((prev) => (prev === soundId ? null : prev));
    }, 2800);
  };

  const handleSelectSound = (soundId) => {
    setSelectedSoundId(soundId);
    localStorage.setItem('rastro_pomodoro_sound', soundId);
    soundEngine.play(soundId);
  };

  // Bucle del Temporizador
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playAlarmSound();

            // Al terminar la sesión de Estudio / Personalizada
            if (activeModeKey === 'study' || activeModeKey === 'custom') {
              setCompletedCycles((c) => c + 1);

              if (autoCycle) {
                const nextMode = (completedCycles + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
                setActiveModeKey(nextMode);
                setIsRunning(true);
                return MODES[nextMode].duration;
              } else {
                setIsRunning(false);
                return 0;
              }
            } else {
              // Al terminar el Descanso -> Volver al Estudio
              if (autoCycle) {
                setActiveModeKey('study');
                setIsRunning(true);
                return MODES.study.duration;
              } else {
                setIsRunning(false);
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, activeModeKey, completedCycles, autoCycle, soundEnabled, selectedSoundId]);

  // Cambiar de modo
  const handleSelectMode = (modeKey) => {
    setIsRunning(false);
    setActiveModeKey(modeKey);
    if (modeKey === 'custom') {
      const totalSecs = Math.max(1, (parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0));
      setTimeLeft(totalSecs);
    } else {
      setTimeLeft(MODES[modeKey].duration);
    }
  };

  // Aplicar tiempo personalizado exacto
  const applyCustomTime = (mins, secs) => {
    const validMins = Math.max(0, parseInt(mins) || 0);
    const validSecs = Math.max(0, Math.min(59, parseInt(secs) || 0));
    const total = Math.max(1, validMins * 60 + validSecs);
    setCustomMinutes(validMins);
    setCustomSeconds(validSecs);
    setActiveModeKey('custom');
    setIsRunning(false);
    setTimeLeft(total);
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (activeModeKey === 'custom') {
      const totalSecs = Math.max(1, (parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0));
      setTimeLeft(totalSecs);
    } else {
      setTimeLeft(activeMode.duration);
    }
  };

  const handleAddFiveMinutes = () => {
    setTimeLeft((prev) => prev + 300);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentMaxDuration = activeModeKey === 'custom'
    ? Math.max(1, (parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0))
    : activeMode.duration;

  const progress = Math.min(1, Math.max(0, (currentMaxDuration - timeLeft) / currentMaxDuration));
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const currentSound = SOUND_CATALOG.find((s) => s.id === selectedSoundId) || SOUND_CATALOG[0];

  const filteredSounds = soundCategoryFilter === 'Todos'
    ? SOUND_CATALOG
    : SOUND_CATALOG.filter((s) => s.category === soundCategoryFilter);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          padding: 'clamp(8px, 2.5vw, 16px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '94vh',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, rgba(26, 20, 56, 0.98) 0%, rgba(13, 17, 36, 0.99) 100%)',
            border: `2px solid ${activeMode.color}77`,
            borderRadius: '28px',
            boxShadow: `0 24px 70px rgba(0,0,0,0.85), 0 0 35px ${activeMode.color}33`,
            color: '#FFFFFF',
            padding: 'clamp(16px, 3.5vw, 22px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Cabecera */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: `${activeMode.color}22`,
                  border: `1.5px solid ${activeMode.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Timer size={20} color={activeMode.color} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: activeMode.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  TÉCNICA POMODORO & ESTUDIO
                </span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#FFFFFF' }}>
                  Temporizador Pro RASTRO
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '6px',
                  color: soundEnabled ? '#FBBF24' : '#64748B',
                  cursor: 'pointer'
                }}
                title={soundEnabled ? 'Sonidos activados' : 'Sonidos silenciados'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={onClose}
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
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Selector de Modos Responsive (Grid 2x2 para evitar recortes en móvil) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '6px',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '14px',
              width: '100%'
            }}
          >
            {Object.values(MODES).map((mode) => {
              const isSelected = activeModeKey === mode.id;
              const IconComp = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleSelectMode(mode.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${mode.color}` : '1px solid transparent',
                    background: isSelected ? mode.color : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 900 : 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease',
                    boxShadow: isSelected ? `0 4px 14px ${mode.color}44` : 'none'
                  }}
                >
                  <IconComp size={14} />
                  <span>{mode.name}</span>
                </button>
              );
            })}
          </div>

          {/* PANEL DE PERSONALIZACIÓN RESPONSIVE */}
          {activeModeKey === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                borderRadius: '18px',
                padding: '14px',
                marginBottom: '14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ⚙️ Definir Duración Exacta
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Total: {formatTime((parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0))}
                </span>
              </div>

              {/* Controles Stepper + - para móvil */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {/* Minutos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => applyCustomTime(Math.max(0, parseInt(customMinutes || 0) - 1), customSeconds)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => applyCustomTime(e.target.value, customSeconds)}
                      style={{
                        width: '54px',
                        background: 'rgba(0,0,0,0.45)',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        padding: '6px 4px',
                        textAlign: 'center',
                        fontWeight: 950,
                        fontSize: '1rem'
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>min</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyCustomTime(parseInt(customMinutes || 0) + 1, customSeconds)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontWeight: 950, fontSize: '1.4rem', color: '#FBBF24' }}>:</span>

                {/* Segundos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => applyCustomTime(customMinutes, Math.max(0, parseInt(customSeconds || 0) - 5))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSeconds}
                      onChange={(e) => applyCustomTime(customMinutes, e.target.value)}
                      style={{
                        width: '54px',
                        background: 'rgba(0,0,0,0.45)',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        padding: '6px 4px',
                        textAlign: 'center',
                        fontWeight: 950,
                        fontSize: '1rem'
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>seg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyCustomTime(customMinutes, Math.min(59, parseInt(customSeconds || 0) + 5))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones rápidos en grid responsive */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))',
                  gap: '6px'
                }}
              >
                {[
                  { label: '⚡ 2s Test', m: 0, s: 2 },
                  { label: '30 seg', m: 0, s: 30 },
                  { label: '1 min', m: 1, s: 0 },
                  { label: '5 min', m: 5, s: 0 },
                  { label: '15 min', m: 15, s: 0 },
                  { label: '25 min', m: 25, s: 0 },
                  { label: '45 min', m: 45, s: 0 },
                  { label: '60 min', m: 60, s: 0 }
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyCustomTime(preset.m, preset.s)}
                    style={{
                      padding: '5px 4px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#CBD5E1',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Círculo de Cuenta Regresiva SVG */}
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={activeMode.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                  filter: `drop-shadow(0 0 8px ${activeMode.color})`
                }}
              />
            </svg>

            {/* Texto Central */}
            <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.7rem', fontWeight: 950, letterSpacing: '-1px', color: '#FFFFFF', lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 900, color: activeMode.color, marginTop: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isRunning ? '• En marcha' : 'Pausado'}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                Ciclos hoy: {completedCycles}
              </span>
            </div>
          </div>

          {/* BOTÓN SELECTOR DE SONIDO DE ALARMA (24 OPCIONES GRATUITAS) */}
          <div
            style={{
              width: '100%',
              margin: '8px 0',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={() => setShowSoundSelector(!showSoundSelector)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.35rem' }}>{currentSound.icon}</span>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 900, textTransform: 'uppercase', display: 'block', letterSpacing: '0.04em' }}>
                  Sonido de Alarma ({SOUND_CATALOG.length} opciones)
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {currentSound.name} <span style={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700 }}>• {currentSound.duration}</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={(e) => handlePreviewSound(selectedSoundId, e)}
                style={{
                  background: previewingId === selectedSoundId ? '#10B981' : 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '8px',
                  padding: '5px 9px',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {previewingId === selectedSoundId ? '🔊 Sonando...' : '▶ Probar'}
              </button>
              <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                {showSoundSelector ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </div>

          {/* CATÁLOGO DESPLEGABLE DE 24 SONIDOS */}
          {/* CATÁLOGO DESPLEGABLE DE 24 SONIDOS (RESPONSIVE & TOUCH-FRIENDLY) */}
          <AnimatePresence>
            {showSoundSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  background: 'rgba(10, 14, 28, 0.97)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '18px',
                  padding: '14px 12px 10px',
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
                }}
              >
                {/* Filtros de Categoría con scroll táctil suave y altura garantizada */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    overflowX: 'auto',
                    paddingBottom: '10px',
                    marginBottom: '8px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0,
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none'
                  }}
                >
                  {['Todos', 'Relajantes', 'Cósmicos', 'Enérgicos', 'Clásicos', 'Alegres'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSoundCategoryFilter(cat)}
                      style={{
                        padding: '6px 12px',
                        minHeight: '30px',
                        borderRadius: '999px',
                        border: soundCategoryFilter === cat ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.15)',
                        background: soundCategoryFilter === cat ? 'rgba(56, 189, 248, 0.28)' : 'rgba(255,255,255,0.06)',
                        color: soundCategoryFilter === cat ? '#38BDF8' : '#CBD5E1',
                        fontSize: '0.74rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Lista de Sonidos Responsive */}
                <div
                  style={{
                    maxHeight: '210px',
                    minHeight: '120px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    paddingRight: '4px',
                    scrollbarWidth: 'thin'
                  }}
                >
                  {filteredSounds.map((sound) => {
                    const isSelected = selectedSoundId === sound.id;
                    const isPlaying = previewingId === sound.id;
                    return (
                      <div
                        key={sound.id}
                        onClick={() => handleSelectSound(sound.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '12px',
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isSelected ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{sound.icon}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 900, color: isSelected ? '#38BDF8' : '#FFFFFF', whiteSpace: 'nowrap' }}>
                                {sound.name}
                              </span>
                              <span style={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 700 }}>• {sound.duration}</span>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sound.description}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => handlePreviewSound(sound.id, e)}
                            style={{
                              background: isPlaying ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '8px',
                              padding: '5px 9px',
                              color: '#FFFFFF',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isPlaying ? '🔊 Sonando' : '▶ Probar'}
                          </button>
                          {isSelected && <Check size={16} color="#38BDF8" strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOGGLE MODO AUTOMÁTICO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 14px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Repeat size={16} color={autoCycle ? '#10B981' : '#94A3B8'} />
              <div>
                <span style={{ fontSize: '0.76rem', fontWeight: 900, color: '#FFFFFF', display: 'block' }}>
                  Modo Automático (Ciclo continuo)
                </span>
                <span style={{ fontSize: '0.66rem', color: '#94A3B8' }}>
                  Alterna estudio y descanso al sonar la campana
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoCycle(!autoCycle)}
              style={{
                width: '42px',
                height: '22px',
                borderRadius: '999px',
                background: autoCycle ? '#10B981' : 'rgba(255,255,255,0.2)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                padding: '2px'
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  transform: autoCycle ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }}
              />
            </button>
          </div>

          {/* Botones de Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={handleReset}
              title="Reiniciar bloque"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={18} />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              style={{
                padding: '12px 30px',
                borderRadius: '18px',
                border: 'none',
                background: `linear-gradient(135deg, ${activeMode.color} 0%, #4C1D95 100%)`,
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 8px 24px ${activeMode.color}55`
              }}
            >
              {isRunning ? <Pause size={20} fill="#FFFFFF" /> : <Play size={20} fill="#FFFFFF" />}
              <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddFiveMinutes}
              title="+5 Minutos"
              style={{
                padding: '0 12px',
                height: '42px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Plus size={15} /> 5m
            </button>
          </div>

          {/* Consejo con ORSTTY Oficial */}
          <div
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '18px',
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <OrsttyMascot size={46} mood={isRunning ? 'pensativo' : 'feliz'} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#E2E8F0', lineHeight: 1.35 }}>
              {activeMode.tip}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
