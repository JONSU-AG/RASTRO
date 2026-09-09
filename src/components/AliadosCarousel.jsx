import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MessageCircle, 
  ExternalLink, 
  User, 
  Star, 
  CheckCircle2, 
  Video, 
  Award,
  ChevronLeft,
  ChevronRight,
  Heart,
  Megaphone,
  Play,
  Pause,
  FileText
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { useAuth, ADMIN_EMAILS, isAuthorOfFirebase } from '../context/AuthContext';
import { LiveUserAvatar } from './LiveUserAvatar';
import { isImageItem, getDrivePreviewUrl } from './CommunityUploadCard';
import { getDirectImageUrl as getDirectImageUrlHelper, getDriveThumbnailUrl, getDriveFileId } from '../lib/storageHelper';
import { ErrorBoundary } from './ErrorBoundary';
import { PdfSheetPreview } from './PdfSheetPreview';

export const WhatsAppIconSVG = ({ size = 18, style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={style}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export const TikTokIconSVG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.892 2.895 2.895 0 0 1-2.895-2.892 2.894 2.894 0 0 1 2.895-2.892c.329 0 .641.057.933.161V9.418a6.326 6.326 0 0 0-.933-.07 6.338 6.338 0 0 0-6.335 6.336 6.338 6.338 0 0 0 6.335 6.335 6.338 6.338 0 0 0 6.336-6.335V9.014a8.18 8.18 0 0 0 4.77 1.518V7.086a4.838 4.838 0 0 1-1.07-.400Z"/>
  </svg>
);

// Base official creator card (Single main creator card)
const DEFAULT_ALLIES = [
  {
    id: 'josnu-founder',
    name: 'TU BUEN AMIGO JONSU FUTURO CACHIMBO',
    uid: 'josnu-admin',
    role: 'Fundador & Creador RASTRO',
    badge: '👑 Creador RASTRO',
    specialty: 'Aficionado en desarrollo web',
    desc: 'SOY EL CREADOR DE LA PAGINA, comparto material preuniversitario gratis, además de plasmar sus ideas en la página.',
    whatsappChannel: 'https://www.whatsapp.com/channel/0029VbDFAEu7YScyVZBNul0X',
    tiktokUrl: 'https://www.tiktok.com/@futurocachimbounsa?_r=1&_t=ZS-99SjSQle78P',
    phone: '930875585',
    avatar: './assets/LOGOR.png',
    reactionsCount: 99,
    priority: 1
  }
];

export const AliadosCarousel = ({ onOpenAliadoForm }) => {
  const { user, isAdmin } = useAuth();
  const [allies, setAllies] = useState(DEFAULT_ALLIES);
  const [destacadosByAlly, setDestacadosByAlly] = useState({});
  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth <= 1024) return 'tablet';
    return 'desktop';
  });
  const [carouselLightbox, setCarouselLightbox] = useState(null);
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Dynamic window resize listener for responsive layout (Android Mobile, Tablet, PC)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setDeviceType('mobile');
      else if (window.innerWidth <= 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Escuchar TODOS los materiales con destacado == true en toda la plataforma
  // Esto permite que el creador destaque a CUALQUIERA ("puedo destacar a cualquiera"),
  // y que los destacados se sincronicen en tiempo real.
  useEffect(() => {
    let unsub;
    try {
      const q = query(collection(db, 'uploads'), where('destacado', '==', true));
      unsub = onSnapshot(q, (snapshot) => {
        const byAuthor = {};
        snapshot.docs.forEach(docSnap => {
          const item = { id: docSnap.id, ...docSnap.data() };
          const authorId = item.uploadedBy?.uid || item.authorUid || item.authorId || 'comunidad';
          if (!byAuthor[authorId]) {
            byAuthor[authorId] = [];
          }
          byAuthor[authorId].push(item);
        });
        setDestacadosByAlly(byAuthor);
      }, (err) => console.warn("Error snapshot destacados:", err));
    } catch (e) {
      console.warn("catch qAllDestacados:", e);
    }
    return () => unsub && unsub();
  }, []);

  // 2. Cargar Aliados (Fundador/Creador + solicitudes_aliados + usuarios con >10 aportes + autores destacados)
  useEffect(() => {
    let unsubs = [];

    const loadAllies = () => {
      let combinedMap = new Map();
      const josnuUid = (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ? user.uid : 'josnu-admin';

      // 1. Base default ally with fixed 'creator_primary' key to guarantee NO DUPLICATES
      DEFAULT_ALLIES.forEach(d => {
        combinedMap.set('creator_primary', {
          ...d,
          uid: josnuUid
        });
      });

      const syncState = () => {
        const list = Array.from(combinedMap.values());
        list.sort((a, b) => (a.priority || 10) - (b.priority || 10));
        setAllies(list);
      };

      syncState();

      // 2. Firestore: solicitudes_aliados
      try {
        const qSol = query(collection(db, 'solicitudes_aliados'));
        const unsubSol = onSnapshot(qSol, (snapshot) => {
          snapshot.docs.forEach(docSnap => {
            const data = docSnap.data();
            if (data.name && (data.status === 'aprobado' || data.isCreator || data.approved === true)) {
              const nameKey = data.name.toLowerCase().trim();
              if (nameKey === 'rumbo oficial') return;

              const isCreatorCard = data.isCreator || 
                nameKey.includes('jonsu') || 
                nameKey.includes('futuro') || 
                docSnap.id === 'josnu-founder' ||
                (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) && (data.uid === user?.uid || data.email === user?.email));

              const mapKey = isCreatorCard ? 'creator_primary' : docSnap.id;

              combinedMap.set(mapKey, {
                id: docSnap.id,
                name: data.name,
                role: data.role || (isCreatorCard ? 'Fundador & Creador RUMBO' : 'Aliado Oficial RUMBO'),
                badge: data.badge || (isCreatorCard ? '👑 Creador RUMBO' : '⭐ Aliado Comunitario'),
                specialty: data.specialty || data.subject || 'Todas las Áreas',
                desc: data.desc || data.bio || 'Aliado oficial compartiendo material educativo.',
                whatsappChannel: data.whatsappChannel || data.whatsappGroup || '',
                tiktokUrl: data.tiktokUrl || data.socialLink || '',
                phone: data.phone || '',
                avatar: data.avatar || data.photoURL || './assets/LOGOR.png',
                uid: data.uid || (isCreatorCard ? josnuUid : null),
                reactionsCount: data.reactionsCount || 90,
                priority: isCreatorCard ? 1 : 3
              });
            }
          });
          syncState();
        }, (err) => console.warn("solicitudes_aliados snapshot err:", err));

        unsubs.push(unsubSol);
      } catch (e) {
        console.warn("solicitudes_aliados catch:", e);
      }

      // 3. Usuarios con rango aliado (más de 10 subidas o isAlly)
      try {
        const qUsers = query(collection(db, 'usuarios'), where('uploadCount', '>', 10));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
          snapshot.docs.forEach(docSnap => {
            const uData = docSnap.data();
            if (uData.displayName && !combinedMap.has(docSnap.id)) {
              combinedMap.set(docSnap.id, {
                id: docSnap.id,
                name: uData.displayName,
                role: 'Aliado por Aportes (>10 materiales)',
                badge: '⭐ Aliado Destacado',
                specialty: uData.carrera || 'Comunidad RUMBO',
                desc: uData.bio || 'Estudiante aliado que ha compartido más de 10 materiales educativos.',
                whatsappChannel: uData.whatsappChannel || '',
                tiktokUrl: uData.tiktokUrl || '',
                avatar: uData.photoURL || './assets/LOGOR.png',
                uid: docSnap.id,
                reactionsCount: 50,
                priority: 4
              });
            }
          });
          syncState();
        }, () => {});
        unsubs.push(unsubUsers);
      } catch (e) {
        console.warn("catch qUsers:", e);
      }
    };

    loadAllies();

    return () => {
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, [user]);

  // Si hay autores con material destacado por el Creador que no estén en allies,
  // los integramos dinámicamente ("puedo destacar a cualquiera")
  useEffect(() => {
    const authorUids = Object.keys(destacadosByAlly);
    if (!authorUids.length) return;

    setAllies(prev => {
      let changed = false;
      const existingUids = new Set(prev.map(a => a.uid).filter(Boolean));
      const newItems = [...prev];

      authorUids.forEach(uid => {
        if (!existingUids.has(uid) && uid !== 'comunidad') {
          const sample = destacadosByAlly[uid]?.[0];
          if (sample) {
            changed = true;
            newItems.push({
              id: `destacado-${uid}`,
              name: sample.uploadedBy?.name || sample.author || 'Aportante Destacado',
              role: 'Aporte Destacado por Creador',
              badge: '⭐ Material en Inicio',
              specialty: sample.category || 'Educación',
              desc: 'Publicación destacada en el carrusel de inicio.',
              avatar: sample.uploadedBy?.photo || sample.uploadedBy?.photoURL || './assets/LOGOR.png',
              uid: uid,
              priority: 5
            });
          }
        }
      });

      return changed ? newItems : prev;
    });
  }, [destacadosByAlly]);

  // Tarjeta 1 perfil + Tarjetas de materiales destacados por aliado:
  // - Para el Creador / Admin: ILIMITADO ("para mí es ilimitado")
  // - Para usuarios de rango Aliado: MÁXIMO 3 ("esos destacados son 3 como máximo por usuario de rango aliado")
  const carouselCards = [];
  allies.forEach(ally => {
    const isCreatorCard = Boolean(
      ally.isCreator ||
      ally.priority === 1 ||
      ally.id === 'creator_primary' ||
      ally.id === 'josnu-founder' ||
      isAuthorOfFirebase(ally.email || user?.email) ||
      (user?.email && ADMIN_EMAILS.some(em => em.toLowerCase() === user.email.toLowerCase()) && (ally.uid === user.uid || ally.email === user.email))
    );

    // Tarjeta de perfil del aliado
    carouselCards.push({ type: 'profile', ally, key: `profile-${ally.id || ally.uid}`, isCreatorCard });

    // Tarjetas de materiales destacados vinculados a este aliado
    const mats = destacadosByAlly[ally.uid] || [];
    // Si es creador: ilimitado. Si es aliado regular: máximo 3.
    const displayedMats = isCreatorCard ? mats : mats.slice(0, 3);

    displayedMats.forEach(m => {
      carouselCards.push({
        type: 'material',
        material: m,
        ally,
        key: `material-${ally.id || ally.uid}-${m.id}`
      });
    });
  });

  const displayCards = carouselCards;

  // Estados para animación automática y navegación en móvil
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState(1); // 1 = siguiente, -1 = anterior
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (flashIndex >= displayCards.length && displayCards.length > 0) {
      setFlashIndex(0);
    }
  }, [displayCards.length, flashIndex]);

  // Rotación automática suave cada 5 segundos en móvil
  useEffect(() => {
    if (!isAutoPlaying || displayCards.length <= 1 || deviceType !== 'mobile') return;
    const interval = setInterval(() => {
      setFlipDirection(1);
      setFlashIndex(prev => (prev + 1) % displayCards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, displayCards.length, deviceType]);

  const handleNextFlash = () => {
    if (displayCards.length === 0) return;
    setFlipDirection(1);
    setFlashIndex(prev => (prev + 1) % displayCards.length);
  };

  const handlePrevFlash = () => {
    if (displayCards.length === 0) return;
    setFlipDirection(-1);
    setFlashIndex(prev => (prev - 1 + displayCards.length) % displayCards.length);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [carouselCards.length]);

  // Animación 3D estilo Flash Card para Android / Móvil
  const flashcardVariants = {
    enter: (direction) => ({
      rotateY: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.94
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (direction) => ({
      rotateY: direction > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.94,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Helper unificado para renderizar tarjeta de perfil o tarjeta de material
  const renderCardItem = (card, idx, isFlashcard = false) => {
    const cardWidth = deviceType === 'mobile' 
      ? 'min(340px, 86vw)' 
      : (deviceType === 'tablet' ? '350px' : '370px');
    const cardHeight = deviceType === 'mobile' ? '465px' : '480px';

    if (card.type === 'profile') {
      const ally = card.ally;
      return (
        <ErrorBoundary key={`${card.key}-${idx}-eb`}>
          <motion.div
            key={`${card.key}-${idx}`}
            whileHover={!isFlashcard ? { y: -6, scale: 1.02, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.22)' } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-card"
            style={{
              width: isFlashcard ? '100%' : cardWidth,
              minWidth: isFlashcard ? 'auto' : cardWidth,
              maxWidth: isFlashcard ? '100%' : cardWidth,
              height: cardHeight,
              minHeight: cardHeight,
              maxHeight: cardHeight,
              flexShrink: 0,
              scrollSnapAlign: isFlashcard ? 'none' : 'start',
              borderRadius: '26px',
              padding: '22px 20px',
              background: 'var(--card-bg)',
              border: '1.5px solid var(--card-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.16)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Row: Avatar & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LiveUserAvatar
                uid={ally.uid}
                fallbackName={ally.name}
                fallbackPhoto={ally.avatar}
                fallbackFrame={ally.avatarFrame || (ally.id === 'josnu-founder' || ally.name?.toLowerCase().includes('jonsu') || ally.name?.toLowerCase().includes('futuro') ? 'fuego_creador' : 'carmesi')}
                size={52}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    lineHeight: 1.25,
                    wordBreak: 'break-word'
                  }}>
                    {ally.name}
                  </h3>
                  <CheckCircle2 size={16} style={{ color: '#34C759', flexShrink: 0 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: '#A855F7',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {ally.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialty Tag */}
            <div style={{
              background: 'rgba(120, 120, 128, 0.08)',
              borderRadius: '14px',
              padding: '10px 12px',
              fontSize: '0.82rem',
              color: 'var(--text-main)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>📍</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ally.specialty}
              </span>
            </div>

            {/* Presentation Quote con soporte completo para saltos de línea y adaptación al espacio */}
            <p style={{
              margin: 'auto 0',
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
              maxHeight: '210px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              overscrollBehavior: 'contain',
              paddingRight: '4px'
            }}>
              "{ally.desc}"
            </p>

            {/* Action Buttons: WhatsApp + TikTok/Social + Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {ally.whatsappChannel && (
                <a
                  href={ally.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Únete al canal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <WhatsAppIconSVG size={17} /> Únete al canal
                </a>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                {ally.tiktokUrl && (
                  <a
                    href={ally.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      background: '#000000',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    <TikTokIconSVG size={15} /> TikTok ↗
                  </a>
                )}

                {ally.uid && (
                  <Link
                    to={`/usuario/${ally.uid}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      background: 'rgba(120, 120, 128, 0.12)',
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem'
                    }}
                  >
                    <User size={14} /> Ver Perfil
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </ErrorBoundary>
      );
    }

    // Tarjeta de material individual unificada en tamaño y estructura con la del aliado
    const m = card.material;
    const rawMatAuthor = (m.author || '').trim();
    const isPrivateMatAuthor = rawMatAuthor.toLowerCase().includes('ronaldo') || rawMatAuthor.toLowerCase().includes('aguilar') || rawMatAuthor.includes('@');
    const cleanMatAuthor = isPrivateMatAuthor ? '' : rawMatAuthor;
    const authorName = cleanMatAuthor || card.ally.name || 'Aliado RASTRO';

    const isImg = isImageItem(m);
    const rawUrl = m.url || m.driveUrl || '';
    const driveId = getDriveFileId(rawUrl);
    const staticThumbnailUrl = isImg 
      ? getDirectImageUrlHelper(rawUrl) 
      : (driveId ? getDriveThumbnailUrl(rawUrl, 'w800') : null);
    const openPdfUrl = driveId ? `https://drive.google.com/file/d/${driveId}/view` : (rawUrl || '#');

    return (
      <ErrorBoundary key={`${card.key}-${idx}-eb`}>
        <motion.div
          key={`${card.key}-${idx}`}
          whileHover={!isFlashcard ? { y: -6, scale: 1.02, boxShadow: '0 20px 40px rgba(0, 122, 255, 0.2)' } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-card"
          style={{
            width: isFlashcard ? '100%' : cardWidth,
            minWidth: isFlashcard ? 'auto' : cardWidth,
            maxWidth: isFlashcard ? '100%' : cardWidth,
            minHeight: isFlashcard ? 'auto' : cardHeight,
            flexShrink: 0,
            scrollSnapAlign: isFlashcard ? 'none' : 'start',
            borderRadius: '26px',
            padding: '20px',
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.16)',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {/* Top: Autor / Usuario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LiveUserAvatar
              uid={card.ally.uid}
              fallbackName={authorName}
              fallbackPhoto={card.ally.avatar}
              fallbackFrame={card.ally.avatarFrame || (card.isCreatorCard ? 'fuego_creador' : 'carmesi')}
              size={46}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {authorName}
                </h4>
                <CheckCircle2 size={14} style={{ color: '#34C759', flexShrink: 0 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(0, 122, 255, 0.12)',
                  color: '#007AFF',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  ⭐ Material Destacado
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {m.category || 'Educación'}
                </span>
              </div>
            </div>
          </div>

          {/* Título y Descripción Completa (Sin recortar) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h3 style={{
              margin: 0,
              fontSize: '0.96rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.3,
              wordBreak: 'break-word'
            }}>
              {m.title || 'Material Educativo'}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.86rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
              maxHeight: '135px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              overscrollBehavior: 'contain'
            }}>
              {m.desc || m.description || 'Material oficial compartido por el aliado de la comunidad RASTRO.'}
            </p>
          </div>

          {/* Vista Previa: 1ra Hoja del PDF Bonita y Centrada */}
          <div style={{ width: '100%' }}>
            {isImg ? (
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1.5px solid rgba(0, 122, 255, 0.22)',
                height: '190px',
                width: '100%',
                background: 'rgba(15, 23, 42, 0.05)',
                position: 'relative',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                boxSizing: 'border-box'
              }}>
                <img
                  src={staticThumbnailUrl}
                  alt={m.title}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  draggable={false}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                  }}
                />
              </div>
            ) : (
              <PdfSheetPreview
                url={rawUrl}
                title={m.title || 'Documento PDF'}
                category={m.category || 'Material Oficial'}
                height={190}
                isFolder={m.type === 'drive' || rawUrl?.includes('/folders/') || rawUrl?.includes('folderview')}
              />
            )}
          </div>

          {/* Botones solicitados: Abrir Recurso (siempre abre el PDF) y Ver Perfil */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <a
              href={openPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1.2,
                padding: '11px 14px',
                borderRadius: '14px',
                background: 'var(--accent-color)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)'
              }}
            >
              <ExternalLink size={15} /> Abrir Recurso
            </a>

            {card.ally.uid && (
              <Link
                to={`/usuario/${card.ally.uid}`}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: 'rgba(120, 120, 128, 0.12)',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <User size={15} /> Ver Perfil
              </Link>
            )}
          </div>
        </motion.div>
      </ErrorBoundary>
    );
  };

  return (
    <section style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 16px 40px',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '0 8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16), rgba(239, 148, 190, 0.16))',
            border: '1.5px solid rgba(168, 85, 247, 0.35)',
            color: '#A855F7',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={15} /> TARJETAS DE ALIADOS RASTRO ⭐
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-main)',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          Creadores & Canales Oficiales
        </h2>

        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          margin: 0,
          maxWidth: '640px',
          lineHeight: 1.5
        }}>
          Postulantes, docentes y academias que comparten material y difunden el proyecto educativo.
        </p>
      </div>

      {/* 📢 Banner de Requisitos para ser Aliado Oficial */}
      <div style={{
        maxWidth: '820px',
        margin: '0 auto 24px',
        padding: '14px 18px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.12), rgba(255, 45, 85, 0.08))',
        border: '1.5px solid rgba(255, 149, 0, 0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 8px 24px rgba(255, 149, 0, 0.12)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #FF9500, #FF2D55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(255, 149, 0, 0.35)',
          color: '#FFFFFF'
        }}>
          <Megaphone size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 900,
              color: '#FF9500',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              📢 Requisito Aliado Oficial:
            </span>
          </div>
          <p style={{
            margin: '3px 0 0',
            fontSize: '0.84rem',
            color: 'var(--text-main)',
            lineHeight: 1.4,
            fontWeight: 600
          }}>
            Comparte <strong>10+ materiales</strong> y difunde RASTRO en tus redes (WhatsApp / TikTok) para activar tu tarjeta.
          </p>
        </div>
      </div>

      {/* ─── VISTA 1: ANDROID / MÓVIL ESTILO TARJETA DINÁMICA (VOLTEA EN SU LUGAR) ─── */}
      {deviceType === 'mobile' ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
          {/* Flashcard 3D in-place wrapper */}
          <div style={{
            perspective: '1200px',
            width: '100%',
            maxWidth: '350px',
            minHeight: '465px',
            height: '465px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <AnimatePresence mode="wait" custom={flipDirection}>
              {displayCards[flashIndex] && (
                <motion.div
                  key={`flashcard-${displayCards[flashIndex].key || flashIndex}`}
                  custom={flipDirection}
                  variants={flashcardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (offset.x < -35 || velocity.x < -250) {
                      handleNextFlash();
                    } else if (offset.x > 35 || velocity.x > 250) {
                      handlePrevFlash();
                    }
                  }}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    transformStyle: 'preserve-3d',
                    boxSizing: 'border-box',
                    touchAction: 'pan-y'
                  }}
                >
                  {renderCardItem(displayCards[flashIndex], flashIndex, true)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Flashcard Android Controls Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
            width: '100%',
            maxWidth: '350px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '0 4px'
            }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                padding: '4px 12px',
                borderRadius: '16px',
                background: 'rgba(0, 122, 255, 0.08)',
                border: '1px solid rgba(0, 122, 255, 0.16)'
              }}>
                ✨ {flashIndex + 1} de {displayCards.length}
              </span>

              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                title={isAutoPlaying ? "Pausar rotación automática" : "Reanudar rotación automática"}
                style={{
                  background: isAutoPlaying ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 149, 0, 0.12)',
                  border: `1px solid ${isAutoPlaying ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 149, 0, 0.3)'}`,
                  color: isAutoPlaying ? '#34C759' : '#FF9500',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isAutoPlaying ? 'Auto' : 'Pausado'}
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}>
              <button
                onClick={handlePrevFlash}
                aria-label="Regresar a tarjeta anterior"
                style={{
                  flex: 1.2,
                  padding: '10px 14px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}
              >
                <ChevronLeft size={18} /> Regresar
              </button>

              <button
                onClick={handleNextFlash}
                aria-label="Siguiente Tarjeta"
                style={{
                  flex: 1.2,
                  padding: '10px 16px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)'
                }}
              >
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── VISTA 2: PC / TABLET CARRUSEL DESLIZANTE CON FLECHAS FLOTANTES ─── */
        <>
          {/* Floating Navigation Arrows for PC and Tablet */}
          {canScrollLeft && deviceType !== 'mobile' && (
            <button
              onClick={() => {
                const el = document.getElementById('rastro-carousel-track')?.parentElement;
                if (el) el.scrollBy({ left: -380, behavior: 'smooth' });
              }}
              aria-label="Anterior"
              style={{
                position: 'absolute',
                left: '8px',
                top: '55%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: '1.5px solid var(--card-border)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {canScrollRight && deviceType !== 'mobile' && (
            <button
              onClick={() => {
                const el = document.getElementById('rastro-carousel-track')?.parentElement;
                if (el) el.scrollBy({ left: 380, behavior: 'smooth' });
              }}
              aria-label="Siguiente"
              style={{
                position: 'absolute',
                right: '8px',
                top: '55%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: '1.5px solid var(--card-border)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Carrusel lineal finito */}
          <div
            ref={carouselRef}
            tabIndex={0}
            aria-label="Carrusel de aliados y materiales"
            onKeyDown={(e)=>{
              if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
              if(e.key==='ArrowLeft'){ e.preventDefault(); const el=document.getElementById('rastro-carousel-track'); if(el) el.scrollBy({left:-380,behavior:'smooth'}); }
              if(e.key==='ArrowRight'){ e.preventDefault(); const el=document.getElementById('rastro-carousel-track'); if(el) el.scrollBy({left:380,behavior:'smooth'}); }
            }}
            style={{
              position: 'relative',
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              padding: '12px 2px 24px',
              display: 'block',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              outline: 'none',
              touchAction: 'pan-y'
            }}
          >
            <div
              id="rastro-carousel-track"
              style={{
                display: 'flex',
                gap: deviceType === 'mobile' ? '14px' : '20px',
                width: 'max-content',
                alignItems: 'stretch',
                cursor: 'grab',
                padding: '0 6px',
                touchAction: 'pan-y'
              }}
              onMouseDown={e=>{ const el=e.currentTarget.parentElement; if(!el) return; const startX=e.pageX-el.offsetLeft; const scrollLeft=el.scrollLeft; const onMove=(ev)=>{ el.scrollLeft=scrollLeft-(ev.pageX-el.offsetLeft-startX); }; const onUp=()=>{ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); }; document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp); }}
            >
              {displayCards.map((card, idx) => renderCardItem(card, idx, false))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '14px' }}>
            <button
              onClick={()=>{
                const el=document.getElementById('rastro-carousel-track')?.parentElement;
                if(el) el.scrollBy({left:-380,behavior:'smooth'});
              }}
              aria-label="Anterior"
              disabled={!canScrollLeft}
              style={{ width:'44px', height:'44px', borderRadius:'50%', border:'1.5px solid var(--card-border)', background:'var(--card-bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor: canScrollLeft ? 'pointer' : 'not-allowed', boxShadow:'0 4px 12px rgba(0,0,0,0.08)', opacity: canScrollLeft ? 1 : 0.45 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={()=>{
                const el=document.getElementById('rastro-carousel-track')?.parentElement;
                if(el) el.scrollBy({left:380,behavior:'smooth'});
              }}
              aria-label="Siguiente"
              disabled={!canScrollRight}
              style={{ width:'44px', height:'44px', borderRadius:'50%', border:'1.5px solid var(--card-border)', background:'var(--card-bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor: canScrollRight ? 'pointer' : 'not-allowed', boxShadow:'0 4px 12px rgba(0,0,0,0.08)', opacity: canScrollRight ? 1 : 0.45 }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
      {carouselLightbox && (
        <div onClick={() => setCarouselLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img src={getDirectImageUrlHelper(carouselLightbox)} alt="preview" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '16px', objectFit: 'contain' }} onClick={e=>e.stopPropagation()} />
          <button onClick={() => setCarouselLightbox(null)} style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>
      )}

      {/* Bottom CTA to Register as Ally */}
      {onOpenAliadoForm && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAliadoForm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #A855F7, #6366F1)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.35)'
            }}
          >
            <Sparkles size={18} /> ¿Quieres aparecer aquí? Regístrate como Aliado ⭐
          </motion.button>
        </div>
      )}
    </section>
  );
};
