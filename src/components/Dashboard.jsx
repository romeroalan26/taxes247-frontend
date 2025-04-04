import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import api from "../utils/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
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
  Info,
  X,
  CheckCircle2,
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

const StepsModal = ({ isOpen, onClose, statusSteps }) => {
  if (!isOpen) return null;

  const progressSteps = statusSteps.filter((step) => step.countInProgress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Proceso de Declaración
              </h2>
              <p className="text-sm text-gray-500">
                Pasos que cuentan para el progreso de tu declaración
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </motion.button>
          </div>
        </div>

        <div className="p-4 pb-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-3">
            {progressSteps.map((step, index) => (
              <motion.div
                key={step.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border-2 border-red-200 flex items-center justify-center">
                  <span className="text-sm font-semibold text-red-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{step.value}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [statusSteps, setStatusSteps] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingName, setLoadingName] = useState(true);
  const [userName, setUserName] = useState(null);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);

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

  const handleCloseModal = () => {
    setIsStepsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <FileText className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Taxes247
              </h1>
            </motion.div>

            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </motion.button>
            </div>

            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.15 },
                }}
                className="md:hidden pb-3 space-y-1"
              >
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Cerrar Sesión
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {loadingName || !userName ? (
                    <Skeleton width={200} />
                  ) : (
                    `¡Hola, ${userName}!`
                  )}
                </h2>
                <p className="text-red-100 text-sm sm:text-base">
                  Gestiona tus declaraciones de impuestos de forma fácil
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/create-request")}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-xl text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Nueva Solicitud
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" />
            Tus Solicitudes
          </h2>

          {loadingRequests ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={200} />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request, index) => {
                const progressPercent = calculateProgress(request.status);
                const progressSteps = statusSteps.filter(
                  (step) => step.countInProgress
                );
                const currentStepIndex = statusSteps.findIndex(
                  (step) => step.value === request.status
                );
                const progressStepIndex = statusSteps
                  .slice(0, currentStepIndex + 1)
                  .filter((step) => step.countInProgress).length;

                const currentStatusStep = statusSteps.find(
                  (step) => step.value === request.status
                );

                return (
                  <motion.div
                    key={request.confirmationNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] transition-all duration-200 border border-gray-200/80 hover:border-gray-300"
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-sm">
                            <FileText className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Solicitud
                            </span>
                            <div className="text-base font-semibold text-gray-900">
                              #{request.confirmationNumber}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {/* Status Description */}
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {currentStatusStep?.description ||
                            "Estado actual de la solicitud"}
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>
                              Último estado:{" "}
                              {new Date(
                                request.lastStatusUpdate
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {request.status === "Pago programado" &&
                            request.paymentDate && (
                              <div className="flex items-center text-sm text-green-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>
                                  Pago:{" "}
                                  {new Date(
                                    request.paymentDate
                                  ).toLocaleDateString("es-ES", {
                                    timeZone: "UTC",
                                  })}
                                </span>
                              </div>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              <span>
                                {progressStepIndex > 0
                                  ? `Paso ${progressStepIndex} de ${progressSteps.length}`
                                  : "Estado de solicitud"}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsStepsModalOpen(true)}
                              className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <Info className="w-3.5 h-3.5 mr-1" />
                              Ver pasos
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/request/${request._id}`)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-100 text-sm font-medium rounded-lg text-red-600 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Ver Detalles
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center text-sm sm:text-base text-gray-600"
            >
              <p>No tienes solicitudes registradas.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-md px-4 sm:px-6 py-3 sm:py-4">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            <span className="text-sm sm:text-base text-gray-700">
              ¿Necesitas ayuda?
            </span>
            <motion.a
              whileHover={{ x: 5 }}
              href="https://wa.me/18094039726"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm sm:text-base transition-colors duration-200"
            >
              Contáctame
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.a>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        <StepsModal
          isOpen={isStepsModalOpen}
          onClose={handleCloseModal}
          statusSteps={statusSteps}
        />
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
