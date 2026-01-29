import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";

const AddMember = () => {
  const navigate = useNavigate();
  
  // Full form state
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    grandfatherName: "",
    nameAmharic: "",
    fatherNameAmharic: "",
    grandfatherNameAmharic: "",
    sex: "",
    age: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    salvationDate: "",
    baptismDateEC: "",
    baptizedBy: "",
    salvationPlace: "",
    isActive: true,
    isAlive: true,
    country: "",
    childrenList: [{ name: "", age: "" }],
    educationStatus: "",
    educationLevel: "",
    employmentStatus: "",
    organization: "",
    skills: "",
    completedCourses: [""],
    serviceArea: "",
    serviceExplanation: "",
    testimony: "",
    profilePic: "",
    username: "",
    role: "member",
  });

  const handleSubmit = async () => {
    await api.post("/members/paper", form);
    navigate("/dashboard");
  };

  // Update nested array fields (childrenList)
  const handleChildChange = (index, key, value) => {
    const updatedChildren = [...form.childrenList];
    updatedChildren[index][key] = value;
    setForm({ ...form, childrenList: updatedChildren });
  };

  // Add a new child input
  const addChild = () => {
    setForm({ ...form, childrenList: [...form.childrenList, { name: "", age: "" }] });
  };

  // Update completed courses
  const handleCourseChange = (index, value) => {
    const updatedCourses = [...form.completedCourses];
    updatedCourses[index] = value;
    setForm({ ...form, completedCourses: updatedCourses });
  };

  const addCourse = () => {
    setForm({ ...form, completedCourses: [...form.completedCourses, ""] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">Add Member</h1>

        {/* Personal Info */}
        <h2 className="font-semibold mb-2">Personal Info</h2>
        {["name","fatherName","grandfatherName","nameAmharic","fatherNameAmharic","grandfatherNameAmharic","sex","age","idNumber","phoneNumber","email"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Church Info */}
        <h2 className="font-semibold mb-2 mt-4">Church Info</h2>
        {["salvationDate","baptismDateEC","baptizedBy","salvationPlace"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Status & Location */}
        <h2 className="font-semibold mb-2 mt-4">Status & Country</h2>
        <select
          value={form.isActive}
          onChange={e => setForm({ ...form, isActive: e.target.value === "true" })}
          className="border p-2 w-full mb-3"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={form.isAlive}
          onChange={e => setForm({ ...form, isAlive: e.target.value === "true" })}
          className="border p-2 w-full mb-3"
        >
          <option value="true">Alive</option>
          <option value="false">Deceased</option>
        </select>

        <input
          placeholder="Country"
          value={form.country}
          onChange={e => setForm({ ...form, country: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        {/* Children */}
        <h2 className="font-semibold mb-2 mt-4">Children</h2>
        {form.childrenList.map((child, index) => (
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
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Completed Courses */}
        <h2 className="font-semibold mb-2 mt-4">Completed Courses</h2>
        {form.completedCourses.map((course, index) => (
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
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="border p-2 w-full mb-3"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input
              key={field}
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              className="border p-2 w-full mb-3"
            />
          )
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
        >
          Create Member
        </button>
      </div>
    </div>
  );
};

export default AddMember;
