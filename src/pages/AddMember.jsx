import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import { Save, Plus, X, UserPlus, AlertCircle } from "lucide-react";

const AddMember = ({ showAlert }) => {
  const navigate = useNavigate();
  
  // Define required fields based on Mongoose schema
  const requiredFields = new Set(['idNumber']); // Only idNumber is required in schema
  
  // Fields that should be visible as important (though not strictly required)
  const importantFields = new Set([
    'name', 'fatherName', 'phoneNumber', 'email', 
    'sex', 'age', 'idNumber', 'country'
  ]);
  
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
  const [validationErrors, setValidationErrors] = useState({});

  // Validate required fields
  const validateForm = () => {
    const errors = {};
    
    // Check required fields
    if (!form.idNumber.trim()) {
      errors.idNumber = "ID Number is required";
    }
    
    // Check for duplicate username/email would be handled by API
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showAlert("Please fill in all required fields", "error");
      return;
    }
    
    setLoading(true);
    setValidationErrors({}); // Clear validation errors
    
    try {
      await api.post("/members/paper", form);
      showAlert("Member added successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.message?.includes("duplicate")) {
        if (error.response.data.message.includes("idNumber")) {
          setValidationErrors({
            idNumber: "This ID Number is already registered"
          });
          showAlert("ID Number already exists", "error");
        } else if (error.response.data.message.includes("email")) {
          setValidationErrors({
            email: "This email is already registered"
          });
          showAlert("Email already exists", "error");
        } else if (error.response.data.message.includes("username")) {
          setValidationErrors({
            username: "This username is already taken"
          });
          showAlert("Username already exists", "error");
        } else {
          showAlert("Failed to add member", "error");
        }
      } else {
        showAlert("Failed to add member", "error");
      }
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

  // Helper function to render form sections with required field indicators
  const renderFormSection = (title, fields) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const isRequired = requiredFields.has(field);
          const isImportant = importantFields.has(field);
          const hasError = validationErrors[field];
          
          return (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                {isRequired && (
                  <span className="text-red-500" title="Required field">*</span>
                )}
                {isImportant && !isRequired && (
                  <span className="text-blue-500" title="Important field">•</span>
                )}
              </label>
              
              {field === 'isActive' || field === 'isAlive' || field === 'role' ? (
                <div>
                  <select
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className={`w-full border ${hasError ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                  {hasError && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors[field]}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => {
                      setForm({ ...form, [field]: e.target.value });
                      // Clear validation error when user starts typing
                      if (validationErrors[field]) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors[field];
                          return newErrors;
                        });
                      }
                    }}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    className={`w-full border ${hasError ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  {hasError && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors[field]}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Field descriptions/hints */}
              {field === 'idNumber' && (
                <p className="text-xs text-gray-500 mt-1">
                  This is a unique identifier for the member (required)
                </p>
              )}
              {field === 'email' && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be unique if provided
                </p>
              )}
              {field === 'username' && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be unique if provided
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render special fields that need custom handling
  const renderSpecialField = (field, label, type = "text", options = []) => {
    const isRequired = requiredFields.has(field);
    const isImportant = importantFields.has(field);
    const hasError = validationErrors[field];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {isRequired && (
            <span className="text-red-500" title="Required field">*</span>
          )}
          {isImportant && !isRequired && (
            <span className="text-blue-500" title="Important field">•</span>
          )}
        </label>
        
        {type === "select" ? (
          <div>
            <select
              value={form[field]}
              onChange={(e) => {
                setForm({ ...form, [field]: e.target.value });
                if (validationErrors[field]) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                  });
                }
              }}
              className={`w-full border ${hasError ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors[field]}</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              type={type}
              value={form[field]}
              onChange={(e) => {
                setForm({ ...form, [field]: e.target.value });
                if (validationErrors[field]) {
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                  });
                }
              }}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={`w-full border ${hasError ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {hasError && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors[field]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <Nav />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        {/* Header with legend */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Member</h1>
              <p className="text-gray-600">Fill in the member's information below</p>
            </div>
          </div>
          
          {/* Field Legend */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Field Indicators:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">*</span>
                <span className="text-gray-600">Required field</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span className="text-gray-600">Important field</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">-</span>
                <span className="text-gray-600">Optional field</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSpecialField("name", "Full Name")}
            {renderSpecialField("fatherName", "Father's Name")}
            {renderSpecialField("grandfatherName", "Grandfather's Name")}
            {renderSpecialField("nameAmharic", "Full Name (Amharic)")}
            {renderSpecialField("fatherNameAmharic", "Father's Name (Amharic)")}
            {renderSpecialField("grandfatherNameAmharic", "Grandfather's Name (Amharic)")}
            {renderSpecialField("sex", "Gender", "select", [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ])}
            {renderSpecialField("age", "Age", "number")}
            {renderSpecialField("idNumber", "ID Number")}
            {renderSpecialField("phoneNumber", "Phone Number", "tel")}
            {renderSpecialField("email", "Email Address", "email")}
          </div>
        </div>

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
            {renderSpecialField("isActive", "Status", "select", [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" }
            ])}
            {renderSpecialField("isAlive", "Life Status", "select", [
              { value: "true", label: "Alive" },
              { value: "false", label: "Deceased" }
            ])}
            {renderSpecialField("country", "Country")}
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Children (Optional)</h3>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Child Name
                    </label>
                    <input
                      placeholder="Child Name"
                      value={child.name}
                      onChange={(e) => handleChildChange(index, "name", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Child Age
                    </label>
                    <input
                      type="number"
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
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Work Section */}
        {renderFormSection("Education & Employment (Optional)", [
          "educationStatus", "educationLevel", "employmentStatus", 
          "organization", "skills", "serviceArea", "serviceExplanation", "testimony"
        ])}

        {/* Completed Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Completed Courses (Optional)</h3>
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
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & Auth Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            Profile & Authentication (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSpecialField("profilePic", "Profile Picture URL", "url")}
            {renderSpecialField("username", "Username")}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if member won't have login access
              </p>
            </div>
            {renderSpecialField("role", "Role", "select", [
              { value: "member", label: "Member" },
              { value: "admin", label: "Admin" }
            ])}
          </div>
        </div>

        {/* Validation Summary (only shows if there are errors) */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Please fix the following errors:</h4>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span> {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p>
              <span className="text-red-500">*</span> indicates required field
            </p>
            <p>ID Number must be unique and is required for all members</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              type="button"
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
    </div>
  );
};

export default AddMember;