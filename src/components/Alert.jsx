import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertCircle, X } from "lucide-react";

const Alert = ({ message, type = "info" }) => {
  const [visible, setVisible] = useState(true);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${colors[type]} border rounded-lg shadow-lg p-4 min-w-80 max-w-md flex items-start gap-3`}>
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;