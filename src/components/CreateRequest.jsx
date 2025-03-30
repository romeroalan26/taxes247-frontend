import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { ClipLoader } from "react-spinners";
import PricingModal from "./PricingModal";
import RoutingNumber from "./RoutingNumber";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
  Building,
  CreditCard,
  Wallet,
  FileText,
  DollarSign,
  X,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const statusSteps = [
  "Pendiente de pago",
  "Pago recibido",
  "En revisión",
  "Documentación incompleta",
  "En proceso con el IRS",
  "Aprobada",
  "Completada",
  "Rechazada",
];

const steps = [
  {
    id: 1,
    title: "Información Personal",
    description: "Datos básicos y de contacto",
    icon: User,
  },
  {
    id: 2,
    title: "Información Bancaria",
    description: "Datos de tu cuenta bancaria",
    icon: Building,
  },
  {
    id: 3,
    title: "Documentos y Pago",
    description: "Sube tus W2 y método de pago",
    icon: FileText,
  },
];

const CreateRequest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ssn: "",
    birthDate: "",
    fullName: "",
    email: "",
    phone: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    accountType: "",
    routingNumber: "",
    confirmRoutingNumber: "",
    address: "",
    requestType: "Estándar",
    paymentMethod: "",
    serviceLevel: "",
    price: null,
    estimatedBonus: null,
  });

  const [w2Files, setW2Files] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSensitiveFields, setShowSensitiveFields] = useState({
    ssn: false,
    accountNumber: false,
    routingNumber: false,
  });
  const [showPricingModal, setShowPricingModal] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    accountNumber: "",
    confirmAccountNumber: "",
    routingNumber: "",
    confirmRoutingNumber: "",
    ssn: "",
    birthDate: "",
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.uid) {
      setUserId(user.uid);
      setFormData((prev) => ({ ...prev, email: user.email }));
    } else {
      setError("No estás autenticado. Redirigiendo...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  const formatSSN = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 5)
      return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;
    return `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(
      3,
      5
    )}-${onlyNumbers.slice(5, 9)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar límites de caracteres según el campo
    switch (name) {
      case "ssn":
        formattedValue = formatSSN(value);
        break;
      case "fullName":
        formattedValue = value.slice(0, 100); // Máximo 100 caracteres
        break;
      case "phone":
        formattedValue = value.slice(0, 20); // Máximo 20 caracteres
        break;
      case "address":
        formattedValue = value.slice(0, 200); // Máximo 200 caracteres
        break;
      case "bankName":
        formattedValue = value.slice(0, 100); // Máximo 100 caracteres
        break;
      case "accountNumber":
        formattedValue = value.slice(0, 17); // Máximo 17 dígitos
        break;
      case "confirmAccountNumber":
        formattedValue = value.slice(0, 17); // Máximo 17 dígitos
        break;
      case "routingNumber":
        formattedValue = value.slice(0, 12); // Máximo 12 dígitos
        break;
      case "confirmRoutingNumber":
        formattedValue = value.slice(0, 12); // Máximo 12 dígitos
        break;
      default:
        formattedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const errors = [];

    if (w2Files.length + newFiles.length > 5) {
      setFileErrors(["Solo puedes subir hasta 5 archivos W2."]);
      return;
    }

    newFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} excede el límite de 10MB`);
      }
      if (file.type !== "application/pdf") {
        errors.push(`${file.name} debe ser un archivo PDF`);
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    setW2Files((prevFiles) => [...prevFiles, ...newFiles]);
    setFileErrors([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    setW2Files((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleFieldVisibility = (field) => {
    setShowSensitiveFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePlanSelection = (serviceLevel, price) => {
    setFormData((prev) => ({
      ...prev,
      serviceLevel,
      price,
      estimatedBonus: serviceLevel === "premium" ? 900 : 0,
    }));
    setSelectedPlan({ serviceLevel, price });
    setShowPricingModal(false);
  };

  const validateSSN = (value) => {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(value);
  };

  const validateRoutingNumber = (value) => {
    return /^\d{9,12}$/.test(value); // Modificado para aceptar entre 9 y 12 dígitos
  };

  const validateAccountNumber = (value) => {
    return /^\d{5,17}$/.test(value);
  };

  const handleNumericInput = (e, maxLength) => {
    const { name, value } = e.target;

    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAccountNumberBlur = (e) => {
    const { value } = e.target;
    if (value && !validateAccountNumber(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        accountNumber: "El número de cuenta debe tener entre 5 y 17 dígitos.",
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        accountNumber: "",
      }));
    }
  };

  const handleRoutingNumberBlur = (e) => {
    const { value } = e.target;
    if (value && !validateRoutingNumber(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        routingNumber: "El número de ruta debe tener entre 9 y 12 dígitos.",
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        routingNumber: "",
      }));
    }
  };

  const handleConfirmBlur = (e) => {
    const { name, value } = e.target;

    // Validación para números de cuenta
    if (name === "confirmAccountNumber") {
      if (value && formData.accountNumber) {
        if (value !== formData.accountNumber) {
          setValidationErrors((prev) => ({
            ...prev,
            confirmAccountNumber: "Los números de cuenta no coinciden",
          }));
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            confirmAccountNumber: "",
          }));
        }
      }
    }

    // Validación para números de ruta
    if (name === "confirmRoutingNumber") {
      if (value && formData.routingNumber) {
        if (value !== formData.routingNumber) {
          setValidationErrors((prev) => ({
            ...prev,
            confirmRoutingNumber: "Los números de ruta no coinciden",
          }));
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            confirmRoutingNumber: "",
          }));
        }
      }
    }
  };

  const handleSSNBlur = (e) => {
    const { value } = e.target;
    if (value && !validateSSN(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        ssn: "Por favor, ingresa un número de Social Security válido (XXX-XX-XXXX).",
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        ssn: "",
      }));
    }
  };

  const handleBirthDateBlur = (e) => {
    const { value } = e.target;
    if (!value) {
      setValidationErrors((prev) => ({
        ...prev,
        birthDate: "Por favor, ingresa tu fecha de nacimiento",
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        birthDate: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación completa de todos los campos requeridos
    const requiredFields = {
      ssn: "Número de Social Security",
      birthDate: "Fecha de nacimiento",
      fullName: "Nombre completo",
      phone: "Teléfono",
      address: "Dirección",
      bankName: "Nombre del banco",
      accountType: "Tipo de cuenta",
      accountNumber: "Número de cuenta",
      confirmAccountNumber: "Confirmación de número de cuenta",
      routingNumber: "Número de ruta",
      confirmRoutingNumber: "Confirmación de número de ruta",
      paymentMethod: "Método de pago",
    };

    // Verificar que todos los campos requeridos estén llenos
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        setError(`Por favor, completa el campo: ${label}`);
        return;
      }
    }

    // Validación de SSN
    if (!validateSSN(formData.ssn)) {
      setError(
        "Por favor, ingresa un número de Social Security válido (XXX-XX-XXXX)."
      );
      return;
    }

    // Validación de números de cuenta
    if (!validateAccountNumber(formData.accountNumber)) {
      setError("El número de cuenta debe tener entre 5 y 17 dígitos.");
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Los números de cuenta no coinciden.");
      return;
    }

    // Validación de números de ruta
    if (!validateRoutingNumber(formData.routingNumber)) {
      setError("El número de ruta debe tener entre 9 y 12 dígitos.");
      return;
    }

    if (formData.routingNumber !== formData.confirmRoutingNumber) {
      setError("Los números de ruta no coinciden.");
      return;
    }

    // Validación de archivos
    if (w2Files.length === 0) {
      setError("Por favor, sube al menos un archivo W2.");
      return;
    }

    if (w2Files.length > 5) {
      setError("No puedes subir más de 5 archivos W2.");
      return;
    }

    // Validación de plan seleccionado
    if (!selectedPlan) {
      setError("Por favor selecciona un plan antes de continuar.");
      return;
    }

    // Validación de usuario autenticado
    if (!userId) {
      setError(
        "No se puede enviar la solicitud. Por favor, vuelve a iniciar sesión."
      );
      return;
    }

    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const formDataPayload = new FormData();

      // Agregar todos los campos al FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataPayload.append(key, value);
      });

      // Agregar archivos
      w2Files.forEach((file) => {
        formDataPayload.append("w2Files", file);
      });

      formDataPayload.append("userId", userId);
      formDataPayload.append("status", "Recibido");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataPayload,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("requests");
        setConfirmationNumber(data.confirmationNumber);
        setIsModalOpen(true);
      } else {
        if (response.status === 401 || response.status === 403) {
          navigate("/");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar la solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError(
        error.message ||
          "Hubo un problema al enviar la solicitud. Intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    // Validación del paso actual antes de avanzar
    if (!isStepValid()) {
      return;
    }

    // Validaciones específicas por paso
    switch (currentStep) {
      case 1:
        // Validar SSN
        if (!validateSSN(formData.ssn)) {
          setValidationErrors((prev) => ({
            ...prev,
            ssn: "Por favor, ingresa un número de Social Security válido (XXX-XX-XXXX).",
          }));
          return;
        }
        // Validar fecha de nacimiento
        if (!formData.birthDate) {
          setValidationErrors((prev) => ({
            ...prev,
            birthDate: "Por favor, ingresa tu fecha de nacimiento",
          }));
          return;
        }
        // Validar campos requeridos
        if (!formData.fullName || !formData.phone || !formData.address) {
          setError("Por favor, completa todos los campos requeridos");
          return;
        }
        break;

      case 2:
        // Validar número de cuenta
        if (!validateAccountNumber(formData.accountNumber)) {
          setValidationErrors((prev) => ({
            ...prev,
            accountNumber:
              "El número de cuenta debe tener entre 5 y 17 dígitos.",
          }));
          return;
        }
        // Validar coincidencia de números de cuenta
        if (formData.accountNumber !== formData.confirmAccountNumber) {
          setValidationErrors((prev) => ({
            ...prev,
            confirmAccountNumber: "Los números de cuenta no coinciden",
          }));
          return;
        }
        // Validar número de ruta
        if (!validateRoutingNumber(formData.routingNumber)) {
          setValidationErrors((prev) => ({
            ...prev,
            routingNumber: "El número de ruta debe tener entre 9 y 12 dígitos.",
          }));
          return;
        }
        // Validar coincidencia de números de ruta
        if (formData.routingNumber !== formData.confirmRoutingNumber) {
          setValidationErrors((prev) => ({
            ...prev,
            confirmRoutingNumber: "Los números de ruta no coinciden",
          }));
          return;
        }
        // Validar campos requeridos
        if (!formData.bankName || !formData.accountType) {
          setError("Por favor, completa todos los campos requeridos");
          return;
        }
        break;

      case 3:
        // Validar método de pago
        if (!formData.paymentMethod) {
          setError("Por favor, selecciona un método de pago");
          return;
        }
        // Validar archivos
        if (w2Files.length === 0) {
          setError("Por favor, sube al menos un archivo W2");
          return;
        }
        if (w2Files.length > 5) {
          setError("No puedes subir más de 5 archivos W2");
          return;
        }
        break;
    }

    // Si todas las validaciones pasan, avanzar al siguiente paso
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.ssn &&
          !validationErrors.ssn &&
          formData.birthDate &&
          !validationErrors.birthDate &&
          formData.fullName &&
          formData.phone &&
          formData.address
        );
      case 2:
        return (
          formData.bankName &&
          formData.accountType &&
          formData.accountNumber &&
          !validationErrors.accountNumber &&
          formData.confirmAccountNumber &&
          !validationErrors.confirmAccountNumber &&
          formData.routingNumber &&
          !validationErrors.routingNumber &&
          formData.confirmRoutingNumber &&
          !validationErrors.confirmRoutingNumber
        );
      case 3:
        return (
          formData.paymentMethod && w2Files.length > 0 && !fileErrors.length
        );
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg mr-3">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                Información Personal
              </h2>
              <div className="text-xs text-gray-500">Paso 1 de 3</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SSN */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Social Security
                </label>
                <div className="relative">
                  <input
                    type={showSensitiveFields.ssn ? "text" : "password"}
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleChange}
                    onBlur={handleSSNBlur}
                    className={`block w-full px-3 py-2.5 border ${
                      validationErrors.ssn
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 transition-all duration-200 group-hover:border-red-300`}
                    placeholder="123-45-6789"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors"
                    onClick={() => toggleFieldVisibility("ssn")}
                  >
                    {showSensitiveFields.ssn ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.ssn && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.ssn}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    onBlur={handleBirthDateBlur}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      validationErrors.birthDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-300`}
                    required
                  />
                </div>
                {validationErrors.birthDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.birthDate}
                  </p>
                )}
              </div>

              {/* Nombre Completo */}
              <div className="md:col-span-2 group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    maxLength={100}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-300"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-300"
                    placeholder="809-555-1234"
                    required
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="md:col-span-2 group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección en USA
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      maxLength={200}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-300"
                      placeholder="123 Main St, Anytown, CA"
                      required
                    />
                  </div>
                  <div className="flex items-start space-x-2 bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-red-800">
                        ¡IMPORTANTE! Esta dirección es crucial para tu reembolso
                      </p>
                      <p className="text-sm text-red-700">
                        El IRS podría enviar correspondencia importante a esta
                        dirección. Si no puede ser recibida, podrías perder tu
                        reembolso.
                      </p>
                      <ul className="text-sm text-red-700 mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-red-500" />
                          Usa una dirección de un familiar o persona de
                          confianza
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-red-500" />
                          Asegúrate que puedan recibir y enviarte la
                          correspondencia
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`inline-flex items-center px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isStepValid()
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Siguiente
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg mr-3">
                  <Building className="h-5 w-5 text-red-600" />
                </div>
                Información Bancaria
              </h2>
              <div className="text-xs text-gray-500">Paso 2 de 3</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del Banco */}
              <div className="md:col-span-2 group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Banco
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    maxLength={100}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 group-hover:border-red-300"
                    placeholder="Bank of America"
                    required
                  />
                </div>
              </div>

              {/* Tipo de Cuenta */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cuenta
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all duration-200 group-hover:border-red-300"
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Savings">Savings</option>
                    <option value="Checking">Checking</option>
                  </select>
                </div>
              </div>

              {/* Número de Cuenta y Confirmación */}
              <div className="md:col-span-2 space-y-4">
                {/* Número de Cuenta */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showSensitiveFields.accountNumber ? "text" : "password"
                      }
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleNumericInput(e, 17)}
                      onBlur={handleAccountNumberBlur}
                      className={`block w-full px-3 py-2.5 border ${
                        validationErrors.accountNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 transition-all duration-200 group-hover:border-red-300`}
                      placeholder="123456789"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors"
                      onClick={() => toggleFieldVisibility("accountNumber")}
                    >
                      {showSensitiveFields.accountNumber ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.accountNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.accountNumber}
                    </p>
                  )}
                </div>

                {/* Confirmar Número de Cuenta */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Número de Cuenta
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showSensitiveFields.accountNumber ? "text" : "password"
                      }
                      name="confirmAccountNumber"
                      value={formData.confirmAccountNumber}
                      onChange={(e) => handleNumericInput(e, 17)}
                      onBlur={handleConfirmBlur}
                      disabled={
                        !formData.accountNumber ||
                        validationErrors.accountNumber
                      }
                      className={`block w-full px-3 py-2.5 border ${
                        validationErrors.confirmAccountNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 transition-all duration-200 group-hover:border-red-300 ${
                        !formData.accountNumber ||
                        validationErrors.accountNumber
                          ? "bg-gray-50 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="123456789"
                      required
                    />
                  </div>
                  {validationErrors.confirmAccountNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.confirmAccountNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Número de Ruta y Confirmación */}
              <div className="md:col-span-2 space-y-4">
                {/* Número de Ruta */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Ruta
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showSensitiveFields.routingNumber ? "text" : "password"
                      }
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => handleNumericInput(e, 12)}
                      onBlur={handleRoutingNumberBlur}
                      className={`block w-full px-3 py-2.5 border ${
                        validationErrors.routingNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 transition-all duration-200 group-hover:border-red-300`}
                      placeholder="123456789"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors"
                      onClick={() => toggleFieldVisibility("routingNumber")}
                    >
                      {showSensitiveFields.routingNumber ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.routingNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.routingNumber}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <Link
                      to="/routing-number"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <span>¿Cómo encontrar este número?</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Confirmar Número de Ruta */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Número de Ruta
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showSensitiveFields.routingNumber ? "text" : "password"
                      }
                      name="confirmRoutingNumber"
                      value={formData.confirmRoutingNumber}
                      onChange={(e) => handleNumericInput(e, 12)}
                      onBlur={handleConfirmBlur}
                      disabled={
                        !formData.routingNumber ||
                        validationErrors.routingNumber
                      }
                      className={`block w-full px-3 py-2.5 border ${
                        validationErrors.confirmRoutingNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 transition-all duration-200 group-hover:border-red-300 ${
                        !formData.routingNumber ||
                        validationErrors.routingNumber
                          ? "bg-gray-50 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder="123456789"
                      required
                    />
                  </div>
                  {validationErrors.confirmRoutingNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.confirmRoutingNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`inline-flex items-center px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isStepValid()
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Siguiente
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                Documentos y Método de Pago
              </h2>
              <div className="text-xs text-gray-500">Paso 3 de 3</div>
            </div>
            <div className="space-y-6">
              {/* Método de Pago */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all duration-200 group-hover:border-red-300"
                    required
                  >
                    <option value="">Selecciona un método</option>
                    <option value="Zelle">Zelle</option>
                    <option value="Transferencia bancaria">
                      Transferencia (RD o USA)
                    </option>
                  </select>
                </div>
              </div>

              {/* Archivos W2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivos W2 (Máximo 5)
                </label>
                <div className="mt-1 flex flex-col space-y-4">
                  {/* Área de drop y selección */}
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-500 transition-all duration-200 group">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-red-500 transition-colors" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer"
                        >
                          <span className="rounded-xl font-medium text-red-600 hover:text-red-500">
                            Seleccionar archivos
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept=".pdf"
                            className="sr-only"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF hasta 10MB (Archivos subidos: {w2Files.length}
                        /5)
                      </p>
                    </div>
                  </div>

                  {/* Lista de archivos */}
                  {w2Files.length > 0 && (
                    <div className="space-y-2">
                      {w2Files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 truncate">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200 ml-3 flex-shrink-0"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mensajes de error de archivos */}
                  {fileErrors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fileErrors.map((error, index) => (
                        <p
                          key={index}
                          className="text-sm text-red-600 flex items-center"
                        >
                          <span className="mr-2">•</span>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Anterior
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className={`inline-flex items-center px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isStepValid()
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <ClipLoader size={24} color="#ffffff" />
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-white">Atras</h1>
              </div>
            </div>
            {selectedPlan && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
                <span className="text-sm font-medium text-white">
                  Plan {selectedPlan.serviceLevel} - ${selectedPlan.price}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {showPricingModal && (
        <PricingModal
          onSelect={handlePlanSelection}
          onClose={() => navigate("/dashboard")}
        />
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showPricingModal && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${
                        index === steps.length - 1 ? "" : "flex-1"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                          currentStep >= step.id
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="text-center px-1 sm:px-2">
                        <div
                          className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                            currentStep >= step.id
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`hidden sm:block text-xs ${
                            currentStep >= step.id
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </div>
                        <div
                          className={`sm:hidden text-[10px] ${
                            currentStep >= step.id
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStepContent()}

              {/* Mensaje de Error General */}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Modal de Confirmación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all animate-fade-in">
              <div className="text-center">
                {/* Icono de éxito animado */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 bg-green-50 rounded-full animate-ping opacity-20"></div>
                  </div>
                </div>

                {/* Título y mensaje */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  ¡Solicitud enviada!
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Tu solicitud se ha enviado correctamente. Hemos enviado un
                  correo electrónico con tu número de confirmación.
                </p>

                {/* Número de confirmación */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 mb-6 border border-red-100">
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    Número de Confirmación
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    {confirmationNumber}
                  </p>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Ir al Dashboard
                </button>

                {/* Mensaje adicional */}
                <p className="mt-4 text-xs text-gray-500">
                  Guarda este número para dar seguimiento a tu solicitud
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateRequest;
