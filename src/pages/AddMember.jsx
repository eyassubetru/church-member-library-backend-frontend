import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import { Save, Plus, X, UserPlus } from "lucide-react";

const AddMember = ({ showAlert }) => {
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/members/paper", form);
      showAlert("Member added successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      showAlert("Failed to add member", "error");
    } finally {
      setLoading(false);
    }
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

  const removeChild = (index) => {
    const updatedChildren = form.childrenList.filter((_, i) => i !== index);
    setForm({ ...form, childrenList: updatedChildren });
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

  const removeCourse = (index) => {
    const updatedCourses = form.completedCourses.filter((_, i) => i !== index);
    setForm({ ...form, completedCourses: updatedCourses });
  };

  // Helper function to render form sections
  const renderFormSection = (title, fields) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            {field === 'isActive' || field === 'isAlive' || field === 'role' ? (
              <select
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {field === 'isActive' && (
                  <>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </>
                )}
                {field === 'isAlive' && (
                  <>
                    <option value="true">Alive</option>
                    <option value="false">Deceased</option>
                  </>
                )}
                {field === 'role' && (
                  <>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="text"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <Nav />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Member</h1>
            <p className="text-gray-600">Fill in the member's information below</p>
          </div>
        </div>

        {/* Personal Info Section */}
        {renderFormSection("Personal Information", [
          "name", "fatherName", "grandfatherName", "nameAmharic", 
          "fatherNameAmharic", "grandfatherNameAmharic", "sex", 
          "age", "idNumber", "phoneNumber", "email"
        ])}

        {/* Church Info Section */}
        {renderFormSection("Church Information", [
          "salvationDate", "baptismDateEC", "baptizedBy", "salvationPlace"
        ])}

        {/* Status & Country Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Status & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Life Status</label>
              <select
                value={form.isAlive}
                onChange={(e) => setForm({ ...form, isAlive: e.target.value === "true" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Alive</option>
                <option value="false">Deceased</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                placeholder="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Children</h3>
            <button
              onClick={addChild}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Child
            </button>
          </div>
          
          <div className="space-y-4">
            {form.childrenList.map((child, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Child Name</label>
                    <input
                      placeholder="Child Name"
                      value={child.name}
                      onChange={(e) => handleChildChange(index, "name", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Child Age</label>
                    <input
                      placeholder="Child Age"
                      value={child.age}
                      onChange={(e) => handleChildChange(index, "age", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeChild(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Work Section */}
        {renderFormSection("Education & Employment", [
          "educationStatus", "educationLevel", "employmentStatus", 
          "organization", "skills", "serviceArea", "serviceExplanation", "testimony"
        ])}

        {/* Completed Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Completed Courses</h3>
            <button
              onClick={addCourse}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div>
          
          <div className="space-y-3">
            {form.completedCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  placeholder="Course name"
                  value={course}
                  onChange={(e) => handleCourseChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeCourse(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & Auth Section */}
        {renderFormSection("Profile & Authentication", ["profilePic", "username", "role"])}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;