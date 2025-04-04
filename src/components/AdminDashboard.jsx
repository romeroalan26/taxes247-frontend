// src/components/AdminDashboard.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Menu,
  List,
  Clock,
  FileText,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
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
  const [totalRequests, setTotalRequests] = useState(0);

  const handleViewDetails = useCallback((request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  }, []);

  const handleStatsUpdate = useCallback((stats) => {
    setTotalRequests(Object.values(stats).reduce((a, b) => a + b, 0));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark", !isDarkMode);
  }, [isDarkMode]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleStatistics = useCallback(() => {
    setIsStatisticsExpanded((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [logout, navigate]);

  // Memoize the table props
  const tableProps = useMemo(
    () => ({
      onViewDetails: handleViewDetails,
      isDarkMode,
      onStatsUpdate: handleStatsUpdate,
    }),
    [handleViewDetails, isDarkMode, handleStatsUpdate]
  );

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : " bg-gray-100 "}`}
    >
      {/* Header */}
      <header className={`${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative z-10 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            } border-opacity-50`}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between gap-4">
                {/* Logo y Título */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-xl ${
                      isDarkMode ? "bg-gray-700" : "bg-red-50"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-red-400" : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h1
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
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

                {/* Acciones - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                  <div
                    className={`flex items-center px-3 py-1.5 rounded-lg ${
                      isDarkMode ? " text-gray-300" : " text-gray-600"
                    }`}
                  >
                    <span className="text-sm">{user?.email}</span>
                  </div>

                  <button
                    onClick={toggleDarkMode}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>

                {/* Menú móvil */}
                <div className="md:hidden">
                  <button
                    onClick={toggleMenu}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menú móvil expandido */}
          {isMenuOpen && (
            <div
              className={`md:hidden border-b ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="px-4 py-3 space-y-2">
                <div
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="text-sm">{user?.email}</span>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Cerrar Sesión</span>
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
            className={`group relative w-full rounded-xl border transition-all duration-300 overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
            onClick={toggleStatistics}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 group-hover:bg-gray-600"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  <FileText
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Estadísticas Clave
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {isStatisticsExpanded
                      ? "Click para ocultar"
                      : "Click para ver métricas importantes"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  {totalRequests} solicitudes totales
                </div>
                <div
                  className={`transform transition-transform duration-300 ${
                    isStatisticsExpanded ? "rotate-180" : ""
                  }`}
                >
                  <ChevronRight
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 transform origin-left transition-transform duration-300 ${
                isStatisticsExpanded ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isStatisticsExpanded
                ? "max-h-[2000px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`rounded-xl border p-4 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <StatisticsPanel isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>

        {/* RequestsTable Component */}
        <RequestsTable {...tableProps} />
      </main>
    </div>
  );
};

export default AdminDashboard;
