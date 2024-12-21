import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";

Modal.setAppElement("#root"); // Necesario para react-modal

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el error
  const [isSuccess, setIsSuccess] = useState(false); // Estado para el modal de éxito
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el spinner de carga
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar cualquier error previo
    setIsLoading(true); // Mostrar animación de carga

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Enviar datos adicionales al backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          email,
          phone,
          registeredAt: new Date(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true); // Mostrar modal de éxito
      } else {
        const error = await response.json();
        setErrorMessage(
          error.message || "Error al guardar datos adicionales en el servidor."
        );
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage(
          "El correo electrónico ya está en uso. Intenta con otro."
        );
      } else if (error.code === "auth/weak-password") {
        setErrorMessage(
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
        );
      } else {
        setErrorMessage(
          "Ocurrió un error al registrar el usuario. Inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false); // Ocultar animación de carga
    }
  };

  const closeModal = () => {
    setIsSuccess(false); // Cerrar el modal
    navigate("/"); // Redirigir al login
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

      {/* Formulario de Registro */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-600 text-center mb-6">
            Registro de Usuario
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre Completo</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-4">
              <label className="block text-gray-700">Número de Teléfono</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="809-123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Mostrar mensaje de error */}
            {errorMessage && (
              <div className="text-red-600 text-sm mb-4 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader color="#fff" size={24} />
              ) : (
                "Registrarse"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Éxito */}
      <Modal
        isOpen={isSuccess}
        onRequestClose={closeModal}
        contentLabel="Registro Exitoso"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-700 mb-4">
            Tu cuenta ha sido registrada correctamente. Te hemos enviado un
            correo electrónico con un enlace para activar tu cuenta.
          </p>
          <p className="text-gray-500 text-sm">
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones
            del correo para completar la activación.
          </p>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Ir al Login
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
