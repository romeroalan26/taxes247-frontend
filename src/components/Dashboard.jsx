import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebaseConfig";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú hamburguesa
  const [requests, setRequests] = useState([]); // Estado para solicitudes
  const menuRef = useRef(null); // Referencia para el menú desplegable

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/"); // Si no está autenticado, redirigir al login
      } else {
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          try {
            const response = await fetch(
              `http://localhost:5000/api/users/${user.uid}`
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

  // Manejar clics fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirigir al login
  };

  // Redirigir a la página de crear solicitud
  const handleCreateRequest = () => {
    navigate("/create-request");
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

      {/* Cuerpo del Dashboard */}
      <main className="p-8 space-y-8">
        {/* Crear Solicitud */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-medium mb-4">Hola, {userName}!</h2>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center space-x-2"
            onClick={handleCreateRequest}
          >
            <span className="text-2xl">+</span>
            <span>Crear Solicitud</span>
          </button>
        </div>

        {/* Lista de Solicitudes */}
        <div className="w-full md:w-3/4 mx-auto bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Lista de Solicitudes
          </h2>
          {requests.length > 0 ? (
            <ul>
              {requests.map((req, index) => (
                <li key={index} className="mb-2 border-b pb-2">
                  {req.title || `Solicitud ${index + 1}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tienes solicitudes registradas.</p>
          )}
        </div>

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
      </main>
    </div>
  );
};

export default Dashboard;
