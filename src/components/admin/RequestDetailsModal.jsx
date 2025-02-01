import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
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

  if (!isOpen || !request) return null;

  const toggleSensitiveData = (field) => {
    setShowSensitiveData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Función para mostrar datos sensibles con opción de revelar
  const renderSensitiveData = (value, field) => {
    return (
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
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="bg-gray-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              Solicitud #{request.confirmationNumber}
            </h3>
            <p className="text-sm text-gray-200">
              {request.fullName} - {request.status}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "details", label: "Detalles" },
              { id: "status", label: "Actualizar Estado" },
              { id: "history", label: "Historial" },
              { id: "notes", label: "Notas" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : `border-transparent ${
                        isDarkMode ? "text-gray-200" : "text-gray-500"
                      } hover:text-gray-700 hover:border-gray-300`
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información de la Solicitud */}
              <div>
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
                    <dt className="text-sm font-medium text-gray-500">SSN</dt>
                    <dd className="mt-1 text-sm">
                      {renderSensitiveData(request.ssn, "ssn")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Fecha de Nacimiento
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.birthDate
                        ? new Date(request.birthDate).toLocaleDateString(
                            "en-EN",
                            { timeZone: "UTC" }
                          )
                        : "Fecha no disponible"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Nombre Completo
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.email}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Teléfono
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
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
                          <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.869.518 3.615 1.412 5.118l-1.412 4.879 4.879-1.412c1.503.894 3.249 1.412 5.118 1.412 5.522 0 9.999-4.477 9.999-9.999s-4.477-9.997-9.997-9.997zm0 18.175c-1.784 0-3.451-.481-4.887-1.318l-3.418.989 .989-3.418c-.836-1.436-1.318-3.103-1.318-4.887 0-4.535 3.679-8.214 8.214-8.214s8.214 3.679 8.214 8.214-3.679 8.214-8.214 8.214zm4.636-6.062c-.249-.124-1.472-.726-1.7-.809-.228-.083-.394-.124-.56.124-.166.249-.642.809-.787.973-.145.164-.29.186-.539.062-.249-.124-1.051-.387-2.001-1.234-.74-.661-1.24-1.475-1.385-1.724-.145-.249-.015-.384 .109-.507.111-.111 .249-.29 .373-.436.124-.145 .166-.249 .249-.415.083-.166 .041-.31-.021-.435s-.56-1.345-.766-1.842c-.202-.483-.407-.417-.56-.425-.145-.007-.31-.009-.476-.009s-.435 .062-.663 .31c-.228 .249-.871 .852-.871 2.076 0 1.224 .89 2.407 1.014 2.573.124 .166 1.775 2.706 4.301 3.792.601 .259 1.07.413 1.436.529.603 .192 1.153.164 1.587.099.484-.072 1.472-.602 1.679-1.183.207-.581 .207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z" />
                        </svg>
                      </a>
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
                    <dt className="text-sm font-medium text-gray-500">Banco</dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.bankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Tipo de Cuenta
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.accountType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Número de Cuenta
                    </dt>
                    <dd className="mt-1 text-sm">
                      {renderSensitiveData(
                        request.accountNumber,
                        "accountNumber"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Número de Ruta
                    </dt>
                    <dd className="mt-1 text-sm">
                      {renderSensitiveData(
                        request.routingNumber,
                        "routingNumber"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Archivos */}
              <div>
                <h4
                  className={`text-lg font-medium mb-4 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Archivos W2
                </h4>
                <ul className="space-y-2">
                  {request.w2Files.map((file, index) => (
                    <li key={index}>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Archivo W2 #{index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
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
            <div className="space-y-4">
              {request.statusHistory.map((entry, index) => (
                <div
                  key={index}
                  className="border-l-4 border-gray-500 pl-4 py-2"
                >
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {entry.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleString()}
                  </div>
                  <div
                    className={`mt-1 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {entry.description}
                  </div>
                  {entry.comment && (
                    <div
                      className={`mt-2 text-sm p-2 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">Comentario: </span>
                      {entry.comment}
                    </div>
                  )}
                </div>
              ))}
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
  );
};

export default RequestDetailsModal;
