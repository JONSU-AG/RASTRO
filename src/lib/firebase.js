import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Drive scope requerido para flujo RUMBO por usuario
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

// RUMBO · Configuración Firebase — Proyecto: rumbo-jonsu
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBam3fNnAZ9hwRhpDKcPR_JMo7yHskDcy8",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "rumbo-jonsu.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "rumbo-jonsu",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "rumbo-jonsu.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "432336496806",
  appId: env.VITE_FIREBASE_APP_ID || "1:432336496806:web:12dea10b50433371abac67",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-XV6Y32GBJ9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Permiso: Drive del PROPIO usuario → carpeta RUMBO (NO drive central, NO drive del admin)
googleProvider.addScope(DRIVE_SCOPE);
// Forzar selector de cuenta y consent para obtener refresh del scope drive.file
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);

// Habilitar persistencia offline para lectura ultra-rápida y uso sin conexión
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Múltiples pestañas abiertas, la persistencia offline de Firestore se mantendrá en la pestaña principal.");
    } else if (err.code === 'unimplemented') {
      console.warn("El navegador actual no soporta persistencia IndexedDB.");
    }
  });
} catch (e) {
  console.warn("Firestore offline persistence init:", e);
}

export const storage = getStorage(app);

// ── Helpers Drive OAuth por usuario ──
export const DRIVE_TOKEN_KEY = 'rumbo_drive_token';
export const DRIVE_TOKEN_EXP_KEY = 'rumbo_drive_token_exp';

export const saveDriveToken = (token, expiresIn = 3600) => {
  try {
    if (!token) return;
    sessionStorage.setItem(DRIVE_TOKEN_KEY, token);
    // expiresIn viene en segundos (3600 = 1h)
    const exp = Date.now() + (Number(expiresIn) || 3600) * 1000 - 60000; // margen 1 min
    sessionStorage.setItem(DRIVE_TOKEN_EXP_KEY, String(exp));
  } catch (_) {}
};

export const getStoredDriveToken = () => {
  try {
    const t = sessionStorage.getItem(DRIVE_TOKEN_KEY);
    const exp = Number(sessionStorage.getItem(DRIVE_TOKEN_EXP_KEY) || 0);
    if (!t) return null;
    if (exp && Date.now() > exp) return null; // expirado
    return t;
  } catch (_) { return null; }
};

export const clearDriveToken = () => {
  try {
    sessionStorage.removeItem(DRIVE_TOKEN_KEY);
    sessionStorage.removeItem(DRIVE_TOKEN_EXP_KEY);
  } catch (_) {}
};

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics no soportado en este entorno:", e);
  }
}
export { analytics };

export default app;

