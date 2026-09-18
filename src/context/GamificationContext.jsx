import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { subscribeToSiteSettings, getCachedSiteSettings } from '../lib/siteSettings';

const GamificationContext = createContext(null);

const STORAGE_KEY = 'rastro_gamification_v1';

// Sintetizador de audio nativo Web Audio API (cero dependencias externas de red, ultra-rápido)
const playNativeAudioEffect = (type) => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'correct') {
      // Arpegio ascendente cristalino (Do5 -> Sol5 -> Do6)
      const notes = [523.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    } else if (type === 'wrong') {
      // Tono suave descendente (error educativo sin estridencia)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'victory') {
      // Fanfarria de victoria (estilo Duolingo al terminar lección)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.82);
      });
    }
  } catch (err) {
    console.warn('Audio feedback notice:', err);
  }
};

export const GamificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [maxLives, setMaxLives] = useState(() => {
    const cached = getCachedSiteSettings();
    return Number(cached?.maxGamificationLives) || 200;
  });

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => {
      if (s?.maxGamificationLives !== undefined) {
        setMaxLives(Number(s.maxGamificationLives) || 200);
      }
    });
    return () => unsub?.();
  }, []);

  const [state, setState] = useState(() => {
    const initialDefaultLives = 200;
    if (typeof window === 'undefined') {
      return {
        streak: 0,
        lastActiveDate: null,
        streakFreeze: 1,
        xp: 0,
        hearts: initialDefaultLives,
        completedLessons: {},
        unlockedNodes: ['node_0']
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Si el usuario tenía los 5 corazones viejos del hardcodeo anterior, ascenderlo al nuevo default de 200
        if (parsed.hearts === 5 || parsed.hearts === undefined) {
          parsed.hearts = initialDefaultLives;
        }
        return parsed;
      }
    } catch {}
    return {
      streak: 1, // Primer día de bienvenida
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakFreeze: 1,
      xp: 50,
      hearts: initialDefaultLives,
      completedLessons: {},
      unlockedNodes: ['node_0']
    };
  });

  // Guardar en localStorage inmediatamente ante cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // Sincronización en la nube con Firestore cuando hay usuario activo
  useEffect(() => {
    if (!user?.uid) return;

    const syncWithCloud = async () => {
      try {
        const docRef = doc(db, 'usuarios', user.uid, 'gamificacion', 'rastro_progress');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const cloudData = snap.data();
          setState(prev => ({
            ...prev,
            xp: Math.max(prev.xp, cloudData.xp || 0),
            streak: Math.max(prev.streak, cloudData.streak || 0),
            completedLessons: { ...cloudData.completedLessons, ...prev.completedLessons },
            unlockedNodes: Array.from(new Set([...(cloudData.unlockedNodes || []), ...prev.unlockedNodes]))
          }));
        } else {
          await setDoc(docRef, state, { merge: true });
        }
      } catch (e) {
        console.warn('Cloud gamification sync error:', e);
      }
    };

    syncWithCloud();
  }, [user?.uid]);

  // Cálculo del nivel actual basado en XP ($Nivel = \lfloor XP / 100 \rfloor + 1$)
  const level = Math.floor((state.xp || 0) / 100) + 1;
  const currentLevelProgress = (state.xp || 0) % 100;

  // Registrar lección completada con actualización de racha y celebración
  const recordLessonCompletion = useCallback(async (lessonId, gainedXp, stars = 3) => {
    const today = new Date().toISOString().split('T')[0];

    // Celebración visual y háptica
    playNativeAudioEffect('victory');
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setState(prev => {
      // Cálculo de racha diaria
      let newStreak = prev.streak || 0;
      if (!prev.lastActiveDate) {
        newStreak = 1;
      } else if (prev.lastActiveDate !== today) {
        const lastDate = new Date(prev.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          // Si tiene congelador de racha, mantenerla
          if (prev.streakFreeze > 0) {
            newStreak = prev.streak;
          } else {
            newStreak = 1;
          }
        }
      }

      const updatedCompleted = {
        ...prev.completedLessons,
        [lessonId]: {
          stars,
          completedAt: Date.now()
        }
      };

      const newState = {
        ...prev,
        xp: (prev.xp || 0) + gainedXp,
        streak: newStreak,
        lastActiveDate: today,
        hearts: maxLives, // Recupera corazones al completar lección
        completedLessons: updatedCompleted
      };

      // Si el usuario está autenticado, respaldar en Firestore
      if (user?.uid) {
        try {
          const docRef = doc(db, 'usuarios', user.uid, 'gamificacion', 'rastro_progress');
          setDoc(docRef, newState, { merge: true });
        } catch {}
      }

      return newState;
    });
  }, [user?.uid, maxLives]);

  // Perder un corazón ante error
  const loseHeart = useCallback(() => {
    playNativeAudioEffect('wrong');
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(80);
    }
    setState(prev => ({
      ...prev,
      hearts: Math.max(0, (prev.hearts !== undefined ? prev.hearts : maxLives) - 1)
    }));
  }, [maxLives]);

  // Respuesta correcta
  const triggerSuccessFeedback = useCallback(() => {
    playNativeAudioEffect('correct');
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
  }, []);

  // Añadir experiencia directamente (cofres, logros, bonus)
  const addXp = useCallback((amount) => {
    setState(prev => ({
      ...prev,
      xp: (prev.xp || 0) + (Number(amount) || 0)
    }));
  }, []);

  // Desbloquear un nuevo nodo del mapa
  const unlockNode = useCallback((nodeId) => {
    setState(prev => ({
      ...prev,
      unlockedNodes: Array.from(new Set([...(prev.unlockedNodes || []), nodeId]))
    }));
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        ...state,
        maxLives,
        hearts: state.hearts !== undefined ? state.hearts : maxLives,
        level,
        currentLevelProgress,
        recordLessonCompletion,
        addXp,
        loseHeart,
        triggerSuccessFeedback,
        unlockNode,
        refillHearts: () => setState(prev => ({ ...prev, hearts: maxLives }))
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification debe usarse dentro de un GamificationProvider');
  }
  return context;
};
