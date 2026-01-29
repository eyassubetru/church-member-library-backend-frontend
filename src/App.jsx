import { useEffect } from "react";
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

function App() {
  const { isAuthenticated, refreshSession, loading,user } = useAuthStore();

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
  <Route path="/login" element={user.role === 'admin' ? <Navigate to="/dashboard" /> : <Login />} />
  <Route path="/dashboard" element={user.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />} />

<Route path="/documents/:id" element={user.role === 'admin' ? <MemberDocumentsPage  /> : <Navigate to="/login" />} />
<Route path="/documents/add/:id" element={user.role === 'admin' ? <AddMemberDocument  /> : <Navigate to="/login" />} />

  <Route path="/members/:id" element={user.role === 'admin' ? <MemberDetail /> : <Navigate to="/login" />} />
  <Route path="/members/add" element={user.role === 'admin' ? <AddMember /> : <Navigate to="/login" />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="*" element={<Navigate to={user.role === 'admin' ? "/dashboard" : "/login"} />} />
  
</Routes>
    </BrowserRouter>
  );
}

export default App;
