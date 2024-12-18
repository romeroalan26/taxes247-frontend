import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  auth,
  googleProvider,
} from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar cualquier mensaje de error anterior

    try {
      // Intentar iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener información adicional desde el backend
      const response = await fetch(
        `http://localhost:5000/api/users/${user.uid}`
      );
      if (response.ok) {
        const userData = await response.json();
        //alert(`Bienvenido, ${userData.name}`);
        navigate("/dashboard"); // Redirige al dashboard
      } else {
        setErrorMessage(
          "Usuario autenticado, pero no se encontraron datos adicionales."
        );
      }
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found"
      ) {
        setErrorMessage("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      } else {
        setErrorMessage(
          "Ocurrió un error al iniciar sesión. Inténtalo más tarde."
        );
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      //alert(`Bienvenido, ${result.user.displayName}`);
      navigate("/dashboard"); // Redirige al dashboard
    } catch (error) {
      setErrorMessage(
        "Error al iniciar sesión con Google. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
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
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
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
            Iniciar Sesión
          </button>
        </form>

        {/* Iniciar sesión con Google */}
        <div className="text-center my-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
          >
            Iniciar sesión con Google
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-red-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
