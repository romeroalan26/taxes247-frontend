import React, { useState } from "react";
import { X } from "lucide-react";
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

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${
          isDarkMode ? "bg-gray-800 " : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="bg-gray-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              Solicitud #{request.confirmationNumber}
            </h3>
            <p className="text-sm text-red-100">{request.fullName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "details", label: "Detalles" },
              { id: "status", label: "Actualizar Estado" },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div>
                <h4
                  className={`text-sm font-medium  mb-4 ${
                    isDarkMode ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  Información Personal
                </h4>
                <dl className="space-y-2">
                  {[
                    { label: "Nombre Completo", value: request.fullName },
                    { label: "Email", value: request.email },
                    { label: "Teléfono", value: request.phone },
                    { label: "Dirección", value: request.address },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className={`text-sm font-medium text-gray-500`}>
                        {item.label}
                      </dt>
                      <dd
                        className={`mt-1 text-sm text-gray-900 ${
                          isDarkMode ? " text-gray-100" : " text-gray-500"
                        }`}
                      >
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Información Bancaria */}
              <div>
                <h4
                  className={`text-sm font-medium  mb-4 ${
                    isDarkMode ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  Información Bancaria
                </h4>
                <dl className="space-y-2">
                  {[
                    { label: "Banco", value: request.bankName },
                    { label: "Tipo de Cuenta", value: request.accountType },
                    {
                      label: "Número de Cuenta",
                      value: `****${request.accountNumber.slice(-4)}`,
                    },
                    {
                      label: "Número de Ruta",
                      value: `****${request.routingNumber.slice(-4)}`,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-sm font-medium text-gray-500">
                        {item.label}
                      </dt>
                      <dd
                        className={`mt-1 text-sm text-gray-900 ${
                          isDarkMode ? " text-gray-100" : " text-gray-500"
                        }`}
                      >
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <StatusUpdateForm
              requestId={request._id}
              isDarkMode={isDarkMode}
              currentStatus={request.status}
              onUpdate={onUpdateStatus}
              statusSteps={statusSteps}
              onClose={() => setActiveTab("details")}
            />
          )}

          {activeTab === "notes" && (
            <AdminNotes
              isDarkMode={isDarkMode}
              requestId={request._id}
              notes={request.adminNotes}
              onNoteAdded={(newNote) => {
                // Aquí deberías implementar la lógica para actualizar las notas
                console.log("Nueva nota añadida:", newNote);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
