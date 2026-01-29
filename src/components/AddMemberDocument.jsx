import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Nav from "../components/Nav";

const AddMemberDocument = () => {
  const { id } = useParams(); // memberId
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    documentType: "",
    documentNumber: "",
    documentSource: "church", // default value
    file: null
  });
  const [loading, setLoading] = useState(false); // for button disable

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.file) return alert("Please select a file");

    setLoading(true); // disable button
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
      alert("Document uploaded!");
      navigate(`/documents/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    } finally {
      setLoading(false); // enable button after request
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">Add Document</h1>

        {["title", "documentType", "documentNumber"].map(field => (
          <input
            key={field}
            placeholder={field}
            value={form[field]}
            onChange={e => handleChange(field, e.target.value)}
            className="border p-2 w-full mb-3"
          />
        ))}

        {/* Document Source select */}
        <select
          value={form.documentSource}
          onChange={e => handleChange("documentSource", e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="church">Church</option>
          <option value="member">Member</option>
        </select>

        <input
          type="file"
          onChange={e => handleChange("file", e.target.files[0])}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading} // disable while uploading
          className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => navigate(`/documents/${id}`)}
          className="ml-4 text-blue-600 underline"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AddMemberDocument;
