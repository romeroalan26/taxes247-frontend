import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff, ArrowLeft, Printer, Shield } from "lucide-react";
import api from '../utils/api'; // Añadir esta importación
const ViewRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleFields, setVisibleFields] = useState({});
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
        // Usar el servicio API centralizado
        const { ok, data, status } = await api.get(`/requests/${id}`);

        if (ok) {
          setRequest(data);
          // Guardar en caché
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

  const maskData = (data) => {
    return data.replace(/.(?=.{4})/g, "*");
  };

  const toggleVisibility = (field) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#C92020" />
          
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-red-600">Detalles de Solicitud</h1>
            <button
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjeta Principal */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* Código de Confirmación y Estado */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b">
            <div>
              <p className="text-sm font-medium text-gray-500">Código de Confirmación</p>
              <p className="text-2xl font-bold text-gray-900">{request.confirmationNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <p className="text-lg font-semibold text-green-600">{request.status}</p>
            </div>
          </div>

          {/* Información Personal */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                <p className="mt-1 text-gray-900">{request.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                <p className="mt-1 text-gray-900">{request.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="mt-1 text-gray-900">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="mt-1 text-gray-900">{request.address}</p>
              </div>
            </div>

            {/* Información Sensible */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Información Sensible
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Número de Seguro Social (SSN)
                    </p>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => toggleVisibility("ssn")}
                    >
                      {visibleFields.ssn ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-gray-900">
                    {visibleFields.ssn ? request.ssn : maskData(request.ssn)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Número de Cuenta
                    </p>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => toggleVisibility("accountNumber")}
                    >
                      {visibleFields.accountNumber ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-gray-900">
                    {visibleFields.accountNumber
                      ? request.accountNumber
                      : maskData(request.accountNumber)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Número de Ruta
                    </p>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => toggleVisibility("routingNumber")}
                    >
                      {visibleFields.routingNumber ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-gray-900">
                    {visibleFields.routingNumber
                      ? request.routingNumber
                      : maskData(request.routingNumber)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Imprimir */}
          <button
            className="mt-8 w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handlePrint}
          >
            <Printer className="h-5 w-5 mr-2" />
            Imprimir Detalles
          </button>
        </div>
      </main>
    </div>
  );
};

export default ViewRequestDetails;