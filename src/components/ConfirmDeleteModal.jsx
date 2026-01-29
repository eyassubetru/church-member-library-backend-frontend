const ConfirmDeleteModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-96">
      <h3 className="font-bold mb-2">Delete Member?</h3>
      <p className="text-gray-600 mb-4">This action cannot be undone.</p>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;
