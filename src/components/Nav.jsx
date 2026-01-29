import { useAuthStore } from "../store/authStore";
import { LogOut, User } from "lucide-react"; // Optional: Using lucide-react for icons

const Nav = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-500 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src="logo.jpg" 
                alt="Logo" 
                className="w-10 h-10 rounded-full border-2 border-amber-600 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white leading-none tracking-tight">
                BEZA
              </span>
              <span className="text-xs font-medium text-white hidden sm:block">
                MEMBER MANAGEMENT
              </span>
            </div>
          </div>

          {/* Right Side: User Info & Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden md:block text-sm font-medium text-white">
                Hi, {user.name || "Admin"}
              </span>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-sm shadow-sm"
            >
              <span>Logout</span>
              {/* Optional Icon */}
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Nav;