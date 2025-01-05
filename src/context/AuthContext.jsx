import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signOut } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intentar cargar el usuario desde el localStorage
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          // Hacer una solicitud al backend para obtener más información del usuario
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${authUser.uid}`
          );

          if (response.ok) {
            const userData = await response.json();
            const updatedUser = {
              uid: authUser.uid,
              email: authUser.email,
              name: userData.name || authUser.displayName,
            };

            setUser(updatedUser);
            localStorage.setItem("authUser", JSON.stringify(updatedUser));
          } else {
            console.error("Error al obtener los datos del usuario desde el backend.");
            // Usar datos básicos de Firebase si el backend falla
            const fallbackUser = {
              uid: authUser.uid,
              email: authUser.email,
              name: authUser.displayName,
            };

            setUser(fallbackUser);
            localStorage.setItem("authUser", JSON.stringify(fallbackUser));
          }
        } catch (error) {
          console.error("Error al conectar con el backend:", error);
          const fallbackUser = {
            uid: authUser.uid,
            email: authUser.email,
            name: authUser.displayName,
          };

          setUser(fallbackUser);
          localStorage.setItem("authUser", JSON.stringify(fallbackUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
  
      // Eliminar claves relacionadas con los requests
      localStorage.removeItem("requests"); // Elimina el listado de requests
  
      // Eliminar todos los requests específicos por ID
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("request_")) {
          localStorage.removeItem(key);
        }
      });
  
      localStorage.removeItem("authUser");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
