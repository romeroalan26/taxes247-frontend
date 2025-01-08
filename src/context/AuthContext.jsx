import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signOut } from "../firebaseConfig";
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          // Intentar obtener el usuario del backend
          const { ok, data, status } = await api.get(`/users/${authUser.uid}`);
  
          if (ok) {
            // Usuario existe, actualizar estado
            const updatedUser = {
              uid: authUser.uid,
              email: authUser.email,
              name: data.name || authUser.displayName || "Usuario",
            };
            setUser(updatedUser);
            localStorage.setItem("authUser", JSON.stringify(updatedUser));
          } else if (status === 404 && authUser.providerData[0]?.providerId === 'google.com') {
            // Usuario no existe y es login con Google, crearlo
            const { ok: createOk, data: createData } = await api.post('/users/login', {
              email: authUser.email,
              name: authUser.displayName || "Usuario",
              isGoogleLogin: true,
              uid: authUser.uid
            });
  
            if (createOk) {
              const newUser = {
                uid: authUser.uid,
                email: authUser.email,
                name: authUser.displayName || "Usuario",
              };
              setUser(newUser);
              localStorage.setItem("authUser", JSON.stringify(newUser));
            } else {
              // Si hay error al crear el usuario
              await auth.signOut();
              localStorage.removeItem("authUser");
              setUser(null);
            }
          } else {
            // Cualquier otro error
            await auth.signOut();
            localStorage.removeItem("authUser");
            setUser(null);
          }
        } catch (error) {
          console.error("Error en auth state change:", error);
        }
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      const keysToRemove = [
        "authUser",
        "user",
        "requests",
        "authError",
        ...Object.keys(localStorage).filter(key => key.startsWith("request_"))
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

    } catch (error) {
      // Si hay error al cerrar sesión, intentamos limpiar localStorage de todos modos
      try {
        const keysToRemove = [
          "authUser",
          "user",
          "requests",
          "authError",
          ...Object.keys(localStorage).filter(key => key.startsWith("request_"))
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        // Si falla la limpieza del localStorage, no hacer nada
      }
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

export default AuthProvider;