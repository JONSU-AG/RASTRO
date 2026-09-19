import { getCachedSiteSettings, subscribeToSiteSettings } from './siteSettings';

export const ORSTTY_TEMP_KEY = 'rastro_orstty_disabled_temp';
export const ORSTTY_FOREVER_KEY = 'rastro_orstty_disabled_forever';

/**
 * Retorna el estado actual de activación de ORSTTY
 * { enabled: boolean, mode: 'active' | 'temp' | 'forever' | 'system', label: string, description: string }
 */
export const getOrsttyStatus = () => {
  // 1. Desactivación temporal del usuario (sessionStorage - dura solo la sesión actual)
  try {
    if (sessionStorage.getItem(ORSTTY_TEMP_KEY) === 'true') {
      return { 
        enabled: false, 
        mode: 'temp', 
        label: 'Desactivado temporalmente',
        description: 'Oculto durante esta sesión. Volverá a aparecer al reiniciar el navegador.' 
      };
    }
  } catch {}

  // 2. Desactivación permanente del usuario (localStorage - para siempre)
  try {
    if (localStorage.getItem(ORSTTY_FOREVER_KEY) === 'true') {
      return { 
        enabled: false, 
        mode: 'forever', 
        label: 'Desactivado para siempre',
        description: 'Oculto permanentemente en este dispositivo hasta que decidas reactivarlo.' 
      };
    }
  } catch {}

  // 3. Desactivación general del sistema por el Administrador (siteSettings)
  try {
    const siteSettings = getCachedSiteSettings();
    if (siteSettings?.orsttyEnabled === false) {
      return { 
        enabled: false, 
        mode: 'system', 
        label: 'Mantenimiento del Sistema',
        description: 'Pausado globalmente por la administración de RUMBO.' 
      };
    }
  } catch {}

  return { 
    enabled: true, 
    mode: 'active', 
    label: 'Activo',
    description: 'El botón y el asistente están disponibles y visibles normalmente.' 
  };
};

/**
 * Determina si el botón de ORSTTY debe ser visible en la interfaz
 */
export const isOrsttyVisible = (isAdmin = false) => {
  const status = getOrsttyStatus();
  // Si el usuario eligió ocultarlo (temporal o para siempre), se respeta siempre
  if (status.mode === 'temp' || status.mode === 'forever') {
    return false;
  }
  // Si es mantenimiento general del sistema, solo los administradores lo ven
  if (status.mode === 'system') {
    return isAdmin;
  }
  return true;
};

/**
 * Desactiva a ORSTTY temporalmente (sesión) o para siempre (permanente)
 * @param {'temp' | 'forever'} mode 
 */
export const deactivateOrstty = (mode = 'forever') => {
  try {
    if (mode === 'temp') {
      sessionStorage.setItem(ORSTTY_TEMP_KEY, 'true');
      localStorage.removeItem(ORSTTY_FOREVER_KEY);
    } else {
      localStorage.setItem(ORSTTY_FOREVER_KEY, 'true');
      sessionStorage.removeItem(ORSTTY_TEMP_KEY);
    }
  } catch (e) {
    console.warn('Error saving orstty state:', e);
  }
  window.dispatchEvent(new Event('orstty_status_changed'));
};

/**
 * Reactiva a ORSTTY eliminando las marcas de desactivación personal
 */
export const reactivateOrstty = () => {
  try {
    sessionStorage.removeItem(ORSTTY_TEMP_KEY);
    localStorage.removeItem(ORSTTY_FOREVER_KEY);
  } catch (e) {
    console.warn('Error clearing orstty state:', e);
  }
  window.dispatchEvent(new Event('orstty_status_changed'));
};
