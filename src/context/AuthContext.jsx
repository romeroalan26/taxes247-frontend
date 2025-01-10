import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signOut } from "../firebaseConfig";
import api from '../utils/api';
import { ClipLoader } from "react-spinners";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          // Verificar si ya tenemos los datos en localStorage
          const storedUser = localStorage.getItem("authUser");
          const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

          if (parsedStoredUser && parsedStoredUser.uid === authUser.uid) {
            setUser(parsedStoredUser);
          } else {
            // Si no hay datos en localStorage o el UID no coincide, obtener del backend
            const { ok, data, status } = await api.get(`/users/${authUser.uid}`);

            if (ok) {
              const updatedUser = {
                uid: authUser.uid,
                email: authUser.email,
                name: data.name || authUser.displayName || "Usuario",
                role: data.role || 'user' // Añadimos el rol aquí
              };
              setUser(updatedUser);
              localStorage.setItem("authUser", JSON.stringify(updatedUser));
            } else if (status === 404 && authUser.providerData[0]?.providerId === 'google.com') {
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
                  role: 'user'
                };
                setUser(newUser);
                localStorage.setItem("authUser", JSON.stringify(newUser));
              }
            }
          }
        } else {
          setUser(null);
          localStorage.removeItem("authUser");
        }
      } catch (error) {
        console.error("Error en auth state change:", error);
        setUser(null);
        localStorage.removeItem("authUser");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para actualizar el localStorage cuando cambia el usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      // Limpiar todo el localStorage relacionado
      const keysToRemove = [
        "authUser",
        "user",
        "requests",
        "authError",
        ...Object.keys(localStorage).filter(key => key.startsWith("request_"))
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#DC2626" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      logout,
      isAdmin: user?.role === 'admin'
    }}>
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