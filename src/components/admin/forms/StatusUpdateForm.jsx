import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { AlertCircle } from "lucide-react";

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
      // Encontrar el estado seleccionado y su descripción
      const selectedStatusStep = statusSteps.find(
        (step) => step.value === status
      );
      if (!selectedStatusStep) {
        throw new Error(`Estado no válido: ${status}`);
      }

      const updateData = {
        status: status,
        comment: description,
        description: selectedStatusStep.description, // Añadimos la descripción del estado
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

  // Asegurémonos de que utilizamos los valores correctos del statusSteps
  const availableStatuses = Array.isArray(statusSteps) ? statusSteps : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-100" : "text-gray-700"
          } mb-1`}
        >
          Estado
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full rounded-md ${
            isDarkMode ? "bg-gray-600 text-gray-100" : "bg-white text-white"
          } border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500`}
          required
        >
          {availableStatuses.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>
              {statusOption.value}
            </option>
          ))}
        </select>
      </div>

      {status === "Pago programado" && (
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            } mb-1`}
          >
            Fecha de Pago
          </label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className={`w-full rounded-md ${
              isDarkMode ? "bg-gray-600 text-gray-100" : "bg-white text-white"
            } border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500`}
            required
          />
        </div>
      )}

      <div>
        <label
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-100" : "text-gray-700"
          } mb-1`}
        >
          Comentario
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
            isDarkMode ? "bg-gray-600 text-gray-100" : "bg-white text-white"
          }`}
          rows="3"
          required
          placeholder="Añade un comentario sobre el cambio de estado..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
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
