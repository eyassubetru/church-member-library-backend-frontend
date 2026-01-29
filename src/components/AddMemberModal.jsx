import { useState } from "react";
import api from "../api/axios";

const AddMemberModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", idNumber: "" });

  const submit = async () => {
    await api.post("/members/paper", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="font-bold mb-4">Add Member</h3>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="ID Number"
          className="border p-2 w-full mb-4"
          onChange={e => setForm({ ...form, idNumber: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
