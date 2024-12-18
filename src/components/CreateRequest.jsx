import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const CreateRequest = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [formData, setFormData] = useState({
    ssn: "",
    birthDate: "",
    fullName: "",
    email: "",
    phone: "",
    accountNumber: "",
    bankName: "",
    accountType: "Savings", // Default a Savings
    routingNumber: "",
    address: "",
    requestType: "Estándar", // Default a Estándar
    paymentMethod: "",
    w2Files: [],
  });

  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(""); // UID del usuario autenticado

  // Obtener el UID del usuario autenticado al cargar el componente
  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.uid) {
      setUserId(user.uid);
    } else {
      setError("No estás autenticado. Redirigiendo...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar subida de archivos W2
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Solo puedes subir hasta 3 archivos.");
      return;
    }
    setFormData((prev) => ({ ...prev, w2Files: files }));
  };

  // Verificar método de pago
  const handlePayment = () => {
    if (formData.paymentMethod === "Zelle") {
      setPaymentStatus("Pendiente de pago");
      return true; // Permitir envío
    } else {
      alert("Pago con PayPal o Tarjeta aún no implementado.");
      return false;
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handlePayment()) {
      setError("Completa el pago antes de enviar la solicitud.");
      return;
    }

    try {
      const requestData = {
        ...formData,
        userId, // UID del usuario autenticado
        status: paymentStatus || "Pago realizado",
        w2Files: formData.w2Files.map((file) => file.name), // Enviar solo nombres de archivos
      };

      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Solicitud enviada con éxito. Código: ${data.confirmationNumber}`
        );
        navigate("/dashboard");
      } else {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Error al guardar la solicitud."
        );
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Hubo un problema al enviar la solicitud. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Botón Atrás */}
      <div className="flex justify-end p-4">
        <button
          className="text-red-600 underline hover:text-red-800"
          onClick={() => navigate("/dashboard")}
        >
          Atrás
        </button>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Crear Solicitud
          </h2>
          <form onSubmit={handleSubmit}>
            {[
              { name: "ssn", label: "Número de Social Security", type: "text" },
              { name: "birthDate", label: "Fecha de Nacimiento", type: "date" },
              { name: "fullName", label: "Nombre Completo", type: "text" },
              { name: "email", label: "Correo Electrónico", type: "email" },
              { name: "phone", label: "Número de Teléfono", type: "tel" },
              { name: "address", label: "Dirección en USA", type: "text" },
              { name: "bankName", label: "Nombre del Banco", type: "text" },
              {
                name: "accountNumber",
                label: "Número de Cuenta",
                type: "text",
              },
              { name: "routingNumber", label: "Número de Ruta", type: "text" },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
            ))}

            {/* Tipo de Cuenta */}
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

            {/* Método de Pago */}
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

            {/* Subida de Archivos */}
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

            {/* Mensaje de Error */}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {/* Botón de Enviar */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
