// api.js
import { auth } from '../firebaseConfig';

const api = {
  async request(url, options = {}) {
    try {
      // Obtener el token actual si hay un usuario autenticado
      let headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Solo intentar obtener el token si hay un usuario autenticado
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        ...options,
        headers,
      });

      // Para GET requests que retornan 404, manejamos silenciosamente
      if (!response.ok && response.status === 404 && options.method === 'GET') {
        return {
          ok: false,
          status: 404,
          data: { message: "Recurso no encontrado" }
        };
      }

      const data = await response.json();

      if (!response.ok) {
        // Si hay error de autorización, emitir evento
        if (response.status === 401 || response.status === 403) {
          window.dispatchEvent(new CustomEvent('unauthorized', {
            detail: { message: data.message }
          }));
        }

        return {
          ok: false,
          status: response.status,
          data,
        };
      }

      return {
        ok: true,
        status: response.status,
        data,
      };
    } catch (error) {
      // Si el error es por token inválido o expirado
      if (error.code === 'auth/id-token-expired' || error.code === 'auth/invalid-id-token') {
        window.dispatchEvent(new CustomEvent('unauthorized', {
          detail: { message: "Sesión expirada. Por favor, vuelve a iniciar sesión." }
        }));
      }

      // Manejamos errores de red silenciosamente
      return {
        ok: false,
        status: 0,
        data: { message: "Error de conexión. Verifica tu conexión a internet." }
      };
    }
  },

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  },

  async post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Método auxiliar para verificar si hay un token válido
  async hasValidToken() {
    try {
      if (!auth.currentUser) return false;
      await auth.currentUser.getIdToken(true); // Forzar actualización del token
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default api;