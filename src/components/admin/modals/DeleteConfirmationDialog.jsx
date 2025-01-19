import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { AlertTriangle, AlertCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con fondo oscuro semitransparente */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Contenedor para centrado */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Modal */}
        <div
          className={`relative rounded-lg max-w-lg w-full mx-auto shadow-xl p-6 transform transition-all ${
            isDarkMode ? "bg-gray-600" : "bg-gray-100"
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Ícono de advertencia */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            {/* Título */}
            <h3
              className={`text-lg font-medium  mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              ¿Estás seguro de que deseas eliminar esta solicitud?
            </h3>

            {/* Mensaje */}
            <p
              className={`text-sm  mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Esta acción no se puede deshacer. Por favor, ingresa el número de
              confirmación
              <span
                className={`font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {" "}
                {confirmationNumber}{" "}
              </span>
              para confirmar.
            </p>

            {/* Mensaje de error si existe */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-red-600 bg-red-50 rounded-md w-full">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Campo de confirmación */}
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Ingresa el número de confirmación"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 mb-4 ${
                isDarkMode ? "text-red-500 " : "text-black"
              }`}
            />

            {/* Botones */}
            <div className="flex justify-end gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmationInput !== confirmationNumber}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
