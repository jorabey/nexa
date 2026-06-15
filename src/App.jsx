import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell, PlainShell } from './components/layout/AppShell';
import { OrbitLoader } from './components/common/OrbitMark';
import { useEffect } from 'react';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyPage from './pages/Auth/VerifyPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

// App pages
import AppsPage from './pages/Apps/AppsPage';
import AppDetailPage from './pages/Apps/AppDetailPage';
import WebViewPage from './pages/Apps/WebViewPage';

// Profile pages
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import SessionsPage from './pages/Profile/SessionsPage';
import AppConnectionsPage from './pages/Profile/AppConnectionsPage';
import SecurityPage from './pages/Profile/SecurityPage';
import LanguagePage from './pages/Profile/LanguagePage';
import AppInfoPage from './pages/Profile/AppInfoPage';

/* ---- 🚀 Scroll Reset: Sahifa o'zgarganda oynani nollash ---- */
function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Ichki skroll divlarini topib nollaymiz
    const targets = document.querySelectorAll('.scrollable');
    targets.forEach(el => el.scrollTop = 0);
  }, [pathname]);

  return null;
}

/* ---- Guards ---- */
function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  
  if (status === 'loading') {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
        <OrbitLoader size={44} />
      </div>
    );
  }
  if (status === 'guest') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

function RedirectIfAuth({ children }) {
  const { status } = useAuth();
  
  if (status === 'loading') {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
        <OrbitLoader size={44} />
      </div>
    );
  }
  if (status === 'authenticated') return <Navigate to="/apps" replace />;
  return children;
}

export default function App() {
  
  // 🔒 ULTRA KIOSK LOCK: Brauzer elastikligini va URL satri siljishini butunlay bo'g'ish
  useEffect(() => {
    // 1. Zoom va chimchila harakatlarini to'sish
    const handleTouchStart = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };

    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    const handleContextMenu = (e) => e.preventDefault();

    // ⚡ 2. CHUNQUR TOUCH INTERCEPTOR (Eng muhim qism)
    // Ushbu kod brauzerning o'zini skroll bo'lishiga mutlaqo yo'l qo'ymaydi.
    // Skroll faqat va faqat ichida '.scrollable' klassi bor divlarda ishlaydi!
    const handleTouchMove = (e) => {
      const scrollableParent = e.target.closest('.scrollable');
      
      if (!scrollableParent) {
        // Agar barmoq skroll bo'lmaydigan joyga tegb surilsa, harakatni butunlay o'chiramiz
        e.preventDefault();
      } else {
        // Agar barmoq skroll bo'ladigan joyda bo'lsa ham, eng tepada yoki eng pastda 
        // brauzer "orqasini" (bounce) ko'rsatib qo'ymasligini nazorat qilamiz
        const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
        if (scrollTop === 0 && e.movementY > 0) {
          // Eng tepada turib yana tepaga tortsa bloklaymiz
          e.preventDefault();
        }
        if (scrollTop + clientHeight >= scrollHeight && e.movementY < 0) {
          // Eng pastda turib yana pastga tortsa bloklaymiz
          e.preventDefault();
        }
      }
    };

    // Global majburiy klamper
    const clampViewport = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false }); // 🚀 Muhim: passive: false
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('scroll', clampViewport, { passive: true });

    // Dinamik Dynamic Viewport qulflash (100dvh ga moslashish)
    let meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('scroll', clampViewport);
    };
  }, []);

  return (
    <LangProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            {/* 📱 To'liq ekranlik temir qobiq (100dvh — Dynamic Viewport Height o'rnatildi) */}
            <div 
              className="app-kiosk-container" 
              style={{ 
                position: 'fixed', 
                inset: 0, 
                width: '100%', 
                height: '100dvh', // 🚀 Dynamic Viewport: URL bar o'zgarsa ham bu o'zgarmaydi
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <ScrollRestoration />
              
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                 <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                <Route element={<RedirectIfAuth />}>
                </Route>
                
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route path="/run/:username" element={<RequireAuth><WebViewPage /></RequireAuth>} />

                <Route element={<PlainShell />}>
                  <Route path="/:username" element={<AppDetailPage />} />
                </Route>

                <Route element={<RequireAuth><AppShell /></RequireAuth>}>
                  <Route path="/apps" element={<AppsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route element={<RequireAuth><PlainShell /></RequireAuth>}>
                  <Route path="/profile-edit" element={<ProfileEditPage />} />
                  <Route path="/sessions" element={<SessionsPage />} />
                  <Route path="/app-connections" element={<AppConnectionsPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/language" element={<LanguagePage />} />
                  <Route path="/app-info" element={<AppInfoPage />} />
                </Route>
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </LangProvider>
  );
}