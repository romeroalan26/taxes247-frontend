// src/components/admin/RequestDetailsModal.jsx
import React, { useState } from "react";
import {
  X,
  Save,
  MessageSquare,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import { ClipLoader } from "react-spinners";

const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  statusSteps,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'history', 'notes'
  const [newStatus, setNewStatus] = useState(request?.status || "");
  const [statusComment, setStatusComment] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [newNote, setNewNote] = useState("");

  if (!isOpen || !request) return null;

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      await onUpdateStatus({
        status: newStatus,
        comment: statusComment,
        paymentDate: newStatus === "Pago programado" ? paymentDate : undefined,
      });
      setStatusComment("");
      setPaymentDate("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
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
            <button
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "details"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Detalles
            </button>
            <button
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "history"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Historial
            </button>
            <button
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "notes"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              Notas
            </button>
          </nav>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">
                    Información Personal
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Nombre Completo
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.fullName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Teléfono
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Dirección
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.address}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">
                    Información Bancaria
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Banco
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.bankName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tipo de Cuenta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {request.accountType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Número de Cuenta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ****{request.accountNumber.slice(-4)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Número de Ruta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ****{request.routingNumber.slice(-4)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Actualizar Estado */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-4">
                  Actualizar Estado
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nuevo Estado
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      {statusSteps.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newStatus === "Pago programado" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Pago
                      </label>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Comentario
                    </label>
                    <textarea
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      rows="3"
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {loading ? (
                      <ClipLoader size={20} color="#ffffff" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Actualizar Estado
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {request.statusHistory.map((entry, index) => (
                <div
                  key={index}
                  className="border-l-4 border-red-500 pl-4 py-2"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {entry.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleString()}
                  </div>
                  {entry.comment && (
                    <div className="mt-1 text-sm text-gray-600">
                      {entry.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Lista de notas existentes */}
              <div className="space-y-4">
                {request.adminNotes?.map((note, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">{note.note}</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(note.date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
