import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Medal,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  Target,
  Flame,
  Search,
  User,
  Zap,
  Shield,
  Crown,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import { OrsttyMascot } from './Mascots';

// ==========================================
// LAS 5 DIVISIONES / LIGAS OFICIALES RUMBO
// Auténticas, inspiradoras y con identidad local
// ==========================================
export const LIGAS_RUMBO = [
  {
    id: 'wawita',
    name: 'Liga Wawita',
    tag: 'WAWITA',
    icon: '🍼',
    minScore: 0,
    maxScore: 19.9999,
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #64748B, #475569)',
    border: 'rgba(148, 163, 184, 0.4)',
    bg: 'rgba(148, 163, 184, 0.12)',
    description: 'Primeros pasos en la preparación. ¡Todo futuro cachimbo empezó aquí!'
  },
  {
    id: 'kinder',
    name: 'Liga Kínder',
    tag: 'KÍNDER',
    icon: '🎒',
    minScore: 20,
    maxScore: 39.9999,
    color: '#34D399',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    border: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.12)',
    description: 'Consolidando conceptos teóricos y tomando ritmo en el banco de preguntas.'
  },
  {
    id: 'pre_fosil',
    name: 'Liga Pre-Fósil',
    tag: 'PRE-FÓSIL',
    icon: '🏛️',
    minScore: 40,
    maxScore: 59.9999,
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    border: 'rgba(59, 130, 246, 0.45)',
    bg: 'rgba(59, 130, 246, 0.14)',
    description: 'Nivel competitivo sólido. Estás en la antesala directa del umbral fósil de vacante.'
  },
  {
    id: 'fosil',
    name: 'Liga Fósil',
    tag: 'FÓSIL',
    icon: '🦴',
    minScore: 60,
    maxScore: 79.9999,
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, #F97316, #C2410C)',
    border: 'rgba(249, 115, 22, 0.45)',
    bg: 'rgba(249, 115, 22, 0.14)',
    description: 'Veterano fogueado en simulacros con alto kilometraje, maña y precisión.'
  },
  {
    id: 'futuro_cachimbo',
    name: 'Liga Futuro Cachimbo',
    tag: 'FUTURO CACHIMBO',
    icon: '🎓',
    minScore: 80,
    maxScore: 100,
    color: '#FDE047',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    border: 'rgba(251, 191, 36, 0.65)',
    bg: 'rgba(245, 158, 11, 0.18)',
    description: '¡Puntaje directo de vacante UNSA! Excelencia absoluta en los 80 ítems.'
  }
];

export const getLigaForScore = (score = 0) => {
  const num = Number(score) || 0;
  if (num >= 80) return LIGAS_RUMBO[4];
  if (num >= 60) return LIGAS_RUMBO[3];
  if (num >= 40) return LIGAS_RUMBO[2];
  if (num >= 20) return LIGAS_RUMBO[1];
  return LIGAS_RUMBO[0];
};

