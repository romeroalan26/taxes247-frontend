import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  ChevronRight,
  BellRing,
  Search,
  FileQuestion,
  Calendar,
  Clock,
  DollarSign,
  FileSearch,
  Landmark,
  CreditCard,
  PhoneCall,
  AlertCircle,
  FileText,
} from "lucide-react";

const FAQ = () => {
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
        "¿Cuándo inicia el proceso de declaración de impuestos del 2025?",
      answer:
        "El proceso de declaración de impuestos para el año fiscal 2024 comienza el 29 de enero de 2025, según el calendario oficial del IRS.",
    },
    {
      icon: <Clock className="w-5 h-5 text-red-600" />,
      question:
        "¿Cuál es la fecha límite para presentar mi declaración de impuestos?",
      answer:
        "La fecha límite para presentar tu declaración de impuestos en 2025 es el 15 de abril. Asegúrate de enviarla antes para evitar penalidades.",
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
        "Debes reunir formularios W-2, identificación personal, información bancaria y cualquier otra documentación relacionada con ingresos y deducciones.",
    },
    {
      icon: <BellRing className="w-5 h-5 text-red-600" />,
      question:
        "¿Qué pasa si presento mi declaración después de la fecha límite?",
      answer:
        "Si presentas tu declaración después del 15 de abril sin haber solicitado una extensión, podrías enfrentar multas e intereses sobre los impuestos no pagados.",
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
      icon: <PhoneCall className="w-5 h-5 text-red-600" />,
      question: "¿Qué hacer si tengo problemas al iniciar sesión?",
      answer:
        "Contáctanos a través de WhatsApp al 809-403-9726 o correo electrónico taxes247.help@gmail.com para ayudarte.",
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
        "El monto que el IRS te devolverá depende de tu situación fiscal. Para estudiantes J1, generalmente solo reciben una parte del reembolso Federal, dejando fuera el Social Security y el Medicare, por ejemplo. Algunos estados no ofrecen reembolsos estatales. Cada caso es único y se analiza durante el proceso de declaración. El monto total te será notificado a través de WhatsApp una vez finalicemos tu declaración de impuestos.",
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
    {
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      question: "¿Cómo funciona el proceso de verificación de identidad?",
      answer:
        "El proceso de verificación de identidad asegura que seas quien dices ser antes de acceder a servicios o procesar declaraciones de impuestos. Se requiere una identificación oficial y, en algunos casos, completar pasos adicionales como una selfie o una videollamada.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalizeText(faq.question).includes(normalizeText(searchTerm));
  });

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
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            Preguntas Frecuentes
          </h3>
          {/* Barra de búsqueda */}
          <div className="relative mb-4 sm:mb-6">
            <input
              type="text"
              className="w-full px-4 py-2.5 sm:py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-3 sm:space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <summary className="flex items-center gap-3 p-4 font-medium cursor-pointer list-none">
                    {faq.icon}
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronRight className="w-5 h-5 ml-auto transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-4 pb-4 text-sm sm:text-base text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                No se encontraron preguntas relacionadas.
              </p>
            )}
          </div>

          {/* Banner de contacto */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-50 rounded-xl">
            <div className="flex items-start gap-3">
              <BellRing className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-red-900 text-sm sm:text-base">
                  ¿Necesitas más ayuda?
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  Nuestro equipo está disponible para responder todas tus
                  preguntas.
                  <a
                    href="https://wa.me/18094039726"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                  >
                    Contactar soporte →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
