import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email); // Llamada a la función de Firebase
      setMessage("Hemos enviado un enlace de restablecimiento a tu correo.");
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error);
      setError(
        error.message || "Error al procesar la solicitud. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Taxes247</h1>
        <div>
          <button
            className="bg-red-700 mr-4 px-4 py-2 hover:bg-red-800  text-left rounded-md"
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
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Recuperar Contraseña
          </h2>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Enviar Enlace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
