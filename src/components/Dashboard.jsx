import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  MessageCircle
} from "lucide-react";

const statusSteps = [
  "Pendiente de pago",
  "Pago recibido",
  "En revisión",
  "Documentación incompleta",
  "En proceso con el IRS",
  "Aprobada",
  "Completada",
  "Rechazada",
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pendiente de pago":
      return "bg-yellow-100 text-yellow-800";
    case "Pago recibido":
      return "bg-blue-100 text-blue-800";
    case "En revisión":
      return "bg-purple-100 text-purple-800";
    case "Documentación incompleta":
      return "bg-orange-100 text-orange-800";
    case "En proceso con el IRS":
      return "bg-cyan-100 text-cyan-800";
    case "Aprobada":
      return "bg-green-100 text-green-800";
    case "Completada":
      return "bg-green-200 text-green-900";
    case "Rechazada":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
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
    const fromCreateRequest = localStorage.getItem("fromCreateRequest");
    const cachedRequests = localStorage.getItem("requests");

    if (cachedRequests && !fromCreateRequest) {
      const parsedCache = JSON.parse(cachedRequests);
      const now = new Date().getTime();

      if (now - parsedCache.timestamp < 30 * 60 * 1000) {
        setRequests(parsedCache.data);
        setLoadingRequests(false);
        return;
      }
      localStorage.removeItem("requests");
    }

    localStorage.removeItem("fromCreateRequest");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/requests/user/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        localStorage.setItem(
          "requests",
          JSON.stringify({ data, timestamp: new Date().getTime() })
        );
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const calculateProgress = (status) => {
    const currentStepIndex = statusSteps.indexOf(status);
    return ((currentStepIndex + 1) / statusSteps.length) * 100;
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
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
                    `¡Bienvenido, ${userName}!`
                  )}
                </h2>
                <p className="text-red-100">Gestiona tus declaraciones de impuestos de forma fácil</p>
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
              {requests.map((req) => (
                <div
                  key={req.confirmationNumber}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-lg font-semibold text-red-600">
                        #{req.confirmationNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-red-600 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(req.status)}%` }}
                          />
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>
                            Paso {statusSteps.indexOf(req.status) + 1} de {statusSteps.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/request/${req._id}`)}
                      className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Ver Detalles
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
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