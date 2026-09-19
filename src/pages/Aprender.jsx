import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Sparkles,
  Heart,
  Lock,
  Check,
  Play,
  BookOpen,
  Star,
  Trophy,
  Gift,
  X,
  ChevronRight,
  Compass,
  ArrowRight,
  Share2,
  Zap,
  CheckCircle2,
  Target,
  GraduationCap,
  Rocket,
  Orbit,
  Telescope,
  Timer,
  Dna,
  Globe,
  Scale,
  FlaskConical,
  Brain,
  Feather,
  Calculator,
  Languages,
  Landmark,
  FileText,
  Binary,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  SUBJECTS_CONFIG,
  getLessonsForSubject,
  CEPREUNSA_OFFICIAL_THEORY
} from '../data/learningPathData';
import { useGamification } from '../context/GamificationContext';
import { usePomodoro } from '../context/PomodoroContext';
import { LessonEngine } from '../components/aprender/LessonEngine';
import { RankingSimulacroModal } from '../components/RankingSimulacroModal';
import AnimatedCounter from '../components/AnimatedCounter';
import { OrsttyMascot, ArtyonMascot, MascotDialogue } from '../components/Mascots';
import { UnsaCountdownWidget } from '../components/UnsaCountdownWidget';
import { FormulaDisplay } from '../components/FormulaDisplay';

// Iconos vectoriales nítidos para cada una de las 15 asignaturas sin cortes ni desfases tipográficos
export const SubjectLucideIcon = ({ id, size = 18, color = 'currentColor' }) => {
  const norm = (id || '').toLowerCase();
  if (norm.includes('físic') || norm.includes('fisic')) return <Zap size={size} color={color === 'currentColor' ? '#FDE047' : color} fill={color === 'currentColor' ? '#FEF08A' : undefined} strokeWidth={2.4} />;
  if (norm.includes('filosof')) return <Brain size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('biolog')) return <Dna size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('lengua')) return <FileText size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('histor')) return <Landmark size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('psicol')) return <Brain size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('quimic')) return <FlaskConical size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('civic')) return <Scale size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('geograf')) return <Globe size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('logic')) return <Orbit size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('matem')) return <Calculator size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('verbal')) return <Feather size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('literat')) return <BookOpen size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('algeb')) return <Binary size={size} color={color} strokeWidth={2.2} />;
  if (norm.includes('ingl') || norm.includes('engl')) return <Languages size={size} color={color} strokeWidth={2.2} />;
  return <GraduationCap size={size} color={color} strokeWidth={2.2} />;
};

// Consejos especializados de ORSTTY para cada uno de los 15 cursos oficiales UNSA
const SUBJECT_MASCOT_TIPS = {
  'Filosofía': '¡Filosofía define el área de Sociales! Las preguntas sobre Epistemología y Ética se repiten en cada examen ordinario.',
  'Historia': '¡Domina la cronología de las culturas preincas y la República! Suelen venir 3 preguntas directas en admisión.',
  'Lenguaje': '¡Atención a la acentuación diacrítica y la concordancia nominal! Son puntos fijos que no debes regalar.',
  'Literatura': '¡Repasa la Generación del 50 y el Vanguardismo peruano! Preguntas clave de comprensión e interpretación.',
  'Cívica': '¡La Constitución de 1993 y las garantías constitucionales (Habeas Corpus y Amparo) entran siempre!',
  'Geografía': '¡Aprende las 8 regiones naturales de Javier Pulgar Vidal y el relieve peruano al revés y al derecho!',
  'Biología': '¡Biología representa casi 15 preguntas en Biomédicas! Domina Genética mendeliana y Citología celular.',
  'Química': '¡Estequiometría y Enlace Químico son decisivos! Asegura tus despejes y balanceo por tanteo y redox.',
  'Psicología': '¡Procesos cognitivos: memoria, percepción y teorías del aprendizaje son los temas estrella de la UNSA!',
  'Álgebra': '¡Polinomios, Productos Notables y Logaritmos son el corazón de las matemáticas en Ingenierías!',
  'Física': '¡Cinemática, Dinámica y Electrostática! Dibuja siempre tu diagrama de cuerpo libre (DCL) antes de operar.',
  'Raz. Matemático': '¡Planteo de ecuaciones y certezas te dan máxima velocidad! No te quedes más de 2 minutos por ejercicio.',
  'Raz. Lógico': '¡Tablas de verdad y equivalencias lógicas! Resuélvelas con método abreviado para ahorrar valiosos segundos.',
  'Raz. Verbal': '¡Antónimos contextuales y conectores lógicos! Es la sección con mayor peso en el baremo oficial.',
  'Inglés': '¡Comprensión de lectura y tiempos verbales básicos! Asegura esos 5 puntos que marcan la diferencia de ingreso.'
};

// Red de conexiones sinérgicas entre los 15 cursos oficiales de CEPREUNSA (Constelaciones del Saber)
const SUBJECT_CONNECTIONS = {
  'Filosofía': {
    area: 'Sociales y Humanidades',
    connected: ['Historia', 'Lenguaje', 'Cívica'],
    synergyTip: 'El pensamiento crítico de Filosofía fundamenta el análisis histórico y la argumentación en Lenguaje.'
  },
  'Historia': {
    area: 'Sociales y Humanidades',
    connected: ['Filosofía', 'Geografía', 'Cívica'],
    synergyTip: 'Conecta los procesos históricos con las transformaciones del espacio territorial en Geografía.'
  },
  'Lenguaje': {
    area: 'Sociales y Humanidades',
    connected: ['Literatura', 'Raz. Verbal', 'Filosofía'],
    synergyTip: 'La normativa gramatical y sintaxis son la base directa para la comprensión en Raz. Verbal y Literatura.'
  },
  'Literatura': {
    area: 'Sociales y Humanidades',
    connected: ['Lenguaje', 'Historia', 'Raz. Verbal'],
    synergyTip: 'El contexto sociohistórico es indispensable para descifrar las corrientes literarias evaluadas en admisión.'
  },
  'Cívica': {
    area: 'Sociales y Humanidades',
    connected: ['Filosofía', 'Historia', 'Geografía'],
    synergyTip: 'Los derechos constitucionales y la estructura del Estado nacen de la filosofía política y la historia peruana.'
  },
  'Geografía': {
    area: 'Sociales y Humanidades',
    connected: ['Historia', 'Cívica', 'Biología'],
    synergyTip: 'El geosistema y las 8 regiones naturales se articulan con los ecosistemas vivos de Biología.'
  },
  'Biología': {
    area: 'Biomédicas',
    connected: ['Química', 'Psicología', 'Geografía'],
    synergyTip: 'Las bases moleculares de la célula y el ADN dependen directamente de los enlaces de Química.'
  },
  'Química': {
    area: 'Biomédicas / Ciencias',
    connected: ['Biología', 'Física', 'Álgebra'],
    synergyTip: 'La estructura atómica y estequiometría se apoyan en los despejes matemáticos de Álgebra y la Física.'
  },
  'Psicología': {
    area: 'Biomédicas / Sociales',
    connected: ['Biología', 'Filosofía', 'Cívica'],
    synergyTip: 'Las bases neurobiológicas de la memoria y percepción se conectan con el sistema nervioso de Biología.'
  },
  'Álgebra': {
    area: 'Ingenierías / Ciencias',
    connected: ['Física', 'Raz. Matemático', 'Química'],
    synergyTip: 'El dominio de productos notables y polinomios es el motor operativo para resolver ejercicios de Física.'
  },
  'Física': {
    area: 'Ingenierías / Ciencias',
    connected: ['Álgebra', 'Raz. Matemático', 'Química'],
    synergyTip: 'Los vectores y cinemática aplican de forma inmediata las leyes algebraicas y de razonamiento numérico.'
  },
  'Raz. Matemático': {
    area: 'Todas las Áreas',
    connected: ['Álgebra', 'Raz. Lógico', 'Física'],
    synergyTip: 'Las sucesiones y sumatorias te otorgan agilidad mental y velocidad en todas las preguntas de cálculo.'
  },
  'Raz. Lógico': {
    area: 'Todas las Áreas',
    connected: ['Filosofía', 'Raz. Matemático', 'Raz. Verbal'],
    synergyTip: 'Las inferencias y tablas de verdad estructuran el rigor lógico en cualquier carrera que elijas.'
  },
  'Raz. Verbal': {
    area: 'Todas las Áreas',
    connected: ['Lenguaje', 'Literatura', 'Inglés'],
    synergyTip: 'La precisión léxica y comprensión textual representan el mayor porcentaje de puntos en el examen UNSA.'
  },
  'Inglés': {
    area: 'Todas las Áreas',
    connected: ['Raz. Verbal', 'Lenguaje'],
    synergyTip: 'La gramática comparada y la deducción de textos en inglés aseguran tus puntos decisivos de vacante.'
  }
};

