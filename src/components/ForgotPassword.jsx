import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebaseConfig";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Hemos enviado un enlace de restablecimiento a tu correo.");
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error);
      setError(
        error.message || "Error al procesar la solicitud. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Volver al login</span>
              </button>
              <h1 className="text-xl font-semibold text-red-600">Taxes247</h1>
            </div>
            <button
              onClick={() => window.open("https://wa.me/18094039726", "_blank")}
              className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-600 mt-2">
              Ingresa tu correo electrónico y te enviaremos las instrucciones
              para restablecer tu contraseña
            </p>
          </div>

          {/* Mensajes de Estado */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <p className="text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <Send className="h-5 w-5 mr-2" />
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        </div>

        {/* Ayuda Adicional */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ¿Necesitas ayuda adicional?{" "}
            <button
              onClick={() => window.open("https://wa.me/18094039726", "_blank")}
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Contáctanos
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
