import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, CheckCircle2, Smile, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const ORSTTY_STATES = {
  IDLE: 'idle',
  THINKING: 'thinking',
  SEARCHING: 'searching',
  FOUND: 'found',
  HAPPY: 'happy',
  CONFUSED: 'confused',
  NO_RESULTS: 'no_results',
  ERROR: 'error'
};

const STATE_CONFIG = {
  idle: {
    label: 'En línea',
    sublabel: 'Listo para ayudarte',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.35)',
    icon: null
  },
  thinking: {
    label: 'Pensando...',
    sublabel: 'Analizando tu consulta',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.35)',
    icon: Sparkles
  },
  searching: {
    label: 'Buscando...',
    sublabel: 'Consultando RASTRO',
    color: '#007AFF',
    glow: 'rgba(0, 122, 255, 0.4)',
    icon: Search
  },
  found: {
    label: '¡Encontrado!',
    sublabel: 'Resultados listos',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
    icon: CheckCircle2
  },
  happy: {
    label: '¡Listo!',
    sublabel: 'A tu servicio',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.35)',
    icon: Smile
  },
  confused: {
    label: '¿Cómo dijiste?',
    sublabel: 'Intenta con otras palabras',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.35)',
    icon: HelpCircle
  },
  no_results: {
    label: 'Sin resultados',
    sublabel: 'Prueba con otra materia o semana',
    color: '#6B7280',
    glow: 'rgba(107, 114, 128, 0.25)',
    icon: AlertCircle
  },
  error: {
    label: 'Algo falló',
    sublabel: 'Reintenta en un momento',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    icon: RefreshCw
  }
};

export function OrsttyAvatar({ 
  state = 'idle', 
  size = 48, 
  showBadge = true, 
  showStatusText = false,
  className = ''
}) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const BadgeIcon = cfg.icon;

  // Animation variants according to state
  const getAnimation = () => {
    switch (state) {
      case 'thinking':
        return {
          rotate: [-4, 4, -4],
          scale: [1, 1.04, 1],
          transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'searching':
        return {
          y: [0, -4, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'found':
        return {
          y: [0, -8, 0],
          scale: [1, 1.08, 1],
          transition: { duration: 0.5, ease: 'easeOut' }
        };
      case 'happy':
        return {
          rotate: [-6, 6, -4, 4, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, ease: 'easeInOut' }
        };
      case 'confused':
        return {
          rotate: -12,
          y: [0, -2, 0],
          transition: { duration: 0.6, ease: 'easeOut' }
        };
      case 'no_results':
        return {
          x: [-3, 3, -3, 3, 0],
          transition: { duration: 0.5, ease: 'easeInOut' }
        };
      case 'error':
        return {
          rotate: [-3, 3, -3, 0],
          transition: { duration: 0.4 }
        };
      case 'idle':
      default:
        return {
          y: [0, -3, 0],
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
    }
  };

  return (
    <div 
      className={`orstty-avatar-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '10px',
        position: 'relative'
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: `${size}px`, 
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {/* Radar ping ring when searching */}
        {state === 'searching' && (
          <motion.div
            animate={{
              scale: [1, 1.5],
              opacity: [0.7, 0]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: `2px solid ${cfg.color}`,
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
        )}

        {/* Glow halo */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${cfg.glow} 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(4px)',
            zIndex: 0
          }}
        />

        {/* Mascot Avatar Image */}
        <motion.div
          animate={getAnimation()}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.08))',
            border: `1.5px solid ${cfg.color}`,
            boxShadow: `0 4px 14px ${cfg.glow}`,
            overflow: 'hidden',
            padding: `${Math.max(2, Math.round(size * 0.06))}px`,
            position: 'relative',
            zIndex: 1
          }}
        >
          <img
            src="./astrologo-removebg-preview.png"
            alt="ORSTTY"
            onError={(e) => {
              if (e.currentTarget.src.includes('astrologo-removebg-preview')) {
                e.currentTarget.src = './astrologo.png';
              } else {
                e.currentTarget.src = './applogo.png';
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* Small corner status badge */}
        {showBadge && (
          <div 
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: `${Math.max(14, Math.round(size * 0.32))}px`,
              height: `${Math.max(14, Math.round(size * 0.32))}px`,
              borderRadius: '50%',
              background: cfg.color,
              border: '2px solid var(--card-bg, #1e1e24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '0.6rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 2
            }}
            title={cfg.label}
          >
            {BadgeIcon ? (
              <BadgeIcon size={Math.max(8, Math.round(size * 0.18))} strokeWidth={2.6} />
            ) : (
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#FFFFFF'
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Optional Side status text */}
      {showStatusText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main, #FFFFFF)' }}>
              ORSTTY
            </span>
            <span 
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: cfg.color,
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}40`,
                padding: '1px 7px',
                borderRadius: '99px'
              }}
            >
              {cfg.label}
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #9CA3AF)' }}>
            {cfg.sublabel}
          </span>
        </div>
      )}
    </div>
  );
}