// SVGs especiales y dinámicos para los hitos cósmicos del camino astral
const SpaceSatelliteSvg = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="24" width="16" height="16" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
    <line x1="12" y1="24" x2="12" y2="40" stroke="#7DD3FC" strokeWidth="1" />
    <line x1="4" y1="32" x2="20" y2="32" stroke="#7DD3FC" strokeWidth="1" />
    <rect x="20" y="30" width="8" height="4" fill="#94A3B8" />
    <rect x="28" y="20" width="18" height="24" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="37" cy="32" r="4" fill="#F59E0B" />
    <rect x="46" y="30" width="8" height="4" fill="#94A3B8" />
    <rect x="54" y="24" width="16" height="16" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
    <line x1="62" y1="24" x2="62" y2="40" stroke="#7DD3FC" strokeWidth="1" />
    <line x1="54" y1="32" x2="70" y2="32" stroke="#7DD3FC" strokeWidth="1" />
    <path d="M 37 20 L 37 10 M 31 10 Q 37 6 43 10" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    <circle cx="37" cy="6" r="2.5" fill="#EF4444" />
  </svg>
);

const SpaceCrystalSvg = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="crystalGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="50%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#67E8F9" />
      </linearGradient>
    </defs>
    <path d="M 24 4 L 38 16 L 34 40 L 24 44 L 14 40 L 10 16 Z" fill="url(#crystalGlowGrad)" stroke="#F472B6" strokeWidth="1.8" />
    <path d="M 24 4 L 24 44 M 24 16 L 38 16 M 24 16 L 10 16" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.75" />
    <circle cx="32" cy="12" r="1.5" fill="#FFFFFF" />
    <circle cx="16" cy="32" r="1.5" fill="#FFFFFF" />
  </svg>
);

const SpaceTelescopeSvg = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="18" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="2" />
    <rect x="22" y="16" width="28" height="10" rx="3" transform="rotate(-35 30 30)" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
    <circle cx="16" cy="38" r="4" fill="#F59E0B" />
    <path d="M 46 14 L 48 8 L 50 14 L 56 16 L 50 18 L 48 24 L 46 18 L 40 16 Z" fill="#FDE047" />
  </svg>
);

const SpaceVictoryPortalSvg = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="32" rx="26" ry="12" stroke="#FDE047" strokeWidth="2.5" transform="rotate(-18 32 32)" strokeDasharray="6 4" />
    <circle cx="32" cy="32" r="16" fill="#F59E0B" fillOpacity="0.8" />
    <path d="M 32 18 L 35 26 L 43 27 L 37 33 L 39 41 L 32 37 L 25 41 L 27 33 L 21 27 L 29 26 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
  </svg>
);

// Generador de estrellas animadas estilo cartoon con tonos cálidos y dorados
const ANIMATED_STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${(i * 13 + 4) % 94}%`,
  left: `${(i * 23 + 7) % 92}%`,
  type: i % 3 === 0 ? 'star' : i % 2 === 0 ? 'sparkle' : 'dot',
  size: i % 3 === 0 ? 15 : i % 2 === 0 ? 12 : 5,
  color: i % 3 === 0 ? '#FDE047' : i % 2 === 0 ? '#FBBF24' : '#FEF08A',
  duration: 2.2 + ((i * 7) % 20) / 10,
  delay: ((i * 9) % 18) / 10
}));

// Componente orbital de Anillo de Progreso Planetario Estilo Duolingo con iluminación de partes (subtemas)
export const PlanetProgressRing = ({
  size = 104,
  totalParts = 4,
  completedParts = 0,
  color = '#38BDF8',
  isCurrent = false,
  isMastered = false,
  isChest = false,
  isTrophy = false
}) => {
  if (isChest || isTrophy || totalParts <= 1) return null;

  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const parts = Math.max(1, totalParts);
  const gap = parts > 1 ? 8 : 0;
  const segmentLength = Math.max(1, (circumference / parts) - gap);

  const segments = [];
  for (let i = 0; i < parts; i++) {
    const isCompleted = isMastered || i < completedParts;
    const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
    const strokeDashoffset = -((circumference / parts) * i) + (gap / 2);

    segments.push(
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={
          isCompleted
            ? (color || '#FDE047')
            : isCurrent
              ? 'rgba(255, 255, 255, 0.22)'
              : 'rgba(148, 163, 184, 0.14)'
        }
        strokeWidth={isCompleted ? 4.5 : 2.5}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{
          filter: isCompleted ? `drop-shadow(0 0 7px ${color || '#FDE047'})` : 'none',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: 'rotate(-90deg)',
          overflow: 'visible'
        }}
      >
        {segments}
      </svg>
      {/* Satélites luminosos o lunas orbitales en los nodos de los anillos */}
      {Array.from({ length: parts }).map((_, idx) => {
        const isDone = isMastered || idx < completedParts;
        const angle = (idx * (360 / parts) - 90) * (Math.PI / 180);
        const dotX = size / 2 + radius * Math.cos(angle);
        const dotY = size / 2 + radius * Math.sin(angle);

        return (
          <div
            key={`orb_${idx}`}
            style={{
              position: 'absolute',
              left: `${dotX}px`,
              top: `${dotY}px`,
              transform: 'translate(-50%, -50%)',
              width: isDone ? '8px' : '5px',
              height: isDone ? '8px' : '5px',
              borderRadius: '50%',
              background: isDone ? '#FFFFFF' : 'rgba(148, 163, 184, 0.35)',
              boxShadow: isDone ? `0 0 10px #FFFFFF, 0 0 16px ${color || '#FDE047'}` : 'none',
              border: isDone ? `1.5px solid ${color || '#FDE047'}` : 'none',
              zIndex: 3,
              transition: 'all 0.4s ease'
            }}
          />
        );
      })}
    </div>
  );
};

