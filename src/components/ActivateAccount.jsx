import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const ActivateAccount = () => {
  const { token } = useParams(); // Obtener el token desde la URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // Estado para manejar errores

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/activate/${token}`
        );
        if (response.ok) {
          setMessage("¡Cuenta activada con éxito! Redirigiendo al login...");
          setTimeout(() => navigate("/"), 3000); // Redirige al login después de 3 segundos
        } else {
          const error = await response.json();
          setMessage(error.message || "Error al activar la cuenta.");
          setIsError(true); // Mostrar estado de error
        }
      } catch (error) {
        console.error("Error al activar la cuenta:", error);
        setMessage(
          "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."
        );
        setIsError(true); // Mostrar estado de error
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Activación de Cuenta
        </h2>
        <div className="flex flex-col items-center">
          {isError ? (
            <>
              <AiOutlineCloseCircle size={50} color="red" />
              <p className="text-red-600 mt-4">{message}</p>
            </>
          ) : (
            <>
              <ClipLoader color="#f00" size={50} />
              <p className="text-gray-700 mt-4">
                {message || "Procesando tu solicitud..."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