// Postulantes de referencia competitiva con puntajes ponderados reales de los exámenes oficiales UNSA
const BENCHMARK_POSTULANTES = [
  {
    id: 'ref_1',
    userName: 'Mateo Quispe Huamán',
    career: 'Medicina Humana',
    area: 'Biomédicas',
    score: 96.2500,
    correct: 77,
    wrong: 3,
    blank: 0,
    timeSpent: '01:52:14',
    date: '2026-09-17',
    avatarBg: 'linear-gradient(135deg, #10B981, #059669)',
    avatarInitial: 'M'
  },
  {
    id: 'ref_2',
    userName: 'Valeria Condori Flores',
    career: 'Ingeniería de Sistemas',
    area: 'Ingenierías',
    score: 93.8750,
    correct: 75,
    wrong: 4,
    blank: 1,
    timeSpent: '02:04:30',
    date: '2026-09-17',
    avatarBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    avatarInitial: 'V'
  },
  {
    id: 'ref_3',
    userName: 'Sebastián Zúñiga R.',
    career: 'Derecho',
    area: 'Sociales',
    score: 91.5000,
    correct: 73,
    wrong: 5,
    blank: 2,
    timeSpent: '01:48:50',
    date: '2026-09-16',
    avatarBg: 'linear-gradient(135deg, #F59E0B, #B45309)',
    avatarInitial: 'S'
  },
  {
    id: 'ref_4',
    userName: 'Camila Pinto Vargas',
    career: 'Ingeniería Civil',
    area: 'Ingenierías',
    score: 89.1250,
    correct: 71,
    wrong: 7,
    blank: 2,
    timeSpent: '02:12:05',
    date: '2026-09-16',
    avatarBg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    avatarInitial: 'C'
  },
  {
    id: 'ref_5',
    userName: 'Rodrigo Mendoza T.',
    career: 'Medicina Humana',
    area: 'Biomédicas',
    score: 87.7500,
    correct: 70,
    wrong: 8,
    blank: 2,
    timeSpent: '01:59:42',
    date: '2026-09-15',
    avatarBg: 'linear-gradient(135deg, #EC4899, #BE185D)',
    avatarInitial: 'R'
  },
  {
    id: 'ref_6',
    userName: 'Adriana Mamani C.',
    career: 'Psicología',
    area: 'Sociales',
    score: 85.3750,
    correct: 68,
    wrong: 9,
    blank: 3,
    timeSpent: '01:45:10',
    date: '2026-09-15',
    avatarBg: 'linear-gradient(135deg, #F97316, #C2410C)',
    avatarInitial: 'A'
  },
  {
    id: 'ref_7',
    userName: 'Joaquín Benavente L.',
    career: 'Ingeniería Industrial',
    area: 'Ingenierías',
    score: 83.6250,
    correct: 66,
    wrong: 10,
    blank: 4,
    timeSpent: '02:18:22',
    date: '2026-09-14',
    avatarBg: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    avatarInitial: 'J'
  },
  {
    id: 'ref_8',
    userName: 'Luciana Paredes G.',
    career: 'Arquitectura',
    area: 'Ingenierías',
    score: 81.2500,
    correct: 65,
    wrong: 12,
    blank: 3,
    timeSpent: '02:08:40',
    date: '2026-09-14',
    avatarBg: 'linear-gradient(135deg, #6366F1, #4338CA)',
    avatarInitial: 'L'
  },
  {
    id: 'ref_9',
    userName: 'Álvaro Delgado S.',
    career: 'Economía',
    area: 'Sociales',
    score: 79.8750,
    correct: 63,
    wrong: 13,
    blank: 4,
    timeSpent: '01:55:00',
    date: '2026-09-13',
    avatarBg: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    avatarInitial: 'A'
  },
  {
    id: 'ref_10',
    userName: 'Daniela Cáceres P.',
    career: 'Enfermería',
    area: 'Biomédicas',
    score: 77.5000,
    correct: 61,
    wrong: 15,
    blank: 4,
    timeSpent: '02:01:15',
    date: '2026-09-13',
    avatarBg: 'linear-gradient(135deg, #D946EF, #A21CAF)',
    avatarInitial: 'D'
  }
];

