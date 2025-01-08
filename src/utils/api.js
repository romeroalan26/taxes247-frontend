// api.js
const api = {
  async request(url, options = {}) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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
  }
};

export default api;