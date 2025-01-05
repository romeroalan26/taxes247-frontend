import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateRequest from "./components/CreateRequest";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ViewRequestDetails from "./components/ViewRequestDetails";
import Pricing from "./components/Pricing"; // Importar componente de precios

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} /> {/* Nueva ruta */}

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-request"
            element={
              <PrivateRoute>
                <CreateRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="/request/:id"
            element={
              <PrivateRoute>
                <ViewRequestDetails />
              </PrivateRoute>
            }
          />

          {/* Rutas para activación y recuperación de contraseña */}
          <Route path="/activate/:token" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
