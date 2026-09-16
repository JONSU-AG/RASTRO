import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Layers, 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  Minus, 
  Plus, 
  Sparkles, 
  PlusCircle, 
  X, 
  CheckCircle, 
  BookOpen,
  RotateCcw,
  Target,
  Award,
  Zap,
  Flame,
  Check,
  Flag,
  Trash2,
  Edit3,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Maximize2,
  Eye,
  EyeOff,
  Clock,
  Shuffle,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { InspirationalDailyBanner } from '../components/InspirationalDailyBanner';
import { datosSimulador, DEFAULT_FLASHCARDS, DEFAULT_EXAM_QUESTIONS as examData, calculateExamScore, normalizeAsignatura } from '../data/simuladorData';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ReportModal } from '../components/ReportModal';
import { subscribeToSiteSettings, toggleHideDefaultItem, isDefaultItemHidden, isReportedItemHidden, hideReportedItem, getCachedSiteSettings } from '../lib/siteSettings';
import { SimulacroOficialExam } from '../components/SimulacroOficialExam';
import { SimuladorSelect } from '../components/SimuladorSelect';

export const cleanOptionText = (text) => {
  if (!text) return '';
  let cleaned = String(text).trim();
  cleaned = cleaned.replace(/^([A-Ea-e1-5])[\.\)\-\:\s]+/, '');
  return cleaned.trim();
};

export const normalizeAnswerIndex = (ans, options = null) => {
  if (ans === undefined || ans === null) return 0;

  // 1. Si se pasa el arreglo de opciones y ans coincide con el texto de alguna opción
  if (Array.isArray(options) && typeof ans === 'string') {
    const cleanAns = cleanOptionText(ans).toLowerCase();
    const foundIdx = options.findIndex(opt => {
      const cleanOpt = cleanOptionText(opt).toLowerCase();
      return cleanOpt === cleanAns || cleanOpt === String(ans).trim().toLowerCase();
    });
    if (foundIdx !== -1) return foundIdx;
  }

  // 2. Si ya es un número
  if (typeof ans === 'number') {
    if (Array.isArray(options) && ans > options.length - 1 && ans <= options.length) {
      return ans - 1; // Ajuste si se guardó 1-indexado (ej. 1 a 5)
    }
    return Math.max(0, ans);
  }

  const str = String(ans).trim().toUpperCase();

  // 3. Buscar letra A, B, C, D, E
  const letterMatch = str.match(/([A-E])/);
  if (letterMatch && (str.length <= 8 || str.includes('CLAVE') || str.includes('OPCI') || str.includes('RESPUESTA'))) {
    const char = letterMatch[1];
    if (char === 'A') return 0;
    if (char === 'B') return 1;
    if (char === 'C') return 2;
    if (char === 'D') return 3;
    if (char === 'E') return 4;
  }

  // 4. Buscar número directo en string '0', '1', '2', '3', '4'
  const parsed = parseInt(str, 10);
  if (!isNaN(parsed)) {
    if (Array.isArray(options) && parsed > options.length - 1 && parsed <= options.length) {
      return parsed - 1;
    }
    return Math.max(0, parsed);
  }

  return 0;
};

export const isTheoryQuickCard = (qText, aText = '', subject = '') => {
  if (!qText) return false;
  const q = String(qText).trim();
  const qLower = q.toLowerCase();
  const a = String(aText || '').trim();
  const aLower = a.toLowerCase();
  const sub = String(subject || '').toLowerCase();

  // 1. Longitud adecuada para una flashcard (enunciado completo con contexto propio)
  if (q.length < 12 || q.length > 110) return false;
  if (q.includes('\n')) return false;

  // 2. Mínimo 4 palabras en el enunciado
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length < 4) return false;

  // 3. Materias puramente conceptuales (excluir cálculo numérico y aptitud verbal de series/analogías)
  const excludedSubjects = [
    'álgebra', 'algebra', 
    'aritmética', 'aritmetica', 
    'geometría', 'geometria', 
    'trigonometría', 'trigonometria', 
    'raz. mat', 'razonamiento mat',
    'raz. lógico', 'razonamiento lógico',
    'matemática', 'matematica',
    'lectura', 'comp. lectora', 'comprensión lectora',
    'raz. verbal', 'razonamiento verbal'
  ];
  if (excludedSubjects.some(s => sub.includes(s))) {
    return false;
  }

  // 4. Palabras clave de ejercicios matemáticos, problemas físicos, vectores y figuras
  const exerciseKeywords = [
    'calcule', 'calcular', 'calcula', 'calculo',
    'halle', 'hallar', 'halla',
    'resuelva', 'resolver', 'simplifique', 'simplificar',
    'opere', 'operar', 'despeje', 'despejar',
    'determine el valor', 'hallar el valor',
    'un móvil', 'un movil', 'un proyectil', 'un bloque', 'un tren', 'un auto', 'un coche',
    'se lanza', 'parte del reposo', 'recorre una distancia', 'plano inclinado',
    'vector', 'módulo', 'modulo', 'resultante',
    'm/s', 'km/h', 'cm/s', 'm/s2', 'm/s²', 'm/s^2', 'rad/s',
    'newtons', 'joules', 'watts', 'pascales', 'ohmios',
    'mol/l', 'mg/l', 'g/ml', '0,', '0.',
    'en la figura', 'del gráfico', 'del grafico', 'figura adjunta', 'siguiente figura', 'imagen', 'observado', 'adjunt',
    'el valor de x', 'el valor de y', 'el valor numérico',
    'cuánto mide', 'cuánto vale', 'cuánto tiempo', 'cuántos metros', 'cuántos segundos',
    'pirámide', 'piramide', 'núclido', 'nuclido', 'esquema', 'mapa', 'en el mapa', 'del mapa'
  ];
  if (exerciseKeywords.some(kw => qLower.includes(kw))) {
    return false;
  }

  // 5. CERO Verdadero o Falso (ni en la pregunta ni como respuesta)
  const vfKeywords = ['verdader', 'fals', '(v)', '(f)', 'v o f', 'v/f', 'verdad'];
  if (vfKeywords.some(k => qLower.includes(k)) || /\b[vf]{2,5}\b/i.test(qLower)) return false;
  if (
    aLower === 'verdadero' || aLower === 'falso' || 
    aLower === 'v' || aLower === 'f' || 
    aLower.startsWith('verdader') || aLower.startsWith('fals') ||
    /^[vf\s\-\,\.]+$/i.test(aLower)
  ) {
    return false;
  }

  // 6. CERO "Marca la incorrecta", falsedades o excepciones (LA PREGUNTA DEBE ENSEÑAR LA VERDAD)
  const incorrectOrNegativeKw = [
    'incorrect', 'marca la incorrecta', 'marque la incorrecta', 'afirmación incorrecta',
    'enunciado incorrecto', 'opción incorrecta', 'alternativa incorrecta', 'proposición incorrecta',
    'falsa', 'falso', 'no corresponde', 'no pertenece', 'no es correcto', 'no es correcta',
    'no constituye', 'no representa', 'no se relaciona', 'no presenta', 'no contiene',
    'no puede', 'no debe', 'no es una', 'no es un', 'excepto', 'salvo', 'contradice', 'incompatible'
  ];
  if (incorrectOrNegativeKw.some(k => qLower.includes(k))) return false;
  if (/\bno\s+(es|corresponde|pertenece|constituye|presenta|describe|guarda|forma|se|debe|puede)\b/i.test(q)) return false;

  // 7. CERO dependencias de alternativas (preguntas que sólo tienen sentido si ves A, B, C, D, E)
  const optionDependentKw = [
    'cuál de los siguientes', 'cuál de las siguientes', 'cual de los siguientes', 'cual de las siguientes',
    'de los siguientes', 'de las siguientes', 'cuál de estos', 'cuál de estas',
    'alternativa', 'opción', 'opcion', 'señale la', 'señala la', 'indique la', 'indica la',
    'marque la', 'marca la', 'seleccione la', 'selecciona la', 'identifique la', 'identifica la',
    'en cuál', 'en cual', 'qué oración', 'que oracion', 'cuál oración', 'cual oracion', 'oración que', 'oracion que',
    'representación correcta', 'representacion correcta'
  ];
  if (optionDependentKw.some(k => qLower.includes(k))) return false;

  // 8. CERO Ordenamiento, Secuencias, Cronología, Relaciones o Proposiciones múltiples
  const orderKeywords = [
    'relacion', 'relacione', 'relacionar', 'orden', 'ordene', 'ordenar', 
    'secuencia', 'cronolog', 'emparejar', 'asociar', 'columna',
    'proposicion', 'afirmacion', 'enunciado', 'es correcto:', 'son correctas', 
    'cuáles de', 'cuantos de', 'cuantas de', 'solo i', 'solo ii', 'solo iii'
  ];
  if (orderKeywords.some(k => qLower.includes(k))) return false;
  if (/\b(I|II|III|IV|V)\b/.test(q)) return false;

  // 9. CERO oraciones con espacios en blanco para rellenar (ej. "____")
  if (q.includes('___') || q.includes('…')) return false;

  // 10. CERO comprensión lectora dependiente de un texto o párrafo externo no visible
  const readingTextKw = [
    'según el texto', 'de acuerdo al texto', 'del texto se', 'en el texto', 
    'el autor del texto', 'en el fragmento', 'del fragmento', 'párrafo', 'parrafo',
    'what can we infer', 'in the text', 'according to the text', 'in the passage',
    'el autor concluye', 'el tono general', 'la expresión “', 'la expresión "',
    'tipo de texto', 'estructura del texto'
  ];
  if (readingTextKw.some(k => qLower.includes(k))) return false;

  // 11. Validaciones estrictas sobre la respuesta (debe ser una sola respuesta rápida, directa y verdadera)
  if (a) {
    // Entre 2 y 40 caracteres (término, concepto, autor o ley puntual)
    if (a.length < 2 || a.length > 40) return false;

    // Descartar si contiene punto y coma, guiones de separación o explicaciones extensas
    if (a.includes(';') || a.includes('–') || a.includes('- ') || a.includes(' -')) return false;
    if (aLower.startsWith('because') || aLower.startsWith('porque') || aLower.startsWith('debido a') || aLower.startsWith('dado que')) return false;

    // Descartar si la respuesta es una combinación de alternativas, números o relación
    if (/\b(solo|sólo)\s+(i|ii|iii|iv|v|1|2|3)\b/i.test(aLower)) return false;
    if (/\b(i|ii|iii|iv|v)\s*(y|,|e|-)\s*(i|ii|iii|iv|v)\b/i.test(aLower)) return false;
    if (/\b\d+\s*,\s*\d+/i.test(aLower) || /\b\d+\s+y\s+\d+/i.test(aLower)) return false;
    if (/\b\d+[a-e]\b/i.test(aLower) || /\b[a-e]\d+\b/i.test(aLower) || /\bI[a-e]\b/i.test(aLower)) return false;
    if (/[a-e]\s*[-–]\s*\d+/i.test(aLower) || /\d+\s*[-–]\s*[a-e]/i.test(aLower)) return false;
    if (/\b(todas|ninguna|todas son|ninguna de las|todas las anteriores)\b/i.test(aLower)) return false;
  }

  // 12. Expresiones algebraicas numéricas o ecuaciones
  if (/[a-zA-Z0-9]\s*=\s*[a-zA-Z0-9]/.test(q) || /\d+\s*[+\-*/^]\s*\d+/.test(q)) {
    return false;
  }

  // 13. Presencia excesiva de números (propio de problemas con datos numéricos)
  const numbersCount = (q.match(/\d+/g) || []).length;
  if (numbersCount >= 3) {
    return false;
  }

  return true;
};


