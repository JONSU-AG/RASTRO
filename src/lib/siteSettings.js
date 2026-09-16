import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_SITE_SETTINGS = {
  autoApproveUploads: true, // Auto-aprobación de aportes activada por defecto
  allowPublicUploads: true,
  requireLoginToDownload: false,
  booksAutoSync: true,
  orsttyEnabled: false, // Asistente ORSTTY desactivado temporalmente por funcionamiento/mantenimiento
  // Elementos predeterminados del sistema ocultados/eliminados por el Administrador:
  // Array de IDs tipo string, ej: ['default_fc_1', 'default_exam_1', 'default_tomo_0']
  hiddenDefaultItems: [],
  // Elementos reportados por estudiantes/comunidad ocultados automáticamente (1 reporte):
  hiddenReportedItems: [],
};

const LOCAL_STORAGE_KEY = 'rastro_site_settings_cached';
const LOCAL_REPORTED_KEY = 'rastro_hidden_reported_items';

// Verifica si un elemento predeterminado está oculto por el admin
export const isDefaultItemHidden = (id, settings = null) => {
  if (!id) return false;
  const current = settings || getCachedSiteSettings();
  const hiddenList = current.hiddenDefaultItems || [];
  return hiddenList.includes(String(id));
};

// Verifica si un elemento (flashcard o pregunta de examen) ha sido reportado y ocultado
export const isReportedItemHidden = (id, settings = null) => {
  if (!id) return false;
  const idStr = String(id);

  // 1. Caché local inmediata (sincrónica en memoria/localStorage)
  try {
    const raw = localStorage.getItem(LOCAL_REPORTED_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.includes(idStr)) return true;
    }
  } catch {}

  // 2. Settings globales (Firestore y caché)
  const current = settings || getCachedSiteSettings();
  const hiddenReported = current.hiddenReportedItems || [];
  return hiddenReported.includes(idStr);
};

// Oculta inmediatamente un elemento reportado (flashcard o pregunta) con 1 reporte
export const hideReportedItem = async (id) => {
  if (!id) return false;
  const idStr = String(id);

  // 1. Guardar de inmediato en localStorage para respuesta instantánea en la sesión activa
  try {
    const raw = localStorage.getItem(LOCAL_REPORTED_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(idStr)) {
      list.push(idStr);
      localStorage.setItem(LOCAL_REPORTED_KEY, JSON.stringify(list));
    }
  } catch {}

  // 2. Persistir en site_settings (Firestore y cachedSiteSettings)
  const current = getCachedSiteSettings();
  const currentHidden = Array.isArray(current.hiddenReportedItems) ? [...current.hiddenReportedItems] : [];
  if (!currentHidden.includes(idStr)) {
    currentHidden.push(idStr);
    await saveSiteSettings({ hiddenReportedItems: currentHidden });
  }
  return true;
};

// Restaura un elemento reportado si el admin decide rehabilitarlo
export const unhideReportedItem = async (id) => {
  if (!id) return false;
  const idStr = String(id);

  try {
    const raw = localStorage.getItem(LOCAL_REPORTED_KEY);
    if (raw) {
      let list = JSON.parse(raw);
      list = list.filter(item => item !== idStr);
      localStorage.setItem(LOCAL_REPORTED_KEY, JSON.stringify(list));
    }
  } catch {}

  const current = getCachedSiteSettings();
  const currentHidden = Array.isArray(current.hiddenReportedItems) ? [...current.hiddenReportedItems] : [];
  if (currentHidden.includes(idStr)) {
    const updated = currentHidden.filter(item => item !== idStr);
    await saveSiteSettings({ hiddenReportedItems: updated });
  }
  return true;
};

// Oculta o desoculta un elemento predeterminado en Firestore y local
export const toggleHideDefaultItem = async (id) => {
  if (!id) return false;
  const current = getCachedSiteSettings();
  const currentHidden = Array.isArray(current.hiddenDefaultItems) ? [...current.hiddenDefaultItems] : [];
  const idStr = String(id);
  
  let updatedHidden;
  if (currentHidden.includes(idStr)) {
    updatedHidden = currentHidden.filter(item => item !== idStr);
  } else {
    updatedHidden = [...currentHidden, idStr];
  }
  
  await saveSiteSettings({ hiddenDefaultItems: updatedHidden });
  return updatedHidden.includes(idStr);
};

export const getCachedSiteSettings = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error loading cached site settings:', e);
  }
  return DEFAULT_SITE_SETTINGS;
};

export const subscribeToSiteSettings = (callback) => {
  try {
    const docRef = doc(db, 'system_config', 'site_settings');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const merged = { ...DEFAULT_SITE_SETTINGS, ...snap.data() };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          callback(merged);
        } else {
          callback(DEFAULT_SITE_SETTINGS);
        }
      },
      (err) => {
        console.warn('Firestore snapshot error for site_settings, using cached:', err);
        callback(getCachedSiteSettings());
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Error subscribing to site settings:', e);
    callback(getCachedSiteSettings());
    return () => {};
  }
};

export const saveSiteSettings = async (newSettings) => {
  const merged = { ...getCachedSiteSettings(), ...newSettings };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  } catch {}
  try {
    const docRef = doc(db, 'system_config', 'site_settings');
    await setDoc(docRef, merged, { merge: true });
  } catch (err) {
    console.warn('Firestore save site_settings error (saved locally):', err);
  }
  return merged;
};
