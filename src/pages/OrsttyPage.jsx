import React, { useEffect, useState } from 'react';
import { OrsttyChat } from '../asistente/orstty/OrsttyChat';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, HelpCircle, Wrench, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToSiteSettings, getCachedSiteSettings } from '../lib/siteSettings';

export default function OrsttyPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [siteSettings, setSiteSettings] = useState(getCachedSiteSettings);

  useEffect(() => {
    const unsub = subscribeToSiteSettings(s => setSiteSettings(s));
    return () => unsub();
  }, []);

  useEffect(() => {
    document.title = 'ORSTTY Asistente | RASTRO';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const isOrsttyDisabled = siteSettings.orsttyEnabled === false;

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

      {/* Header bar with Back button and Status */}
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
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '99px',
              background: isOrsttyDisabled ? 'rgba(239, 68, 68, 0.12)' : 'rgba(124, 58, 237, 0.12)',
              border: isOrsttyDisabled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(124, 58, 237, 0.28)',
              color: isOrsttyDisabled ? '#DC2626' : '#7C3AED',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOrsttyDisabled ? '#DC2626' : '#7C3AED', boxShadow: isOrsttyDisabled ? '0 0 8px #DC2626' : '0 0 8px #7C3AED' }} />
            <span>{isOrsttyDisabled ? 'Mantenimiento Técnico' : 'ORSTTY IA · Morado'}</span>
          </div>
        </div>
      </div>

      {/* Si ORSTTY está desactivado para estudiantes y el usuario NO es admin, mostrar pantalla de mantenimiento */}
      {isOrsttyDisabled && !isAdmin ? (
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
              El asistente con inteligencia artificial está temporalmente fuera de servicio por motivos de optimización y mantenimiento del sistema. Estará disponible nuevamente muy pronto.
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
              <Link
                to="/biblioteca"
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  background: 'rgba(120, 120, 128, 0.1)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                  border: '1px solid var(--card-border)'
                }}
              >
                Ir a Biblioteca
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Banner informativo para Administrador si está desactivado */}
          {isOrsttyDisabled && isAdmin && (
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
    </div>
  );
}