export const Aprender = () => {
  const { streak, xp, level, currentLevelProgress, hearts, completedLessons, addXp, recordLessonCompletion } = useGamification();

  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_CONFIG[0]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de navegación entre los 15 cursos oficiales de la Matriz CEPREUNSA
  const [showAllCoursesModal, setShowAllCoursesModal] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const coursesScrollRef = useRef(null);

  const scrollCourses = (direction) => {
    if (coursesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      coursesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCourses = SUBJECTS_CONFIG;

  const searchedCoursesInModal = useMemo(() => {
    const q = courseSearchQuery.trim().toLowerCase();
    return SUBJECTS_CONFIG.filter((subj) => {
      if (!q) return true;
      return (
        subj.name.toLowerCase().includes(q) ||
        (subj.description || '').toLowerCase().includes(q)
      );
    });
  }, [courseSearchQuery]);

  // Lección activa para jugar en LessonEngine
  const [activeLesson, setActiveLesson] = useState(null);

  // Modales
  const [previewNode, setPreviewNode] = useState(null);
  const [expandedTheorySubId, setExpandedTheorySubId] = useState(null);
  const [showUnitGuide, setShowUnitGuide] = useState(false);
  const [chestModal, setChestModal] = useState(null);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const { openModal: openPomodoroModal } = usePomodoro();

  // Cargar lecciones cada vez que se cambia de materia
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getLessonsForSubject(selectedSubject.id).then((loaded) => {
      if (isMounted) {
        setLessons(loaded);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSubject]);

  // Conteo de lecciones completadas
  const completedCount = useMemo(() => {
    return lessons.filter((l) => completedLessons[l.id]).length;
  }, [lessons, completedLessons]);

  // Coordenadas x para el camino sinuoso (curva sinusoidal cósmica pronunciada)
  // Crea una serpenteante carretera galáctica estilo Duolingo espacial:
  // Centro (Astro 1) -> Izquierda profunda (-78px) -> Derecha (72px) -> Izquierda Cofre (-82px) -> Derecha (76px) -> Izquierda (-72px) -> Derecha (80px) -> Centro Trofeo (0px)
  const pathOffsets = useMemo(() => [0, -78, 72, -82, 76, -72, 80, 0], []);

  // Generar el trazado SVG continuo que representa el "Rastro Astral" con curvas fluidas
  const svgConnectorPath = useMemo(() => {
    if (lessons.length === 0) return '';
    const startY = 53; // Centro vertical exacto del primer nodo (14px top + 39px radio)
    const stepY = 175; // Paso vertical idéntico al renderizado de los nodos
    const centerX = 210; // Centro relativo al viewBox de 420px de ancho

    let d = '';
    for (let i = 0; i < lessons.length; i++) {
      const currX = centerX + pathOffsets[i % pathOffsets.length];
      const currY = startY + i * stepY;
      if (i === 0) {
        d += `M ${currX} ${currY}`;
      } else {
        const prevX = centerX + pathOffsets[(i - 1) % pathOffsets.length];
        const prevY = startY + (i - 1) * stepY;
        const cpY1 = prevY + (currY - prevY) * 0.52;
        const cpY2 = prevY + (currY - prevY) * 0.48;
        d += ` C ${prevX} ${cpY1}, ${currX} ${cpY2}, ${currX} ${currY}`;
      }
    }
    return d;
  }, [lessons, pathOffsets]);

  // Datos de conexión sinérgica del curso actual
  const currentConnection = SUBJECT_CONNECTIONS[selectedSubject.name] || SUBJECT_CONNECTIONS[selectedSubject.id] || {
    connected: [],
    synergyTip: 'Domina los conceptos fundamentales para asegurar tu vacante en la UNSA.'
  };

  const handleClaimChest = (lesson) => {
    const isAlreadyClaimed = Boolean(completedLessons[lesson.id]);
    if (!isAlreadyClaimed) {
      if (typeof recordLessonCompletion === 'function') {
        recordLessonCompletion(lesson.id, lesson.xpReward || 50, 3);
      } else if (typeof addXp === 'function') {
        addXp(lesson.xpReward || 50);
      }
      setChestModal({ ...lesson, alreadyClaimed: false });
    } else {
      setChestModal({ ...lesson, alreadyClaimed: true });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: '#020617',
        color: '#F8FAFC',
        overflowX: 'hidden'
      }}
    >
      {/* ================= FONDO CÓSMICO DEEP SPACE "RASTRO • ASTRO" A PANTALLA COMPLETA ================= */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(180deg, rgba(15, 23, 42, 0.58) 0%, rgba(10, 15, 30, 0.68) 40%, rgba(8, 12, 24, 0.88) 100%),
            radial-gradient(ellipse 70% 60% at 20% 15%, rgba(245, 158, 11, 0.38) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 85% 45%, rgba(253, 224, 71, 0.26) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 50% 90%, ${selectedSubject.color}25 0%, transparent 70%),
            url('/assets/rastro-astro-animated-bg.jpg')
          `,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'contrast(1.05) brightness(1.05)'
        }}
      >
        {/* ESTRELLAS ESTILO CARTOON OPTIMIZADAS (CERO SOBRECARGA DE GPU/CPU) */}
        {ANIMATED_STARS.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              pointerEvents: 'none',
              opacity: star.type === 'dot' ? 0.7 : 0.85,
              transform: 'translateZ(0)'
            }}
          >
            {star.type === 'star' ? (
              <span style={{ fontSize: `${star.size}px` }}>⭐</span>
            ) : star.type === 'sparkle' ? (
              <span style={{ fontSize: `${star.size}px` }}>✨</span>
            ) : (
              <div
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: '50%',
                  background: star.color,
                  boxShadow: `0 0 6px ${star.color}`
                }}
              />
            )}
          </div>
        ))}


        {/* Planeta decorativo con anillo astral en marca de agua */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            right: '-2%',
            fontSize: '8.5rem',
            opacity: 0.16,
            filter: 'blur(1px) drop-shadow(0 0 25px rgba(253, 224, 71, 0.4))',
            transform: 'rotate(-15deg)',
            userSelect: 'none'
          }}
        >
          🪐
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL CENTRADO */}
      <div
        className="page-container"
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          boxSizing: 'border-box',
          paddingTop: 'clamp(84px, 11vh, 96px)',
          paddingBottom: '120px',
          paddingLeft: 'clamp(10px, 3vw, 16px)',
          paddingRight: 'clamp(10px, 3vw, 16px)',
          maxWidth: '860px',
          margin: '0 auto'
        }}
      >

        {/* ================= BARRA DE ESTADO / HUD DE NAVEGACIÓN ASTRAL ================= */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            padding: '8px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
            marginBottom: '16px'
          }}
        >
          {/* Racha Diaria (Fuego Estelar) */}
          <div
            title="Racha de estudio continuo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.16)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              padding: '6px 12px',
              borderRadius: '999px',
              color: '#F87171',
              fontWeight: 900,
              fontSize: '0.86rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Flame size={18} fill="#EF4444" color="#EF4444" />
            </div>
            <AnimatedCounter value={streak} suffix=" d" duration={700} />
          </div>

          {/* Nivel y Barra XP */}
          <div
            title="Nivel de expedición y experiencia acumulada"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 158, 11, 0.16)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              padding: '6px 12px',
              borderRadius: '999px',
              color: '#FBBF24',
              fontWeight: 900,
              fontSize: '0.86rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', color: '#FDE047' }}>
              <Sparkles size={16} />
            </div>
            <span>Nv. {level}</span>
            <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 700 }}>
              (<AnimatedCounter value={currentLevelProgress} suffix=" XP" duration={900} />)
            </span>
          </div>

          {/* Vidas / Escudos */}
          <div
            title="Escudos / Vidas disponibles"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#F87171',
              fontWeight: 900,
              fontSize: '0.88rem',
              background: 'rgba(239, 68, 68, 0.16)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              padding: '6px 12px',
              borderRadius: '999px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Heart size={16} fill="#EF4444" color="#EF4444" />
            </div>
            <span>{hearts}</span>
          </div>

          {/* Botón de Pomodoro de Estudio */}
          <button
            type="button"
            onClick={openPomodoroModal}
            className="duo-btn-3d"
            title="Temporizador Pomodoro de Estudio"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1.5px solid #A855F7',
              padding: '6px 12px',
              borderRadius: '999px',
              color: '#E9D5FF',
              fontWeight: 900,
              fontSize: '0.84rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Timer size={16} color="#C084FC" />
            <span>Pomodoro</span>
          </button>

          {/* Botón de Ranking Oficial UNSA */}
          <button
            type="button"
            onClick={() => setShowRankingModal(true)}
            className="duo-btn-3d"
            title="Ver Ranking Oficial de Simulacros UNSA"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.32), rgba(217, 119, 6, 0.38))',
              border: '1.5px solid #F59E0B',
              padding: '6px 14px',
              borderRadius: '999px',
              color: '#FEF08A',
              fontWeight: 900,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Trophy size={16} color="#FDE047" />
            <span>Ranking</span>
          </button>
        </div>

        {/* ================= CRONÓMETRO Y CALENDARIO OFICIAL ADMISIÓN UNSA 2027 ================= */}
        <div style={{ marginBottom: '18px' }}>
          <UnsaCountdownWidget />
        </div>

        {/* ================= HEADER DE LA MATRIZ GENERAL Y BOTÓN VER 15 CURSOS ================= */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#FDE047" />
              <span style={{ fontSize: '0.84rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FEF08A' }}>
                Matriz General CEPREUNSA (15 Asignaturas de Admisión)
              </span>
            </div>

            {/* BOTÓN PROMINENTE VER LOS 15 CURSOS */}
            <motion.button
              type="button"
              onClick={() => setShowAllCoursesModal(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.24), rgba(217, 119, 6, 0.32))',
                border: '1.5px solid #F59E0B',
                borderRadius: '12px',
                color: '#FEF08A',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <LayoutGrid size={15} color="#FDE047" />
              <span>Ver los 15 Cursos (Matriz Completa)</span>
            </motion.button>
          </div>
        </div>

        {/* ================= CÁPSULAS ASTRALES CON CONTROLES DE DESPLAZAMIENTO ================= */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => scrollCourses('left')}
              title="Desplazar a la izquierda"
              style={{
                width: '32px',
                height: '38px',
                flexShrink: 0,
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <div
              ref={coursesScrollRef}
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '8px',
                paddingTop: '2px',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                paddingLeft: '2px',
                paddingRight: '2px',
                flex: 1
              }}
            >
              {filteredCourses.map((subj) => {
                const isSelected = selectedSubject.id === subj.id;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj)}
                    className="duo-btn-3d"
                    style={{
                      padding: '10px 18px',
                      minWidth: 'max-content',
                      boxSizing: 'border-box',
                      borderRadius: '18px',
                      border: isSelected ? `2px solid ${subj.color}` : '1.5px solid rgba(255, 255, 255, 0.14)',
                      background: isSelected ? subj.color : 'rgba(15, 23, 42, 0.72)',
                      color: '#FFFFFF',
                      boxShadow: isSelected
                        ? `0 5px 0 ${subj.color}99, 0 8px 24px ${subj.color}66`
                        : '0 3px 0 rgba(0, 0, 0, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '9px',
                      cursor: 'pointer',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      backdropFilter: 'blur(14px)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SubjectLucideIcon id={subj.id} size={18} color={isSelected ? '#FFFFFF' : subj.color} />
                    </span>
                    <span style={{ letterSpacing: '0.01em' }}>{subj.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollCourses('right')}
              title="Desplazar a la derecha"
              style={{
                width: '32px',
                height: '38px',
                flexShrink: 0,
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Subtítulo informativo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 4px', fontSize: '0.74rem', color: '#64748B' }}>
            <span>Mostrando {filteredCourses.length} de {SUBJECTS_CONFIG.length} cursos oficiales CEPREUNSA</span>
            <span style={{ color: '#FDE047' }}>10 Semanas • 40+ lecciones oficiales por curso</span>
          </div>
        </div>

        {/* ================= TARJETA DE MISIÓN ORBITAL + RED DE CONSTELACIONES ================= */}
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${selectedSubject.color} 0%, rgba(15, 23, 42, 0.95) 100%)`,
              borderRadius: '28px',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              padding: 'clamp(18px, 4vw, 26px)',
              color: '#FFFFFF',
              boxShadow: `0 16px 40px ${selectedSubject.color}45, 0 0 20px ${selectedSubject.color}25`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header de la Misión con Astro Mascota y Guía Oficial integrados sin colisiones */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2, gap: '10px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Orbit size={12} /> MISIÓN ORBITAL 1
                  </span>
                  <span style={{ fontSize: '0.74rem', opacity: 0.95, fontWeight: 800, color: '#FEF08A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#FDE047" /> Temario Universal UNSA
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: 900, margin: '4px 0 6px', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {selectedSubject.name}
                </h1>
                <p style={{ margin: 0, fontSize: '0.86rem', opacity: 0.92, maxWidth: '480px', lineHeight: 1.42 }}>
                  {selectedSubject.description}
                </p>
              </div>

              {/* Botón Guía Oficial + Mascota Oficial ORSTTY */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ pointerEvents: 'none', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))' }}>
                  <OrsttyMascot mood="emocionado" size={62} />
                </div>

                <button
                  onClick={() => setShowUnitGuide(true)}
                  className="duo-btn-3d"
                  style={{
                    background: '#FFFFFF',
                    color: selectedSubject.color,
                    border: 'none',
                    borderRadius: '14px',
                    padding: '8px 14px',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 3px 0 rgba(0,0,0,0.25), 0 6px 14px rgba(0,0,0,0.2)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <BookOpen size={15} strokeWidth={2.6} />
                  <span>Guía Oficial</span>
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESO DE LA MISIÓN CON RESPLANDOR Y HAZ DE LUZ */}
            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  flex: 1,
                  height: '14px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  padding: '2px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: `${Math.max(8, (completedCount / (lessons.length || 1)) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #FFFFFF, #FDE047)',
                    borderRadius: '999px',
                    boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)',
                    transition: 'width 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Destello de estrella que recorre la barra animada */}
                  <motion.div
                    animate={{ x: ['-100%', '240%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '45%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, opacity: 0.95, whiteSpace: 'nowrap' }}>
                {completedCount} / {lessons.length} completado
              </span>
            </div>

            {/* Astro decorativo de fondo */}
            <div
              style={{
                position: 'absolute',
                right: '40px',
                bottom: '-25px',
                fontSize: '6.5rem',
                opacity: 0.1,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              {selectedSubject.icon}
            </div>
          </div>
        </div>

        {/* ================= BANNER COMPETITIVO: RANKING REAL DE SIMULACROS UNSA ================= */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowRankingModal(true)}
          style={{
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.96) 100%)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '22px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <motion.div
              animate={{
                rotate: [-3, 3, -3],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.5)'
              }}
            >
              <Trophy size={24} />
            </motion.div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FEF08A' }}>
                  Ranking de Simulacros UNSA
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.25)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  OFICIAL
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Comparativa de puntajes reales de postulantes • Podio y corte de vacante
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 900, fontSize: '0.82rem', flexShrink: 0 }}>
            <span>Ver Podio</span>
            <ChevronRight size={16} />
          </div>
        </motion.div>

        {/* ================= COMPAÑERO DE ESTUDIO ORSTTY (DUOLINGO STYLE) ================= */}
        <div style={{ marginBottom: '22px' }}>
          <MascotDialogue
            mascotMood="cheering"
            title={`Consejo ORSTTY • ${selectedSubject.name}`}
            message={SUBJECT_MASCOT_TIPS[selectedSubject.name] || '¡Cada tema dominado te acerca a tu vacante! Domina la teoría y luego practica las preguntas fijas.'}
            actionText="Iniciar Temporizador Pomodoro 🍅"
            onAction={openPomodoroModal}
          />
        </div>

        {/* ================= TABLERO ESPACIAL DE NAVEGACIÓN "RASTRO" (ESTILO ASTRO OBSERVATORIO) ================= */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(24, 18, 52, 0.38) 0%, rgba(15, 23, 42, 0.52) 50%, rgba(10, 14, 28, 0.65) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(251, 191, 36, 0.48)',
            borderRadius: '36px',
            boxShadow: `
              0 24px 70px rgba(0, 0, 0, 0.55),
              inset 0 0 60px rgba(245, 158, 11, 0.12),
              inset 0 2px 0 rgba(255, 255, 255, 0.3),
              0 0 40px rgba(245, 158, 11, 0.22)
            `,
            padding: '28px 16px 64px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* LUZ ESTELAR SUPERIOR (GOLDEN AURORA LINE) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FDE047, #F59E0B, #FDE047, transparent)',
              boxShadow: '0 0 14px #FDE047'
            }}
          />

          {/* DECORACIÓN CÓSMICA INTERIOR (NEBULOSAS LUMINOSAS) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(245, 158, 11, 0.16) 0%, transparent 45%),
                radial-gradient(circle at 85% 60%, ${selectedSubject.color}22 0%, transparent 45%),
                radial-gradient(circle at 50% 88%, rgba(253, 224, 71, 0.14) 0%, transparent 50%)
              `
            }}
          />

          {/* CONSTELACIONES Y ESTRELLAS FLOTANTES DECORATIVAS */}
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '28px', left: '22px', fontSize: '1.4rem', pointerEvents: 'none', filter: 'drop-shadow(0 0 8px #FDE047)' }}
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.6, 0.95, 0.6] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: '150px', right: '22px', fontSize: '1.3rem', pointerEvents: 'none', filter: 'drop-shadow(0 0 8px #FBBF24)' }}
          >
            ⭐
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '340px', left: '16px', fontSize: '1.35rem', pointerEvents: 'none' }}
          >
            🪐
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '540px', right: '18px', fontSize: '1.3rem', pointerEvents: 'none', filter: 'drop-shadow(0 0 8px #38BDF8)' }}
          >
            🌟
          </motion.div>
          <div style={{ position: 'absolute', bottom: '45px', left: '24px', fontSize: '1.3rem', opacity: 0.7, pointerEvents: 'none' }}>💫</div>
          <div style={{ position: 'absolute', bottom: '120px', right: '26px', fontSize: '1.25rem', opacity: 0.65, pointerEvents: 'none' }}>✨</div>

          {/* CABECERA OBSERVATORIO CÓSMICO (BANNER DE PROGRESO Y STATUS DE CLASE) */}
          <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
            {/* Pill principal con brillo estelar */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.22) 100%)',
                border: '1.5px solid rgba(251, 191, 36, 0.75)',
                padding: '9px 24px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 900,
                color: '#FEF08A',
                boxShadow: '0 0 26px rgba(245, 158, 11, 0.45), 0 4px 14px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <Sparkles size={16} color="#FDE047" />
              <span>SISTEMA ASTRAL • {selectedSubject.name.toUpperCase()}</span>
              <Star size={15} fill="#FBBF24" color="#FBBF24" />
            </div>

            {/* Sub-tarjeta de estatus cósmico de la clase */}
            <div
              style={{
                maxWidth: '380px',
                margin: '12px auto 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '18px',
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#CBD5E1',
                boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FDE047' }}>
                <Star size={14} fill="#FBBF24" color="#FBBF24" />
                {Object.keys(completedLessons).filter((k) => k.startsWith(`${selectedSubject.id}_`)).length} / {lessons.length} Astros
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#67E8F9' }}>
                ⚡ +{lessons.length * 25} XP Meta
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ color: '#A7F3D0' }}>
                🎓 100% Universal
              </span>
            </div>
          </div>

          {/* CONTENEDOR DE LA ESTELA CON EL RASTRO ASTRAL SVG */}
          <div
            style={{
              maxWidth: '420px',
              margin: '0 auto',
              position: 'relative',
              minHeight: `${lessons.length * 175}px`
            }}
          >
            {/* TRAZADO DEL "RASTRO" ASTRAL: POLVO DE ESTRELLAS Y CARRETERA CÓSMICA (GPU ACCELERATED) */}
            <svg
              viewBox={`0 0 420 ${Math.max(lessons.length * 175, 320)}`}
              preserveAspectRatio="xMidYMid meet"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                transform: 'translateZ(0)'
              }}
            >
              <defs>
                {/* Gradiente luminoso del Rastro Cósmico con tonos amarillos y dorados estelares */}
                <linearGradient id="rastroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" stopOpacity="1" />
                  <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.95" />
                  <stop offset="70%" stopColor={selectedSubject.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Rastro exterior difuminado (Nebulosa dorada guía) */}
              <path
                d={svgConnectorPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="28"
                strokeLinecap="round"
                strokeOpacity="0.16"
              />

              {/* Pista de estela espacial con resplandor dorado suave */}
              <path
                d={svgConnectorPath}
                fill="none"
                stroke="rgba(253, 224, 71, 0.3)"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* El Rastro Astral Luminoso (Polvo de estrellas doradas y amarillas) */}
              <path
                d={svgConnectorPath}
                fill="none"
                stroke="url(#rastroGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="14 10"
              />
            </svg>

            {/* NODOS PLANETARIOS (LECCIONES, METEORITO COFRE Y SUPERNOVA TROFEO) */}
            {isLoading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: '#94A3B8', position: 'relative', zIndex: 3 }}>
                <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px', display: 'block', color: '#38BDF8' }} />
                <p style={{ fontWeight: 800, fontSize: '1.05rem' }}>Alineando órbitas de estudio...</p>
              </div>
            ) : (
              lessons.map((lesson, idx) => {
                const currentOffset = pathOffsets[idx % pathOffsets.length];
                const isChest = lesson.nodeType === 'chest';
                const isTrophy = lesson.nodeType === 'trophy';
                const totalParts = lesson.subtemas?.length || 1;
                const completedParts = lesson.subtemas && lesson.subtemas.length > 0
                  ? lesson.subtemas.filter((st) => completedLessons[st.id] || completedLessons[lesson.id]).length
                  : (completedLessons[lesson.id] ? 1 : 0);
                const isPlanetMastered = (lesson.subtemas && lesson.subtemas.length > 0)
                  ? (completedParts >= totalParts || Boolean(completedLessons[lesson.id]))
                  : Boolean(completedLessons[lesson.id]);
                const isCompleted = isPlanetMastered;
                const prevLesson = lessons[idx - 1];
                const isPrevCompleted = idx === 0 || Boolean(completedLessons[prevLesson?.id]) || (
                  prevLesson?.subtemas && prevLesson.subtemas.length > 0 &&
                  prevLesson.subtemas.every(st => completedLessons[st.id] || completedLessons[prevLesson.id])
                );
                const isUnlocked = idx === 0 || isPrevCompleted;
                const isCurrent = isUnlocked && !isCompleted;

                const posY = 14 + idx * 175;

                return (
                  <div
                    key={lesson.id}
                    style={{
                      position: 'absolute',
                      top: `${posY}px`,
                      left: '50%',
                      transform: `translateX(calc(-50% + ${currentOffset}px))`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 4,
                      width: '200px'
                    }}
                  >
                    {/* COMPAÑERO ORSTTY O HITO CÓSMICO AL COSTADO DEL NODO (GPU ACCELERATED CSS) */}
                    {/* 1. Si es el nodo activo: ORSTTY al costado animado estilo Duolingo */}
                    {isCurrent && (
                      <div
                        className="rastro-float-mascot"
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          ...(currentOffset <= 0 ? { left: '138px' } : { right: '138px' }),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          zIndex: 6,
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #7E22CE 0%, #581C87 100%)',
                            color: '#FFFFFF',
                            border: '1.5px solid #D8B4FE',
                            borderRadius: '12px',
                            padding: '3px 8px',
                            fontSize: '0.64rem',
                            fontWeight: 900,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(126, 34, 206, 0.45)',
                            marginBottom: '4px',
                            letterSpacing: '0.02em'
                          }}
                        >
                          ¡Tú puedes! 💜
                        </div>
                        <OrsttyMascot size={56} mood="cheering" />
                        <div
                          style={{
                            width: '40px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0) 75%)',
                            marginTop: '-4px',
                            filter: 'blur(1px)'
                          }}
                        />
                      </div>
                    )}

                    {/* 2. Si no es el nodo activo pero es Astro 2 (idx === 1): Satélite espacial */}
                    {!isCurrent && idx === 1 && (
                      <div
                        className="rastro-float-satellite"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          ...(currentOffset <= 0 ? { left: '140px' } : { right: '140px' }),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }}
                      >
                        <SpaceSatelliteSvg size={42} />
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#38BDF8', background: 'rgba(15, 23, 42, 0.75)', padding: '1px 6px', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.3)', whiteSpace: 'nowrap' }}>
                          Satélite UNSA 🛰️
                        </span>
                      </div>
                    )}

                    {/* 3. Si no es el nodo activo pero es Cofre (isChest o idx === 3): Cristales cósmicos de XP */}
                    {!isCurrent && (isChest || idx === 3) && (
                      <div
                        className="rastro-float-crystal"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          ...(currentOffset <= 0 ? { left: '142px' } : { right: '142px' }),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }}
                      >
                        <SpaceCrystalSvg size={40} />
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#F472B6', background: 'rgba(15, 23, 42, 0.75)', padding: '1px 6px', borderRadius: '999px', border: '1px solid rgba(244, 114, 182, 0.3)', whiteSpace: 'nowrap' }}>
                          Cristal XP 💎
                        </span>
                      </div>
                    )}

                    {/* 4. Si no es el nodo activo pero es Astro 6 (idx === 5): Telescopio de cielo profundo */}
                    {!isCurrent && idx === 5 && (
                      <div
                        className="rastro-float-mascot"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          ...(currentOffset <= 0 ? { left: '140px' } : { right: '140px' }),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }}
                      >
                        <SpaceTelescopeSvg size={42} />
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#FDE047', background: 'rgba(15, 23, 42, 0.75)', padding: '1px 6px', borderRadius: '999px', border: '1px solid rgba(253, 224, 71, 0.3)', whiteSpace: 'nowrap' }}>
                          Observatorio 🔭
                        </span>
                      </div>
                    )}

                    {/* 5. Si no es el nodo activo pero es Trofeo (isTrophy o idx === 7): Portal de Ingreso Final */}
                    {!isCurrent && (isTrophy || idx === 7) && (
                      <div
                        className="rastro-float-satellite"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          ...(currentOffset <= 0 ? { left: '142px' } : { right: '142px' }),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          zIndex: 3,
                          pointerEvents: 'none'
                        }}
                      >
                        <SpaceVictoryPortalSvg size={46} />
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#FEF08A', background: 'rgba(15, 23, 42, 0.8)', padding: '1px 6px', borderRadius: '999px', border: '1px solid rgba(254, 240, 138, 0.4)', whiteSpace: 'nowrap' }}>
                          Meta Vacante 🏆
                        </span>
                      </div>
                    )}

                    {/* BOCADILLO DUOLINGO CON RESPLANDOR ASTRAL */}
                    {isCurrent && (
                      <div
                        className="rastro-float-mascot"
                        onClick={() => {
                          if (isChest) {
                            handleClaimChest(lesson);
                          } else {
                            setPreviewNode({ ...lesson, idx });
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '-48px',
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          color: '#FFFFFF',
                          border: '2px solid #FEF08A',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          padding: '6px 16px',
                          borderRadius: '16px',
                          boxShadow: '0 0 28px rgba(245, 158, 11, 0.75), 0 4px 12px rgba(0,0,0,0.5)',
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Sparkles size={14} color="#FEF08A" />
                        ¡SIGUIENTE ASTRO!
                        {/* Flecha apuntando al nodo */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-7px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid #D97706'
                          }}
                        />
                      </div>
                    )}

                    {/* HALO / CORONA PULSANTE PARA EL NODO ACTIVO (GPU CSS) */}
                    {isCurrent && (
                      <div
                        className="rastro-pulse-ring"
                        style={{
                          position: 'absolute',
                          top: isTrophy ? '-10px' : isChest ? '-8px' : '-6px',
                          width: isTrophy ? '106px' : isChest ? '100px' : '96px',
                          height: isTrophy ? '106px' : isChest ? '100px' : '96px',
                          borderRadius: isChest ? '30px' : '50%',
                          border: `2.5px solid ${selectedSubject.color}`,
                          boxShadow: `0 0 30px ${selectedSubject.color}, inset 0 0 20px ${selectedSubject.color}`,
                          pointerEvents: 'none',
                          zIndex: 1
                        }}
                      />
                    )}

                    {/* ANILLO DE PROGRESO DE SUBTEMAS ESTILO DUOLINGO CON ILUMINACIÓN ORBITAL */}
                    <PlanetProgressRing
                      size={isTrophy ? 116 : isChest ? 108 : 104}
                      totalParts={totalParts}
                      completedParts={completedParts}
                      color={selectedSubject.color}
                      isCurrent={isCurrent}
                      isMastered={isPlanetMastered}
                      isChest={isChest}
                      isTrophy={isTrophy}
                    />

                    {/* BOTÓN 3D PLANETARIO CON RELIEVE Y CORONA GRAVITACIONAL */}
                    <motion.button
                      whileHover={isUnlocked ? { scale: 1.06 } : {}}
                      whileTap={isUnlocked ? { scale: 0.92, y: 5 } : {}}
                      onClick={() => {
                        if (isUnlocked) {
                          if (isChest) {
                            handleClaimChest(lesson);
                          } else {
                            setPreviewNode({ ...lesson, idx });
                          }
                        }
                      }}
                      className="duo-btn-3d"
                      style={{
                        width: isTrophy ? '88px' : isChest ? '82px' : '78px',
                        height: isTrophy ? '88px' : isChest ? '82px' : '78px',
                        borderRadius: isChest ? '24px' : '50%',
                        border: isCompleted
                          ? '3px solid #6EE7B7'
                          : isCurrent
                            ? '3.5px solid #FFFFFF'
                            : '2px solid rgba(148, 163, 184, 0.35)',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 3,
                        background: isCompleted
                          ? 'radial-gradient(circle at 35% 30%, #6EE7B7 0%, #10B981 55%, #064E3B 100%)'
                          : isTrophy
                            ? 'radial-gradient(circle at 35% 30%, #FEF08A 0%, #F59E0B 50%, #92400E 100%)'
                            : isChest
                              ? 'radial-gradient(circle at 35% 30%, #F472B6 0%, #DB2777 50%, #831843 100%)'
                              : isCurrent
                                ? `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${selectedSubject.color} 52%, #1E1B4B 100%)`
                                : 'radial-gradient(circle at 35% 30%, rgba(148, 163, 184, 0.45) 0%, rgba(30, 41, 59, 0.9) 55%, rgba(15, 23, 42, 0.98) 100%)',
                        boxShadow: isCompleted
                          ? '0 9px 0 #047857, 0 0 28px rgba(16, 185, 129, 0.7), inset 0 2px 8px rgba(255,255,255,0.4)'
                          : isTrophy
                            ? '0 10px 0 #78350F, 0 0 35px rgba(245, 158, 11, 0.8), inset 0 2px 10px rgba(255,255,255,0.6)'
                            : isChest
                              ? '0 9px 0 #700738, 0 0 30px rgba(236, 72, 153, 0.7), inset 0 2px 8px rgba(255,255,255,0.4)'
                              : isCurrent
                                ? `0 10px 0 rgba(0,0,0,0.5), 0 0 34px ${selectedSubject.color}, inset 0 3px 10px rgba(255,255,255,0.6)`
                                : '0 8px 0 rgba(15, 23, 42, 0.9), 0 0 16px rgba(99, 102, 241, 0.2), inset 0 1px 4px rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      {isCompleted ? (
                        <Check size={38} strokeWidth={3.5} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                      ) : isTrophy ? (
                        <Trophy size={38} color="#FFFFFF" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                      ) : isChest ? (
                        <Gift size={36} color="#FFFFFF" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                      ) : isCurrent ? (
                        <Play size={34} fill="#FFFFFF" style={{ marginLeft: '4px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }} />
                      ) : (
                        <Lock size={26} color="#94A3B8" style={{ filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.5))' }} />
                      )}

                      {/* 3 Estrellas de oro orbital si completado */}
                      {isCompleted && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-14px',
                            display: 'flex',
                            gap: '3px',
                            background: '#0F172A',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            boxShadow: '0 0 16px rgba(245, 158, 11, 0.6)',
                            border: '1.5px solid #F59E0B'
                          }}
                        >
                          {[1, 2, 3].map((s) => (
                            <Star key={s} size={13} fill="#F59E0B" color="#F59E0B" />
                          ))}
                        </div>
                      )}
                    </motion.button>

                    {/* TARJETA CÓSMICA DE INFORMACIÓN DEL NIVEL / ASTRO */}
                    <div
                      whileHover={isUnlocked ? { scale: 1.03 } : {}}
                      onClick={() => {
                        if (isUnlocked) {
                          if (isChest) {
                            handleClaimChest(lesson);
                          } else {
                            setPreviewNode({ ...lesson, idx });
                          }
                        }
                      }}
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                        textAlign: 'center',
                        cursor: isUnlocked ? 'pointer' : 'default',
                        background: isCurrent
                          ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
                          : 'rgba(15, 23, 42, 0.82)',
                        border: isCurrent
                          ? `1.5px solid ${selectedSubject.color}`
                          : '1px solid rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        padding: '8px 14px',
                        borderRadius: '18px',
                        boxShadow: isCurrent
                          ? `0 6px 20px rgba(0, 0, 0, 0.5), 0 0 18px ${selectedSubject.color}44`
                          : '0 4px 14px rgba(0,0,0,0.4)',
                        maxWidth: '185px',
                        zIndex: 3,
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            color: isCurrent ? '#FDE047' : isUnlocked ? '#38BDF8' : '#94A3B8',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                          }}
                        >
                          {isChest ? '☄️ Cofre' : isTrophy ? '🌟 Supernova' : `Astro ${idx + 1}`}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#FDE047',
                              boxShadow: '0 0 8px #FDE047',
                              display: 'inline-block'
                            }}
                          />
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          color: isUnlocked ? '#FFFFFF' : '#94A3B8',
                          lineHeight: '1.25'
                        }}
                      >
                        {lesson.shortName || lesson.title}
                      </span>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          color: '#FEF08A',
                          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.35) 0%, rgba(251, 191, 36, 0.22) 100%)',
                          border: '1px solid rgba(251, 191, 36, 0.55)',
                          padding: '2px 10px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          marginTop: '2px'
                        }}
                      >
                        ⚡ +{lesson.xpReward || 25} XP
                      </span>

                      {!isChest && !isTrophy && lesson.subtemas?.length > 0 && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            color: isPlanetMastered ? '#6EE7B7' : '#FEF08A',
                            background: isPlanetMastered ? 'rgba(16, 185, 129, 0.22)' : 'rgba(0, 0, 0, 0.45)',
                            border: isPlanetMastered ? '1px solid #10B981' : '1px solid rgba(245, 158, 11, 0.35)',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            marginTop: '2px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: isPlanetMastered ? '0 0 10px rgba(16, 185, 129, 0.35)' : 'none'
                          }}
                        >
                          {isPlanetMastered ? '✨ Anillo 100% Iluminado' : `🪐 Anillo: ${completedParts}/${totalParts} partes`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ================= MODAL PREVIEW Y HUB ORBITAL DE SUBTEMAS ================= */}
      <AnimatePresence>
        {previewNode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90000,
              background: 'rgba(2, 6, 23, 0.82)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setPreviewNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '92vh',
                background: 'linear-gradient(180deg, #0F172A 0%, #080D1A 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '28px',
                padding: 'clamp(18px, 3.5vw, 26px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: `0 25px 70px rgba(0, 0, 0, 0.8), 0 0 30px ${selectedSubject.color}25`,
                color: '#F8FAFC',
                overflowY: 'auto'
              }}
            >
              {/* Header del Planeta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: selectedSubject.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.7rem',
                    flexShrink: 0,
                    boxShadow: `0 0 20px ${selectedSubject.color}66`
                  }}
                >
                  {previewNode.nodeIcon || selectedSubject.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', color: '#FDE047', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {selectedSubject.name.toUpperCase()} • SEMANA {previewNode.semana}
                    </span>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.12)', padding: '2px 8px', borderRadius: '6px', color: '#CBD5E1', fontWeight: 800 }}>
                      Matriz Oficial UNSA
                    </span>
                  </div>
                  <h3 style={{ margin: '3px 0 0', fontSize: 'clamp(1.1rem, 2.8vw, 1.35rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
                    {previewNode.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewNode(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    flexShrink: 0
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Si el nodo tiene subtemas (Planeta Duolingo-style) */}
              {previewNode.subtemas && previewNode.subtemas.length > 0 ? (
                <>
                  {/* Banner de progreso del Anillo Planetario */}
                  {(() => {
                    const totalSt = previewNode.subtemas.length;
                    const doneSt = previewNode.subtemas.filter((st) => completedLessons[st.id] || completedLessons[previewNode.id]).length;
                    const pct = Math.round((doneSt / totalSt) * 100);
                    return (
                      <div
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '18px',
                          padding: '12px 16px',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 900 }}>
                          <span style={{ color: '#FEF08A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Orbit size={15} color="#FDE047" /> Anillo del Planeta ({doneSt}/{totalSt} Subtemas Dominados)
                          </span>
                          <span style={{ color: doneSt === totalSt ? '#10B981' : '#38BDF8' }}>
                            {pct}% ILUMINADO
                          </span>
                        </div>

                        {/* Barra segmentada estilo Duolingo */}
                        <div style={{ display: 'flex', gap: '6px', height: '8px' }}>
                          {previewNode.subtemas.map((st, i) => {
                            const isDone = Boolean(completedLessons[st.id] || completedLessons[previewNode.id]);
                            return (
                              <div
                                key={st.id}
                                style={{
                                  flex: 1,
                                  height: '100%',
                                  borderRadius: '999px',
                                  background: isDone
                                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                                    : 'rgba(255, 255, 255, 0.12)',
                                  boxShadow: isDone ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Lista interactiva de los subtemas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8' }}>
                      Partes de la Lección (Subtemas del Prospecto UNSA):
                    </div>

                    {previewNode.subtemas.map((st, sIdx) => {
                      const isSubDone = Boolean(completedLessons[st.id] || completedLessons[previewNode.id]);
                      const isSubNext = !isSubDone && (sIdx === 0 || Boolean(completedLessons[previewNode.subtemas[sIdx - 1]?.id]));
                      const isExpanded = expandedTheorySubId === st.id;

                      return (
                        <div
                          key={st.id}
                          style={{
                            background: isSubDone
                              ? 'rgba(16, 185, 129, 0.1)'
                              : isSubNext
                                ? 'rgba(56, 189, 248, 0.12)'
                                : 'rgba(30, 41, 59, 0.55)',
                            border: isSubDone
                              ? '1.5px solid rgba(16, 185, 129, 0.45)'
                              : isSubNext
                                ? '1.5px solid rgba(56, 189, 248, 0.55)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '18px',
                            padding: '12px 14px',
                            transition: 'all 0.2s ease',
                            boxShadow: isSubNext ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none'
                          }}
                        >
                          {/* Fila principal del subtema */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '220px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 900, background: 'rgba(255, 255, 255, 0.14)', padding: '2px 7px', borderRadius: '6px', color: '#FEF08A' }}>
                                  Parte {st.subCode}
                                </span>
                                {isSubDone ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Check size={13} strokeWidth={3} /> Dominado (+25 XP)
                                  </span>
                                ) : isSubNext ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Sparkles size={13} /> Siguiente Misión
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                                    Por Conquistar
                                  </span>
                                )}
                              </div>
                              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3 }}>
                                {st.title}
                              </h4>
                            </div>

                            {/* Botones de acción del subtema */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {/* Botón Ver Teoría del Tomo */}
                              <button
                                type="button"
                                onClick={() => setExpandedTheorySubId(isExpanded ? null : st.id)}
                                style={{
                                  padding: '7px 11px',
                                  borderRadius: '12px',
                                  background: isExpanded ? '#0284C7' : 'rgba(255, 255, 255, 0.08)',
                                  border: isExpanded ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.14)',
                                  color: '#FFFFFF',
                                  fontSize: '0.76rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <BookOpen size={13} />
                                <span>{isExpanded ? 'Ocultar Teoría' : 'Teoría Oficial'}</span>
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                              </button>

                              {/* Botón Iniciar Reto Oficial */}
                              <button
                                type="button"
                                className="duo-btn-3d"
                                onClick={() => {
                                  const subLessonToPlay = {
                                    id: st.id,
                                    parentPlanetId: previewNode.id,
                                    subject: selectedSubject.name,
                                    semana: previewNode.semana,
                                    title: `${selectedSubject.name} • ${st.title}`,
                                    shortName: st.shortTitle,
                                    nodeIcon: st.icon || '🪐',
                                    xpReward: 25,
                                    theory: st.theory,
                                    challenges: st.challenges
                                  };
                                  setPreviewNode(null);
                                  setActiveLesson(subLessonToPlay);
                                }}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '12px',
                                  background: isSubDone ? '#059669' : selectedSubject.color,
                                  border: 'none',
                                  color: '#FFFFFF',
                                  fontSize: '0.78rem',
                                  fontWeight: 900,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: isSubDone
                                    ? '0 3px 0 #047857'
                                    : `0 3px 0 ${selectedSubject.color}99`
                                }}
                              >
                                <Play size={13} fill="#FFFFFF" />
                                <span>{isSubDone ? 'Repasar' : 'Entrenar'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Acordeón desplegable con Teoría Oficial de Nivel 80+ Puntos */}
                          <AnimatePresence>
                            {isExpanded && st.theory && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                  marginTop: '12px',
                                  paddingTop: '12px',
                                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px'
                                }}
                              >
                                {/* Marco Teórico General */}
                                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '12px' }}>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <BookOpen size={13} /> Marco Teórico Oficial CEPREUNSA
                                  </div>
                                  <div style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                                    {st.theory.marcoteorico}
                                  </div>
                                </div>

                                {/* Pizarra de Fórmulas y Teoremas Canónicos con Tipografía KaTeX */}
                                <FormulaDisplay
                                  formulaData={st.theory?.formula_data}
                                  rawMecanismos={st.theory?.mecanismos}
                                />

                                {/* Fija UNSA 80+ Puntos */}
                                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1.5px solid rgba(239, 68, 68, 0.45)', borderRadius: '12px', padding: '12px' }}>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#F87171', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Flame size={13} /> Clave Fija CEPREUNSA (Meta 80+ Puntos)
                                  </div>
                                  <div style={{ fontSize: '0.84rem', color: '#FEE2E2', lineHeight: 1.5, whiteSpace: 'pre-line', fontWeight: 600 }}>
                                    {st.theory.fijaUnsa}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Vista estándar para Hitos, Cofres o Nodos Especiales */
                <>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93C5FD', padding: '4px 10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800 }}>
                      🏛️ Hito Académico Oficial
                    </span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6EE7B7', padding: '4px 10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800 }}>
                      🎯 Bonificación de Experiencia
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#94A3B8', lineHeight: '1.5' }}>
                    {previewNode.title}. Conquista cada fase temática para consolidar tu ingreso a la Universidad Nacional de San Agustín.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px 18px', borderRadius: '16px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#94A3B8', fontWeight: 700 }}>Recompensa de expedición</span>
                    <span style={{ fontWeight: 900, color: '#FBBF24', fontSize: '1.05rem' }}>+{previewNode.xpReward || 50} XP ⚡</span>
                  </div>

                  <button
                    type="button"
                    className="duo-btn-3d"
                    onClick={() => {
                      const toPlay = previewNode;
                      setPreviewNode(null);
                      setActiveLesson(toPlay);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '18px',
                      border: 'none',
                      background: selectedSubject.color,
                      boxShadow: `0 6px 0 ${selectedSubject.color}88, 0 0 20px ${selectedSubject.color}66`,
                      color: '#FFFFFF',
                      fontSize: '1.08rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {completedLessons[previewNode.id] ? 'Repasar Hito' : '¡Iniciar Expedición!'}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL GUÍA DE UNIDAD (TEORÍA OFICIAL CEPREUNSA) ================= */}
      <AnimatePresence>
        {showUnitGuide && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90000,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(10px, 3vw, 20px)'
            }}
            onClick={() => setShowUnitGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: 'min(88vh, 760px)',
                background: 'linear-gradient(180deg, #0F172A 0%, #090D16 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '26px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: `0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px ${selectedSubject.color}33`,
                color: '#F8FAFC',
                overflow: 'hidden'
              }}
            >
              {/* Encabezado Fijo Sticky */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: 'rgba(15, 23, 42, 0.96)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  flexShrink: 0,
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${selectedSubject.color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 4px 12px ${selectedSubject.color}44`
                    }}
                  >
                    <SubjectLucideIcon id={selectedSubject.id} size={22} color="#FFFFFF" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      Guía Oficial: {selectedSubject.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#38BDF8', fontWeight: 800 }}>
                        Tomos CEPREUNSA
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.7rem' }}>•</span>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>
                        Admisión UNSA 2027
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ display: 'none', md: 'block' }}>
                    <OrsttyMascot mood="feliz" size={36} />
                  </div>
                  <button
                    onClick={() => setShowUnitGuide(false)}
                    aria-label="Cerrar guía"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Contenido Teórico con Scroll Cómodo y Responsive */}
              <div
                style={{
                  overflowY: 'auto',
                  flex: 1,
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                }}
              >
                {/* Tarjeta 1: Principio General */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.09)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderLeft: '4px solid #3B82F6',
                    padding: '14px 16px',
                    borderRadius: '0 16px 16px 0',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <BookOpen size={16} color="#60A5FA" />
                    <h4 style={{ margin: 0, color: '#93C5FD', fontWeight: 900, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                      Principio General y Fundamento Epistemológico
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.55', color: '#E2E8F0' }}>
                    {lessons[0]?.theory?.sections[0]?.body || selectedSubject.description}
                  </p>
                </div>

                {/* Tarjeta 2: Pizarra de Fórmulas y Teoremas Canónicos con Tipografía KaTeX */}
                {lessons[0]?.subtemas?.[0]?.theory?.formula_data ? (
                  <FormulaDisplay
                    formulaData={lessons[0]?.subtemas?.[0]?.theory?.formula_data}
                    rawMecanismos={lessons[0]?.theory?.sections?.[1]?.body}
                  />
                ) : (
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.09)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderLeft: '4px solid #8B5CF6',
                      padding: '14px 16px',
                      borderRadius: '0 16px 16px 0',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                      <Target size={16} color="#C084FC" />
                      <h4 style={{ margin: 0, color: '#C4B5FD', fontWeight: 900, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                        Casos Particulares, Fórmulas y Taxonomía Evaluada
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.55', color: '#E2E8F0' }}>
                      {lessons[0]?.theory?.sections?.[1]?.body || 'Revisión exhaustiva de clasificaciones, teoremas y casos operacionales evaluados en CEPREUNSA.'}
                    </p>
                  </div>
                )}

                {/* Tarjeta 3: Deducción Práctica */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.09)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderLeft: '4px solid #10B981',
                    padding: '14px 16px',
                    borderRadius: '0 16px 16px 0',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <Sparkles size={16} color="#34D399" />
                    <h4 style={{ margin: 0, color: '#6EE7B7', fontWeight: 900, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>
                      Deducción Práctica para el Examen
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.55', color: '#E2E8F0' }}>
                    {lessons[0]?.theory?.takeaway || 'Aplica los conceptos esenciales para deducir la alternativa correcta con rapidez y exactitud sin caer en distractores.'}
                  </p>
                </div>

                {/* Tarjeta 4: Consejo Estratégico de ORSTTY */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderLeft: '4px solid #F59E0B',
                    padding: '12px 16px',
                    borderRadius: '0 16px 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <OrsttyMascot mood="contento" size={44} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FBBF24' }}>
                      Tip Clave de ORSTTY
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#FEF3C7', lineHeight: '1.45', fontWeight: 600 }}>
                      {SUBJECT_MASCOT_TIPS[selectedSubject.name] || '¡Estudia con constancia y asegura cada punto en el baremo oficial!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pie Fijo Sticky con Botón Táctil */}
              <div
                style={{
                  padding: '14px 20px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }}
              >
                <button
                  onClick={() => setShowUnitGuide(false)}
                  className="duo-btn-3d"
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    border: 'none',
                    background: selectedSubject.color,
                    boxShadow: `0 4px 0 ${selectedSubject.color}99, 0 8px 20px ${selectedSubject.color}44`,
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.98rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    letterSpacing: '0.02em'
                  }}
                >
                  <Check size={18} strokeWidth={3} />
                  <span>Entendido, volver a la expedición</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL COFRE DE METEORITO / BONUS XP ================= */}
      <AnimatePresence>
        {chestModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90000,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setChestModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#0F172A',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '28px',
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
                color: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ marginBottom: '14px', position: 'relative' }}>
                <OrsttyMascot size={84} mood="cheering" />
              </div>
              <h3 style={{ fontSize: '1.55rem', fontWeight: 900, margin: '0 0 8px', color: '#FFFFFF' }}>
                {chestModal.alreadyClaimed ? '¡Cofre Ya Reclamado! 🎁' : '¡Cofre Astral Reclamado! ⚡'}
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#94A3B8', margin: '0 0 20px', lineHeight: 1.4 }}>
                {chestModal.alreadyClaimed
                  ? `Ya acumulaste la bonificación de este meteorito en ${selectedSubject.name}. ¡Avanza al siguiente Astro para continuar conquistando la vacante!`
                  : `¡Gran constancia! Has reclamado la recompensa cósmica de ${selectedSubject.name} y desbloqueado la siguiente órbita.`}
              </p>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.16)',
                  border: '2px dashed #F59E0B',
                  borderRadius: '18px',
                  padding: '12px 24px',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#FBBF24',
                  marginBottom: '24px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>+{chestModal.xpReward || 50} XP</span>
                <span>⚡</span>
              </div>
              <button
                className="duo-btn-3d"
                onClick={() => setChestModal(null)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: '#10B981',
                  boxShadow: '0 5px 0 #047857',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer'
                }}
              >
                ¡Continuar Viaje Astral!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL MATRIZ COMPLETA DE 15 CURSOS CEPREUNSA ================= */}
      <AnimatePresence>
        {showAllCoursesModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backgroundColor: 'rgba(2, 6, 23, 0.88)',
              backdropFilter: 'blur(16px)'
            }}
            onClick={() => setShowAllCoursesModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                border: '2px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '28px',
                padding: 'clamp(20px, 4vw, 32px)',
                width: '100%',
                maxWidth: '840px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.15)',
                position: 'relative'
              }}
            >
              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '12px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900, color: '#FEF08A', textTransform: 'uppercase', marginBottom: '8px' }}>
                    <GraduationCap size={14} /> Temario y Matriz Oficial de Evaluación UNSA
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.65rem)', fontWeight: 900, margin: '0 0 4px', color: '#FFFFFF' }}>
                    Los 15 Cursos Oficiales de CEPREUNSA
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.4 }}>
                    Estructurados en 10 semanas académicas completas con teoría profunda y preguntas del banco oficial para asegurar más de 80 puntos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllCoursesModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Barra de Búsqueda y Filtros de Área dentro del modal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    placeholder="Buscar curso por nombre, área o temas..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px 12px 42px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1.5px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  {courseSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCourseSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Indicador de Asignaturas Generales */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                    Mostrando {searchedCoursesInModal.length} de {SUBJECTS_CONFIG.length} asignaturas generales del temario oficial
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#FEF08A', background: 'rgba(245, 158, 11, 0.15)', padding: '3px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 800 }}>
                    10 Semanas Oficiales c/u
                  </span>
                </div>
              </div>

              {/* Grid de los 15 Cursos */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '12px'
                }}
              >
                {searchedCoursesInModal.map((subj) => {
                  const isCurrent = selectedSubject.id === subj.id;
                  return (
                    <div
                      key={subj.id}
                      onClick={() => {
                        setSelectedSubject(subj);
                        setShowAllCoursesModal(false);
                      }}
                      style={{
                        background: isCurrent ? `${subj.color}22` : 'rgba(15, 23, 42, 0.7)',
                        border: isCurrent ? `2px solid ${subj.color}` : '1.5px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        boxShadow: isCurrent ? `0 0 20px ${subj.color}40` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: `${subj.color}25`,
                            border: `1px solid ${subj.color}55`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <SubjectLucideIcon id={subj.id} size={22} color={subj.color} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#E2E8F0'
                          }}
                        >
                          Asignatura General
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 4px', color: '#FFFFFF' }}>
                        {subj.name}
                      </h3>
                      <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {subj.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem' }}>
                        <span style={{ color: '#FDE047', fontWeight: 800 }}>10 Semanas • 40+ Lecciones</span>
                        {isCurrent ? (
                          <span style={{ color: '#10B981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Check size={13} strokeWidth={3} /> Activo
                          </span>
                        ) : (
                          <span style={{ color: '#38BDF8', fontWeight: 700 }}>Seleccionar →</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {searchedCoursesInModal.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>No se encontraron cursos con ese criterio.</p>
                  <button
                    type="button"
                    onClick={() => { setCourseSearchQuery(''); setSelectedAreaFilter('ALL'); }}
                    style={{ marginTop: '10px', padding: '6px 14px', borderRadius: '10px', background: '#0284C7', border: 'none', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Restablecer Filtros
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DE RANKING REAL DE SIMULACROS UNSA ================= */}
      <RankingSimulacroModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
      />

      {/* ================= MOTOR DE LECCIÓN EN PANTALLA COMPLETA ================= */}
      {activeLesson && (
        <LessonEngine
          lesson={activeLesson}
          onComplete={() => {
            if (activeLesson.parentPlanetId) {
              const parentPlanet = lessons.find((l) => l.id === activeLesson.parentPlanetId);
              if (parentPlanet && parentPlanet.subtemas) {
                const allSubtemasDone = parentPlanet.subtemas.every(
                  (st) => st.id === activeLesson.id || completedLessons[st.id]
                );
                if (allSubtemasDone && typeof recordLessonCompletion === 'function') {
                  recordLessonCompletion(parentPlanet.id, 50, 3);
                }
              }
            }
            setActiveLesson(null);
          }}
          onExit={() => {
            setActiveLesson(null);
          }}
        />
      )}
    </div>
  );
};
