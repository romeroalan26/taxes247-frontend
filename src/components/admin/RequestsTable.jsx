import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RequestDetailsModal from "./RequestDetailsModal";

const RequestsTable = ({ isDarkMode }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [stats, setStats] = useState({});
  const [statusSteps, setStatusSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Añade estas funciones para manejar la eliminación
  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!requestToDelete) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/requests/${requestToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        loadRequests(); // Recargar la lista
        setShowDeleteDialog(false);
        setRequestToDelete(null);
      } else {
        console.error("Error al eliminar la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(inputSearchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputSearchTerm]);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();

      let url = `${
        import.meta.env.VITE_API_URL
      }/admin/requests?page=${currentPage}`;
      if (debouncedSearchTerm.trim())
        url += `&search=${debouncedSearchTerm.trim()}`;
      if (selectedStatus) url += `&status=${selectedStatus}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setTotalPages(data.pages);
        setStats(data.stats);
        setStatusSteps(data.statusSteps);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedStatus]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputSearchTerm(value);
    setCurrentPage(1);
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = async (requestId, updateData) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        await loadRequests(); // Recargar solicitudes
        handleCloseModal(); // Cerrar el modal
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar el estado:", errorData);
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En revisión":
        return "bg-blue-100 text-blue-800";
      case "Documentación incompleta":
        return "bg-yellow-100 text-yellow-800";
      case "En proceso con el IRS":
        return "bg-purple-100 text-purple-800";
      case "Aprobada":
        return "bg-green-100 text-green-800";
      case "Pago programado":
        return "bg-indigo-100 text-indigo-800";
      case "Completada":
        return "bg-green-200 text-green-900";
      case "Pendiente de pago":
        return "bg-orange-100 text-orange-800";
      case "Pago recibido":
        return "bg-teal-100 text-teal-800";
      case "Rechazada":
        return "bg-red-100 text-red-800";
      case "Cancelada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <ClipLoader color="#DC2626" />
      </div>
    );
  }

  return (
    <div>
      {/* Filtros y Búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className={`rounded-lg border ${
            isDarkMode
              ? "border-gray-700 bg-gray-800 text-white"
              : "border-gray-300 bg-white text-gray-900"
          } px-4 py-2`}
        >
          <option
            value=""
            className={isDarkMode ? "text-gray-400" : "text-gray-600"}
          >
            Todos los estados
          </option>
          {statusSteps.map((status) => (
            <option
              key={status.value}
              value={status.value}
              className={isDarkMode ? "text-white" : "text-gray-900"}
            >
              {status.value}
            </option>
          ))}
        </select>

        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por número, email o nombre..."
              value={inputSearchTerm}
              onChange={handleSearchChange}
              className={`w-full rounded-lg border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } pl-10 pr-4 py-2`}
            />
            <Search
              className={`absolute left-3 top-2.5 h-5 w-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([status, count]) => (
          <div
            key={status}
            className={`rounded-lg shadow p-4 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h3 className="font-semibold">{status}</h3>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-red-600"
              }`}
            >
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div
        className={`shadow rounded-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full d">
            <thead
              className={`${
                isDarkMode
                  ? "ivide-y-0 divide-gray-600 bg-gray-700"
                  : "ivide-y-0 divide-gray-200 bg-gray-50 "
              }`}
            >
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Nº Confirmación
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Cliente
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Email
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Estado
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Última Actualización
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-500"
                  }  uppercase tracking-wider`}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody
              className={`  ${
                isDarkMode
                  ? "divide-y divide-gray-600 bg-gray-800 text-white"
                  : "divide-y divide-gray-200 bg-white text-gray-900"
              }`}
            >
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className={`hover:bg-gray-50 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.confirmationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(
                      request.lastStatusUpdate || request.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenModal(request)}
                      className={`text-blue-600 hover:text-blue-400 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(request)}
                      className={`text-red-600 hover:text-red-400 ${
                        isDarkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>

                  {/* Añade el diálogo de eliminación al final del componente */}
                  {showDeleteDialog && requestToDelete && (
                    <DeleteConfirmationDialog
                      requestId={requestToDelete._id}
                      confirmationNumber={requestToDelete.confirmationNumber}
                      onDelete={handleDeleteConfirmed}
                      onClose={() => {
                        setShowDeleteDialog(false);
                        setRequestToDelete(null);
                      }}
                    />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div
          className={` px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <div className="flex-1 flex justify-between items-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  isDarkMode
                    ? "text-gray-400 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  isDarkMode
                    ? "text-gray-400 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Solicitud */}
      {isModalOpen && selectedRequest && (
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onUpdateStatus={(updateData) =>
            handleUpdateStatus(selectedRequest._id, updateData)
          }
          statusSteps={statusSteps}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default RequestsTable;
