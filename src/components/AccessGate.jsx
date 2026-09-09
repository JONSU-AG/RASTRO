import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { verifyCredentialsForSection } from '../lib/accessControl';
import { Link } from 'react-router-dom';

export const AccessGate = ({
  sectionId,
  permission,
  accessSettings,
  onUnlocked,
  children
}) => {
  const { user, loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [credUser, setCredUser] = useState('');
  const [credPass, setCredPass] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState(false);

  // 1. If not logged in → Google Sign-In Gate
  if (!user) {
    const handleGoogleLogin = async () => {
      setGoogleLoading(true);
      setCredError('');
      try {
        await loginWithGoogle();
        if (onUnlocked) onUnlocked();
      } catch (err) {
        console.warn('Google auth error in gate:', err);
        setCredError('No se pudo completar el inicio de sesión con Google. Intenta nuevamente.');
      } finally {
        setGoogleLoading(false);
      }
    };

    return (
      <div className="page-container" style={{ padding: '60px 16px 120px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '36px 24px',
            borderRadius: '28px',
            border: '1.5px solid rgba(0, 122, 255, 0.28)',
            background: 'linear-gradient(180deg, rgba(0, 122, 255, 0.06) 0%, var(--card-bg) 60%)',
            boxShadow: '0 16px 40px rgba(0, 122, 255, 0.12)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(0, 122, 255, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <svg width="34" height="34" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px' }}>
            Acceso a Cursos con Google
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 22px' }}>
            Para acceder a las clases, academias y materiales de estudio de RASTRO, inicia sesión con tu cuenta de Google.
          </p>

          <div style={{
            background: 'rgba(0, 122, 255, 0.08)',
            border: '1px solid rgba(0, 122, 255, 0.2)',
            borderRadius: '16px',
            padding: '12px 14px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <Shield size={18} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
            <span>Google es nuestro único medio de acceso oficial, rápido y seguro.</span>
          </div>

          {credError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {credError}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #007AFF, #00C6FF)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: googleLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)'
            }}
          >
            {googleLoading ? (
              <span>Conectando con Google...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#fff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#fff" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#fff" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#fff" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Continuar con Google</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // 2. If blocked by Maintenance
  if (permission && !permission.allowed && permission.reason === 'maintenance') {
    return (
      <div className="page-container" style={{ padding: '60px 16px 120px', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{
            padding: '40px 24px',
            borderRadius: '28px',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, var(--card-bg) 70%)',
            boxShadow: '0 16px 40px rgba(245, 158, 11, 0.12)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <AlertTriangle size={34} />
          </div>

          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#D97706', fontSize: '0.78rem', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>
            Mantenimiento Temporal
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px' }}>
            Sección en Pausa Temporal
          </h2>

          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 26px', whiteSpace: 'pre-wrap' }}>
            {permission.message || 'Estamos actualizando el contenido para brindarte la mejor experiencia de estudio. Volveremos muy pronto.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/"
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                border: '1.5px solid var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Volver al Inicio
            </Link>
            <Link
              to="/cursos"
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                border: 'none',
                background: 'var(--accent-color)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Ver Otras Secciones
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. If blocked by Credentials requirement
  if (permission && !permission.allowed && permission.reason === 'credentials') {
    const handleVerify = (e) => {
      e.preventDefault();
      setCredError('');
      const ok = verifyCredentialsForSection(sectionId, credUser, credPass, accessSettings);
      if (ok) {
        setCredSuccess(true);
        setTimeout(() => {
          if (onUnlocked) onUnlocked();
        }, 300);
      } else {
        setCredError('Usuario o clave incorrectos para acceder a esta academia.');
      }
    };

    return (
      <div className="page-container" style={{ padding: '60px 16px 120px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{
            padding: '36px 24px',
            borderRadius: '28px',
            border: '1.5px solid rgba(168, 85, 247, 0.3)',
            background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.06) 0%, var(--card-bg) 60%)',
            boxShadow: '0 16px 40px rgba(168, 85, 247, 0.1)'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#A855F7',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>
            Acceso Verificado
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 20px' }}>
            Esta sección cuenta con acceso controlado. Ingresa tus credenciales asignadas o accede con un correo autorizado.
          </p>

          {credSuccess ? (
            <div style={{ padding: '16px', background: 'rgba(52, 168, 83, 0.12)', borderRadius: '16px', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> Acceso correcto, abriendo contenido...
            </div>
          ) : (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {credError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  {credError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Usuario de acceso
                </label>
                <input
                  type="text"
                  placeholder="Escribe tu usuario asignado"
                  value={credUser}
                  onChange={(e) => setCredUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.06)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Contraseña / Clave
                </label>
                <input
                  type="password"
                  required
                  placeholder="Escribe la clave de acceso"
                  value={credPass}
                  onChange={(e) => setCredPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.06)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  marginTop: '6px',
                  padding: '14px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(168, 85, 247, 0.3)'
                }}
              >
                <span>Verificar y Entrar</span>
                <ArrowRight size={18} />
              </motion.button>
            </form>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link
              to="/cursos"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              ← Volver a Cursos
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If permitted → Render children
  return children;
};
