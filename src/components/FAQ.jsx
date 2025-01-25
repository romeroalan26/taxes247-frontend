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
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalizeText(faq.question).includes(normalizeText(searchTerm));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Taxes247</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-red-600" />
            Preguntas Frecuentes
          </h3>
          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Lista de FAQs */}
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
                  <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
                </details>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No se encontraron preguntas relacionadas.
              </p>
            )}
          </div>

          {/* Banner de contacto */}
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
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
      </main>
    </div>
  );
};

export default FAQ;
