import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Necesario para react-modal

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el error
  const [isSuccess, setIsSuccess] = useState(false); // Estado para el modal de éxito
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar cualquier error previo

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Enviar datos adicionales al backend
      const response = await fetch("http://localhost:5000/api/users", {
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
        setErrorMessage("Error al guardar datos adicionales en el servidor.");
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
    }
  };

  const closeModal = () => {
    setIsSuccess(false); // Cerrar el modal
    navigate("/"); // Redirigir al login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
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
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Registrarse
          </button>
        </form>
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
          <p>Tu cuenta ha sido creada exitosamente.</p>
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
