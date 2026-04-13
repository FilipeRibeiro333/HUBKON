import axios from "axios";

const api = axios.create({
  // Garante que o axios use a porta correta do seu backend
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@Hubkon:token");
    const apiKey = localStorage.getItem("@Hubkon:apiKey");

    // ✅ AJUSTE 1: Garante o prefixo 'Bearer ' (espaço é obrigatório)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ AJUSTE 2: Garante que a API Key da empresa seja enviada
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * INTERCEPTOR DE RESPOSTA
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ AJUSTE 3: Se o erro for 401, limpa TUDO para evitar loops de erro
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn("Sessão expirada ou Token Inválido. Redirecionando...");
      localStorage.clear(); 
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
