import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingWhatsApp() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Solo mostrar una vez al entrar a la app por sesión, NO en cada sección o cambio de ruta
    try {
      if (sessionStorage.getItem('rastro_wa_bubble_shown')) {
        return;
      }
      sessionStorage.setItem('rastro_wa_bubble_shown', 'true');
    } catch {
      // ignore storage restriction if any
    }

    const enterTimer = setTimeout(() => {
      setShowBubble(true);
    }, 800);

    const hideTimer = setTimeout(() => {
      setShowBubble(false);
    }, 5500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const channelUrl = "https://whatsapp.com/channel/0029VbDFAEu7YScyVZBNul0X";

  return (
    <div className="floating-whatsapp-container">
      {/* Mensaje emergente automático tipo tooltip que aparece sin tocar y luego desaparece */}
      <AnimatePresence>
        {showBubble && (
          <motion.a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 18, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.88, transition: { duration: 0.35 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            style={{
              pointerEvents: 'auto',
              textDecoration: 'none',
              background: 'rgba(18, 18, 22, 0.94)',
              color: '#FFFFFF',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(37, 211, 102, 0.5)',
              borderRadius: '16px',
              padding: '6px 12px',
              fontSize: '0.74rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              cursor: 'pointer',
              lineHeight: 1.25,
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>📢</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#FFFFFF', whiteSpace: 'nowrap' }}>¡Síguenos en el</span>
              <span style={{ color: '#25D366', whiteSpace: 'nowrap' }}>
                canal de WhatsApp!
              </span>
            </div>

            {/* Flecha indicadora apuntando hacia el botón de WhatsApp */}
            <div style={{
              position: 'absolute',
              right: '-5px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: '9px',
              height: '9px',
              background: 'rgba(18, 18, 22, 0.94)',
              borderRight: '1.5px solid rgba(37, 211, 102, 0.5)',
              borderTop: '1.5px solid rgba(37, 211, 102, 0.5)'
            }} />
          </motion.a>
        )}
      </AnimatePresence>

      <motion.a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        title="Canal oficial de WhatsApp RASTRO"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowBubble(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="floating-whatsapp-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ marginLeft: '1px', marginBottom: '1px' }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </motion.a>
    </div>
  );
}
