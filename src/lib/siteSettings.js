import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_SITE_SETTINGS = {
  autoApproveUploads: true, // Auto-aprobación de aportes activada por defecto
  allowPublicUploads: true,
  requireLoginToDownload: false,
  booksAutoSync: true,
  // Elementos predeterminados del sistema ocultados/eliminados por el Administrador:
  // Array de IDs tipo string, ej: ['default_fc_1', 'default_exam_1', 'default_tomo_0']
  hiddenDefaultItems: [],
};

// Verifica si un elemento predeterminado está oculto por el admin
export const isDefaultItemHidden = (id, settings = null) => {
  if (!id) return false;
  const current = settings || getCachedSiteSettings();
  const hiddenList = current.hiddenDefaultItems || [];
  return hiddenList.includes(String(id));
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

const LOCAL_STORAGE_KEY = 'rastro_site_settings_cached';

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
