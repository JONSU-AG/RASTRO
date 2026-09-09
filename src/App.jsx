import React, { useState, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LiquidNavbar } from './components/LiquidNavbar';
import { CookieBanner } from './components/CookieBanner';
import { IOSModal } from './components/IOSModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { WarningBanner } from './components/WarningBanner';
import { ChooseUsernameModal } from './components/ChooseUsernameModal';
import { DeviceNotificationsListener } from './components/DeviceNotificationsListener';
import { Loader2 } from 'lucide-react';

import { Home } from './pages/Home';
import { Cursos } from './pages/Cursos';
import { AcademyDetail } from './pages/AcademyDetail';
import { Biblioteca } from './pages/Biblioteca';
import { Simulador } from './pages/Simulador';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { UserProfile } from './pages/UserProfile';
import { Chats } from './pages/Chats';
import OrsttyPage from './pages/OrsttyPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: 'var(--accent-color)'
  }}>
    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} />
    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Cargando módulo RASTRO...</span>
  </div>
);

import { useLocation } from 'react-router-dom';

// Maintains individual scroll position for each route independently
const scrollPositions = new Map();

function ScrollPositionRestorer() {
  const location = useLocation();

  React.useEffect(() => {
    // 1. Save scroll position of current page before leaving
    const handleScroll = () => {
      scrollPositions.set(location.pathname, window.scrollY);
    };

    // Save scroll on scroll event and before unload
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Restore saved scroll position for target page (or top if first visit)
    const savedY = scrollPositions.get(location.pathname);
    if (savedY !== undefined) {
      window.scrollTo({ top: savedY, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 3. Limpieza de visores PDF/lightbox al navegar para evitar pantalla blanca en Android
    window.dispatchEvent(new CustomEvent('rastro_clear_overlays'));
    setTimeout(() => {
      document.querySelectorAll('iframe').forEach(f => {
        if (f.src && f.src.startsWith('blob:')) {
          try { URL.revokeObjectURL(f.src); } catch {}
        }
      });
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 80);

    return () => {
      // Save current scroll position on cleanup (route departure)
      scrollPositions.set(location.pathname, window.scrollY);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return null;
}

export function App() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenTerms = () => setIsTermsOpen(true);
    window.addEventListener('rumbo_open_terms', handleOpenTerms);
    return () => window.removeEventListener('rumbo_open_terms', handleOpenTerms);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollPositionRestorer />
          <div style={{ minHeight: '100vh', position: 'relative' }}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cursos" element={<Cursos />} />
                  <Route path="/cursos/:id" element={<AcademyDetail />} />
                  <Route path="/biblioteca" element={<Biblioteca />} />
                  <Route path="/simulador" element={<Simulador />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/orstty" element={<OrsttyPage />} />
                  <Route path="/usuario/:uid" element={<UserProfile />} />
                  <Route path="/perfil" element={<UserProfile />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>

            {/* Liquid Floating Navbar */}
            <LiquidNavbar />

            {/* Native Device & Push Notification Listener */}
            <DeviceNotificationsListener />

            {/* Mandatory Choose Username Flow for Users */}
            <ChooseUsernameModal />

            {/* In-App On-Screen Notice Banner (Llamado de atención de moderación) */}
            <WarningBanner />

            {/* Floating Elements */}
            <FloatingWhatsApp />

            {/* Cookie & Terms Banner */}
            <CookieBanner onOpenTerms={() => setIsTermsOpen(true)} />

            {/* Terms and Privacy iOS Modal */}
            <IOSModal
              isOpen={isTermsOpen}
              onClose={() => setIsTermsOpen(false)}
              title="Términos, Condiciones & Privacidad"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text-main)' }}>
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(0, 122, 255, 0.08)',
                  border: '1px solid rgba(0, 122, 255, 0.2)',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.45
                }}>
                  🛡️ <strong>Tu Seguridad y Privacidad Primero:</strong> En RASTRO protegemos tus datos, no los comercializamos, no los utilizamos con fines publicitarios ni te exhibimos de ninguna forma.
                </div>

                <p style={{ margin: 0 }}>
                  <strong>1. Protección Total de Datos y No Exposición:</strong> Resguardamos tu información personal bajo estándares seguros en la nube. No vendemos, no intercambiamos ni monetizamos tus datos. Asimismo, <em>no te exhibimos</em>: tus contraseñas, configuraciones privadas y actividad personal permanecen estrictamente confidenciales. Solo son visibles aquellos elementos que tú decides configurar voluntariamente en tu perfil público comunitario (como nombre o aportes).
                </p>

                <p style={{ margin: 0 }}>
                  <strong>2. Cookies Técnicas y Preferencias Locales:</strong> Con el fin de brindarte una navegación fluida, la plataforma utiliza cookies técnicas y almacenamiento local exclusivamente para funciones esenciales: recordar tus preferencias de visualización (modo oscuro o claro), guardar filtros académicos de búsqueda y mantener tu sesión activa de manera segura. No realizamos rastreo invasivo de hábitos ni publicidad dirigida.
                </p>

                <p style={{ margin: 0 }}>
                  <strong>3. Propósito Educativo Comunitario:</strong> RASTRO es una iniciativa solidaria, libre y gratuita creada por y para la comunidad estudiantil con el fin de facilitar la preparación académica preuniversitaria sin fines de lucro.
                </p>

                <p style={{ margin: 0 }}>
                  <strong>4. Almacenamiento Comunitario Neutro:</strong> La plataforma opera como una infraestructura neutra de almacenamiento comunitario donde los estudiantes comparten enlaces y apuntes académicos de buena fe para su estudio personal y colaborativo.
                </p>

                <p style={{ margin: 0 }}>
                  <strong>5. Control de tu Cuenta y Retiro Amigable:</strong> Tienes pleno control sobre tu información; puedes modificar tus datos o solicitar la eliminación total de tu cuenta en cualquier momento desde los ajustes de tu perfil. Además, RASTRO respeta la autoría intelectual: si un autor o institución solicita el retiro de un recurso, se atenderá amigablemente y se retirará de inmediato a través del sistema de reportes.
                </p>
              </div>
            </IOSModal>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
