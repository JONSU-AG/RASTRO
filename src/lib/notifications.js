// Sistema de Notificaciones de Sistema / PWA y En-App con Audio Sintetizado y Audio Externo
// Compatible con Android Web Push, Service Worker y Web Audio API (100% gratuito y sin dependencias externas)

const STORAGE_KEYS = {
  NOTIFICATIONS_ENABLED: 'rumbo_notifications_enabled',
  SOUND_ENABLED: 'rumbo_notifications_sound_enabled',
  VIBRATE_ENABLED: 'rumbo_notifications_vibrate_enabled',
  SELECTED_SOUND: 'rumbo_notifications_sound_type'
};

let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

// Generador de sonidos limpios y profesionales usando Web Audio API sin necesidad de descargar archivos pesados
export function playNotificationSound(type) {
  try {
    const soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';
    if (!soundEnabled) return;

    const chosenType = type || localStorage.getItem(STORAGE_KEYS.SELECTED_SOUND) || 'pop';

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (chosenType === 'pop') {
      // Sonido "Burbuja Pop" corto y sutil (predeterminado)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (chosenType === 'bell') {
      // Campana de academia / éxito
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now); // Nota A5
      osc2.frequency.setValueAtTime(1760, now); // Armónico A6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } else {
      // 'chime' por defecto - Tono moderno de dos notas cristalinas (estilo iOS/Android heads-up)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Primera nota (E6 ~ 1318 Hz)
      osc1.frequency.setValueAtTime(1318.5, now);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Segunda nota (A6 ~ 1760 Hz) un instante después
      osc2.frequency.setValueAtTime(1760, now + 0.1);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);
    }
  } catch (err) {
    console.warn('Audio notification notice:', err);
  }
}

// Comprueba estado actual de soporte y permisos
export function getNotificationStatus() {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const permission = isSupported ? Notification.permission : 'unsupported';
  const isEnabledLocally = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) === 'true';
  const soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';
  const vibrateEnabled = localStorage.getItem(STORAGE_KEYS.VIBRATE_ENABLED) !== 'false';
  const soundType = localStorage.getItem(STORAGE_KEYS.SELECTED_SOUND) || 'pop';

  return {
    isSupported,
    permission,
    isEnabled: isSupported && permission === 'granted' && isEnabledLocally,
    soundEnabled,
    vibrateEnabled,
    soundType
  };
}

// Activa o solicita permisos en el dispositivo Android / PWA
export async function requestSystemNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, reason: 'not_supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
      return { success: true, permission: 'granted' };
    } else {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
      return { success: false, permission };
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return { success: false, error };
  }
}

// Desactiva notificaciones en configuración de la app
export function disableSystemNotifications() {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
}

// Configuración de preferencias
export function setNotificationSettings({ sound, vibrate, soundType }) {
  if (sound !== undefined) localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(sound));
  if (vibrate !== undefined) localStorage.setItem(STORAGE_KEYS.VIBRATE_ENABLED, String(vibrate));
  if (soundType !== undefined) localStorage.setItem(STORAGE_KEYS.SELECTED_SOUND, soundType);
}

// Disparar una notificación nativa emergente al sistema Android / Navegador
export async function triggerSystemNotification({
  title = 'Rumbo',
  body = 'Tienes una nueva actualización',
  icon = '/assets/LOGOR.png',
  data = {},
  tag = 'rumbo-alert'
}) {
  const status = getNotificationStatus();

  // 1. Reproducir sonido si está habilitado
  if (status.soundEnabled) {
    playNotificationSound(status.soundType);
  }

  // 2. Vibración háptica en móvil
  if (status.vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([150, 80, 150]);
    } catch {
      // Ignorar si el navegador bloquea vibración por interacción
    }
  }

  // Si no tiene permisos del sistema, no lanzamos el pop-up de Android (la app igual puede mostrar su pop-up interno)
  if (!status.isSupported || Notification.permission !== 'granted' || !status.isEnabled) {
    return false;
  }

  try {
    // Si tenemos Service Worker activo (típico en PWA instalada en Android)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: '/assets/LOGOR.png',
          silent: true, // Silencia el tono nativo por defecto del teléfono Android
          vibrate: status.vibrateEnabled ? [200, 100, 200] : undefined,
          tag,
          renotify: true,
          data: {
            url: data.url || '/',
            ...data
          }
        });
        return true;
      }
    }

    // Fallback con Notification API estándar del navegador
    const n = new Notification(title, {
      body,
      icon,
      silent: true, // Silencia el tono nativo por defecto del teléfono Android
      tag
    });
    n.onclick = () => {
      window.focus();
      if (data.url) {
        window.location.href = data.url;
      }
      n.close();
    };
    return true;
  } catch (err) {
    console.warn('Could not launch system notification:', err);
    return false;
  }
}
