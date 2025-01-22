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
  Clock,
  AlertCircle,
  Search,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  ShieldAlert,
  CalendarCheck,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  XOctagon,
  HelpCircle,
} from "lucide-react";
import api from "../utils/api";

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    const baseStyles = {
      Pendiente: "bg-gray-100 text-gray-800 border border-gray-200",
      Recibido: "bg-gray-100 text-gray-800 border border-gray-200",
      "En revisión": "bg-purple-100 text-purple-800 border border-purple-200",
      "Documentación incompleta":
        "bg-orange-100 text-orange-800 border border-orange-200",
      "En proceso con el IRS":
        "bg-cyan-100 text-cyan-800 border border-cyan-200",
      Aprobada: "bg-green-100 text-green-800 border border-green-200",
      "Requiere verificación de la IRS":
        "bg-orange-200 text-orange-900 border border-orange-300",
      "Pago programado": "bg-blue-100 text-blue-800 border border-blue-200",
      "Deposito enviado": "bg-green-200 text-green-900 border border-green-300",
      "Pago recibido": "bg-blue-100 text-blue-800 border border-blue-200",
      Completada: "bg-green-200 text-green-900 border border-green-300",
      Rechazada: "bg-red-100 text-red-800 border border-red-200",
      Cancelada: "bg-red-200 text-red-900 border border-red-300",
    };
    return (
      baseStyles[status] || "bg-gray-100 text-gray-800 border border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pendiente: <Clock className="h-4 w-4" />,
      Recibido: <FileText className="h-4 w-4" />,
      "En revisión": <Search className="h-4 w-4" />,
      "Documentación incompleta": <AlertTriangle className="h-4 w-4" />,
      "En proceso con el IRS": <RefreshCw className="h-4 w-4" />,
      Aprobada: <CheckCircle className="h-4 w-4" />,
      "Requiere verificación de la IRS": <ShieldAlert className="h-4 w-4" />,
      "Pago programado": <CalendarCheck className="h-4 w-4" />,
      "Deposito enviado": <ArrowDownToLine className="h-4 w-4" />,
      "Pago recibido": <DollarSign className="h-4 w-4" />,
      Completada: <CheckCircle2 className="h-4 w-4" />,
      Rechazada: <XCircle className="h-4 w-4" />,
      Cancelada: <XOctagon className="h-4 w-4" />,
    };
    return icons[status] || <HelpCircle className="h-4 w-4" />;
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
  >
    <div className="flex-shrink-0 p-3 bg-red-50 rounded-lg">
      <Icon className="h-5 w-5 text-red-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

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
        <ClipLoader size={50} color="#4B5563" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Solicitud no encontrada.</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
      {/* Header - Keeping original design as requested */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                className="mr-4 p-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white transition-colors duration-200"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                Detalles de Solicitud
              </h1>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-700 focus:ring-white transition-colors duration-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Request Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Número de Solicitud
              </p>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {request.confirmationNumber}
              </h2>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={Calendar}
              label="Fecha de Solicitud"
              value={formatDate(request.createdAt)}
            />
            <InfoCard
              icon={FileText}
              label="Tipo de Servicio"
              value={request.requestType}
            />
            <InfoCard
              icon={DollarSign}
              label="Precio"
              value={`$${request.price}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información Personal
              </h3>
            </div>

            <div className="space-y-6">
              <InfoCard
                icon={User}
                label="Nombre Completo"
                value={request.fullName}
              />
              <InfoCard
                icon={Mail}
                label="Correo Electrónico"
                value={request.email}
              />
              <InfoCard icon={Phone} label="Teléfono" value={request.phone} />
              <InfoCard
                icon={MapPin}
                label="Dirección"
                value={request.address}
              />
            </div>
          </div>

          {/* Sensitive Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información Sensible
              </h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Número de Seguro Social (SSN)
                </p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {request.ssn}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Número de Cuenta
                </p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {request.accountNumber}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Número de Ruta
                </p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {request.routingNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewRequestDetails;
