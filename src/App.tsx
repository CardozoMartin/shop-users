import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const PublicStorePage = lazy(() => import('./pages/PublicStorePage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ResetPassPage = lazy(() => import('./pages/ResetPassPage'));
const StoreDirectoryPage = lazy(() => import('./pages/StoreDirectoryPage'));

const LoadingSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf4ff 100%)' }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '3px solid #e0e7ff', borderTopColor: '#6366f1',
      animation: 'spin 0.7s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Directorio de tiendas — raíz */}
          <Route path="/" element={<StoreDirectoryPage />} />

          {/* Email & Auth */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPassPage />} />

          {/* Tienda pública por slug — debe ir ÚLTIMO */}
          <Route path="/:slug/*" element={<PublicStorePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
