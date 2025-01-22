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

        setRequestStatistics({
          statusCounts: response.data.statusCounts,
          totalRevenue: response.data.totalRevenue,
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

  const { statusCounts, totalRevenue, completedRequests, pendingRequests } =
    requestStatistics;

  // Primero definimos un mapeo fijo de estados a colores
  const statusColors = {
    "Documentación incompleta": "#FFEDD5",
    Pendiente: "#CCCCCC",
    Recibido: "#F3F4F6",
    "En revisión": "#F3E8FF",
    "En proceso con el IRS": "#CFFAFE",
    Aprobada: "#DCFCE7",
    "Requiere verificación de la IRS": "#FED7AA",
    "Pago programado": "#DBEAFE",
    "Deposito enviado": "#BBF7D0",
    "Pago recibido": "#DBEAFE",
    Completada: "#BBF7D0",
    Rechazada: "#FEE2E2",
    Cancelada: "#FECACA",
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
        borderColor: `${isDarkMode ? "#FFF" : "#FFFFFF"}`,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: ` ${isDarkMode ? "white" : "gray"}`,
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
        backgroundColor: ["#38B2AC", "#F56565"],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Solicitudes Completadas vs. Pendientes",
        color: ` ${isDarkMode ? "white" : "gray"}`,
      },
      legend: {
        labels: {
          color: ` ${isDarkMode ? "white" : "gray"}`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="rounded-lg shadow-md p-6">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-md p-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className=" rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 ">Estadísticas Clave</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4 ">
            Progreso de Solicitudes por Estado
          </h3>
          <Pie data={pieChartData} options={options} />
        </div>

        <div>
          <h3
            className={`text-lg font-medium mb-4 ${
              isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            Solicitudes Completadas vs. Pendientes
          </h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Ingresos Totales</h3>
        <p className="text-4xl font-bold text-green-600">
          {totalRevenue.toLocaleString("es-ES", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    </div>
  );
};

export default StatisticsPanel;
