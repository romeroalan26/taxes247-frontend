import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebaseConfig";

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
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const menuRef = useRef(null);

  // Verificar si el usuario está autenticado y cargar solicitudes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/"); // Si no está autenticado, redirigir al login
      } else {
        if (user.displayName) {
          setUserName(user.displayName);
          fetchRequests(user.uid);
        } else {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/users/${user.uid}`
            );
            if (response.ok) {
              const userData = await response.json();
              setUserName(userData.name);
            } else {
              setUserName("Usuario");
            }
          } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            setUserName("Usuario");
          }
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "Usuario");
      fetchRequests(user.uid);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Cargar solicitudes desde el backend
  const fetchRequests = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/requests/user/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Error al obtener las solicitudes");
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    }
  };

  // Manejar clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const calculateProgress = (status) => {
    const currentStepIndex = statusSteps.indexOf(status);
    return ((currentStepIndex + 1) / statusSteps.length) * 100;
  };

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
              onClick={() => alert("Cambiar idioma aún no está implementado.")}
            >
              Cambiar Idioma
            </button>
            <button
              className="block px-4 py-2 hover:bg-red-100 w-full text-left"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="bg-red-700 px-4 py-2 rounded-md hover:bg-red-800"
            onClick={() => alert("Cambiar idioma aún no está implementado.")}
          >
            Cambiar Idioma
          </button>
          <button
            className="bg-gray-200 text-red-600 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-lg font-medium mb-4">Hola, {userName}!</h2>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
            onClick={() => navigate("/create-request")}
          >
            Crear Solicitud
          </button>
        </div>

        {/* Lista de Solicitudes */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lista de Solicitudes
        </h2>
        {requests.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.confirmationNumber}
                className="bg-white p-4 rounded-lg shadow-lg border"
              >
                <h3 className="text-lg font-bold text-red-600">
                  {req.confirmationNumber}
                </h3>
                <p className="text-gray-600">
                  <span className="font-bold">Estado:</span> {req.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Fecha:</span>{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>
                {/* Barra de Progreso */}
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Progreso:</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${calculateProgress(req.status)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Paso {statusSteps.indexOf(req.status) + 1} de{" "}
                    {statusSteps.length}
                  </p>
                </div>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => alert(`Detalles de ${req.confirmationNumber}`)}
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
