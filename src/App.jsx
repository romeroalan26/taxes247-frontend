import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClipLoader } from "react-spinners";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateRequest from "./components/CreateRequest";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ViewRequestDetails from "./components/ViewRequestDetails";
import Pricing from "./components/Pricing";

// Componente mejorado para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#DC2626" />
      </div>
    );
  }

  if (!user) {
    // Guardar la ruta intentada para redireccionar después del login
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para manejar rutas públicas
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#DC2626" />
      </div>
    );
  }

  // Si el usuario está autenticado y trata de acceder a una ruta pública
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <PublicRoute>
                <Pricing />
              </PublicRoute>
            }
          />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-request"
            element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request/:id"
            element={
              <ProtectedRoute>
                <ViewRequestDetails />
              </ProtectedRoute>
            }
          />

          {/* Rutas especiales que no necesitan protección */}
          <Route path="/activate/:token" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Ruta para manejar URLs no encontradas */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página no encontrada</p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Volver atrás
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;