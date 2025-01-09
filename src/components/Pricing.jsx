import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  LogIn,
  MessageCircle,
  Check,
  ChevronRight,
  Zap,
  Clock,
  Mail,
  PhoneCall,
  DollarSign,
  Star,
  Crown,
  Shield
} from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();

  const pricingOptions = [
    {
      title: "Plan Estándar",
      price: "60",
      period: "pago único",
      description: "Ideal para quienes necesitan una declaración básica de impuestos.",
      icon: <Shield className="w-6 h-6" />,
      features: [
        {
          icon: <FileText className="w-4 h-4" />,
          text: "Declaración de impuestos básica"
        },
        {
          icon: <Shield className="w-4 h-4" />,
          text: "Presentación segura"
        },
        {
          icon: <MessageCircle className="w-4 h-4" />,
          text: "Asistencia por correo y WhatsApp"
        }
      ],
      isPopular: false,
      color: "blue"
    },
    {
      title: "Plan Premium",
      price: "150",
      period: "pago único",
      description: "Maximiza tu reembolso y disfruta de soporte prioritario.",
      icon: <Crown className="w-6 h-6" />,
      features: [
        {
          icon: <Check className="w-4 h-4" />,
          text: "Todo lo incluido en el plan estándar"
        },
        {
          icon: <Zap className="w-4 h-4" />,
          text: "Procesamiento prioritario"
        },
        {
          icon: <PhoneCall className="w-4 h-4" />,
          text: "Soporte prioritario por WhatsApp y correo"
        },
        {
          icon: <DollarSign className="w-4 h-4" />,
          text: "Bono adicional estimado de US$900 a US$1,200"
        }
      ],
      isPopular: true,
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Taxes247</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
              <button
                onClick={() => window.open("https://wa.me/18094039726", "_blank")}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Planes Simples, Resultados Extraordinarios
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Elije el plan que mejor se adapte a tus necesidades y maximiza tu reembolso de impuestos.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid md:grid-cols-2 gap-8">
          {pricingOptions.map((option, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 duration-300`}
            >
              {option.isPopular && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg ${option.isPopular ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {option.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{option.title}</h3>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    ${option.price}
                    <span className="text-base font-normal text-gray-500 ml-2">
                      USD / {option.period}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-500">{option.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`p-1 rounded-full ${option.isPopular ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} mr-3 mt-0.5`}>
                        {feature.icon}
                      </div>
                      <span className="text-gray-600">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/")}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
                    option.isPopular
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  Comenzar Ahora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            ¿Por qué elegir Taxes247?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-red-600" />,
                title: "Proceso Rápido",
                description: "Obtén tu declaración de impuestos en tiempo récord"
              },
              {
                icon: <Shield className="w-8 h-8 text-red-600" />,
                title: "100% Seguro",
                description: "Tu información está protegida con la más alta seguridad"
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-red-600" />,
                title: "Soporte Dedicado",
                description: "Asistencia personalizada en cada paso del proceso"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;