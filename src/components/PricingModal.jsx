import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  DollarSign,
  ShieldCheck
} from "lucide-react";

const PricingModal = ({ onSelect, onClose }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
      text: "Declaración de impuestos completa"
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-red-500" />,
      text: "Soporte por WhatsApp y correo"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-red-500" />,
      text: "Pagas cuando te depositen los Federales"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8">
        {/* Header */}
        <div className="relative p-6 border-b">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Selecciona tu Plan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tu declaración de forma segura y eficiente
          </p>
        </div>

        {/* Plan Content */}
        <div className="p-6">
          {/* Precio */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900">$60</span>
              <span className="text-gray-500 ml-2">USD</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Pago único</p>
          </div>

          {/* Características */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {feature.icon}
                <span className="text-sm text-gray-600">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => onSelect("standard", 60)}
              className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Comenzar Ahora</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Footer */}
          <p className="mt-4 text-xs text-center text-gray-500">
            Tu información está segura y protegida.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;