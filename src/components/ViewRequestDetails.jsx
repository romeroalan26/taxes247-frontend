import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ViewRequestDetails = () => {
  const { id } = useParams(); // Obtener el ID de la solicitud desde la URL
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/requests/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setRequest(data);
        } else {
          console.error("Error al obtener los detalles de la solicitud");
        }
      } catch (error) {
        console.error("Error al cargar detalles de la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-8">Cargando detalles...</p>;
  }

  if (!request) {
    return <p className="text-center mt-8">Solicitud no encontrada.</p>;
  }

  const maskData = (data) => {
    return data.replace(/.(?=.{4})/g, "*");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <div className="flex justify-end p-4">
        <button
          className="top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Atrás
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
            Detalles de la Solicitud
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-bold">Código de Confirmación:</p>
              <p className="text-gray-800">{request.confirmationNumber}</p>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Nombre Completo:</p>
              <p className="text-gray-800">{request.fullName}</p>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Correo Electrónico:</p>
              <p className="text-gray-800">{request.email}</p>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Teléfono:</p>
              <p className="text-gray-800">{request.phone}</p>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Dirección:</p>
              <p className="text-gray-800">{request.address}</p>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Estado:</p>
              <p className="text-gray-800">{request.status}</p>
            </div>

            {/* Mostrar datos sensibles */}
            <div>
              <p className="text-gray-700 font-bold">
                Número de Seguro Social (SSN):
              </p>
              <div className="flex items-center">
                <p className="text-gray-800">
                  {showSensitiveData ? request.ssn : maskData(request.ssn)}
                </p>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowSensitiveData((prev) => !prev)}
                >
                  {showSensitiveData ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Número de Cuenta:</p>
              <div className="flex items-center">
                <p className="text-gray-800">
                  {showSensitiveData
                    ? request.accountNumber
                    : maskData(request.accountNumber)}
                </p>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowSensitiveData((prev) => !prev)}
                >
                  {showSensitiveData ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-700 font-bold">Número de Ruta:</p>
              <div className="flex items-center">
                <p className="text-gray-800">
                  {showSensitiveData
                    ? request.routingNumber
                    : maskData(request.routingNumber)}
                </p>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowSensitiveData((prev) => !prev)}
                >
                  {showSensitiveData ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestDetails;
