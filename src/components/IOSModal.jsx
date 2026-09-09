import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Save, Loader2 } from 'lucide-react';

export const IOSModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSave = null, 
  saveText = 'Guardar',
  isSaving = false,
  closeText = 'Entendido' 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="ios-modal-backdrop" onClick={onClose}>
        <motion.div
          className="ios-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          style={{ boxSizing: 'border-box' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck color="var(--google-blue)" size={22} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ maxHeight: 'calc(80vh - 130px)', overflowY: 'auto', paddingRight: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, WebkitOverflowScrolling: 'touch', boxSizing: 'border-box' }}>
            {children}
          </div>

          {/* Modal Action Buttons Footer */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
            {onSave && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSave}
                disabled={isSaving}
                style={{
                  padding: '10px 22px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#34A853',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: isSaving ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(52, 168, 83, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '42px'
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{saveText || 'Guardar'}</span>
                  </>
                )}
              </motion.button>
            )}

            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(66, 133, 244, 0.3)',
                minHeight: '42px'
              }}
            >
              {closeText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

