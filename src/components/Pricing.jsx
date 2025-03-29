import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  FileText,
  LogIn,
  MessageCircle,
  Shield,
  ChevronRight,
  Clock,
  PhoneCall,
  Menu,
} from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Taxes247
              </h1>
            </div>

            {/* Botones para pantallas medianas y grandes */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
              <button
                onClick={() =>
                  window.open("https://wa.me/18094039726", "_blank")
                }
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto
              </button>
            </div>

            {/* Botón hamburguesa para móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden pb-3 space-y-1">
              <button
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </button>
              <button
                onClick={() => {
                  window.open("https://wa.me/18094039726", "_blank");
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Contacto
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Declaración de Impuestos Simple y Efectiva
          </h1>
          <p className="text-lg sm:text-xl text-red-100 max-w-2xl mx-auto">
            Obtén tu declaración de impuestos de manera rápida, segura y
            profesional.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Plan Estándar
                </h3>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  $60
                  <span className="text-sm sm:text-base font-normal text-gray-500 ml-2">
                    USD / pagas cuando te depositen
                  </span>
                </p>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Declaración de impuestos completa y segura para tus
                  necesidades individuales.
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  {
                    icon: <FileText className="w-4 h-4" />,
                    text: "Declaración de impuestos básica",
                  },
                  {
                    icon: <Shield className="w-4 h-4" />,
                    text: "Presentación segura y confidencial",
                  },
                  {
                    icon: <MessageCircle className="w-4 h-4" />,
                    text: "Soporte por correo y WhatsApp",
                  },
                  {
                    icon: <PhoneCall className="w-4 h-4" />,
                    text: "Atención personalizada",
                  },
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="p-1 rounded-full bg-red-100 text-red-600 mr-3 mt-0.5">
                      {feature.icon}
                    </div>
                    <span className="text-sm sm:text-base text-gray-600">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-xl text-white font-medium transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg"
              >
                Comenzar Ahora
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Benefits Section */}
        <div className="mt-12 sm:mt-16 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
            ¿Por qué elegir Taxes247?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />,
                title: "Proceso Rápido",
                description:
                  "Obtén tu declaración de impuestos en tiempo récord",
              },
              {
                icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />,
                title: "100% Seguro",
                description:
                  "Tu información está protegida con la más alta seguridad",
              },
              {
                icon: (
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                ),
                title: "Soporte Dedicado",
                description:
                  "Asistencia personalizada en cada paso del proceso",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
