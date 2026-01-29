import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import MemberList from "../components/MemberList";
import { Search, Users, Plus, Filter } from "lucide-react";

const Dashboard = ({ showAlert }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/members");
      setMembers(res.data);
      calculateStats(res.data);
    } catch (error) {
      showAlert("Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (membersData) => {
    const total = membersData.length;
    const active = membersData.filter(m => m.isActive === true).length;
    const inactive = total - active;
    
    setStats({ total, active, inactive });
  };

  const searchMembers = async () => {
    if (!query.trim()) {
      fetchMembers();
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get(`/members/search?q=${query}`);
      setMembers(res.data);
    } catch (error) {
      showAlert("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMembers();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 px-4 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Manage all church members in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Members</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactive Members</p>
                <p className="text-3xl font-bold text-amber-600">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name, ID, email..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter and Add Buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={searchMembers}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all flex-1 md:flex-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
              
              <button
                onClick={() => navigate("/members/add")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex-1 md:flex-none"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Members</h2>
            <p className="text-sm text-gray-600">{members.length} members found</p>
          </div>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-700">Loading members...</p>
            </div>
          ) : (
            <MemberList members={members} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;