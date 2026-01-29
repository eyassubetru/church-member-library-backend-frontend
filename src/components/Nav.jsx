import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogOut, User, Home } from "lucide-react";

const Nav = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white leading-none">BEZA</span>
                <span className="text-xs text-blue-100">Member Management</span>
              </div>
            </div>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden md:flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Right Side: User Info & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-500/20 rounded-lg">
                <User className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {user.name || "Admin"}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow"
            >
              <span>Logout</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;