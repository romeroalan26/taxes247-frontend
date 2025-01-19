import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import {
  ArrowLeft,
  Printer,
  Shield,
  FileText,
  User,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import api from "../utils/api";

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    const statusStyles = {
      "En revisión": "bg-blue-100 text-blue-800",
      Aprobado: "bg-emerald-100 text-emerald-800",
      Rechazado: "bg-rose-100 text-rose-800",
      Pendiente: "bg-amber-100 text-amber-800",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const ViewRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      const cachedRequest = localStorage.getItem(`request_${id}`);
      if (cachedRequest) {
        const parsedCache = JSON.parse(cachedRequest);
        const now = new Date().getTime();

        if (now - parsedCache.timestamp < 15 * 60 * 1000) {
          setRequest(parsedCache.data);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem(`request_${id}`);
        }
      }

      try {
        const { ok, data, status } = await api.get(`/requests/${id}`);

        if (ok) {
          setRequest(data);
          const cache = {
            data,
            timestamp: new Date().getTime(),
          };
          localStorage.setItem(`request_${id}`, JSON.stringify(cache));
        } else if (status === 401 || status === 403) {
          navigate("/");
        } else if (status === 404) {
          setRequest(null);
        }
      } catch (error) {
        console.error("Error al cargar detalles de la solicitud:", error);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader size={50} color="#4B5563" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Solicitud no encontrada.</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                className="mr-4 p-2 hover:bg-red-50 rounded-lg"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Detalles de Solicitud
              </h1>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen de la Solicitud */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-red-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Número de Solicitud</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {request.confirmationNumber}
                </h2>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y">
              <div>
                <div className="flex items-center gap-2 text-sm text-red-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de Solicitud</span>
                </div>
                <p className="text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-red-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Tipo de Servicio</span>
                </div>
                <p className="text-gray-900">{request.requestType}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-red-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Precio</span>
                </div>
                <p className="text-gray-900">${request.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                Información Personal
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Nombre
                  </p>
                  <p className="text-gray-900">{request.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Email</p>
                  <p className="text-gray-900">{request.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Teléfono
                  </p>
                  <p className="text-gray-900">{request.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Dirección
                  </p>
                  <p className="text-gray-900">{request.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Sensible */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Información Sensible
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Número de Seguro Social (SSN)
                  </p>
                  <p className="font-mono text-gray-900">{request.ssn}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Número de Cuenta
                  </p>
                  <p className="font-mono text-gray-900">
                    {request.accountNumber}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Número de Ruta
                  </p>
                  <p className="font-mono text-gray-900">
                    {request.routingNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewRequestDetails;
