import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import MemberList from "../components/MemberList";
import { Search, Users, Plus, Filter, Heart, HeartOff, Skull, Home } from "lucide-react";

const Dashboard = ({ showAlert }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "active", "inactive", "deceased"
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    deceased: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [activeFilter, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/members");
      setMembers(res.data);
      calculateStats(res.data);
      filterMembers(res.data);
    } catch (error) {
      showAlert("Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (membersData) => {
    const total = membersData.length;
    const active = membersData.filter(m => m.isActive === true && m.isAlive !== false).length;
    const deceased = membersData.filter(m => m.isAlive === false).length;
    const inactive = total - active - deceased;
    
    setStats({ total, active, inactive, deceased });
  };

  const filterMembers = () => {
    let filtered = members;
    
    switch (activeFilter) {
      case "active":
        filtered = members.filter(m => m.isActive === true && m.isAlive !== false);
        break;
      case "inactive":
        filtered = members.filter(m => m.isActive === false && m.isAlive !== false);
        break;
      case "deceased":
        filtered = members.filter(m => m.isAlive === false);
        break;
      default:
        filtered = members;
    }
    
    setFilteredMembers(filtered);
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
      calculateStats(res.data);
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

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case "all":
        return stats.total;
      case "active":
        return stats.active;
      case "inactive":
        return stats.inactive;
      case "deceased":
        return stats.deceased;
      default:
        return 0;
    }
  };

  const getFilterButtonClass = (filterType) => {
    const baseClass = "px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 flex-1 md:flex-none justify-center";
    
    if (activeFilter === filterType) {
      switch (filterType) {
        case "all":
          return `${baseClass} bg-gradient-to-r from-blue-600 to-blue-700 text-white`;
        case "active":
          return `${baseClass} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white`;
        case "inactive":
          return `${baseClass} bg-gradient-to-r from-amber-500 to-amber-600 text-white`;
        case "deceased":
          return `${baseClass} bg-gradient-to-r from-gray-600 to-gray-700 text-white`;
        default:
          return `${baseClass} bg-gray-100 text-gray-800`;
      }
    }
    
    return `${baseClass} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveFilter("all")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Members →
              </button>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveFilter("active")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Members</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                View Active →
              </button>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveFilter("inactive")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inactive Members</p>
                <p className="text-3xl font-bold text-amber-600">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <HeartOff className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
                View Inactive →
              </button>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveFilter("deceased")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Deceased Members</p>
                <p className="text-3xl font-bold text-gray-700">{stats.deceased}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Skull className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                View Deceased →
              </button>
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
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex-1 md:flex-none"
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
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex-1 md:flex-none"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={getFilterButtonClass("all")}
              >
                <Users className="w-4 h-4" />
                All Members
                <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                  {stats.total}
                </span>
              </button>
              
              <button
                onClick={() => setActiveFilter("active")}
                className={getFilterButtonClass("active")}
              >
                <Heart className="w-4 h-4" />
                Active
                <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                  {stats.active}
                </span>
              </button>
              
              <button
                onClick={() => setActiveFilter("inactive")}
                className={getFilterButtonClass("inactive")}
              >
                <HeartOff className="w-4 h-4" />
                Inactive
                <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                  {stats.inactive}
                </span>
              </button>
              
              <button
                onClick={() => setActiveFilter("deceased")}
                className={getFilterButtonClass("deceased")}
              >
                <Skull className="w-4 h-4" />
                Deceased
                <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                  {stats.deceased}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {activeFilter === "all" && "All Members"}
                {activeFilter === "active" && "Active Members"}
                {activeFilter === "inactive" && "Inactive Members"}
                {activeFilter === "deceased" && "Deceased Members"}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
                {activeFilter !== "all" && ` (${getFilterCount(activeFilter)} total)`}
              </p>
            </div>
            
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Show All
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-700">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeFilter === "deceased" ? (
                  <Skull className="w-8 h-8 text-gray-400" />
                ) : (
                  <Users className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {activeFilter === "active" && "No Active Members"}
                {activeFilter === "inactive" && "No Inactive Members"}
                {activeFilter === "deceased" && "No Deceased Members"}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "deceased" 
                  ? "No deceased members in the records"
                  : "No members found with this filter"}
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => setActiveFilter("all")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  View All Members
                </button>
              )}
            </div>
          ) : (
            <MemberList members={filteredMembers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;