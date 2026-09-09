import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { OrsttyChat } from './OrsttyChat';
import { OrsttyAvatar, ORSTTY_STATES } from './OrsttyAvatar';

export function FloatingOrsttyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't show floating launcher if already on full /orstty page
  if (location.pathname === '/orstty') {
    return null;
  }

  return (
    <>
      {/* Floating launcher button (bottom right, above bottom nav on mobile) */}
      <div
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '20px',
          zIndex: 8999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}
      >
        <motion.button
          onClick={() => setIsOpen(prev => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.9), rgba(139, 92, 246, 0.9))',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          title="Abrir Asistente ORSTTY"
        >
          {isOpen ? (
            <X size={24} color="#FFFFFF" />
          ) : (
            <div style={{ position: 'relative', width: '38px', height: '38px' }}>
              <img
                src="/orstty.png"
                alt="ORSTTY"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallback1) {
                    e.currentTarget.dataset.fallback1 = '1';
                    e.currentTarget.src = '/astrologo-removebg-preview.png';
                  } else if (!e.currentTarget.dataset.fallback2) {
                    e.currentTarget.dataset.fallback2 = '1';
                    e.currentTarget.src = '/astrologo.png';
                  } else {
                    e.currentTarget.src = '/applogo.png';
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
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #FFFFFF'
                }}
              />
            </div>
          )}
        </motion.button>
      </div>

      {/* Floating Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="ios-modal-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 99990
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '100%',
                maxWidth: '780px',
                height: '84vh',
                maxHeight: '800px',
                display: 'flex'
              }}
            >
              <OrsttyChat onClose={() => setIsOpen(false)} isDrawer={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
