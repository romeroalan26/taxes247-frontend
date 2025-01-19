import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import api from "../utils/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FileText,
  LogOut,
  Menu,
  Plus,
  Activity,
  ChevronRight,
  Clock,
  Calendar,
  MessageCircle,
} from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "Pendiente":
      return "bg-gray-100 text-gray-800";
    case "Recibido":
      return "bg-gray-100 text-gray-800";
    case "Pago programado":
      return "bg-blue-100 text-blue-800";
    case "En revisión":
      return "bg-purple-100 text-purple-800";
    case "Documentación incompleta":
      return "bg-orange-100 text-orange-800";
    case "En proceso con el IRS":
      return "bg-cyan-100 text-cyan-800";
    case "Requiere verificación de la IRS":
      return "bg-orange-200 text-orange-900";
    case "Aprobada":
      return "bg-green-100 text-green-800";
    case "Pago recibido":
      return "bg-blue-100 text-blue-800";
    case "Deposito enviado":
      return "bg-green-200 text-green-900";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [statusSteps, setStatusSteps] = useState([]); // Ensure initialized as empty array
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingName, setLoadingName] = useState(true);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      setUserName(user.name === "Usuario" ? user.displayName : user.name);
      setLoadingName(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchRequests(user.uid);
    }
  }, [user, navigate]);

  const fetchRequests = async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/requests/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Ensure data is valid
        if (data && typeof data === "object") {
          // Use optional chaining and provide fallbacks
          const requests = Array.isArray(data.requests) ? data.requests : [];
          const statusSteps = Array.isArray(data.statusSteps)
            ? data.statusSteps
            : [];

          setRequests(requests);
          setStatusSteps(statusSteps);
        } else {
          console.error("Invalid data structure received:", data);
          setRequests([]);
          setStatusSteps([]);
        }
      } else {
        // Attempt to get error details
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);

        setRequests([]);
        setStatusSteps([]);
      }
    } catch (error) {
      console.error("Fetch requests error:", error);

      setRequests([]);
      setStatusSteps([]);
    } finally {
      setLoadingRequests(false);
    }
  };
  const calculateProgress = (status) => {
    if (!statusSteps || statusSteps.length === 0) return 0;

    const progressSteps = statusSteps.filter((step) => step.countInProgress);
    const currentStepIndex = statusSteps.findIndex(
      (step) => step.value === status
    );

    const progressStepIndex = statusSteps
      .slice(0, currentStepIndex + 1)
      .filter((step) => step.countInProgress).length;

    const totalProgressSteps = progressSteps.length;

    return progressStepIndex > 0
      ? (progressStepIndex / totalProgressSteps) * 100
      : 0;
  };

  // In the requests mapping section:
  {
    requests.map((request) => (
      <div
        key={request.confirmationNumber}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        {/* Other request details */}
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {(() => {
              const progressSteps = statusSteps.filter(
                (step) => step.countInProgress
              );
              const currentStepIndex = statusSteps.findIndex(
                (step) => step.value === request.status
              );

              const progressStepIndex = statusSteps
                .slice(0, currentStepIndex + 1)
                .filter((step) => step.countInProgress).length;

              return progressStepIndex > 0
                ? `Paso ${progressStepIndex} de ${progressSteps.length}`
                : "Estado de solicitud";
            })()}
          </span>
        </div>
        {/* Rest of the request card */}
      </div>
    ));
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8" />
              <h1 className="ml-2 text-2xl font-bold">Taxes247</h1>
            </div>

            <div className="hidden md:block">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-3">
              <button
                onClick={logout}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 w-full text-left"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {loadingName || !userName ? (
                    <Skeleton width={200} />
                  ) : (
                    `¡Hola, ${userName}!`
                  )}
                </h2>
                <p className="text-red-100">
                  Gestiona tus declaraciones de impuestos de forma fácil
                </p>
              </div>
              <button
                onClick={() => navigate("/create-request")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Solicitud
              </button>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-600" />
            Tus Solicitudes
          </h2>

          {loadingRequests ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={200} />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => {
                // Safely calculate progress
                const calculateRequestProgress = () => {
                  // Ensure statusSteps exists and is an array
                  if (!statusSteps || !Array.isArray(statusSteps)) {
                    return {
                      progressSteps: [],
                      progressStepIndex: 0,
                      progressPercent: 0,
                    };
                  }

                  // Filter steps that should be counted in progress
                  const progressSteps = statusSteps.filter(
                    (step) => step.countInProgress === true
                  );

                  // Find the index of the current status
                  const currentStepIndex = statusSteps.findIndex(
                    (step) => step && step.value === request.status
                  );

                  // Calculate progress step index
                  const progressStepIndex =
                    currentStepIndex >= 0
                      ? statusSteps
                          .slice(0, currentStepIndex + 1)
                          .filter((step) => step.countInProgress === true)
                          .length
                      : 0;

                  // Calculate progress percentage
                  const progressPercent =
                    progressSteps.length > 0
                      ? (progressStepIndex / progressSteps.length) * 100
                      : 0;

                  return { progressSteps, progressStepIndex, progressPercent };
                };

                const { progressSteps, progressStepIndex, progressPercent } =
                  calculateRequestProgress();

                // Find the current status step to get its description
                const currentStatusStep = statusSteps.find(
                  (step) => step.value === request.status
                );

                return (
                  <div
                    key={request.confirmationNumber}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-lg font-semibold text-red-600">
                          #{request.confirmationNumber}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Status Description */}
                        <div className="text-sm text-gray-600">
                          {currentStatusStep?.description ||
                            "Estado actual de la solicitud"}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Fecha de último estado:{" "}
                            {new Date(
                              request.lastStatusUpdate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Payment Date for 'Pago programado' status */}
                        {request.status === "Pago programado" &&
                          request.paymentDate && (
                            <div className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-green-600" />
                              Fecha de pago:{" "}
                              {new Date(
                                request.paymentDate
                              ).toLocaleDateString()}
                            </div>
                          )}

                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 bg-red-600 rounded-full transition-all duration-500"
                              style={{
                                width: `${progressPercent}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {progressStepIndex > 0
                                ? `Paso ${progressStepIndex} de ${progressSteps.length}`
                                : "Estado de solicitud"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/request/${request._id}`)}
                        className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Ver Detalles
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-600">
              <p>No tienes solicitudes registradas.</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-lg shadow-md px-6 py-4">
            <MessageCircle className="w-5 h-5 text-red-600" />
            <span className="text-gray-700">¿Necesitas ayuda?</span>
            <a
              href="https://wa.me/18094039726"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors duration-200"
            >
              Contáctame
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
