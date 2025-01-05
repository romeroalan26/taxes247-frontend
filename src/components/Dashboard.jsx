import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importar el contexto
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Contexto actualizado
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú desplegable
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const menuRef = useRef(null);
  const [loadingName, setLoadingName] = useState(true); // Estado para el indicador de carga del nombre
  const [userName, setUserName] = useState(null); // Estado para manejar el nombre del usuario

  useEffect(() => {
    if (user) {
      if (user.name === "Usuario") {
        setUserName(user.displayName);
      } else {
        setUserName(user.name);
      }
      setLoadingName(false); // Terminar carga del nombre
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
    const cachedRequests = localStorage.getItem("requests");

    if (cachedRequests) {
      const parsedCache = JSON.parse(cachedRequests);
      const now = new Date().getTime();

      // Verificar si los datos en el caché aún son válidos
      if (now - parsedCache.timestamp < 30 * 60 * 1000) {
        setRequests(parsedCache.data); // Usar los datos del caché
        setLoadingRequests(false);
        return;
      } else {
        localStorage.removeItem("requests"); // Eliminar datos expirados
      }
    }

    // Si no hay caché válido, hacer la llamada al backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/requests/user/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);

        // Guardar la respuesta en el localStorage con un timestamp
        const cache = {
          data: data,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem("requests", JSON.stringify(cache));
      } else {
        console.error("Error al obtener las solicitudes");
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateProgress = (status) => {
    const currentStepIndex = statusSteps.indexOf(status);
    return ((currentStepIndex + 1) / statusSteps.length) * 100;
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Taxes247</h1>
        <div className="relative">
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
          <div
            ref={menuRef}
            className={`absolute right-0 mt-2 bg-white text-red-600 rounded-md shadow-lg ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <button
              className="block px-4 py-2 hover:bg-red-100 w-full text-left"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="bg-gray-200 text-red-600 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-8">
        <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
  Hola, {loadingName || !userName ? <Skeleton width={100} /> : userName}
</h2>

          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            onClick={() => navigate("/create-request")}
          >
            Crear Solicitud
          </button>
        </div>

        {/* Lista de Solicitudes */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lista de Solicitudes</h2>
        {loadingRequests ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height={100} />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.confirmationNumber}
                className="bg-white p-4 rounded-lg shadow-lg border"
              >
                <h3 className="text-lg font-bold text-red-600">{req.confirmationNumber}</h3>
                <p className="text-gray-600">
                  <span className="font-bold">Estado:</span> {req.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Fecha:</span>{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Progreso:</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${calculateProgress(req.status)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Paso {statusSteps.indexOf(req.status) + 1} de {statusSteps.length}
                  </p>
                </div>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => navigate(`/request/${req._id}`)}
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tienes solicitudes registradas.</p>
        )}
      </main>
      {/* Contactame */}
      <div className="flex items-center justify-center space-x-4">
        <p className="text-gray-700">¿Necesitas ayuda?</p>
        <a
          href="https://wa.me/18094039726"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline hover:text-red-800"
        >
          Contáctame
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
