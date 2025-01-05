import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateRequest from "./components/CreateRequest";
import ActivateAccount from "./components/ActivateAccount";
import ForgotPassword from "./components/ForgotPassword";
import ViewRequestDetails from "./components/ViewRequestDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/activate/:token" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/request/:id" element={<ViewRequestDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
