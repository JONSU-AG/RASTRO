import React, { useState, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LiquidNavbar } from './components/LiquidNavbar';
import { CookieBanner } from './components/CookieBanner';
import { IOSModal } from './components/IOSModal';
import { TermsModal } from './components/TermsModal';
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
import { FormularioPage } from './pages/FormularioPage';
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
                  <Route path="/formulario" element={<FormularioPage />} />
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

            {/* Super Terms & Privacy Modal (Centrado, amplio y protector) */}
            <TermsModal
              isOpen={isTermsOpen}
              onClose={() => setIsTermsOpen(false)}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
