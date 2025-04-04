import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Mail,
  LogIn,
  ArrowLeft,
} from "lucide-react";

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    const activateAccount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/activate/${token}`
        );
        if (response.ok) {
          setStatus("success");
          setMessage("¡Cuenta activada con éxito!");
          timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
          }, 1000);
        } else {
          const error = await response.json();
          setStatus("error");
          setMessage(error.message || "Error al activar la cuenta.");
        }
      } catch (error) {
        console.error("Error al activar la cuenta:", error);
        setStatus("error");
        setMessage(
          "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."
        );
      }
    };

    activateAccount();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [token]);

  useEffect(() => {
    if (status === "success" && countdown <= 0) {
      navigate("/");
    }
  }, [countdown, status, navigate]);

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: <Shield className="w-12 h-12 text-blue-600 animate-pulse" />,
          title: "Verificando cuenta",
          message: "Procesando tu solicitud...",
          color: "blue",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
          title: "¡Cuenta activada!",
          message: message,
          color: "green",
        };
      case "error":
        return {
          icon: <XCircle className="w-12 h-12 text-red-600" />,
          title: "Error de activación",
          message: message,
          color: "red",
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-gray-600" />,
          title: "Estado desconocido",
          message: "Algo salió mal",
          color: "gray",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 p-2 inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-gray-900">
                  Activación de Cuenta
                </h1>
                <p className="text-sm text-gray-500">
                  Verificando tu cuenta...
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Status Banner */}
          <div
            className={`p-8 flex flex-col items-center justify-center bg-gradient-to-r
            ${
              status === "success"
                ? "from-green-500 to-green-600"
                : status === "error"
                ? "from-red-500 to-red-600"
                : "from-blue-500 to-blue-600"
            } 
            text-white`}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
              {statusConfig.icon}
            </div>
            <h2 className="text-2xl font-bold text-center">
              {statusConfig.title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center">
              {status === "loading" ? (
                <div className="flex flex-col items-center space-y-4">
                  <ClipLoader color="#3B82F6" size={30} />
                  <p className="text-gray-600">{statusConfig.message}</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">{statusConfig.message}</p>
                  {status === "success" ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                        <Mail className="w-5 h-5" />
                        <span>Tu correo ha sido verificado</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-600">
                          Redirigiendo al login en{" "}
                          <span className="font-bold text-red-600">
                            {countdown}
                          </span>{" "}
                          segundos
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/")}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Ir al Login
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate("/")}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Volver al Inicio
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://wa.me/18094039726"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ActivateAccount;