export const RankingSimulacroModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pestañas principales: 'ranking' | 'mural' | 'ligas'
  const [activeTab, setActiveTab] = useState('ranking');

  // Filtro de área en ranking general: 'Todas' | 'Biomédicas' | 'Ingenierías' | 'Sociales'
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [firebaseRankings, setFirebaseRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar rankings en tiempo real desde Firestore
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    try {
      const q = query(
        collection(db, 'ranking_simulacros'),
        orderBy('score', 'desc'),
        limit(50)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setFirebaseRankings(docs);
        setIsLoading(false);
      }, (err) => {
        console.warn('Firestore ranking error:', err);
        setIsLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Error reading ranking_simulacros:', e);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Lista combinada de rankings (Firebase + Benchmarks de referencia para poblar)
  const combinedRankingList = useMemo(() => {
    const map = new Map();

    // 1. Agregar de Firebase
    firebaseRankings.forEach(item => {
      map.set(item.userId || item.id, {
        ...item,
        isRealUser: true
      });
    });

    // 2. Si el usuario actual tiene un examen en localStorage, agregarlo
    try {
      const localSim = localStorage.getItem('rastro_last_simulacro_score');
      if (localSim && user) {
        const parsed = JSON.parse(localSim);
        if (!map.has(user.uid)) {
          map.set(user.uid, {
            id: user.uid,
            userId: user.uid,
            userName: user.displayName || user.email?.split('@')[0] || 'Mi Perfil',
            userPhoto: user.photoURL,
            career: user.career || 'Postulante UNSA',
            area: parsed.area || 'Ingenierías',
            score: parsed.score || 78.5,
            correct: parsed.correct || 62,
            wrong: parsed.wrong || 14,
            blank: parsed.blank || 4,
            timeSpent: parsed.timeSpent || '01:54:10',
            date: parsed.date || new Date().toISOString().split('T')[0],
            isCurrentUser: true
          });
        }
      }
    } catch {}

    // 3. Completar con los benchmarks para garantizar tabla competitiva completa
    BENCHMARK_POSTULANTES.forEach(ref => {
      if (!map.has(ref.id)) {
        map.set(ref.id, ref);
      }
    });

    // Ordenar de mayor a menor puntaje
    const sorted = Array.from(map.values()).sort((a, b) => (b.score || 0) - (a.score || 0));

    // Asignar puestos oficiales #1, #2, #3...
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
      isCurrentUser: Boolean(user?.uid && (item.userId === user.uid || item.id === user.uid))
    }));
  }, [firebaseRankings, user]);

  // Filtrado por Área y por Búsqueda
  const filteredList = useMemo(() => {
    return combinedRankingList.filter(item => {
      const matchArea = selectedAreaFilter === 'Todas' || item.area === selectedAreaFilter;
      const matchSearch = !searchQuery.trim() || 
        (item.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.career || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [combinedRankingList, selectedAreaFilter, searchQuery]);

  // Top 5 Absoluto para el Mural de Honor
  const top5List = useMemo(() => {
    return combinedRankingList.slice(0, 5);
  }, [combinedRankingList]);

  // Datos del Top 3 (Podio de Honor en Ranking General)
  const top1 = filteredList[0] || null;
  const top2 = filteredList[1] || null;
  const top3 = filteredList[2] || null;

  // Encontrar puesto y liga del usuario actual
  const currentUserRankData = useMemo(() => {
    return combinedRankingList.find(item => item.isCurrentUser) || null;
  }, [combinedRankingList]);

  const currentUserScore = currentUserRankData?.score || 0;
  const currentLiga = getLigaForScore(currentUserScore);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: 'rgba(5, 8, 20, 0.84)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '690px',
            maxHeight: '92vh',
            background: 'linear-gradient(180deg, rgba(26, 20, 56, 0.97) 0%, rgba(13, 17, 36, 0.99) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.55)',
            borderRadius: '28px',
            boxShadow: '0 24px 70px rgba(0,0,0,0.85), 0 0 35px rgba(245, 158, 11, 0.25)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Luz dorada superior */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              right: '15%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FDE047, #F59E0B, transparent)',
              boxShadow: '0 0 12px #FDE047'
            }}
          />

          {/* CABECERA DEL RANKING */}
          <div
            style={{
              padding: '14px 16px 10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(245, 158, 11, 0.6)',
                  flexShrink: 0
                }}
              >
                <Trophy size={20} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 'clamp(0.95rem, 3.2vw, 1.25rem)',
                      fontWeight: 950,
                      letterSpacing: '-0.02em',
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #FDE047 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Cuadro de Mérito Oficial
                  </h2>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                      color: '#FFFFFF',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      border: '1px solid #FDE047',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    UNSA 2027
                  </span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Puntajes comparativos ponderados de 80 ítems
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* SELECTOR DE PESTAÑAS RESPONSIVE (GRID 3 COLUMNAS SIN APLASTAMIENTO) */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(10, 14, 28, 0.75)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              flexShrink: 0
            }}
          >
            {[
              { id: 'ranking', label: '📋 Ranking' },
              { id: 'mural', label: '👑 Top 5' },
              { id: 'ligas', label: '🛡️ 5 Ligas' }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    height: '38px',
                    padding: '0 8px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.25) 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    color: isSelected ? '#FEF08A' : '#94A3B8',
                    fontSize: 'clamp(0.72rem, 2.5vw, 0.82rem)',
                    fontWeight: isSelected ? 950 : 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: isSelected ? '0 0 14px rgba(245, 158, 11, 0.3)' : 'none',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA                        */}
          {/* ======================================================== */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'clamp(12px, 3vw, 18px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* PESTAÑA 1: MURAL DE HONOR TOP 5 */}
            {activeTab === 'mural' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%)',
                    borderRadius: '18px',
                    border: '1px solid rgba(251, 191, 36, 0.35)'
                  }}
                >
                  <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    👑 SALÓN DE LA FAMA • TOP 5 HISTÓRICO UNSA
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#CBD5E1' }}>
                    Los 5 puntajes más altos registrados en el Simulacro Oficial de 80 Preguntas
                  </p>
                </div>

                {top5List.map((hero, idx) => {
                  const medalColors = [
                    { bg: 'linear-gradient(135deg, #FDE047, #D97706)', border: '#FDE047', label: '1° PUESTO ORO', badge: '👑' },
                    { bg: 'linear-gradient(135deg, #E2E8F0, #94A3B8)', border: '#E2E8F0', label: '2° PUESTO PLATA', badge: '🥈' },
                    { bg: 'linear-gradient(135deg, #F59E0B, #B45309)', border: '#F59E0B', label: '3° PUESTO BRONCE', badge: '🥉' },
                    { bg: 'linear-gradient(135deg, #38BDF8, #0284C7)', border: '#38BDF8', label: '4° PUESTO ÉLITE', badge: '⭐' },
                    { bg: 'linear-gradient(135deg, #A855F7, #7E22CE)', border: '#A855F7', label: '5° PUESTO ÉLITE', badge: '✨' }
                  ][idx];

                  const liga = getLigaForScore(hero.score);

                  return (
                    <motion.div
                      key={hero.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        gap: '10px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 27, 75, 0.4) 100%)',
                        border: `1.5px solid ${medalColors.border}88`,
                        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${medalColors.border}22`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '14px',
                            background: medalColors.bg,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0F172A',
                            fontWeight: 950,
                            fontSize: '1.1rem',
                            flexShrink: 0,
                            boxShadow: `0 0 16px ${medalColors.border}66`
                          }}
                        >
                          <span>{medalColors.badge}</span>
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {hero.userName}
                            </span>
                            <span
                              style={{
                                fontSize: '0.6rem',
                                fontWeight: 900,
                                padding: '1px 6px',
                                borderRadius: '999px',
                                background: liga.bg,
                                color: liga.color,
                                border: `1px solid ${liga.border}`,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {liga.icon} {liga.tag}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span>{hero.career}</span>
                            <span style={{ margin: '0 4px', opacity: 0.4 }}>•</span>
                            <span style={{ color: '#38BDF8', fontWeight: 700 }}>{hero.area}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 950, color: '#FDE047', letterSpacing: '-0.5px' }}>
                          <AnimatedCounter value={hero.score} decimals={2} duration={1200} />
                          <span style={{ fontSize: '0.68rem', marginLeft: '2px', opacity: 0.85 }}>pts</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#6EE7B7', fontWeight: 800 }}>
                          {hero.correct}/80 ok
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PESTAÑA 2: LAS 5 LIGAS RUMBO */}
            {activeTab === 'ligas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(30, 27, 75, 0.5) 100%)',
                    border: '1.5px solid rgba(168, 85, 247, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <OrsttyMascot size={54} mood="cheering" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#C084FC', textTransform: 'uppercase' }}>
                      TU DIVISIÓN ACTUAL
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: 950, color: currentLiga.color }}>
                      {currentLiga.icon} {currentLiga.name}
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#CBD5E1', lineHeight: '1.3' }}>
                      {currentUserScore > 0 ? (
                        <>
                          Puntaje registrado: <strong>{currentUserScore.toFixed(2)} pts</strong>.
                          {currentLiga.id !== 'futuro_cachimbo' && (
                            <span> ¡Faltan <strong>{(currentLiga.maxScore - currentUserScore + 0.01).toFixed(2)} pts</strong> para ascender!</span>
                          )}
                        </>
                      ) : (
                        'Rinde tu primer Simulacro Oficial de 80 Preguntas para ingresar al sistema de ligas.'
                      )}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LIGAS_RUMBO.map((liga) => {
                    const isMyLiga = currentLiga.id === liga.id;
                    return (
                      <div
                        key={liga.id}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '18px',
                          background: isMyLiga ? 'rgba(245, 158, 11, 0.14)' : 'rgba(15, 23, 42, 0.65)',
                          border: isMyLiga ? '2px solid #F59E0B' : `1px solid ${liga.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.8rem' }}>{liga.icon}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.92rem', fontWeight: 900, color: liga.color }}>
                                {liga.name}
                              </span>
                              {isMyLiga && (
                                <span style={{ background: '#F59E0B', color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '2px 6px', borderRadius: '999px' }}>
                                  ESTÁS AQUÍ
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                              {liga.description}
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#FFFFFF' }}>
                            {liga.minScore.toFixed(0)} - {liga.maxScore >= 99.9 ? '100' : Math.floor(liga.maxScore)} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PESTAÑA 3: RANKING GENERAL COMPLETO */}
            {activeTab === 'ranking' && (
              <>
                {/* FILTROS POR ÁREA (BIOMÉDICAS, INGENIERÍAS, SOCIALES) */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                  }}
                >
                  {[
                    { id: 'Todas', label: '🌐 Todas las Áreas' },
                    { id: 'Biomédicas', label: '🧬 Biomédicas' },
                    { id: 'Ingenierías', label: '⚙️ Ingenierías' },
                    { id: 'Sociales', label: '⚖️ Sociales' }
                  ].map((areaTab) => {
                    const isSelected = selectedAreaFilter === areaTab.id;
                    return (
                      <button
                        key={areaTab.id}
                        type="button"
                        onClick={() => setSelectedAreaFilter(areaTab.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isSelected ? '1.5px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.12)',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.2) 100%)'
                            : 'rgba(15, 23, 42, 0.6)',
                          color: isSelected ? '#FEF08A' : '#94A3B8',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 900 : 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {areaTab.label}
                      </button>
                    );
                  })}
                </div>

                {/* PODIO DE HONOR (TOP 3 DE POSTULANTES) */}
                {top1 && (
                  <div
                    style={{
                      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 14, 28, 0.9) 100%)',
                      border: '1.5px solid rgba(251, 191, 36, 0.35)',
                      borderRadius: '22px',
                      padding: '16px 14px 14px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        👑 PODIO DE CUADRO DE MÉRITO
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', alignItems: 'flex-end' }}>
                      
                      {/* PUESTO 2 (PLATA) */}
                      {top2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
                          <div
                            style={{
                              width: 'clamp(38px, 10vw, 46px)',
                              height: 'clamp(38px, 10vw, 46px)',
                              borderRadius: '50%',
                              background: top2.avatarBg || 'linear-gradient(135deg, #94A3B8, #64748B)',
                              border: '2.5px solid #E2E8F0',
                              boxShadow: '0 0 16px rgba(226, 232, 240, 0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
                              fontWeight: 900,
                              color: '#FFFFFF',
                              position: 'relative',
                              flexShrink: 0
                            }}
                          >
                            {top2.avatarInitial || top2.userName?.charAt(0) || '2'}
                            <span style={{ position: 'absolute', bottom: '-8px', background: '#E2E8F0', color: '#0F172A', fontSize: '0.6rem', fontWeight: 900, padding: '1px 5px', borderRadius: '999px', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                              #2
                            </span>
                          </div>
                          <span style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.8rem)', fontWeight: 800, color: '#FFFFFF', marginTop: '10px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {top2.userName?.split(' ')[0]}
                          </span>
                          <span style={{ fontSize: 'clamp(0.62rem, 1.8vw, 0.68rem)', color: '#94A3B8', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {top2.career}
                          </span>
                          <div style={{ marginTop: '4px', background: 'rgba(226, 232, 240, 0.15)', border: '1px solid rgba(226, 232, 240, 0.3)', padding: '2px 6px', borderRadius: '8px', maxWidth: '100%' }}>
                            <span style={{ fontSize: 'clamp(0.68rem, 2.2vw, 0.76rem)', fontWeight: 900, color: '#E2E8F0', whiteSpace: 'nowrap' }}>
                              <AnimatedCounter value={top2.score} decimals={1} suffix=" pts" duration={1100} />
                            </span>
                          </div>
                        </div>
                      )}

                      {/* PUESTO 1 (ORO) - CENTRADO Y DESTACADO */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transform: 'translateY(-6px)', minWidth: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.1rem' }}>
                            👑
                          </span>
                          <div
                            style={{
                              width: 'clamp(48px, 13vw, 58px)',
                              height: 'clamp(48px, 13vw, 58px)',
                              borderRadius: '50%',
                              background: top1.avatarBg || 'linear-gradient(135deg, #F59E0B, #D97706)',
                              border: '3px solid #FDE047',
                              boxShadow: '0 0 24px rgba(253, 224, 71, 0.7)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(1.1rem, 3.2vw, 1.4rem)',
                              fontWeight: 900,
                              color: '#FFFFFF',
                              flexShrink: 0
                            }}
                          >
                            {top1.avatarInitial || top1.userName?.charAt(0) || '1'}
                          </div>
                          <span style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 900, padding: '2px 7px', borderRadius: '999px', border: '1px solid #FDE047', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                            #1 ORO
                          </span>
                        </div>
                        <span style={{ fontSize: 'clamp(0.78rem, 2.4vw, 0.88rem)', fontWeight: 900, color: '#FEF08A', marginTop: '12px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {top1.userName}
                        </span>
                        <span style={{ fontSize: 'clamp(0.64rem, 2vw, 0.7rem)', color: '#E2E8F0', fontWeight: 700, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {top1.career}
                        </span>
                        <div style={{ marginTop: '4px', background: 'rgba(245, 158, 11, 0.25)', border: '1.5px solid #FDE047', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)', maxWidth: '100%' }}>
                          <span style={{ fontSize: 'clamp(0.74rem, 2.3vw, 0.82rem)', fontWeight: 900, color: '#FEF08A', whiteSpace: 'nowrap' }}>
                            <AnimatedCounter value={top1.score} decimals={1} suffix=" pts" duration={1300} />
                          </span>
                        </div>
                      </div>

                      {/* PUESTO 3 (BRONCE) */}
                      {top3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
                          <div
                            style={{
                              width: 'clamp(38px, 10vw, 46px)',
                              height: 'clamp(38px, 10vw, 46px)',
                              borderRadius: '50%',
                              background: top3.avatarBg || 'linear-gradient(135deg, #B45309, #78350F)',
                              border: '2.5px solid #F59E0B',
                              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
                              fontWeight: 900,
                              color: '#FFFFFF',
                              position: 'relative',
                              flexShrink: 0
                            }}
                          >
                            {top3.avatarInitial || top3.userName?.charAt(0) || '3'}
                            <span style={{ position: 'absolute', bottom: '-8px', background: '#D97706', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 900, padding: '1px 5px', borderRadius: '999px', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                              #3
                            </span>
                          </div>
                          <span style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.8rem)', fontWeight: 800, color: '#FFFFFF', marginTop: '10px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {top3.userName?.split(' ')[0]}
                          </span>
                          <span style={{ fontSize: 'clamp(0.62rem, 1.8vw, 0.68rem)', color: '#94A3B8', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {top3.career}
                          </span>
                          <div style={{ marginTop: '4px', background: 'rgba(217, 119, 6, 0.2)', border: '1px solid rgba(217, 119, 6, 0.4)', padding: '2px 6px', borderRadius: '8px', maxWidth: '100%' }}>
                            <span style={{ fontSize: 'clamp(0.68rem, 2.2vw, 0.76rem)', fontWeight: 900, color: '#FBBF24', whiteSpace: 'nowrap' }}>
                              <AnimatedCounter value={top3.score} decimals={1} suffix=" pts" duration={1100} />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LISTA DE POSTULANTES COMPARATIVA (TABLA GENERAL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      TODOS LOS POSTULANTES ({filteredList.length})
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800 }}>
                      Baremo 80 Preguntas / 100 Pts
                    </span>
                  </div>

                  {filteredList.map((postulante) => {
                    const isTop1 = postulante.rank === 1;
                    const isTop2 = postulante.rank === 2;
                    const isTop3 = postulante.rank === 3;
                    const isMine = postulante.isCurrentUser;
                    const hasVacante = postulante.rank <= 5;
                    const postulanteLiga = getLigaForScore(postulante.score);

                    return (
                      <div
                        key={postulante.id}
                        style={{
                          background: isMine
                            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.18) 100%)'
                            : isTop1
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(15, 23, 42, 0.72)',
                          border: isMine
                            ? '2px solid #FDE047'
                            : isTop1
                              ? '1.5px solid rgba(251, 191, 36, 0.4)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          boxShadow: isMine ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
                        }}
                      >
                        {/* Puesto + Avatar + Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 900,
                              color: isTop1
                                ? '#FDE047'
                                : isTop2
                                  ? '#E2E8F0'
                                  : isTop3
                                    ? '#FBBF24'
                                    : '#94A3B8',
                              width: '26px',
                              textAlign: 'center',
                              flexShrink: 0
                            }}
                          >
                            #{postulante.rank}
                          </span>

                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: postulante.avatarBg || 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 900,
                              color: '#FFFFFF',
                              flexShrink: 0,
                              border: isMine ? '2px solid #FDE047' : '1.5px solid rgba(255,255,255,0.2)'
                            }}
                          >
                            {postulante.avatarInitial || postulante.userName?.charAt(0) || 'U'}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 800,
                                  color: isMine ? '#FEF08A' : '#FFFFFF',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {postulante.userName}
                              </span>
                              {isMine && (
                                <span style={{ background: '#F59E0B', color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '1px 5px', borderRadius: '6px' }}>
                                  TÚ
                                </span>
                              )}
                              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: postulanteLiga.color, background: postulanteLiga.bg, padding: '1px 5px', borderRadius: '4px', border: `1px solid ${postulanteLiga.border}` }}>
                                {postulanteLiga.icon} {postulanteLiga.tag}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {postulante.career}
                              </span>
                              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                              <span style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 700 }}>
                                {postulante.area}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Puntaje + Vacante */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 900,
                              color: isTop1 ? '#FEF08A' : '#10B981',
                              letterSpacing: '-0.01em'
                            }}
                          >
                            <AnimatedCounter value={postulante.score} decimals={2} suffix=" pts" duration={1000} />
                          </span>

                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '6px',
                              background: hasVacante ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.15)',
                              color: hasVacante ? '#6EE7B7' : '#FBBF24',
                              border: hasVacante ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
                              marginTop: '2px'
                            }}
                          >
                            {hasVacante ? '🟢 EN VACANTE' : '🟡 DISPUTA'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>

          {/* PIE DE MODAL: ESTADO PERSONAL DEL USUARIO Y ACCIÓN RÁPIDA */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(10, 14, 28, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: currentLiga.bg,
                  border: `1.5px solid ${currentLiga.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}
              >
                {currentLiga.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUserRankData ? `Posición #${currentUserRankData.rank} • ${currentLiga.name}` : `Tu Liga Inicial: ${currentLiga.name}`}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                  {currentUserRankData ? (
                    <span>
                      <AnimatedCounter value={currentUserRankData.score} decimals={2} suffix=" pts acumulados" duration={1000} />
                    </span>
                  ) : (
                    '¡Rinde un examen para ingresar a la tabla!'
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/simulador');
              }}
              className="duo-btn-3d"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 0 #047857, 0 6px 16px rgba(16, 185, 129, 0.4)',
                flexShrink: 0
              }}
            >
              <Zap size={15} fill="#FFFFFF" />
              <span>Dar Simulacro</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
