import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './ErrorBoundary';
import {
  Home,
  BookOpen,
  Cpu,
  Library,
  User,
  Palette,
  UploadCloud,
  Shield,
  Bell,
  MoreHorizontal,
  MessageSquare,
  Sparkles,
  Download,
  LogOut
} from 'lucide-react';

import { Logo } from './Logo';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { UploadModal } from './UploadModal';
import { NotificationsModal } from './NotificationsModal';
import { GoogleSignPromptModal } from './GoogleSignPromptModal';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

// Ícono SVG de estrella estilo Gemini para el botón de ORSTTY en la barra de navegación
export const GeminiStarIcon = ({ size = 18, color, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    <path
      d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
      stroke={color || 'currentColor'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="4" r="1" fill={color || 'currentColor'} />
    <circle cx="20" cy="14" r="0.8" fill={color || 'currentColor'} opacity="0.7" />
  </svg>
);

export const LiquidNavbar = () => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileNav, setIsMobileNav] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const onResize = () => setIsMobileNav(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ============================================================
  // PWA
  // ============================================================

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);

  const menuRef = useRef(null);

  // ============================================================
  // PWA: DETECTAR INSTALACIÓN Y CAPTURAR PROMPT
  // ============================================================

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      setIsStandalone(Boolean(standalone));
    };

    checkStandalone();

    // ----------------------------------------------------------
    // IMPORTANTE:
    // index.html puede haber capturado el evento antes de que
    // LiquidNavbar se monte.
    // ----------------------------------------------------------

    if (window.deferredPWAEvent) {
      setDeferredPrompt(window.deferredPWAEvent);

      console.log(
        '✅ RASTRO: recuperando evento PWA capturado previamente'
      );
    }

    // ----------------------------------------------------------
    // Capturar evento si aparece después
    // ----------------------------------------------------------

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      window.deferredPWAEvent = event;
      setDeferredPrompt(event);

      console.log(
        '✅ RASTRO: instalación PWA disponible'
      );
    };

    // ----------------------------------------------------------
    // Detectar instalación completada
    // ----------------------------------------------------------

    const handleAppInstalled = () => {
      console.log(
        '✅ RASTRO: aplicación instalada correctamente'
      );

      window.deferredPWAEvent = null;
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      'appinstalled',
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, []);

  // Mostrar popup custom de instalación cuando sea instalable
  useEffect(() => {
    if (deferredPrompt && !isStandalone) {
      const hasSeen = sessionStorage.getItem('rastro_pwa_prompt_dismissed');
      if (hasSeen) return;
      const timer = setTimeout(() => setShowPWAInstallModal(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowPWAInstallModal(false);
    }
  }, [deferredPrompt, isStandalone]);

  // ============================================================
  // INSTALAR PWA
  // ============================================================

  const handleInstallPWA = async () => {
    setIsMenuOpen(false);

    // ----------------------------------------------------------
    // Ya está instalada
    // ----------------------------------------------------------

    if (isStandalone) {
      alert(
        '✅ Ya estás disfrutando de RASTRO como aplicación instalada.'
      );

      return;
    }

    // ----------------------------------------------------------
    // Recuperar el prompt.
    //
    // Primero usamos el estado de React.
    // Si todavía no existe, usamos el evento global capturado
    // por index.html.
    // ----------------------------------------------------------

    const activePrompt =
      deferredPrompt || window.deferredPWAEvent;

    // ----------------------------------------------------------
    // Chrome todavía no ha proporcionado el prompt
    // ----------------------------------------------------------

    if (!activePrompt) {
      alert(
        '📱 La instalación de RASTRO todavía no está disponible.\n\n' +
        'Si estás usando Chrome o Edge, abre el menú ⋮ y busca ' +
        '"Instalar aplicación" o "Añadir a pantalla de inicio".'
      );

      return;
    }

    try {
      console.log(
        '📱 RASTRO: mostrando ventana nativa de instalación...'
      );

      // --------------------------------------------------------
      // Mostrar diálogo nativo
      // --------------------------------------------------------

      await activePrompt.prompt();

      // --------------------------------------------------------
      // Esperar respuesta del usuario
      // --------------------------------------------------------

      const choice = await activePrompt.userChoice;

      console.log(
        '📱 RASTRO: resultado de instalación:',
        choice?.outcome
      );

      // --------------------------------------------------------
      // El evento beforeinstallprompt solo puede utilizarse una
      // vez, por eso lo limpiamos.
      // --------------------------------------------------------

      window.deferredPWAEvent = null;
      setDeferredPrompt(null);

      if (choice?.outcome === 'accepted') {
        setIsStandalone(true);

        console.log(
          '✅ RASTRO: instalación aceptada'
        );
      } else {
        console.log(
          'ℹ️ RASTRO: instalación cancelada por el usuario'
        );
      }

    } catch (error) {
      console.error(
        '❌ RASTRO: error al mostrar instalación PWA:',
        error
      );
    }
  };

  // ============================================================
  // NOTIFICACIONES
  // ============================================================

  useEffect(() => {
    if (!user?.uid) {
      setUnreadCount(0);
      return;
    }

    try {
      const qUser = query(
        collection(db, 'notificaciones'),
        where('recipientUid', '==', user.uid)
      );

      const qAll = query(
        collection(db, 'notificaciones'),
        where('recipientUid', '==', 'all')
      );

      let userDocs = [];
      let allDocs = [];

      const updateCount = () => {
        const userUnread = userDocs.filter(d => !d.read).length;
        const allUnread = allDocs.filter(d => !d.read).length;
        setUnreadCount(userUnread + allUnread);
      };

      const unsubUser = onSnapshot(qUser, (snap) => {
        userDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        updateCount();
      }, (err) => {
        console.warn("Navbar user notif listener error:", err);
      });

      const unsubAll = onSnapshot(qAll, (snap) => {
        allDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        updateCount();
      }, (err) => {
        console.warn("Navbar all notif listener error:", err);
      });

      return () => {
        unsubUser();
        unsubAll();
      };
    } catch (e) {
      console.warn(
        'Notifications count catch:',
        e
      );
    }
  }, [user?.uid]);

  // Listener para abrir notificaciones desde cualquier enlace o aviso del dispositivo
  useEffect(() => {
    const checkParams = () => {
      const search = window.location.search;
      if (search.includes('openAvisos=true') || search.includes('openNotif=true')) {
        setIsNotifOpen(true);
      }
    };
    checkParams();
    window.addEventListener('popstate', checkParams);

    const handleOpenEvent = () => setIsNotifOpen(true);
    window.addEventListener('rastro-open-notificaciones', handleOpenEvent);

    return () => {
      window.removeEventListener('popstate', checkParams);
      window.removeEventListener('rastro-open-notificaciones', handleOpenEvent);
    };
  }, []);

  // ============================================================
  // CLICK FUERA DEL MENÚ
  // ============================================================

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 20);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // ============================================================
  // RUTAS
  // ============================================================

  const profilePath = user ? '/perfil' : '/auth';

  const navItems = [
    {
      path: '/',
      label: 'Inicio',
      icon: Home
    },
    {
      path: '/cursos',
      label: 'Cursos',
      icon: BookOpen
    },
    {
      path: '/simulador',
      label: 'Simulador',
      icon: Cpu
    },
    {
      path: '/biblioteca',
      label: 'Biblioteca',
      icon: Library
    },
    { 
      path: '/orstty', 
      label: 'ORSTTY', 
      isOrstty: true,
      desktopOnly: true
    },
    {
      path: '/chats',
      label: 'Chats',
      icon: MessageSquare,
      desktopOnly: true
    },
    {
      path: profilePath,
      label: 'Perfil',
      icon: User
    }
  ];

  // ============================================================
  // ITEM ACTIVO
  // ============================================================

  const isItemActive = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }

    if (itemPath === '/cursos') {
      return (
        location.pathname === '/cursos' ||
        location.pathname.startsWith('/cursos/')
      );
    }

    if (itemPath === '/simulador') {
      return (
        location.pathname === '/simulador' ||
        location.pathname.startsWith('/simulador/')
      );
    }

    if (itemPath === '/biblioteca') {
      return (
        location.pathname === '/biblioteca' ||
        location.pathname.startsWith('/biblioteca/')
      );
    }

    if (itemPath === '/orstty') {
      return (
        location.pathname === '/orstty' ||
        location.pathname.startsWith('/orstty/')
      );
    }

    if (itemPath === '/chats') {
      return (
        location.pathname === '/chats' ||
        location.pathname.startsWith('/chats/')
      );
    }

    if (
      itemPath === '/auth' ||
      itemPath === '/perfil'
    ) {
      return (
        location.pathname === '/auth' ||
        location.pathname === '/perfil' ||
        location.pathname.startsWith('/usuario')
      );
    }

    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const isAdminActive =
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/');

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ======================================================
          MOBILE HEADER
          ====================================================== */}

      <header
        className="mobile-header"
        style={{
          padding: '6px 12px',
          gap: '6px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Logo height={32} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
        >

          {/* Asistente ORSTTY (Sección superior en teléfonos móviles) */}
          <NavLink
            to="/orstty"
            title="Asistente ORSTTY"
            style={{
              padding: '4px 6px',
              borderRadius: '9px',
              border: 'none',
              background: location.pathname.startsWith('/orstty')
                ? 'rgba(168, 85, 247, 0.15)'
                : 'transparent',
              color: location.pathname.startsWith('/orstty') ? 'var(--accent-color)' : 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              fontSize: '0.60rem',
              fontWeight: 800,
              textDecoration: 'none',
              cursor: 'pointer',
              minWidth: '34px',
              transition: 'all 0.15s ease'
            }}
          >
            <GeminiStarIcon size={16} color={location.pathname.startsWith('/orstty') ? 'var(--accent-color)' : 'currentColor'} />
            <span style={{ lineHeight: 1 }}>ORSTTY</span>
          </NavLink>

          {/* Mis Chats (Sección superior al lado de ORSTTY en teléfonos móviles) */}
          <NavLink
            to="/chats"
            title="Mis Chats"
            style={{
              padding: '4px 6px',
              borderRadius: '9px',
              border: 'none',
              background: location.pathname.startsWith('/chats')
                ? 'rgba(0, 122, 255, 0.15)'
                : 'transparent',
              color: location.pathname.startsWith('/chats') ? 'var(--accent-color, #007AFF)' : 'var(--text-secondary, #6B7280)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              fontSize: '0.60rem',
              fontWeight: 800,
              textDecoration: 'none',
              cursor: 'pointer',
              minWidth: '34px',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={16} />
            <span style={{ lineHeight: 1 }}>Chats</span>
          </NavLink>

          {/* Notificaciones */}
          {user && (
            <button
              onClick={() => setIsNotifOpen(true)}
              title="Notificaciones y Avisos"
              style={{
                padding: '4px 6px',
                borderRadius: '9px',
                border: 'none',
                background: isNotifOpen || unreadCount > 0
                  ? 'rgba(168, 85, 247, 0.15)'
                  : 'transparent',
                color: isNotifOpen || unreadCount > 0 ? 'var(--accent-color)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                fontSize: '0.60rem',
                fontWeight: 800,
                cursor: 'pointer',
                position: 'relative',
                minWidth: '34px',
                transition: 'all 0.15s ease'
              }}
            >
              <Bell size={16} color={isNotifOpen || unreadCount > 0 ? 'var(--accent-color)' : 'currentColor'} />

              <span style={{ lineHeight: 1 }}>
                Avisos
              </span>

              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '1px',
                    background: 'var(--accent-color, #EF4444)',
                    color: '#FFFFFF',
                    fontSize: '0.52rem',
                    fontWeight: 800,
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid var(--card-bg)'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Subir */}
          <button
            onClick={() => setIsUploadOpen(true)}
            title="Aportar Material Educativo"
            style={{
              padding: '4px 7px',
              borderRadius: '9px',
              border: 'none',
              background: 'rgba(0, 122, 255, 0.12)',
              color: 'var(--accent-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              fontSize: '0.60rem',
              fontWeight: 800,
              cursor: 'pointer',
              minWidth: '34px'
            }}
          >
            <UploadCloud size={16} />

            <span style={{ lineHeight: 1 }}>
              Subir
            </span>
          </button>

          {/* Tema */}
          <button
            onClick={() => setIsThemeOpen(true)}
            title="Cambiar Tema Visual"
            style={{
              padding: '4px 6px',
              borderRadius: '9px',
              border: 'none',
              background: 'rgba(120, 120, 128, 0.12)',
              color: 'var(--text-main)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              fontSize: '0.60rem',
              fontWeight: 800,
              cursor: 'pointer',
              minWidth: '34px'
            }}
          >
            <Palette size={15} />

            <span style={{ lineHeight: 1 }}>
              Tema
            </span>
          </button>
        </div>
      </header>

      {/* ======================================================
          MAIN FLOATING NAVBAR
          ====================================================== */}

      <div className="liquid-navbar-wrapper">

        <nav className="liquid-navbar">

          <div className="desktop-logo-container">
            <NavLink
              to="/"
              title="Inicio - RASTRO"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Logo height={38} />
            </NavLink>
          </div>

          <div className="nav-items-container">

            {/* Navegación */}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                isItemActive(item.path);

              const handleItemClick = (e) => {
                if (item.path === '/cursos' && !user) {
                  e.preventDefault();
                  setShowGooglePrompt(true);
                  return;
                }
              };

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  end={item.path === '/'}
                  className={`nav-item ${item.isOrstty ? 'nav-item-orstty' : ''} ${item.desktopOnly ? 'desktop-only-nav-item' : ''} ${
                    isActive ? 'active' : ''
                  }`}
                  style={item.isOrstty ? {
                    color: isActive ? 'var(--pill-active-text)' : 'inherit'
                  } : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="nav-pill-active"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}

                  {item.isOrstty ? (
                    <div
                      style={{
                        position: 'relative',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}
                    >
                      <GeminiStarIcon size={19} color={isActive ? 'var(--pill-active-text)' : 'var(--text-main)'} />
                    </div>
                  ) : Icon ? (
                    <Icon
                      size={18}
                      style={{
                        zIndex: 2,
                        position: 'relative'
                      }}
                    />
                  ) : null}

                  <span
                    style={{
                      zIndex: 2,
                      position: 'relative'
                    }}
                    className="nav-label"
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}

            {/* Admin */}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={`nav-item desktop-admin-pill ${
                  isAdminActive ? 'active' : ''
                }`}
                style={{
                  color: isAdminActive
                    ? 'var(--pill-active-text)'
                    : '#A855F7'
                }}
              >
                {isAdminActive && (
                  <motion.div
                    layoutId="activePill"
                    className="nav-pill-active"
                    style={{
                      background:
                        'linear-gradient(135deg, #A855F7, #6366F1)'
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}

                <Shield
                  size={18}
                  style={{
                    zIndex: 2,
                    position: 'relative'
                  }}
                />

                <span
                  style={{
                    zIndex: 2,
                    position: 'relative'
                  }}
                  className="nav-label"
                >
                  Admin
                </span>
              </NavLink>
            )}

            {/* Avisos / Notificaciones (Visible en Tablet y Desktop) */}
            <button
              onClick={() => {
                if (user) {
                  setIsNotifOpen(true);
                } else {
                  setShowGooglePrompt(true);
                }
              }}
              className="nav-item nav-notif-btn"
              title="Notificaciones y Avisos"
              style={{
                background: 'transparent',
                border: 'none',
                position: 'relative'
              }}
            >
              <Bell
                size={18}
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
              />

              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '6px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3
                  }}
                >
                  {unreadCount > 9
                    ? '9+'
                    : unreadCount}
                </span>
              )}

              <span
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
                className="nav-label"
              >
                Avisos
              </span>
            </button>

            {/* Aportar */}

            <button
              onClick={() => setIsUploadOpen(true)}
              className="nav-item desktop-action-btn"
              title="Aportar Material"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-color)'
              }}
            >
              <UploadCloud
                size={18}
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
              />

              <span
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
                className="nav-label"
              >
                Aportar
              </span>
            </button>

            {/* Tema */}

            <button
              onClick={() => setIsThemeOpen(true)}
              className="nav-item desktop-action-btn"
              title="Cambiar Tema"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)'
              }}
            >
              <Palette
                size={18}
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
              />

              <span
                style={{
                  zIndex: 2,
                  position: 'relative'
                }}
                className="nav-label"
              >
                Tema
              </span>
            </button>

            {/* ==================================================
                MENÚ MÁS
                ================================================== */}

            <div
              ref={menuRef}
              style={{
                position: 'relative',
                display: 'inline-flex',
                overflow: 'visible'
              }}
            >

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                className={`nav-item ${
                  isMenuOpen ? 'menu-open' : ''
                }`}
                title="Más Opciones & Herramientas"
                aria-label="Más Opciones"
                aria-expanded={isMenuOpen}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isMenuOpen
                    ? 'var(--accent-color)'
                    : isAdminActive
                      ? '#A855F7'
                      : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >

                {isMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9
                    }}
                    className="nav-pill-active"
                    style={{
                      background:
                        'rgba(0,122,255,0.12)'
                    }}
                    transition={{
                      duration: 0.15
                    }}
                  />
                )}

                <MoreHorizontal
                  size={18}
                  style={{
                    zIndex: 2,
                    position: 'relative'
                  }}
                />

                <span
                  className="nav-label"
                  style={{
                    zIndex: 2,
                    position: 'relative'
                  }}
                >
                  Más
                </span>

                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '4px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#EF4444',
                      zIndex: 3
                    }}
                  />
                )}
              </button>

              {/* ==================================================
                  POPOVER
                  ================================================== */}

              <AnimatePresence>

                {isMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.94,
                      y: isMobileNav ? 10 : -10
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      y: isMobileNav ? 10 : -10
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 28
                    }}
                    style={{
                      transformOrigin: isMobileNav ? 'bottom right' : 'top right'
                    }}
                    className="nav-popover-menu"
                  >

                    {/* Avisos */}

                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(true);
                          setIsMenuOpen(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '14px',
                          border: 'none',
                          background:
                            'rgba(120, 120, 128, 0.06)',
                          color: 'var(--text-main)',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'space-between',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <Bell
                            size={16}
                            style={{
                              color:
                                'var(--accent-color)'
                            }}
                          />

                          <span>
                            Avisos & Notificaciones
                          </span>
                        </div>

                        {unreadCount > 0 && (
                          <span
                            style={{
                              background: '#EF4444',
                              color: '#FFF',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '99px'
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Chats en menú */}
                    <NavLink
                      to="/chats"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: location.pathname.startsWith('/chats')
                          ? 'rgba(0, 122, 255, 0.12)'
                          : 'rgba(120, 120, 128, 0.06)',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left',
                        textDecoration: 'none'
                      }}
                    >
                      <MessageSquare
                        size={16}
                        style={{
                          color: 'var(--accent-color)'
                        }}
                      />
                      <span>Mis Chats Privados</span>
                    </NavLink>

                    {/* Aportar */}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUploadOpen(true);
                        setIsMenuOpen(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background:
                          'rgba(120, 120, 128, 0.06)',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <UploadCloud
                        size={16}
                        style={{
                          color:
                            'var(--accent-color)'
                        }}
                      />

                      <span>
                        Aportar Material
                      </span>
                    </button>

                    {/* Tema */}

                    <button
                      type="button"
                      onClick={() => {
                        setIsThemeOpen(true);
                        setIsMenuOpen(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background:
                          'rgba(120, 120, 128, 0.06)',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <Palette
                        size={16}
                        style={{
                          color: '#F59E0B'
                        }}
                      />

                      <span>
                        Cambiar Tema
                      </span>
                    </button>

                    {/* ==================================================
                        INSTALAR APP PWA
                        ================================================== */}

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowPWAInstallModal(true);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background:
                          'rgba(16, 185, 129, 0.12)',
                        color: '#10B981',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <Download size={16} />

                      <span>
                        {isStandalone
                          ? 'App Instalada'
                          : 'Instalar App (PWA)'}
                      </span>
                    </button>

                    {/* Cerrar sesión — ⋮ */}
                    {user && (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsMenuOpen(false);
                          try { await logout(); } catch {}
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '14px',
                          border: 'none',
                          background: 'rgba(255,59,48,0.08)',
                          color: '#EF4444',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} style={{ color: '#EF4444' }} /> Cerrar sesión
                      </button>
                    )}

                    {/* Admin */}

                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        onClick={() =>
                          setIsMenuOpen(false)
                        }
                        style={{
                          padding: '11px 14px',
                          borderRadius: '14px',
                          background: isAdminActive
                            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.28), rgba(99, 102, 241, 0.28))'
                            : 'linear-gradient(135deg, rgba(168, 85, 247, 0.16), rgba(99, 102, 241, 0.16))',
                          color: '#A855F7',
                          border: isAdminActive ? '1px solid rgba(168, 85, 247, 0.45)' : '1px solid rgba(168, 85, 247, 0.2)',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Shield size={17} />
                          <span>Panel de Admin</span>
                        </div>
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: 'rgba(168, 85, 247, 0.25)',
                          color: '#A855F7'
                        }}>
                          GESTIÓN
                        </span>
                      </NavLink>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </div>

        </nav>

      </div>

      {/* ======================================================
          MODALES
          ====================================================== */}

      <ThemeSelectorModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <ErrorBoundary onError={() => { setIsNotifOpen(false); document.body.style.overflow = ''; }}>
        <NotificationsModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      </ErrorBoundary>

      <GoogleSignPromptModal
        isOpen={showGooglePrompt}
        onClose={() => setShowGooglePrompt(false)}
        destination="/cursos"
      />

      <AnimatePresence>
        {showPWAInstallModal && !isStandalone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowPWAInstallModal(false);
              sessionStorage.setItem('rastro_pwa_prompt_dismissed', '1');
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '360px',
                borderRadius: '24px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                padding: '22px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--card-bg)', border: '1.5px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', overflow: 'hidden' }}>
                <img src="./assets/rastro-pwa-icon.png" alt="RASTRO" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>Instalar RASTRO</h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>Accede más rápido, funciona sin conexión y recibe novedades. Instala RASTRO como app en tu dispositivo.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', background: 'rgba(120,120,128,0.06)', borderRadius: '14px', padding: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>✓ Acceso directo desde tu pantalla</span>
                <span>✓ Carga más rápida y modo offline</span>
                <span>✓ Experiencia a pantalla completa</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    setShowPWAInstallModal(false);
                    sessionStorage.setItem('rastro_pwa_prompt_dismissed', '1');
                  }}
                  style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Más tarde
                </button>
                <button
                  onClick={async () => {
                    await handleInstallPWA();
                    setShowPWAInstallModal(false);
                    sessionStorage.setItem('rastro_pwa_prompt_dismissed', '1');
                  }}
                  style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #007AFF, #00C6FF)', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,122,255,0.3)' }}
                >
                  Instalar App
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};