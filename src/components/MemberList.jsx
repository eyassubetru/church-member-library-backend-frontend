import { useNavigate } from "react-router-dom";

const MemberList = ({ members }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow divide-y">
      {members.map(m => (
        <div
          key={m._id}
          onClick={() => navigate(`/members/${m._id}`)}
          className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50"
        >
          <div>
            <p className="font-semibold">{m.name} {m.fatherName}</p>
            <p className="text-sm text-gray-500">{m.idNumber}</p>
          </div>
          <span className="text-sm text-amber-600">{m.role}</span>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
