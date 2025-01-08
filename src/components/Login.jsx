import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential
} from "../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
  
    try {
      // Verificar métodos de inicio de sesión
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.includes('google.com')) {
        setErrorMessage(
          "Esta cuenta está registrada con Google. Por favor, usa el botón 'Iniciar sesión con Google'."
        );
        setIsLoading(false);
        return;
      }
  
      // Login con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authUser = userCredential.user;
  
      // Primero, actualizar el UID en el backend
      const updateResponse = await api.post('/users/update-uid', {
        email: authUser.email,
        uid: authUser.uid
      });
  
      if (!updateResponse.ok) {
        console.warn('No se pudo actualizar el UID, pero continuamos...');
      }
  
      // Verificar estado de activación
      const { ok, data } = await api.post('/users/login', {
        email: authUser.email,
        isGoogleLogin: false,
        uid: authUser.uid  // Enviamos el uid también aquí
      });
  
      if (!ok) {
        await auth.signOut();
        setErrorMessage(data.message);
        return;
      }
  
      const updatedUser = {
        uid: authUser.uid,
        email: authUser.email,
        name: data.user.name || "Usuario",
      };
      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      navigate("/dashboard");
  
    } catch (error) {
      let errorMessage = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Por favor, intenta más tarde.";
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsLoading(true);
  
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const authUser = result.user;
  
      // No necesitamos vincular las cuentas aquí ya que eso puede causar problemas
      // y firebase maneja esto internamente
  
      // Solo establecemos el usuario en el contexto y localStorage
      const updatedUser = {
        uid: authUser.uid,
        email: authUser.email,
        name: authUser.displayName || "Usuario",
      };
      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      navigate("/dashboard");
  
    } catch (error) {
      let errorMessage = "Error al iniciar sesión con Google. Por favor, inténtalo más tarde.";
      
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Inicio de sesión cancelado. Inténtalo de nuevo.";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "Esta cuenta ya está registrada con otro método de inicio de sesión.";
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Por favor, ingresa tu correo electrónico para recuperar la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage("Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.");
    } catch (error) {
      setErrorMessage("Error al enviar el correo de recuperación.");
      console.error("Error al enviar correo de recuperación:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
  <h1 className="text-2xl font-bold">Taxes247</h1>
  <div className="flex space-x-4"> {/* Contenedor para agrupar los botones */}
    <button
      onClick={() => navigate("/pricing")}
      className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-200"
    >
      Precios
    </button>
    <button
      onClick={() => window.open("https://wa.me/18094039726", "_blank")}
      className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-200"
    >
      Contacto
    </button>
  </div>
</header>


      {/* Contenido principal */}
      <main className="flex flex-col items-center justify-center p-8">
        {/* Texto de bienvenida */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">¡Bienvenido a Taxes247!</h2>
          <p className="text-gray-700 max-w-sm text-center">
          Simplifica y asegura tu proceso de declaración de impuestos con
            nuestra plataforma. Registra tus datos de forma segura, realiza
            pagos con confianza y da seguimiento a tus solicitudes de manera
            fácil y eficiente.
          </p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Iniciar Sesión</h2>
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
            {errorMessage && <div className="text-red-600 text-sm mb-4 text-center">{errorMessage}</div>}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Iniciar Sesión"}
            </button>
          </form>

          {/* Login con Google */}
          <div className="text-center my-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color="#000000" /> : "Iniciar sesión con Google"}
            </button>
          </div>

          {/* Recuperar contraseña */}
          <div className="text-center">
            <p className="text-gray-600">
              ¿Olvidaste tu contraseña?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-red-600 hover:underline"
              >
                Recupérala aquí.
              </button>
            </p>
          </div>

          {/* Registrarse */}
          <div className="text-center mt-4">
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
        </div>        <div className="mt-12 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-red-600 mb-4">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Qué es un formulario W-2 y quién lo necesita?
              </summary>
              <p className="text-gray-700 mt-2">
                Un formulario W-2 es un documento proporcionado por tu empleador
                que reporta tus ingresos y los impuestos retenidos durante el
                año. Es necesario para presentar tu declaración de impuestos.
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Cuáles son las fechas límite para presentar mis impuestos?
              </summary>
              <p className="text-gray-700 mt-2">
                Generalmente, la fecha límite para presentar tus impuestos es el
                15 de abril de cada año. Si cae en un fin de semana o feriado,
                se extiende al siguiente día hábil.
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Qué debo hacer si no puedo pagar mis impuestos?
              </summary>
              <p className="text-gray-700 mt-2">
                Si no puedes pagar tus impuestos, puedes presentar tu
                declaración a tiempo para evitar multas adicionales. Además,
                puedes solicitar un plan de pagos al IRS visitando{" "}
                <a
                  href="https://www.irs.gov/payments/online-payment-agreement-application"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline hover:text-red-800"
                >
                  esta página
                </a>
                .
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Cómo puedo rastrear mi reembolso?
              </summary>
              <p className="text-gray-700 mt-2">
                Puedes rastrear tu reembolso utilizando la herramienta "¿Dónde
                está mi reembolso?" en el sitio web del IRS:{" "}
                <a
                  href="https://www.irs.gov/refunds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline hover:text-red-800"
                >
                  ¿Dónde está mi reembolso?
                </a>
                .
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Qué sucede si presento mis impuestos tarde?
              </summary>
              <p className="text-gray-700 mt-2">
                Si presentas tus impuestos tarde y debes dinero, podrías
                enfrentar multas e intereses por retraso. Si esperas recibir un
                reembolso, no hay multa, pero es mejor presentarlos lo antes
                posible.
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Qué documentos necesito para presentar mis impuestos?
              </summary>
              <p className="text-gray-700 mt-2">
                Los documentos necesarios incluyen formularios W-2, 1099, estado
                de cuenta de intereses hipotecarios, recibos de donaciones
                caritativas, y cualquier otro documento relacionado con ingresos
                y deducciones.
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Quién califica para el Crédito Tributario por Ingreso del
                Trabajo (EITC)?
              </summary>
              <p className="text-gray-700 mt-2">
                El EITC está disponible para contribuyentes de bajos ingresos
                que cumplan con ciertos requisitos. Puedes verificar tu
                elegibilidad en la herramienta de EITC del IRS:{" "}
                <a
                  href="https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline hover:text-red-800"
                >
                  Crédito Tributario por Ingreso del Trabajo (EITC)
                </a>
                .
              </p>
            </details>
            <details className="bg-white shadow rounded-md p-4">
              <summary className="font-medium cursor-pointer">
                ¿Cómo puedo obtener una extensión para presentar mis impuestos?
              </summary>
              <p className="text-gray-700 mt-2">
                Puedes solicitar una extensión automática de seis meses
                utilizando el formulario 4868. Más información está disponible
                en la página oficial del IRS:{" "}
                <a
                  href="https://www.irs.gov/forms-pubs/extension-of-time-to-file-your-tax-return"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline hover:text-red-800"
                >
                  Extensión de tiempo
                </a>
                .
              </p>
            </details>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Login;
