import { useState } from "react";
import api from "../api/axios";
import { X, UserPlus } from "lucide-react";

const AddMemberModal = ({ onClose, showAlert }) => {
  const [form, setForm] = useState({ name: "", idNumber: "", email: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name.trim()) {
      showAlert("Please enter a name", "warning");
      return;
    }

    setLoading(true);
    try {
      await api.post("/members/paper", form);
      showAlert("Member added successfully!", "success");
      onClose();
      // Optionally refresh the member list in parent component
    } catch (error) {
      showAlert("Failed to add member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Add Member</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              placeholder="Enter full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              placeholder="Enter ID number"
              value={form.idNumber}
              onChange={e => setForm({ ...form, idNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;