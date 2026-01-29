import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import { Upload, ArrowLeft, FileText } from "lucide-react";

const AddMemberDocument = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    documentType: "",
    documentNumber: "",
    documentSource: "church",
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!form.file) {
      showAlert("Please select a file", "warning");
      return;
    }

    if (!form.title.trim()) {
      showAlert("Please enter a document title", "warning");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("memberId", id);
    formData.append("title", form.title);
    formData.append("documentType", form.documentType);
    formData.append("documentNumber", form.documentNumber);
    formData.append("documentSource", form.documentSource);
    formData.append("file", form.file);

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showAlert("Document uploaded successfully!", "success");
      navigate(`/documents/${id}`);
    } catch (error) {
      console.error(error);
      showAlert("Failed to upload document", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <Nav />
      
      <div className="max-w-2xl mx-auto pt-24 px-4 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(`/documents/${id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Upload Document</h1>
              <p className="text-gray-600">Add a new document for this member</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter document title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Type and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <input
                  type="text"
                  value={form.documentType}
                  onChange={(e) => handleChange("documentType", e.target.value)}
                  placeholder="e.g., ID Card, Certificate"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Number
                </label>
                <input
                  type="text"
                  value={form.documentNumber}
                  onChange={(e) => handleChange("documentNumber", e.target.value)}
                  placeholder="Document number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Source
              </label>
              <select
                value={form.documentSource}
                onChange={(e) => handleChange("documentSource", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="church">Church</option>
                <option value="member">Member</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                {fileName ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-800">{fileName}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, file: null }));
                        setFileName("");
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                    <label className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer">
                      Choose File
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/documents/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.file}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDocument;