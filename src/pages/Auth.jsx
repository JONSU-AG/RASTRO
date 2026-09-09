import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from './UserProfile';

// ─── Auth Form (when logged out) or Direct UserProfile (when logged in) ─────
export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in → show complete social profile & contributions feed directly!
  if (user) {
    return <UserProfile />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cleanName = username.trim();
        if (!cleanName) {
          setError('Por favor escribe tu nombre de usuario para registrarte en RASTRO.');
          setLoading(false);
          return;
        }
        try {
          sessionStorage.setItem('rastro_preferred_username', cleanName);
        } catch {}

        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res?.user) {
          try {
            await updateProfile(res.user, { displayName: cleanName });
          } catch (upErr) {
            console.warn("Could not set auth display name", upErr);
          }
          try {
            await setDoc(doc(db, 'usuarios', res.user.uid), {
              uid: res.user.uid,
              email: res.user.email,
              displayName: cleanName,
              photoURL: res.user.photoURL || '',
              uploadCount: 0,
              isAlly: false,
              isAdmin: false,
              role: 'estudiante',
              bio: 'Estudiante enfocado en alcanzar la meta universitaria.',
              whatsappChannel: '',
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch (docErr) {
            console.warn("Could not create firestore doc", docErr);
          }
        }
      }
      navigate('/');
    } catch (err) {
      const msgs = {
        'auth/operation-not-allowed': 'Activa Email/Password en Firebase Console.',
        'auth/email-already-in-use': 'Este correo ya tiene una cuenta.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-not-found': 'No existe cuenta con ese correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/invalid-email': 'Correo electrónico inválido.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      if (username.trim()) {
        try {
          sessionStorage.setItem('rastro_preferred_username', username.trim());
        } catch {}
      }
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.warn("Google auth error:", err);
      const msgs = {
        'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de iniciar sesión.',
        'auth/operation-not-allowed': 'Activa el proveedor de Google en Firebase Console.',
        'auth/popup-blocked': 'La ventana emergente fue bloqueada.',
      };
      if (err.message?.includes('initial') || err.code === 'auth/internal-error' || err.code === 'auth/unauthorized-domain') {
        setError('En la app móvil Android, por favor regístrate o ingresa usando tu Correo y Contraseña.');
      } else {
        setError(msgs[err.code] || 'Error con Google. Por favor ingresa usando tu Correo y Contraseña.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const [showEmailFallback, setShowEmailFallback] = useState(false);

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="ios-glass-card"
        style={{ width: '100%', maxWidth: '440px', padding: '36px 28px', borderRadius: '32px', textAlign: 'center' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'rgba(0, 122, 255, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <svg width="36" height="36" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Acceso a RASTRO
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, lineHeight: 1.45 }}>
            Inicia sesión con tu cuenta de Google para acceder a tus cursos, aportes y perfil estudiantil.
          </p>
        </div>

        {/* Exclusive Single Sign-On Callout */}
        <div style={{
          background: 'rgba(0, 122, 255, 0.08)',
          border: '1.5px solid rgba(0, 122, 255, 0.22)',
          borderRadius: '18px',
          padding: '12px 16px',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left'
        }}>
          <div style={{ padding: '6px', background: 'rgba(0,122,255,0.15)', borderRadius: '10px', color: 'var(--accent-color)' }}>
            <User size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Único medio de acceso oficial</strong>
            <span>Google garantiza tu identidad rápida y segura en la plataforma.</span>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: '12px', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderRadius: '14px', marginBottom: '20px', fontSize: '0.88rem', textAlign: 'center', fontWeight: 600 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Primary Button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%', padding: '16px 20px', borderRadius: '18px',
            border: 'none', background: 'linear-gradient(135deg, #007AFF, #00C6FF)',
            color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', marginBottom: '20px', opacity: googleLoading ? 0.7 : 1,
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 48 48">
            <path fill="#fff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#fff" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#fff" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#fff" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? 'Iniciando con Google...' : 'Iniciar Sesión con Google'}
        </motion.button>

        {/* Discreet Emergency Email Fallback Toggle */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setShowEmailFallback(!showEmailFallback)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              opacity: 0.75
            }}
          >
            {showEmailFallback ? 'Ocultar acceso con correo de respaldo' : '¿Problemas con Google? Acceso con correo'}
          </button>
        </div>

        {/* Collapsible Email Fallback Form */}
        <AnimatePresence>
          {showEmailFallback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginTop: '18px', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>acceso con correo</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!isLogin && (
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="Nombre de usuario" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} 
                      required={!isLogin}
                      maxLength={40}
                      style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="email" placeholder="Correo electrónico" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="password" placeholder="Contraseña" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  style={{ marginTop: '4px', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Ingresar con Correo' : 'Registrar con Correo')}
                  {!loading && <ArrowRight size={16} />}
                </motion.button>
              </form>

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <button onClick={() => { setIsLogin(!isLogin); setError(null); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  {isLogin ? '¿Crear cuenta con correo?' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
