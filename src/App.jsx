import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useApp } from "./context/AppContext";
import MainPage               from "./pages/MainPage";
import LoginPage              from "./pages/LoginPage";
import RequestAccessPage      from "./pages/RequestAccessPage";
import ForgotAccessPage       from "./pages/ForgotAccessPage";
import AdminPage               from "./pages/AdminPage";
import ForcePasswordChangePage from "./pages/ForcePasswordChangePage";
import MaintenancePage         from "./pages/MaintenancePage";
import NotFoundPage            from "./pages/NotFoundPage";
import LegalPage               from "./pages/LegalPage";
import CookieBanner            from "./components/layout/CookieBanner";

function ProtectedRoute({ children }) {
  const { isAdmin, authUser } = useApp();
  if (!isAdmin) return <Navigate to="/login" replace />;
  if (authUser?.mustChangePassword) return <ForcePasswordChangePage />;
  return children;
}

export default function App() {
  const { backendError } = useApp();
  const location = useLocation();

  if (backendError) return <MaintenancePage />;

  return (
    <>
      <Routes>
        <Route path="/"                element={<MainPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/solicitar-acceso" element={<RequestAccessPage />} />
        <Route path="/olvide-mi-acceso" element={<ForgotAccessPage />} />
        <Route path="/terminos-y-condiciones" element={<LegalPage type="terminos" />} />
        <Route path="/politica-de-privacidad" element={<LegalPage type="privacidad" />} />
        <Route path="/admin"           element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="*"                element={<NotFoundPage />} />
      </Routes>
      {!location.pathname.startsWith("/admin") && <CookieBanner />}
    </>
  );
}
