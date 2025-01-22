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
  Calendar,
  AlertCircle,
  FileQuestion,
  Clock,
  CheckCircle2,
  BellRing,
  FileSearch,
  Landmark,
  CreditCard,
  PhoneCall,
  Menu,
} from "lucide-react";

const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false); // Nuevo estado para login con email
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Nuevo estado para login con Google
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      icon: <FileQuestion className="w-5 h-5 text-red-600" />,
      question: "¿Qué es un formulario W-2 y quién lo necesita?",
      answer:
        "Un formulario W-2 es un documento proporcionado por tu empleador que reporta tus ingresos y los impuestos retenidos durante el año. Es necesario para presentar tu declaración de impuestos.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-red-600" />,
      question:
        "¿Cuándo inicia el proceso de declaración de impuestos del 2024?",
      answer:
        "El proceso de declaración de impuestos para el año fiscal 2024 comienza el 29 de enero de 2025, según el calendario oficial del IRS.",
    },
    {
      icon: <Clock className="w-5 h-5 text-red-600" />,
      question:
        "¿Cuál es la fecha límite para presentar mi declaración de impuestos?",
      answer:
        "La fecha límite para presentar tu declaración de impuestos en 2024 es el 15 de abril. Asegúrate de enviarla antes para evitar penalidades.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-red-600" />,
      question: "¿Cuánto tiempo tarda en procesarse mi reembolso?",
      answer:
        "Generalmente, el IRS procesa los reembolsos en un plazo de 21 días si presentas tu declaración electrónicamente y eliges depósito directo.",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      question: "¿Qué documentos necesito para mi declaración de impuestos?",
      answer:
        "Debes reunir formularios W-2, 1099, identificación personal, información bancaria y cualquier otra documentación relacionada con ingresos y deducciones.",
    },
    {
      icon: <BellRing className="w-5 h-5 text-red-600" />,
      question:
        "¿Qué pasa si presento mi declaración después de la fecha límite?",
      answer:
        "Si presentas tu declaración después del 15 de abril sin haber solicitado una extensión, podrías enfrentar multas e intereses sobre los impuestos no pagados.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-red-600" />,
      question: "¿Cuáles son las fechas límite para presentar mis impuestos?",
      answer:
        "Generalmente, la fecha límite para presentar tus impuestos es el 15 de abril de cada año. Si cae en un fin de semana o feriado, se extiende al siguiente día hábil.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-red-600" />,
      question: "¿Qué debo hacer si no puedo pagar mis impuestos?",
      answer:
        "Si no puedes pagar tus impuestos, presenta tu declaración a tiempo para evitar multas adicionales y solicita un plan de pagos al IRS.",
    },
    {
      icon: <Clock className="w-5 h-5 text-red-600" />,
      question: "¿Qué sucede si presento mis impuestos tarde?",
      answer:
        "Si presentas tus impuestos tarde y debes dinero, podrías enfrentar multas e intereses. Si esperas un reembolso, no hay multa, pero es mejor presentarlos pronto.",
    },
    {
      icon: <FileSearch className="w-5 h-5 text-red-600" />,
      question: "¿Cómo encontrar tu número de ruta?",
      answer:
        "Puedes encontrar tu número de ruta en la parte inferior de tus cheques o accediendo a tu cuenta bancaria en línea.",
    },
    {
      icon: <Landmark className="w-5 h-5 text-red-600" />,
      question: "¿Cómo saber si mi cuenta es Checking o Savings?",
      answer:
        "Tu cuenta puede ser identificada como Checking (Corriente) o Savings (Ahorros) en los detalles de tu cuenta bancaria en línea o en tus estados de cuenta.",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-red-600" />,
      question: "¿Puedo usar tarjetas de crédito para el pago?",
      answer:
        "Sí, aceptamos pagos mediante tarjetas de crédito. Selecciona la opción al momento de realizar el pago.",
    },
    {
      icon: <PhoneCall className="w-5 h-5 text-red-600" />,
      question: "¿Qué hacer si tengo problemas al iniciar sesión?",
      answer:
        "Contáctanos a través de nuestro soporte telefónico o correo electrónico para ayudarte.",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      question: "¿Dónde puedo encontrar más información?",
      answer:
        "Visita nuestra página de preguntas frecuentes o contáctanos para más detalles.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-red-600" />,
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos transferencias bancarias tanto en bancos de República Dominicana como de Estados Unidos. También puedes realizar pagos mediante Zelle y PayPal. El pago se realiza cuando el IRS deposita tu reembolso Federal.",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      question: "¿Qué es el reembolso Federal?",
      answer:
        "El reembolso Federal es el dinero que el IRS te devuelve si pagaste más impuestos de los que debías durante el año fiscal. Esto incluye retenciones de tu salario o créditos fiscales aplicables.",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      question: "¿Qué es el reembolso Estatal?",
      answer:
        "El reembolso Estatal es similar al reembolso Federal, pero corresponde a los impuestos que pagaste en tu estado de residencia. Solo aplica si tu estado tiene impuestos sobre la renta y realizaste un pago en exceso.",
    },
    {
      icon: <FileSearch className="w-5 h-5 text-red-600" />,
      question: "¿Cuánto me va a devolver el IRS?",
      answer:
        "El monto que el IRS te devolverá depende de tu situación fiscal. Para estudiantes J1, generalmente solo reciben una parte del reembolso Federal, y algunos estados no ofrecen reembolsos estatales. Cada caso es único y se analiza durante el proceso de declaración. El monto total te será notificado a través de WhatsApp una vez finalicemos tu declaración de impuestos.",
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      question:
        "¿Qué pasa si han pasado más de 21 días desde que la IRS aceptó mi declaración y aún no ponen fecha de depósito?",
      answer: (
        <span>
          En la mayoría de los casos, si han pasado más de 3 semanas, es porque
          la IRS necesita verificar tu identidad. Generalmente, envían una carta
          con instrucciones específicas para hacerlo. Puedes encontrar más
          información en el sitio oficial del IRS haciendo clic en{" "}
          <a
            href="https://www.irs.gov/es/identity-theft-fraud-scams/identity-and-tax-return-verification-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            este enlace.
          </a>{" "}
          Una vez que recibas la carta, debes informarnos para que podamos
          ayudarte con el proceso de verificación. Este se realiza mediante una
          videollamada con un agente de la IRS, donde solo necesitas responder
          algunas preguntas personales. Después de completar la verificación, la
          IRS puede tardar hasta 90 días en asignar una fecha de depósito.
        </span>
      ),
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    // Función para eliminar diacríticos (acentos)
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    // Normalizamos tanto la pregunta como el término de búsqueda
    return normalizeText(faq.question).includes(normalizeText(searchTerm));
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Mejorado */}
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
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Precios
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
                  navigate("/pricing");
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 text-left"
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Precios
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
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sección de Login */}
          <div className="flex-1 w-full lg:w-1/2">
            {/* Banner de Bienvenida */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                ¡Bienvenido a Taxes247!
              </h2>
              <p className="text-red-100">
                Simplifica y asegura tu proceso de declaración de impuestos con
                nuestra plataforma. Gestiona tus solicitudes de manera fácil y
                eficiente.
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-b-xl shadow-lg p-8">
              <form onSubmit={handleLogin} className="space-y-6">
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
                      className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isEmailLoading} // Cambiado de isLoading a isEmailLoading
                >
                  {isEmailLoading ? ( // Cambiado de isLoading a isEmailLoading
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    <>
                      Iniciar Sesión
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      O continúa con
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={isGoogleLoading} // Cambiado de isLoading a isGoogleLoading
                >
                  {isGoogleLoading ? ( // Cambiado de isLoading a isGoogleLoading
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
                </button>

                <div className="space-y-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  <div className="text-sm">
                    ¿No tienes una cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-red-600" />
                Preguntas Frecuentes
              </h3>
              {/* Barra de búsqueda */}
              <div className="relative mb-6">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Buscar preguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <summary className="flex items-center gap-3 p-4 font-medium cursor-pointer list-none">
                        {faq.icon}
                        {faq.question}
                        <ChevronRight className="w-5 h-5 ml-auto transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No se encontraron preguntas relacionadas.
                  </p>
                )}
              </div>

              <div className="mt-6 p-4 bg-red-50 rounded-lg">
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
        </div>
      </main>
    </div>
  );
};

export default Login;
