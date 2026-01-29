import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import ConfirmModal from "../components/ConfirmModal";
import { Save, Trash2, Plus, X } from "lucide-react";

const MemberDetail = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/members/${id}`);
        setMember(res.data);
      } catch (error) {
        showAlert("Failed to load member details", "error");
      }
    };
    fetchMember();
  }, [id]);

  // Save changes
  const save = async () => {
    setLoading(true);
    try {
      await api.put(`/members/update/${id}`, member);
      showAlert("Updated successfully!", "success");
    } catch (error) {
      showAlert("Failed to update member", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete member
  const remove = async () => {
    setLoading(true);
    try {
      await api.put(`/members/delete/${id}`);
      showAlert("Member deleted successfully", "success");
      navigate("/dashboard");
    } catch (error) {
      showAlert("Failed to delete member", "error");
      setLoading(false);
    }
  };

  // Nested handlers
  const handleChildChange = (index, key, value) => {
    const updatedChildren = [...member.childrenList];
    updatedChildren[index][key] = value;
    setMember({ ...member, childrenList: updatedChildren });
  };

  const addChild = () => {
    setMember({ ...member, childrenList: [...member.childrenList, { name: "", age: "" }] });
  };

  const removeChild = (index) => {
    const updatedChildren = member.childrenList.filter((_, i) => i !== index);
    setMember({ ...member, childrenList: updatedChildren });
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...member.completedCourses];
    updatedCourses[index] = value;
    setMember({ ...member, completedCourses: updatedCourses });
  };

  const addCourse = () => {
    setMember({ ...member, completedCourses: [...member.completedCourses, ""] });
  };

  const removeCourse = (index) => {
    const updatedCourses = member.completedCourses.filter((_, i) => i !== index);
    setMember({ ...member, completedCourses: updatedCourses });
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 pt-16">
        <Nav />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-700">Loading member details...</p>
          </div>
        </div>
      </div>
    );
  }

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
                value={member[field]}
                onChange={(e) => setMember({ ...member, [field]: e.target.value })}
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
                value={member[field] || ""}
                onChange={(e) => setMember({ ...member, [field]: e.target.value })}
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Member</h1>
            <p className="text-gray-600">Update member information and details</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/documents/${id}`)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
            >
              <span>View Documents</span>
            </button>
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
                value={member.isActive}
                onChange={(e) => setMember({ ...member, isActive: e.target.value === "true" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Life Status</label>
              <select
                value={member.isAlive}
                onChange={(e) => setMember({ ...member, isAlive: e.target.value === "true" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Alive</option>
                <option value="false">Deceased</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                value={member.country || ""}
                onChange={(e) => setMember({ ...member, country: e.target.value })}
                placeholder="Country"
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
            {member.childrenList.map((child, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Child Name</label>
                    <input
                      value={child.name}
                      onChange={(e) => handleChildChange(index, "name", e.target.value)}
                      placeholder="Child Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Child Age</label>
                    <input
                      value={child.age}
                      onChange={(e) => handleChildChange(index, "age", e.target.value)}
                      placeholder="Child Age"
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
            {member.completedCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  value={course}
                  onChange={(e) => handleCourseChange(index, e.target.value)}
                  placeholder="Course name"
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
            onClick={save}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
            Delete Member
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={remove}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default MemberDetail;