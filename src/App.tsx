import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const PublicStorePage = lazy(() => import('./pages/PublicStorePage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ResetPassPage = lazy(() => import('./pages/ResetPassPage'));

const LoginPlaceholder = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '8px', fontFamily: 'sans-serif' }}>
    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Iniciar sesión</p>
    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Próximamente</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        }
      >
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPlaceholder />} />

          {/* Tienda pública por slug */}
          <Route path="/:slug/*" element={<PublicStorePage />} />

          {/* Email & Auth */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPassPage />} />

          {/* Redirect root hacia alguna tienda si no hay slug */}
          <Route path="/" element={<Navigate to="/default-store" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