// Alias para compatibilidad
export const isTheoryQuestion = isTheoryQuickCard;

function formatNum(n) {
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(4)).toString();
}

const AREA_CONFIG = {
  'Sociales': {
    name: 'Ciencias Sociales',
    badge: 'Sociales',
    activeGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    activeShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
    border: 'rgba(245, 158, 11, 0.45)',
    tint: 'rgba(245, 158, 11, 0.1)',
    accent: '#F59E0B',
    accentDark: '#B45309'
  },
  'Ingenierías': {
    name: 'Ingenierías',
    badge: 'Ingenierías',
    activeGradient: 'linear-gradient(135deg, #007AFF 0%, #2563EB 100%)',
    activeShadow: '0 8px 24px rgba(0, 122, 255, 0.4)',
    border: 'rgba(0, 122, 255, 0.45)',
    tint: 'rgba(0, 122, 255, 0.1)',
    accent: '#007AFF',
    accentDark: '#1D4ED8'
  },
  'Biomédicas': {
    name: 'Biomédicas',
    badge: 'Biomédicas',
    activeGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    activeShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
    border: 'rgba(16, 185, 129, 0.45)',
    tint: 'rgba(16, 185, 129, 0.1)',
    accent: '#10B981',
    accentDark: '#047857'
  }
};

const getCategoryStyle = (curso) => {
  const c = curso.toLowerCase();
  if (c.includes('aptitud') || c.includes('lógico') || c.includes('verbal')) {
    return {
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      lightBg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.35)',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      color: '#2563EB'
    };
  }
  if (c.includes('matemática') || c.includes('álgebra') || c.includes('aritmética') || c.includes('geometría') || c.includes('trigonometría')) {
    return {
      icon: '📐',
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      lightBg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.35)',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      color: '#059669'
    };
  }
  if (c.includes('ciencia') || c.includes('física') || c.includes('química') || c.includes('biología')) {
    return {
      icon: '🔬',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      lightBg: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.35)',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      color: '#DB2777'
    };
  }
  return {
    icon: '🏛️',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    lightBg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    color: '#D97706'
  };
};

