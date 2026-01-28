import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { isAuthenticated, refreshSession, loading } = useAuthStore();

  useEffect(() => {
    refreshSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
  <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
