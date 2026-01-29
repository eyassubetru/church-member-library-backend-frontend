import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MemberDetail from "./pages/MemberDetail";
import AddMember from "./pages/AddMember";
import MemberDocumentsPage from "./pages/MemberDocumentsPage";
import AddMemberDocument from "./components/AddMemberDocument";
import Alert from "./components/Alert";

function App() {
  const { isAuthenticated, refreshSession, loading, user } = useAuthStore();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    refreshSession();
  }, []);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <Routes>
        <Route path="/login" element={user?.role === 'admin' ? <Navigate to="/dashboard" /> : <Login showAlert={showAlert} />} />
        <Route path="/dashboard" element={user?.role === 'admin' ? <Dashboard showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/documents/:id" element={user?.role === 'admin' ? <MemberDocumentsPage showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/documents/add/:id" element={user?.role === 'admin' ? <AddMemberDocument showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/members/:id" element={user?.role === 'admin' ? <MemberDetail showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/members/add" element={user?.role === 'admin' ? <AddMember showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />} />
        <Route path="/reset-password" element={<ResetPassword showAlert={showAlert} />} />
        <Route path="*" element={<Navigate to={user?.role === 'admin' ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;