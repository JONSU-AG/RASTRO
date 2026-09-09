import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WarningBanner = () => {
  const { user, userData, hasWarning, warningMessage, dismissWarning } = useAuth();

  if (!user || !hasWarning) return null;

  const displayName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Usuario';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          padding: '16px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          boxSizing: 'border-box'
        }}
        onClick={dismissWarning}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '92%',
            maxWidth: '520px',
            maxHeight: '85vh',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.98), rgba(253, 230, 138, 0.98))',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid #F59E0B',
            borderRadius: '20px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25), 0 16px 36px rgba(245, 158, 11, 0.35)',
            padding: '20px 18px',
            color: '#92400E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            textAlign: 'center',
            margin: '0 auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%', minWidth: 0, textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.25)',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0, maxWidth: '100%', textAlign: 'center', overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: 'clamp(0.95rem, 2.8vw, 1.05rem)', lineHeight: 1.25, wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', textAlign: 'center' }}>
              Hola {displayName}, tienes un aviso
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#92400E', opacity: 0.9, marginTop: '4px', wordBreak: 'break-word', textAlign: 'center' }}>
              Aviso de la Comunidad RASTRO
            </div>
            <div style={{ fontSize: 'clamp(0.84rem, 2.4vw, 0.9rem)', marginTop: '8px', lineHeight: 1.5, color: '#78350F', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', hyphens: 'auto', maxWidth: '100%', textAlign: 'center' }}>
              {warningMessage || 'Has recibido un aviso de moderación sobre tus aportes. Recuerda verificar que los enlaces y documentos cumplan con las normas académicas.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            onClick={dismissWarning}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              border: 'none',
              background: '#D97706',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
              minWidth: '120px',
              justifyContent: 'center'
            }}
          >
            <Check size={14} /> Entendido
          </button>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
