import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import api from "@/utils/api";
import { DollarSign, TrendingUp, CheckCircle2, Clock } from "lucide-react";

// Registrar los elementos necesarios para el gráfico
Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPanel = ({ isDarkMode }) => {
  const [requestStatistics, setRequestStatistics] = useState({
    statusCounts: {},
    totalRevenue: 0,
    completedRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/statistics");

        const totalActiveRequests = Object.entries(response.data.statusCounts)
          .filter(
            ([status]) => status !== "Cancelada" || status !== "Rechazada"
          )
          .reduce((sum, [_, count]) => sum + count, 0);

        setRequestStatistics({
          statusCounts: response.data.statusCounts,
          totalRevenue: response.data.totalRevenue,
          expectedRevenue: totalActiveRequests * 60,
          completedRequests: response.data.completedRequests,
          pendingRequests: response.data.pendingRequests,
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const {
    statusCounts,
    totalRevenue,
    completedRequests,
    pendingRequests,
    expectedRevenue,
  } = requestStatistics;

  // Primero definimos un mapeo fijo de estados a colores
  const statusColors = {
    "Documentación incompleta": "#9A3412", // text-orange-800
    Pendiente: "#1F2937", // text-gray-800
    Recibido: "#1F2937", // text-gray-800
    "En revisión": "#5B21B6", // text-purple-800
    "En proceso con el IRS": "#164E63", // text-cyan-800
    Aprobada: "#166534", // text-green-800
    "Requiere verificación de la IRS": "#7C2D12", // text-orange-900
    "Pago programado": "#1E40AF", // text-blue-800
    "Deposito enviado": "#14532D", // text-green-900
    "Pago recibido": "#1E40AF", // text-blue-800
    Completada: "#14532D", // text-green-900
    Rechazada: "#991B1B", // text-red-800
    Cancelada: "#7F1D1D", // text-red-900
  };

  // Luego usamos este mapeo para generar el pieChartData
  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        // Generamos el array de colores basado en las etiquetas actuales
        backgroundColor: Object.keys(statusCounts).map(
          (status) => statusColors[status]
        ),
        borderColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDarkMode ? "#E5E7EB" : "#4B5563",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Prepare data for the Bar Chart
  const barChartData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        label: "Solicitudes",
        data: [completedRequests, pendingRequests],
        backgroundColor: [
          "rgba(56, 178, 172, 0.8)", // teal-500 con transparencia
          "rgba(245, 101, 101, 0.8)", // red-500 con transparencia
        ],
        borderColor: [
          "rgb(56, 178, 172)", // teal-500
          "rgb(245, 101, 101)", // red-500
        ],
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 60,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Solicitudes Completadas vs. Pendientes",
        color: isDarkMode ? "#E5E7EB" : "#4B5563",
        font: {
          size: 16,
          weight: "600",
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(17, 24, 39, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#E5E7EB" : "#1F2937",
        bodyColor: isDarkMode ? "#E5E7EB" : "#1F2937",
        borderColor: isDarkMode
          ? "rgba(75, 85, 99, 0.2)"
          : "rgba(229, 231, 235, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} solicitudes`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "#E5E7EB" : "#4B5563",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 8,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#E5E7EB" : "#4B5563",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 8,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  if (loading) {
    return (
      <div
        className={`rounded-2xl shadow-sm border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } p-6`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-2xl shadow-sm border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } p-6`}
      >
        <div
          className={`text-center ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl shadow-sm border overflow-hidden ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`p-6 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <h2
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Estadísticas Clave
        </h2>
      </div>

      <div className="p-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gradient-to-br from-green-50 to-green-100 border-green-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                Ingresos Totales
              </h3>
              <DollarSign
                className={`h-5 w-5 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              {totalRevenue.toLocaleString("es-ES", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-blue-300" : "text-blue-800"
                }`}
              >
                Ingreso Esperado
              </h3>
              <TrendingUp
                className={`h-5 w-5 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              {expectedRevenue.toLocaleString("es-ES", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-emerald-300" : "text-emerald-800"
                }`}
              >
                Completadas
              </h3>
              <CheckCircle2
                className={`h-5 w-5 ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-emerald-400" : "text-emerald-700"
              }`}
            >
              {completedRequests}
            </p>
          </div>

          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-amber-300" : "text-amber-800"
                }`}
              >
                Pendientes
              </h3>
              <Clock
                className={`h-5 w-5 ${
                  isDarkMode ? "text-amber-400" : "text-amber-600"
                }`}
              />
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-amber-400" : "text-amber-700"
              }`}
            >
              {pendingRequests}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Progreso de Solicitudes por Estado
            </h3>
            <div className="relative h-[400px]">
              <Pie data={pieChartData} options={options} />
            </div>
          </div>

          <div
            className={`rounded-xl p-6 border ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Solicitudes Completadas vs. Pendientes
            </h3>
            <div className="relative h-[400px]">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
