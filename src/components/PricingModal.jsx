import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, CheckCircle2, DollarSign, Clock } from "lucide-react";

const PricingModal = ({ onSelect, onClose }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">$60</span>
              <span className="text-gray-500">USD</span>
            </div>
            <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-red-50 rounded-full">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">
                Pagas cuando te depositen los Federales
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Declaración de impuestos completa
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Soporte por WhatsApp y correo
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => onSelect("standard", 60)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="font-medium">Comenzar Ahora</span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
