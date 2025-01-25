import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import {
  Eye,
  EyeOff,
  FileText,
  Calendar,
  DollarSign,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Printer,
} from "lucide-react";
import api from "../utils/api";

const SensitiveField = ({ label, value, icon: Icon }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="font-mono text-lg">
        {isVisible ? value : "•".repeat(value.length)}
      </p>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-red-200 transition-all shadow-sm hover:shadow-md">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-red-50 rounded-full">
        <Icon className="h-4 w-4 text-red-600" />
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <p className="text-gray-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    const styles = {
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
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle()}`}
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

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { ok, data } = await api.get(`/requests/${id}`);
        if (ok) {
          setRequest(data);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ClipLoader size={40} color="#DC2626" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 mb-4">Solicitud no encontrada</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm text-red-100">Solicitud</p>
                <h1 className="text-2xl font-bold">
                  #{request.confirmationNumber}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={request.status} />
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard
            icon={Calendar}
            label="Fecha de Solicitud"
            value={new Date(request.createdAt).toLocaleDateString()}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <User className="h-5 w-5 text-red-600" />
              Información Personal
            </h2>
            <div className="space-y-4">
              <InfoCard icon={User} label="Nombre" value={request.fullName} />
              <InfoCard icon={Mail} label="Email" value={request.email} />
              <InfoCard icon={Phone} label="Teléfono" value={request.phone} />
              <InfoCard
                icon={MapPin}
                label="Dirección"
                value={request.address}
              />
            </div>
          </section>

          {/* Sensitive Information */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <Shield className="h-5 w-5 text-red-600" />
              Información Sensible
            </h2>
            <div className="space-y-4">
              <SensitiveField
                label="Número de Seguro Social"
                value={request.ssn}
                icon={Shield}
              />
              <SensitiveField
                label="Número de Cuenta"
                value={request.accountNumber}
                icon={Shield}
              />
              <SensitiveField
                label="Número de Ruta"
                value={request.routingNumber}
                icon={Shield}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ViewRequestDetails;
