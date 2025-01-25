import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClipLoader } from "react-spinners";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import CreateRequest from "./components/CreateRequest";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ViewRequestDetails from "./components/ViewRequestDetails";
import Pricing from "./components/Pricing";
import RoutingNumber from "./components/RoutingNumber";
import FAQ from "./components/FAQ";

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
    const currentPath = window.location.pathname;
    if (currentPath !== "/") {
      localStorage.setItem("redirectAfterLogin", currentPath);
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para proteger rutas de admin
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#DC2626" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
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

  if (user) {
    // Si es admin, redirigir al dashboard de admin
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Si no es admin, redirigir al dashboard normal
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
          <Route path="/faq" element={<FAQ />} />

          {/* Rutas de usuario normal */}
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
          <Route
            path="/routing-number"
            element={
              <ProtectedRoute>
                <RoutingNumber />
              </ProtectedRoute>
            }
          />

          {/* Rutas de admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
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
