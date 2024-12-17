import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  auth,
  googleProvider,
} from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Inicio de sesión con Google exitoso");
    } catch (error) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red-600 text-center mb-6">
          Iniciar Sesión
        </h2>

        {/* Formulario de Login */}
        <form onSubmit={handleLogin}>
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

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Opciones adicionales */}
        <div className="text-center my-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
          >
            Iniciar sesión con Google
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <a href="#" className="hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-red-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
