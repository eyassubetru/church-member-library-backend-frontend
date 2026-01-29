import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}) => {
  if (!isOpen) return null;

  const colors = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const buttonColors = {
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scale-in">
        <div className={`${colors[type]} p-6 rounded-t-xl`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonColors[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;