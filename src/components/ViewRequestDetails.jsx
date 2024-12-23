import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

const ViewRequestDetails = () => {
  const { id } = useParams(); // Obtener el ID de la solicitud desde la URL
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleFields, setVisibleFields] = useState({});

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
          <ClipLoader size={50} color="#1E3A8A" />
          <p className="mt-4 text-blue-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return <p className="text-center mt-8">Solicitud no encontrada.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Atrás
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-red-600 mb-6">
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
                {visibleFields.ssn ? request.ssn : maskData(request.ssn)}
              </p>
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => toggleVisibility("ssn")}
              >
                {visibleFields.ssn ? (
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
                {visibleFields.accountNumber
                  ? request.accountNumber
                  : maskData(request.accountNumber)}
              </p>
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => toggleVisibility("accountNumber")}
              >
                {visibleFields.accountNumber ? (
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
                {visibleFields.routingNumber
                  ? request.routingNumber
                  : maskData(request.routingNumber)}
              </p>
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => toggleVisibility("routingNumber")}
              >
                {visibleFields.routingNumber ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={handlePrint}
        >
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default ViewRequestDetails;
