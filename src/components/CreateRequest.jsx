import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const statusSteps = [
  "Pendiente de pago",
  "Pago recibido",
  "En revisión",
  "Documentación incompleta",
  "En proceso con el IRS",
  "Aprobada",
  "Completada",
  "Rechazada",
];

const CreateRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ssn: "",
    birthDate: "",
    fullName: "",
    email: "",
    phone: "",
    accountNumber: "",
    bankName: "",
    accountType: "Savings",
    routingNumber: "",
    address: "",
    requestType: "Estándar",
    paymentMethod: "",
    w2Files: [],
  });

  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSensitiveFields, setShowSensitiveFields] = useState({
    ssn: false,
    accountNumber: false,
    routingNumber: false,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.uid) {
      setUserId(user.uid);
    } else {
      setError("No estás autenticado. Redirigiendo...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Solo puedes subir hasta 3 archivos.");
      return;
    }
    setFormData((prev) => ({ ...prev, w2Files: files }));
  };

  const toggleFieldVisibility = (field) => {
    setShowSensitiveFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const initialStatus =
      formData.paymentMethod === "Zelle"
        ? "Pendiente de pago"
        : "Pago recibido";

    try {
      const requestData = {
        ...formData,
        userId,
        status: initialStatus,
        w2Files: formData.w2Files.map((file) => file.name),
      };

      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmationNumber(data.confirmationNumber);
        setIsModalOpen(true);
      } else {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Error al guardar la solicitud."
        );
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Hubo un problema al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-end p-4">
        <button
          className="text-red-600 underline hover:text-red-800"
          onClick={() => navigate("/dashboard")}
        >
          Atrás
        </button>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Crear Solicitud
          </h2>
          <form onSubmit={handleSubmit}>
            {[
              {
                name: "ssn",
                label: "Número de Social Security",
                type: showSensitiveFields.ssn ? "text" : "password",
                placeholder: "123-45-6789",
              },
              {
                name: "birthDate",
                label: "Fecha de Nacimiento",
                type: "date",
              },
              {
                name: "fullName",
                label: "Nombre Completo",
                type: "text",
                placeholder: "Juan Pérez",
              },
              {
                name: "email",
                label: "Correo Electrónico",
                type: "email",
                placeholder: "correo@example.com",
              },
              {
                name: "phone",
                label: "Número de Teléfono",
                type: "tel",
                placeholder: "809-555-1234",
              },
              {
                name: "address",
                label: "Dirección en USA",
                type: "text",
                placeholder: "123 Main St, Anytown, CA",
              },
              {
                name: "bankName",
                label: "Nombre del Banco",
                type: "text",
                placeholder: "Bank of America",
              },
              {
                name: "accountNumber",
                label: "Número de Cuenta",
                type: showSensitiveFields.accountNumber ? "text" : "password",
                placeholder: "123456789",
              },
              {
                name: "routingNumber",
                label: "Número de Ruta",
                type: showSensitiveFields.routingNumber ? "text" : "password",
                placeholder: "987654321",
              },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400 pr-10"
                    placeholder={field.placeholder || ""}
                    required
                  />
                  {(field.name === "ssn" ||
                    field.name === "accountNumber" ||
                    field.name === "routingNumber") && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800"
                      onClick={() => toggleFieldVisibility(field.name)}
                    >
                      {showSensitiveFields[field.name] ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-gray-700">Tipo de Cuenta</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="Savings">Savings</option>
                <option value="Checkings">Checkings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Método de Pago</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="">Seleccionar</option>
                <option value="PayPal">PayPal</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Zelle">Zelle</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Subir Archivos W2</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Enviar Solicitud"
              )}
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-4">
              ¡Solicitud enviada!
            </h3>
            <p className="text-gray-700 text-center mb-4">
              Tu solicitud se ha enviado correctamente. Hemos enviado un correo
              electrónico con tu número de confirmación.
            </p>
            <p className="text-xl font-bold text-red-600 text-center mb-6">
              Número de Confirmación: {confirmationNumber}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRequest;
