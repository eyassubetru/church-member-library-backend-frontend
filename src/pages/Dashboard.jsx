import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import MemberList from "../components/MemberList";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await api.get("/members");
    setMembers(res.data);
  };

  const searchMembers = async () => {
    if (!query.trim()) {
      fetchMembers();
      return;
    }
    const res = await api.get(`/members/search?q=${query}`);
    setMembers(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 px-4">
        <div className="flex justify-between items-center mb-6 gap-4">
          {/* Search */}
          <div className="flex gap-2 w-full max-w-md">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search member..."
              className="border px-4 py-2 rounded-lg w-full"
            />
            <button
              onClick={searchMembers}
              className="bg-amber-500 px-4 py-2 rounded-lg font-semibold"
            >
              Search
            </button>
          </div>

          {/* Add */}
          <button
            onClick={() => navigate("/members/add")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            + Add Member
          </button>
        </div>

        <MemberList members={members} />
      </div>
    </div>
  );
};

export default Dashboard;
