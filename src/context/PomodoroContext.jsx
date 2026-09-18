import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine, SOUND_CATALOG } from '../lib/soundEffects';

const PomodoroContext = createContext(null);

export const POMODORO_MODES = {
  study: {
    id: 'study',
    name: 'Estudio UNSA',
    duration: 25 * 60, // 25 min
    color: '#A855F7',
    iconEmoji: '🧠',
    tip: '¡Cero distracciones! Concéntrate en resolver preguntas o repasar teoría.'
  },
  shortBreak: {
    id: 'shortBreak',
    name: 'Descanso Corto',
    duration: 5 * 60, // 5 min
    color: '#10B981',
    iconEmoji: '☕',
    tip: 'Estira las piernas, bebe un sorbo de agua y descansa la vista.'
  },
  longBreak: {
    id: 'longBreak',
    name: 'Descanso Largo',
    duration: 15 * 60, // 15 min
    color: '#38BDF8',
    iconEmoji: '✨',
    tip: '¡Excelente bloque completado! Desconecta y recarga energías para la siguiente sesión.'
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    duration: 60, // 1 min inicial por defecto
    color: '#F59E0B',
    iconEmoji: '⚙️',
    tip: '¡Configura el tiempo exacto en minutos o segundos que prefieras para estudiar o probar!'
  }
};

const DEFAULT_SOUNDS_BY_MODE = {
  study: 'campana_zen',
  shortBreak: 'pajaros_bosque',
  longBreak: 'piano_cosmico',
  custom: 'flauta_andina'
};

const SOUNDS_STORAGE_KEY = 'rastro_pomodoro_sounds_by_mode_v1';

export const PomodoroProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModeKey, setActiveModeKey] = useState('study');
  const [timeLeft, setTimeLeft] = useState(POMODORO_MODES.study.duration);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(5); // 5 segundos para pruebas rápidas
  const [isRunning, setIsRunning] = useState(false);
  const [autoCycle, setAutoCycle] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sonido INDIVIDUAL para cada sección/modo de Pomodoro (Estudio, Descanso Corto, Descanso Largo, Personalizado)
  const [soundsByMode, setSoundsByMode] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUNDS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SOUNDS_BY_MODE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SOUNDS_BY_MODE;
  });

  // Guardar cambios de sonidos individuales en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SOUNDS_STORAGE_KEY, JSON.stringify(soundsByMode));
    } catch {}
  }, [soundsByMode]);

  // Obtener sonido actual del modo activo
  const currentSoundId = soundsByMode[activeModeKey] || DEFAULT_SOUNDS_BY_MODE[activeModeKey] || 'campana_zen';

  const setSoundForCurrentMode = useCallback((soundId) => {
    setSoundsByMode(prev => ({
      ...prev,
      [activeModeKey]: soundId
    }));
  }, [activeModeKey]);

  const setSoundForSpecificMode = useCallback((modeKey, soundId) => {
    setSoundsByMode(prev => ({
      ...prev,
      [modeKey]: soundId
    }));
  }, []);

  const playSoundForMode = useCallback((modeKey) => {
    if (!soundEnabled) return;
    const soundId = soundsByMode[modeKey] || DEFAULT_SOUNDS_BY_MODE[modeKey] || 'campana_zen';
    soundEngine.play(soundId);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 300]);
    }
  }, [soundEnabled, soundsByMode]);

  const switchMode = useCallback((modeKey) => {
    setActiveModeKey(modeKey);
    setIsRunning(false);
    if (modeKey === 'custom') {
      const duration = customMinutes * 60 + customSeconds;
      setTimeLeft(duration > 0 ? duration : 60);
    } else {
      setTimeLeft(POMODORO_MODES[modeKey]?.duration || 25 * 60);
    }
  }, [customMinutes, customSeconds]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (activeModeKey === 'custom') {
      const duration = customMinutes * 60 + customSeconds;
      setTimeLeft(duration > 0 ? duration : 60);
    } else {
      setTimeLeft(POMODORO_MODES[activeModeKey]?.duration || 25 * 60);
    }
  }, [activeModeKey, customMinutes, customSeconds]);

  const togglePlay = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const addSeconds = useCallback((secs) => {
    setTimeLeft(prev => Math.max(0, prev + secs));
  }, []);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  // Tick principal del temporizador persistente en segundo plano
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Sonar alarma configurada individualmente para ESTE modo
          playSoundForMode(activeModeKey);

          if (autoCycle) {
            if (activeModeKey === 'study') {
              const nextCycles = completedCycles + 1;
              setCompletedCycles(nextCycles);
              const nextMode = nextCycles % 4 === 0 ? 'longBreak' : 'shortBreak';
              setActiveModeKey(nextMode);
              return POMODORO_MODES[nextMode].duration;
            } else {
              // Fin de descanso -> volver a Estudio
              setActiveModeKey('study');
              return POMODORO_MODES.study.duration;
            }
          } else {
            setIsRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, autoCycle, activeModeKey, completedCycles, playSoundForMode]);

  const activeMode = POMODORO_MODES[activeModeKey] || POMODORO_MODES.study;
  const currentModeDuration = activeModeKey === 'custom' 
    ? (customMinutes * 60 + customSeconds || 60)
    : activeMode.duration;
  const progressRatio = currentModeDuration > 0 ? Math.min(1, Math.max(0, 1 - timeLeft / currentModeDuration)) : 0;

  return (
    <PomodoroContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        toggleModal,
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
        setSoundForSpecificMode,
        playSoundForMode,
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
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro debe usarse dentro de un PomodoroProvider');
  }
  return context;
};
