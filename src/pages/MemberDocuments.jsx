import { useState, useEffect } from "react";
import api from "../api/axios";
import { Upload, File, Trash2, Eye } from "lucide-react";

const MemberDocuments = ({ memberId, showAlert }) => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: "",
    documentType: "",
    documentNumber: "",
    documentSource: "church",
    file: null,
  });
  const [uploading, setUploading] = useState(false);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [memberId]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/documents/member/${memberId}`);
      setDocuments(res.data.documents);
    } catch (error) {
      console.error(error);
      showAlert("Failed to load documents", "error");
    }
  };

  const handleDocumentChange = (key, value) => {
    setNewDocument(prev => ({ ...prev, [key]: value }));
  };

  const uploadDocument = async () => {
    if (!newDocument.file) {
      showAlert("Please select a file", "warning");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("memberId", memberId);
    formData.append("title", newDocument.title);
    formData.append("documentType", newDocument.documentType);
    formData.append("documentNumber", newDocument.documentNumber);
    formData.append("documentSource", newDocument.documentSource);
    formData.append("file", newDocument.file);

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setNewDocument({ 
        title: "", 
        documentType: "", 
        documentNumber: "", 
        documentSource: "church", 
        file: null 
      });
      
      fetchDocuments();
      showAlert("Document uploaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed to upload document", "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/documents/${docId}`);
      fetchDocuments();
      showAlert("Document deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete document", "error");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Documents</h2>

      {/* Upload Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Upload New Document</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              placeholder="Document title"
              value={newDocument.title}
              onChange={e => handleDocumentChange("title", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              placeholder="Document type"
              value={newDocument.documentType}
              onChange={e => handleDocumentChange("documentType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Number</label>
            <input
              placeholder="Document number"
              value={newDocument.documentNumber}
              onChange={e => handleDocumentChange("documentNumber", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <select
              value={newDocument.documentSource}
              onChange={e => handleDocumentChange("documentSource", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="church">Church</option>
              <option value="member">Member</option>
            </select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              onChange={e => handleDocumentChange("file", e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <button
          onClick={uploadDocument}
          disabled={uploading || !newDocument.file}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
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

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Existing Documents</h3>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {doc.title}
                    </a>
                    <p className="text-sm text-gray-600">
                      {doc.documentType} | {doc.documentNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Document"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDocuments;