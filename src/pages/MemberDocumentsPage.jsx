import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";

const MemberDocumentsPage = () => {
  const { id } = useParams(); // memberId
  const [documents, setDocuments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch member info
  useEffect(() => {
    api.get(`/members/${id}`).then(res => setMember(res.data));
  }, [id]);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/documents/member/${id}`);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  // Delete a document
  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setLoading(true);
    try {
      await api.delete(`/documents/${docId}`);
      alert("Document deleted!");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">
          {member ? `${member.name}'s Documents` : "Documents"}
        </h1>

        {/* Add Document Button */}
        <Link
          to={`/documents/add/${id}`}
          className="bg-green-600 text-white px-6 py-2 rounded-lg mb-4 inline-block"
        >
          + Add Document
        </Link>

        {/* List Documents */}
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map(doc => (
              <li
                key={doc._id}
                className="border p-4 rounded bg-white shadow flex flex-col md:flex-row md:justify-between gap-4 items-start"
              >
                <div className="flex gap-4 items-start">
                  {/* Preview if image */}
                  {doc.fileType.startsWith("image/") ? (
                    <img src={doc.filePath} alt={doc.title} className="w-32 h-32 object-cover rounded" />
                  ) : doc.fileType === "application/pdf" ? (
                    <div className="w-32 h-32 flex items-center justify-center border rounded text-gray-500">
                      PDF
                    </div>
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center border rounded text-gray-500">
                      File
                    </div>
                  )}

                  <div>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline font-semibold"
                    >
                      {doc.title}
                    </a>
                    <p className="text-sm text-gray-600">
                      Type: {doc.documentType} | Number: {doc.documentNumber} | Source: {doc.documentSource}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View / Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-red-600"}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link
          to={`/members/${id}`}
          className="mt-6 inline-block text-blue-600 underline"
        >
          Back to Member Details
        </Link>
      </div>
    </div>
  );
};

export default MemberDocumentsPage;
