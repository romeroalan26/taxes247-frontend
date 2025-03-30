import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { AlertTriangle, AlertCircle, X } from "lucide-react";

const DeleteConfirmationDialog = ({
  requestId,
  confirmationNumber,
  onDelete,
  onClose,
  isDarkMode,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleDelete = async () => {
    if (confirmationInput !== confirmationNumber) {
      setError("El número de confirmación no coincide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/requests/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la solicitud");
      }

      onDelete();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className={`relative w-full max-w-lg transform overflow-hidden rounded-xl p-6 text-left shadow-2xl transition-all ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            {/* Warning icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h3
              id="modal-title"
              className={`mt-4 text-lg font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              ¿Estás seguro de que deseas eliminar esta solicitud?
            </h3>

            {/* Message */}
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Esta acción no se puede deshacer. Por favor, ingresa el número de
              confirmación{" "}
              <span
                className={`font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {confirmationNumber}
              </span>{" "}
              para confirmar.
            </p>

            {/* Error message */}
            {error && (
              <div
                className="mt-4 flex w-full items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                role="alert"
              >
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Confirmation input */}
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Ingresa el número de confirmación"
              className={`mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
              aria-label="Número de confirmación"
            />

            {/* Action buttons */}
            <div className="mt-6 flex w-full justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmationInput !== confirmationNumber}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
                aria-label="Eliminar solicitud"
              >
                {loading ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  "Eliminar Solicitud"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
