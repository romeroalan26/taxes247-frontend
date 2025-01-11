import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { ClipLoader } from "react-spinners";
import PricingModal from "./PricingModal";
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
  DollarSign
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
    w2Files: [],
    serviceLevel: "",
    price: null,
    estimatedBonus: null,
  });

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
  const [showPricingModal, setShowPricingModal] = useState(true); // Mostrar el modal al inicio
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.uid) {
      setUserId(user.uid);
      setFormData((prev) => ({ ...prev, email: user.email })); // Asignar correo electrónico automáticamente
    } else {
      setError("No estás autenticado. Redirigiendo...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Solo puedes subir hasta 3 archivos.");
      return;
    }
    setFormData((prev) => ({ ...prev, w2Files: files }));
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
      estimatedBonus: serviceLevel === "premium" ? 900 : 0, // Asignar bono si es premium
    }));
    setSelectedPlan({ serviceLevel, price });
    setShowPricingModal(false); // Cerrar el modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    if (!selectedPlan) {
      setError("Por favor selecciona un plan antes de continuar.");
      setIsLoading(false);
      return;
    }
  
    if (!userId) {
      setError("No se puede enviar la solicitud. Por favor, vuelve a iniciar sesión.");
      console.error("User ID no está disponible.");
      setIsLoading(false);
      return;
    }
  
    const initialStatus = "Recibido";
  
    try {
      // Obtener el token actual
      const token = await auth.currentUser.getIdToken();
      
      const formDataPayload = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "w2Files" && value.length > 0) {
          value.forEach((file) => formDataPayload.append("w2Files", file));
        } else {
          formDataPayload.append(key, value);
        }
      });
  
      formDataPayload.append("userId", userId);
      formDataPayload.append("status", initialStatus);
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataPayload,
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("requests");
        setConfirmationNumber(data.confirmationNumber);
        setIsModalOpen(true);
      } else {
        const errorResponse = await response.json();
        
        // Si hay error de autorización, redirigir al login
        if (response.status === 401 || response.status === 403) {
          navigate("/");
          return;
        }
        
        throw new Error(errorResponse.message || "Error al guardar la solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError(error.message || "Hubo un problema al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // En el modal de confirmación
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-center mb-4">
          ¡Solicitud enviada!
        </h3>
        <p className="text-gray-700 text-center mb-4">
          Tu solicitud se ha enviado correctamente. Hemos enviado un correo
          electrónico con tu número de confirmación.
        </p>
        <p className="text-xl font-bold text-red-600 text-center mb-6">
          Número de Confirmación: {confirmationNumber}
        </p>
        <button
          onClick={() => {
            // Limpiar el caché antes de navegar
            localStorage.removeItem("requests");
            navigate("/dashboard");
          }}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          Aceptar
        </button>
      </div>
    </div>
  )}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno */}
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
              <h1 className="text-xl font-semibold text-gray-900">Nueva Solicitud</h1>
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
            {/* Secciones del formulario */}
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
                        type={showSensitiveFields.accountNumber ? "text" : "password"}
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
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
                        type={showSensitiveFields.routingNumber ? "text" : "password"}
                        name="routingNumber"
                        value={formData.routingNumber}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                        placeholder="987654321"
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
                        <option value="PayPal">PayPal</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                      </select>
                    </div>
                  </div>

                  {/* Archivos W2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivos W2 (Máximo 3)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-red-500 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer">
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
                            />
                          </label>
                          <p className="pl-1">o arrastra y suelta aquí</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF hasta 10MB</p>
                        {formData.w2Files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              {formData.w2Files.length} archivo(s) seleccionado(s)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de Error */}
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
                  Tu solicitud se ha enviado correctamente. Hemos enviado un correo
                  electrónico con tu número de confirmación.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Número de Confirmación</p>
                  <p className="text-xl font-bold text-red-600">{confirmationNumber}</p>
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