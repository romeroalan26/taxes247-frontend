import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  X, 
  CheckCircle2, 
  Clock, 
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-auto overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Plan de Declaración de Impuestos
          </h2>
          <p className="text-red-100">
            Gestiona tu declaración de impuestos de forma segura y eficiente
          </p>
        </div>

        {/* Plan Content */}
        <div className="p-8">
          <div className="bg-white rounded-xl border-2 border-red-100 overflow-hidden hover:border-red-500 transition-all duration-300">
            <div className="p-6">
              {/* Precio */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900">$60</span>
                  <span className="text-gray-500 ml-2">USD</span>
                </div>
                <p className="text-gray-600">Pagas cuando te depositen</p>
              </div>

              {/* Características */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                  <span className="text-gray-600">
                    Declaración de impuestos completa y profesional
                  </span>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                  <span className="text-gray-600">
                    Proceso seguro y confiable
                  </span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                  <span className="text-gray-600">
                    Procesamiento eficiente de tu declaración
                  </span>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                  <span className="text-gray-600">
                    Soporte personalizado por WhatsApp y correo electrónico
                  </span>
                </div>

              </div>

              <button
                onClick={() => onSelect("standard", 60)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Comenzar Ahora</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>

          {/* Garantía */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Tu información está segura y protegida. 
              Contamos con soporte dedicado para ayudarte en cada paso del proceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Añadir estilos de animación
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;

// Crear y añadir estilos al documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PricingModal;