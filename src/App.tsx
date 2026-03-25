import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicStorePage from "./pages/PublicStorePage";

const LoginPlaceholder = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '8px', fontFamily: 'sans-serif' }}>
    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Iniciar sesión</p>
    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Próximamente</p>
  </div>
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPlaceholder />} />

          {/* Tienda pública por slug */}
          <Route path="/:slug" element={<PublicStorePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

