import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";
import ConfirmModal from "../components/ConfirmModal";
import { 
  Plus, FileText, Image as ImageIcon, File, Download, 
  Trash2, Calendar, ArrowLeft, FileType 
} from "lucide-react";

const MemberDocumentsPage = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, docId: null });

  // Fetch member info
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/members/${id}`);
        setMember(res.data);
      } catch (error) {
        showAlert("Failed to load member information", "error");
      }
    };
    fetchMember();
  }, [id]);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/documents/member/${id}`);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
      showAlert("Failed to load documents", "error");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  // Delete a document
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/documents/${deleteModal.docId}`);
      showAlert("Document deleted successfully!", "success");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete document", "error");
    } finally {
      setLoading(false);
      setDeleteModal({ open: false, docId: null });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="w-6 h-6" />;
    if (fileType === "application/pdf") return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <Nav />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate(`/members/${id}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {member ? `${member.name}'s Documents` : "Documents"}
              </h1>
            </div>
            <p className="text-gray-600">
              Manage member documents and files
            </p>
          </div>
          
          <button
            onClick={() => navigate(`/documents/add/${id}`)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
          >
            <Plus className="w-5 h-5" />
            Add Document
          </button>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Documents Yet</h3>
            <p className="text-gray-600 mb-6">Start by uploading the first document</p>
            <button
              onClick={() => navigate(`/documents/add/${id}`)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div
                key={doc._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Document Preview */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{doc.title}</h3>
                        <p className="text-sm text-gray-500">{doc.documentType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileType className="w-4 h-4" />
                      <span>Number: {doc.documentNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>Source: {doc.documentSource}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Uploaded: {formatDate(doc.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      View
                    </a>
                    <button
                      onClick={() => setDeleteModal({ open: true, docId: doc._id })}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, docId: null })}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default MemberDocumentsPage;