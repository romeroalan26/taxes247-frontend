import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const pricingOptions = [
    {
      title: "Declaración Estándar",
      price: "$60",
      description: "Una declaración básica para tus impuestos.",
      features: ["Preparación completa", "Presentación segura", "Asistencia personalizada"],
    },
    {
      title: "Declaración Premium",
      price: "$150",
      description:
        "Declaración de impuestos con bono adicional.",
      features: ["Preparación completa", "Presentación segura", "Asistencia personalizada", "Bono de entre $900 y $1200 dólares."],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Taxes247</h1>
        <div>
          <button
            className="bg-red-700 mr-4 px-4 py-2 hover:bg-red-800 rounded-md"
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
          {pricingOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border text-center"
            >
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                {option.title}
              </h3>
              <p className="text-4xl font-bold text-gray-800 mb-4">
                {option.price}
              </p>
              <p className="text-gray-600 mb-6">{option.description}</p>
              <ul className="text-left space-y-2 mb-6">
                {option.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-gray-800 flex items-center"
                  >
                    <span className="mr-2">✅</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 w-full"
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
