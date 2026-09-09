import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_SITE_TEXTS = {
  // Inicio / Hero
  home_welcome_badge: '¡BIENVENIDO A RASTRO!',
  home_hero_title_prefix: 'Tu camino hacia',
  home_hero_subtitle: 'Plataforma creada para acompañar tu preparación académica preuniversitaria. Organizada y centralizada en un solo lugar.',
  home_legal_title: 'Plataforma de Libre Acceso Académico',
  home_legal_desc: 'RASTRO recopila recursos académicos de acceso abierto. Los materiales pertenecen a sus respectivos autores.',
  home_courses_title: 'Explora el Contenido Preuniversitario',
  home_courses_subtitle: 'Accede a materiales organizados por academias y asignaturas.',
  
  // Biblioteca
  biblio_title: 'Biblioteca Digital de Recursos',
  biblio_subtitle: 'Tomos, libros y bancos de preguntas oficiales compartidos por estudiantes y docentes.',
  biblio_tab_docs: 'Documentos Oficiales',
  biblio_tab_community: 'Aportes de la Comunidad',
  biblio_tab_books: '📚 Libros y Colecciones',
  biblio_upload_prompt: 'Comparte libros, prácticas o carpetas con la comunidad estudiantil',

  // Libros & Colecciones
  books_section_title: 'Colecciones de Libros & Tomos',
  books_section_desc: 'Explora colecciones completas organizadas por editorial y materia con vista previa y descarga.',
  books_empty_title: '📚 Próximamente',
  books_empty_desc: 'Estamos preparando colecciones de libros para esta sección.',

  // Simulador
  simulador_title: 'Simulador de Exámenes UNSA',
  simulador_subtitle: 'Entrena con preguntas tipo admisión, cronómetro y cálculo de puntajes.',

  // Footer & General
  footer_text: 'RASTRO — Plataforma académica colaborativa de preparación preuniversitaria.',
  footer_disclaimer: 'Recursos compartidos con fines estrictamente formativos y educativos.',
};

const LOCAL_STORAGE_KEY = 'rastro_site_texts_cached';

export const getCachedSiteTexts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SITE_TEXTS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading cached site texts:', e);
  }
  return DEFAULT_SITE_TEXTS;
};

export const subscribeToSiteTexts = (callback) => {
  try {
    const docRef = doc(db, 'system_config', 'site_texts');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const merged = { ...DEFAULT_SITE_TEXTS, ...snap.data() };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          callback(merged);
        } else {
          callback(DEFAULT_SITE_TEXTS);
        }
      },
      (err) => {
        console.warn('Firestore site_texts snapshot error, using cached:', err);
        callback(getCachedSiteTexts());
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Error subscribing to site texts:', e);
    callback(getCachedSiteTexts());
    return () => {};
  }
};

export const saveSiteTexts = async (updatedTexts) => {
  const merged = { ...getCachedSiteTexts(), ...updatedTexts };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  } catch {}
  try {
    const docRef = doc(db, 'system_config', 'site_texts');
    await setDoc(docRef, merged, { merge: true });
  } catch (err) {
    console.warn('Firestore save site_texts error (persisted locally):', err);
  }
  return merged;
};

// React Hook
export const useSiteTexts = () => {
  const [texts, setTexts] = useState(getCachedSiteTexts);

  useEffect(() => {
    const unsub = subscribeToSiteTexts((latest) => {
      setTexts(latest);
    });
    return () => unsub();
  }, []);

  const getText = (key, fallback = '') => {
    if (texts && texts[key] !== undefined && texts[key] !== null && texts[key] !== '') {
      return texts[key];
    }
    if (fallback) return fallback;
    return DEFAULT_SITE_TEXTS[key] || '';
  };

  return { texts, getText, saveTexts: saveSiteTexts };
};