export const Simulador = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('puntaje'); // Default to puntaje to show user
  const tabsNavRef = useRef(null);
  const [reportData, setReportData] = useState({ isOpen: false, targetId: null, targetTitle: '', targetType: 'flashcard' });
  const [siteSettings, setSiteSettings] = useState(getCachedSiteSettings);
  const [reportedItemIds, setReportedItemIds] = useState(() => {
    try {
      const raw = localStorage.getItem('rastro_hidden_reported_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Subscribe to site settings for hidden default items
  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSiteSettings(s));
    return () => unsub();
  }, []);

  // Soporte de desplazamiento horizontal con rueda del mouse y auto-centrado de pestaña activa
  useEffect(() => {
    const el = tabsNavRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.85;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    if (tabsNavRef.current) {
      const activeBtn = tabsNavRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);
  
  // Flashcards state
  const [firestoreCards, setFirestoreCards] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Todos');
  const [cardSearch, setCardSearch] = useState('');
  const [cardAuthorFilter, setCardAuthorFilter] = useState('todos');
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [newCard, setNewCard] = useState({ q: '', a: '', subject: 'Biología', imageUrl: '' });
  const [cardImageUploading, setCardImageUploading] = useState(false);
  const [cardImageProgress, setCardImageProgress] = useState(0);
  const [creating, setCreating] = useState(false);

  // Subscribe to community flashcards
  useEffect(() => {
    try {
      const q = query(collection(db, 'flashcards'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setFirestoreCards(docs);
        }
      }, (err) => {
        console.warn("Flashcards listener error:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not subscribe to flashcards:", e);
    }
  }, []);

  const handleSaveFlashcard = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newCard.q.trim() || !newCard.a.trim() || creating) return;

    if (!isTheoryQuickCard(newCard.q.trim(), newCard.a.trim(), newCard.subject)) {
      alert("Las flashcards son exclusivamente para teoría con una sola respuesta directa. No se permiten ejercicios, preguntas de verdadero/falso ni relaciones de orden.");
      return;
    }

    setCreating(true);
    try {
      const cardPayload = {
        q: newCard.q.trim(),
        a: newCard.a.trim(),
        subject: newCard.subject,
        imageUrl: (newCard.imageUrl || '').trim()
      };

      if (editingCardId) {
        const isDefault = DEFAULT_FLASHCARDS.some(fc => String(fc.id) === String(editingCardId)) || String(editingCardId).startsWith('default_fc_');
        if (isDefault) {
          // Si era predeterminada, la ocultamos y creamos un aporte con los datos editados
          const defaultId = String(editingCardId).startsWith('default_fc_') ? String(editingCardId) : `default_fc_${editingCardId}`;
          await toggleHideDefaultItem(defaultId);
          await addDoc(collection(db, 'flashcards'), {
            ...cardPayload,
            authorName: user?.displayName || 'Administrador RASTRO',
            authorUid: user?.uid || null,
            createdAt: serverTimestamp()
          });
        } else {
          // Edit existing Firestore card
          await updateDoc(doc(db, 'flashcards', editingCardId), cardPayload);
        }
      } else {
        // Create new card
        await addDoc(collection(db, 'flashcards'), {
          ...cardPayload,
          authorName: user?.displayName || 'Estudiante RASTRO',
          authorUid: user?.uid || null,
          createdAt: serverTimestamp()
        });
      }
      setNewCard({ q: '', a: '', subject: 'Biología', imageUrl: '' });
      setEditingCardId(null);
      setIsCreateOpen(false);
    } catch (err) {
      alert("Error al guardar tarjeta: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEditFlashcard = (card) => {
    setEditingCardId(card.id);
    setNewCard({ 
      q: card.q || '', 
      a: card.a || '', 
      subject: card.subject || 'Biología',
      imageUrl: card.imageUrl || card.img || ''
    });
    setIsCreateOpen(true);
  };

  // Exam Questions State (Community + CEPREUNSA Oficial + Defaults)
  const [cepreQuestions, setCepreQuestions] = useState([]);
  const [isCepreLoading, setIsCepreLoading] = useState(false);

  // Integración de banco CEPREUNSA a Flashcards (solo teoría de una sola respuesta directa)
  const cepreFlashcards = useMemo(() => {
    if (!cepreQuestions || cepreQuestions.length === 0) return [];

    // Filtrar exclusivamente preguntas teóricas, directas y con respuesta puntual (sin V/F, sin orden)
    const shortCepre = cepreQuestions.filter(item => {
      const fcId = `cepre_fc_${item.id}`;
      if (reportedItemIds.includes(fcId) || isReportedItemHidden(fcId, siteSettings)) return false;

      const q = (item.q || '').trim();
      const asig = item.asignatura || item.subject || item.curso || '';
      const ansIdx = typeof item.answer === 'number' ? item.answer : 0;
      const optRaw = Array.isArray(item.options) ? item.options[ansIdx] : '';
      const optClean = cleanOptionText(optRaw);

      return isTheoryQuickCard(q, optClean, asig);
    });

    return shortCepre.map(item => {
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const correctLetter = letters[item.answer] || '';
      const optionText = item.options?.[item.answer] ? cleanOptionText(item.options[item.answer]) : '';

      return {
        id: `cepre_fc_${item.id}`,
        q: item.q.trim(),
        a: optionText, // Respuesta rápida directa y limpia
        claveLetra: correctLetter,
        subject: normalizeAsignatura(item.asignatura || item.subject || item.curso || 'General'),
        options: item.options,
        answer: item.answer,
        imageUrl: item.imageUrl || item.img || '',
        authorName: 'Banco CEPREUNSA',
        authorUid: 'cepreunsa'
      };
    });
  }, [cepreQuestions, reportedItemIds, siteSettings]);

  const communityCards = useMemo(() => {
    return [...firestoreCards, ...cepreFlashcards, ...DEFAULT_FLASHCARDS];
  }, [firestoreCards, cepreFlashcards]);

  // Group Flashcards Authors for filtering
  const flashcardAuthors = useMemo(() => {
    const map = {};
    communityCards.forEach(c => {
      const name = c.authorName || 'Comunidad RASTRO';
      const key = c.authorUid ? c.authorUid : name;
      if (!map[key]) {
        map[key] = { key, name };
      }
    });
    return Object.values(map);
  }, [communityCards]);

  const filteredCards = useMemo(() => {
    return communityCards.filter(c => {
      // Excluir si ha sido reportada (con 1 solo reporte se deja de mostrar)
      if (reportedItemIds.includes(String(c.id)) || isReportedItemHidden(c.id, siteSettings)) {
        return false;
      }

      // Exclusivamente teoría con respuesta directa y rápida (sin V/F, sin orden, sin ejercicios)
      const qClean = (c.q || '').trim();
      const aClean = (c.a || '').trim();
      if (!qClean || !aClean) return false;

      if (!isTheoryQuickCard(qClean, aClean, c.subject)) {
        return false;
      }

      // Si es una tarjeta predeterminada y el admin la ha ocultado, se excluye
      const isDefault = DEFAULT_FLASHCARDS.some(fc => String(fc.id) === String(c.id)) || String(c.id).startsWith('default_fc_');
      if (isDefault) {
        const defaultId = String(c.id).startsWith('default_fc_') ? String(c.id) : `default_fc_${c.id}`;
        if (isDefaultItemHidden(defaultId, siteSettings)) {
          return false;
        }
      }

      const matchSubject = selectedSubject === 'Todos' || c.subject === selectedSubject;
      const qText = qClean.toLowerCase();
      const aText = (c.a || '').toLowerCase();
      const sText = (c.subject || '').toLowerCase();
      const authorText = (c.authorName || '').toLowerCase();
      const search = cardSearch.toLowerCase().trim();
      const matchSearch = !search || qText.includes(search) || aText.includes(search) || sText.includes(search) || authorText.includes(search);
      
      const authorKey = c.authorUid ? c.authorUid : (c.authorName || 'Comunidad RASTRO');
      const matchAuthor = cardAuthorFilter === 'todos' || authorKey === cardAuthorFilter;

      return matchSubject && matchSearch && matchAuthor;
    });
  }, [communityCards, selectedSubject, cardSearch, cardAuthorFilter, siteSettings, reportedItemIds]);

  const activeCardIndex = Math.min(currentCard, Math.max(0, filteredCards.length - 1));

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const [communityExamQuestions, setCommunityExamQuestions] = useState(examData);
  const [examSearch, setExamSearch] = useState('');
  const [examAuthorFilter, setExamAuthorFilter] = useState('todos');
  const [examAsignaturaFilter, setExamAsignaturaFilter] = useState('todas');
  const [examSemanaFilter, setExamSemanaFilter] = useState('todas');
  const [examMode, setExamMode] = useState('simulacro'); // 'simulacro' (60), 'rapido' (15), 'todo' (todas)
  const [customRapidoCount, setCustomRapidoCount] = useState(15);
  const [examShuffleSeed, setExamShuffleSeed] = useState(0);
  const [examTimerSeconds, setExamTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userExamAnswers, setUserExamAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [examResultsModal, setExamResultsModal] = useState({ 
    isOpen: false, 
    score: 0, 
    total: 0, 
    wrongCount: 0, 
    blankCount: 0, 
    unsaWeightedScore: 0, 
    percentage: 0, 
    aciertosPorAsignatura: {}, 
    details: [],
    elapsedTime: '00:00'
  });
  const [isExamCreateOpen, setIsExamCreateOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examImageUploading, setExamImageUploading] = useState(false);
  const [examImageProgress, setExamImageProgress] = useState(0);
  const [newExamQuestion, setNewExamQuestion] = useState({
    q: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    answer: 0,
    asignatura: 'Biología',
    explanation: '',
    imageUrl: ''
  });

  // Cargar banco oficial de solucionarios CEPREUNSA en segundo plano
  useEffect(() => {
    setIsCepreLoading(true);
    import('../data/bancoPreguntasCepreunsa.json')
      .then((mod) => {
        const list = mod.default || mod;
        if (Array.isArray(list) && list.length > 0) {
          setCepreQuestions(list);
        }
      })
      .catch((err) => {
        console.warn("Notice loading CEPREUNSA question bank:", err);
      })
      .finally(() => {
        setIsCepreLoading(false);
      });
  }, []);

  // Cronómetro del examen
  useEffect(() => {
    let interval = null;
    if (activeTab === 'examen' && isTimerRunning && !examResultsModal.isOpen) {
      interval = setInterval(() => {
        setExamTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, isTimerRunning, examResultsModal.isOpen]);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Subscribe to community exam questions
  useEffect(() => {
    try {
      const q = query(collection(db, 'preguntas_examen'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setCommunityExamQuestions([...docs, ...examData]);
        }
      }, (err) => {
        console.warn("Exam questions listener notice:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not subscribe to exam questions:", e);
    }
  }, []);

  const handleSaveExamQuestion = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newExamQuestion.q.trim() || !newExamQuestion.opt0.trim() || !newExamQuestion.opt1.trim() || creating) return;
    setCreating(true);
    try {
      // Build options array cleanly (supporting up to 5 options A..E)
      const rawOptions = [
        newExamQuestion.opt0.trim(),
        newExamQuestion.opt1.trim(),
        newExamQuestion.opt2.trim(),
        newExamQuestion.opt3.trim(),
        newExamQuestion.opt4.trim()
      ].filter((op, i) => op.length > 0 || i < 2);

      const payload = {
        q: newExamQuestion.q.trim(),
        options: rawOptions,
        answer: normalizeAnswerIndex(newExamQuestion.answer, rawOptions),
        asignatura: newExamQuestion.asignatura || 'General',
        explanation: (newExamQuestion.explanation || '').trim(),
        imageUrl: (newExamQuestion.imageUrl || '').trim(),
        authorName: user?.displayName || 'Estudiante RASTRO',
        authorUid: user?.uid || null,
        createdAt: serverTimestamp()
      };

      if (editingExamId) {
        const isDefault = editingExamId === 1 || editingExamId === 2 || String(editingExamId).startsWith('default_exam_');
        if (isDefault) {
          const defaultId = String(editingExamId).startsWith('default_exam_') ? String(editingExamId) : `default_exam_${editingExamId}`;
          await toggleHideDefaultItem(defaultId);
          await addDoc(collection(db, 'preguntas_examen'), payload);
        } else {
          await updateDoc(doc(db, 'preguntas_examen', editingExamId), payload);
        }
      } else {
        await addDoc(collection(db, 'preguntas_examen'), payload);
      }

      setNewExamQuestion({ q: '', opt0: '', opt1: '', opt2: '', opt3: '', opt4: '', answer: 0, asignatura: 'Biología', explanation: '', imageUrl: '' });
      setEditingExamId(null);
      setIsExamCreateOpen(false);
    } catch (err) {
      alert("Error al guardar pregunta: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEditExam = (qItem) => {
    setEditingExamId(qItem.id);
    setNewExamQuestion({
      q: qItem.q || '',
      opt0: qItem.options?.[0] || '',
      opt1: qItem.options?.[1] || '',
      opt2: qItem.options?.[2] || '',
      opt3: qItem.options?.[3] || '',
      opt4: qItem.options?.[4] || '',
      answer: normalizeAnswerIndex(qItem.answer, qItem.options),
      asignatura: qItem.asignatura || 'Biología',
      explanation: qItem.explanation || '',
      imageUrl: qItem.imageUrl || qItem.img || ''
    });
    setIsExamCreateOpen(true);
  };

  // Group Exam Questions Authors for filtering
  const examAuthors = useMemo(() => {
    const map = {};
    communityExamQuestions.forEach(q => {
      const name = q.authorName || 'Comunidad RASTRO';
      const key = q.authorUid ? q.authorUid : name;
      if (!map[key]) {
        map[key] = { key, name };
      }
    });
    return Object.values(map);
  }, [communityExamQuestions]);

  // Lista combinada de preguntas de la comunidad + banco CEPREUNSA (excluyendo reportadas)
  const allAvailableExamQuestions = useMemo(() => {
    return [...communityExamQuestions, ...cepreQuestions].filter(q => {
      return !reportedItemIds.includes(String(q.id)) && !isReportedItemHidden(q.id, siteSettings);
    });
  }, [communityExamQuestions, cepreQuestions, reportedItemIds, siteSettings]);

  // Asignaturas disponibles extraídas del banco de preguntas
  const availableExamAsignaturas = useMemo(() => {
    const set = new Set();
    allAvailableExamQuestions.forEach(q => {
      const asig = normalizeAsignatura(q.asignatura || q.subject || q.curso);
      if (asig && asig !== 'General') set.add(asig);
    });
    return Array.from(set).sort();
  }, [allAvailableExamQuestions]);

  const filteredExamQuestions = useMemo(() => {
    let list = allAvailableExamQuestions.filter(item => {
      // Excluir si ha sido reportada (con 1 solo reporte se deja de mostrar)
      if (reportedItemIds.includes(String(item.id)) || isReportedItemHidden(item.id, siteSettings)) {
        return false;
      }

      // Si es una pregunta predeterminada y el admin la ha ocultado, se excluye
      const isDefault = item.id === 1 || item.id === 2 || String(item.id).startsWith('default_exam_');
      if (isDefault) {
        const defaultId = String(item.id).startsWith('default_exam_') ? String(item.id) : `default_exam_${item.id}`;
        if (isDefaultItemHidden(defaultId, siteSettings)) {
          return false;
        }
      }

      // Filtro por Asignatura
      if (examAsignaturaFilter !== 'todas') {
        const asig = normalizeAsignatura(item.asignatura || item.subject || item.curso);
        if (asig !== examAsignaturaFilter) return false;
      }

      // Filtro por Semana
      if (examSemanaFilter !== 'todas') {
        if (String(item.semana) !== String(examSemanaFilter)) return false;
      }

      const qText = (item.q || '').toLowerCase();
      const optionsText = (item.options || []).join(' ').toLowerCase();
      const authorText = (item.authorName || '').toLowerCase();
      const search = examSearch.toLowerCase().trim();
      const matchSearch = !search || qText.includes(search) || optionsText.includes(search) || authorText.includes(search);

      const authorKey = item.authorUid ? item.authorUid : (item.authorName || 'Comunidad RASTRO');
      const matchAuthor = examAuthorFilter === 'todos' || authorKey === examAuthorFilter;

      return matchSearch && matchAuthor;
    });

    // Barajado aleatorio real para que las preguntas siempre aparezcan mezcladas
    if (list.length > 0) {
      const shuffled = [...list];
      let s = (examShuffleSeed + 1) * 37 + 1013904223;
      for (let i = shuffled.length - 1; i > 0; i--) {
        s = (s * 9301 + 49297) % 233280;
        const rnd = s / 233280;
        const j = Math.floor(rnd * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      if (examMode === 'rapido') {
        const count = Math.max(1, customRapidoCount || 15);
        return shuffled.slice(0, count);
      }
      if (examMode === 'simulacro') {
        return shuffled.slice(0, 60);
      }
      return shuffled;
    }

    return list;
  }, [allAvailableExamQuestions, examSearch, examAuthorFilter, examAsignaturaFilter, examSemanaFilter, examMode, customRapidoCount, examShuffleSeed, siteSettings, reportedItemIds]);

  // Función para finalizar y calcular puntaje del examen automáticamente
  const handleFinishExam = (answers = userExamAnswers) => {
    const results = calculateExamScore({
      questions: filteredExamQuestions,
      userAnswers: answers,
      area: simArea,
      simData: datosSimulador
    });

    setExamResultsModal({
      isOpen: true,
      score: results.score,
      total: results.total,
      wrongCount: results.wrongCount,
      blankCount: results.blankCount,
      unsaWeightedScore: results.unsaWeightedScore,
      percentage: results.percentage,
      aciertosPorAsignatura: results.aciertosPorAsignatura,
      details: results.details,
      elapsedTime: formatTimer(examTimerSeconds)
    });
  };

  // Simulador Puntaje State
  const [simArea, setSimArea] = useState('Sociales');
  const [aciertos, setAciertos] = useState({}); // { [asignatura_name]: number }
  
  // Reset aciertos when area changes
  useEffect(() => {
    setAciertos({});
  }, [simArea]);

  const handleAciertosChange = (asignatura, maxPreguntas, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > maxPreguntas) num = maxPreguntas;
    
    setAciertos(prev => ({
      ...prev,
      [asignatura]: num
    }));
  };

  const handleResetAciertos = () => {
    setAciertos({});
  };

  const currentSimData = datosSimulador[simArea] || [];
  
  // Group by curso
  const groupedSimData = useMemo(() => {
    const groups = {};
    const order = [];
    currentSimData.forEach(item => {
      if (!groups[item.curso]) {
        groups[item.curso] = [];
        order.push(item.curso);
      }
      groups[item.curso].push(item);
    });
    return { groups, order };
  }, [currentSimData]);

  const totalPuntaje = useMemo(() => {
    let total = 0;
    currentSimData.forEach(item => {
      const val = aciertos[item.asignatura] || 0;
      total += val * item.valor;
    });
    return total;
  }, [aciertos, currentSimData]);

  const totalAciertosCount = useMemo(() => {
    return Object.values(aciertos).reduce((acc, v) => acc + (v || 0), 0);
  }, [aciertos]);

  const totalPreguntasMax = useMemo(() => {
    return currentSimData.reduce((acc, item) => acc + (item.preguntas || 0), 0);
  }, [currentSimData]);

  const currentAreaConfig = AREA_CONFIG[simArea] || AREA_CONFIG['Sociales'];

  return (
    <div className="page-container" style={{ paddingBottom: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Frase / Versículo del Día */}
      <InspirationalDailyBanner />
      
      {/* Header with vibrant design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px', maxWidth: '700px' }}>
        
        {/* Glow pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.12), rgba(168, 85, 247, 0.15))',
          border: '1px solid rgba(0, 122, 255, 0.25)',
          color: 'var(--accent-color)',
          fontSize: '0.85rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          boxShadow: '0 4px 14px rgba(0, 122, 255, 0.12)'
        }}>
          <Sparkles size={15} /> SIMULADOR & EXAMEN OFICIAL UNSA
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
          fontWeight: 900, 
          color: 'var(--text-main)', 
          marginBottom: '12px',
          letterSpacing: '-0.03em',
          lineHeight: 1.15
        }}>
          Simulador Académico
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, lineHeight: 1.5 }}>
          Calcula con precisión tu puntaje ponderado oficial, practica con flashcards interactivas y pon a prueba tu preparación para el examen de admisión.
        </p>
      </motion.div>

      {/* Tabs with high-contrast vibrant styles - iOS Segmented Horizontal Scroll Bar with Clear Scroll Indicators */}
      <div style={{ width: '100%', maxWidth: '840px', marginBottom: '18px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Botón Flecha Izquierda */}
          <button
            type="button"
            onClick={() => tabsNavRef.current?.scrollBy({ left: -140, behavior: 'smooth' })}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--primary-color, #007AFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}
            title="Desplazar a la izquierda"
            aria-label="Desplazar pestañas a la izquierda"
          >
            <ChevronLeft size={17} />
          </button>

          {/* Contenedor desplazable con pestañas */}
          <div 
            ref={tabsNavRef}
            style={{ 
              display: 'flex', 
              gap: '6px', 
              background: 'var(--card-bg)', 
              padding: '5px', 
              borderRadius: '20px', 
              backdropFilter: 'blur(20px)', 
              border: '1.5px solid var(--card-border)', 
              flexWrap: 'nowrap', 
              overflowX: 'auto',
              flex: 1,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
            }}>
            <button 
              data-tab="simulacro_oficial"
              onClick={() => setActiveTab('simulacro_oficial')}
              style={{ 
                padding: '7px 13px', 
                borderRadius: '14px', 
                border: activeTab === 'simulacro_oficial' ? 'none' : '1px solid transparent', 
                background: activeTab === 'simulacro_oficial' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                color: activeTab === 'simulacro_oficial' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.80rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: activeTab === 'simulacro_oficial' ? '0 6px 16px rgba(16, 185, 129, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}>
              <Award size={14} />
              🎯 Simulacro (80)
            </button>

            <button 
              data-tab="examen"
              onClick={() => setActiveTab('examen')}
              style={{ 
                padding: '7px 13px', 
                borderRadius: '14px', 
                border: activeTab === 'examen' ? 'none' : '1px solid transparent', 
                background: activeTab === 'examen' ? 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)' : 'transparent',
                color: activeTab === 'examen' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.80rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: activeTab === 'examen' ? '0 6px 16px rgba(244, 63, 94, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}>
              <Brain size={14} />
              Examen Rápido
            </button>

            <button 
              data-tab="puntaje"
              onClick={() => setActiveTab('puntaje')}
              style={{ 
                padding: '7px 13px', 
                borderRadius: '14px', 
                border: activeTab === 'puntaje' ? 'none' : '1px solid transparent', 
                background: activeTab === 'puntaje' ? 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)' : 'transparent',
                color: activeTab === 'puntaje' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.80rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: activeTab === 'puntaje' ? '0 6px 16px rgba(0, 122, 255, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}>
              <Calculator size={14} />
              Calculadora
            </button>

            <button 
              data-tab="flashcards"
              onClick={() => setActiveTab('flashcards')}
              style={{ 
                padding: '7px 13px', 
                borderRadius: '14px', 
                border: activeTab === 'flashcards' ? 'none' : '1px solid transparent', 
                background: activeTab === 'flashcards' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
                color: activeTab === 'flashcards' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.80rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: activeTab === 'flashcards' ? '0 6px 16px rgba(99, 102, 241, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}>
              <Layers size={14} />
              Flashcards
            </button>
          </div>

          {/* Botón Flecha Derecha */}
          <button
            type="button"
            onClick={() => tabsNavRef.current?.scrollBy({ left: 140, behavior: 'smooth' })}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--primary-color, #007AFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}
            title="Desplazar a la derecha"
            aria-label="Desplazar pestañas a la derecha"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Indicador visual de desplazamiento horizontal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '6px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: '999px',
            background: 'rgba(0, 122, 255, 0.08)',
            border: '1px solid rgba(0, 122, 255, 0.2)',
            color: 'var(--primary-color, #007AFF)',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.01em'
          }}>
            <span>‹ ⟷ ›</span>
            <span>Desliza horizontalmente para ver las 4 secciones</span>
            <span>‹ ⟷ ›</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ width: '100%', maxWidth: '980px' }}>
        
        <AnimatePresence mode="wait">
          {activeTab === 'simulacro_oficial' && (
            <motion.div
              key="simulacro_oficial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%' }}
            >
              <SimulacroOficialExam
                bancoQuestions={allAvailableExamQuestions}
                initialArea={simArea}
                onTransferToCalculator={(aciertosPorAsig, area) => {
                  setSimArea(area);
                  setAciertos(prev => ({ ...prev, ...aciertosPorAsig }));
                  setActiveTab('puntaje');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'flashcards' && (
            <motion.div 
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              {/* Header with search, subject dropdown, author filter and "+ Crear Tarjeta" */}
              <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                  <input
                    type="text"
                    value={cardSearch}
                    onChange={(e) => { setCardSearch(e.target.value); setCurrentCard(0); }}
                    placeholder="Buscar tema, concepto o autor..."
                    style={{
                      flex: '1 1 200px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  />

                  {/* Dropdown de Temas/Materias Teóricas */}
                  <SimuladorSelect
                    value={selectedSubject}
                    onChange={(val) => { setSelectedSubject(val); setCurrentCard(0); setIsFlipped(false); }}
                    options={[
                      { value: 'Todos', label: 'Todos los Temas Teóricos' },
                      ...['Biología', 'Anatomía', 'Química', 'Física', 'Historia', 'Geografía', 'Lenguaje', 'Literatura', 'Filosofía', 'Psicología', 'Ed. Cívica'].map(sub => ({ value: sub, label: sub }))
                    ]}
                    style={{ flex: '1 1 200px' }}
                    ariaLabel="Seleccionar tema teórico"
                  />

                  {/* Dropdown de Filtrado por Usuario Creador */}
                  <SimuladorSelect
                    value={cardAuthorFilter}
                    onChange={(val) => { setCardAuthorFilter(val); setCurrentCard(0); }}
                    options={[
                      { value: 'todos', label: 'Todos los Autores' },
                      ...flashcardAuthors.map(auth => ({ value: auth.key, label: auth.name }))
                    ]}
                    style={{ flex: '1 1 180px' }}
                    ariaLabel="Seleccionar autor"
                  />

                  <button
                    onClick={() => setIsCreateOpen(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
                      transition: 'all 0.2s ease',
                      marginLeft: 'auto'
                    }}
                  >
                    <PlusCircle size={16} /> + Crear Tarjeta
                  </button>
                </div>
              </div>

              {/* Flashcard 3D Scene */}
              {filteredCards.length > 0 ? (
                <div style={{ perspective: '1000px', width: '100%', maxWidth: '580px', height: '330px', marginBottom: '26px' }}>
                  <motion.div
                    onClick={() => setIsFlipped(!isFlipped)}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Front */}
                    <div className="ios-glass-card" style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      textAlign: 'center',
                      borderRadius: '24px',
                      boxSizing: 'border-box',
                      overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.78rem', background: 'rgba(0,122,255,0.1)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '10px', fontWeight: 800 }}>
                          {filteredCards[activeCardIndex]?.subject || 'General'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(isAdmin || (user && user.uid === filteredCards[activeCardIndex]?.authorUid)) && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditFlashcard(filteredCards[activeCardIndex]);
                                }}
                                title="Editar Tarjeta"
                                style={{ background: 'rgba(0,122,255,0.12)', border: 'none', color: 'var(--accent-color)', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                              >
                                <Edit3 size={15} />
                              </button>

                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const cardToDelete = filteredCards[activeCardIndex];
                                  if (!cardToDelete) return;
                                  const isDefault = cardToDelete.id === '1' || cardToDelete.id === '2' || cardToDelete.id === '3' || cardToDelete.id === '4' || String(cardToDelete.id).startsWith('default_fc_');
                                  
                                  if (isDefault) {
                                    if (!isAdmin) {
                                      alert("Esta es una tarjeta predeterminada del sistema. Solo el administrador puede ocultarla o eliminarla.");
                                      return;
                                    }
                                    if (window.confirm("¿Deseas ocultar esta tarjeta predeterminada del sistema para todos los usuarios?")) {
                                      const defaultId = String(cardToDelete.id).startsWith('default_fc_') ? String(cardToDelete.id) : `default_fc_${cardToDelete.id}`;
                                      await toggleHideDefaultItem(defaultId);
                                      alert("Tarjeta predeterminada ocultada exitosamente.");
                                    }
                                    return;
                                  }

                                  if (window.confirm("¿Deseas eliminar esta tarjeta de repaso?")) {
                                    deleteDoc(doc(db, 'flashcards', cardToDelete.id)).catch(err => alert("Error al eliminar: " + err.message));
                                  }
                                }}
                                title={isAdmin && (filteredCards[activeCardIndex]?.id === '1' || filteredCards[activeCardIndex]?.id === '2' || filteredCards[activeCardIndex]?.id === '3' || filteredCards[activeCardIndex]?.id === '4') ? "Ocultar/Eliminar Tarjeta del Sistema" : "Eliminar Tarjeta"}
                                style={{ background: 'rgba(239, 68, 68, 0.12)', border: 'none', color: '#EF4444', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentCardItem = filteredCards[activeCardIndex];
                              if (!currentCardItem) return;
                              setReportData({
                                isOpen: true,
                                targetId: currentCardItem.id,
                                targetTitle: currentCardItem.q || 'Tarjeta Flashcard',
                                targetType: 'flashcard'
                              });
                            }}
                            title="Reportar tarjeta incorrecta o sin contexto"
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#EF4444',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Flag size={13} />
                            <span>Reportar</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Contenedor desplazable de la pregunta con tipografía compacta */}
                      <div style={{
                        flex: 1,
                        minHeight: 0,
                        width: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '8px 0',
                        padding: '0 4px',
                        WebkitOverflowScrolling: 'touch'
                      }}>
                        {/* Image if present */}
                        {filteredCards[activeCardIndex]?.imageUrl && (
                          <div style={{ marginBottom: '8px', textAlign: 'center', width: '100%', flexShrink: 0 }}>
                            <img
                              src={filteredCards[activeCardIndex].imageUrl}
                              alt="Gráfico de la tarjeta"
                              style={{
                                maxHeight: '95px',
                                maxWidth: '100%',
                                borderRadius: '12px',
                                objectFit: 'contain',
                                border: '1.5px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.02)'
                              }}
                            />
                          </div>
                        )}
                        
                        <h2 style={{
                          fontSize: (filteredCards[activeCardIndex]?.q || '').length > 70 ? '0.94rem' : ((filteredCards[activeCardIndex]?.q || '').length > 40 ? '1.04rem' : '1.15rem'),
                          color: 'var(--text-main)',
                          fontWeight: 700,
                          lineHeight: 1.4,
                          margin: 'auto 0',
                          wordBreak: 'break-word'
                        }}>
                          {filteredCards[activeCardIndex]?.q}
                        </h2>
                      </div>
                      
                      <div style={{ flexShrink: 0, width: '100%', paddingTop: '4px' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          Toca la tarjeta para ver la respuesta
                        </p>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="ios-glass-card" style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      textAlign: 'center',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(135deg, #007aff, #6366F1)',
                      border: 'none',
                      borderRadius: '24px',
                      color: '#fff',
                      boxSizing: 'border-box',
                      overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>
                          Respuesta Directa
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(isAdmin || (user && user.uid === filteredCards[activeCardIndex]?.authorUid)) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const cardToDelete = filteredCards[activeCardIndex];
                                const isDefault = !cardToDelete.id || DEFAULT_FLASHCARDS.some(fc => String(fc.id) === String(cardToDelete.id)) || String(cardToDelete.id).startsWith('default_fc_');
                                if (isDefault) {
                                  alert("Esta es una tarjeta predeterminada del sistema.");
                                  return;
                                }
                                if (window.confirm("¿Deseas eliminar esta tarjeta de repaso?")) {
                                  deleteDoc(doc(db, 'flashcards', cardToDelete.id)).catch(err => alert("Error al eliminar: " + err.message));
                                }
                              }}
                              title="Eliminar Tarjeta"
                              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentCardItem = filteredCards[activeCardIndex];
                              if (!currentCardItem) return;
                              setReportData({
                                isOpen: true,
                                targetId: currentCardItem.id,
                                targetTitle: currentCardItem.q || 'Tarjeta Flashcard',
                                targetType: 'flashcard'
                              });
                            }}
                            title="Reportar tarjeta incorrecta o sin contexto"
                            style={{
                              background: 'rgba(255, 255, 255, 0.22)',
                              border: '1px solid rgba(255, 255, 255, 0.35)',
                              color: '#FFFFFF',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Flag size={13} />
                            <span>Reportar</span>
                          </button>
                        </div>
                      </div>

                      {/* Contenedor de respuesta directa y rápida */}
                      <div style={{
                        flex: 1,
                        minHeight: 0,
                        width: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '8px 0',
                        padding: '0 6px',
                        WebkitOverflowScrolling: 'touch'
                      }}>
                        <h3 style={{
                          fontSize: (filteredCards[activeCardIndex]?.a || '').length > 35 ? '1.12rem' : '1.35rem',
                          color: '#fff',
                          fontWeight: 800,
                          lineHeight: 1.35,
                          margin: '0 0 6px 0',
                          wordBreak: 'break-word',
                          textAlign: 'center'
                        }}>
                          {filteredCards[activeCardIndex]?.a}
                        </h3>

                        {filteredCards[activeCardIndex]?.claveLetra && (
                          <span style={{
                            fontSize: '0.74rem',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.95)',
                            marginTop: '4px'
                          }}>
                            Clave ({filteredCards[activeCardIndex].claveLetra})
                          </span>
                        )}
                      </div>
                      
                      <div style={{ flexShrink: 0, width: '100%', paddingTop: '4px' }}>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
                          Aporte: {filteredCards[activeCardIndex]?.authorName || 'Comunidad RASTRO'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="ios-glass-card" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px', maxWidth: '500px' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No hay tarjetas para este curso aún. ¡Sé el primero en crear una!</p>
                </div>
              )}

              {/* Controls */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <button onClick={prevCard} className="ios-glass-card" style={{ border: 'none', padding: '16px', borderRadius: '50%', cursor: 'pointer', display: 'flex', color: 'var(--text-main)' }}>
                  <ChevronLeft />
                </button>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem' }}>
                  {activeCardIndex + 1} / {Math.max(1, filteredCards.length)}
                </span>
                <button onClick={nextCard} className="ios-glass-card" style={{ border: 'none', padding: '16px', borderRadius: '50%', cursor: 'pointer', display: 'flex', color: 'var(--text-main)' }}>
                  <ChevronRight />
                </button>
              </div>

              {/* Create Card Modal */}
              <AnimatePresence>
                {isCreateOpen && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: 1000150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
                    paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                    boxSizing: 'border-box'
                  }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="ios-glass-card"
                      style={{
                        width: '100%',
                        maxWidth: '480px',
                        maxHeight: 'min(92dvh, 660px)',
                        overflowY: 'auto',
                        padding: '24px 20px',
                        borderRadius: '26px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          Crear Tarjeta de Repaso Teórico
                        </h3>
                        <button onClick={() => setIsCreateOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveFlashcard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Materia o Curso Teórico
                          </label>
                          <SimuladorSelect
                            value={newCard.subject}
                            onChange={(val) => setNewCard(prev => ({ ...prev, subject: val }))}
                            options={['Biología', 'Anatomía', 'Química', 'Física', 'Historia', 'Geografía', 'Lenguaje', 'Literatura', 'Filosofía', 'Psicología', 'Ed. Cívica'].map(s => ({ value: s, label: s }))}
                            style={{ width: '100%' }}
                            menuStyle={{ width: '100%', maxWidth: '100%' }}
                            ariaLabel="Seleccionar materia teórica"
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                              Pregunta o Concepto Teórico Corto
                            </label>
                            <span style={{ fontSize: '0.72rem', color: newCard.q.length > 100 ? '#EF4444' : 'var(--text-secondary)', fontWeight: 600 }}>
                              {newCard.q.length}/110 car.
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            maxLength={110}
                            value={newCard.q}
                            onChange={(e) => setNewCard(prev => ({ ...prev, q: e.target.value }))}
                            placeholder="Ej. ¿Quién formuló la Teoría de la Relatividad?"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.06)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                            required
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                            Las flashcards son exclusivamente para teoría con una sola respuesta directa (sin ejercicios, sin V/F, sin orden ni cálculos).
                          </span>
                        </div>

                        {/* Imagen opcional para la tarjeta */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Imagen o Esquema (Opcional)
                          </label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={newCard.imageUrl}
                              onChange={(e) => setNewCard(prev => ({ ...prev, imageUrl: e.target.value }))}
                              placeholder="URL de imagen o sube un archivo..."
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '10px',
                                border: '1px solid var(--card-border)',
                                background: 'rgba(120,120,128,0.06)',
                                color: 'var(--text-main)',
                                fontSize: '0.82rem'
                              }}
                            />
                            <label
                              style={{
                                padding: '8px 12px',
                                borderRadius: '10px',
                                background: 'rgba(0,122,255,0.12)',
                                color: 'var(--accent-color)',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: cardImageUploading ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Upload size={14} />
                              {cardImageUploading ? `${cardImageProgress}%` : 'Subir'}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={cardImageUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setCardImageUploading(true);
                                  setCardImageProgress(0);
                                  try {
                                    const downloadUrl = await uploadFileReliable(
                                      file,
                                      (prog) => setCardImageProgress(prog),
                                      'flashcards'
                                    );
                                    if (downloadUrl) {
                                      setNewCard(prev => ({ ...prev, imageUrl: downloadUrl }));
                                    }
                                  } catch (err) {
                                    alert("Error al subir imagen: " + err.message);
                                  } finally {
                                    setCardImageUploading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {newCard.imageUrl && (
                            <div style={{ position: 'relative', marginTop: '8px', display: 'inline-block' }}>
                              <img
                                src={newCard.imageUrl}
                                alt="Vista previa"
                                style={{ maxHeight: '80px', borderRadius: '8px', border: '1px solid var(--card-border)' }}
                              />
                              <button
                                type="button"
                                onClick={() => setNewCard(prev => ({ ...prev, imageUrl: '' }))}
                                style={{
                                  position: 'absolute',
                                  top: '-6px',
                                  right: '-6px',
                                  background: '#EF4444',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Respuesta Directa (Única y rápida)
                          </label>
                          <textarea
                            rows={2}
                            maxLength={40}
                            value={newCard.a}
                            onChange={(e) => setNewCard(prev => ({ ...prev, a: e.target.value }))}
                            placeholder="Ej. Albert Einstein (o Mitocondria)"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.06)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                            required
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                            Máximo 40 caracteres. Debe ser un concepto, autor o término puntual (sin párrafos ni explicaciones).
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={creating}
                            style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 800, cursor: creating ? 'wait' : 'pointer' }}
                          >
                            {creating ? 'Publicando...' : 'Publicar Tarjeta'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'examen' && (
            <motion.div 
              key="examen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              {/* Header bar for Examen con Banco CEPREUNSA Oficial */}
              <div style={{
                width: '100%',
                maxWidth: '720px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '18px'
              }}>
                {/* Banner de Banco Oficial */}
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(244, 63, 94, 0.08) 100%)',
                  border: '1.5px solid rgba(236, 72, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🏛️</span>
                    <div>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>
                        Banco Oficial CEPREUNSA — Solucionarios & Claves
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        {isCepreLoading ? 'Cargando solucionarios...' : `${allAvailableExamQuestions.length.toLocaleString()} preguntas reales clasificadas por semana y asignatura`}
                      </span>
                    </div>
                  </div>

                  {/* Cronómetro en vivo */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--text-main)'
                  }}>
                    <Clock size={15} color="#EC4899" />
                    <span>{formatTimer(examTimerSeconds)}</span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(prev => !prev)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                      title={isTimerRunning ? 'Pausar Cronómetro' : 'Reanudar Cronómetro'}
                    >
                      {isTimerRunning ? '⏸️' : '▶️'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamTimerSeconds(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                      title="Reiniciar Cronómetro"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                {/* Modos de Examen */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => { setExamMode('simulacro'); setCurrentQuestion(0); }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        border: examMode === 'simulacro' ? '1.5px solid #EC4899' : '1px solid var(--card-border)',
                        background: examMode === 'simulacro' ? 'rgba(236, 72, 153, 0.15)' : 'var(--card-bg)',
                        color: examMode === 'simulacro' ? '#EC4899' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Simulacro
                    </button>
                    <button
                      type="button"
                      onClick={() => { setExamMode('rapido'); setCurrentQuestion(0); }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        border: examMode === 'rapido' ? '1.5px solid #EC4899' : '1px solid var(--card-border)',
                        background: examMode === 'rapido' ? 'rgba(236, 72, 153, 0.15)' : 'var(--card-bg)',
                        color: examMode === 'rapido' ? '#EC4899' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Examen Rápido ({customRapidoCount})
                    </button>

                    {/* Selector de cantidad personalizada para Examen Rápido */}
                    {examMode === 'rapido' && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--card-bg)', padding: '3px 8px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Cant:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={customRapidoCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCustomRapidoCount(isNaN(val) ? 15 : Math.max(1, Math.min(100, val)));
                            setCurrentQuestion(0);
                          }}
                          style={{
                            width: '42px',
                            padding: '2px 4px',
                            borderRadius: '6px',
                            border: '1px solid var(--card-border)',
                            background: 'transparent',
                            color: 'var(--text-main)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            textAlign: 'center'
                          }}
                          title="Escribe la cantidad de preguntas"
                        />
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[10, 15, 20, 30].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => { setCustomRapidoCount(n); setCurrentQuestion(0); }}
                              style={{
                                padding: '2px 6px',
                                borderRadius: '6px',
                                border: customRapidoCount === n ? '1px solid #EC4899' : '1px solid transparent',
                                background: customRapidoCount === n ? 'rgba(236, 72, 153, 0.18)' : 'rgba(120,120,128,0.08)',
                                color: customRapidoCount === n ? '#EC4899' : 'var(--text-secondary)',
                                fontSize: '0.70rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => { setExamMode('todo'); setCurrentQuestion(0); }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        border: examMode === 'todo' ? '1.5px solid #EC4899' : '1px solid var(--card-border)',
                        background: examMode === 'todo' ? 'rgba(236, 72, 153, 0.15)' : 'var(--card-bg)',
                        color: examMode === 'todo' ? '#EC4899' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Todas
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setExamShuffleSeed(prev => prev + 1);
                        setCurrentQuestion(0);
                        setUserExamAnswers({});
                        setSelectedOption(null);
                      }}
                      title="Barajar y generar nuevo lote de preguntas"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        border: '1px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Shuffle size={13} /> Reordenar Lote
                    </button>

                    <button
                      onClick={() => {
                        setEditingExamId(null);
                        setNewExamQuestion({ q: '', opt0: '', opt1: '', opt2: '', opt3: '', opt4: '', answer: 0, asignatura: 'Biología', explanation: '', imageUrl: '' });
                        setIsExamCreateOpen(true);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)'
                      }}
                    >
                      <PlusCircle size={14} /> + Crear
                    </button>
                  </div>
                </div>

                {/* Filtros de Asignatura, Semana y Búsqueda */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                  {/* Selector Asignatura */}
                  <SimuladorSelect
                    value={examAsignaturaFilter}
                    onChange={(val) => { setExamAsignaturaFilter(val); setCurrentQuestion(0); }}
                    options={[
                      { value: 'todas', label: 'Todas las Asignaturas' },
                      ...availableExamAsignaturas.map(asig => ({ value: asig, label: asig }))
                    ]}
                    style={{ flex: '1 1 180px' }}
                    ariaLabel="Filtrar por asignatura"
                  />

                  {/* Selector Semana */}
                  <SimuladorSelect
                    value={examSemanaFilter}
                    onChange={(val) => { setExamSemanaFilter(val); setCurrentQuestion(0); }}
                    options={[
                      { value: 'todas', label: 'Todas las Semanas' },
                      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => ({
                        value: String(s),
                        label: `Semana ${s} (Solucionario)`
                      }))
                    ]}
                    style={{ flex: '1 1 180px' }}
                    ariaLabel="Filtrar por semana"
                  />

                  {/* Buscador */}
                  <input
                    type="text"
                    value={examSearch}
                    onChange={(e) => { setExamSearch(e.target.value); setCurrentQuestion(0); }}
                    placeholder="Buscar pregunta..."
                    style={{
                      flex: '2 1 180px',
                      padding: '9px 12px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Barra de progreso de preguntas respondidas vs en blanco */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, padding: '2px 4px' }}>
                  <span>
                    ✅ Respondidas: <strong style={{ color: '#10B981' }}>{Object.keys(userExamAnswers).length}</strong> de {filteredExamQuestions.length}
                  </span>
                  <span>
                    ⚪ En blanco: <strong style={{ color: '#F59E0B' }}>{Math.max(0, filteredExamQuestions.length - Object.keys(userExamAnswers).length)}</strong>
                  </span>
                </div>
              </div>

              {filteredExamQuestions.length > 0 ? (
                <div
                  className="ios-glass-card"
                  style={{ 
                    padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 24px)', 
                    width: '100%',
                    maxWidth: '720px', 
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(236, 72, 153, 0.3)',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)'
                  }}
                >
                  {(() => {
                    const safeQIndex = Math.min(currentQuestion, filteredExamQuestions.length - 1);
                    const currentQItem = filteredExamQuestions[safeQIndex];
                    const isAuthorOrAdmin = isAdmin || (user && user.uid === currentQItem?.authorUid);

                    return (
                      <>
                        {/* Question Navigator Strip */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          overflowX: 'auto',
                          paddingBottom: '12px',
                          marginBottom: '16px',
                          borderBottom: '1px solid var(--card-border)'
                        }}>
                          {filteredExamQuestions.map((q, qIndex) => {
                            const isAnswered = userExamAnswers[qIndex] !== undefined && userExamAnswers[qIndex] !== null;
                            const isCurrent = safeQIndex === qIndex;

                            return (
                              <button
                                key={qIndex}
                                type="button"
                                onClick={() => {
                                  setCurrentQuestion(qIndex);
                                  setSelectedOption(userExamAnswers[qIndex] !== undefined ? userExamAnswers[qIndex] : null);
                                }}
                                style={{
                                  minWidth: '34px',
                                  height: '34px',
                                  borderRadius: '10px',
                                  border: isCurrent ? '2px solid #EC4899' : '1px solid var(--card-border)',
                                  background: isCurrent 
                                    ? 'linear-gradient(135deg, #EC4899, #F43F5E)' 
                                    : (isAnswered ? 'rgba(16, 185, 129, 0.18)' : 'rgba(120,120,128,0.08)'),
                                  color: isCurrent ? '#FFFFFF' : (isAnswered ? '#059669' : 'var(--text-secondary)'),
                                  fontWeight: 800,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease',
                                  flexShrink: 0
                                }}
                                title={`Ir a Pregunta ${qIndex + 1}${isAnswered ? ' (Respondida)' : ''}`}
                              >
                                {qIndex + 1}
                              </button>
                            );
                          })}
                        </div>

                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ 
                              background: 'rgba(236, 72, 153, 0.12)', 
                              color: '#EC4899', 
                              padding: '6px 14px', 
                              borderRadius: '999px', 
                              fontSize: '0.85rem', 
                              fontWeight: 800 
                            }}>
                              🎯 Pregunta {safeQIndex + 1} de {filteredExamQuestions.length}
                            </span>

                            {(currentQItem?.asignatura || currentQItem?.subject || currentQItem?.curso) && (
                              <span style={{
                                background: 'rgba(59, 130, 246, 0.12)',
                                color: '#2563EB',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                🧪 {normalizeAsignatura(currentQItem.asignatura || currentQItem.subject || currentQItem.curso)}
                              </span>
                            )}

                            {currentQItem?.semana && (
                              <span style={{
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: '#059669',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 800
                              }}>
                                📅 S{currentQItem.semana}
                              </span>
                            )}

                            {currentQItem?.fuente && (
                              <span style={{
                                background: 'rgba(139, 92, 246, 0.12)',
                                color: '#7C3AED',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 800
                              }}>
                                🏛️ Solucionario Oficial
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isAuthorOrAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditExam(currentQItem)}
                                  title="Editar Pregunta"
                                  style={{ background: 'rgba(0,122,255,0.12)', border: 'none', color: 'var(--accent-color)', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Edit3 size={14} /> Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!currentQItem) return;
                                    const isDefault = currentQItem.id === 1 || currentQItem.id === 2 || String(currentQItem.id).startsWith('default_exam_');

                                    if (isDefault) {
                                      if (!isAdmin) {
                                        alert("Esta es una pregunta predeterminada del sistema. Solo el administrador puede ocultarla o eliminarla.");
                                        return;
                                      }
                                      if (window.confirm("¿Deseas ocultar esta pregunta predeterminada del sistema para todos los usuarios?")) {
                                        const defaultId = String(currentQItem.id).startsWith('default_exam_') ? String(currentQItem.id) : `default_exam_${currentQItem.id}`;
                                        await toggleHideDefaultItem(defaultId);
                                        alert("Pregunta predeterminada ocultada exitosamente.");
                                      }
                                      return;
                                    }

                                    if (window.confirm("¿Deseas eliminar esta pregunta del examen rápido?")) {
                                      deleteDoc(doc(db, 'preguntas_examen', currentQItem.id)).catch(err => alert("Error al eliminar: " + err.message));
                                    }
                                  }}
                                  title={isAdmin && (currentQItem.id === 1 || currentQItem.id === 2) ? "Ocultar/Eliminar Pregunta del Sistema" : "Eliminar Pregunta"}
                                  style={{ background: 'rgba(239, 68, 68, 0.12)', border: 'none', color: '#EF4444', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Trash2 size={14} /> Eliminar
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (!currentQItem) return;
                                setReportData({
                                  isOpen: true,
                                  targetId: currentQItem.id,
                                  targetTitle: currentQItem.q || 'Pregunta Examen',
                                  targetType: 'examen'
                                });
                              }}
                              title="Reportar pregunta incorrecta o sin contexto"
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#EF4444',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Flag size={13} />
                              <span>Reportar</span>
                            </button>
                          </div>
                        </div>

                        <h2 style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)', color: 'var(--text-main)', marginBottom: '14px', fontWeight: 800, lineHeight: 1.45, wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                          {currentQItem?.q}
                        </h2>

                        {/* Image for question if present */}
                        {(currentQItem?.imageUrl || currentQItem?.img) && (
                          <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
                            <img
                              src={currentQItem.imageUrl || currentQItem.img}
                              alt="Gráfico de la pregunta"
                              style={{
                                maxHeight: '320px',
                                maxWidth: '100%',
                                borderRadius: '16px',
                                border: '1.5px solid var(--card-border)',
                                objectFit: 'contain',
                                background: 'rgba(0,0,0,0.02)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                              }}
                            />
                          </div>
                        )}

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '22px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span>✍️ Autor / Origen: <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{currentQItem?.authorName || (currentQItem?.fuente ? 'Solucionario Oficial CEPREUNSA' : 'Comunidad RASTRO')}</span></span>
                          {currentQItem?.semana && <span style={{ color: 'var(--text-muted)' }}>• Semana {currentQItem.semana}</span>}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {(currentQItem?.options || []).map((opt, i) => {
                            const isSelected = selectedOption === i;
                            const letter = ['A', 'B', 'C', 'D', 'E'][i] || String.fromCharCode(65 + i);
                            return (
                              <motion.button 
                                key={i}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => {
                                  setSelectedOption(i);
                                  setUserExamAnswers(prev => ({ ...prev, [safeQIndex]: i }));
                                }}
                                style={{
                                  padding: '14px 18px',
                                  borderRadius: '16px',
                                  border: isSelected ? '2px solid #EC4899' : '1.5px solid var(--card-border)',
                                  background: isSelected ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(244, 63, 94, 0.08))' : 'var(--card-bg)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.98rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '12px',
                                  boxShadow: isSelected ? '0 8px 20px rgba(236, 72, 153, 0.15)' : 'none'
                                }}
                              >
                                <div style={{ 
                                  width: '30px', 
                                  height: '30px', 
                                  borderRadius: '50%', 
                                  border: isSelected ? 'none' : '2px solid var(--text-secondary)',
                                  background: isSelected ? 'linear-gradient(135deg, #EC4899, #F43F5E)' : 'rgba(120,120,128,0.08)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  flexShrink: 0,
                                  marginTop: '2px'
                                }}>
                                  {isSelected ? <Check size={16} strokeWidth={3} /> : letter}
                                </div>
                                <span style={{ fontWeight: isSelected ? 700 : 500, flex: 1, lineHeight: 1.5 }}>
                                  {cleanOptionText(opt)}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {safeQIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const prevIdx = safeQIndex - 1;
                                  setCurrentQuestion(prevIdx);
                                  setSelectedOption(userExamAnswers[prevIdx] !== undefined ? userExamAnswers[prevIdx] : null);
                                }}
                                style={{
                                  padding: '12px 18px',
                                  borderRadius: '16px',
                                  border: '1.5px solid var(--card-border)',
                                  background: 'var(--card-bg)',
                                  color: 'var(--text-main)',
                                  fontWeight: 700,
                                  fontSize: '0.88rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                Anterior
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const currentAnswers = { ...userExamAnswers };
                                if (selectedOption !== null && selectedOption !== undefined) {
                                  currentAnswers[safeQIndex] = selectedOption;
                                }
                                handleFinishExam(currentAnswers);
                              }}
                              style={{
                                padding: '12px 18px',
                                borderRadius: '16px',
                                border: '1.5px solid rgba(236, 72, 153, 0.4)',
                                background: 'rgba(236, 72, 153, 0.12)',
                                color: '#EC4899',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              📋 Ver Claves & Resultados
                            </button>
                          </div>

                          <button 
                            onClick={() => {
                              const updatedAnswers = { ...userExamAnswers };
                              if (selectedOption !== null && selectedOption !== undefined) {
                                updatedAnswers[safeQIndex] = selectedOption;
                              } else {
                                delete updatedAnswers[safeQIndex];
                              }

                              if (safeQIndex < filteredExamQuestions.length - 1) {
                                const nextIdx = safeQIndex + 1;
                                setCurrentQuestion(nextIdx);
                                setSelectedOption(updatedAnswers[nextIdx] !== undefined ? updatedAnswers[nextIdx] : null);
                              } else {
                                handleFinishExam(updatedAnswers);
                              }
                            }}
                            style={{
                              padding: '14px 28px',
                              borderRadius: '16px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              cursor: 'pointer',
                              boxShadow: '0 8px 22px rgba(236, 72, 153, 0.35)',
                              transition: 'all 0.25s ease'
                            }}
                          >
                            {safeQIndex < filteredExamQuestions.length - 1 ? 'Siguiente Pregunta ➔' : 'Finalizar Examen & Ver Resultados 🏁'}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="ios-glass-card" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px', maxWidth: '500px' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No hay preguntas disponibles por el momento.</p>
                </div>
              )}

              {/* Modal Crear / Editar Pregunta Examen Rápido */}
              <AnimatePresence>
                {isExamCreateOpen && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: 1000150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
                    paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                    boxSizing: 'border-box'
                  }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="ios-glass-card"
                      style={{
                        width: '100%',
                        maxWidth: '560px',
                        maxHeight: 'min(92dvh, 700px)',
                        overflowY: 'auto',
                        padding: '22px 20px',
                        borderRadius: '26px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{editingExamId ? '✏️' : '✨'}</span>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {editingExamId ? 'Editar Pregunta del Examen' : 'Nueva Pregunta para Examen Rápido'}
                          </h3>
                        </div>
                        <button onClick={() => setIsExamCreateOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveExamQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Enunciado */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            Pregunta o Enunciado:
                          </label>
                          <textarea
                            rows={2}
                            value={newExamQuestion.q}
                            onChange={(e) => setNewExamQuestion(prev => ({ ...prev, q: e.target.value }))}
                            placeholder="Ej. En la fotosíntesis, ¿dónde se lleva a cabo la fase luminosa?"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.06)', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box' }}
                            required
                          />
                        </div>

                        {/* Subir Imagen para la Pregunta */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            📷 Imagen o Esquema para la Pregunta (Opcional):
                          </label>

                          {newExamQuestion.imageUrl ? (
                            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid var(--card-border)', background: 'rgba(0,0,0,0.04)', textAlign: 'center', padding: '10px' }}>
                              <img
                                src={newExamQuestion.imageUrl}
                                alt="Previsualización"
                                style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }}
                              />
                              <button
                                type="button"
                                onClick={() => setNewExamQuestion(prev => ({ ...prev, imageUrl: '' }))}
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: 'rgba(239, 68, 68, 0.9)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                }}
                                title="Quitar Imagen"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  padding: '12px 16px',
                                  borderRadius: '12px',
                                  border: '1.5px dashed rgba(236, 72, 153, 0.45)',
                                  background: 'rgba(236, 72, 153, 0.05)',
                                  color: '#EC4899',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  cursor: examImageUploading ? 'wait' : 'pointer'
                                }}
                              >
                                {examImageUploading ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" /> Subiendo imagen ({examImageProgress}%)...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud size={16} /> Subir Imagen desde el dispositivo
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={examImageUploading}
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setExamImageUploading(true);
                                    setExamImageProgress(0);
                                    try {
                                      const downloadUrl = await uploadFileReliable(file, (p) => setExamImageProgress(p), 'preguntas_examen');
                                      if (downloadUrl) {
                                        setNewExamQuestion(prev => ({ ...prev, imageUrl: downloadUrl }));
                                      }
                                    } catch (upErr) {
                                      alert("Error al subir imagen: " + upErr.message);
                                    } finally {
                                      setExamImageUploading(false);
                                    }
                                  }}
                                />
                              </label>

                              <input
                                type="url"
                                value={newExamQuestion.imageUrl}
                                onChange={(e) => setNewExamQuestion(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="O pega aquí una URL directa de imagen (https://...)"
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.06)', color: 'var(--text-main)', fontSize: '0.82rem', boxSizing: 'border-box' }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Opciones y Asignación de Clave Correcta (A, B, C, D, E) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                              Opciones de Respuesta:
                            </label>
                            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10B981' }}>
                              * Toca "Elegir Clave" para marcar la respuesta correcta
                            </span>
                          </div>

                          {[0, 1, 2, 3, 4].map((idx) => {
                            const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                            const isThisCorrect = normalizeAnswerIndex(newExamQuestion.answer) === idx;

                            return (
                              <div 
                                key={idx}
                                style={{
                                  display: 'flex',
                                  gap: '8px',
                                  alignItems: 'center',
                                  padding: '6px 10px',
                                  borderRadius: '14px',
                                  border: isThisCorrect ? '2px solid #10B981' : '1px solid var(--card-border)',
                                  background: isThisCorrect ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: isThisCorrect ? '#10B981' : 'var(--card-border)',
                                  color: isThisCorrect ? '#fff' : 'var(--text-main)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  flexShrink: 0
                                }}>
                                  {letter}
                                </span>

                                <input
                                  type="text"
                                  value={newExamQuestion[`opt${idx}`] || ''}
                                  onChange={(e) => setNewExamQuestion(prev => ({ ...prev, [`opt${idx}`]: e.target.value }))}
                                  placeholder={idx === 4 ? `Texto de la Opción ${letter} (Opcional)` : `Texto de la Opción ${letter}`}
                                  style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--card-border)',
                                    background: 'rgba(120,120,128,0.06)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.85rem',
                                    boxSizing: 'border-box'
                                  }}
                                  required={idx < 2}
                                />

                                <button
                                  type="button"
                                  onClick={() => setNewExamQuestion(prev => ({ ...prev, answer: idx }))}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: isThisCorrect ? '#10B981' : 'rgba(120,120,128,0.12)',
                                    color: isThisCorrect ? '#FFFFFF' : 'var(--text-secondary)',
                                    fontWeight: 800,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  {isThisCorrect ? (
                                    <>
                                      <Check size={14} strokeWidth={3} /> Correcta
                                    </>
                                  ) : (
                                    'Elegir Clave'
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Confirmation Card of Selected Key */}
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Target size={16} color="#059669" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                            Clave asignada: <strong>Opción {['A', 'B', 'C', 'D', 'E'][normalizeAnswerIndex(newExamQuestion.answer)] || 'A'}</strong>
                            {newExamQuestion[`opt${normalizeAnswerIndex(newExamQuestion.answer)}`] ? ` ("${newExamQuestion[`opt${normalizeAnswerIndex(newExamQuestion.answer)}`]}")` : ''}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setIsExamCreateOpen(false)}
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={creating || examImageUploading}
                            style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)', color: '#fff', fontWeight: 800, cursor: (creating || examImageUploading) ? 'wait' : 'pointer' }}
                          >
                            {creating ? 'Guardando...' : (editingExamId ? 'Actualizar Pregunta' : 'Publicar Pregunta')}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'puntaje' && (
            <motion.div 
              key="puntaje"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '26px', width: '100%', maxWidth: '100%' }}
            >
              {/* Selector de Área Académica - Horizontal centrado sin etiqueta de preguntas */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0 auto' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '6px', 
                  width: '100%',
                  maxWidth: '480px',
                  background: 'var(--card-bg)',
                  padding: '5px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--card-border)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  boxSizing: 'border-box'
                }}>
                  {['Sociales', 'Ingenierías', 'Biomédicas'].map(area => {
                    const config = AREA_CONFIG[area] || AREA_CONFIG['Sociales'];
                    const isSelected = simArea === area;
                    return (
                      <motion.button
                        key={area}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSimArea(area)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: isSelected ? 'none' : `1px solid ${config.border}`,
                          background: isSelected ? config.activeGradient : config.tint,
                          color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? config.activeShadow : 'none',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '36px'
                        }}
                      >
                        <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: 800 }}>
                          {config.badge}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
               
               {/* Pro Scoreboard HUD Sticky Card */}
               <div 
                 className="ios-glass-card" 
                 style={{ 
                   position: 'sticky', 
                   top: '90px', 
                   zIndex: 20, 
                   padding: '22px 28px', 
                   border: `2px solid ${currentAreaConfig.accent}`, 
                   background: 'var(--card-bg)',
                   backdropFilter: 'blur(24px)',
                   borderRadius: '26px',
                   boxShadow: `0 16px 36px rgba(0, 0, 0, 0.08), 0 0 24px ${currentAreaConfig.tint}`
                 }}
               >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                   <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                       <span style={{ 
                         background: currentAreaConfig.activeGradient, 
                         color: '#FFFFFF', 
                         padding: '4px 12px', 
                         borderRadius: '999px', 
                         fontSize: '0.8rem', 
                         fontWeight: 800,
                         boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                       }}>
                         {currentAreaConfig.badge}
                       </span>
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                         {totalAciertosCount} de {totalPreguntasMax} aciertos
                       </span>
                     </div>
                     <span style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.01em' }}>
                       Puntaje Oficial Proyectado
                     </span>
                   </div>

                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ 
                         fontSize: 'clamp(2rem, 4vw, 2.75rem)', 
                         fontWeight: 900, 
                         color: currentAreaConfig.accent,
                         lineHeight: 1,
                         letterSpacing: '-0.03em'
                       }}>
                         {formatNum(totalPuntaje)}
                       </div>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                         Puntos / 100.00
                       </span>
                     </div>

                     {totalAciertosCount > 0 && (
                       <button
                         onClick={handleResetAciertos}
                         title="Reiniciar contador de aciertos"
                         style={{
                           background: 'rgba(120, 120, 128, 0.1)',
                           border: 'none',
                           borderRadius: '12px',
                           padding: '10px',
                           color: 'var(--text-secondary)',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           transition: 'all 0.2s ease'
                         }}
                       >
                         <RotateCcw size={18} />
                       </button>
                     )}
                   </div>
                 </div>

                 {/* Progress Bar Gauge */}
                 <div style={{ width: '100%', height: '8px', background: 'rgba(120,120,128,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, (totalPuntaje / 100) * 100)}%` }}
                     transition={{ type: "spring", stiffness: 120, damping: 18 }}
                     style={{ 
                       height: '100%', 
                       background: currentAreaConfig.activeGradient,
                       borderRadius: '999px',
                       boxShadow: `0 0 12px ${currentAreaConfig.accent}`
                     }} 
                   />
                 </div>
               </div>
               
               {/* Groups of Courses with Category-Colored Headers & Tables */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 {groupedSimData.order.map(curso => {
                    const catStyle = getCategoryStyle(curso);
                    const courseItems = groupedSimData.groups[curso];
                    const courseTotalPreguntas = courseItems.reduce((acc, it) => acc + it.preguntas, 0);
                    const courseSubtotal = courseItems.reduce((acc, it) => acc + ((aciertos[it.asignatura] || 0) * it.valor), 0);

                    return (
                      <div 
                        key={curso} 
                        className="ios-glass-card" 
                        style={{ 
                          padding: 'clamp(16px, 3vw, 24px)', 
                          border: `1.5px solid ${catStyle.border}`,
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Course Group Header with vibrant badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '14px', 
                              background: catStyle.badgeBg,
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '1.25rem',
                              flexShrink: 0
                            }}>
                              {catStyle.icon}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                                {curso}
                              </h3>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                {courseTotalPreguntas} preguntas en total
                              </span>
                            </div>
                          </div>

                          {courseSubtotal > 0 && (
                            <span style={{ 
                              background: catStyle.lightBg, 
                              color: catStyle.color, 
                              padding: '5px 12px', 
                              borderRadius: '999px', 
                              fontWeight: 800, 
                              fontSize: '0.82rem',
                              border: `1px solid ${catStyle.border}`
                            }}>
                              +{formatNum(courseSubtotal)} pts acumulados
                            </span>
                          )}
                        </div>
                        
                        {/* 100% Responsive Subject List (Zero Horizontal Scroll on Mobile) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                          {courseItems.map((item, idx) => {
                             const currentAciertos = aciertos[item.asignatura] || 0;
                             const subtotal = currentAciertos * item.valor;
                             const hasAciertos = currentAciertos > 0;
                             
                             return (
                              <div 
                                key={idx} 
                                style={{ 
                                  background: hasAciertos ? catStyle.lightBg : 'rgba(120, 120, 128, 0.05)',
                                  borderRadius: '16px',
                                  padding: '12px 14px',
                                  border: hasAciertos ? `1.5px solid ${catStyle.border}` : '1.5px solid transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: '12px',
                                  transition: 'all 0.2s ease',
                                  boxSizing: 'border-box',
                                  width: '100%'
                                }}
                              >
                                {/* Left Side: Asignatura & Questions info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '130px', flex: '1 1 auto' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '4px', height: '16px', borderRadius: '4px', background: catStyle.color, flexShrink: 0 }} />
                                    <span style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '0.92rem' }}>
                                      {item.asignatura}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', paddingLeft: '12px' }}>
                                    <span style={{ background: 'rgba(120,120,128,0.12)', padding: '2px 7px', borderRadius: '6px', fontWeight: 700 }}>
                                      {item.preguntas} preg.
                                    </span>
                                    <span>•</span>
                                    <span style={{ fontWeight: 600 }}>
                                      {formatNum(item.valor)} pts c/u
                                    </span>
                                  </div>
                                </div>

                                {/* Right Side: Controls and Subtotal in one compact flex group */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                  <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    background: 'var(--card-bg)', 
                                    border: hasAciertos ? `1.5px solid ${catStyle.color}` : '1.5px solid var(--card-border)', 
                                    borderRadius: '14px', 
                                    padding: '2px 4px',
                                    boxShadow: hasAciertos ? `0 4px 12px ${catStyle.lightBg}` : 'none'
                                  }}>
                                    <button 
                                      onClick={() => handleAciertosChange(item.asignatura, item.preguntas, currentAciertos - 1)}
                                      disabled={currentAciertos <= 0}
                                      style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: currentAciertos <= 0 ? 'var(--text-muted)' : 'var(--text-main)', 
                                        cursor: currentAciertos <= 0 ? 'default' : 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        borderRadius: '10px'
                                      }}
                                    >
                                      <Minus size={15} strokeWidth={2.5} />
                                    </button>

                                    <input 
                                      type="number"
                                      min="0"
                                      max={item.preguntas}
                                      value={currentAciertos}
                                      onChange={(e) => handleAciertosChange(item.asignatura, item.preguntas, e.target.value)}
                                      style={{ 
                                        width: '36px', 
                                        textAlign: 'center', 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: hasAciertos ? catStyle.color : 'var(--text-main)', 
                                        fontWeight: 800, 
                                        fontSize: '1rem', 
                                        outline: 'none', 
                                        WebkitAppearance: 'none', 
                                        margin: 0 
                                      }}
                                    />

                                    <button 
                                      onClick={() => handleAciertosChange(item.asignatura, item.preguntas, currentAciertos + 1)}
                                      disabled={currentAciertos >= item.preguntas}
                                      style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: currentAciertos >= item.preguntas ? 'var(--text-muted)' : catStyle.color, 
                                        cursor: currentAciertos >= item.preguntas ? 'default' : 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        borderRadius: '10px'
                                      }}
                                    >
                                      <Plus size={15} strokeWidth={2.5} />
                                    </button>
                                  </div>

                                  <div style={{ minWidth: '60px', textAlign: 'right' }}>
                                    {hasAciertos ? (
                                      <span style={{ 
                                        background: catStyle.gradient, 
                                        color: '#FFFFFF', 
                                        padding: '5px 10px', 
                                        borderRadius: '10px', 
                                        fontWeight: 800, 
                                        fontSize: '0.82rem',
                                        boxShadow: `0 3px 8px ${catStyle.lightBg}`,
                                        display: 'inline-block'
                                      }}>
                                        +{formatNum(subtotal)}
                                      </span>
                                    ) : (
                                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                                        0.00
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                             );
                          })}
                        </div>
                      </div>
                    );
                 })}
               </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      <ReportModal
        isOpen={reportData.isOpen}
        onClose={() => setReportData({ ...reportData, isOpen: false })}
        targetId={reportData.targetId}
        targetTitle={reportData.targetTitle}
        targetType={reportData.targetType}
        onItemHidden={(hiddenId) => {
          const idStr = String(hiddenId);
          setReportedItemIds(prev => {
            if (prev.includes(idStr)) return prev;
            return [...prev, idStr];
          });
          if (activeTab === 'flashcards') {
            setIsFlipped(false);
          }
        }}
      />

      {/* VISTA DEDICADA DE RESULTADOS Y RESPUESTAS DEL EXAMEN */}
      <AnimatePresence>
        {examResultsModal.isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-main, #0F172A)',
            zIndex: 1000150,
            overflowY: 'auto',
            padding: '20px 16px 80px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '820px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              {/* Botón único para volver atrás */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setExamResultsModal(prev => ({ ...prev, isOpen: false }))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={18} /> Volver al Simulador
                </button>

                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  Revisión Detallada de Preguntas
                </span>
              </div>

              {/* Score Header Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(244, 63, 94, 0.08) 100%)',
                border: '1.5px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '20px',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                      Puntaje Ponderado Oficial UNSA (Área {simArea})
                    </span>
                    <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                      {(examResultsModal.unsaWeightedScore || 0).toFixed(4)}{' '}
                      <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 700 }}>/ 100.0000 pts</span>
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '14px',
                    background: examResultsModal.score === examResultsModal.total && examResultsModal.total > 0 ? '#10B981' : (examResultsModal.score > 0 ? 'linear-gradient(135deg, #EC4899, #F43F5E)' : '#6B7280'),
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.25)'
                  }}>
                    {examResultsModal.percentage || 0}% Eficiencia
                  </div>
                </div>

                {/* Metrics Badges Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.14)', color: '#059669', padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                    {examResultsModal.score} Correctas
                  </span>
                  <span style={{ background: 'rgba(239, 68, 68, 0.14)', color: '#DC2626', padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                    {examResultsModal.wrongCount || 0} Incorrectas
                  </span>
                  <span style={{ background: 'rgba(120, 120, 128, 0.14)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                    {examResultsModal.blankCount || 0} Sin responder
                  </span>
                  <span style={{ background: 'rgba(59, 130, 246, 0.14)', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                    Tiempo: {examResultsModal.elapsedTime || '00:00'}
                  </span>
                </div>

                {/* Subject Breakdown Pills */}
                {examResultsModal.aciertosPorAsignatura && Object.keys(examResultsModal.aciertosPorAsignatura).length > 0 && (
                  <div style={{ borderTop: '1px dashed rgba(236, 72, 153, 0.25)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Distribución de Aciertos por Materia:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(examResultsModal.aciertosPorAsignatura).map(([asig, count]) => (
                        <span
                          key={asig}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-main)',
                            padding: '3px 9px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {asig}: <strong style={{ color: '#EC4899' }}>{count}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions & Answers List with CEPREUNSA step-by-step solutions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {examResultsModal.details.map((item, qIdx) => {
                  const isBlank = item.userChoice === null || item.userChoice === undefined;
                  const userLetter = !isBlank ? (['A','B','C','D','E'][item.userChoice] || String.fromCharCode(65 + item.userChoice)) : '';
                  const userOptText = !isBlank && item.options[item.userChoice] !== undefined 
                    ? `(${userLetter}) ${cleanOptionText(item.options[item.userChoice])}` 
                    : 'Sin responder';
                  const correctLetter = item.correctChoice !== undefined && item.correctChoice !== null ? (['A','B','C','D','E'][item.correctChoice] || String.fromCharCode(65 + item.correctChoice)) : '';
                  const correctOptText = `(${correctLetter}) ${cleanOptionText(item.options[item.correctChoice]) || 'N.A.'}`;

                  const cardBg = item.isCorrect 
                    ? 'rgba(16, 185, 129, 0.06)' 
                    : (isBlank ? 'rgba(120, 120, 128, 0.06)' : 'rgba(239, 68, 68, 0.06)');
                  const cardBorder = item.isCorrect 
                    ? '1.5px solid rgba(16, 185, 129, 0.3)' 
                    : (isBlank ? '1.5px solid rgba(120, 120, 128, 0.2)' : '1.5px solid rgba(239, 68, 68, 0.3)');

                  return (
                    <div
                      key={qIdx}
                      style={{
                        padding: '18px 20px',
                        borderRadius: '18px',
                        background: cardBg,
                        border: cardBorder
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                            {qIdx + 1}. {item.question}
                          </span>
                          {item.asignatura && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {normalizeAsignatura(item.asignatura)} {item.semana ? `• Semana ${item.semana}` : ''}
                            </span>
                          )}
                        </div>

                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: item.isCorrect 
                            ? 'rgba(16, 185, 129, 0.18)' 
                            : (isBlank ? 'rgba(120, 120, 128, 0.18)' : 'rgba(239, 68, 68, 0.18)'),
                          color: item.isCorrect ? '#059669' : (isBlank ? 'var(--text-secondary)' : '#DC2626'),
                          flexShrink: 0
                        }}>
                          {item.isCorrect ? 'CORRECTA' : (isBlank ? 'EN BLANCO' : 'INCORRECTA')}
                        </span>
                      </div>

                      {item.imageUrl && (
                        <div style={{ margin: '8px 0 10px', textAlign: 'center' }}>
                          <img
                            src={item.imageUrl}
                            alt="Gráfico"
                            style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain', border: '1px solid var(--card-border)' }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', marginTop: '8px' }}>
                        <div style={{ color: item.isCorrect ? '#059669' : (isBlank ? 'var(--text-secondary)' : '#DC2626'), fontWeight: 700 }}>
                          Tu Respuesta: <span style={{ fontWeight: 800 }}>{userOptText}</span>
                        </div>
                        {!item.isCorrect && (
                          <div style={{ color: '#059669', fontWeight: 700 }}>
                            Respuesta Correcta: <span style={{ fontWeight: 800 }}>{correctOptText}</span>
                          </div>
                        )}

                        {/* Official CEPREUNSA Step-by-Step Solution */}
                        {item.explanation && (
                          <div style={{
                            marginTop: '10px',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: 'rgba(236, 72, 153, 0.07)',
                            border: '1px solid rgba(236, 72, 153, 0.25)',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            color: 'var(--text-main)',
                            whiteSpace: 'pre-line'
                          }}>
                            <div style={{ fontWeight: 800, color: '#EC4899', marginBottom: '4px' }}>
                              Solución Oficial CEPREUNSA:
                            </div>
                            {item.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions Bottom Bar */}
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--card-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setUserExamAnswers({});
                    setCurrentQuestion(0);
                    setSelectedOption(null);
                    setExamTimerSeconds(0);
                    setExamShuffleSeed(prev => prev + 1);
                    setExamResultsModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={15} /> Nuevo Examen
                </button>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {examResultsModal.aciertosPorAsignatura && Object.keys(examResultsModal.aciertosPorAsignatura).length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAciertos(prev => ({
                          ...prev,
                          ...examResultsModal.aciertosPorAsignatura
                        }));
                        setExamResultsModal(prev => ({ ...prev, isOpen: false }));
                        setActiveTab('puntaje');
                      }}
                      style={{
                        padding: '11px 18px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                      }}
                      title="Copiar los aciertos de este examen a la Calculadora Oficial UNSA para ver el desglose por materia"
                    >
                      <BarChart3 size={15} /> Pasar Aciertos a Calculadora
                    </button>
                  )}

                  <button
                    onClick={() => setExamResultsModal(prev => ({ ...prev, isOpen: false }))}
                    style={{
                      padding: '11px 22px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(244, 63, 94, 0.35)'
                    }}
                  >
                    Volver al Simulador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
