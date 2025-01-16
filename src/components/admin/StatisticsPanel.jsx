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

// Function to generate sample data
const generateSampleData = () => {
  return {
    statusCounts: {
      "En revisión": 50,
      "Documentación incompleta": 20,
      "En proceso con el IRS": 30,
      Aprobada: 40,
      "Pago programado": 25,
      Completada: 60,
      "Pendiente de pago": 18,
      "Pago recibido": 35,
      Rechazada: 12,
      Cancelada: 8,
    },
    totalRevenue: 125000,
    completedRequests: 80,
    pendingRequests: 45,
  };
};

// Function to initialize sample data
const initializeSampleData = () => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleData = generateSampleData();
      resolve(sampleData);
    }, 1000); // 1 second delay to simulate an API call
  });
};

const StatisticsPanel = () => {
  const [requestStatistics, setRequestStatistics] = useState({
    statusCounts: {},
    totalRevenue: 0,
    completedRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    // Initialize sample data
    const initializeData = async () => {
      const sampleData = await initializeSampleData();
      setRequestStatistics(sampleData);
    };
    initializeData();
  }, []);

  const { statusCounts, totalRevenue, completedRequests, pendingRequests } =
    requestStatistics;

  // Prepare data for the Pie Chart
  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#4C51BF", // En revisión
          "#F56565", // Documentación incompleta
          "#805AD5", // En proceso con el IRS
          "#48BB78", // Aprobada
          "#4299E1", // Pago programado
          "#38B2AC", // Completada
          "#F6AD55", // Pendiente de pago
          "#38B2AC", // Pago recibido
          "#E53E3E", // Rechazada
          "#A0AEC0", // Cancelada
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
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
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Estadísticas Clave</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            Progreso de Solicitudes por Estado
          </h3>
          <Pie data={pieChartData} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">
            Solicitudes Completadas vs. Pendientes
          </h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Ingresos Totales</h3>
        <p className="text-4xl font-bold text-red-500">
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
