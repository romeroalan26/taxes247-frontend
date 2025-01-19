// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, List, Clock, FileText, Moon, Sun } from "lucide-react";
import RequestsTable from "./admin/RequestsTable";
import StatisticsPanel from "./admin/StatisticsPanel";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatisticsExpanded, setIsStatisticsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : " bg-gray-100 "}`}
    >
      {/* Header */}
      <header
        className={` shadow-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "text-white bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText
                className={`h-8 w-8 ${
                  isDarkMode ? "text-white" : "text-red-600"
                }`}
              />
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Taxes247 Admin
                </h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Panel de Administración
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "text-white bg-gray-700 hover:bg-gray-600 focus:ring-offset-gray-800 focus:ring-gray-600"
                    : "text-white bg-red-600 hover:bg-red-700 focus:ring-offset-red-700 focus:ring-red-600"
                }`}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
              <button
                onClick={toggleDarkMode}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "text-white bg-gray-700 hover:bg-gray-600 focus:ring-offset-gray-800 focus:ring-gray-600"
                    : "text-white bg-red-600 hover:bg-red-700 focus:ring-offset-red-700 focus:ring-red-600"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "hover:bg-gray-700 focus:ring-offset-gray-800 focus:ring-gray-600"
                    : "hover:bg-gray-200 focus:ring-offset-red-700 focus:ring-red-600"
                }`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div
              className={`md:hidden border-t py-3 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="px-2 space-y-1">
                <span
                  className={`block px-3 py-2 text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-white hover:bg-red-700"
                  }`}
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Cerrar Sesión
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-white hover:bg-red-700"
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 inline mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 inline mr-2" />
                  )}
                  {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Solicitudes</h2>
          <p
            className={`mt-1 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Gestiona todas las solicitudes de impuestos desde aquí
          </p>
        </div>

        {/* StatisticsPanel Component */}
        <div className="mb-8">
          <button
            className={` rounded-lg shadow-md p-4 w-full flex items-center justify-between hover:bg-gray-100 ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white"
            }`}
            onClick={() => setIsStatisticsExpanded(!isStatisticsExpanded)}
          >
            <h3 className="text-lg font-medium">Estadísticas Clave</h3>
            <span
              className={`transform transition-transform duration-300 ${
                isStatisticsExpanded ? "rotate-180" : ""
              }`}
            >
              <List className="h-6 w-6" />
            </span>
          </button>
          {isStatisticsExpanded && <StatisticsPanel isDarkMode={isDarkMode} />}
        </div>

        {/* RequestsTable Component */}
        <RequestsTable
          onViewDetails={handleViewDetails}
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
