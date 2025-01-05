import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const pricingOptions = [
    {
      title: "Plan Estándar",
      price: "$60",
      description: "Ideal para quienes necesitan una declaración básica de impuestos.",
      features: [
        "Declaración de impuestos básica",
        "Presentación segura",
        "Asistencia personalizada por correo y WhatsApp",
      ],
    },
    {
      title: "Plan Premium",
      price: "$150",
      description: "Maximiza tu reembolso y disfruta de soporte prioritario.",
      features: [
        "Todo lo incluido en el plan estándar",
        "Procesamiento prioritario",
        "Soporte prioritario por WhatsApp y correo",
        "Bono adicional estimado de US$900 a US$1,200",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Taxes247</h1>
        <div className="flex space-x-4">
          <button
            className="bg-red-700 px-4 py-2 rounded-md hover:bg-red-800"
            onClick={() => navigate("/")}
          >
            Login
          </button>
          <button
            onClick={() => window.open("https://wa.me/18094039726", "_blank")}
            className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Contacto
          </button>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Opciones de Precios
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pricingOptions.map((option, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-red-500"
            >
              <h3 className="text-xl font-bold text-red-600 mb-4">{option.title}</h3>
              <p className="text-3xl font-bold text-gray-800 mb-4">
                {option.price} <span className="text-sm text-gray-600">USD</span>
              </p>
              <p className="text-gray-600 mb-6">{option.description}</p>
              <ul className="space-y-3 text-gray-600 mb-6 text-left">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                onClick={() => navigate("/")}
              >
                Comenzar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
