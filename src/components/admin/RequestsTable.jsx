import React, { useState, useEffect, useCallback, memo } from "react";
import { auth } from "../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  FileText,
  Clock,
  X,
} from "lucide-react";
import RequestDetailsModal from "./RequestDetailsModal";
import DeleteConfirmationDialog from "./modals/DeleteConfirmationDialog";

// Definir el orden de los status
const STATUS_ORDER = [
  "Pendiente",
  "En proceso",
  "Pago programado",
  "Pago recibido",
  "Completado",
  "Cancelado",
  "Rechazado",
];

// Función para ordenar los status según el orden definido
const sortStatuses = (statuses) => {
  return [...statuses].sort((a, b) => {
    const indexA = STATUS_ORDER.indexOf(a);
    const indexB = STATUS_ORDER.indexOf(b);
    return indexA - indexB;
  });
};

const RequestsTable = memo(({ onViewDetails, isDarkMode, onStatsUpdate }) => {
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
        onStatsUpdate?.(data.stats);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedStatus, onStatsUpdate]);

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
      case "Pendiente":
        return "bg-gray-100 text-gray-800";
      case "Recibido":
        return "bg-gray-100 text-gray-800";
      case "En revisión":
        return "bg-purple-100 text-purple-800";
      case "Documentación incompleta":
        return "bg-orange-100 text-orange-800";
      case "En proceso con el IRS":
        return "bg-cyan-100 text-cyan-800";
      case "Aprobada":
        return "bg-green-100 text-green-800";
      case "Requiere verificación de la IRS":
        return "bg-orange-200 text-orange-900";
      case "Pago programado":
        return "bg-blue-100 text-blue-800";
      case "Deposito enviado":
        return "bg-green-200 text-green-900";
      case "Pago recibido":
        return "bg-blue-100 text-blue-800";
      case "Completada":
        return "bg-green-200 text-green-900";
      case "Rechazada":
        return "bg-red-100 text-red-800";
      case "Cancelada":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para generar los números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxPages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxPages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Obtener status únicos y ordenados
  const uniqueStatuses = sortStatuses(Object.keys(stats));

  if (loading) {
    return (
      <div
        className={`w-full h-64 flex items-center justify-center rounded-2xl border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <ClipLoader color="#DC2626" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <div
        className={`space-y-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
      >
        {/* Barra de búsqueda moderna */}
        <div
          className={`relative rounded-xl border shadow-sm ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="relative">
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar por número, email o nombre..."
              value={inputSearchTerm}
              onChange={handleSearchChange}
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl border-0 text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-transparent text-white placeholder-gray-400 focus:bg-gray-800/80"
                  : "bg-transparent text-gray-900 placeholder-gray-500 focus:bg-gray-50"
              } focus:ring-2 focus:ring-red-500/20`}
            />
            {inputSearchTerm && (
              <button
                onClick={() => setInputSearchTerm("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filtros de estado */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedStatus("");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedStatus === ""
                ? isDarkMode
                  ? "bg-red-600 text-white"
                  : "bg-red-600 text-white"
                : isDarkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos ({Object.values(stats).reduce((a, b) => a + b, 0)})
          </button>
          {uniqueStatuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedStatus === status
                  ? isDarkMode
                    ? "bg-red-600 text-white"
                    : "bg-red-600 text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} ({stats[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Nº
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Cliente
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Estado
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Actualizado
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody
              className={isDarkMode ? "divide-gray-700" : "divide-gray-200"}
            >
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className={`transition-colors duration-200 cursor-pointer ${
                    isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleOpenModal(request)}
                >
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {request.confirmationNumber}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{request.fullName}</span>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {request.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {new Date(
                      request.lastStatusUpdate || request.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2"
                    onClick={(e) => e.stopPropagation()} // Prevenir que el click en los botones abra el modal
                  >
                    <button
                      onClick={() => handleOpenModal(request)}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "text-blue-400 hover:bg-blue-400/10"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(request)}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-400/10"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div
          className={`px-4 py-3 flex items-center justify-between border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex-1 flex justify-between items-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Números de página */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 rounded-lg transition-colors duration-200 ${
                    currentPage === pageNum
                      ? isDarkMode
                        ? "bg-red-500 text-white"
                        : "bg-red-600 text-white"
                      : isDarkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
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
      {showDeleteDialog && requestToDelete && (
        <DeleteConfirmationDialog
          requestId={requestToDelete._id}
          confirmationNumber={requestToDelete.confirmationNumber}
          onDelete={handleDeleteConfirmed}
          onClose={() => {
            setShowDeleteDialog(false);
            setRequestToDelete(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
});

export default RequestsTable;
