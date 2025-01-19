import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { AlertTriangle, AlertCircle } from "lucide-react";

const DeleteConfirmationDialog = ({
  requestId,
  confirmationNumber,
  onDelete,
  onClose,
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
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
        Confirmar Eliminación
      </h3>

      <p className="text-sm text-gray-500 text-center mb-4">
        Esta acción no se puede deshacer. Por favor, ingresa el número de
        confirmación
        <span className="font-medium"> {confirmationNumber} </span>
        para confirmar.
      </p>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-red-600 bg-red-50 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <input
        type="text"
        value={confirmationInput}
        onChange={(e) => setConfirmationInput(e.target.value)}
        placeholder="Ingresa el número de confirmación"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 mb-4"
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={loading || confirmationInput !== confirmationNumber}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            "Eliminar Solicitud"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
