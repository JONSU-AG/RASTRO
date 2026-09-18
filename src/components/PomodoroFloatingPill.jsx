import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoro } from '../context/PomodoroContext';
import { Play, Pause } from 'lucide-react';

export const PomodoroFloatingPill = () => {
  const { isRunning, isOpen, timeLeft, activeMode, openModal, togglePlay, progressRatio } = usePomodoro();

  // Si está pausado/detenido O el modal ya está abierto, el mini flotante NO aparece
  if (!isRunning || isOpen) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.75, y: 30 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26, mass: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '20px',
          zIndex: 89900,
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={openModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Dynamic Island Pill Container con Vidrio iOS Esmerilado */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: `1.5px solid ${activeMode.color}77`,
            padding: '8px 16px 8px 12px',
            borderRadius: '999px',
            boxShadow: `0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px ${activeMode.color}35`,
            color: '#FFFFFF'
          }}
        >
          {/* Indicador de Modo y Resplandor Animado */}
          <div
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${activeMode.color}33 0%, rgba(15, 23, 42, 0.9) 100%)`,
              border: `1px solid ${activeMode.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              {activeMode.iconEmoji || '⏱️'}
            </motion.span>

            {/* Punto verde pulsante de actividad tipo iOS */}
            <span
              style={{
                position: 'absolute',
                top: '-1px',
                right: '-1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
                border: '1.5px solid #0F172A'
              }}
            />
          </div>

          {/* Información y Temporizador en Vivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'monospace, system-ui',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF'
                }}
              >
                {formattedTime}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: activeMode.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {activeMode.name}
              </span>
            </div>

            {/* Micro barra de progreso */}
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressRatio * 100}%`,
                  height: '100%',
                  background: activeMode.color,
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Botón rápido de pausa integrado con área táctil cómoda iOS */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.stopPropagation();
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(12);
              }
              togglePlay();
            }}
            title="Pausar / Reanudar Pomodoro"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '6px',
              flexShrink: 0
            }}
          >
            <Pause size={13} fill="#FFFFFF" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
