import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome back,{" "}
          <span className="font-semibold text-gray-800">
            {user?.name}
          </span>
        </p>

        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-600 text-white py-2 font-semibold hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
