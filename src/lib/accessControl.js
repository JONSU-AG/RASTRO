import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const SECTIONS_CONFIG = [
  { id: 'cursos', name: 'Sección General: Cursos', category: 'General' },
  { id: 'esparta', name: 'Academia Esparta', category: 'Academia' },
  { id: 'kelsen', name: 'Academia Kelsen', category: 'Academia' },
  { id: 'briceno', name: 'Academia Briceño', category: 'Academia' }
];

export const DEFAULT_ACCESS_SETTINGS = {
  cursos: {
    status: 'active', // 'active' | 'maintenance' | 'credentials'
    maintenanceMessage: 'La sección de Cursos está temporalmente en mantenimiento por actualización de contenidos. Volveremos pronto.',
    accessUser: '',
    accessPass: '',
    allowAllies: true, // Acceso automático a Aliados Oficiales / Premium
    allowedUsers: [] // correos o uids autorizados individualmente
  },
  esparta: {
    status: 'active',
    maintenanceMessage: 'La Academia Esparta está en mantenimiento temporal. Pronto nuevas clases actualizadas.',
    accessUser: '',
    accessPass: '',
    allowAllies: true,
    allowedUsers: []
  },
  kelsen: {
    status: 'active',
    maintenanceMessage: 'La Academia Kelsen se encuentra en mantenimiento temporal.',
    accessUser: '',
    accessPass: '',
    allowAllies: true,
    allowedUsers: []
  },
  briceno: {
    status: 'active',
    maintenanceMessage: 'La Academia Briceño se encuentra en mantenimiento temporal.',
    accessUser: '',
    accessPass: '',
    allowAllies: true,
    allowedUsers: []
  }
};

const LOCAL_STORAGE_KEY = 'rastro_access_control_settings';

export const getCachedAccessSettings = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ACCESS_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading cached access settings:', e);
  }
  return DEFAULT_ACCESS_SETTINGS;
};

export const subscribeToAccessSettings = (callback) => {
  try {
    const docRef = doc(db, 'system_config', 'access_control');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const merged = { ...DEFAULT_ACCESS_SETTINGS, ...data };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        callback(merged);
      } else {
        callback(DEFAULT_ACCESS_SETTINGS);
      }
    }, (err) => {
      console.warn('Access control snapshot error:', err);
      callback(getCachedAccessSettings());
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Error subscribing to access control:', err);
    callback(getCachedAccessSettings());
    return () => {};
  }
};

export const saveAccessSettings = async (sectionId, newSectionConfig) => {
  const current = getCachedAccessSettings();
  const updated = {
    ...current,
    [sectionId]: {
      ...DEFAULT_ACCESS_SETTINGS[sectionId],
      ...current[sectionId],
      ...newSectionConfig
    }
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  const docRef = doc(db, 'system_config', 'access_control');
  await setDoc(docRef, updated, { merge: true });
  return updated;
};

/**
 * Comprueba si un usuario tiene acceso a una sección o academia específica.
 * @param {string} sectionId - 'cursos' | 'esparta' | 'kelsen' | 'briceno'
 * @param {object} user - objeto user de AuthContext
 * @param {boolean} isAdmin - booleano de si es admin
 * @param {object} settings - configuración de accesos
 * @returns {object} { allowed: boolean, reason: 'none' | 'login_required' | 'maintenance' | 'credentials', message?: string }
 */
export const checkAccessPermission = (sectionId, user, isAdmin, settings = null) => {
  // 1. Administrador siempre tiene acceso total para auditar y ver
  if (isAdmin) {
    return { allowed: true, reason: 'admin' };
  }

  const currentSettings = settings || getCachedAccessSettings();
  const sectionConfig = currentSettings[sectionId] || DEFAULT_ACCESS_SETTINGS[sectionId] || { status: 'active' };

  // Comprobar si los Aliados Oficiales / Premium tienen acceso automático
  const allowAllies = sectionConfig.allowAllies !== false;
  if (allowAllies && user && (user.isAlly || user.isPremiumAlly)) {
    return { allowed: true, reason: 'ally_direct' };
  }

  // Comprobar si el usuario está en la lista de permitidos explícita (por email o UID)
  const isUserExplicitlyAllowed = Boolean(
    user && sectionConfig.allowedUsers && Array.isArray(sectionConfig.allowedUsers) && (
      (user.email && sectionConfig.allowedUsers.some(u => u.trim().toLowerCase() === user.email.trim().toLowerCase())) ||
      (user.uid && sectionConfig.allowedUsers.includes(user.uid))
    )
  );

  // Si está en la lista de permitidos concedida por el admin, tiene acceso directo
  if (isUserExplicitlyAllowed) {
    return { allowed: true, reason: 'allowed_user' };
  }

  // Comprobar si la sección general de cursos está bloqueada por mantenimiento
  if (sectionId !== 'cursos' && currentSettings.cursos?.status === 'maintenance') {
    const cursosAllowed = currentSettings.cursos.allowedUsers || [];
    const isCursosAllowed = user && (
      (user.email && cursosAllowed.some(u => u.trim().toLowerCase() === user.email.trim().toLowerCase())) ||
      (user.uid && cursosAllowed.includes(user.uid))
    );
    if (!isCursosAllowed) {
      return {
        allowed: false,
        reason: 'maintenance',
        message: currentSettings.cursos.maintenanceMessage || 'Los cursos están en mantenimiento temporal.'
      };
    }
  }

  // Comprobar el estado propio de la sección
  if (sectionConfig.status === 'maintenance') {
    return {
      allowed: false,
      reason: 'maintenance',
      message: sectionConfig.maintenanceMessage || 'Esta sección se encuentra temporalmente en mantenimiento. Volveremos pronto.'
    };
  }

  if (sectionConfig.status === 'credentials') {
    // Verificar si ya ingresó correctamente las credenciales en esta sesión
    try {
      const sessionKey = `rastro_cred_verified_${sectionId}`;
      const savedPass = sessionStorage.getItem(sessionKey);
      if (savedPass && sectionConfig.accessPass && savedPass === sectionConfig.accessPass) {
        return { allowed: true, reason: 'credentials_session' };
      }
    } catch {}

    return {
      allowed: false,
      reason: 'credentials',
      sectionName: SECTIONS_CONFIG.find(s => s.id === sectionId)?.name || sectionId,
      hasUserPassConfigured: Boolean(sectionConfig.accessUser && sectionConfig.accessPass)
    };
  }

  return { allowed: true, reason: 'active' };
};

export const verifyCredentialsForSection = (sectionId, inputUser, inputPass, settings = null) => {
  const currentSettings = settings || getCachedAccessSettings();
  const sectionConfig = currentSettings[sectionId];
  if (!sectionConfig) return false;

  const validUser = (sectionConfig.accessUser || '').trim();
  const validPass = (sectionConfig.accessPass || '').trim();

  if (!validPass) return false; // si no hay clave configurada

  const matchUser = validUser ? (inputUser || '').trim() === validUser : true;
  const matchPass = (inputPass || '').trim() === validPass;

  if (matchUser && matchPass) {
    try {
      sessionStorage.setItem(`rastro_cred_verified_${sectionId}`, validPass);
    } catch {}
    return true;
  }

  return false;
};
