import React from "react";
import { CheckCircle2, X, Zap, Clock, MessageCircle, DollarSign } from "lucide-react";

const PricingModal = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="min-h-full w-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col animate-fade-in">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-2">
              Elige el Plan Perfecto para Ti
            </h2>
            <p className="text-red-100">
              Selecciona el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          {/* Planes - Contenedor con scroll */}
          <div className="p-8 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Estándar */}
              <div className="relative bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-red-500 hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Estándar</h3>
                    <p className="text-gray-500 text-sm">Para declaraciones simples</p>
                  </div>

                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">$60</span>
                    <span className="text-gray-500 ml-2">USD</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Declaración de impuestos básica con soporte estándar
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Tiempo de procesamiento regular
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MessageCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Soporte por WhatsApp y correo electrónico
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelect("standard", 60)}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Seleccionar Estándar
                  </button>
                </div>
              </div>

              {/* Plan Premium */}
              <div className="relative bg-white rounded-xl border-2 border-red-500 overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Recomendado
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
                    <p className="text-gray-500 text-sm">Maximiza tu reembolso</p>
                  </div>

                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-gray-900">$150</span>
                    <span className="text-gray-500 ml-2">USD</span>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-6">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Bono Estimado
                        </p>
                        <p className="text-sm text-green-700">
                          $900 - $1,200 extra
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Todo lo incluido en el plan estándar
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Zap className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Procesamiento prioritario y atención preferencial
                      </span>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Maximización de reembolso garantizada
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MessageCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-600">
                        Soporte prioritario 24/7 por WhatsApp
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelect("premium", 150)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Seleccionar Premium
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
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