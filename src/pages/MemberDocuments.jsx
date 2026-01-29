import { useState, useEffect } from "react";
import api from "../api/axios";

const MemberDocuments = ({ memberId }) => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: "",
    documentType: "",
    documentNumber: "",
    documentSource: "",
    file: null,
  });

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
    }
  };

  const handleDocumentChange = (key, value) => {
    setNewDocument(prev => ({ ...prev, [key]: value }));
  };

  const uploadDocument = async () => {
    if (!newDocument.file) return alert("Please select a file");

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
      setNewDocument({ title: "", documentType: "", documentNumber: "", documentSource: "", file: null });
      fetchDocuments();
      alert("Document uploaded!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/documents/${docId}`);
      fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Failed to delete document");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="font-semibold mb-4 text-xl">Documents</h2>

      {/* Upload Document */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Title"
          value={newDocument.title}
          onChange={e => handleDocumentChange("title", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Type"
          value={newDocument.documentType}
          onChange={e => handleDocumentChange("documentType", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Number"
          value={newDocument.documentNumber}
          onChange={e => handleDocumentChange("documentNumber", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Source"
          value={newDocument.documentSource}
          onChange={e => handleDocumentChange("documentSource", e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="file"
          onChange={e => handleDocumentChange("file", e.target.files[0])}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={uploadDocument}
        className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6"
      >
        Add Document
      </button>

      {/* List Documents */}
      <ul className="space-y-2">
        {documents.map(doc => (
          <li key={doc._id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <a href={doc.filePath} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {doc.title}
              </a>
              <p className="text-sm text-gray-600">{doc.documentType} | {doc.documentNumber}</p>
            </div>
            <button onClick={() => deleteDocument(doc._id)} className="bg-red-600 text-white px-3 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberDocuments;
