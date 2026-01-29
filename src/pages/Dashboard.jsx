import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Nav from "../components/Nav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
   <div className="min-h-screen bg-gray-50">
  <Nav />
  
  {/* This container aligns with the max-width of the Nav I gave you earlier */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-1">
        Logged in as: <span className="font-medium text-amber-600">{user?.name}</span>
      </p>
    </div>
  </div>
</div>
  );
};

export default Dashboard;
