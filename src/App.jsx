import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import MainPage               from "./pages/MainPage";
import LoginPage              from "./pages/LoginPage";
import RequestAccessPage      from "./pages/RequestAccessPage";
import ForgotAccessPage       from "./pages/ForgotAccessPage";
import AdminPage               from "./pages/AdminPage";
import ForcePasswordChangePage from "./pages/ForcePasswordChangePage";
import MaintenancePage         from "./pages/MaintenancePage";

function ProtectedRoute({ children }) {
  const { isAdmin, authUser } = useApp();
  if (!isAdmin) return <Navigate to="/login" replace />;
  if (authUser?.mustChangePassword) return <ForcePasswordChangePage />;
  return children;
}

export default function App() {
  const { backendError } = useApp();

  if (backendError) return <MaintenancePage />;

  return (
    <Routes>
      <Route path="/"                element={<MainPage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/solicitar-acceso" element={<RequestAccessPage />} />
      <Route path="/olvide-mi-acceso" element={<ForgotAccessPage />} />
      <Route path="/admin"           element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*"                element={<Navigate to="/" replace />} />
    </Routes>
  );
}
