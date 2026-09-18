import React, { useState, useRef } from 'react';
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
import { usePomodoro, POMODORO_MODES } from '../context/PomodoroContext';

export const PomodoroModal = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const context = usePomodoro();

  // Permite controlar desde contexto global o desde props de compatibilidad
  const isModalOpen = propIsOpen !== undefined ? propIsOpen : context.isOpen;
  const handleClose = propOnClose !== undefined ? propOnClose : context.closeModal;

  const {
    activeModeKey,
    activeMode,
    timeLeft,
    isRunning,
    autoCycle,
    setAutoCycle,
    completedCycles,
    soundEnabled,
    setSoundEnabled,
    soundsByMode,
    currentSoundId,
    setSoundForCurrentMode,
    switchMode,
    togglePlay,
    resetTimer,
    addSeconds,
    customMinutes,
    setCustomMinutes,
    customSeconds,
    setCustomSeconds,
    currentModeDuration,
    progressRatio
  } = context;

  // Selector desplegable de sonido de alarma
  const [showSoundSelector, setShowSoundSelector] = useState(false);
  const [soundCategoryFilter, setSoundCategoryFilter] = useState('Todos');
  const [previewingId, setPreviewingId] = useState(null);

  // Formato mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentSoundObj = SOUND_CATALOG.find((s) => s.id === currentSoundId) || SOUND_CATALOG[0];

  const categories = ['Todos', 'Relajantes', 'Cósmicos', 'Enérgicos', 'Clásicos', 'Alegres'];

  const filteredSounds =
    soundCategoryFilter === 'Todos'
      ? SOUND_CATALOG
      : SOUND_CATALOG.filter((s) => s.category === soundCategoryFilter);

  const handlePreviewSound = (soundId, e) => {
    if (e) e.stopPropagation();
    setPreviewingId(soundId);
    soundEngine.play(soundId);
    setTimeout(() => {
      setPreviewingId((prev) => (prev === soundId ? null : prev));
    }, 2800);
  };

  const handleSelectSound = (soundId) => {
    setSoundForCurrentMode(soundId);
    soundEngine.play(soundId);
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90000,
          background: 'rgba(2, 6, 23, 0.82)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '460px',
            maxHeight: '92vh',
            overflowY: 'auto',
            background: 'linear-gradient(165deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1.5px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '28px',
            padding: '24px 20px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.25)',
            color: '#F8FAFC',
            position: 'relative'
          }}
        >
          {/* HEADER DEL MODAL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC'
                }}
              >
                <Timer size={20} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#C084FC',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  Técnica Pomodoro & Estudio
                </span>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    margin: 0,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Temporizador Pro RASTRO
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Toggle de sonido */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Silenciar alarmas' : 'Activar alarmas'}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: soundEnabled ? 'rgba(245, 158, 11, 0.18)' : 'rgba(148, 163, 184, 0.15)',
                  border: soundEnabled
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid rgba(148, 163, 184, 0.3)',
                  color: soundEnabled ? '#FBBF24' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </motion.button>

              {/* Botón Cerrar */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleClose}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>

          {/* SELECTOR DE MODOS (TABS DE ESTUDIO / DESCANSO / PERSONALIZADO) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            {Object.values(POMODORO_MODES).map((mode) => {
              const isSelected = activeModeKey === mode.id;
              const IconComponent =
                mode.id === 'study'
                  ? Brain
                  : mode.id === 'shortBreak'
                  ? Coffee
                  : mode.id === 'longBreak'
                  ? Sparkles
                  : Sliders;

              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => switchMode(mode.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 8px',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${mode.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected
                      ? `linear-gradient(135deg, ${mode.color}40 0%, ${mode.color}15 100%)`
                      : 'rgba(15, 23, 42, 0.6)',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 0 16px ${mode.color}35` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <IconComponent size={16} color={isSelected ? mode.color : '#94A3B8'} />
                  <span>{mode.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* CUADRO DEL TEMPORIZADOR CIRCULAR CON SVG Y TIEMPO DIGITAL */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: '10px 0 20px'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '210px',
                height: '210px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Anillo de fondo */}
              <svg width="210" height="210" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="105"
                  cy="105"
                  r="92"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="105"
                  cy="105"
                  r="92"
                  stroke={activeMode.color}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 92}
                  strokeDashoffset={2 * Math.PI * 92 * (1 - progressRatio)}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: `drop-shadow(0 0 12px ${activeMode.color})`,
                    transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease'
                  }}
                />
              </svg>

              {/* Tiempo Central y Estado */}
              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <motion.span
                  key={formattedTime}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  style={{
                    fontFamily: 'monospace, system-ui',
                    fontSize: '2.8rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    lineHeight: 1
                  }}
                >
                  {formattedTime}
                </motion.span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: activeMode.color,
                    marginTop: '6px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  {isRunning ? 'EN PROCESO' : 'PAUSADO'}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                  Ciclos hoy: {completedCycles}
                </span>
              </div>
            </div>
          </div>

          {/* AJUSTES PARA MODO PERSONALIZADO */}
          {activeModeKey === 'custom' && !isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px dashed #F59E0B',
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#FBBF24" />
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FDE047' }}>
                  Ajuste personalizado:
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setCustomMinutes(val);
                    }}
                    style={{
                      width: '48px',
                      padding: '4px 6px',
                      borderRadius: '8px',
                      background: '#0F172A',
                      border: '1px solid #F59E0B',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSeconds}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                      setCustomSeconds(val);
                    }}
                    style={{
                      width: '44px',
                      padding: '4px 6px',
                      borderRadius: '8px',
                      background: '#0F172A',
                      border: '1px solid #F59E0B',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>s</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SELECTOR DE SONIDO INDIVIDUAL POR SECCIÓN */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: `1.5px solid ${activeMode.color}55`,
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setShowSoundSelector(!showSoundSelector)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>{currentSoundObj.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        color: activeMode.color,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Sonido Alarma • {activeMode.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        color: '#94A3B8'
                      }}
                    >
                      Individual
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {currentSoundObj.name}{' '}
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                      • {currentSoundObj.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handlePreviewSound(currentSoundId, e)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Play size={11} fill="#38BDF8" /> Probar
                </motion.button>
                {showSoundSelector ? <ChevronUp size={18} color="#94A3B8" /> : <ChevronDown size={18} color="#94A3B8" />}
              </div>
            </div>

            {/* LISTA DESPLEGABLE DE LOS 24 SONIDOS DISPONIBLES (CON SCROLL FLUIDO) */}
            {showSoundSelector && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Categorías deslizables */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    marginBottom: '10px',
                    scrollbarWidth: 'none',
                    minHeight: '34px',
                    alignItems: 'center'
                  }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSoundCategoryFilter(cat)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border:
                          soundCategoryFilter === cat
                            ? `1.5px solid ${activeMode.color}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        background:
                          soundCategoryFilter === cat ? `${activeMode.color}35` : 'rgba(15, 23, 42, 0.8)',
                        color: soundCategoryFilter === cat ? '#FFFFFF' : '#94A3B8',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid con scroll de opciones */}
                <div
                  style={{
                    maxHeight: '190px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    paddingRight: '4px'
                  }}
                >
                  {filteredSounds.map((sound) => {
                    const isSelected = currentSoundId === sound.id;
                    const isPreviewing = previewingId === sound.id;

                    return (
                      <div
                        key={sound.id}
                        onClick={() => handleSelectSound(sound.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '10px',
                          border: isSelected
                            ? `1.5px solid ${activeMode.color}`
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          background: isSelected ? `${activeMode.color}22` : 'rgba(30, 41, 59, 0.4)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{sound.icon}</span>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                              {sound.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                              {sound.category} • {sound.duration}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={(e) => handlePreviewSound(sound.id, e)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              background: isPreviewing ? '#10B981' : 'rgba(255, 255, 255, 0.08)',
                              color: '#FFFFFF',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            {isPreviewing ? 'Sonando...' : 'Oír'}
                          </button>
                          {isSelected && <Check size={16} color={activeMode.color} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* CICLO AUTOMÁTICO TOGGLE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Repeat size={18} color="#38BDF8" />
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Modo Automático (Ciclo continuo)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Alterna estudio y descanso al sonar la campana
                </div>
              </div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoCycle}
                onChange={(e) => setAutoCycle(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: autoCycle ? '#10B981' : '#334155',
                  borderRadius: '24px',
                  transition: 'background 0.25s ease'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: autoCycle ? '20px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              </span>
            </label>
          </div>

          {/* BOTONES PRINCIPALES DE CONTROL 3D (REINICIAR / PLAY / +5M) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            {/* Reiniciar */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={resetTimer}
              title="Reiniciar contador"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={20} />
            </motion.button>

            {/* Iniciar / Pausar */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={togglePlay}
              className="duo-btn-3d"
              style={{
                flex: 1,
                maxWidth: '200px',
                padding: '14px 20px',
                borderRadius: '18px',
                border: 'none',
                background: isRunning
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                boxShadow: isRunning ? '0 5px 0 #991B1B' : '0 5px 0 #581C87',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={20} fill="#FFFFFF" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="#FFFFFF" />
                  <span>Iniciar</span>
                </>
              )}
            </motion.button>

            {/* +5 Minutos */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => addSeconds(5 * 60)}
              title="Sumar 5 minutos"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              + 5m
            </motion.button>
          </div>

          {/* CONSEJO DE ORSTTY */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '16px',
              padding: '10px 14px'
            }}
          >
            <OrsttyMascot size={46} mood={isRunning ? 'pensativo' : 'feliz'} />
            <span style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.35 }}>
              {activeMode.tip}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
