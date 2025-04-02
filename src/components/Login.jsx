import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  fetchSignInMethodsForEmail,
} from "../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  FileText,
  Mail,
  Lock,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  DollarSign,
  AlertCircle,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false); // Nuevo estado para login con email
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Nuevo estado para login con Google
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsEmailLoading(true);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.includes("google.com")) {
        setErrorMessage(
          "Esta cuenta está registrada con Google. Por favor, usa el botón 'Iniciar sesión con Google'."
        );
        setIsEmailLoading(false);
        filteredF;
        return;
      }

      // Login con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;

      // Verificar estado de activación y rol
      const { ok, data } = await api.post("/users/login", {
        email: authUser.email,
        isGoogleLogin: false,
        uid: authUser.uid,
      });

      if (!ok) {
        await auth.signOut();
        setErrorMessage(data.message);
        return;
      }

      // Si es admin, verificar permisos de admin
      if (data.user.role === "admin") {
        const token = await authUser.getIdToken();
        const adminVerifyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!adminVerifyResponse.ok) {
          await auth.signOut();
          setErrorMessage("No autorizado como administrador");
          return;
        }
      }

      const updatedUser = {
        uid: authUser.uid,
        email: authUser.email,
        name: data.user.name || "Usuario",
        role: data.user.role, // Incluimos el rol
      };

      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      // Redirigir según el rol
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      let errorMessage =
        "Error al iniciar sesión. Por favor, inténtalo de nuevo.";

      if (error.code === "auth/invalid-credential") {
        errorMessage =
          "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Demasiados intentos fallidos. Por favor, intenta más tarde.";
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const authUser = result.user;
      const token = await authUser.getIdToken();

      // Verificar con el backend
      const { ok, data } = await api.post("/users/login", {
        email: authUser.email,
        name: authUser.displayName || "Usuario",
        isGoogleLogin: true,
        uid: authUser.uid,
      });

      if (!ok) {
        await auth.signOut();
        setErrorMessage(data.message);
        return;
      }

      // Si es admin, verificar permisos
      if (data.user.role === "admin") {
        try {
          const adminVerifyResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/verify`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!adminVerifyResponse.ok) {
            await auth.signOut();
            setErrorMessage("No autorizado como administrador");
            return;
          }
        } catch (verifyError) {
          console.error("Error en verificación admin:", verifyError);
          await auth.signOut();
          setErrorMessage("Error en verificación de permisos de administrador");
          return;
        }
      }

      const updatedUser = {
        uid: authUser.uid,
        email: authUser.email,
        name: data.user.name || authUser.displayName || "Usuario",
        role: data.user.role, // Asegurarnos de incluir el rol
      };

      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      // Redirigir según el rol
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      console.error("Error completo:", error); // Para debugging
      let errorMessage =
        "Error al iniciar sesión con Google. Por favor, inténtalo más tarde.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Inicio de sesión cancelado. Inténtalo de nuevo.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage =
          "Esta cuenta ya está registrada con otro método de inicio de sesión.";
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage("");
    if (!email) {
      setErrorMessage(
        "Por favor, ingresa tu correo electrónico para recuperar la contraseña."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage(
        "Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada."
      );
    } catch (error) {
      setErrorMessage("Error al enviar el correo de recuperación.");
      console.error("Error al enviar correo de recuperación:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <FileText className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Taxes247
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Precios
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/faq")}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open("https://wa.me/18094039726", "_blank")
                }
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.button>
          </div>

          {/* Mobile Menu with Animation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-3 space-y-1"
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate("/pricing");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Precios
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate("/faq");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  FAQ
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    window.open("https://wa.me/18094039726", "_blank");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Contacto
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
          {/* Login Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Login Form */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-6  border border-white/20">
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6 bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl -mx-6 -mt-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  ¡Bienvenido!
                </h2>
                <p className="text-base text-white/90">
                  Inicia sesión para continuar
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-700" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-700" />
                    </div>
                    <input
                      type="password"
                      className="block w-full pl-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 text-base"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{errorMessage}</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base font-medium"
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    <>
                      Iniciar Sesión
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-2 bg-white text-gray-500">
                      O continúa con
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-base font-medium"
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <ClipLoader size={20} color="#000000" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        <path fill="none" d="M1 1h22v22H1z" />
                      </svg>
                      Iniciar sesión con Google
                    </>
                  )}
                </motion.button>

                <div className="space-y-4 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-base text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </motion.button>

                  <div className="text-base text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => navigate("/register")}
                      className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      Regístrate aquí
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Login;
