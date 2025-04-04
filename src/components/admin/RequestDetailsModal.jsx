import React, { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileText,
  Plus,
  Calendar,
} from "lucide-react";
import StatusUpdateForm from "./forms/StatusUpdateForm";
import AdminNotes from "./forms/AdminNotes";

const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  statusSteps,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showSensitiveData, setShowSensitiveData] = useState({
    ssn: false,
    accountNumber: false,
    routingNumber: false,
  });
  const [copiedField, setCopiedField] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!isOpen || !request) return null;

  const toggleSensitiveData = (field) => {
    setShowSensitiveData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  // Función para mostrar datos sensibles con opción de revelar y copiar
  const renderSensitiveData = (value, field, label) => {
    return (
      <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <span className={isDarkMode ? "text-gray-100" : "text-gray-500"}>
            {showSensitiveData[field] ? value : `****${value.slice(-4)}`}
          </span>
          <button
            onClick={() => toggleSensitiveData(field)}
            className="text-blue-500 hover:text-blue-600"
          >
            {showSensitiveData[field] ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <button
          onClick={() => copyToClipboard(value, field)}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? "hover:bg-gray-600 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          {copiedField === field ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  };

  // Función para renderizar campos con botón de copia
  const renderCopyableField = (value, field, label) => {
    return (
      <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
        <span className={isDarkMode ? "text-gray-100" : "text-gray-900"}>
          {value}
        </span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? "hover:bg-gray-600 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          {copiedField === field ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={`relative rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 my-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-5 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-xl ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <FileText
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      #{request.confirmationNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {request.fullName}
                    </p>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      •
                    </span>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl hover:bg-opacity-80 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <nav className="flex -mb-px">
              {[
                { id: "details", label: "Detalles" },
                { id: "status", label: "Actualizar Estado" },
                { id: "history", label: "Historia" },
                { id: "notes", label: "Notas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : `border-transparent ${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                        } hover:border-gray-300`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información de la Solicitud */}
                <div className="lg:col-span-1">
                  <h4
                    className={`text-lg font-medium mb-4 ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Información de la Solicitud
                  </h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Estado Actual
                      </dt>
                      <dd
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {request.status}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tipo de Servicio
                      </dt>
                      <dd
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {request.serviceLevel === "standard"
                          ? "Estándar"
                          : "Premium"}{" "}
                        - ${request.price}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Método de Pago
                      </dt>
                      <dd
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {request.paymentMethod}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Fecha de Creación
                      </dt>
                      <dd
                        className={`mt-1 text-sm ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {new Date(request.createdAt).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Información Personal y Bancaria */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Personal */}
                    <div>
                      <h4
                        className={`text-lg font-medium mb-4 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Información Personal
                      </h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            SSN
                          </dt>
                          <dd className="mt-1">
                            {renderSensitiveData(request.ssn, "ssn", "SSN")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Fecha de Nacimiento
                          </dt>
                          <dd className="mt-1">
                            {renderCopyableField(
                              request.birthDate
                                ? new Date(
                                    request.birthDate
                                  ).toLocaleDateString("en-EN", {
                                    timeZone: "UTC",
                                  })
                                : "Fecha no disponible",
                              "birthDate",
                              "Fecha de Nacimiento"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Nombre Completo
                          </dt>
                          <dd className="mt-1">
                            {renderCopyableField(
                              request.fullName,
                              "fullName",
                              "Nombre Completo"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="mt-1">
                            {renderCopyableField(
                              request.email,
                              "email",
                              "Email"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Teléfono
                          </dt>
                          <dd className="mt-1">
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                              <a
                                href={`https://wa.me/1${request.phone.replace(
                                  /\D/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                              >
                                {request.phone}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.869.518 3.615 1.412 5.118l-1.412 4.879 4.879-1.412c1.503.894 3.249 1.412 5.118 1.412 5.522 0 9.999-4.477 9.999-9.999s-4.477-9.997-9.997-9.997zm0 18.175c-1.784 0-3.451-.481-4.887-1.318l-3.418.989 .989-3.418c-.836-1.436-1.318-3.103-1.318-4.887 0-4.535 3.679-8.214 8.214-8.214s8.214 3.679 8.214 8.214-3.679 8.214-8.214 8.214zm4.636-6.062c-.249-.124-1.472-.726-1.7-.809-.228-.083-.394-.124-.56.124-.166.249-.642.809-.787.973-.145.164-.29.186-.539.062-.249-.124-1.051-.387-2.001-1.234-.74-.661-1.24-1.475-1.385-1.724-.145-.249-.015-.384 .109-.507.111-.111 .249-.29 .373-.436.124-.145 .166-.249 .249-.415.083-.166 .041-.31-.021-.435s-.56-1.345-.766-1.842c-.202-.483-.407-.417-.560-.425-.145-.007-.310-.009-.476-.009s-.435 .062-.663 .31c-.228 .249-.871 .852-.871 2.076 0 1.224 .89 2.407 1.014 2.573.124 .166 1.775 2.706 4.301 3.792.601 .259 1.07 .413 1.436 .529.603 .192 1.153 .164 1.587 .099.484-.072 1.472-.602 1.679-1.183.207-.581 .207-1.079 .145-1.183-.062-.104-.228-.166-.477-.29z" />
                                </svg>
                              </a>
                              <button
                                onClick={() =>
                                  copyToClipboard(request.phone, "phone")
                                }
                                className={`p-1.5 rounded-lg transition-all duration-200 ${
                                  isDarkMode
                                    ? "hover:bg-gray-600 text-gray-400 hover:text-gray-200"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                {copiedField === "phone" ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Dirección
                          </dt>
                          <dd
                            className={`mt-1 text-sm ${
                              isDarkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {request.address}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Información Bancaria */}
                    <div>
                      <h4
                        className={`text-lg font-medium mb-4 ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        Información Bancaria
                      </h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Banco
                          </dt>
                          <dd className="mt-1">
                            {renderCopyableField(
                              request.bankName,
                              "bankName",
                              "Banco"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Tipo de Cuenta
                          </dt>
                          <dd className="mt-1">
                            {renderCopyableField(
                              request.accountType,
                              "accountType",
                              "Tipo de Cuenta"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Número de Cuenta
                          </dt>
                          <dd className="mt-1">
                            {renderSensitiveData(
                              request.accountNumber,
                              "accountNumber",
                              "Número de Cuenta"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Número de Ruta
                          </dt>
                          <dd className="mt-1">
                            {renderSensitiveData(
                              request.routingNumber,
                              "routingNumber",
                              "Número de Ruta"
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Archivos */}
                <div className="lg:col-span-3">
                  <h4
                    className={`text-lg font-medium mb-4 ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Archivos W2
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {request.w2Files.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg border ${
                          isDarkMode
                            ? "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700"
                            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                        } transition-all duration-200 flex items-center gap-2`}
                      >
                        <FileText
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Archivo W2 #{index + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "status" && (
              <StatusUpdateForm
                requestId={request._id}
                currentStatus={request.status}
                onUpdate={onUpdateStatus}
                statusSteps={statusSteps}
                onClose={() => setActiveTab("details")}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Historial de Cambios
                  </h3>
                </div>

                <div className="space-y-4">
                  {request?.statusHistory?.map((status, index) => (
                    <div
                      key={index}
                      className={`relative pl-6 pb-4 ${
                        index !== request.statusHistory.length - 1
                          ? "border-l"
                          : ""
                      } ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div
                        className={`absolute left-0 top-0 w-3 h-3 rounded-full ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />

                      <div
                        className={`rounded-xl border ${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-200"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {status.status}
                              </div>
                              <span
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {new Date(status.date).toLocaleString()}
                              </span>
                            </div>
                            {status.paymentDate && (
                              <div
                                className={`flex items-center gap-1.5 text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  Pago:{" "}
                                  {new Date(
                                    status.paymentDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {status.comment && (
                            <div
                              className={`mt-2 text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {status.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <AdminNotes
                requestId={request._id}
                notes={request.adminNotes}
                onNoteAdded={(newNote) => {}}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
