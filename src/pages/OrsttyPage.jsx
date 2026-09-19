import React, { useEffect, useState } from 'react';
import { OrsttyChat } from '../asistente/orstty/OrsttyChat';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Wrench, ShieldAlert, EyeOff, CheckCircle, Clock, Ban } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToSiteSettings, getCachedSiteSettings } from '../lib/siteSettings';
import { getOrsttyStatus, deactivateOrstty, reactivateOrstty } from '../lib/orsttySettings';
import { IOSModal } from '../components/IOSModal';
import { OrsttyMascot } from '../components/Mascots';

export default function OrsttyPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [siteSettings, setSiteSettings] = useState(getCachedSiteSettings);
  const [orsttyStatus, setOrsttyStatus] = useState(getOrsttyStatus);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    const unsub = subscribeToSiteSettings(s => setSiteSettings(s));
    return () => unsub();
  }, []);

  useEffect(() => {
    document.title = 'ORSTTY Asistente | RASTRO';
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleStatusChange = () => {
      setOrsttyStatus(getOrsttyStatus());
    };
    window.addEventListener('orstty_status_changed', handleStatusChange);
    window.addEventListener('storage', handleStatusChange);
    return () => {
      window.removeEventListener('orstty_status_changed', handleStatusChange);
      window.removeEventListener('storage', handleStatusChange);
    };
  }, []);

  const isOrsttyDisabledByAdmin = siteSettings.orsttyEnabled === false;
  const isOrsttyDisabledByUser = orsttyStatus.mode === 'temp' || orsttyStatus.mode === 'forever';

  const handleDeactivate = (mode) => {
    deactivateOrstty(mode);
    setOrsttyStatus(getOrsttyStatus());
    setIsDeactivateModalOpen(false);
    setSuccessToast(
      mode === 'temp'
        ? 'Asistente desactivado temporalmente (esta sesión). Su botón ya no aparecerá en la barra.'
        : 'Asistente desactivado para siempre. Su botón ha sido retirado de la interfaz.'
    );
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleReactivate = () => {
    reactivateOrstty();
    setOrsttyStatus(getOrsttyStatus());
    setSuccessToast('¡Asistente ORSTTY reactivado! Su botón volverá a estar visible.');
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="orstty-page-wrapper">
      <style>{`
        .orstty-page-wrapper {
          height: calc(100dvh - 54px);
          max-height: calc(100dvh - 54px);
          padding-top: 6px !important;
          padding-bottom: 68px !important;
          padding-left: 8px;
          padding-right: 8px;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12) 0%, transparent 60%);
        }
        @media (min-width: 768px) {
          .orstty-page-wrapper {
            height: 100vh;
            max-height: 100vh;
            padding-top: 84px !important;
            padding-bottom: 20px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            max-width: 860px;
          }
        }
        @media (min-width: 1025px) {
          .orstty-page-wrapper {
            padding-top: 88px !important;
            padding-bottom: 24px !important;
            max-width: 900px;
          }
        }
      `}</style>

      {/* Header bar with Back button, Status and Deactivate button */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
          padding: '0 2px',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.9))',
            color: 'var(--text-main, #1F2937)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} color="#7C3AED" />
          <span>Volver</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botón rápido para Desactivar / Reactivar */}
          {isOrsttyDisabledByUser ? (
            <button
              onClick={handleReactivate}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(52, 168, 83, 0.35)',
                background: 'rgba(52, 168, 83, 0.12)',
                color: '#34A853',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={13} />
              <span>Reactivar Botón</span>
            </button>
          ) : (
            <button
              onClick={() => setIsDeactivateModalOpen(true)}
              title="Configurar visibilidad del botón de ORSTTY"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                background: 'var(--card-bg, rgba(255, 255, 255, 0.8))',
                color: '#EF4444',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <EyeOff size={13} />
              <span>Desactivar Botón</span>
            </button>
          )}

          {/* Badge de Estado */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '99px',
              background: isOrsttyDisabledByAdmin 
                ? 'rgba(239, 68, 68, 0.12)' 
                : isOrsttyDisabledByUser 
                ? 'rgba(245, 158, 11, 0.12)' 
                : 'rgba(124, 58, 237, 0.12)',
              border: isOrsttyDisabledByAdmin 
                ? '1px solid rgba(239, 68, 68, 0.3)' 
                : isOrsttyDisabledByUser 
                ? '1px solid rgba(245, 158, 11, 0.3)' 
                : '1px solid rgba(124, 58, 237, 0.28)',
              color: isOrsttyDisabledByAdmin 
                ? '#DC2626' 
                : isOrsttyDisabledByUser 
                ? '#B45309' 
                : '#7C3AED',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            <span 
              style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: isOrsttyDisabledByAdmin ? '#DC2626' : isOrsttyDisabledByUser ? '#F59E0B' : '#7C3AED', 
                boxShadow: isOrsttyDisabledByAdmin ? '0 0 8px #DC2626' : isOrsttyDisabledByUser ? '0 0 8px #F59E0B' : '0 0 8px #7C3AED' 
              }} 
            />
            <span>
              {isOrsttyDisabledByAdmin 
                ? 'Mantenimiento' 
                : isOrsttyDisabledByUser 
                ? 'Oculto' 
                : 'ORSTTY Activo'}
            </span>
          </div>
        </div>
      </div>

      {/* Toast de confirmación */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(52, 168, 83, 0.15)',
              border: '1px solid rgba(52, 168, 83, 0.35)',
              color: '#166534',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
              flexShrink: 0
            }}
          >
            <CheckCircle size={15} color="#166534" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CASO 1: Si ORSTTY está desactivado por el Administrador (Mantenimiento Técnico) */}
      {isOrsttyDisabledByAdmin && !isAdmin ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="glass-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '32px 24px',
              borderRadius: '28px',
              textAlign: 'center',
              border: '1.5px solid rgba(124, 58, 237, 0.25)',
              background: 'var(--card-bg)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(239, 68, 68, 0.15))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: '#7C3AED'
            }}>
              <Wrench size={32} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--text-main)' }}>
              ORSTTY en Mantenimiento Temporal 🔧
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 24px' }}>
              El asistente con inteligencia artificial está temporalmente fuera de servicio por motivos de optimización y mantenimiento del sistema.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/cursos"
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  background: 'var(--accent-color)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
                }}
              >
                Explorar Cursos
              </Link>
            </div>
          </div>
        </motion.div>
      ) : isOrsttyDisabledByUser ? (
        /* CASO 2: El usuario desactivó a ORSTTY personal e intencionalmente */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="glass-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '34px 24px',
              borderRadius: '28px',
              textAlign: 'center',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              background: 'var(--card-bg)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <OrsttyMascot mood="pensativo" size={88} />
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
              Asistente ORSTTY Desactivado
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55, margin: '0 0 20px' }}>
              Has desactivado a ORSTTY <strong>{orsttyStatus.label.toLowerCase()}</strong>. Su botón ya no se muestra en tu barra de navegación ni en tus chats.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleReactivate}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)'
                }}
              >
                <Sparkles size={16} />
                <span>Reactivar Asistente y Mostrar Botón</span>
              </button>

              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* CASO 3: Asistente Activo */
        <>
          {/* Banner informativo para Administrador si está desactivado a nivel general */}
          {isOrsttyDisabledByAdmin && isAdmin && (
            <div style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.14)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '0.78rem',
              color: '#B45309',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} />
                <span>Modo Mantenimiento activo: ORSTTY está desactivado para los estudiantes. (Vista de Administrador)</span>
              </div>
              <Link to="/admin" style={{ color: '#B45309', textDecoration: 'underline', fontWeight: 800 }}>
                Gestionar en Admin
              </Link>
            </div>
          )}

          {/* Main Chat Component */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
          >
            <OrsttyChat />
          </motion.div>
        </>
      )}

      {/* Modal para configurar desactivación (temporal vs permanente) */}
      <IOSModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title="Desactivar Asistente ORSTTY"
        closeText="Cancelar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            Elige cómo prefieres desactivar al asistente para que <strong>su botón deje de aparecer</strong> en la barra de navegación:
          </p>

          {/* Opción 1: Temporal */}
          <div 
            onClick={() => handleDeactivate('temp')}
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              background: 'rgba(245, 158, 11, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#B45309'
            }}>
              <Clock size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                Desactivar Temporalmente
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Oculta el botón solo durante esta sesión de navegación. Volverá a aparecer si recargas la página o abres la app en otra ocasión.
              </div>
            </div>
          </div>

          {/* Opción 2: Para siempre */}
          <div 
            onClick={() => handleDeactivate('forever')}
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1.5px solid rgba(239, 68, 68, 0.35)',
              background: 'rgba(239, 68, 68, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#DC2626'
            }}>
              <Ban size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                Desactivar Para Siempre
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Oculta el botón de forma permanente en este dispositivo. Podrás volver a reactivarlo cuando quieras desde tu Perfil.
              </div>
            </div>
          </div>
        </div>
      </IOSModal>
    </div>
  );
}
