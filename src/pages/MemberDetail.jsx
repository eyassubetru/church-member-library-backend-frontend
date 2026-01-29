import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch member details
  useEffect(() => {
    api.get(`/members/${id}`).then(res => setMember(res.data));
  }, [id]);

  // Save changes
  const save = async () => {
    await api.put(`/members/update/${id}`, member);
    alert("Updated successfully!");
  };

  // Delete member
  const remove = async () => {
    await api.put(`/members/delete/${id}`);
    navigate("/dashboard");
  };

  if (!member) return null;

  // Nested handlers
  const handleChildChange = (index, key, value) => {
    const updatedChildren = [...member.childrenList];
    updatedChildren[index][key] = value;
    setMember({ ...member, childrenList: updatedChildren });
  };

  const addChild = () => {
    setMember({ ...member, childrenList: [...member.childrenList, { name: "", age: "" }] });
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...member.completedCourses];
    updatedCourses[index] = value;
    setMember({ ...member, completedCourses: updatedCourses });
  };

  const addCourse = () => {
    setMember({ ...member, completedCourses: [...member.completedCourses, ""] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-4xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Member</h1>

        {/* Personal Info */}
        <h2 className="font-semibold mb-2">Personal Info</h2>
        {["name","fatherName","grandfatherName","nameAmharic","fatherNameAmharic","grandfatherNameAmharic","sex","age","idNumber","phoneNumber","email"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={member[field] || ""}
            onChange={e => setMember({ ...member, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Church Info */}
        <h2 className="font-semibold mb-2 mt-4">Church Info</h2>
        {["salvationDate","baptismDateEC","baptizedBy","salvationPlace"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={member[field] || ""}
            onChange={e => setMember({ ...member, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Status & Country */}
        <h2 className="font-semibold mb-2 mt-4">Status & Country</h2>
        <select
          value={member.isActive}
          onChange={e => setMember({ ...member, isActive: e.target.value === "true" })}
          className="border p-2 w-full mb-3"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={member.isAlive}
          onChange={e => setMember({ ...member, isAlive: e.target.value === "true" })}
          className="border p-2 w-full mb-3"
        >
          <option value="true">Alive</option>
          <option value="false">Deceased</option>
        </select>

        <input
          placeholder="Country"
          value={member.country || ""}
          onChange={e => setMember({ ...member, country: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        {/* Children */}
        <h2 className="font-semibold mb-2 mt-4">Children</h2>
        {member.childrenList.map((child, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              placeholder="Child Name"
              value={child.name}
              onChange={e => handleChildChange(index, "name", e.target.value)}
              className="border p-2 w-1/2"
            />
            <input
              placeholder="Child Age"
              value={child.age}
              onChange={e => handleChildChange(index, "age", e.target.value)}
              className="border p-2 w-1/2"
            />
          </div>
        ))}
        <button onClick={addChild} className="bg-blue-600 text-white px-4 py-1 mb-3 rounded">+ Add Child</button>

        {/* Education / Work / Skills */}
        {["educationStatus","educationLevel","employmentStatus","organization","skills","serviceArea","serviceExplanation","testimony"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={member[field] || ""}
            onChange={e => setMember({ ...member, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Completed Courses */}
        <h2 className="font-semibold mb-2 mt-4">Completed Courses</h2>
        {member.completedCourses.map((course, index) => (
          <input
            key={index}
            placeholder="Course"
            value={course}
            onChange={e => handleCourseChange(index, e.target.value)}
            className="border p-2 w-full mb-2"
          />
        ))}
        <button onClick={addCourse} className="bg-blue-600 text-white px-4 py-1 mb-3 rounded">+ Add Course</button>

        {/* Profile & Auth */}
        {["profilePic","username","role"].map(field => (
          field === "role" ? (
            <select
              key={field}
              value={member.role}
              onChange={e => setMember({ ...member, role: e.target.value })}
              className="border p-2 w-full mb-3"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input
              key={field}
              placeholder={field}
              value={member[field] || ""}
              onChange={e => setMember({ ...member, [field]: e.target.value })}
              className="border p-2 w-full mb-3"
            />
          )
        ))}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button onClick={save} className="bg-amber-500 px-6 py-2 rounded-lg">
            Save Changes
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Delete Member
          </button>
        </div>

        {showDelete && (
          <ConfirmDeleteModal
            onCancel={() => setShowDelete(false)}
            onConfirm={remove}
          />
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
