import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { AlertCircle, Calendar, MessageSquare } from "lucide-react";

const StatusUpdateForm = ({
  requestId,
  currentStatus,
  onUpdate,
  statusSteps,
  onClose,
  isDarkMode,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [description, setDescription] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const selectedStatusStep = statusSteps.find(
        (step) => step.value === status
      );
      if (!selectedStatusStep) {
        throw new Error(`Estado no válido: ${status}`);
      }

      const updateData = {
        status: status,
        comment: description,
        description: selectedStatusStep.description,
        ...(status === "Pago programado" && paymentDate ? { paymentDate } : {}),
      };

      await onUpdate(updateData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const availableStatuses = Array.isArray(statusSteps) ? statusSteps : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl ${
            isDarkMode ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Estado
          </label>
          <div
            className={`relative rounded-xl border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full appearance-none bg-transparent py-3 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
              required
            >
              {availableStatuses.map((statusOption) => (
                <option
                  key={statusOption.value}
                  value={statusOption.value}
                  className={isDarkMode ? "bg-gray-800" : "bg-white"}
                >
                  {statusOption.value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg
                className={`h-5 w-5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {status === "Pago programado" && (
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar
                  className={`h-4 w-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span>Fecha de Pago</span>
              </div>
            </label>
            <div
              className={`relative rounded-xl border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={`w-full bg-transparent py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare
                className={`h-4 w-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span>Comentario</span>
            </div>
          </label>
          <div
            className={`relative rounded-xl border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-transparent py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl resize-none ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
              rows="4"
              required
              placeholder="Añade un comentario sobre el cambio de estado..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
          } flex items-center justify-center min-w-[100px]`}
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            "Actualizar Estado"
          )}
        </button>
      </div>
    </form>
  );
};

export default StatusUpdateForm;
