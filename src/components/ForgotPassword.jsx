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
  Menu,
  BellRing,
  FileText,
} from "lucide-react";

const ForgotPassword = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Taxes247</h1>
            </div>

            {/* Botones para pantallas medianas y grandes */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al login
              </button>
              <button
                onClick={() =>
                  window.open("https://wa.me/18094039726", "_blank")
                }
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto
              </button>
            </div>

            {/* Botón hamburguesa para móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white"
              >
                <Menu className="w-6 h-6" />
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
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 text-left"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Volver al login
              </button>
              <button
                onClick={() => {
                  window.open("https://wa.me/18094039726", "_blank");
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 text-left"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Contacto
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Sección Principal */}
          <div className="flex-1 w-full max-w-md">
            {/* Banner Superior */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-8 text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white/10 rounded-full p-4 backdrop-blur-sm">
                  <Mail className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center">
                Recuperar Contraseña
              </h2>
              <p className="text-red-100 text-center mt-2">
                No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-b-xl shadow-lg p-8">
              {/* Mensajes de Estado */}
              {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-green-800 text-sm">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-1">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Instrucciones
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      ¿Recordaste tu contraseña?
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver al inicio de sesión
                </button>
              </form>
            </div>

            {/* Ayuda Adicional */}
            <div className="mt-8 p-4 bg-red-50 rounded-lg">
              <div className="flex items-start gap-3">
                <BellRing className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-red-900">
                    ¿Necesitas más ayuda?
                  </h4>
                  <p className="mt-1 text-sm text-red-700">
                    Nuestro equipo está disponible para responder todas tus
                    preguntas.
                    <a
                      href="https://wa.me/18094039726"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Contactar soporte →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
