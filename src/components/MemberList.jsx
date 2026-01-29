import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Calendar, Heart, HeartOff, Skull } from "lucide-react";

const MemberList = ({ members }) => {
  const navigate = useNavigate();

  const getStatusBadge = (isActive, isAlive) => {
    if (isAlive === false) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center gap-1">
          <Skull className="w-3 h-3" />
          Deceased
        </span>
      );
    }
    
    return isActive ? (
      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full flex items-center gap-1">
        <Heart className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
        <HeartOff className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvatarColor = (isAlive, isActive) => {
    if (isAlive === false) return 'from-gray-600 to-gray-700';
    return isActive ? 'from-emerald-500 to-emerald-600' : 'from-amber-500 to-amber-600';
  };

  return (
    <div className="divide-y divide-gray-200">
      {members.map(m => (
        <div
          key={m._id}
          onClick={() => navigate(`/members/${m._id}`)}
          className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors group ${
            m.isAlive === false 
              ? 'hover:bg-gray-50 opacity-90' 
              : 'hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar with deceased indicator */}
            <div className="relative">
              <div className={`w-12 h-12 bg-gradient-to-r ${getAvatarColor(m.isAlive, m.isActive)} rounded-full flex items-center justify-center text-white font-semibold`}>
                {m.name?.charAt(0) || "M"}
              </div>
              {m.isAlive === false && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border-2 border-white">
                  <Skull className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            {/* Member Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`font-semibold ${m.isAlive === false ? 'text-gray-700' : 'text-gray-800 group-hover:text-blue-700'}`}>
                  {m.name} {m.fatherName}
                </h3>
                {getStatusBadge(m.isActive, m.isAlive)}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>ID: {m.idNumber || "N/A"}</span>
                </div>
                
                {m.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{m.phoneNumber}</span>
                  </div>
                )}
                
                {m.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{m.email}</span>
                  </div>
                )}
                
                {m.salvationDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Saved: {formatDate(m.salvationDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="hidden md:block">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              m.role === 'admin' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {m.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;