import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Sparkles, ArrowRight, LogOut, AlertCircle, Loader2 } from 'lucide-react';

export function ChooseUsernameModal() {
  const { needsUsername, userData, user, updateChosenUsername, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const googleFallbackName = userData?.displayName || user?.displayName || '';

  useEffect(() => {
    if (needsUsername) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [needsUsername]);

  if (!needsUsername) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const clean = username.trim();
    if (!clean || clean.length < 2) {
      setError('Por favor escribe un nombre de usuario de al menos 2 caracteres.');
      return;
    }
    if (clean.length > 30) {
      setError('El nombre de usuario no puede exceder 30 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await updateChosenUsername(clean);
    } catch (err) {
      console.error('Error saving username:', err);
      setError(err.message || 'No se pudo guardar el nombre. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="choose-username-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999999,
          background: 'rgba(5, 10, 20, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          id="choose-username-card"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'var(--card-bg, #ffffff)',
            borderRadius: '28px',
            padding: '32px 28px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '1.5px solid rgba(0, 122, 255, 0.25)',
            textAlign: 'center',
            position: 'relative',
            color: 'var(--text-main, #0f172a)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 24px rgba(0, 122, 255, 0.35)',
            color: '#fff'
          }}>
            <UserCheck size={32} strokeWidth={2.4} />
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            color: 'var(--text-main, #0f172a)'
          }}>
            Elige tu nombre de usuario
          </h2>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary, #64748b)',
            lineHeight: 1.5,
            margin: '0 0 20px'
          }}>
            Ingresa el nombre o apodo con el que te verán los demás estudiantes en la comunidad, chats y biblioteca. <strong>Es el único dato requerido para continuar</strong>.
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label 
                  htmlFor="rastro-username-input"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--text-secondary, #64748b)'
                  }}
                >
                  Nombre de usuario
                </label>
                <span style={{ fontSize: '0.74rem', color: username.length > 25 ? '#ef4444' : 'var(--text-secondary, #94a3b8)' }}>
                  {username.length}/30
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  id="rastro-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.slice(0, 30));
                    if (error) setError('');
                  }}
                  placeholder="ej. Mateo_UNSA, DianaMed, Carlos99"
                  autoComplete="off"
                  maxLength={30}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    border: error ? '2px solid #ef4444' : '1.5px solid var(--card-border, #cbd5e1)',
                    background: 'var(--input-bg, rgba(120, 120, 128, 0.06))',
                    color: 'var(--text-main, #0f172a)',
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#007AFF';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--card-border, #cbd5e1)';
                  }}
                />
              </div>

              {googleFallbackName && googleFallbackName !== 'Estudiante RASTRO' && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary, #64748b)' }}>Sugerencia:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername(googleFallbackName.slice(0, 30));
                      if (error) setError('');
                    }}
                    style={{
                      background: 'rgba(0, 122, 255, 0.08)',
                      border: '1px solid rgba(0, 122, 255, 0.25)',
                      color: 'var(--accent-color, #007AFF)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      borderRadius: '99px',
                      padding: '3px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Usar "{googleFallbackName}"
                  </button>
                </div>
              )}

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  color: '#ef4444',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <motion.button
              id="confirm-username-btn"
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || username.trim().length < 2}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '16px',
                border: 'none',
                background: username.trim().length >= 2 
                  ? 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)' 
                  : 'rgba(120, 120, 128, 0.2)',
                color: username.trim().length >= 2 ? '#ffffff' : 'rgba(120, 120, 128, 0.8)',
                fontWeight: 700,
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: username.trim().length >= 2 && !loading ? 'pointer' : 'not-allowed',
                boxShadow: username.trim().length >= 2 ? '0 8px 24px rgba(0, 122, 255, 0.35)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>Continuar a RASTRO</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
            {username.trim().length < 2 && (
              <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', textAlign: 'center' }}>
                Debes escribir un nombre de usuario para poder continuar.
              </p>
            )}
          </form>

          {/* Opción de salir si no desea continuar */}
          <div style={{ marginTop: '22px', borderTop: '1px solid var(--card-border, rgba(120,120,128,0.15))', paddingTop: '16px' }}>
            <button
              id="username-logout-btn"
              type="button"
              onClick={() => logout()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary, #94a3b8)'}
            >
              <LogOut size={14} />
              <span>Cerrar sesión / Salir</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
