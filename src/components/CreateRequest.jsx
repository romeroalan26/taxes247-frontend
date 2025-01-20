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

const CreateRequest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    ssn: "",
    birthDate: "",
    fullName: "",
    email: "",
    phone: "",
    accountNumber: "",
    bankName: "",
    accountType: "",
    routingNumber: "",
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
    const formattedValue = name === "ssn" ? formatSSN(value) : value;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateSSN(formData.ssn)) {
      setError(
        "Por favor, ingresa un número de Social Security válido (XXX-XX-XXXX)."
      );
      return;
    }

    if (!validateRoutingNumber(formData.routingNumber)) {
      setError("El número de ruta debe tener entre 9 y 12 dígitos."); // Mensaje actualizado
      return;
    }

    if (!validateAccountNumber(formData.accountNumber)) {
      setError("El número de cuenta debe tener entre 5 y 17 dígitos.");
      return;
    }

    if (!selectedPlan) {
      setError("Por favor selecciona un plan antes de continuar.");
      return;
    }

    if (!userId) {
      setError(
        "No se puede enviar la solicitud. Por favor, vuelve a iniciar sesión."
      );
      return;
    }

    if (w2Files.length === 0) {
      setError("Por favor, sube al menos un archivo W2.");
      return;
    }

    if (
      !(w2Files.length > 0 && w2Files.every((file) => file instanceof File))
    ) {
      setError("Archivos W2 no válidos. Intenta de nuevo.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const formDataPayload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataPayload.append(key, value);
      });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Nueva Solicitud
              </h1>
            </div>
            {selectedPlan && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Personal */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 text-red-600 mr-2" />
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SSN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Social Security
                    </label>
                    <div className="relative">
                      <input
                        type={showSensitiveFields.ssn ? "text" : "password"}
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                        placeholder="123-45-6789"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => toggleFieldVisibility("ssn")}
                      >
                        {showSensitiveFields.ssn ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Nombre Completo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="809-555-1234"
                        required
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección en USA
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="123 Main St, Anytown, CA"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Bancaria */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Building className="h-5 w-5 text-red-600 mr-2" />
                  Información Bancaria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre del Banco */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Banco
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Bank of America"
                        required
                      />
                    </div>
                  </div>

                  {/* Tipo de Cuenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Cuenta
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                        required
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="Savings">Savings</option>
                        <option value="Checking">Checking</option>
                      </select>
                    </div>
                  </div>

                  {/* Número de Cuenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Cuenta
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showSensitiveFields.accountNumber
                            ? "text"
                            : "password"
                        }
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleNumericInput(e, 17)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                        placeholder="123456789"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => toggleFieldVisibility("accountNumber")}
                      >
                        {showSensitiveFields.accountNumber ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Número de Ruta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Ruta
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showSensitiveFields.routingNumber
                            ? "text"
                            : "password"
                        }
                        name="routingNumber"
                        value={formData.routingNumber}
                        onChange={(e) => handleNumericInput(e, 12)} // Modificado para permitir hasta 12 dígitos
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                        placeholder="123456789"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => toggleFieldVisibility("routingNumber")}
                      >
                        {showSensitiveFields.routingNumber ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <Link
                        to="/routing-number"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        ¿Cómo encontrar este número?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentos y Pago */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 text-red-600 mr-2" />
                  Documentos y Método de Pago
                </h2>
                <div className="space-y-6">
                  {/* Método de Pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de Pago
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
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
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-red-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer"
                            >
                              <span className="rounded-md font-medium text-red-600 hover:text-red-500">
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
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600 truncate max-w-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
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
              </div>

              {/* Mensaje de Error General */}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Botón de Enviar */}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader size={24} color="#ffffff" />
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Modal de Confirmación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full m-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¡Solicitud enviada!
                </h3>
                <p className="text-gray-600 mb-6">
                  Tu solicitud se ha enviado correctamente. Hemos enviado un
                  correo electrónico con tu número de confirmación.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">
                    Número de Confirmación
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    {confirmationNumber}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full inline-flex justify-center items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Ir al Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateRequest;
