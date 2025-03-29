import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  FileText,
  User,
  Mail,
  Phone,
  Lock,
  LogIn,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  UserPlus,
  Menu,
  Eye,
  EyeOff,
} from "lucide-react";

const Register = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = userCredential.user;

      const backendResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            uid: firebaseUser.uid,
          }),
        }
      );

      if (!backendResponse.ok) {
        await firebaseUser.delete();
        const error = await backendResponse.json();
        throw new Error(error.message);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error en el registro:", error);
      let errorMsg =
        "Ocurrió un error al registrar el usuario. Inténtalo de nuevo.";

      if (error.code === "auth/email-already-in-use") {
        errorMsg = "El correo electrónico ya está en uso. Intenta con otro.";
      } else if (error.code === "auth/weak-password") {
        errorMsg =
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "El correo electrónico no es válido.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Taxes247
              </h1>
            </div>

            {/* Botones para pantallas medianas y grandes */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
              <button
                onClick={() =>
                  window.open("https://wa.me/18094039726", "_blank")
                }
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacto
              </button>
            </div>

            {/* Botón hamburguesa para móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
              >
                <Menu className="w-6 h-6 text-gray-700" />
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
                className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </button>
              <button
                onClick={() => {
                  window.open("https://wa.me/18094039726", "_blank");
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Contacto
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Registration Form */}
          <div className="flex-1 w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 px-6 py-6 sm:py-8 text-white">
                <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                  <UserPlus className="w-7 h-7 sm:w-8 sm:h-8" />
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Crear Cuenta
                  </h2>
                </div>
                <p className="text-red-100 text-base sm:text-lg">
                  Únete a nosotros y comienza a gestionar tus declaraciones de
                  impuestos de manera segura y eficiente.
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8">
                <form
                  onSubmit={handleRegister}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nombre Completo
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Correo Electrónico
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Teléfono
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="809-555-1234"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="********"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Mínimo 8 caracteres
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 sm:p-4 rounded-xl border border-red-100">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader size={20} color="#ffffff" />
                    ) : (
                      <>
                        <span>Crear Cuenta</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      Inicia sesión aquí
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="flex-1 w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Beneficios de registrarte
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: <Shield className="w-6 h-6 text-red-600" />,
                    title: "Seguridad Garantizada",
                    description:
                      "Tu información está protegida con los más altos estándares de seguridad.",
                  },
                  {
                    icon: <CheckCircle2 className="w-6 h-6 text-red-600" />,
                    title: "Proceso Simplificado",
                    description:
                      "Gestiona tus declaraciones de impuestos de manera fácil y eficiente.",
                  },
                  {
                    icon: <MessageCircle className="w-6 h-6 text-red-600" />,
                    title: "Soporte Personalizado",
                    description:
                      "Acceso a asistencia dedicada por WhatsApp y correo electrónico.",
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4"
                  >
                    <div className="flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900">
                        {benefit.title}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                ¡Registro Exitoso!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Tu cuenta ha sido registrada correctamente. Te hemos enviado un
                correo electrónico con un enlace para activar tu cuenta.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Por favor, revisa tu bandeja de entrada y sigue las
                instrucciones del correo para completar la activación.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  navigate("/");
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Ir al Login</span>
                <LogIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
