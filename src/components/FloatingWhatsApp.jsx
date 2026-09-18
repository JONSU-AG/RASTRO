import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const lastShown = localStorage.getItem('rastro_wa_last_shown');
      const now = Date.now();

      if (lastShown && now - parseInt(lastShown, 10) < SIX_HOURS_MS) {
        // Aún no han pasado 6 horas: no molestar al estudiante
        return;
      }

      // Registrar timestamp actual y mostrar
      localStorage.setItem('rastro_wa_last_shown', now.toString());

      // Aparece suavemente a los 1.5s de entrar
      const enterTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      // Desaparece automáticamente después de 12 segundos
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 13500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(hideTimer);
      };
    } catch {
      // ignore storage restriction
    }
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  const channelUrl = "https://whatsapp.com/channel/0029VbDFAEu7YScyVZBNul0X";

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="floating-whatsapp-container"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20, transition: { duration: 0.3 } }}
          style={{
            position: 'fixed',
            right: '18px',
            bottom: '88px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Tooltip con información y botón de cierre */}
          <motion.a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            style={{
              textDecoration: 'none',
              background: 'rgba(15, 23, 42, 0.94)',
              color: '#FFFFFF',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(37, 211, 102, 0.55)',
              borderRadius: '16px',
              padding: '8px 12px',
              fontSize: '0.76rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              lineHeight: 1.25
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📢</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#FFFFFF', whiteSpace: 'nowrap' }}>Canal Oficial UNSA</span>
              <span style={{ color: '#25D366', whiteSpace: 'nowrap' }}>¡Únete a la comunidad!</span>
            </div>

            {/* Botón cerrar rápido */}
            <button
              type="button"
              onClick={handleDismiss}
              title="Cerrar aviso"
              style={{
                marginLeft: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <X size={12} />
            </button>
          </motion.a>

          {/* Botón Circular de WhatsApp */}
          <motion.a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp"
            title="Canal oficial de WhatsApp RASTRO"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.5)',
              textDecoration: 'none'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

